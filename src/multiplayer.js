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
  if (socket?.connected) return socket;

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
    if (waveAnimId) { cancelAnimationFrame(waveAnimId); waveAnimId = null; }
    removeWordCursors();
    showRaceResults(standings);
  });

  // --- Player disconnected ---
  socket.on('game:player_disconnected', ({ playerId }) => {
    markRaceBarDisconnected(playerId);
    removeWordCursor(playerId);
  });

  // --- Back to lobby ---
  socket.on('room:back_to_lobby', ({ room }) => {
    mpState.room = room;
    mpState.isMultiplayer = false;
    assignPlayerColors();

    document.getElementById('mp-results-overlay').classList.add('hidden');
    document.getElementById('mp-race-bar').classList.add('hidden');
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

  // Read name from input if available
  const nameVal = document.getElementById('mp-name-input')?.value?.trim();
  if (nameVal) mpState.localUsername = nameVal;

  s.emit('room:create', {
    timeLimit: 30,
    username: mpState.localUsername,
    emoji: mpState.localEmoji
  }, (response) => {
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
  clearInterval(progressInterval);
  clearInterval(cursorInterval);
  if (waveAnimId) { cancelAnimationFrame(waveAnimId); waveAnimId = null; }
  removeWordCursors();

  document.getElementById('mp-race-bar').classList.add('hidden');
  document.getElementById('mp-results-overlay').classList.add('hidden');
  document.getElementById('mp-countdown').classList.add('hidden');
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
      const percent = Math.min(100, Math.round((s.wordIndex / mpState.room.words.length) * 100));
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
  if (data) data.wordIndex = wordIndex;
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
    ? '<i class="ri-play-fill"></i> Start Race'
    : '<i class="ri-play-fill"></i> Need 2+ players';
}

// ═══════════════════════════════════════════════════════════
// UI — RACE BAR
// ═══════════════════════════════════════════════════════════

// Wave line state per player
const waveState = new Map();

function showRaceBar() {
  const bar = document.getElementById('mp-race-bar');
  const container = document.getElementById('mp-race-players');
  if (!mpState.room) return;

  waveState.clear();

  container.innerHTML = mpState.room.players.map(p => {
    const colorIdx = mpState.playerColors.get(p.id) ?? 0;
    const isYou = p.id === mpState.localPlayerId;

    // Initialize wave state
    waveState.set(p.id, { percent: 0, wpm: 0, points: [] });

    const gradId = `wave-grad-${colorIdx}`;
    return `
      <div class="mp-race-player" data-player-id="${p.id}" data-color="${colorIdx}">
        <span class="mp-race-name ${isYou ? 'is-you' : ''}">${p.username}</span>
        <span class="mp-race-emoji" style="display:none">${p.emoji}</span>
        <div class="mp-race-track">
          <svg class="mp-race-svg" viewBox="0 0 600 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="${gradId}-${p.id}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="var(--wave-color)" stop-opacity="0"/>
                <stop offset="60%" stop-color="var(--wave-color)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--wave-color)" stop-opacity="1"/>
              </linearGradient>
            </defs>
            <path class="mp-race-wave" d="" fill="none" stroke="url(#${gradId}-${p.id})" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="mp-race-progress" style="width: 0%">
            <span class="mp-race-rider">${p.emoji}</span>
          </div>
        </div>
        <span class="mp-race-wpm">0</span>
      </div>
    `;
  }).join('');

  bar.classList.remove('hidden');
  startWaveAnimation();
}

// Animate wave lines at 30fps
let waveAnimId = null;

function startWaveAnimation() {
  if (waveAnimId) cancelAnimationFrame(waveAnimId);
  let lastTime = 0;

  function animate(time) {
    if (!mpState.room || mpState.room.status === 'finished') {
      waveAnimId = null;
      return;
    }
    waveAnimId = requestAnimationFrame(animate);

    // Throttle to ~30fps
    if (time - lastTime < 33) return;
    lastTime = time;

    for (const [playerId, state] of waveState) {
      const playerEl = document.querySelector(`.mp-race-player[data-player-id="${playerId}"]`);
      if (!playerEl) continue;

      const svgPath = playerEl.querySelector('.mp-race-wave');
      if (!svgPath) continue;

      // Generate wave path based on progress and WPM
      const percent = state.percent;
      const wpm = state.wpm;
      const endX = (percent / 100) * 600;

      if (endX < 2) {
        svgPath.setAttribute('d', '');
        continue;
      }

      // Wave amplitude: high WPM = calm (2-4px), low WPM = wild (8-14px)
      const amplitude = wpm > 80 ? 2 : wpm > 50 ? 5 : wpm > 20 ? 9 : 13;
      // Wave frequency: high WPM = long smooth waves, low WPM = tight chaotic
      const freq = wpm > 80 ? 0.02 : wpm > 50 ? 0.04 : wpm > 20 ? 0.07 : 0.12;

      const centerY = 20;
      let d = `M 0 ${centerY}`;

      // Draw smooth wave using quadratic bezier segments
      const step = 8;
      const phase = time * 0.002; // Slow drift
      for (let x = 0; x <= endX; x += step) {
        // Fade wave in from the start (first 10% is calmer)
        const fadeIn = Math.min(1, x / 60);
        // More chaotic near the leading edge
        const edgeFactor = 1 + Math.max(0, 1 - (endX - x) / 80) * 0.5;
        const y = centerY + Math.sin(x * freq + phase) * amplitude * fadeIn * edgeFactor
          + Math.sin(x * freq * 2.3 + phase * 1.7) * (amplitude * 0.3) * fadeIn;
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }

      svgPath.setAttribute('d', d);
    }
  }

  waveAnimId = requestAnimationFrame(animate);
}

function updateRaceBarProgress(playerId, wpm, percent) {
  const playerEl = document.querySelector(`.mp-race-player[data-player-id="${playerId}"]`);
  if (!playerEl) return;

  // Update wave state
  const ws = waveState.get(playerId);
  if (ws) {
    ws.percent = percent;
    ws.wpm = wpm;
    ws.wordIndex = Math.max(ws.wordIndex || 0, percent); // track progress
  }

  // Move the rider emoji
  const progressEl = playerEl.querySelector('.mp-race-progress');
  if (progressEl) progressEl.style.width = `${percent}%`;

  const wpmEl = playerEl.querySelector('.mp-race-wpm');
  if (wpmEl) wpmEl.textContent = wpm;

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

  document.querySelectorAll('.mp-race-player').forEach(el => {
    const pid = el.dataset.playerId;
    el.classList.toggle('is-leader', pid === leaderId && maxWpm > 0);
  });

  // Update leader class on emoji cursors + swap leader emoji to crown
  for (const [pid, data] of cursorElements) {
    const isLeader = pid === leaderId && maxWpm > 0;
    data.el.classList.toggle('is-leader', isLeader);

    // Store original emoji on first run
    if (!data.originalEmoji) data.originalEmoji = data.el.textContent;

    data.el.textContent = isLeader ? '\u{1F451}' : data.originalEmoji;
  }
}

function markRaceBarFinished(playerId, wpm) {
  const playerEl = document.querySelector(`.mp-race-player[data-player-id="${playerId}"]`);
  if (!playerEl) return;
  playerEl.classList.add('finished');
  const progressEl = playerEl.querySelector('.mp-race-progress');
  if (progressEl) progressEl.style.width = '100%';
  const wpmEl = playerEl.querySelector('.mp-race-wpm');
  if (wpmEl) wpmEl.textContent = `${wpm} WPM`;
}

function markRaceBarDisconnected(playerId) {
  const playerEl = document.querySelector(`.mp-race-player[data-player-id="${playerId}"]`);
  if (playerEl) playerEl.classList.add('disconnected');
}

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

function showRaceResults(standings) {
  // Hide normal results + race bar, restore nav
  document.getElementById('results-overlay')?.classList.add('hidden');
  document.getElementById('mp-race-bar').classList.add('hidden');
  document.getElementById('time-modes').style.display = '';
  document.getElementById('top-nav-buttons').style.display = '';
  document.getElementById('app-header').style.display = '';

  const podiumEl = document.getElementById('mp-podium');
  const extraEl = document.getElementById('mp-standings-extra');

  // Split into podium (top 3) and extra (4th-5th)
  const podium = standings.slice(0, 3);
  const extra = standings.slice(3);

  // Render podium — order: 2nd, 1st, 3rd (visual layout)
  const ordered = [];
  if (podium[1]) ordered.push(podium[1]); // 2nd
  if (podium[0]) ordered.push(podium[0]); // 1st
  if (podium[2]) ordered.push(podium[2]); // 3rd

  podiumEl.innerHTML = ordered.map(s => {
    const isYou = s.playerId === mpState.localPlayerId;
    return `
      <div class="mp-podium-block rank-${s.rank} ${isYou ? 'is-you' : ''}" data-rank="${s.rank}">
        ${s.rank === 1 ? '<span class="mp-podium-trophy">\u{1F3C6}</span>' : ''}
        <div class="mp-podium-rank">#${s.rank}</div>
        <div class="mp-podium-emoji">${s.emoji}</div>
        <div class="mp-podium-name">${s.username}${isYou ? ' (you)' : ''}</div>
        <div class="mp-podium-wpm">${s.wpm} WPM</div>
        <div class="mp-podium-acc">${s.accuracy}% acc</div>
      </div>
    `;
  }).join('');

  // Extra standings (4th-5th)
  extraEl.innerHTML = extra.map(s => {
    const isYou = s.playerId === mpState.localPlayerId;
    return `
      <div class="mp-standing-extra ${isYou ? 'is-you' : ''}">
        <span class="mp-standing-extra-rank">#${s.rank}</span>
        <span class="mp-standing-extra-emoji">${s.emoji}</span>
        <span class="mp-standing-extra-name">${s.username}${isYou ? ' (you)' : ''}</span>
        <span class="mp-standing-extra-stats">${s.wpm} WPM / ${s.accuracy}%</span>
      </div>
    `;
  }).join('');

  document.getElementById('mp-results-overlay').classList.remove('hidden');

  // Trigger staggered podium reveal
  setTimeout(() => {
    document.querySelectorAll('.mp-podium-block').forEach(block => {
      block.classList.add('reveal');
    });
  }, 100);

  // Confetti for the winner!
  if (standings[0] && standings[0].playerId === mpState.localPlayerId) {
    setTimeout(spawnConfetti, 800);
  }
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
  // Open modal
  document.getElementById('mp-btn')?.addEventListener('click', () => {
    showMenuView();
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

  // Copy room code
  document.getElementById('mp-copy-code')?.addEventListener('click', () => {
    if (!mpState.room) return;
    navigator.clipboard.writeText(mpState.room.code).then(() => {
      const btn = document.getElementById('mp-copy-code');
      btn.classList.add('copied');
      btn.innerHTML = '<i class="ri-check-line"></i>';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i class="ri-file-copy-line"></i>';
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

  // Results — leave
  document.getElementById('mp-leave-results-btn')?.addEventListener('click', leaveRoom);

});
