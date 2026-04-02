// ═══════════════════════════════════════════════════════════
// ZENTYPE MULTIPLAYER CLIENT
// ═══════════════════════════════════════════════════════════

import { io } from 'socket.io-client';

const WS_URL = location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : location.origin; // Uses Nginx proxy for /socket.io/

let socket = null;
let progressInterval = null;

const mpState = {
  room: null,
  isMultiplayer: false,
  localPlayerId: null,
  localUsername: null,
  localEmoji: '\u{1F680}',
  playerColors: new Map() // playerId -> color index
};

// Expose for script.js bridge
window.mpState = mpState;

// ═══════════════════════════════════════════════════════════
// CONNECTION
// ═══════════════════════════════════════════════════════════

async function connectSocket() {
  // Already connected
  if (socket?.connected) return socket;

  // Already connecting — wait for it instead of creating a new socket
  if (socket && !socket.disconnected) {
    return new Promise((resolve) => {
      socket.once('connect', () => resolve(socket));
      socket.once('connect_error', () => resolve(null));
    });
  }

  // Try to get Supabase session (optional — guests allowed)
  let token = null;
  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        token = session.access_token;
        mpState.localPlayerId = session.user.id;
        // user-email-display holds the username in auth.js
        mpState.localUsername = document.getElementById('user-email-display')?.textContent?.trim()
          || session.user.email?.split('@')[0] || 'Player';
        console.log('[MP] Logged in as:', mpState.localUsername, mpState.localPlayerId);
      }
    }
  } catch (e) {
    console.log('[MP] Auth check failed, continuing as guest');
  }

  // If not logged in, play as guest
  if (!mpState.localPlayerId) {
    mpState.localPlayerId = 'guest-' + Math.random().toString(36).slice(2, 10);
    mpState.localUsername = 'Guest';
  }

  socket = io(WS_URL, {
    auth: token ? { token } : {},
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('[MP] Connected');
    // Server sends us our assigned user ID (important for guests)
    socket.on('auth:id', ({ id }) => {
      mpState.localPlayerId = id;
      console.log('[MP] Assigned ID:', id);
    });
  });

  socket.on('connect_error', (err) => {
    console.error('[MP] Connection error:', err.message);
    if (err.message === 'auth_required' || err.message === 'auth_invalid') {
      mpToast('Auth failed. Please log in again.');
    } else {
      mpToast('Failed to connect to multiplayer server');
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[MP] Disconnected:', reason);
    if (mpState.isMultiplayer) {
      mpToast('Disconnected from race!');
    }
  });

  registerSocketListeners();
  return socket;
}

// ═══════════════════════════════════════════════════════════
// SOCKET EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function registerSocketListeners() {
  // --- Room events ---
  socket.on('room:player_joined', ({ player }) => {
    if (!mpState.room) return;
    mpState.room.players.push(player);
    assignPlayerColors();
    renderLobbyPlayers();
    updateStartButton();
    mpToast(`${player.username} joined`);
  });

  socket.on('room:player_left', ({ playerId }) => {
    if (!mpState.room) return;
    mpState.room.players = mpState.room.players.filter(p => p.id !== playerId);
    assignPlayerColors();
    renderLobbyPlayers();
    updateStartButton();
  });

  socket.on('room:host_changed', ({ hostId }) => {
    if (!mpState.room) return;
    mpState.room.hostId = hostId;
    renderLobbyPlayers();
    updateStartButton();
    if (hostId === mpState.localPlayerId) {
      mpToast('You are now the host');
    }
  });

  socket.on('room:player_updated', ({ player }) => {
    if (!mpState.room) return;
    const idx = mpState.room.players.findIndex(p => p.id === player.id);
    if (idx !== -1) mpState.room.players[idx] = { ...mpState.room.players[idx], ...player };
    renderLobbyPlayers();
  });

  socket.on('room:settings_updated', ({ timeLimit }) => {
    if (!mpState.room) return;
    mpState.room.timeLimit = timeLimit;
    document.querySelectorAll('.mp-time-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.time) === timeLimit);
    });
  });

  // --- Countdown ---
  socket.on('room:countdown', ({ seconds, words, timeLimit }) => {
    if (!mpState.room) return;
    mpState.room.words = words;
    mpState.room.timeLimit = timeLimit;
    mpState.room.status = 'countdown';

    // Close modal, show race UI
    document.getElementById('mp-modal').classList.add('hidden');
    showRaceBar();
    startCountdownUI(seconds);
  });

  socket.on('room:countdown_tick', ({ seconds }) => {
    updateCountdownUI(seconds);
  });

  // --- Game start ---
  socket.on('game:start', ({ startTime }) => {
    if (!mpState.room) return;
    mpState.room.status = 'racing';
    mpState.isMultiplayer = true;

    // Hide countdown
    document.getElementById('mp-countdown').classList.add('hidden');

    // Shake the game container for impact
    const gameUI = document.getElementById('game-ui');
    gameUI.classList.add('mp-screen-shake');
    setTimeout(() => gameUI.classList.remove('mp-screen-shake'), 300);

    // Hide UI clutter during race
    document.getElementById('time-modes').style.display = 'none';
    document.getElementById('top-nav-buttons').style.display = 'none';
    document.getElementById('app-header').style.display = 'none';
    hideChat();

    // Start the typing engine with server words
    if (window.startMultiplayerRace) {
      window.startMultiplayerRace(mpState.room.words, mpState.room.timeLimit);
    }

    // Start sending progress
    startProgressLoop();
    // Start updating emoji cursors on text
    startCursorLoop();
  });

  // --- Opponent progress ---
  socket.on('game:player_progress', ({ playerId, wordIndex, wpm, accuracy, percent }) => {
    if (playerId === mpState.localPlayerId) return;

    updateRaceBarProgress(playerId, wpm, percent);
    updateWordCursor(playerId, wordIndex);
  });

  // --- Player finished ---
  socket.on('game:player_finished', ({ playerId, rank, netWpm, accuracy }) => {
    markRaceBarFinished(playerId, netWpm);
    if (playerId === mpState.localPlayerId) {
      mpToast(`You finished #${rank}!`);
    }
  });

  // --- Race results ---
  socket.on('game:race_results', ({ standings }) => {
    if (!mpState.room) return;
    mpState.room.status = 'finished';
    mpState.isMultiplayer = false;
    clearInterval(progressInterval);
    clearInterval(cursorInterval);
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    removeWordCursors();
    hideKing();
    showRaceResults(standings);
  });

  // --- Player disconnected ---
  socket.on('game:player_disconnected', ({ playerId }) => {
    markRaceBarDisconnected(playerId);
    removeWordCursor(playerId);
  });

  // --- Chat ---
  socket.on('chat:message', (msg) => {
    appendChatMessage(msg);
  });

  // --- Back to lobby ---
  socket.on('room:back_to_lobby', ({ room }) => {
    mpState.room = room;
    mpState.isMultiplayer = false;
    assignPlayerColors();

    if (resultsAnimId) { cancelAnimationFrame(resultsAnimId); resultsAnimId = null; }
    document.getElementById('mp-results-overlay').classList.add('hidden');
    document.getElementById('mp-race-bar').classList.add('hidden');
    hideKing();
    document.getElementById('time-modes').style.display = '';
    document.getElementById('top-nav-buttons').style.display = '';
    document.getElementById('app-header').style.display = '';

    document.getElementById('mp-modal').classList.remove('hidden');
    document.getElementById('mp-menu').classList.add('hidden');
    document.getElementById('mp-lobby').classList.remove('hidden');
    renderLobbyPlayers();
    updateStartButton();
  });
}

// ═══════════════════════════════════════════════════════════
// ROOM ACTIONS
// ═══════════════════════════════════════════════════════════

async function createRoom() {
  const s = await connectSocket();
  if (!s) return;

  clearChat();
  raceRankMap.clear();
  raceWinnerId = null;

  // Read name from input if available
  const nameVal = document.getElementById('mp-name-input')?.value?.trim();
  if (nameVal) mpState.localUsername = nameVal;

  const createBtn = document.getElementById('mp-create-btn');
  if (createBtn) {
    createBtn.disabled = true;
    createBtn.innerHTML = '<span class="mp-btn-content"><i class="ri-loader-4-line mp-spin"></i> Creating...</span>';
  }

  s.emit('room:create', {
    timeLimit: 30,
    username: mpState.localUsername,
    emoji: mpState.localEmoji
  }, (response) => {
    if (createBtn) {
      createBtn.disabled = false;
      createBtn.innerHTML = '<span class="mp-btn-content"><i class="ri-sword-line"></i> Create Room</span><span class="mp-btn-arrow"><i class="ri-arrow-right-line"></i></span>';
    }
    if (response.error) {
      mpToast(`Error: ${response.error}`);
      return;
    }
    mpState.room = { ...response.room, words: [] };
    syncLocalEmoji();
    assignPlayerColors();
    showLobbyView();
  });
}

async function joinRoom(code) {
  if (!code || code.length < 4) {
    mpToast('Enter a valid room code');
    return;
  }

  const s = await connectSocket();
  if (!s) return;

  // Read name from input if available
  const nameVal = document.getElementById('mp-name-input')?.value?.trim();
  if (nameVal) mpState.localUsername = nameVal;

  s.emit('room:join', {
    code: code.toUpperCase(),
    username: mpState.localUsername,
    emoji: mpState.localEmoji
  }, (response) => {
    if (response.error) {
      const msgs = {
        room_not_found: 'Room not found. Check the code.',
        race_in_progress: 'Race already started.',
        room_full: 'Room is full (5/5).',
        already_in_room: 'You\'re already in a room.'
      };
      mpToast(msgs[response.error] || response.error);
      return;
    }
    mpState.room = { ...response.room, words: [] };
    syncLocalEmoji();
    assignPlayerColors();
    showLobbyView();
  });
}

function leaveRoom() {
  if (socket) socket.emit('room:leave');
  mpState.room = null;
  mpState.isMultiplayer = false;
  hideChat();
  clearChat();
  clearInterval(progressInterval);
  clearInterval(cursorInterval);
  if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
  removeWordCursors();

  document.getElementById('mp-race-bar').classList.add('hidden');
  document.getElementById('mp-results-overlay').classList.add('hidden');
  document.getElementById('mp-countdown').classList.add('hidden');
  hideKing();
  document.getElementById('time-modes').style.display = '';
  document.getElementById('top-nav-buttons').style.display = '';
  document.getElementById('app-header').style.display = '';

  showMenuView();
}

function startRace() {
  if (!socket || !mpState.room) return;
  socket.emit('room:start');
}

// ═══════════════════════════════════════════════════════════
// PROGRESS SYNC
// ═══════════════════════════════════════════════════════════

function startProgressLoop() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!mpState.isMultiplayer || !socket?.connected) {
      clearInterval(progressInterval);
      return;
    }

    const s = window.getTypingState?.();
    if (!s || !s.isActive) return;

    socket.emit('game:progress', {
      wordIndex: s.wordIndex,
      correctChars: s.correctChars,
      totalCharsTyped: s.totalCharsTyped,
      rawKeystrokes: s.rawKeystrokes,
      correctKeystrokes: s.correctKeystrokes,
      wpm: s.wpm,
      accuracy: s.accuracy,
      timestamp: Date.now()
    });

    // Update own race bar
    if (mpState.room) {
      const expectedWords = Math.max(1, Math.floor((mpState.room.timeLimit || 30) * 1.5));
      const percent = Math.min(100, Math.round((s.wordIndex / expectedWords) * 100));
      updateRaceBarProgress(mpState.localPlayerId, s.wpm, percent);
    }
  }, 200);
}

// Called from script.js endGame wrapper
window.onMultiplayerGameEnd = function(results) {
  clearInterval(progressInterval);
  if (!socket?.connected) return;
  socket.emit('game:finished', results);
};

// ═══════════════════════════════════════════════════════════
// EMOJI CURSORS ON TYPING TEXT
// ═══════════════════════════════════════════════════════════

let cursorInterval = null;
const cursorElements = new Map(); // playerId -> DOM element

function startCursorLoop() {
  clearInterval(cursorInterval);
  removeWordCursors();

  // Create cursor elements for opponents
  if (!mpState.room) return;
  const container = document.getElementById('words-container');
  if (!container) return;

  for (const player of mpState.room.players) {
    if (player.id === mpState.localPlayerId) continue;

    const cursor = document.createElement('div');
    cursor.className = 'mp-word-cursor';
    cursor.dataset.playerId = player.id;
    const colorIdx = mpState.playerColors.get(player.id) ?? 0;
    cursor.dataset.color = colorIdx;
    cursor.textContent = player.emoji;

    container.appendChild(cursor);
    cursorElements.set(player.id, { el: cursor, wordIndex: 0 });
  }

  // Update positions periodically
  cursorInterval = setInterval(updateCursorPositions, 300);
}

function updateWordCursor(playerId, wordIndex) {
  const data = cursorElements.get(playerId);
  if (data) {
    data.wordIndex = wordIndex;
    data.lastUpdate = Date.now();
  }
}

function updateCursorPositions() {
  const container = document.getElementById('words-container');
  if (!container) return;

  for (const [playerId, data] of cursorElements) {
    const wordEl = document.getElementById(`word-${data.wordIndex}`);
    if (!wordEl) {
      data.el.style.display = 'none';
      continue;
    }

    // Hide if player hasn't moved in 2 seconds (looks afk otherwise)
    const idle = !data.lastUpdate || (Date.now() - data.lastUpdate) > 2000;
    data.el.style.visibility = idle ? 'hidden' : 'visible';
    data.el.style.display = '';

    // Position inline: at the start of the word they're on, same line, scroll-aware
    const containerRect = container.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();

    const left = wordRect.left - containerRect.left + container.scrollLeft - 16;
    const top = wordRect.top - containerRect.top + container.scrollTop + (wordRect.height - 16) / 2;

    data.el.style.left = `${left}px`;
    data.el.style.top = `${top}px`;
  }
}

function removeWordCursor(playerId) {
  const data = cursorElements.get(playerId);
  if (data) {
    data.el.remove();
    cursorElements.delete(playerId);
  }
}

function removeWordCursors() {
  for (const [, data] of cursorElements) {
    data.el.remove();
  }
  cursorElements.clear();
}

// ═══════════════════════════════════════════════════════════
// UI — VIEWS
// ═══════════════════════════════════════════════════════════

function showMenuView() {
  document.getElementById('mp-modal').classList.remove('hidden');
  document.getElementById('mp-menu').classList.remove('hidden');
  document.getElementById('mp-lobby').classList.add('hidden');
}

function showLobbyView() {
  document.getElementById('mp-menu').classList.add('hidden');
  document.getElementById('mp-lobby').classList.remove('hidden');
  showChat();

  document.getElementById('mp-room-code').textContent = mpState.room.code;

  // Set the name input to current username
  const nameInput = document.getElementById('mp-name-input');
  if (nameInput) nameInput.value = mpState.localUsername || '';

  renderLobbyPlayers();
  updateStartButton();

  // Set petals as default for multiplayer, then sync picker
  if (window.userConfig && !mpState._particleSet) {
    window.userConfig.particleShape = 'petals';
    window.userConfig.particle = true;
    mpState._particleSet = true;
  }
  const currentShape = window.userConfig?.particleShape || 'petals';
  document.querySelectorAll('.mp-particle-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.particle === currentShape);
  });

  // Time selector — only host can change
  const timeSelector = document.getElementById('mp-time-selector');
  const isHost = mpState.room.hostId === mpState.localPlayerId;
  timeSelector.style.opacity = isHost ? '1' : '0.5';
  timeSelector.style.pointerEvents = isHost ? 'auto' : 'none';

  document.querySelectorAll('.mp-time-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.time) === mpState.room.timeLimit);
  });
}

function renderLobbyPlayers() {
  const list = document.getElementById('mp-players-list');
  if (!mpState.room) return;

  list.innerHTML = mpState.room.players.map(p => `
    <div class="mp-player-card">
      <span class="mp-player-emoji">${p.emoji}</span>
      <span class="mp-player-name">${p.username}</span>
      ${p.id === mpState.room.hostId ? '<span class="mp-player-host">HOST</span>' : ''}
      ${p.id === mpState.localPlayerId ? '<span class="mp-player-you">YOU</span>' : ''}
    </div>
  `).join('');

  document.getElementById('mp-player-count').textContent = `${mpState.room.players.length}/5 players`;
}

function updateStartButton() {
  const btn = document.getElementById('mp-start-btn');
  const isHost = mpState.room?.hostId === mpState.localPlayerId;
  const enough = (mpState.room?.players.length || 0) >= 2;

  btn.style.display = isHost ? '' : 'none';
  btn.disabled = !enough;
  btn.innerHTML = enough
    ? '<span class="mp-fight-kanji">戦</span><span class="mp-fight-text">FIGHT</span><span class="mp-fight-splash mp-splash-1"></span><span class="mp-fight-splash mp-splash-2"></span><span class="mp-fight-splash mp-splash-3"></span>'
    : '<span class="mp-fight-text" style="letter-spacing:0.1em;opacity:0.5;">Need 2+ warriors</span>';
}

// ═══════════════════════════════════════════════════════════
// UI — RACE BAR
// ═══════════════════════════════════════════════════════════

// Race bar state per player
const waveState = new Map();
let raceCanvas = null;
let raceCtx = null;
let raceAnimId = null;
let lowPerfMode = false;

const PLAYER_COLORS = [
  { r: 0, g: 212, b: 255 },   // cyan
  { r: 255, g: 0, b: 200 },   // magenta
  { r: 255, g: 215, b: 0 },   // gold
  { r: 0, g: 255, b: 136 },   // green
  { r: 180, g: 100, b: 255 }  // purple
];

const CANVAS_W = 860;
const CANVAS_H_PER_PLAYER = 44;
const CANVAS_PAD = 14;
const TRACK_LEFT = 80;
const TRACK_RIGHT = 50;
const BAR_H = 28;
const BAR_RADIUS = 14;

function showRaceBar() {
  const bar = document.getElementById('mp-race-bar');
  if (!mpState.room) return;

  waveState.clear();

  // Init wave state for each player
  mpState.room.players.forEach(p => {
    waveState.set(p.id, { percent: 0, wpm: 0, smoothPercent: 0 });
  });

  // Setup canvas
  raceCanvas = document.getElementById('mp-race-canvas');
  const dpr = window.devicePixelRatio || 1;
  const numPlayers = mpState.room.players.length;
  const h = CANVAS_PAD * 2 + numPlayers * CANVAS_H_PER_PLAYER;

  raceCanvas.width = CANVAS_W * dpr;
  raceCanvas.height = h * dpr;
  raceCanvas.style.width = CANVAS_W + 'px';
  raceCanvas.style.height = h + 'px';

  raceCtx = raceCanvas.getContext('2d');
  raceCtx.scale(dpr, dpr);

  bar.classList.remove('hidden');
  startRaceCanvasLoop();

  // Show pixel king below typing panel
  showKing();
}

function startRaceCanvasLoop() {
  if (raceAnimId) cancelAnimationFrame(raceAnimId);

  // Particle trail system for leader
  const particles = [];
  let lastDrawTime = 0;

  function draw(time) {
    if (!mpState.room || !raceCtx) {
      raceAnimId = null;
      return;
    }
    raceAnimId = requestAnimationFrame(draw);

    // 30fps cap in low perf mode
    if (lowPerfMode && time - lastDrawTime < 33) return;
    lastDrawTime = time;

    const ctx = raceCtx;
    const players = mpState.room.players;
    const numP = players.length;
    const totalH = CANVAS_PAD * 2 + numP * CANVAS_H_PER_PLAYER;

    ctx.clearRect(0, 0, CANVAS_W, totalH);

    // ── Background: frosted glass ──
    ctx.save();
    roundRect(ctx, 0, 0, CANVAS_W, totalH, 18);
    ctx.fillStyle = 'rgba(8, 8, 16, 0.75)';
    ctx.fill();
    // Top highlight edge
    ctx.save();
    roundRect(ctx, 0, 0, CANVAS_W, totalH, 18);
    ctx.clip();
    const topEdge = ctx.createLinearGradient(0, 0, 0, 3);
    topEdge.addColorStop(0, 'rgba(255,255,255,0.06)');
    topEdge.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = topEdge;
    ctx.fillRect(0, 0, CANVAS_W, 3);
    ctx.restore();
    ctx.restore();

    // Find leader + sort by WPM for rankings
    let maxWpm = 0;
    let leaderId = null;
    const rankings = [];
    for (const [pid, ws] of waveState) {
      rankings.push({ pid, wpm: ws.wpm });
      if (ws.wpm > maxWpm) { maxWpm = ws.wpm; leaderId = pid; }
    }
    rankings.sort((a, b) => b.wpm - a.wpm);

    // Draw each player lane
    players.forEach((p, i) => {
      const ws = waveState.get(p.id);
      if (!ws) return;

      const colorIdx = mpState.playerColors.get(p.id) ?? 0;
      const c = PLAYER_COLORS[colorIdx] || PLAYER_COLORS[0];
      const isLeader = p.id === leaderId && maxWpm > 0;
      const isYou = p.id === mpState.localPlayerId;
      const rank = rankings.findIndex(r => r.pid === p.id) + 1;

      // Smooth interpolation (snappy)
      const diff = ws.percent - ws.smoothPercent;
      ws.smoothPercent += diff * (Math.abs(diff) > 8 ? 0.6 : 0.2);

      const y = CANVAS_PAD + i * CANVAS_H_PER_PLAYER;
      const trackX = TRACK_LEFT;
      const trackW = CANVAS_W - TRACK_LEFT - TRACK_RIGHT;
      const barY = y + (CANVAS_H_PER_PLAYER - BAR_H) / 2;
      const fillW = Math.max(0, (ws.smoothPercent / 100) * trackW);

      const fc = isLeader ? { r: 255, g: 215, b: 0 } : c;

      // ── Track bg ──
      ctx.save();
      roundRect(ctx, trackX, barY, trackW, BAR_H, BAR_RADIUS);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.fill();
      // Inner shadow
      const innerShadow = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H);
      innerShadow.addColorStop(0, 'rgba(0,0,0,0.15)');
      innerShadow.addColorStop(0.3, 'rgba(0,0,0,0)');
      innerShadow.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = innerShadow;
      ctx.fill();
      ctx.restore();

      // ── Progress fill ──
      if (fillW > 1) {
        ctx.save();
        roundRect(ctx, trackX, barY, trackW, BAR_H, BAR_RADIUS);
        ctx.clip();

        // Main fill — glass-like with highlight
        const mainGrad = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H);
        mainGrad.addColorStop(0, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.35)`);
        mainGrad.addColorStop(0.4, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.2)`);
        mainGrad.addColorStop(1, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.3)`);
        ctx.fillStyle = mainGrad;
        roundRect(ctx, trackX, barY, fillW, BAR_H, BAR_RADIUS);
        ctx.fill();

        // Top highlight on the fill (glass reflection)
        const hlGrad = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H * 0.4);
        hlGrad.addColorStop(0, `rgba(255, 255, 255, 0.15)`);
        hlGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = hlGrad;
        ctx.fillRect(trackX, barY, fillW, BAR_H * 0.4);

        // Bright leading edge line
        ctx.beginPath();
        ctx.moveTo(trackX + fillW, barY + 3);
        ctx.lineTo(trackX + fillW, barY + BAR_H - 3);
        ctx.strokeStyle = `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.8)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated energy pulse along the fill
        const pulseX = trackX + ((time * 0.15) % (fillW + 60)) - 30;
        if (pulseX < trackX + fillW) {
          const pulseGrad = ctx.createLinearGradient(pulseX, 0, pulseX + 60, 0);
          pulseGrad.addColorStop(0, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0)`);
          pulseGrad.addColorStop(0.5, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.12)`);
          pulseGrad.addColorStop(1, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0)`);
          ctx.fillStyle = pulseGrad;
          ctx.fillRect(pulseX, barY, 60, BAR_H);
        }

        ctx.restore();

        // ── Leading edge glow (outside clip) ──
        ctx.save();
        const glowR = 20;
        const gx = trackX + fillW;
        const gy = barY + BAR_H / 2;
        const edgeGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
        edgeGlow.addColorStop(0, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0.4)`);
        edgeGlow.addColorStop(1, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0)`);
        ctx.fillStyle = edgeGlow;
        ctx.fillRect(gx - glowR, gy - glowR, glowR * 2, glowR * 2);
        ctx.restore();

        // ── Leader: spawn trail particles ──
        if (isLeader && ws.smoothPercent > 1) {
          if (Math.random() < 0.4) {
            particles.push({
              x: gx + (Math.random() - 0.5) * 4,
              y: gy + (Math.random() - 0.5) * BAR_H * 0.6,
              vx: -0.5 - Math.random() * 1.5,
              vy: (Math.random() - 0.5) * 0.8,
              life: 1,
              decay: 0.02 + Math.random() * 0.03,
              size: 1 + Math.random() * 2
            });
          }
        }
      }

      // ── Emoji ──
      const emojiX = trackX + Math.max(12, fillW);
      const emojiY = barY + BAR_H / 2;
      ctx.save();
      ctx.font = '15px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isLeader) {
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 14;
      }
      ctx.fillText(isLeader ? '\u{1F451}' : p.emoji, emojiX, emojiY);
      ctx.restore();

      // ── Rank number (left, before name) ──
      ctx.save();
      ctx.font = `800 10px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLeader ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.15)';
      ctx.fillText(`${rank}`, 18, barY + BAR_H / 2);
      ctx.restore();

      // ── Name ──
      ctx.save();
      ctx.font = `${isYou ? '700' : '500'} 9.5px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLeader ? 'rgba(255,215,0,0.6)' : isYou ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)';
      ctx.fillText(p.username.toUpperCase().slice(0, 8), TRACK_LEFT - 10, barY + BAR_H / 2);
      ctx.restore();

      // ── WPM ──
      ctx.save();
      ctx.font = `800 12px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLeader ? 'rgb(255,215,0)' : `rgb(${c.r},${c.g},${c.b})`;
      if (isLeader) {
        ctx.shadowColor = 'rgba(255,215,0,0.4)';
        ctx.shadowBlur = 6;
      }
      ctx.fillText(ws.wpm, CANVAS_W - TRACK_RIGHT + 10, barY + BAR_H / 2);
      ctx.restore();
    });

    // ── Draw & update particles ──
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = pt.life * 0.7;
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = 'rgba(255,215,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Keep particles from piling up
    if (particles.length > 80) particles.splice(0, particles.length - 80);
  }

  raceAnimId = requestAnimationFrame(draw);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function updateRaceBarProgress(playerId, wpm, percent) {
  const ws = waveState.get(playerId);
  if (ws) {
    ws.percent = percent;
    ws.wpm = wpm;
  }

  // Update leader highlight
  updateLeader();
}

function updateLeader() {
  let maxWpm = 0;
  let leaderId = null;

  for (const [pid, ws] of waveState) {
    if (ws.wpm > maxWpm) {
      maxWpm = ws.wpm;
      leaderId = pid;
    }
  }

  // Update leader class on emoji cursors + swap leader emoji to crown
  for (const [pid, data] of cursorElements) {
    const isLeader = pid === leaderId && maxWpm > 0;
    data.el.classList.toggle('is-leader', isLeader);

    if (!data.originalEmoji) data.originalEmoji = data.el.textContent;
    data.el.textContent = isLeader ? '\u{1F451}' : data.originalEmoji;
  }

  // Update pixel king state
  const localIsLeader = leaderId === mpState.localPlayerId && maxWpm > 0;
  updateKingState(localIsLeader);
}

function markRaceBarFinished(playerId, wpm) {
  const ws = waveState.get(playerId);
  if (ws) {
    ws.percent = 100;
    ws.wpm = wpm;
  }
}

function markRaceBarDisconnected(playerId) {
  // Canvas handles this via waveState — just stop updating
}

// ═══════════════════════════════════════════════════════════
// FLOATING CROWN (below typing panel during race)
// ═══════════════════════════════════════════════════════════

let crownIsLeader = false;
let crownCanvas = null;
let crownCtx = null;
let crownAnimId = null;

function showCrown() {
  const area = document.getElementById('mp-crown-area');
  if (!area) return;
  crownCanvas = document.getElementById('mp-crown-canvas');
  crownCtx = crownCanvas.getContext('2d');
  crownIsLeader = false;
  // Start hidden — crown only appears when you take 1st
  area.classList.add('hidden');
}

function hideCrown() {
  const area = document.getElementById('mp-crown-area');
  if (area) area.classList.add('hidden');
  if (crownAnimId) { cancelAnimationFrame(crownAnimId); crownAnimId = null; }
}

function updateCrownState(isLeader) {
  crownIsLeader = isLeader;
  const area = document.getElementById('mp-crown-area');
  if (!area) return;
  // Only show crown when leading
  if (isLeader) {
    area.classList.remove('hidden');
    if (!crownAnimId) startCrownLoop();
  } else {
    area.classList.add('hidden');
  }
}

function startCrownLoop() {
  if (crownAnimId) cancelAnimationFrame(crownAnimId);

  const sparkleStars = [];  // star twinkle effects
  const sparkleGlints = []; // glint flash effects

  function drawStarShape(ctx, x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw(time) {
    if (!crownCtx) { crownAnimId = null; return; }
    crownAnimId = requestAnimationFrame(draw);

    const W = 200, H = 120;
    const ctx = crownCtx;
    ctx.clearRect(0, 0, W, H);

    const float = Math.sin(time * 0.002) * 6;
    const cx = W / 2, cy = H / 2 + float;

    // Radial glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
    glow.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
    glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Crown dimensions
    const cw = 50, ch = 30;
    const left = cx - cw / 2, top = cy - ch / 2;

    // Crown body
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(left, top + 10, cw, ch - 10);

    // 5 peaks
    [0, 0.25, 0.5, 0.75, 1].forEach((p, i) => {
      const px = left + p * cw;
      const peakH = (i === 2) ? ch + 5 : ch - 5;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(px - 4, top + 10);
      ctx.lineTo(px, top + 10 - peakH * 0.5);
      ctx.lineTo(px + 4, top + 10);
      ctx.fill();
    });

    // Dark band
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(left, top + ch - 6, cw, 6);

    // 3 gems
    [0.2, 0.5, 0.8].forEach(p => {
      ctx.beginPath();
      ctx.arc(left + p * cw, top + ch - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1a1a';
      ctx.fill();
    });

    // Outline
    ctx.strokeStyle = 'rgba(255,215,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top + 10, cw, ch - 10);

    // Shimmer sweep
    const shimX = left + ((time * 0.05) % (cw + 30)) - 15;
    const shimGrad = ctx.createLinearGradient(shimX, 0, shimX + 30, 0);
    shimGrad.addColorStop(0, 'rgba(255,255,255,0)');
    shimGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    shimGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimGrad;
    ctx.fillRect(left, top + 10, cw, ch - 10);

    // ── Star Twinkle: ✦ shapes pop on crown ──
    if (Math.random() < 0.012) {
      sparkleStars.push({
        x: left + Math.random() * cw,
        y: top + 5 + Math.random() * ch,
        size: 3 + Math.random() * 5,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        rot: Math.random() * Math.PI,
      });
    }
    for (let i = sparkleStars.length - 1; i >= 0; i--) {
      const s = sparkleStars[i];
      s.life -= s.decay;
      s.rot += 0.02;
      if (s.life <= 0) { sparkleStars.splice(i, 1); continue; }
      const a = s.life < 0.3 ? s.life / 0.3 : (s.life > 0.7 ? (1 - s.life) / 0.3 : 1);
      ctx.save();
      ctx.translate(s.x, s.y + float);
      ctx.rotate(s.rot);
      drawStarShape(ctx, 0, 0, s.size * a, a);
      ctx.restore();
    }

    // ── Glint Flash: bright dot + cross flare on gems/peaks ──
    if (Math.random() < 0.008) {
      const spots = [
        { x: left + cw * 0.2, y: top + ch - 3 },
        { x: left + cw * 0.5, y: top + ch - 3 },
        { x: left + cw * 0.8, y: top + ch - 3 },
        { x: left + cw * 0.5, y: top - 8 },
        { x: left, y: top + 5 },
        { x: left + cw, y: top + 5 },
      ];
      const spot = spots[Math.floor(Math.random() * spots.length)];
      sparkleGlints.push({ x: spot.x, y: spot.y, life: 1, maxR: 8 + Math.random() * 6 });
    }
    for (let i = sparkleGlints.length - 1; i >= 0; i--) {
      const g = sparkleGlints[i];
      g.life -= 0.025;
      if (g.life <= 0) { sparkleGlints.splice(i, 1); continue; }
      const a = g.life > 0.5 ? 1 : g.life * 2;
      const r = g.maxR * (1 - g.life) * 0.5 + 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(g.x, g.y + float, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.7})`;
      ctx.lineWidth = 1;
      const fl = r * 1.5 * a;
      ctx.beginPath();
      ctx.moveTo(g.x - fl, g.y + float);
      ctx.lineTo(g.x + fl, g.y + float);
      ctx.moveTo(g.x, g.y + float - fl);
      ctx.lineTo(g.x, g.y + float + fl);
      ctx.stroke();
      ctx.restore();
    }
  }

  crownAnimId = requestAnimationFrame(draw);
}

// Aliases so existing hooks still work
const showKing = showCrown;
const hideKing = hideCrown;
function updateKingState(isLeader) { updateCrownState(isLeader); }


// ═══════════════════════════════════════════════════════════
// UI — COUNTDOWN
// ═══════════════════════════════════════════════════════════

function startCountdownUI(seconds) {
  const overlay = document.getElementById('mp-countdown');
  const numEl = document.getElementById('mp-countdown-number');

  overlay.classList.remove('hidden');
  overlay.className = `count-${seconds}`;
  numEl.textContent = seconds;
}

function updateCountdownUI(seconds) {
  const overlay = document.getElementById('mp-countdown');
  const numEl = document.getElementById('mp-countdown-number');

  if (seconds <= 0) {
    // GO!
    overlay.className = 'count-go';
    numEl.textContent = 'GO!';
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 600);
  } else {
    overlay.className = `count-${seconds}`;
    numEl.textContent = seconds;

    // Screen shake on 1
    if (seconds === 1) {
      const gameUI = document.getElementById('game-ui');
      gameUI.classList.add('mp-screen-shake');
      setTimeout(() => gameUI.classList.remove('mp-screen-shake'), 300);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// UI — RESULTS (PODIUM)
// ═══════════════════════════════════════════════════════════

let resultsAnimId = null;

function showRaceResults(standings) {
  document.getElementById('results-overlay')?.classList.add('hidden');
  document.getElementById('mp-race-bar').classList.add('hidden');
  document.getElementById('time-modes').style.display = '';
  document.getElementById('top-nav-buttons').style.display = '';
  document.getElementById('app-header').style.display = '';

  const canvas = document.getElementById('mp-results-canvas');
  if (!canvas) return;

  const W = 600, H = 500;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  document.getElementById('mp-results-overlay').classList.remove('hidden');
  showChat();

  // Set rank map for chat name styling
  raceRankMap.clear();
  standings.forEach((s, i) => raceRankMap.set(s.playerId, i + 1));
  raceWinnerId = standings[0]?.playerId || null;

  // Big race complete divider with rankings
  const el = document.getElementById('mp-chat-messages');
  if (el) {
    const div = document.createElement('div');
    div.className = 'mp-chat-race-divider';
    const rankingsHtml = standings.map((s, i) => {
      const medals = ['🥇', '🥈', '🥉'];
      const medal = medals[i] || `#${s.rank}`;
      const colorClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      return `<div class="mp-chat-rank-row ${colorClass}">${medal} ${s.emoji} ${s.username} — ${s.wpm} wpm</div>`;
    }).join('');

    div.innerHTML = `
      <div class="mp-chat-divider-line"></div>
      <div class="mp-chat-divider-label">RACE COMPLETE</div>
      <div class="mp-chat-rankings">${rankingsHtml}</div>
      <div class="mp-chat-divider-line"></div>
    `;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  }

  const getRank = (wpm) => {
    if (wpm >= 120) return { title: 'SINGULARITY', color: '#ff00ff' };
    if (wpm >= 100) return { title: 'PREDATOR', color: '#ff3344' };
    if (wpm >= 80) return { title: 'CYBERPUNK', color: '#00d4ff' };
    if (wpm >= 60) return { title: 'SAMURAI', color: '#ffd700' };
    if (wpm >= 40) return { title: 'GLITCH', color: '#00ff88' };
    if (wpm >= 20) return { title: 'RONIN', color: '#c0c0c0' };
    return { title: 'WANDERER', color: '#666' };
  };

  const winner = standings[0];
  const winnerIsYou = winner?.playerId === mpState.localPlayerId;
  const winnerRank = getRank(winner?.wpm || 0);

  // Particles for the winner
  const parts = [];
  for (let i = 0; i < 50; i++) {
    parts.push({
      x: W / 2 + (Math.random() - 0.5) * 200,
      y: 120 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.5 - Math.random() * 1.5,
      life: 0.5 + Math.random() * 0.5,
      decay: 0.003 + Math.random() * 0.005,
      size: 1.5 + Math.random() * 3,
      color: ['#ffd700', '#ff00c8', '#00d4ff', '#00ff88', '#ff3344'][Math.floor(Math.random() * 5)]
    });
  }

  const startTime = performance.now();

  function drawResults(time) {
    resultsAnimId = requestAnimationFrame(drawResults);
    const t = (time - startTime) / 1000; // seconds since open

    ctx.clearRect(0, 0, W, H);

    // ── Background panel ──
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.fillStyle = 'rgba(8, 6, 18, 0.97)';
    ctx.fill();

    // ── Nebula background ──
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.clip();

    // Deep purple nebula blob top-left
    const neb1 = ctx.createRadialGradient(W * 0.2, H * 0.15, 0, W * 0.2, H * 0.15, 200);
    neb1.addColorStop(0, 'rgba(100, 20, 180, 0.12)');
    neb1.addColorStop(0.5, 'rgba(60, 10, 120, 0.05)');
    neb1.addColorStop(1, 'transparent');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, W, H);

    // Cyan nebula blob right
    const neb2 = ctx.createRadialGradient(W * 0.8, H * 0.4, 0, W * 0.8, H * 0.4, 180);
    neb2.addColorStop(0, 'rgba(0, 180, 255, 0.08)');
    neb2.addColorStop(0.5, 'rgba(0, 100, 200, 0.03)');
    neb2.addColorStop(1, 'transparent');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, W, H);

    // Golden crown glow at top center
    const neb3 = ctx.createRadialGradient(W / 2, 60, 0, W / 2, 60, 150);
    neb3.addColorStop(0, 'rgba(255, 200, 0, 0.1)');
    neb3.addColorStop(0.4, 'rgba(255, 150, 0, 0.04)');
    neb3.addColorStop(1, 'transparent');
    ctx.fillStyle = neb3;
    ctx.fillRect(0, 0, W, H);

    // Subtle bottom magenta
    const neb4 = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H, 200);
    neb4.addColorStop(0, 'rgba(255, 0, 100, 0.05)');
    neb4.addColorStop(1, 'transparent');
    ctx.fillStyle = neb4;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();

    // Border
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Animate values ──
    const revealT = Math.min(1, t / 0.8); // 0→1 over 0.8s
    const eased = 1 - Math.pow(1 - revealT, 3); // ease out cubic

    // ── "RACE COMPLETE" header ──
    ctx.save();
    ctx.globalAlpha = eased;
    ctx.font = `600 11px 'JetBrains Mono', monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('R A C E   C O M P L E T E', W / 2, 36);
    ctx.restore();

    // ── Winner section ──
    const winY = 55;

    // Trophy
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.2) * 3));
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText('\u{1F3C6}', W / 2, winY + 20);
    ctx.restore();

    // Winner emoji
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.3) * 3));
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillText(winner?.emoji || '', W / 2, winY + 65);
    ctx.restore();

    // Winner name
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.4) * 3));
    ctx.font = `700 18px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${winner?.username || ''}${winnerIsYou ? ' (you)' : ''}`, W / 2, winY + 100);
    ctx.restore();

    // Rank title
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.5) * 3));
    ctx.font = `800 10px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = winnerRank.color;
    ctx.shadowColor = winnerRank.color;
    ctx.shadowBlur = 8;
    ctx.fillText(winnerRank.title, W / 2, winY + 118);
    ctx.restore();

    // ── Winner stats (WPM / ACC / WORDS) ──
    const statsY = winY + 155;
    const animWpm = Math.round((winner?.wpm || 0) * eased);
    const animAcc = Math.round((winner?.accuracy || 0) * eased);
    const animWords = Math.round((winner?.wordsCompleted || 0) * eased);

    const statItems = [
      { val: animWpm, label: 'WPM', x: W / 2 - 120 },
      { val: animAcc + '%', label: 'ACC', x: W / 2 },
      { val: animWords, label: 'WORDS', x: W / 2 + 120 }
    ];

    statItems.forEach(s => {
      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.6) * 2.5));
      // Value
      ctx.font = `800 28px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
      ctx.shadowBlur = 12;
      ctx.fillText(s.val, s.x, statsY);
      ctx.shadowBlur = 0;
      // Label
      ctx.font = `600 8px 'JetBrains Mono', monospace`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillText(s.label, s.x, statsY + 18);
      ctx.restore();
    });

    // Dividers between stats
    ctx.save();
    ctx.globalAlpha = Math.min(0.1, Math.max(0, (t - 0.6) * 0.3));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    [W / 2 - 60, W / 2 + 60].forEach(dx => {
      ctx.beginPath();
      ctx.moveTo(dx, statsY - 18);
      ctx.lineTo(dx, statsY + 12);
      ctx.stroke();
    });
    ctx.restore();

    // ── Separator line ──
    const sepY = statsY + 40;
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, sepY);
    ctx.lineTo(W - 40, sepY);
    ctx.stroke();
    ctx.restore();

    // ── Other players rows ──
    const rowStartY = sepY + 20;
    const ROW_H = 44;

    standings.slice(1).forEach((s, i) => {
      const isYou = s.playerId === mpState.localPlayerId;
      const rank = getRank(s.wpm);
      const rowY = rowStartY + i * ROW_H;
      const rowAlpha = Math.min(1, Math.max(0, (t - 0.8 - i * 0.1) * 3));

      ctx.save();
      ctx.globalAlpha = rowAlpha;

      const colorIdx = mpState.playerColors.get(s.playerId) ?? 0;
      const pc = PLAYER_COLORS[colorIdx] || PLAYER_COLORS[0];
      const medalColors = [null, { r: 192, g: 192, b: 192 }, { r: 205, g: 127, b: 50 }];
      const mc = medalColors[i] || pc;

      // Row card
      const cardY = rowY - 8;
      const cardH = ROW_H;
      const midY = cardY + cardH / 2;

      roundRect(ctx, 30, cardY, W - 60, cardH, 10);
      if (isYou) {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.06)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fill();
        ctx.strokeStyle = `rgba(${mc.r}, ${mc.g}, ${mc.b}, 0.08)`;
      }
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rank #
      ctx.font = `800 13px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(${mc.r}, ${mc.g}, ${mc.b}, 0.6)`;
      ctx.fillText(`#${s.rank}`, 55, midY);

      // Emoji
      ctx.font = '17px serif';
      ctx.fillText(s.emoji, 88, midY);

      // Name
      ctx.textBaseline = 'alphabetic';
      ctx.font = `${isYou ? '700' : '500'} 13px 'Outfit', sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillStyle = isYou ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)';
      ctx.fillText(s.username + (isYou ? ' (you)' : ''), 115, midY - 3);

      // Rank title
      ctx.font = `700 8px 'JetBrains Mono', monospace`;
      ctx.fillStyle = rank.color;
      ctx.globalAlpha = rowAlpha * 0.7;
      ctx.fillText(rank.title, 115, midY + 11);
      ctx.globalAlpha = rowAlpha;

      // WPM
      ctx.font = `800 16px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgb(${pc.r}, ${pc.g}, ${pc.b})`;
      ctx.shadowColor = `rgba(${pc.r}, ${pc.g}, ${pc.b}, 0.3)`;
      ctx.shadowBlur = 6;
      ctx.fillText(Math.round(s.wpm * eased), W - 90, midY);
      ctx.shadowBlur = 0;

      // Acc
      ctx.font = `600 11px 'JetBrains Mono', monospace`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText(s.accuracy + '%', W - 45, midY);

      ctx.restore();
    });

    // ── Floating particles ──
    parts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.01;
      p.life -= p.decay;
      if (p.life <= 0) {
        // Respawn
        p.x = W / 2 + (Math.random() - 0.5) * 200;
        p.y = 100 + (Math.random() - 0.5) * 40;
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = -0.5 - Math.random() * 1.5;
        p.life = 0.5 + Math.random() * 0.5;
      }
      ctx.save();
      ctx.globalAlpha = p.life * 0.5 * Math.min(1, t);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  if (resultsAnimId) cancelAnimationFrame(resultsAnimId);
  resultsAnimId = requestAnimationFrame(drawResults);

  // Confetti if you won
  if (winnerIsYou) setTimeout(spawnConfetti, 600);
}

function spawnConfetti() {
  const colors = ['#ffd700', '#00d4ff', '#ff00c8', '#00ff88', '#ff3344', '#b464ff'];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'mp-confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `-10px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--fall-duration', `${2 + Math.random() * 2}s`);
    piece.style.setProperty('--fall-delay', `${Math.random() * 0.5}s`);
    piece.style.setProperty('--spin', `${360 + Math.random() * 720}deg`);
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.width = `${6 + Math.random() * 6}px`;
    piece.style.height = `${6 + Math.random() * 6}px`;

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════════════════════

function showChat() {
  document.getElementById('mp-chat-panel')?.classList.remove('hidden');
}

function hideChat() {
  document.getElementById('mp-chat-panel')?.classList.add('hidden');
}

function clearChat() {
  const el = document.getElementById('mp-chat-messages');
  if (el) el.innerHTML = '';
}

// Track race winner for chat styling
let raceWinnerId = null;
let raceRankMap = new Map(); // playerId -> rank (1,2,3...)

function appendChatMessage(msg) {
  const el = document.getElementById('mp-chat-messages');
  if (!el) return;

  const isYou = msg.playerId === mpState.localPlayerId;
  const rank = raceRankMap.get(msg.playerId) || 0;
  const rankClass = rank === 1 ? 'is-winner' : rank === 2 ? 'is-second' : rank === 3 ? 'is-third' : '';

  const div = document.createElement('div');
  div.className = `mp-chat-msg ${isYou ? 'is-you' : ''} ${rankClass}`;
  div.innerHTML = `
    ${rank ? `<span class="mp-chat-msg-badge ${rankClass}">${rank === 1 ? '\u{1F451}' : rank}</span>` : '<span class="mp-chat-msg-emoji">' + (msg.emoji || '') + '</span>'}
    <div class="mp-chat-msg-body">
      <div class="mp-chat-msg-name">${msg.username}${isYou ? ' (you)' : ''}</div>
      <div class="mp-chat-msg-text">${escapeHtml(msg.text)}</div>
    </div>
  `;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function appendSystemMessage(text) {
  const el = document.getElementById('mp-chat-messages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'mp-chat-msg is-system';
  div.innerHTML = `<div class="mp-chat-msg-body"><div class="mp-chat-msg-text">${text}</div></div>`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('mp-chat-input');
  if (!input || !socket?.connected) return;
  const text = input.value.trim();
  if (!text) return;
  socket.emit('chat:message', { text });
  input.value = '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function syncLocalEmoji() {
  if (!mpState.room) return;
  const me = mpState.room.players.find(p => p.id === mpState.localPlayerId);
  if (me && me.emoji) {
    mpState.localEmoji = me.emoji;
    // Update emoji picker to match
    document.querySelectorAll('.mp-emoji-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.emoji === me.emoji);
    });
  }
}

function assignPlayerColors() {
  mpState.playerColors.clear();
  if (!mpState.room) return;
  mpState.room.players.forEach((p, i) => {
    mpState.playerColors.set(p.id, i % 5);
  });
}

let toastTimeout = null;
function mpToast(message) {
  let el = document.querySelector('.mp-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'mp-toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════════════════
// EVENT BINDINGS
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Open modal — pre-connect socket so Create Room feels instant
  document.getElementById('mp-btn')?.addEventListener('click', () => {
    showMenuView();
    connectSocket(); // warm up connection in background
  });

  // Close modal
  document.getElementById('close-mp')?.addEventListener('click', () => {
    document.getElementById('mp-modal').classList.add('hidden');
  });

  // Create room
  document.getElementById('mp-create-btn')?.addEventListener('click', createRoom);

  // Join room
  document.getElementById('mp-join-btn')?.addEventListener('click', () => {
    const code = document.getElementById('mp-join-code')?.value?.trim();
    joinRoom(code);
  });

  // Join on Enter key
  document.getElementById('mp-join-code')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const code = e.target.value.trim();
      joinRoom(code);
    }
  });

  // Leave room
  document.getElementById('mp-leave-btn')?.addEventListener('click', leaveRoom);

  // Start race
  document.getElementById('mp-start-btn')?.addEventListener('click', startRace);

  // Copy join link
  document.getElementById('mp-copy-code')?.addEventListener('click', () => {
    if (!mpState.room) return;
    const joinUrl = `${location.origin}?join=${mpState.room.code}`;
    navigator.clipboard.writeText(joinUrl).then(() => {
      const btn = document.getElementById('mp-copy-code');
      btn.classList.add('copied');
      btn.innerHTML = '<i class="ri-check-line"></i> 送信済み';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i class="ri-link"></i> Copy Link';
      }, 2000);
    });
  });

  // Time selector
  document.querySelectorAll('.mp-time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mpState.room || mpState.room.hostId !== mpState.localPlayerId) return;
      const time = parseInt(btn.dataset.time);
      socket?.emit('room:settings', { timeLimit: time });
      document.querySelectorAll('.mp-time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Emoji picker
  document.querySelectorAll('.mp-emoji-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mp-emoji-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mpState.localEmoji = btn.dataset.emoji;
      socket?.emit('room:set_emoji', { emoji: mpState.localEmoji });
    });
  });

  // Results — rematch
  document.getElementById('mp-rematch-btn')?.addEventListener('click', () => {
    if (socket) socket.emit('room:back_to_lobby');
  });

  // Particle picker
  document.querySelectorAll('.mp-particle-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mp-particle-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Set the particle shape globally so effects.js picks it up
      if (window.userConfig) {
        if (btn.dataset.particle === 'none') {
          window.userConfig.particle = false;
        } else {
          window.userConfig.particle = true;
          window.userConfig.particleShape = btn.dataset.particle;
        }
      }
    });
  });

  // Chat
  document.getElementById('mp-chat-send')?.addEventListener('click', sendChatMessage);
  document.getElementById('mp-chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
    e.stopPropagation(); // Don't let the game engine capture chat keystrokes
  });
  // Stop chat input from triggering game typing
  document.getElementById('mp-chat-input')?.addEventListener('input', (e) => {
    e.stopPropagation();
  });

  // Low perf mode toggle
  document.getElementById('mp-low-perf')?.addEventListener('change', (e) => {
    lowPerfMode = e.target.checked;
    localStorage.setItem('mp_low_perf', lowPerfMode ? '1' : '0');
  });
  // Restore saved preference
  if (localStorage.getItem('mp_low_perf') === '1') {
    lowPerfMode = true;
    const cb = document.getElementById('mp-low-perf');
    if (cb) cb.checked = true;
  }

  // Results — leave
  document.getElementById('mp-leave-results-btn')?.addEventListener('click', leaveRoom);

  // Auto-join from URL param (?join=ROOMCODE)
  const urlParams = new URLSearchParams(window.location.search);
  const joinCode = urlParams.get('join');
  if (joinCode) {
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => {
      showMenuView();
      const codeInput = document.getElementById('mp-join-code');
      if (codeInput) codeInput.value = joinCode.toUpperCase();
      mpToast(`Room ${joinCode.toUpperCase()} — enter your name and click Join`);
    }, 1500);
  }

});
