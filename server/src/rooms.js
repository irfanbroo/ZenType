const { generateWordList } = require('./words');

// In-memory room store
const rooms = new Map();

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

function createPlayer(userId, username, socketId, emoji) {
  return {
    id: userId,
    username: (username || 'Player').slice(0, 20),
    socketId,
    emoji: emoji || DEFAULT_EMOJIS[0],
    currentWordIndex: 0,
    correctChars: 0,
    totalCharsTyped: 0,
    rawKeystrokes: 0,
    correctKeystrokes: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishTime: null,
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

    player.emoji = emoji;
    io.to(room.code).emit('room:player_updated', { player: serializePlayer(player) });
  });


  socket.on('room:settings', ({ timeLimit }) => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.hostId !== socket.user.id) return;
    if (room.status !== 'lobby') return;

    room.timeLimit = Math.min(120, Math.max(15, timeLimit));
    io.to(room.code).emit('room:settings_updated', { timeLimit: room.timeLimit });
  });


  socket.on('room:start', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.hostId !== socket.user.id) return;
    if (room.status !== 'lobby') return;
    if (room.players.size < 2) return;

    room.status = 'countdown';
    room.words = generateWordList(120);

    // Reset all player stats for new race
    for (const p of room.players.values()) {
      resetPlayerStats(p);
    }

    io.to(room.code).emit('room:countdown', {
      seconds: 3,
      words: room.words,
      timeLimit: room.timeLimit
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

        // Server-side game timer (authoritative)
        room.gameTimer = setTimeout(() => {
          const { endRace } = require('./game');
          endRace(io, room);
        }, room.timeLimit * 1000 + 1000); // +1s grace for network lag
      } else {
        io.to(room.code).emit('room:countdown_tick', { seconds: count });
      }
    }, 1000);

    console.log(`[ROOM] ${room.code} starting race (${room.players.size} players, ${room.timeLimit}s)`);
  });


  socket.on('room:back_to_lobby', () => {
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    if (room.status !== 'finished') return;

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
