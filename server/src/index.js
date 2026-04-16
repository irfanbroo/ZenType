const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { initDB } = require('./db');
const { registerRoomHandlers } = require('./rooms');
const { registerGameHandlers } = require('./game');
const apiRouter = require('./api');

const app = express();
const server = http.createServer(app);

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// JWKS client for ECC key verification
const jwks = SUPABASE_URL ? jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true
}) : null;

// Verify a JWT — tries ECC first, falls back to legacy HS256 secret
async function verifyToken(token) {
  // Try ECC (new Supabase default)
  if (jwks) {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, (header, callback) => {
          jwks.getSigningKey(header.kid, (err, key) => {
            if (err) return callback(err);
            callback(null, key.getPublicKey());
          });
        }, { algorithms: ['ES256', 'RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
      return decoded;
    } catch (e) {
      // Fall through to legacy
    }
  }
  // Fall back to legacy HS256 secret
  if (SUPABASE_JWT_SECRET) {
    return jwt.verify(token, SUPABASE_JWT_SECRET);
  }
  throw new Error('No verification method available');
}

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  },
  pingInterval: 25000,
  pingTimeout: 20000
});

// ─── REST API Setup ──────────────────────────────────────
app.use(express.json({ limit: '16kb' }));

// CORS for REST endpoints
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// JWT auth middleware for /api/* routes
app.use('/api', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await verifyToken(token);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// Auth middleware — verify Supabase JWT or allow guests
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (token) {
    try {
      const decoded = await verifyToken(token);
      socket.user = { id: decoded.sub, email: decoded.email, guest: false };
      return next();
    } catch (e) {
      // Invalid token — fall through to guest
    }
  }

  // Guest user: assign random ID
  const guestId = 'guest-' + Math.random().toString(36).slice(2, 10);
  socket.user = { id: guestId, email: null, guest: true };
  next();
});

io.on('connection', (socket) => {
  const label = socket.user.guest ? `Guest ${socket.user.id}` : socket.user.email;
  console.log(`[WS] Connected: ${label}`);

  // Tell client their assigned ID (critical for guests)
  socket.emit('auth:id', { id: socket.user.id });

  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);
});

const PORT = process.env.PORT || 3001;

initDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[SERVER] ZenType multiplayer running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[SERVER] Failed to initialize DB:', err.message);
    console.log('[SERVER] Starting without DB (matches will not be saved)');
    server.listen(PORT, () => {
      console.log(`[SERVER] ZenType multiplayer running on :${PORT} (no DB)`);
    });
  });
