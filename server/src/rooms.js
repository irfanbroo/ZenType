const { generateWordList, generateHagakureWordList } = require('./words');
const { z } = require('zod');

// In-memory room store
const rooms = new Map();

// ─── Zod schemas for player input ────────────────────────
const usernameSchema = z.string().trim().min(1).max(20)
  .transform(s => s.replace(/<[^>]*>/g, '')); // Strip HTML
const emojiSchema = z.string().max(8).optional(); // Emoji can be multi-codepoint

// Valid clean mode themes
const VALID_THEMES = new Set([
  'default','dracula','nord','botanical','bushido','midnight','sunset','ocean',
  'lavender','neon','sakura','mocha','arctic','ember','void','copper',
  'paper','snow','cream','linen','sepia','frost',
  'koi','bloodscroll','sumi','torii','oni','matcha','tsunami','hanami',
  'shogun','wabisabi','yokai','ukiyo','fuji','ryokan','karesansui'
]);

// Default emoji set for players
const DEFAULT_EMOJIS = ['\u{1F680}', '\u{1F525}', '\u26A1', '\u{1F47B}', '\u{1F409}'];

function generateRoomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function createPlayer(userId, rawUsername, socketId, rawEmoji) {
  const nameParsed = usernameSchema.safeParse(rawUsername);
  const emojiParsed = emojiSchema.safeParse(rawEmoji);
  return {
    id: userId,
    username: nameParsed.success ? nameParsed.data : 'Player',
    socketId,
    emoji: emojiParsed.success && emojiParsed.data ? emojiParsed.data : DEFAULT_EMOJIS[0],
    currentWordIndex: 0,
    correctChars: 0,
    totalCharsTyped: 0,
    rawKeystrokes: 0,
    correctKeystrokes: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishTime: null,
    dead: false,
    disconnected: false,
    lastProgressTime: 0
  };
}

function serializePlayer(p) {
  return {
    id: p.id,
    username: p.username,
    emoji: p.emoji,
    wpm: p.wpm,
    accuracy: p.accuracy,
    currentWordIndex: p.currentWordIndex,
    finished: p.finished,
    disconnected: p.disconnected
  };
}

function serializeRoom(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    timeLimit: room.timeLimit,
    visualMode: room.visualMode,
    cleanTheme: room.cleanTheme,
    hagakureLineCount: room.hagakureLineCount,
    players: [...room.players.values()].map(serializePlayer)
  };
}

function getPlayerRoom(userId) {
  for (const room of rooms.values()) {
    for (const player of room.players.values()) {
      if (player.id === userId && !player.disconnected) return room;
    }
  }
  return null;
}

function findRoomBySocket(socketId) {
  for (const room of rooms.values()) {
    if (room.players.has(socketId)) return room;
  }
  return null;
}

function resetPlayerStats(player) {
  player.currentWordIndex = 0;
  player.correctChars = 0;
  player.totalCharsTyped = 0;
  player.rawKeystrokes = 0;
  player.correctKeystrokes = 0;
  player.wpm = 0;
  player.accuracy = 100;
  player.finished = false;
  player.finishTime = null;
  player.dead = false;
  player.lastProgressTime = 0;
}

function registerRoomHandlers(io, socket) {

  socket.on('room:create', ({ timeLimit = 30, username, emoji }, callback) => {
    if (typeof callback !== 'function') return;

    if (getPlayerRoom(socket.user.id)) {
      return callback({ error: 'already_in_room' });
    }

    let code;
    do { code = generateRoomCode(); } while (rooms.has(code));

    const room = {
      code,
      hostId: socket.user.id,
      players: new Map(),
      status: 'lobby',
      timeLimit: Math.min(120, Math.max(15, timeLimit)),
      visualMode: 'zen',
      cleanTheme: 'koi',
      hagakureLineCount: 25,
      words: [],
      createdAt: Date.now(),
      countdownTimer: null,
      gameTimer: null,
      startTime: null
    };

    const player = createPlayer(socket.user.id, username, socket.id, emoji);
    room.players.set(socket.id, player);
    rooms.set(code, room);
    socket.join(code);

    console.log(`[ROOM] Created ${code} by ${username} (${socket.user.id})`);
    callback({ code, room: serializeRoom(room) });
  });


  socket.on('room:join', ({ code, username, emoji }, callback) => {
    if (typeof callback !== 'function') return;

    const roomCode = (code || '').toUpperCase().trim();
    const room = rooms.get(roomCode);

    if (!room) return callback({ error: 'room_not_found' });
    if (room.status !== 'lobby') return callback({ error: 'race_in_progress' });
    if (room.players.size >= 5) return callback({ error: 'room_full' });
    if (getPlayerRoom(socket.user.id)) return callback({ error: 'already_in_room' });

    // Assign a default emoji that isn't taken
    const takenEmojis = new Set([...room.players.values()].map(p => p.emoji));
    const availableEmoji = emoji && !takenEmojis.has(emoji)
      ? emoji
      : DEFAULT_EMOJIS.find(e => !takenEmojis.has(e)) || '\u{1F3AE}';

    const player = createPlayer(socket.user.id, username, socket.id, availableEmoji);
    room.players.set(socket.id, player);
    socket.join(roomCode);

    console.log(`[ROOM] ${username} joined ${roomCode} (${room.players.size}/5)`);
    callback({ room: serializeRoom(room) });
    socket.to(roomCode).emit('room:player_joined', { player: serializePlayer(player) });
  });


  socket.on('room:leave', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    room.players.delete(socket.id);
    socket.leave(room.code);

    if (room.players.size === 0) {
      clearTimeout(room.gameTimer);
      clearInterval(room.countdownTimer);
      rooms.delete(room.code);
      console.log(`[ROOM] ${room.code} deleted (empty)`);
      return;
    }

    socket.to(room.code).emit('room:player_left', { playerId: player.id });

    // Transfer host
    if (room.hostId === player.id) {
      const newHost = room.players.values().next().value;
      room.hostId = newHost.id;
      io.to(room.code).emit('room:host_changed', { hostId: newHost.id });
    }
  });


  socket.on('room:set_emoji', ({ emoji }) => {
    const room = findRoomBySocket(socket.id);
    if (!room || room.status !== 'lobby') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const parsed = emojiSchema.safeParse(emoji);
    if (!parsed.success) return;
    player.emoji = parsed.data || player.emoji;
    io.to(room.code).emit('room:player_updated', { player: serializePlayer(player) });
  });


  socket.on('room:settings', ({ timeLimit, visualMode, cleanTheme, hagakureLineCount }) => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.hostId !== socket.user.id) return;
    if (room.status !== 'lobby') return;

    if (timeLimit != null) room.timeLimit = Math.min(120, Math.max(15, timeLimit));
    if (visualMode === 'zen' || visualMode === 'clean' || visualMode === 'hagakure') room.visualMode = visualMode;
    if (typeof cleanTheme === 'string' && VALID_THEMES.has(cleanTheme)) room.cleanTheme = cleanTheme;
    if ([10, 25, 40, 60].includes(hagakureLineCount)) room.hagakureLineCount = hagakureLineCount;

    io.to(room.code).emit('room:settings_updated', {
      timeLimit: room.timeLimit,
      visualMode: room.visualMode,
      cleanTheme: room.cleanTheme,
      hagakureLineCount: room.hagakureLineCount
    });
  });


  socket.on('room:start', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.hostId !== socket.user.id) return;
    if (room.status !== 'lobby') return;
    if (room.players.size < 2) return;

    // Clear any stale timers from previous race
    clearInterval(room.countdownTimer);
    clearTimeout(room.gameTimer);
    room.countdownTimer = null;
    room.gameTimer = null;

    room.status = 'countdown';
    const isHagakure = room.visualMode === 'hagakure';
    room.words = isHagakure
      ? generateHagakureWordList(room.hagakureLineCount)
      : generateWordList(120);

    // Reset all player stats for new race
    for (const p of room.players.values()) {
      resetPlayerStats(p);
    }

    // Pick random countdown style for all players to see the same thing
    const cdSkins = ['skin-portal','skin-blade','skin-glitch','skin-fire','skin-ink','skin-shock','skin-grav','skin-pulse','skin-warp','skin-nova'];
    const cdWords = [null,['BREATHE','FOCUS','FIGHT!'],['READY','STEADY','STRIKE!'],['LOCK IN','AIM','DESTROY!'],['SILENCE','TENSION','WAR!'],['INHALE','EXHALE','KILL!'],['CALM','STORM','CHAOS!'],['STEEL','BLADE','BLOOD!']];
    const cdSkin = cdSkins[Math.floor(Math.random() * cdSkins.length)];
    const cdWordSet = cdWords[Math.floor(Math.random() * cdWords.length)];

    io.to(room.code).emit('room:countdown', {
      seconds: 3,
      words: room.words,
      timeLimit: isHagakure ? 0 : room.timeLimit,
      visualMode: room.visualMode,
      cleanTheme: room.cleanTheme,
      hagakureLineCount: isHagakure ? room.hagakureLineCount : undefined,
      countdownSkin: cdSkin,
      countdownWords: cdWordSet
    });

    let count = 3;
    room.countdownTimer = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(room.countdownTimer);
        room.countdownTimer = null;
        room.status = 'racing';
        room.startTime = Date.now();
        io.to(room.code).emit('game:start', { startTime: room.startTime });

        // Server-side game timer — only for non-hagakure modes
        if (!isHagakure) {
          room.gameTimer = setTimeout(() => {
            const { endRace } = require('./game');
            endRace(io, room);
          }, room.timeLimit * 1000 + 1000);
        }
        // Hagakure: no timer — race ends when all players finish or die
      } else {
        io.to(room.code).emit('room:countdown_tick', { seconds: count });
      }
    }, 1000);

    console.log(`[ROOM] ${room.code} starting race (${room.players.size} players, ${room.timeLimit}s)`);
  });


  socket.on('room:back_to_lobby', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.status !== 'finished' && room.status !== 'racing') return;

    // Clear any lingering timers
    clearInterval(room.countdownTimer);
    clearTimeout(room.gameTimer);
    clearTimeout(room.cleanupTimer);
    room.countdownTimer = null;
    room.gameTimer = null;
    room.cleanupTimer = null;

    room.status = 'lobby';
    room.words = [];
    room.startTime = null;

    for (const p of room.players.values()) {
      resetPlayerStats(p);
      p.disconnected = false;
    }

    io.to(room.code).emit('room:back_to_lobby', { room: serializeRoom(room) });
  });


  // Chat
  let lastChatTime = 0;
  socket.on('chat:message', ({ text }) => {
    if (!text || typeof text !== 'string') return;
    const now = Date.now();
    if (now - lastChatTime < 1000) return; // rate limit: 1 msg/sec
    lastChatTime = now;

    const room = findRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const msg = {
      playerId: player.id,
      username: player.username,
      emoji: player.emoji,
      text: text.slice(0, 200),
      timestamp: now
    };

    io.to(room.code).emit('chat:message', msg);
  });

  // Chat typing indicator
  let lastTypingTime = 0;
  socket.on('chat:typing', () => {
    const now = Date.now();
    if (now - lastTypingTime < 2000) return; // throttle
    lastTypingTime = now;
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    const player = room.players.get(socket.id);
    if (!player) return;
    socket.to(room.code).emit('chat:typing', {
      playerId: player.id,
      username: player.username,
      emoji: player.emoji
    });
  });


  // Handle disconnect
  socket.on('disconnect', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    if (room.status === 'lobby' || room.status === 'finished') {
      room.players.delete(socket.id);
      socket.to(room.code).emit('room:player_left', { playerId: player.id });

      if (room.players.size === 0) {
        clearTimeout(room.gameTimer);
        clearInterval(room.countdownTimer);
        rooms.delete(room.code);
        return;
      }

      if (room.hostId === player.id) {
        const newHost = room.players.values().next().value;
        room.hostId = newHost.id;
        io.to(room.code).emit('room:host_changed', { hostId: newHost.id });
      }
    } else if (room.status === 'racing' || room.status === 'countdown') {
      player.disconnected = true;
      socket.to(room.code).emit('game:player_disconnected', { playerId: player.id });

      // Check if all remaining players are done
      const { checkRaceEnd } = require('./game');
      checkRaceEnd(io, room);
    }
  });
}

module.exports = { registerRoomHandlers, rooms, findRoomBySocket, serializeRoom, serializePlayer };
