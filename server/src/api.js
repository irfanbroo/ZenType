const { Router } = require('express');
const { z } = require('zod');
const { supabase } = require('./supabase');

const router = Router();

// ─── Rate limiting (in-memory, per user) ─────────────────
const rateLimits = new Map(); // userId -> { endpoint: lastCallTimestamp }

function rateLimit(userId, endpoint, cooldownMs) {
  const key = `${userId}:${endpoint}`;
  const last = rateLimits.get(key) || 0;
  if (Date.now() - last < cooldownMs) return false;
  rateLimits.set(key, Date.now());
  return true;
}

// Clean up stale entries every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 600000;
  for (const [key, ts] of rateLimits) {
    if (ts < cutoff) rateLimits.delete(key);
  }
}, 600000);

// ─── Zod Schemas ─────────────────────────────────────────

const colorRe = /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.,\s/]+\)|hsla?\(\s*[\d.,\s/%]+\))$/;

const statsSchema = z.object({
  wpm: z.number().int().min(1).max(350),
  time: z.number().min(5).max(600),
  mode: z.enum(['standard', 'hagakure']).default('standard'),
  testToken: z.string().uuid(),
  charCount: z.number().int().min(1).max(10000),
  accuracy: z.number().min(0).max(100)
});

const themeSchema = z.object({
  mode: z.enum(['default', 'solid', 'gradient', 'custom']).default('default'),
  primary: z.string().regex(colorRe).max(50).optional(),
  accent: z.string().regex(colorRe).max(50).optional(),
  glowPrimary: z.string().regex(colorRe).max(50).optional(),
  color1: z.string().regex(colorRe).max(50).optional(),
  color2: z.string().regex(colorRe).max(50).optional(),
  angle: z.number().min(0).max(360).optional()
}).strict();

const profileSchema = z.object({
  username: z.string().trim().min(1).max(15).transform(s => s.replace(/<[^>]*>/g, '')),
  bio: z.string().trim().min(1).max(25).transform(s => s.replace(/<[^>]*>/g, ''))
});

// ─── Helper ──────────────────────────────────────────────

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// ─── Test session tokens (server-side) ───────────────────
// userId -> { token, createdAt }
const testSessions = new Map();

// Clean expired sessions every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 900000; // 15 min expiry
  for (const [key, session] of testSessions) {
    if (session.createdAt < cutoff) testSessions.delete(key);
  }
}, 300000);

// ─── POST /api/test/start ────────────────────────────────
// Frontend calls this when a test STARTS — returns a one-time token
router.post('/test/start', (req, res) => {
  const userId = req.user.id;

  // Rate limit: 1 test start per 3 seconds
  if (!rateLimit(userId, 'test-start', 3000)) {
    return sendError(res, 429, 'Too fast');
  }

  const token = require('crypto').randomUUID();
  testSessions.set(token, { userId, createdAt: Date.now() });

  res.json({ token });
});

// ─── POST /api/stats ─────────────────────────────────────
router.post('/stats', async (req, res) => {
  if (!supabase) return sendError(res, 503, 'Stats service unavailable');

  const userId = req.user.id;
  if (!rateLimit(userId, 'stats', 3000)) {
    return sendError(res, 429, 'Too fast — wait a few seconds');
  }

  // Validate input
  const parsed = statsSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, parsed.error.issues[0].message);
  }
  const { wpm, time, mode, testToken, charCount, accuracy } = parsed.data;

  // Cross-check: does the claimed WPM match the character count?
  // WPM = (chars / 5) / (time / 60) → chars = WPM * 5 * (time / 60)
  const expectedChars = wpm * 5 * (time / 60);
  // Allow 40% tolerance for accuracy/corrections
  if (charCount < expectedChars * 0.4) {
    return sendError(res, 400, 'Character count does not match claimed WPM');
  }

  // Validate test session token
  if (!testToken) {
    return sendError(res, 403, 'No test session — take a real test');
  }
  const session = testSessions.get(testToken);
  if (!session) {
    return sendError(res, 403, 'Invalid or expired test token');
  }
  if (session.userId !== userId) {
    return sendError(res, 403, 'Token does not belong to you');
  }
  testSessions.delete(testToken); // One-time use

  // Timing check: wall clock must roughly match claimed test time
  const wallClockSeconds = (Date.now() - session.createdAt) / 1000;
  if (wallClockSeconds < time * 0.5) {
    return sendError(res, 400, 'Test completed too fast — timing mismatch');
  }

  // Fetch current profile
  const { data: current, error: fetchErr } = await supabase
    .from('profiles')
    .select('tests_completed, best_wpm, best_hagakure_wpm, time_typed_seconds, activity_log, wpm_history')
    .eq('id', userId)
    .single();

  if (fetchErr || !current) {
    return sendError(res, 404, 'Profile not found');
  }

  // Compute new values
  const newTests = (current.tests_completed || 0) + 1;
  const newTime = (current.time_typed_seconds || 0) + Math.round(time);

  let newBestWpm = current.best_wpm || 0;
  let newBestHagakure = current.best_hagakure_wpm || 0;
  if (mode === 'hagakure') {
    newBestHagakure = Math.max(newBestHagakure, wpm);
  } else {
    newBestWpm = Math.max(newBestWpm, wpm);
  }

  const today = new Date().toISOString().split('T')[0];
  const activity = current.activity_log || {};
  activity[today] = (activity[today] || 0) + 1;

  let history = Array.isArray(current.wpm_history) ? current.wpm_history : [];
  history.push(wpm);
  if (history.length > 20) history = history.slice(history.length - 20);

  // Update
  const updates = {
    tests_completed: newTests,
    time_typed_seconds: newTime,
    best_wpm: newBestWpm,
    best_hagakure_wpm: newBestHagakure,
    activity_log: activity,
    wpm_history: history,
    last_updated: new Date().toISOString()
  };

  const { error: updateErr } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (updateErr) {
    console.error('[API] Stats update failed:', updateErr.message);
    return sendError(res, 500, 'Failed to save stats');
  }

  res.json({ ok: true, best_wpm: newBestWpm, best_hagakure_wpm: newBestHagakure });
});

// ─── POST /api/dojo-win ──────────────────────────────────
router.post('/dojo-win', async (req, res) => {
  if (!supabase) return sendError(res, 503, 'Stats service unavailable');

  const userId = req.user.id;
  if (!rateLimit(userId, 'dojo', 30000)) {
    return sendError(res, 429, 'Too fast — 1 dojo win per 30 seconds max');
  }

  const { data: current, error: fetchErr } = await supabase
    .from('profiles')
    .select('dojo_wins')
    .eq('id', userId)
    .single();

  if (fetchErr || !current) {
    return sendError(res, 404, 'Profile not found');
  }

  const newWins = (current.dojo_wins || 0) + 1;

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ dojo_wins: newWins })
    .eq('id', userId);

  if (updateErr) {
    console.error('[API] Dojo win update failed:', updateErr.message);
    return sendError(res, 500, 'Failed to save dojo win');
  }

  res.json({ ok: true, dojo_wins: newWins });
});

// ─── POST /api/theme ─────────────────────────────────────
router.post('/theme', async (req, res) => {
  if (!supabase) return sendError(res, 503, 'Stats service unavailable');

  const userId = req.user.id;
  if (!rateLimit(userId, 'theme', 5000)) {
    return sendError(res, 429, 'Too fast — wait a few seconds');
  }

  const parsed = themeSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, parsed.error.issues[0].message);
  }

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ profile_theme: parsed.data })
    .eq('id', userId);

  if (updateErr) {
    console.error('[API] Theme update failed:', updateErr.message);
    return sendError(res, 500, 'Failed to save theme');
  }

  res.json({ ok: true });
});

// ─── POST /api/profile ───────────────────────────────────
router.post('/profile', async (req, res) => {
  if (!supabase) return sendError(res, 503, 'Stats service unavailable');

  const userId = req.user.id;
  if (!rateLimit(userId, 'profile', 5000)) {
    return sendError(res, 429, 'Too fast — wait a few seconds');
  }

  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, parsed.error.issues[0].message);
  }

  const { username, bio } = parsed.data;

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ username, bio })
    .eq('id', userId);

  if (updateErr) {
    console.error('[API] Profile update failed:', updateErr.message);
    return sendError(res, 500, 'Failed to save profile');
  }

  res.json({ ok: true });
});

module.exports = router;
