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
  playerColors: new Map(), // playerId -> color index
  _savedUiMode: null,      // player's original uiMode before race override
  _savedCleanTheme: null   // player's original cleanTheme before race override
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
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });

  // Server sends us our assigned user ID (important for guests) — listen ONCE outside connect
  socket.on('auth:id', ({ id }) => {
    mpState.localPlayerId = id;
    console.log('[MP] Assigned ID:', id);
  });

  socket.on('connect', () => {
    console.log('[MP] Connected');
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
    mpToast(`${escapeHtml(player.username)} joined`);
    appendSystemMessage(`${escapeHtml(player.username)} joined the war room`);
  });

  socket.on('room:player_left', ({ playerId }) => {
    if (!mpState.room) return;
    const leaving = mpState.room.players.find(p => p.id === playerId);
    mpState.room.players = mpState.room.players.filter(p => p.id !== playerId);
    if (leaving) appendSystemMessage(`${escapeHtml(leaving.username)} left`);
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

  socket.on('room:settings_updated', ({ timeLimit, visualMode, cleanTheme, hagakureLineCount }) => {
    if (!mpState.room) return;
    mpState.room.timeLimit = timeLimit;
    if (visualMode) mpState.room.visualMode = visualMode;
    if (cleanTheme) mpState.room.cleanTheme = cleanTheme;
    if (hagakureLineCount) mpState.room.hagakureLineCount = hagakureLineCount;

    document.querySelectorAll('.mp-time-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.time) === timeLimit);
    });
    document.querySelectorAll('.mp-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === visualMode);
    });
    syncModeUI(visualMode);
    document.querySelectorAll('.mp-theme-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === cleanTheme);
    });
    document.querySelectorAll('.mp-line-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.lines) === hagakureLineCount);
    });
  });

  // --- Countdown ---
  socket.on('room:countdown', ({ seconds, words, timeLimit, visualMode, cleanTheme, hagakureLineCount, countdownSkin, countdownWords }) => {
    if (!mpState.room) return;
    mpState.room.words = words;
    mpState.room.timeLimit = timeLimit;
    mpState.room.status = 'countdown';
    mpState.room.visualMode = visualMode;

    // Use server-provided countdown style so all players see the same thing
    if (countdownSkin) currentCountdownSkin = countdownSkin;
    if (countdownWords !== undefined) currentWordSet = countdownWords;

    // Save player's original mode/theme for revert later
    if (window.userConfig) {
      mpState._savedUiMode = window.userConfig.uiMode;
      mpState._savedCleanTheme = window.userConfig.cleanTheme;
    }

    // Apply host's visual mode for the race (zen/clean only — hagakure has its own UI)
    if (visualMode && visualMode !== 'hagakure' && window.applyThemeForMultiplayer) {
      window.applyThemeForMultiplayer(visualMode, cleanTheme);
    }

    // Close modal, show race UI — unblock keyboard for the race
    window.mpModalActive = false;
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

    // GO! or word set finale
    const countdownEl = document.getElementById('mp-countdown');
    const numEl = document.getElementById('mp-countdown-number');
    if (countdownEl && numEl) {
      if (currentWordSet) {
        // Word set: last word already shown — hide immediately so typing starts
        countdownEl.classList.add('hidden');
        numEl.style.fontSize = '';
        numEl.style.letterSpacing = '';
      } else {
        // Classic: show GO! with skin animation
        numEl.style.animation = 'none';
        void numEl.offsetWidth;
        numEl.removeAttribute('style');
        countdownEl.className = `count-go ${currentCountdownSkin}`;
        numEl.textContent = 'GO!';
        setTimeout(() => {
          countdownEl.classList.add('hidden');
        }, 950);
      }
    }

    // Shake the game container for impact (skip for hagakure — has its own UI)
    const isHagakureRace = mpState.room.visualMode === 'hagakure';
    if (!isHagakureRace) {
      const gameUI = document.getElementById('game-ui');
      if (gameUI) {
        gameUI.classList.add('mp-screen-shake');
        setTimeout(() => gameUI.classList.remove('mp-screen-shake'), 300);
      }
    }

    // Hide UI clutter during race
    document.getElementById('time-modes').style.display = 'none';
    document.getElementById('top-nav-buttons').style.display = 'none';
    document.getElementById('app-header').style.display = 'none';
    hideChat();

    // Start the typing engine with server words
    if (mpState.room.visualMode === 'hagakure') {
      if (window.startMultiplayerHagakure) {
        window.startMultiplayerHagakure(mpState.room.words);
      }
    } else {
      if (window.startMultiplayerRace) {
        window.startMultiplayerRace(mpState.room.words, mpState.room.timeLimit);
      }
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
    // Don't revert visual mode yet — results overlay is about to show.
    // Hide game-ui so clean-mode panel doesn't bleed through behind results.
    const gameUI = document.getElementById('game-ui');
    if (gameUI) gameUI.classList.add('hidden');
    const hagUI = document.getElementById('hagakure-ui');
    if (hagUI) hagUI.classList.add('hidden');
    showRaceResults(standings);
  });

  // --- Hagakure: player died ---
  socket.on('game:player_died_broadcast', ({ playerId, wordIndex, wpm }) => {
    // Update their race bar to show they're out
    markRaceBarFinished(playerId, wpm);
    if (playerId !== mpState.localPlayerId) {
      mpToast(`A warrior has fallen!`);
    }
  });

  // --- Player disconnected ---
  socket.on('game:player_disconnected', ({ playerId }) => {
    markRaceBarDisconnected(playerId);
    removeWordCursor(playerId);
  });

  // --- Chat ---
  socket.on('chat:message', (msg) => {
    // Hide typing indicator when message arrives
    const typingEl = document.getElementById('mp-chat-typing');
    if (typingEl) typingEl.style.display = 'none';
    appendChatMessage(msg);
  });

  // Typing indicator
  let typingTimeout = null;
  socket.on('chat:typing', ({ playerId, username, emoji }) => {
    if (playerId === mpState.localPlayerId) return;
    const typingEl = document.getElementById('mp-chat-typing');
    if (!typingEl) return;
    const avatarEl = typingEl.querySelector('.mp-typing-avatar');
    const nameEl = typingEl.querySelector('.mp-typing-name');
    if (avatarEl) avatarEl.textContent = emoji || '\u{1F4AC}';
    if (nameEl) nameEl.textContent = username;
    typingEl.style.display = 'flex';
    const msgEl = document.getElementById('mp-chat-messages');
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => { typingEl.style.display = 'none'; }, 3000);
  });

  // --- Back to lobby ---
  socket.on('room:back_to_lobby', ({ room }) => {
    mpState.room = room;
    mpState.isMultiplayer = false;
    assignPlayerColors();

    if (resultsAnimId) { cancelAnimationFrame(resultsAnimId); resultsAnimId = null; }
    document.getElementById('mp-results-overlay').classList.add('hidden');
    document.getElementById('mp-race-bar').classList.add('hidden');
    const _cpEl = document.getElementById('mp-clean-position'); if (_cpEl) _cpEl.style.display = 'none';
    hideKing();
    revertVisualMode();
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
  if (nameVal) {
    mpState.localUsername = nameVal;
    localStorage.setItem('mp-warrior-name', nameVal);
  }

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
  if (nameVal) {
    mpState.localUsername = nameVal;
    localStorage.setItem('mp-warrior-name', nameVal);
  }

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
  const _cpEl = document.getElementById('mp-clean-position'); if (_cpEl) _cpEl.style.display = 'none';
  hideKing();
  revertVisualMode();
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

    // Update own race bar — same formula as server (room.words.length)
    if (mpState.room) {
      const expectedWords = Math.max(1, mpState.room.words?.length || 120);
      const percent = Math.min(99, Math.round((s.wordIndex / expectedWords) * 100));
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

function getWordsContainer() {
  if (mpState.room?.visualMode === 'hagakure') return document.getElementById('h-words-container');
  return document.getElementById('words-container');
}

function startCursorLoop() {
  clearInterval(cursorInterval);
  removeWordCursors();

  // Create cursor elements for opponents
  if (!mpState.room) return;
  const container = getWordsContainer();
  if (!container) return;

  for (const player of mpState.room.players) {
    if (player.id === mpState.localPlayerId) continue;

    const cursor = document.createElement('div');
    cursor.className = 'mp-word-cursor';
    cursor.dataset.playerId = player.id;
    const colorIdx = mpState.playerColors.get(player.id) ?? 0;
    cursor.dataset.color = colorIdx;
    cursor.textContent = player.emoji;
    cursor.style.visibility = 'hidden';

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
  const container = getWordsContainer();
  if (!container) return;

  for (const [playerId, data] of cursorElements) {
    // Hagakure uses .h-word divs (no IDs), normal uses word-N IDs
    const isHag = mpState.room?.visualMode === 'hagakure';
    const wordEl = isHag
      ? container.querySelectorAll('.h-word')[data.wordIndex]
      : document.getElementById(`word-${data.wordIndex}`);
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

  // Visual mode selector — only host can change (click handler checks hostId)
  const modeSelector = document.getElementById('mp-mode-selector');
  const themeSelector = document.getElementById('mp-theme-selector');
  if (modeSelector) modeSelector.style.opacity = isHost ? '1' : '0.5';
  if (themeSelector) themeSelector.style.opacity = isHost ? '1' : '0.5';
  const roomMode = mpState.room.visualMode || 'zen';
  document.querySelectorAll('.mp-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === roomMode);
  });
  // Sync all mode-dependent UI
  syncModeUI(roomMode);
  document.querySelectorAll('.mp-theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === (mpState.room.cleanTheme || 'koi'));
  });
  document.querySelectorAll('.mp-line-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.lines) === (mpState.room.hagakureLineCount || 25));
  });

  // Hagakure lines selector — host lock
  const linesSel = document.getElementById('mp-hagakure-lines');
  if (linesSel) linesSel.style.opacity = isHost ? '1' : '0.5';
}

// Show/hide UI sections based on selected visual mode
function syncModeUI(mode) {
  const themeSel = document.getElementById('mp-theme-selector');
  const battleFx = document.getElementById('mp-battle-effects-section');
  const timeSel = document.getElementById('mp-time-selector');
  const linesSel = document.getElementById('mp-hagakure-lines');
  const durationSection = timeSel?.closest('.mp-scroll-section');

  if (themeSel) themeSel.classList.toggle('hidden', mode !== 'clean');
  if (battleFx) battleFx.style.display = (mode === 'clean' || mode === 'hagakure') ? 'none' : '';
  if (durationSection) durationSection.style.display = mode === 'hagakure' ? 'none' : '';
  if (linesSel) linesSel.classList.toggle('hidden', mode !== 'hagakure');
}

function renderLobbyPlayers() {
  const list = document.getElementById('mp-players-list');
  if (!mpState.room) return;

  list.innerHTML = mpState.room.players.map(p => `
    <div class="mp-player-card">
      <span class="mp-player-emoji">${escapeHtml(p.emoji)}</span>
      <span class="mp-player-name">${escapeHtml(p.username)}</span>
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
const CANVAS_H_PER_PLAYER = 44;  // zen mode: per-row height
const CANVAS_H_HORSE = 80;       // clean mode: fixed single-track height
const CANVAS_PAD = 14;
const TRACK_LEFT = 80;
const TRACK_RIGHT = 50;
const BAR_H = 28;
const BAR_RADIUS = 14;
// Horse race constants
const HORSE_TRACK_LEFT = 20;
const HORSE_TRACK_RIGHT = 28;
const HORSE_TRACK_Y = 38;
const HORSE_TRACK_H = 5;

function showRaceBar() {
  const bar = document.getElementById('mp-race-bar');
  if (!mpState.room) return;

  waveState.clear();

  // Init wave state for each player
  mpState.room.players.forEach(p => {
    waveState.set(p.id, { percent: 0, wpm: 0, smoothPercent: 0 });
  });

  // Setup canvas — horse race (clean mode) or multi-row bars (zen/hagakure)
  raceCanvas = document.getElementById('mp-race-canvas');
  const dpr = window.devicePixelRatio || 1;
  const isCleanMode = mpState.room?.visualMode === 'clean';
  const numPlayers = mpState.room.players.length;
  const canvasH = isCleanMode ? CANVAS_H_HORSE : CANVAS_PAD * 2 + numPlayers * CANVAS_H_PER_PLAYER;

  raceCanvas.width = CANVAS_W * dpr;
  raceCanvas.height = canvasH * dpr;
  raceCanvas.style.width = CANVAS_W + 'px';
  raceCanvas.style.height = canvasH + 'px';

  raceCtx = raceCanvas.getContext('2d');
  raceCtx.scale(dpr, dpr);

  bar.classList.remove('hidden');
  startRaceCanvasLoop();

  // Show pixel king below typing panel
  showKing();
}

function startRaceCanvasLoop() {
  if (raceAnimId) cancelAnimationFrame(raceAnimId);

  const particles = [];
  let lastDrawTime = 0;

  function draw(time) {
    if (!mpState.room || !raceCtx) { raceAnimId = null; return; }
    raceAnimId = requestAnimationFrame(draw);
    if (lowPerfMode && time - lastDrawTime < 33) return;
    lastDrawTime = time;

    const ctx = raceCtx;
    const players = mpState.room.players;
    const isClean = mpState.room?.visualMode === 'clean';

    if (isClean) {
      // ═══ HORSE RACE (clean mode) ═══
      const H = CANVAS_H_HORSE;
      ctx.clearRect(0, 0, CANVAS_W, H);
      // No background — floats transparently over the page

      const tX = HORSE_TRACK_LEFT;
      const tW = CANVAS_W - HORSE_TRACK_LEFT - HORSE_TRACK_RIGHT;
      const tY = HORSE_TRACK_Y;

      // Read theme accent color from CSS vars
      const themeAccent = getComputedStyle(document.body).getPropertyValue('--cm-accent').trim() || '#e09048';
      const themeSub = getComputedStyle(document.body).getPropertyValue('--cm-sub').trim() || '#3a5868';

      // Single track line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tX, tY);
      ctx.lineTo(tX + tW, tY);
      ctx.strokeStyle = `${themeSub}44`;
      ctx.lineWidth = HORSE_TRACK_H;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // Finish flag
      ctx.save();
      const finX = tX + tW;
      ctx.strokeStyle = `${themeSub}66`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(finX, tY - 16);
      ctx.lineTo(finX, tY + 16);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '13px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('🏁', finX, tY - 16);
      ctx.restore();

      // Leader by progress
      let maxPct = 0, leaderId = null;
      for (const [pid, ws] of waveState) {
        if (ws.smoothPercent > maxPct) { maxPct = ws.smoothPercent; leaderId = pid; }
      }

      players.forEach((p) => {
        const ws = waveState.get(p.id);
        if (!ws) return;
        const colorIdx = mpState.playerColors.get(p.id) ?? 0;
        const c = PLAYER_COLORS[colorIdx] || PLAYER_COLORS[0];
        const isLeader = p.id === leaderId && maxPct > 0;
        const isYou = p.id === mpState.localPlayerId;

        const diff = ws.percent - ws.smoothPercent;
        ws.smoothPercent += diff * (Math.abs(diff) > 8 ? 0.6 : 0.2);
        const ex = tX + Math.max(10, (ws.smoothPercent / 100) * tW);

        // Dot on track
        ctx.save();
        ctx.beginPath();
        ctx.arc(ex, tY, isLeader ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isLeader ? themeAccent : `rgb(${c.r},${c.g},${c.b})`;
        if (isLeader) { ctx.shadowColor = themeAccent; ctx.shadowBlur = 12; }
        ctx.fill();
        ctx.restore();

        // Trail particles for leader
        if (isLeader && ws.smoothPercent > 1 && Math.random() < 0.35) {
          particles.push({ x: ex, y: tY, vx: -0.6 - Math.random() * 1.2, vy: (Math.random() - 0.5) * 1.2, life: 1, decay: 0.025 + Math.random() * 0.03, size: 1 + Math.random() * 2 });
        }

        // Emoji above
        ctx.save();
        ctx.font = '17px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        if (isLeader) { ctx.shadowColor = themeAccent; ctx.shadowBlur = 16; }
        ctx.fillText(isLeader ? '👑' : p.emoji, ex, tY - 7);
        ctx.restore();

        // Name below
        ctx.save();
        ctx.font = `${isYou ? '700' : '500'} 8px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isLeader ? themeAccent : isYou ? `${themeAccent}bb` : `${themeSub}cc`;
        ctx.fillText(p.username.slice(0, 7).toUpperCase(), ex, tY + 8);
        ctx.restore();

        // WPM below name
        if (ws.wpm > 0) {
          ctx.save();
          ctx.font = `800 9px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = isLeader ? themeAccent : `rgba(${c.r},${c.g},${c.b},0.85)`;
          if (isLeader) { ctx.shadowColor = themeAccent; ctx.shadowBlur = 5; }
          ctx.fillText(ws.wpm + ' wpm', ex, tY + 18);
          ctx.restore();
        }
      });

    } else {
      // ═══ ORIGINAL MULTI-ROW BARS (zen / hagakure) ═══
      const numP = players.length;
      const totalH = CANVAS_PAD * 2 + numP * CANVAS_H_PER_PLAYER;

      ctx.clearRect(0, 0, CANVAS_W, totalH);

      ctx.save();
      roundRect(ctx, 0, 0, CANVAS_W, totalH, 18);
      ctx.fillStyle = 'rgba(8, 8, 16, 0.75)';
      ctx.fill();
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

      let maxWpm = 0, leaderId = null;
      const rankings = [];
      for (const [pid, ws] of waveState) {
        rankings.push({ pid, wpm: ws.wpm });
        if (ws.wpm > maxWpm) { maxWpm = ws.wpm; leaderId = pid; }
      }
      rankings.sort((a, b) => b.wpm - a.wpm);

      players.forEach((p, i) => {
        const ws = waveState.get(p.id);
        if (!ws) return;
        const colorIdx = mpState.playerColors.get(p.id) ?? 0;
        const c = PLAYER_COLORS[colorIdx] || PLAYER_COLORS[0];
        const isLeader = p.id === leaderId && maxWpm > 0;
        const isYou = p.id === mpState.localPlayerId;
        const rank = rankings.findIndex(r => r.pid === p.id) + 1;

        const diff = ws.percent - ws.smoothPercent;
        ws.smoothPercent += diff * (Math.abs(diff) > 8 ? 0.6 : 0.2);

        const y = CANVAS_PAD + i * CANVAS_H_PER_PLAYER;
        const trackX = TRACK_LEFT;
        const trackW = CANVAS_W - TRACK_LEFT - TRACK_RIGHT;
        const barY = y + (CANVAS_H_PER_PLAYER - BAR_H) / 2;
        const fillW = Math.max(0, (ws.smoothPercent / 100) * trackW);
        const fc = isLeader ? { r: 255, g: 215, b: 0 } : c;

        // Track bg
        ctx.save();
        roundRect(ctx, trackX, barY, trackW, BAR_H, BAR_RADIUS);
        ctx.fillStyle = 'rgba(255,255,255,0.025)';
        ctx.fill();
        const innerShadow = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H);
        innerShadow.addColorStop(0, 'rgba(0,0,0,0.15)');
        innerShadow.addColorStop(0.3, 'rgba(0,0,0,0)');
        innerShadow.addColorStop(1, 'rgba(255,255,255,0.02)');
        ctx.fillStyle = innerShadow;
        ctx.fill();
        ctx.restore();

        if (fillW > 1) {
          ctx.save();
          roundRect(ctx, trackX, barY, trackW, BAR_H, BAR_RADIUS);
          ctx.clip();
          const mainGrad = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H);
          mainGrad.addColorStop(0, `rgba(${fc.r},${fc.g},${fc.b},0.35)`);
          mainGrad.addColorStop(0.4, `rgba(${fc.r},${fc.g},${fc.b},0.2)`);
          mainGrad.addColorStop(1, `rgba(${fc.r},${fc.g},${fc.b},0.3)`);
          ctx.fillStyle = mainGrad;
          roundRect(ctx, trackX, barY, fillW, BAR_H, BAR_RADIUS);
          ctx.fill();
          const hlGrad = ctx.createLinearGradient(trackX, barY, trackX, barY + BAR_H * 0.4);
          hlGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
          hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = hlGrad;
          ctx.fillRect(trackX, barY, fillW, BAR_H * 0.4);
          ctx.beginPath();
          ctx.moveTo(trackX + fillW, barY + 3);
          ctx.lineTo(trackX + fillW, barY + BAR_H - 3);
          ctx.strokeStyle = `rgba(${fc.r},${fc.g},${fc.b},0.8)`;
          ctx.lineWidth = 2;
          ctx.shadowColor = `rgba(${fc.r},${fc.g},${fc.b},0.6)`;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;
          const pulseX = trackX + ((time * 0.15) % (fillW + 60)) - 30;
          if (pulseX < trackX + fillW) {
            const pulseGrad = ctx.createLinearGradient(pulseX, 0, pulseX + 60, 0);
            pulseGrad.addColorStop(0, `rgba(${fc.r},${fc.g},${fc.b},0)`);
            pulseGrad.addColorStop(0.5, `rgba(${fc.r},${fc.g},${fc.b},0.12)`);
            pulseGrad.addColorStop(1, `rgba(${fc.r},${fc.g},${fc.b},0)`);
            ctx.fillStyle = pulseGrad;
            ctx.fillRect(pulseX, barY, 60, BAR_H);
          }
          ctx.restore();

          ctx.save();
          const glowR = 20, gx = trackX + fillW, gy = barY + BAR_H / 2;
          const edgeGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
          edgeGlow.addColorStop(0, `rgba(${fc.r},${fc.g},${fc.b},0.4)`);
          edgeGlow.addColorStop(1, `rgba(${fc.r},${fc.g},${fc.b},0)`);
          ctx.fillStyle = edgeGlow;
          ctx.fillRect(gx - glowR, gy - glowR, glowR * 2, glowR * 2);
          ctx.restore();

          if (isLeader && ws.smoothPercent > 1 && Math.random() < 0.4) {
            particles.push({ x: gx + (Math.random() - 0.5) * 4, y: gy + (Math.random() - 0.5) * BAR_H * 0.6, vx: -0.5 - Math.random() * 1.5, vy: (Math.random() - 0.5) * 0.8, life: 1, decay: 0.02 + Math.random() * 0.03, size: 1 + Math.random() * 2 });
          }
        }

        // Emoji
        ctx.save();
        ctx.font = '15px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (isLeader) { ctx.shadowColor = 'rgba(255,215,0,0.8)'; ctx.shadowBlur = 14; }
        ctx.fillText(isLeader ? '\u{1F451}' : p.emoji, trackX + Math.max(12, fillW), barY + BAR_H / 2);
        ctx.restore();

        // Rank
        ctx.save();
        ctx.font = `800 10px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLeader ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.15)';
        ctx.fillText(`${rank}`, 18, barY + BAR_H / 2);
        ctx.restore();

        // Name
        ctx.save();
        ctx.font = `${isYou ? '700' : '500'} 9.5px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLeader ? 'rgba(255,215,0,0.6)' : isYou ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)';
        ctx.fillText(p.username.toUpperCase().slice(0, 8), TRACK_LEFT - 10, barY + BAR_H / 2);
        ctx.restore();

        // WPM
        ctx.save();
        ctx.font = `800 12px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLeader ? 'rgb(255,215,0)' : `rgb(${c.r},${c.g},${c.b})`;
        if (isLeader) { ctx.shadowColor = 'rgba(255,215,0,0.4)'; ctx.shadowBlur = 6; }
        ctx.fillText(ws.wpm, CANVAS_W - TRACK_RIGHT + 10, barY + BAR_H / 2);
        ctx.restore();
      });
    }

    // ── Particles (shared) ──
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.decay;
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
  if (!waveState.has(playerId)) {
    waveState.set(playerId, { percent: 0, wpm: 0, smoothPercent: 0 });
  }
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

  // Update clean mode position indicator
  if (mpState.room?.visualMode === 'clean') updateCleanPosition();
}

function updateCleanPosition() {
  const el = document.getElementById('mp-clean-position');
  if (!el) return;
  const sorted = [...waveState.entries()].sort((a, b) => b[1].smoothPercent - a[1].smoothPercent);
  const myRank = sorted.findIndex(([pid]) => pid === mpState.localPlayerId) + 1;
  if (myRank < 1) return;
  el.textContent = `${myRank}`;
  el.style.display = '';
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

// ═══════════════════════════════════════════════════════════
// HAGAKURE MULTIPLAYER — death & completion callbacks
// ═══════════════════════════════════════════════════════════

const MP_DEATH_TAUNTS = [
  "You tried to be fast... now look at you.",
  "Watch how your friends do this.",
  "The blade has spoken. You are unworthy.",
  "Sit down. The warriors are still fighting.",
  "Your ancestors are disappointed.",
  "Maybe typing isn't your thing.",
  "One mistake. That's all it took.",
  "The dojo has no place for the weak.",
  "You fell. They didn't. Think about that.",
  "Spectator mode: activated. Warrior mode: failed.",
  "The cherry blossoms weep for you.",
  "Even the wind types faster than you.",
];

// Called from script.js when player dies in hagakure MP
window.onHagakureMultiplayerDeath = function() {
  if (!socket || !mpState.room) return;

  // Get current state for the server
  const typingState = window.getTypingState?.() || {};
  socket.emit('game:player_died', {
    wordIndex: typingState.wordIndex || 0,
    wpm: typingState.wpm || 0
  });

  // Show death message at the bottom — words stay visible above
  const hGameBoard = document.getElementById('h-game-board');
  if (hGameBoard) {
    const taunt = MP_DEATH_TAUNTS[Math.floor(Math.random() * MP_DEATH_TAUNTS.length)];
    let deathMsg = document.getElementById('mp-hag-death-overlay');
    if (!deathMsg) {
      deathMsg = document.createElement('div');
      deathMsg.id = 'mp-hag-death-overlay';
      deathMsg.style.cssText = 'text-align:center;padding:20px 0;pointer-events:none;';
      hGameBoard.appendChild(deathMsg);
    }
    deathMsg.innerHTML = `
      <div style="width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(206,17,38,0.3),transparent);margin-bottom:24px;"></div>
      <div style="color:#ce1126;font-family:Shojumaru,serif;font-size:2.5rem;text-shadow:0 0 20px rgba(206,17,38,0.4),0 0 40px rgba(206,17,38,0.2);letter-spacing:6px;">FALLEN</div>
      <div style="font-size:0.85rem;color:rgba(255,255,255,0.4);margin-top:14px;font-style:italic;max-width:400px;">${taunt}</div>
    `;
  }

  // Disable ALL inputs so no keystroke sounds/particles fire
  const hInput = document.getElementById('h-input');
  if (hInput) hInput.disabled = true;
  const hiddenInput = document.getElementById('hidden-input');
  if (hiddenInput) { hiddenInput.disabled = true; hiddenInput.blur(); }

  // Stop progress loop — no more updates needed
  clearInterval(progressInterval);
};

// Called from script.js when player completes all words in hagakure MP
window.onHagakureMultiplayerComplete = function() {
  if (!socket || !mpState.room) return;

  const typingState = window.getTypingState?.() || {};
  socket.emit('game:finished', {
    netWpm: typingState.wpm || 0,
    accuracy: typingState.accuracy || 100
  });

  // Hide sword caret and dim ALL remaining bright letters — winner is done
  document.querySelectorAll('.h-letter.h-cursor').forEach(el => el.classList.remove('h-cursor'));
  document.querySelectorAll('#h-words-container .h-letter:not(.h-correct)').forEach(el => el.classList.add('h-correct'));

  // Full-screen VICTORY overlay — cinematic, then fades to spectate
  const victoryOverlay = document.createElement('div');
  victoryOverlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 50% 40%, rgba(40,20,0,0.95), rgba(0,0,0,0.98));
    transition:opacity 0.8s ease;
  `;
  victoryOverlay.innerHTML = `
    <div style="font-size:3rem;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(255,200,0,0.5));animation:mpVicCrown 1s ease both;">👑</div>
    <div style="font-family:'Noto Serif JP',Shojumaru,serif;font-size:2.8rem;font-weight:900;
      background:linear-gradient(180deg,#ffd700 0%,#ff8c00 50%,#ffd700 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      letter-spacing:8px;text-shadow:none;
      filter:drop-shadow(0 2px 12px rgba(255,180,0,0.4));
      animation:mpVicText 0.8s 0.2s ease both;">VICTORY</div>
    <div style="width:120px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,200,0,0.4),transparent);margin:16px 0;animation:mpVicLine 0.6s 0.5s ease both;"></div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:rgba(255,200,100,0.4);letter-spacing:2px;text-transform:uppercase;animation:mpVicSub 0.6s 0.7s ease both;">${['Out of all warriors, you were the fastest','The others could not keep up','Your fingers moved like lightning','No mistake. No mercy. No equal.','They never had a chance','Swift as the wind. Sharp as steel.','The path of the blade is yours alone','Your rivals watch in silence','Untouchable. Unbreakable.','The fastest hands claim the throne','Even the shadows could not match you','You did not hesitate. They did.','Born to dominate the keys','The warriors fell, one by one. You remained.','Speed is a language. You spoke fluently.','Your ancestors are proud.','The quickest blade wins. Always.','Others trained. You were built different.','Not even close.','The battlefield remembers only the victor.','Absolute dominance.','You made it look easy.','The rest are still catching up.','Some are born warriors. You proved it today.','The throne belongs to the swiftest.','Victory was never in doubt.','Your hands moved before they could think.','They typed. You hunted.','The graveyard fills with those who were second.','Not a race. An execution.','You didn\'t win. They lost.','The gap was embarrassing.','Blink and you\'d have missed it.','They brought fingers. You brought fury.','Mercy is for the weak. You showed none.','A lion doesn\'t explain itself to sheep.','The moment they saw you, it was already over.','You are the reason they practice.','Built different. Proven today.','Catastrophic for the others.','They\'ll remember this loss.','You didn\'t just win. You made a statement.'][Math.floor(Math.random()*42)]}</div>
  `;
  document.body.appendChild(victoryOverlay);

  // Inject animations
  if (!document.getElementById('mp-vic-styles')) {
    const style = document.createElement('style');
    style.id = 'mp-vic-styles';
    style.textContent = `
      @keyframes mpVicCrown { from { transform:translateY(-30px) scale(0.5); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }
      @keyframes mpVicText { from { transform:scale(0.7); opacity:0; letter-spacing:20px; } to { transform:scale(1); opacity:1; letter-spacing:8px; } }
      @keyframes mpVicLine { from { width:0; opacity:0; } to { width:120px; opacity:1; } }
      @keyframes mpVicSub { from { transform:translateY(10px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    `;
    document.head.appendChild(style);
  }

  // Fade out after 2.5s — reveal words with other players' emojis
  setTimeout(() => {
    victoryOverlay.style.opacity = '0';
    setTimeout(() => victoryOverlay.remove(), 800);
  }, 2500);

  const hInput = document.getElementById('h-input');
  if (hInput) hInput.disabled = true;

  clearInterval(progressInterval);
};

// ═══════════════════════════════════════════════════════════
// VISUAL MODE REVERT (restore player's original mode after race)
// ═══════════════════════════════════════════════════════════

function revertVisualMode() {
  // Hide hagakure UI if it was showing
  const hUI = document.getElementById('hagakure-ui');
  if (hUI) hUI.classList.add('hidden');
  // Remove hagakure death overlay if present
  const deathOverlay = document.getElementById('mp-hag-death-overlay');
  if (deathOverlay) deathOverlay.remove();
  // Re-enable hidden input (disabled on hagakure death)
  const hiddenInput = document.getElementById('hidden-input');
  if (hiddenInput) hiddenInput.disabled = false;
  // Show normal game UI
  const gameUI = document.getElementById('game-ui');
  if (gameUI) gameUI.classList.remove('hidden');

  if (mpState._savedUiMode !== null && window.applyThemeForMultiplayer) {
    window.applyThemeForMultiplayer(mpState._savedUiMode, mpState._savedCleanTheme);
    mpState._savedUiMode = null;
    mpState._savedCleanTheme = null;
  }

  // Reset typing engine so zen/clean mode starts fresh (not mid-test from MP keystrokes)
  if (window.resetTypingEngine) window.resetTypingEngine();
}

// Aliases so existing hooks still work
const showKing = showCrown;
const hideKing = hideCrown;
function updateKingState(isLeader) { updateCrownState(isLeader); }


// ═══════════════════════════════════════════════════════════
// UI — COUNTDOWN
// ═══════════════════════════════════════════════════════════

const COUNTDOWN_SKINS = [
  'skin-portal','skin-blade','skin-glitch','skin-fire','skin-ink',
  'skin-shock','skin-grav','skin-pulse','skin-warp','skin-nova'
];
const COUNTDOWN_WORD_SETS = [
  null, // null = classic 3 2 1 GO
  ['BREATHE', 'FOCUS', 'FIGHT!'],
  ['READY', 'STEADY', 'STRIKE!'],
  ['LOCK IN', 'AIM', 'DESTROY!'],
  ['SILENCE', 'TENSION', 'WAR!'],
  ['INHALE', 'EXHALE', 'KILL!'],
  ['CALM', 'STORM', 'CHAOS!'],
  ['STEEL', 'BLADE', 'BLOOD!'],
];

let currentCountdownSkin = 'skin-portal';
let currentWordSet = null; // null = classic

function startCountdownUI(seconds) {
  const overlay = document.getElementById('mp-countdown');
  const numEl = document.getElementById('mp-countdown-number');
  // Skin + word set already set by room:countdown from server
  overlay.classList.remove('hidden');
  overlay.className = `count-${seconds} ${currentCountdownSkin}`;
  numEl.textContent = currentWordSet ? currentWordSet[0] : seconds;
  if (currentWordSet) {
    numEl.style.fontSize = '4.5rem';
    numEl.style.letterSpacing = '6px';
  } else {
    numEl.style.fontSize = '';
    numEl.style.letterSpacing = '';
  }
}

function updateCountdownUI(seconds) {
  const overlay = document.getElementById('mp-countdown');
  const numEl = document.getElementById('mp-countdown-number');

  if (seconds <= 0) {
    // handled by game:start
    return;
  }

  // Reset animation
  numEl.style.animation = 'none';
  overlay.style.animation = 'none';
  void numEl.offsetWidth;
  numEl.style.animation = '';
  overlay.style.animation = '';

  overlay.className = `count-${seconds} ${currentCountdownSkin}`;

  if (currentWordSet) {
    const idx = 3 - seconds; // 3→0, 2→1, 1→2
    if (idx < currentWordSet.length) {
      const isLast = idx === currentWordSet.length - 1;
      numEl.textContent = currentWordSet[idx];
      numEl.style.fontSize = isLast ? '5.5rem' : '4.5rem';
      numEl.style.letterSpacing = isLast ? '8px' : '6px';
      // Last word of word set — apply GO styling
      if (isLast) {
        overlay.className = `count-go ${currentCountdownSkin}`;
      }
    }
  } else {
    numEl.textContent = seconds;
    numEl.style.fontSize = '';
    numEl.style.letterSpacing = '';
  }

  // Screen shake on 1
  if (seconds === 1) {
    document.body.style.animation = 'mpShake 0.4s ease-in-out';
    setTimeout(() => document.body.style.animation = '', 400);
  }
}

// ═══════════════════════════════════════════════════════════
// UI — RESULTS (PODIUM)
// ═══════════════════════════════════════════════════════════

let resultsAnimId = null;

function showRaceResults(standings) {
  document.getElementById('results-overlay')?.classList.add('hidden');
  document.getElementById('mp-race-bar').classList.add('hidden');
  // Don't restore time-modes/nav yet — they'll be restored when leaving results

  // Disable all typing inputs so keys don't trigger sounds/particles on results screen
  const hiddenInput = document.getElementById('hidden-input');
  const hInput = document.getElementById('h-input');
  if (hiddenInput) { hiddenInput.disabled = true; hiddenInput.blur(); }
  if (hInput) { hInput.disabled = true; hInput.blur(); }

  const canvas = document.getElementById('mp-results-canvas');
  if (!canvas) return;

  const W = 620, H = 540;
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
  standings.forEach((s, i) => {
    raceRankMap.set(s.playerId, i + 1);
    playerWpmMap.set(s.playerId, s.wpm);
  });
  raceWinnerId = standings[0]?.playerId || null;

  // Big race complete divider with rankings
  const el = document.getElementById('mp-chat-messages');
  if (el) {
    const div = document.createElement('div');
    div.className = 'mp-chat-race-divider';
    // Winner (podium center - elevated)
    const w = standings[0];
    const winnerHtml = w ? `
      <div class="mp-podium-winner">
        <div class="mp-podium-crown">👑</div>
        <div class="mp-podium-emoji">${escapeHtml(w.emoji)}</div>
        <div class="mp-podium-name">${escapeHtml(w.username)}</div>
        <div class="mp-podium-wpm">${Number(w.wpm) || 0} <small>WPM</small></div>
        <div class="mp-podium-acc-bar"><div class="mp-podium-acc-fill" style="width:${Math.min(100, Math.max(0, Number(w.accuracy) || 0))}%"></div></div>
        <div class="mp-podium-acc-label">${Math.round(w.accuracy || 0)}% acc</div>
      </div>` : '';

    // Runner-ups (smaller rows below podium)
    const runnersHtml = standings.slice(1).map((s, i) => {
      const medals = ['🥈', '🥉'];
      const medal = medals[i] || `#${i + 2}`;
      const colorClass = i === 0 ? 'silver' : i === 1 ? 'bronze' : '';
      return `<div class="mp-chat-rank-row ${colorClass}">
        <span class="mp-rank-medal">${medal}</span>
        <span class="mp-rank-emoji">${escapeHtml(s.emoji)}</span>
        <span class="mp-rank-name">${escapeHtml(s.username)}</span>
        <div class="mp-rank-stats">
          <span class="mp-rank-wpm">${Number(s.wpm) || 0} <small>WPM</small></span>
          <div class="mp-rank-acc-bar"><div class="mp-rank-acc-fill ${colorClass}" style="width:${Math.min(100, Math.max(0, Number(s.accuracy) || 0))}%"></div></div>
        </div>
      </div>`;
    }).join('');

    div.innerHTML = `
      <div class="mp-chat-results-card">
        <div class="mp-chat-results-header">
          <span class="mp-results-trophy">⚔</span>
          <span class="mp-results-title">BATTLE OVER</span>
        </div>
        <div class="mp-podium-section">${winnerHtml}</div>
        ${runnersHtml ? `<div class="mp-chat-rankings">${runnersHtml}</div>` : ''}
      </div>
    `;
    const typingEl = document.getElementById('mp-chat-typing');
    if (typingEl && el.contains(typingEl)) el.insertBefore(div, typingEl);
    else el.appendChild(div);
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

  // Sparkle particles floating up from winner area
  const parts = [];
  for (let i = 0; i < 60; i++) {
    parts.push({
      x: W / 2 + (Math.random() - 0.5) * 180,
      y: 180 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.4 - Math.random() * 1.2,
      life: 0.5 + Math.random() * 0.5,
      decay: 0.003 + Math.random() * 0.004,
      size: 1 + Math.random() * 2.5,
      color: ['#ffd700', '#ffaa00', '#ff6644', '#ff3344', '#ffcc44'][Math.floor(Math.random() * 5)]
    });
  }

  const _resultsStart = performance.now();

  function drawWanted(time) {
    resultsAnimId = requestAnimationFrame(drawWanted);
    var t = (time - _resultsStart) / 1000;
    var ease  = function(v) { v = Math.min(1,Math.max(0,v)); return 1-Math.pow(1-v,3); };
    var slam  = function(v) { v = Math.min(1,Math.max(0,v)); return 1-Math.pow(1-v,4); }; // faster ease
    var fa    = function(v) { return Math.min(1,Math.max(0,v)); };
    var wipe  = function(t0,dur) { return ease((t-t0)/dur); };

    ctx.clearRect(0, 0, W, H);

    // === WANTED POSTER BACKGROUND ===
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 4);
    ctx.fillStyle = "rgba(192,152,88,1)";
    ctx.fill();
    roundRect(ctx, 0, 0, W, H, 4);
    ctx.clip();

    // Age stains - irregular darker patches
    var stains = [
      {x:0.1,y:0.1,r:0.18,a:0.08}, {x:0.9,y:0.15,r:0.12,a:0.06},
      {x:0.05,y:0.8,r:0.2,a:0.07}, {x:0.85,y:0.75,r:0.15,a:0.09},
      {x:0.5,y:0.05,r:0.25,a:0.05}, {x:0.5,y:0.95,r:0.22,a:0.06}
    ];
    stains.forEach(function(s) {
      var sg = ctx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, s.r*W);
      sg.addColorStop(0, "rgba(80,45,10,"+s.a+")");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg; ctx.fillRect(0,0,W,H);
    });

    // Vignette — dark edges
    var vig = ctx.createRadialGradient(W/2,H/2,H*0.25, W/2,H/2,H*0.75);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(40,20,5,0.35)");
    ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);

    // Horizontal grain lines
    for (var gi=0; gi<24; gi++) {
      ctx.fillStyle = gi%2===0 ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)";
      ctx.fillRect(0, gi*(H/24), W, H/24);
    }
    ctx.restore();

    // === OUTER DOUBLE BORDER ===
    var bA = fa(wipe(0.05,0.4));
    if (bA > 0) {
      ctx.save(); ctx.globalAlpha = bA;
      // Outer
      roundRect(ctx, 6, 6, W-12, H-12, 3);
      ctx.strokeStyle = "rgba(55,28,5,0.7)"; ctx.lineWidth = 3; ctx.stroke();
      // Inner
      roundRect(ctx, 14, 14, W-28, H-28, 2);
      ctx.strokeStyle = "rgba(55,28,5,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    // === "WANTED" ===
    var wantedScale = slam(fa((t-0.05)*6));
    if (wantedScale > 0) {
      ctx.save();
      ctx.globalAlpha = fa((t-0.05)*8);
      ctx.translate(W/2, 56);
      ctx.scale(0.3 + wantedScale*0.7, 0.3 + wantedScale*0.7);
      // Press shadow first
      ctx.font = "900 76px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(100,50,10,0.2)";
      ctx.fillText("WANTED", 2, 3);
      // Main text
      ctx.fillStyle = "rgba(32,10,2,0.93)";
      ctx.fillText("WANTED", 0, 0);
      ctx.restore();
    }

    // === "DEAD OR ALIVE" subtext ===
    var subA = fa(wipe(0.25,0.3));
    if (subA > 0) {
      ctx.save(); ctx.globalAlpha = subA;
      ctx.font = "600 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(32,10,2,0.4)";
      ctx.letterSpacing = "0.35em";
      ctx.fillText("DEAD  OR  ALIVE", W/2, 88);
      ctx.restore();
    }

    // === TOP ORNAMENT LINE ===
    var ornA = fa(wipe(0.2,0.35));
    if (ornA > 0) {
      ctx.save(); ctx.globalAlpha = ornA;
      // Double rule
      ctx.strokeStyle = "rgba(55,28,5,0.55)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(26,100); ctx.lineTo(W-26,100); ctx.stroke();
      ctx.strokeStyle = "rgba(55,28,5,0.3)"; ctx.lineWidth = 0.75;
      ctx.beginPath(); ctx.moveTo(26,104); ctx.lineTo(W-26,104); ctx.stroke();
      // Diamond ornaments — left, center, right
      [W/4, W/2, (W*3)/4].forEach(function(dx) {
        ctx.save(); ctx.translate(dx, 102); ctx.rotate(Math.PI/4);
        ctx.fillStyle = "rgba(55,28,5,0.55)";
        ctx.fillRect(-3,-3,6,6);
        ctx.restore();
      });
      ctx.restore();
    }

    // === MUGSHOT — winner emoji in oval frame ===
    var mugA = fa(wipe(0.3,0.4));
    if (mugA > 0) {
      ctx.save(); ctx.globalAlpha = mugA;
      var mX = W/2, mY = 168, mRx = 46, mRy = 52;
      // Outer oval shadow
      ctx.beginPath(); ctx.ellipse(mX+1, mY+2, mRx, mRy, 0, 0, Math.PI*2);
      ctx.fillStyle = "rgba(30,10,2,0.15)"; ctx.fill();
      // Oval fill
      ctx.beginPath(); ctx.ellipse(mX, mY, mRx, mRy, 0, 0, Math.PI*2);
      ctx.fillStyle = "rgba(155,112,50,0.55)"; ctx.fill();
      // Outer stroke
      ctx.strokeStyle = "rgba(45,18,3,0.7)"; ctx.lineWidth = 2.5; ctx.stroke();
      // Inner hairline
      ctx.beginPath(); ctx.ellipse(mX, mY, mRx-7, mRy-7, 0, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(45,18,3,0.2)"; ctx.lineWidth = 1; ctx.stroke();
      // Emoji
      ctx.font = "48px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(winner && winner.emoji ? winner.emoji : "\uD83D\uDC64", mX, mY);
      ctx.restore();
    }

    // === WINNER NAME — big slam ===
    var nameA = fa(wipe(0.5,0.3));
    if (nameA > 0) {
      ctx.save();
      ctx.globalAlpha = nameA;
      var nameScale = 0.55 + slam(fa((t-0.5)*5))*0.45;
      ctx.translate(W/2, 238); ctx.scale(nameScale, nameScale);
      ctx.font = "900 38px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      // Press shadow
      ctx.fillStyle = "rgba(100,50,10,0.18)";
      ctx.fillText((winner ? winner.username || "UNKNOWN" : "UNKNOWN").toUpperCase(), 2, 3);
      // Main
      ctx.fillStyle = "rgba(32,10,2,0.92)";
      ctx.fillText((winner ? winner.username || "UNKNOWN" : "UNKNOWN").toUpperCase(), 0, 0);
      ctx.restore();
      // "you" tag
      if (winnerIsYou) {
        ctx.save(); ctx.globalAlpha = nameA * 0.5;
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(32,10,2,1)";
        ctx.fillText("( you )", W/2, 258);
        ctx.restore();
      }
    }

    // === REWARD DIVIDER ===
    var rewDivA = fa(wipe(0.65,0.3));
    if (rewDivA > 0) {
      ctx.save(); ctx.globalAlpha = rewDivA;
      ctx.strokeStyle = "rgba(55,28,5,0.45)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(26,288); ctx.lineTo(W-26,288); ctx.stroke();
      ctx.strokeStyle = "rgba(55,28,5,0.25)"; ctx.lineWidth = 0.75;
      ctx.beginPath(); ctx.moveTo(26,292); ctx.lineTo(W-26,292); ctx.stroke();
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(32,10,2,0.55)";
      ctx.fillText("\u2605   R E W A R D   \u2605", W/2, 290);
      ctx.restore();
    }

    // === STATS as REWARD AMOUNTS ===
    var statsA = fa(wipe(0.7,0.35));
    if (statsA > 0) {
      var animWpm   = Math.round((winner && winner.wpm ? winner.wpm : 0) * ease(t/1.1));
      var animAcc   = Math.round((winner && winner.accuracy ? winner.accuracy : 0) * ease(t/1.1));
      var animWords = Math.round((winner && winner.wordsCompleted ? winner.wordsCompleted : 0) * ease(t/1.1));
      var statDefs  = [
        {val: String(animWpm),   label: "W P M",         x: W/2-150},
        {val: animAcc+"%",       label: "A C C U R A C Y", x: W/2    },
        {val: String(animWords), label: "W O R D S",      x: W/2+150},
      ];
      ctx.save(); ctx.globalAlpha = statsA;
      statDefs.forEach(function(s) {
        // Big value
        ctx.font = "900 30px serif";
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        // Shadow
        ctx.fillStyle = "rgba(100,50,10,0.15)";
        ctx.fillText(s.val, s.x+1, 337);
        // Main
        ctx.fillStyle = "rgba(32,10,2,0.88)";
        ctx.fillText(s.val, s.x, 336);
        // Label — spaced mono
        ctx.font = "600 7px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(32,10,2,0.35)";
        ctx.fillText(s.label, s.x, 350);
      });
      // Thin vertical dividers between stats
      ctx.strokeStyle = "rgba(55,28,5,0.2)"; ctx.lineWidth = 1;
      [W/2-75, W/2+75].forEach(function(dx) {
        ctx.beginPath(); ctx.moveTo(dx, 310); ctx.lineTo(dx, 352); ctx.stroke();
      });
      ctx.restore();
    }

    // === BOTTOM DIVIDER ===
    var botDivA = fa(wipe(0.85,0.3));
    if (botDivA > 0) {
      ctx.save(); ctx.globalAlpha = botDivA;
      ctx.strokeStyle = "rgba(55,28,5,0.45)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(26,364); ctx.lineTo(W-26,364); ctx.stroke();
      ctx.strokeStyle = "rgba(55,28,5,0.25)"; ctx.lineWidth = 0.75;
      ctx.beginPath(); ctx.moveTo(26,368); ctx.lineTo(W-26,368); ctx.stroke();
      ctx.font = "700 8px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(32,10,2,0.45)";
      ctx.fillText("\u2605   A L S O   W A N T E D   \u2605", W/2, 366);
      ctx.restore();
    }

    // === DEFEATED PLAYERS ===
    var rowStartY = 388, rowH = 40;
    standings.slice(1).forEach(function(s, i) {
      var rA = fa(wipe(0.9 + i*0.1, 0.3));
      if (rA <= 0) return;
      var ry = rowStartY + i*rowH;
      var isYou = s.playerId === mpState.localPlayerId;
      var rank = getRank(s.wpm);

      ctx.save(); ctx.globalAlpha = rA;

      // rank in brackets
      ctx.font = "700 9px 'JetBrains Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(32,10,2,0.4)";
      ctx.fillText("[#"+s.rank+"]", 50, ry);

      // emoji
      ctx.font = "15px serif"; ctx.fillText(s.emoji, 94, ry);

      // name uppercase
      ctx.font = (isYou?"700":"500") + " 13px serif";
      ctx.fillStyle = isYou ? "rgba(35,12,3,0.82)" : "rgba(35,12,3,0.5)";
      ctx.fillText((s.username||"").toUpperCase()+(isYou?" (you)":""), 115, ry);

      // wpm + acc right side
      var wVal = Math.round(s.wpm * ease(t/1.1));
      var aVal = Math.round((s.accuracy || 0) * ease(t/1.1));
      ctx.font = "800 13px serif"; ctx.textAlign = "right";
      ctx.fillStyle = "rgba(35,12,3,0.5)";
      ctx.fillText(wVal+" wpm  ·  "+aVal+"%", W-50, ry);

      ctx.restore();
    });

    // === FOOTER — issuing authority ===
    var footA = fa(wipe(1.0,0.4));
    if (footA > 0) {
      ctx.save(); ctx.globalAlpha = footA * 0.35;
      ctx.font = "600 7px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillStyle = "rgba(35,12,3,1)";
      ctx.fillText("BY ORDER OF THE ZENTYPE GUILD  •  NO MERCY FOR SLOW FINGERS", W/2, H-18);
      ctx.restore();
    }

    // === DUST MOTES — poster-appropriate ===
    var dustCols = ["rgba(80,50,15,0.2)","rgba(60,35,10,0.15)","rgba(100,65,20,0.18)"];
    parts.forEach(function(p) {
      p.x += p.vx * 0.3; p.y += p.vy * 0.15; p.life -= p.decay * 0.5;
      p.vx += (Math.random()-0.5)*0.05;
      if (p.life <= 0) {
        p.x = 30 + Math.random()*(W-60); p.y = 30 + Math.random()*(H-60);
        p.vx = (Math.random()-0.5)*0.2; p.vy = (Math.random()-0.5)*0.1;
        p.life = 0.8+Math.random()*0.2; p.decay = 0.002+Math.random()*0.002;
        p.size = 0.8+Math.random()*1.5;
        p.color = dustCols[Math.floor(Math.random()*dustCols.length)];
      }
      ctx.save();
      ctx.globalAlpha = p.life * 0.4 * Math.min(1, t);
      ctx.fillStyle = p.color || dustCols[0];
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }
  function drawDuel(time) {
    resultsAnimId = requestAnimationFrame(drawDuel);
    var t = (time - _resultsStart) / 1000;
    var ease  = function(v) { v = Math.min(1,Math.max(0,v)); return 1-Math.pow(1-v,3); };
    var slam  = function(v) { v = Math.min(1,Math.max(0,v)); return 1-Math.pow(1-v,4); };
    var fa    = function(v) { return Math.min(1,Math.max(0,v)); };

    ctx.clearRect(0, 0, W, H);

    // === BACKGROUND ===
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.fillStyle = "rgba(4,2,3,0.99)";
    ctx.fill();
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.clip();

    // Crimson radial glow at top center
    var cg = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, H*0.7);
    cg.addColorStop(0, "rgba(140,10,5,0.18)");
    cg.addColorStop(1, "transparent");
    ctx.fillStyle = cg; ctx.fillRect(0,0,W,H);
    ctx.restore();

    // Border
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.strokeStyle = "rgba(160,30,15,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // === DIAGONAL SLASH ===
    if (t > 0.05) {
      var slashProg = ease((t-0.05)/0.35);
      var slashAlpha = t > 0.6 ? Math.max(0.15, 1 - (t-0.6)*2) : 0.85;
      ctx.save();
      ctx.globalAlpha = slashAlpha;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W*slashProg, H*slashProg); ctx.stroke();
      ctx.restore();
    }

    // === CRIMSON SPLATTERS ===
    if (t > 0.3) {
      ctx.save();
      ctx.globalAlpha = fa((t-0.3)*4);
      var sp1 = ctx.createRadialGradient(W*0.2, H*0.15, 0, W*0.2, H*0.15, 150);
      sp1.addColorStop(0, "rgba(140,15,5,0.18)"); sp1.addColorStop(1, "transparent");
      ctx.fillStyle = sp1; ctx.fillRect(0,0,W,H);
      var sp2 = ctx.createRadialGradient(W*0.7, H*0.7, 0, W*0.7, H*0.7, 120);
      sp2.addColorStop(0, "rgba(140,15,5,0.18)"); sp2.addColorStop(1, "transparent");
      ctx.fillStyle = sp2; ctx.fillRect(0,0,W,H);
      ctx.restore();
    }

    // === "勝" KANJI ===
    if (t > 0.5) {
      var kanjiScale = 2.0 - slam(fa((t-0.5)/0.3)) * 1.0;
      ctx.save();
      ctx.globalAlpha = fa((t-0.5)*5) * 0.65;
      ctx.translate(W/2, 65);
      ctx.scale(kanjiScale, kanjiScale);
      ctx.font = "80px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(180,30,15,0.65)";
      ctx.fillText("勝", 0, 0);
      ctx.restore();
    }

    // === WINNER EMOJI ===
    if (t > 0.7) {
      ctx.save();
      ctx.globalAlpha = fa((t-0.7)*5);
      ctx.font = "48px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(winner && winner.emoji ? winner.emoji : "👤", W/2, 160);
      ctx.restore();
    }

    // === WINNER NAME ===
    if (t > 0.9) {
      ctx.save();
      ctx.globalAlpha = fa((t-0.9)*5);
      ctx.font = "800 26px 'Outfit', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(winner ? winner.username || "UNKNOWN" : "UNKNOWN", W/2, 215);
      ctx.restore();
    }

    // === RANK ===
    if (t > 1.0) {
      ctx.save();
      ctx.globalAlpha = fa((t-1.0)*5);
      ctx.font = "800 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = winnerRank.color;
      ctx.fillText(winnerRank.title, W/2, 238);
      ctx.restore();
    }

    // === STATS ROW ===
    if (t > 1.1) {
      var sA = fa((t-1.1)*4);
      var animWpm   = Math.round((winner && winner.wpm ? winner.wpm : 0) * ease(t/1.5));
      var animAcc   = Math.round((winner && winner.accuracy ? winner.accuracy : 0) * ease(t/1.5));
      var animWords = Math.round((winner && winner.wordsCompleted ? winner.wordsCompleted : 0) * ease(t/1.5));
      var statItems = [
        {val: String(animWpm), label: "WPM", x: W/2-140, color: "#ffd700"},
        {val: animAcc+"%", label: "ACC", x: W/2, color: "#00d4ff"},
        {val: String(animWords), label: "WORDS", x: W/2+140, color: "#ff8844"}
      ];
      ctx.save(); ctx.globalAlpha = sA;
      statItems.forEach(function(s) {
        ctx.font = "800 24px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = s.color;
        ctx.fillText(s.val, s.x, 285);
        ctx.font = "700 7px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(s.label, s.x, 298);
      });
      ctx.restore();
    }

    // === "— DEFEATED —" ===
    if (t > 1.3) {
      ctx.save();
      ctx.globalAlpha = fa((t-1.3)*4);
      ctx.font = "700 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(180,30,15,0.4)";
      ctx.fillText("— DEFEATED —", W/2, 330);
      ctx.restore();
    }

    // === DEFEATED PLAYERS ===
    var dRowY = 356, dRowH = 42;
    standings.slice(1).forEach(function(s, i) {
      var rT = 1.5 + i*0.12;
      if (t <= rT) return;
      var rA = fa((t-rT)*4);
      var ry = dRowY + i*dRowH;
      var slideX = (1 - ease((t-rT)/0.3)) * 60;
      var isYou = s.playerId === mpState.localPlayerId;
      var rank = getRank(s.wpm);

      ctx.save(); ctx.globalAlpha = rA;
      ctx.translate(slideX, 0);

      // Card background
      roundRect(ctx, 40, ry-14, W-80, dRowH-4, 6);
      ctx.fillStyle = "rgba(255,255,255,0.025)"; ctx.fill();
      roundRect(ctx, 40, ry-14, W-80, dRowH-4, 6);
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; ctx.stroke();

      // Rank bracket
      ctx.font = "700 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("[#"+s.rank+"]", 52, ry);

      // Emoji
      ctx.font = "15px serif"; ctx.fillText(s.emoji, 96, ry);

      // Name
      ctx.font = (isYou?"700":"500") + " 13px 'Outfit', sans-serif";
      ctx.fillStyle = isYou ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)";
      ctx.fillText((s.username||"")+(isYou?" (you)":""), 118, ry);

      // WPM + ACC right side
      var wVal = Math.round(s.wpm * ease(t/1.5));
      var aVal = Math.round((s.accuracy || 0) * ease(t/1.5));
      ctx.font = "800 13px 'JetBrains Mono', monospace"; ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(wVal+" wpm  ·  "+aVal+"%", W-52, ry);

      ctx.restore();
    });

    // === PARTICLES — crimson embers rising ===
    var emberCols = ["#ff3322","#ff6633","#ffaa44"];
    parts.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.vy -= 0.025; p.life -= p.decay;
      if (p.life <= 0 || p.y < -10) {
        p.x = W/2 - 80 + Math.random()*160; p.y = 140 + Math.random()*40;
        p.vx = (Math.random()-0.5)*0.6; p.vy = -(0.4 + Math.random()*1.0);
        p.life = 0.5+Math.random()*0.5; p.decay = 0.004+Math.random()*0.004;
        p.size = 1+Math.random()*2.5;
        p.color = emberCols[Math.floor(Math.random()*emberCols.length)];
      }
      ctx.save();
      ctx.globalAlpha = p.life * 0.6 * Math.min(1, t*2);
      ctx.fillStyle = p.color || "#ff3322";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }
  function drawInk(time) {
    resultsAnimId = requestAnimationFrame(drawInk);
    var t = (time - _resultsStart) / 1000;
    var ease  = function(v) { v = Math.min(1,Math.max(0,v)); return 1-Math.pow(1-v,3); };
    var fa    = function(v) { return Math.min(1,Math.max(0,v)); };
    var wipe  = function(t0,dur) { return ease((t-t0)/dur); };

    ctx.clearRect(0, 0, W, H);

    // === BACKGROUND ===
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.fillStyle = "rgba(5,4,6,0.99)";
    ctx.fill();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.clip();

    // Paper grain bands
    for (var gi=0; gi<12; gi++) {
      ctx.fillStyle = gi%2===0 ? "rgba(255,255,255,0.004)" : "rgba(0,0,0,0.06)";
      ctx.fillRect(0, gi*(H/12), W, H/12);
    }

    // Warm center vignette
    var vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.7);
    vig.addColorStop(0, "rgba(40,10,5,0.15)");
    vig.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);
    ctx.restore();

    // Border
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    // === "勝" WATERMARK ===
    if (t > 0.1) {
      ctx.save();
      ctx.globalAlpha = fa((t-0.1)*4) * 0.18;
      ctx.font = "120px serif";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(160,20,10,1)";
      ctx.fillText("勝", 18, 40);
      ctx.restore();
    }

    // === WINNER SECTION (ink wipe) ===
    if (t > 0.2) {
      var winWipe = wipe(0.2, 0.3);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 70, winWipe * W, 140); ctx.clip();

      // Emoji
      ctx.font = "52px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(winner && winner.emoji ? winner.emoji : "👤", W/2, 110);

      // Name
      ctx.font = "800 30px 'Outfit', sans-serif";
      ctx.fillStyle = "rgba(245,232,215,0.95)";
      ctx.fillText(winner ? winner.username || "UNKNOWN" : "UNKNOWN", W/2, 170);

      // Rank
      ctx.save();
      ctx.shadowColor = winnerRank.color;
      ctx.shadowBlur = 6;
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.fillStyle = winnerRank.color;
      ctx.fillText(winnerRank.title, W/2, 192);
      ctx.restore();

      ctx.restore();
    }

    // === RED INK BRUSH DIVIDER ===
    if (t > 0.7) {
      var divA = fa((t-0.7)*5);
      ctx.save(); ctx.globalAlpha = divA;
      var brushGrad = ctx.createLinearGradient(40, 218, W-40, 218);
      brushGrad.addColorStop(0, "rgba(160,20,10,0.6)");
      brushGrad.addColorStop(1, "rgba(160,20,10,0.1)");
      ctx.strokeStyle = brushGrad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40, 218); ctx.lineTo(W-40, 218); ctx.stroke();
      ctx.strokeStyle = "rgba(160,20,10,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, 220); ctx.lineTo(W-40, 220); ctx.stroke();
      ctx.restore();
    }

    // === STATS (staggered) ===
    if (t > 0.75) {
      var animWpm   = Math.round((winner && winner.wpm ? winner.wpm : 0) * ease(t/1.5));
      var animAcc   = Math.round((winner && winner.accuracy ? winner.accuracy : 0) * ease(t/1.5));
      var animWords = Math.round((winner && winner.wordsCompleted ? winner.wordsCompleted : 0) * ease(t/1.5));
      var statCols = [
        {val: String(animWpm), label: "WPM", x: W/2-140, delay: 0.75, underline: true},
        {val: animAcc+"%", label: "ACC", x: W/2, delay: 0.85, underline: false},
        {val: String(animWords), label: "WORDS", x: W/2+140, delay: 0.95, underline: false}
      ];
      statCols.forEach(function(s) {
        if (t <= s.delay) return;
        var sA = fa((t-s.delay)*4);
        ctx.save(); ctx.globalAlpha = sA;
        ctx.font = "800 32px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgba(245,232,215,0.92)";
        ctx.fillText(s.val, s.x, 268);
        if (s.underline) {
          var tw = ctx.measureText(s.val).width;
          ctx.strokeStyle = "rgba(160,20,10,0.6)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(s.x - tw/2, 272); ctx.lineTo(s.x + tw/2, 272); ctx.stroke();
        }
        ctx.font = "700 8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillText(s.label, s.x, 286);
        ctx.restore();
      });
    }

    // === "敗者" LABEL ===
    if (t > 1.1) {
      ctx.save();
      ctx.globalAlpha = fa((t-1.1)*4);
      ctx.font = "700 8px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(160,20,10,0.35)";
      ctx.fillText("敗者", W/2, 320);
      ctx.restore();
    }

    // === DEFEATED ROWS (wipe clip) ===
    var iRowY = 342, iRowH = 36;
    standings.slice(1).forEach(function(s, i) {
      var rT = 1.2 + i*0.12;
      if (t <= rT) return;
      var rWipe = wipe(rT, 0.3);
      var ry = iRowY + i*iRowH;
      var isYou = s.playerId === mpState.localPlayerId;
      var rank = getRank(s.wpm);
      var pColor = PLAYER_COLORS[i % PLAYER_COLORS.length];

      ctx.save();
      ctx.beginPath(); ctx.rect(0, ry-14, rWipe * W, iRowH); ctx.clip();

      // Rank bracket
      ctx.font = "700 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(160,20,10,0.45)";
      ctx.fillText("[#"+s.rank+"]", 50, ry);

      // Emoji
      ctx.font = "15px serif"; ctx.fillText(s.emoji, 94, ry);

      // Name
      ctx.font = (isYou?"700":"500") + " 13px 'Outfit', sans-serif";
      ctx.fillStyle = isYou ? "rgba(245,232,215,0.85)" : "rgba(245,232,215,0.45)";
      ctx.fillText((s.username||"")+(isYou?" · you":""), 115, ry);

      // WPM + ACC right side in player color
      var wVal = Math.round(s.wpm * ease(t/1.5));
      var aVal = Math.round((s.accuracy || 0) * ease(t/1.5));
      ctx.font = "800 13px 'JetBrains Mono', monospace"; ctx.textAlign = "right";
      ctx.fillStyle = pColor;
      ctx.fillText(wVal+" wpm  ·  "+aVal+"%", W-50, ry);

      ctx.restore();
    });

    // === PARTICLES — dark ink drops falling ===
    parts.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.015; p.life -= p.decay;
      if (p.life <= 0 || p.y > H+10) {
        p.x = Math.random()*W; p.y = -6;
        p.vx = (Math.random()-0.5)*0.3; p.vy = 0.3+Math.random()*0.5;
        p.life = 0.5+Math.random()*0.5; p.decay = 0.003+Math.random()*0.004;
        p.size = 1+Math.random()*2;
        p.color = "rgba(160,20,10,0.6)";
      }
      ctx.save();
      ctx.globalAlpha = p.life * 0.5 * Math.min(1, t*1.5);
      ctx.fillStyle = p.color || "rgba(160,20,10,0.6)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size*0.5, p.size, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }

  function drawCinematic(time) {
    resultsAnimId = requestAnimationFrame(drawCinematic);
    var t = (time - _resultsStart) / 1000;

    var ease = function(v) {
      v = Math.min(1, Math.max(0, v));
      return v * v * (3 - 2 * v);
    };
    var fadeBetween = function(tNow, tStart, tEnd) {
      return ease((tNow - tStart) / (tEnd - tStart));
    };

    // --- Background: pure black ---
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, W, H);

    // --- Letterbox bars ---
    ctx.fillStyle = "rgba(8,8,8,1)";
    ctx.fillRect(0, 0, W, 70);
    ctx.fillRect(0, H - 70, W, 70);

    // --- Letterbox border lines (Phase 2: 1.5-2.5s) ---
    if (t > 1.5) {
      var borderAlpha = fadeBetween(t, 1.5, 2.5) * 0.06;
      ctx.strokeStyle = "rgba(255,255,255," + borderAlpha + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(W, 70);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, H - 70);
      ctx.lineTo(W, H - 70);
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // --- Phase 3 (2.5-4.0s): Winner emoji fades in ---
    if (t > 2.5) {
      var emojiAlpha = fadeBetween(t, 2.5, 4.0);
      ctx.globalAlpha = emojiAlpha;
      ctx.font = "56px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillText(winner.emoji || "", W / 2, H / 2 - 50);
      ctx.globalAlpha = 1;
    }

    // --- Phase 4 (3.5-5.0s): Winner name fades in ---
    if (t > 3.5) {
      var nameAlpha = fadeBetween(t, 3.5, 5.0) * 0.85;
      ctx.globalAlpha = nameAlpha;
      ctx.font = "400 28px 'Outfit', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,1)";
      var nameStr = winner.username || "Winner";
      if (winnerIsYou) {
        ctx.fillText(nameStr, W / 2, H / 2 + 15);
        // dim " · you" suffix
        var nameWidth = ctx.measureText(nameStr).width;
        ctx.globalAlpha = nameAlpha * 0.4;
        ctx.font = "300 28px 'Outfit', sans-serif";
        ctx.fillText("", 0, 0); // reset
        var youStr = " \u00b7 you";
        ctx.font = "300 22px 'Outfit', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillText(youStr, W / 2 + nameWidth / 2 + ctx.measureText(youStr).width / 2, H / 2 + 15);
      } else {
        ctx.fillText(nameStr, W / 2, H / 2 + 15);
      }
      ctx.globalAlpha = 1;
    }

    // --- Phase 5 (4.5-5.8s): Rank title fades in ---
    if (t > 4.5) {
      var rankAlpha = fadeBetween(t, 4.5, 5.8) * 0.5;
      ctx.globalAlpha = rankAlpha;
      ctx.font = "300 10px 'JetBrains Mono', monospace";
      ctx.fillStyle = winnerRank.color || "rgba(255,255,255,1)";
      ctx.fillText(winnerRank.title || "", W / 2, H / 2 + 38);
      ctx.globalAlpha = 1;
    }

    // --- Phase 6 (5.5-7.0s): Stats line with count-up ---
    if (t > 5.5) {
      var statProgress = fadeBetween(t, 5.5, 7.0);
      ctx.globalAlpha = statProgress * 0.35;
      ctx.font = "300 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,1)";
      var countWpm = Math.round((winner.wpm || 0) * statProgress);
      var countAcc = Math.round((winner.accuracy || 0) * statProgress);
      var countWords = Math.round((winner.wordsCompleted || 0) * statProgress);
      var statsStr = countWpm + " wpm  \u00b7  " + countAcc + "%  \u00b7  " + countWords + " words";
      ctx.fillText(statsStr, W / 2, H / 2 + 70);
      ctx.globalAlpha = 1;
    }

    // --- Phase 8 / thin line (6.5-7.5s): Horizontal separator ---
    if (t > 6.5) {
      var lineAlpha = fadeBetween(t, 6.5, 7.5) * 0.06;
      ctx.strokeStyle = "rgba(255,255,255," + lineAlpha + ")";
      ctx.lineWidth = 1;
      var lineW = W * 0.6;
      ctx.beginPath();
      ctx.moveTo((W - lineW) / 2, H / 2 + 95);
      ctx.lineTo((W + lineW) / 2, H / 2 + 95);
      ctx.stroke();
    }

    // --- Phase 7 (7.0-8.0s): Defeated players ---
    if (t > 7.0 && standings.length > 1) {
      var defeated = standings.slice(1);
      for (var di = 0; di < defeated.length; di++) {
        var dPlayer = defeated[di];
        var dStart = 7.0 + di * 0.3;
        if (t <= dStart) continue;
        var dAlpha = fadeBetween(t, dStart, dStart + 1.0);
        var isMe = dPlayer.playerId === mpState.localPlayerId;
        var baseAlpha = isMe ? 0.35 : 0.2;
        ctx.globalAlpha = dAlpha * baseAlpha;
        ctx.font = "300 12px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,1)";
        var dRankNum = "#" + (di + 2);
        var dEmoji = dPlayer.emoji || "";
        var dName = dPlayer.username || "Player";
        var dWpm = Math.round((dPlayer.wpm || 0) * dAlpha);
        var dAcc = Math.round((dPlayer.accuracy || 0) * dAlpha);
        var dLine = dRankNum + "  " + dEmoji + "  " + dName + "  \u2014  " + dWpm + " wpm  ·  " + dAcc + "%";
        var dY = H / 2 + 110 + di * 26;
        ctx.fillText(dLine, W / 2, dY);
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawStainedGlass(time) {
    resultsAnimId = requestAnimationFrame(drawStainedGlass);
    var t = (time - _resultsStart) / 1000;
    var ease = function(v) { v = Math.min(1, Math.max(0, v)); return 1 - Math.pow(1 - v, 3); };
    var fa = function(v) { return Math.min(1, Math.max(0, v)); };

    ctx.clearRect(0, 0, W, H);

    // === Background: deep indigo-black ===
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.fillStyle = "rgba(8,5,15,1)";
    ctx.fill();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.clip();

    // === Stained glass panel definitions ===
    var panels = [
      // Top arch — triangles and diamonds
      {type:"tri", x:60,  y:10,  w:80,  h:70,  color:[180,20,40],  delay:0.1},
      {type:"diamond", x:170, y:5,   w:60,  h:80,  color:[20,60,180], delay:0.2},
      {type:"tri", x:260, y:10,  w:90,  h:65,  color:[20,160,60],  delay:0.15},
      {type:"diamond", x:370, y:5,   w:55,  h:75,  color:[200,150,20], delay:0.25},
      {type:"tri", x:460, y:10,  w:85,  h:70,  color:[130,40,180],  delay:0.18},
      // Left side — vertical rects
      {type:"rect", x:8,   y:100, w:35,  h:120, color:[20,60,180],  delay:0.3},
      {type:"rect", x:10,  y:240, w:30,  h:100, color:[220,180,40], delay:0.45},
      {type:"rect", x:5,   y:360, w:38,  h:90,  color:[180,20,40],  delay:0.55},
      // Right side — vertical rects
      {type:"rect", x:577, y:100, w:35,  h:120, color:[20,160,60],  delay:0.35},
      {type:"rect", x:580, y:240, w:30,  h:110, color:[130,40,180], delay:0.5},
      {type:"rect", x:575, y:370, w:38,  h:85,  color:[200,150,20], delay:0.6},
      // Bottom
      {type:"diamond", x:120, y:470, w:70,  h:55,  color:[220,180,40], delay:0.65},
      {type:"tri", x:310, y:480, w:90,  h:50,  color:[20,60,180],  delay:0.7},
      {type:"rect", x:460, y:475, w:80,  h:45,  color:[20,160,60],  delay:0.75}
    ];

    // === Draw each glass panel ===
    for (var pi = 0; pi < panels.length; pi++) {
      var pnl = panels[pi];
      var panelAlpha = fa((t - pnl.delay) * 2.5);
      if (panelAlpha <= 0) continue;

      var cx = pnl.x + pnl.w / 2;
      var cy = pnl.y + pnl.h / 2;
      var maxR = Math.max(pnl.w, pnl.h) * 0.7;
      var cr = pnl.color[0];
      var cg = pnl.color[1];
      var cb = pnl.color[2];

      ctx.save();
      ctx.globalAlpha = panelAlpha;
      ctx.beginPath();

      if (pnl.type === "tri") {
        ctx.moveTo(pnl.x + pnl.w / 2, pnl.y);
        ctx.lineTo(pnl.x, pnl.y + pnl.h);
        ctx.lineTo(pnl.x + pnl.w, pnl.y + pnl.h);
      } else if (pnl.type === "diamond") {
        ctx.moveTo(cx, pnl.y);
        ctx.lineTo(pnl.x + pnl.w, cy);
        ctx.lineTo(cx, pnl.y + pnl.h);
        ctx.lineTo(pnl.x, cy);
      } else {
        ctx.rect(pnl.x, pnl.y, pnl.w, pnl.h);
      }

      ctx.closePath();

      // Radial gradient fill — center bright, edges dim
      var pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      pg.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + ",0.35)");
      pg.addColorStop(1, "rgba(" + cr + "," + cg + "," + cb + ",0.1)");
      ctx.fillStyle = pg;
      ctx.fill();

      // Dark outline (lead)
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bright edge highlight
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // === Light beam effect — center glow ===
    var beam = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, H * 0.55);
    beam.addColorStop(0, "rgba(255,240,200,0.08)");
    beam.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();

    // === Outer border ===
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // === Content — centered over the glass ===
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // --- Cross/rosette ornament at top (0.5-0.8s) ---
    if (t > 0.5) {
      var crossAlpha = fa((t - 0.5) / 0.3);
      ctx.save();
      ctx.globalAlpha = crossAlpha;
      ctx.strokeStyle = "rgba(220,180,40,0.5)";
      ctx.lineWidth = 1.5;
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(W / 2, 47);
      ctx.lineTo(W / 2, 63);
      ctx.stroke();
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(W / 2 - 8, 55);
      ctx.lineTo(W / 2 + 8, 55);
      ctx.stroke();
      ctx.restore();
    }

    // --- Winner emoji (0.6-1.0s) ---
    if (t > 0.6) {
      var emojiAlpha = fa((t - 0.6) / 0.4);
      ctx.save();
      ctx.globalAlpha = emojiAlpha;
      ctx.shadowColor = "rgba(220,180,40,0.3)";
      ctx.shadowBlur = 12;
      ctx.font = "48px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillText(winner.emoji || "", W / 2, 120);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // --- Winner name (0.8-1.2s) ---
    if (t > 0.8) {
      var nameAlpha = fa((t - 0.8) / 0.4) * 0.92;
      ctx.save();
      ctx.globalAlpha = nameAlpha;
      ctx.shadowColor = "rgba(255,245,230,0.3)";
      ctx.shadowBlur = 8;
      ctx.font = "700 24px 'Outfit', sans-serif";
      ctx.fillStyle = "rgba(255,245,230,0.92)";
      var nameStr = winner.username || "Winner";
      if (winnerIsYou) nameStr = nameStr + " · you";
      ctx.fillText(nameStr, W / 2, 175);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // --- Rank title (1.0-1.3s) ---
    if (t > 1.0) {
      var rankAlpha = fa((t - 1.0) / 0.3);
      ctx.save();
      ctx.globalAlpha = rankAlpha;
      ctx.shadowColor = (winnerRank.color || "rgba(255,255,255,0.3)");
      ctx.shadowBlur = 8;
      ctx.font = "800 9px 'JetBrains Mono', monospace";
      ctx.fillStyle = winnerRank.color || "rgba(255,255,255,1)";
      ctx.fillText(winnerRank.title || "", W / 2, 198);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // --- Ornamental divider 1 (1.2-1.5s) ---
    if (t > 1.2) {
      var div1Alpha = fa((t - 1.2) / 0.3);
      ctx.save();
      ctx.globalAlpha = div1Alpha;
      var dg1 = ctx.createLinearGradient(W / 2 - 120, 215, W / 2 + 120, 215);
      dg1.addColorStop(0, "rgba(220,180,40,0)");
      dg1.addColorStop(0.3, "rgba(220,180,40,0.3)");
      dg1.addColorStop(0.7, "rgba(220,180,40,0.3)");
      dg1.addColorStop(1, "rgba(220,180,40,0)");
      ctx.strokeStyle = dg1;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 120, 215);
      ctx.lineTo(W / 2 + 120, 215);
      ctx.stroke();
      ctx.restore();
    }

    // --- Stats — three columns (1.3-1.8s) ---
    if (t > 1.3) {
      var statProgress = ease((t - 1.3) / 0.5);
      var animWpm = Math.round((winner.wpm || 0) * statProgress);
      var animAcc = Math.round((winner.accuracy || 0) * statProgress);
      var animWords = Math.round((winner.wordsCompleted || 0) * statProgress);
      var statCols = [
        {val: String(animWpm), label: "WPM", x: W / 2 - 140},
        {val: animAcc + "%", label: "ACC", x: W / 2},
        {val: String(animWords), label: "WORDS", x: W / 2 + 140}
      ];
      for (var si = 0; si < statCols.length; si++) {
        var sc = statCols[si];
        var sDelay = 1.3 + si * 0.1;
        var sAlpha = fa((t - sDelay) / 0.3);
        ctx.save();
        ctx.globalAlpha = sAlpha;
        ctx.shadowColor = "rgba(255,245,230,0.3)";
        ctx.shadowBlur = 8;
        // Value
        ctx.font = "800 26px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,245,230,0.85)";
        ctx.fillText(sc.val, sc.x, 255);
        ctx.shadowBlur = 0;
        // Label
        ctx.font = "600 7px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillText(sc.label, sc.x, 275);
        ctx.restore();
      }
    }

    // --- Ornamental divider 2 (1.6-2.0s) ---
    if (t > 1.6) {
      var div2Alpha = fa((t - 1.6) / 0.4);
      ctx.save();
      ctx.globalAlpha = div2Alpha;
      var dg2 = ctx.createLinearGradient(W / 2 - 120, 285, W / 2 + 120, 285);
      dg2.addColorStop(0, "rgba(220,180,40,0)");
      dg2.addColorStop(0.3, "rgba(220,180,40,0.3)");
      dg2.addColorStop(0.7, "rgba(220,180,40,0.3)");
      dg2.addColorStop(1, "rgba(220,180,40,0)");
      ctx.strokeStyle = dg2;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 120, 285);
      ctx.lineTo(W / 2 + 120, 285);
      ctx.stroke();
      ctx.restore();
    }

    // --- Defeated players (1.8s+) ---
    if (t > 1.8 && standings.length > 1) {
      var defeated = standings.slice(1);
      for (var di = 0; di < defeated.length; di++) {
        var dPlayer = defeated[di];
        var dStart = 1.8 + di * 0.15;
        if (t <= dStart) continue;
        var dAlpha = fa((t - dStart) / 0.4);
        var isMe = dPlayer.playerId === mpState.localPlayerId;
        var baseAlpha = isMe ? 0.7 : 0.4;
        ctx.save();
        ctx.globalAlpha = dAlpha * baseAlpha;
        ctx.shadowColor = "rgba(255,245,230,0.15)";
        ctx.shadowBlur = 4;
        ctx.font = "400 12px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,245,230,1)";
        var dRankNum = "#" + (di + 2);
        var dEmoji = dPlayer.emoji || "";
        var dName = dPlayer.username || "Player";
        var dWpm = Math.round((dPlayer.wpm || 0) * dAlpha);
        var dAcc = Math.round((dPlayer.accuracy || 0) * dAlpha);
        var dLine = dRankNum + "  " + dEmoji + "  " + dName + "  \u2014  " + dWpm + " wpm  ·  " + dAcc + "%";
        var dY = 310 + di * 28;
        ctx.fillText(dLine, W / 2, dY);
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }

    // === Particles — floating light motes ===
    for (var pti = 0; pti < parts.length; pti++) {
      var pt = parts[pti];
      pt.x += (Math.random() - 0.5) * 0.2;
      pt.y -= 0.2 + Math.random() * 0.3;
      if (pt.y < -5) {
        pt.y = H + 5;
        pt.x = Math.random() * W;
      }
      ctx.save();
      ctx.globalAlpha = 0.3 * Math.min(1, t);
      ctx.fillStyle = "rgba(255,240,200,0.3)";
      var ptSize = 1 + Math.random();
      ctx.fillRect(pt.x, pt.y, ptSize, ptSize);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }
  var styles = [drawWanted, drawDuel, drawInk, drawCinematic, drawStainedGlass];
  // Seed from room code + standings data + timestamp so each race gets a different style
  var _seed = 0;
  var _roomCode = (mpState.room && mpState.room.code) ? mpState.room.code : '';
  for (var _si = 0; _si < _roomCode.length; _si++) _seed += _roomCode.charCodeAt(_si) * (_si + 1);
  for (var _pi = 0; _pi < standings.length; _pi++) {
    var _p = standings[_pi];
    _seed += Math.round((_p.wpm || 0) * 7);
    _seed += Math.round((_p.accuracy || 0) * 13);
    _seed += (_p.wordsCompleted || 0) * 17;
  }
  // Add timestamp factor so same-score rematches still get different styles
  _seed += Math.floor(Date.now() / 10000);
  var drawResults = styles[_seed % styles.length];

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
  const panel = document.getElementById('mp-chat-panel');
  if (!panel) return;
  panel.classList.remove('hidden');
  // Trigger entrance animation
  const outer = panel.querySelector('.mp-scroll-chat-outer');
  if (outer) {
    outer.classList.remove('entering');
    void outer.offsetWidth; // force reflow
    outer.classList.add('entering');
    outer.addEventListener('animationend', () => outer.classList.remove('entering'), { once: true });
  }
  // Update online count
  const countEl = document.getElementById('mp-chat-online-count');
  if (countEl && mpState.room) countEl.textContent = mpState.room.players.length;
}

function hideChat() {
  document.getElementById('mp-chat-panel')?.classList.add('hidden');
}

function clearChat() {
  const el = document.getElementById('mp-chat-messages');
  if (!el) return;
  const typing = document.getElementById('mp-chat-typing');
  el.innerHTML = '';
  if (typing) el.appendChild(typing);
}

// Track race winner for chat styling
let raceWinnerId = null;
let raceRankMap = new Map(); // playerId -> rank (1,2,3...)
let playerWpmMap = new Map(); // playerId -> last known WPM

function appendChatMessage(msg) {
  const el = document.getElementById('mp-chat-messages');
  if (!el) return;

  const isYou = msg.playerId === mpState.localPlayerId;
  const rank = raceRankMap.get(msg.playerId) || 0;
  const rankClass = rank === 1 ? 'is-winner' : rank === 2 ? 'is-second' : rank === 3 ? 'is-third' : '';

  // Get player emoji + WPM
  const player = mpState.room?.players.find(p => p.id === msg.playerId);
  const emoji = player?.emoji || '\u{1F4AC}';
  const wpm = playerWpmMap.get(msg.playerId);
  const wpmStr = wpm ? ` (${wpm})` : '';
  const nameText = `${rank === 1 ? '\u{1F451} ' : ''}${escapeHtml(msg.username)}${wpmStr}`;

  const div = document.createElement('div');
  div.className = `mp-chat-msg ${isYou ? 'is-you' : 'is-other'} ${rankClass}`;

  if (isYou) {
    div.innerHTML = `
      <div class="mp-chat-msg-name-row"><div class="mp-chat-msg-name">${nameText}</div><span class="mp-chat-msg-avatar">${emoji}</span></div>
      <div class="mp-chat-msg-text">${escapeHtml(msg.text)}</div>
    `;
  } else {
    div.innerHTML = `
      <div class="mp-chat-msg-name-row"><span class="mp-chat-msg-avatar">${emoji}</span><div class="mp-chat-msg-name">${nameText}</div></div>
      <div class="mp-chat-msg-text">${escapeHtml(msg.text)}</div>
    `;
  }
  const typingEl = document.getElementById('mp-chat-typing');
  if (typingEl && el.contains(typingEl)) el.insertBefore(div, typingEl);
  else el.appendChild(div);
  el.scrollTop = el.scrollHeight;

  // Play receive sound for other players' messages
  if (!isYou && typeof mpPlayReceiveSound === 'function') mpPlayReceiveSound();
}

function appendSystemMessage(text) {
  const el = document.getElementById('mp-chat-messages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'mp-chat-msg is-system';
  const msgTextDiv = document.createElement('div');
  msgTextDiv.className = 'mp-chat-msg-body';
  msgTextDiv.innerHTML = `<div class="mp-chat-msg-text">${escapeHtml(text)}</div>`;
  div.appendChild(msgTextDiv);
  const typingEl = document.getElementById('mp-chat-typing');
  if (typingEl && el.contains(typingEl)) el.insertBefore(div, typingEl);
  else el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('mp-chat-input');
  if (!input || !socket?.connected) return;
  const text = input.value.trim();
  if (!text) return;
  socket.emit('chat:message', { text });
  input.value = '';
  if (typeof mpPlaySendSound === 'function') mpPlaySendSound();
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
    // Restore saved warrior name
    const savedName = localStorage.getItem('mp-warrior-name');
    const nameInput = document.getElementById('mp-name-input');
    if (savedName && nameInput && !nameInput.value.trim()) {
      nameInput.value = savedName;
      mpState.localUsername = savedName;
    }
    showMenuView();
    connectSocket();
    window.mpModalActive = true;
  });

  // Close modal
  document.getElementById('close-mp')?.addEventListener('click', () => {
    document.getElementById('mp-modal').classList.add('hidden');
    window.mpModalActive = false;
    document.getElementById('results-overlay')?.classList.add('hidden');
    if (window.resetTypingEngine) window.resetTypingEngine();
  });

  // Block keystrokes from reaching the typing engine while mp modal is open
  document.addEventListener('keydown', (e) => {
    if (!window.mpModalActive) return;
    const tag = e.target?.tagName;
    const id = e.target?.id || '';
    // Allow typing in input/textarea fields inside the modal
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.stopPropagation();
    e.preventDefault();
  }, true);

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

  // Visual mode selector (Zen / Clean / Hagakure) — host only
  document.querySelectorAll('.mp-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mpState.room || mpState.room.hostId !== mpState.localPlayerId) return;
      const mode = btn.dataset.mode;
      document.querySelectorAll('.mp-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      syncModeUI(mode);
      const activeTheme = document.querySelector('.mp-theme-opt.active')?.dataset.theme || 'koi';
      const activeLines = parseInt(document.querySelector('.mp-line-btn.active')?.dataset.lines || '25');
      socket?.emit('room:settings', {
        timeLimit: mpState.room.timeLimit,
        visualMode: mode,
        cleanTheme: activeTheme,
        hagakureLineCount: activeLines
      });
    });
  });

  // Line count selector (Hagakure) — host only
  document.querySelectorAll('.mp-line-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mpState.room || mpState.room.hostId !== mpState.localPlayerId) return;
      document.querySelectorAll('.mp-line-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      socket?.emit('room:settings', {
        timeLimit: mpState.room.timeLimit,
        visualMode: 'hagakure',
        hagakureLineCount: parseInt(btn.dataset.lines)
      });
    });
  });

  // Theme selector — host only
  document.querySelectorAll('.mp-theme-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mpState.room || mpState.room.hostId !== mpState.localPlayerId) return;
      document.querySelectorAll('.mp-theme-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      socket?.emit('room:settings', {
        timeLimit: mpState.room.timeLimit,
        visualMode: 'clean',
        cleanTheme: btn.dataset.theme
      });
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

  // ─── Chat send ───
  document.getElementById('mp-chat-send')?.addEventListener('click', sendChatMessage);
  document.getElementById('mp-chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
    e.stopPropagation();
  });
  document.getElementById('mp-chat-input')?.addEventListener('input', (e) => {
    e.stopPropagation();
    if (socket?.connected) socket.emit('chat:typing');
  });

  // ─── Emoji popup ───
  const mpEmojiBtn = document.getElementById('mp-chat-emoji-btn');
  const mpEmojiPopup = document.getElementById('mp-emoji-popup');
  if (mpEmojiBtn && mpEmojiPopup) {
    const emojis = ['😂','🔥','💀','😭','❤️','👑','⚡','🗡️','💪','🎯','👀','😤','🤣','💯','🚀','✨','😈','🏆','💥','🤝','😎','🥶','🫡','💬','⚔️','🎮','🐐','👏','😮','🤯'];
    emojis.forEach(e => {
      const btn = document.createElement('button');
      btn.textContent = e;
      btn.addEventListener('click', () => {
        const input = document.getElementById('mp-chat-input');
        if (input) { input.value += e; input.focus(); }
        mpEmojiPopup.classList.remove('open');
      });
      mpEmojiPopup.appendChild(btn);
    });
    mpEmojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mpEmojiPopup.classList.toggle('open');
      document.getElementById('mp-chat-menu')?.classList.remove('open');
    });
  }

  // ─── Quill menu (themes + sounds) ───
  const mpMenuBtn = document.getElementById('mp-chat-menu-btn');
  const mpMenu = document.getElementById('mp-chat-menu');
  const mpThemeMenuItem = document.getElementById('mpc-theme-menu-item');
  const mpThemeSubmenu = document.getElementById('mpc-theme-submenu');
  const mpScrollOuter = document.querySelector('.mp-scroll-chat-outer');

  if (mpMenuBtn && mpMenu) {
    mpMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const opening = !mpMenu.classList.contains('open');
      mpMenu.classList.toggle('open');
      if (!opening) { mpThemeSubmenu?.classList.remove('open'); mpThemeMenuItem?.classList.remove('expanded'); }
      mpEmojiPopup?.classList.remove('open');
    });
    mpMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // Theme submenu toggle
  mpThemeMenuItem?.addEventListener('click', () => {
    mpThemeSubmenu?.classList.toggle('open');
    mpThemeMenuItem.classList.toggle('expanded');
  });

  // Theme selection + persistence
  const savedTheme = localStorage.getItem('mp_scroll_theme') || '';
  if (mpScrollOuter && savedTheme) mpScrollOuter.setAttribute('data-theme', savedTheme);
  document.querySelectorAll('.mpc-theme-opt').forEach(btn => {
    if (btn.dataset.pick === (savedTheme || 'gold')) btn.classList.add('active');
    else btn.classList.remove('active');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pick = btn.dataset.pick;
      const theme = pick === 'gold' ? '' : pick;
      mpScrollOuter?.setAttribute('data-theme', theme);
      localStorage.setItem('mp_scroll_theme', theme);
      document.querySelectorAll('.mpc-theme-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setTimeout(() => {
        mpMenu?.classList.remove('open');
        mpThemeSubmenu?.classList.remove('open');
        mpThemeMenuItem?.classList.remove('expanded');
      }, 300);
    });
  });

  // Sound toggle + persistence
  let mpSoundEnabled = localStorage.getItem('mp_chat_sounds') !== '0';
  const mpSoundToggle = document.getElementById('mp-sound-toggle');
  if (mpSoundToggle) mpSoundToggle.classList.toggle('on', mpSoundEnabled);
  document.getElementById('mp-sound-menu-item')?.addEventListener('click', (e) => {
    e.stopPropagation();
    mpSoundEnabled = !mpSoundEnabled;
    localStorage.setItem('mp_chat_sounds', mpSoundEnabled ? '1' : '0');
    mpSoundToggle?.classList.toggle('on', mpSoundEnabled);
  });

  // Chat sounds (Web Audio)
  let mpAudioCtx = null;
  function getMpAudioCtx() {
    if (!mpAudioCtx) mpAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return mpAudioCtx;
  }

  window.mpPlaySendSound = function() {
    if (!mpSoundEnabled) return;
    const ctx = getMpAudioCtx(); ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.08);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.setValueAtTime(0.18, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.15);
  };

  window.mpPlayReceiveSound = function() {
    if (!mpSoundEnabled) return;
    const ctx = getMpAudioCtx(); ctx.resume();
    const t = ctx.currentTime;
    [830, 1050].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 3000;
      osc.type = 'sine'; osc.frequency.value = freq;
      const start = t + i * 0.1;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(start); osc.stop(start + 0.3);
    });
  };

  // Close popups on outside click
  document.addEventListener('click', () => {
    mpEmojiPopup?.classList.remove('open');
    mpMenu?.classList.remove('open');
    mpThemeSubmenu?.classList.remove('open');
    mpThemeMenuItem?.classList.remove('expanded');
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
