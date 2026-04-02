const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { initDB } = require('./db');
const { registerRoomHandlers } = require('./rooms');
const { registerGameHandlers } = require('./game');

const app = express();
const server = http.createServer(app);

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

// Health check
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// Auth middleware — verify Supabase JWT or allow guests
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (token && SUPABASE_JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
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
