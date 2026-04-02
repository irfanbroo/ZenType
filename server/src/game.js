const { saveMatchResult } = require('./db');
const { rooms, serializePlayer } = require('./rooms');

const MAX_WPM = 300;
const MIN_WORD_TIME_MS = 80;

function registerGameHandlers(io, socket) {

  socket.on('game:progress', (data) => {
    const room = findRoomBySocket(socket.id);
    if (!room || room.status !== 'racing') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished || player.disconnected) return;

    // Anti-cheat: WPM sanity
    if (data.wpm > MAX_WPM) return;

    // Anti-cheat: word index can only advance by 1
    if (data.wordIndex > player.currentWordIndex + 1) return;
    if (data.wordIndex < 0) return;

    // Anti-cheat: timestamp monotonicity
    if (data.timestamp && data.timestamp <= player.lastProgressTime) return;
    if (data.timestamp) player.lastProgressTime = data.timestamp;

    // Anti-cheat: correctChars cannot exceed max possible
    if (data.wordIndex > 0) {
      const maxPossibleChars = room.words
        .slice(0, data.wordIndex)
        .reduce((sum, w) => sum + w.length + 1, 0);
      if (data.correctChars > maxPossibleChars) return;
    }

    // Update player state
    player.currentWordIndex = data.wordIndex;
    player.correctChars = data.correctChars || 0;
    player.totalCharsTyped = data.totalCharsTyped || 0;
    player.wpm = Math.min(MAX_WPM, data.wpm || 0);
    player.accuracy = Math.min(100, Math.max(0, data.accuracy || 0));

    // Scale to time limit: assume ~90 WPM baseline so bar fills properly
    const expectedWords = Math.max(1, Math.floor(room.timeLimit * 1.5));
    const percent = Math.min(100, Math.round((data.wordIndex / expectedWords) * 100));

    // Broadcast to others in room
    socket.to(room.code).emit('game:player_progress', {
      playerId: player.id,
      wordIndex: data.wordIndex,
      wpm: player.wpm,
      accuracy: player.accuracy,
      percent
    });
  });


  socket.on('game:finished', (data) => {
    const room = findRoomBySocket(socket.id);
    if (!room || room.status !== 'racing') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    player.finished = true;
    player.finishTime = Date.now() - room.startTime;
    player.wpm = Math.min(MAX_WPM, data.netWpm || 0);
    player.accuracy = Math.min(100, Math.max(0, data.accuracy || 0));

    // Calculate rank (how many finished before this player)
    const rank = [...room.players.values()].filter(p => p.finished).length;

    io.to(room.code).emit('game:player_finished', {
      playerId: player.id,
      rank,
      netWpm: player.wpm,
      accuracy: player.accuracy,
      finishTime: player.finishTime
    });

    checkRaceEnd(io, room);
  });
}


function checkRaceEnd(io, room) {
  if (room.status !== 'racing') return;

  const activePlayers = [...room.players.values()].filter(p => !p.disconnected);
  if (activePlayers.length === 0) {
    endRace(io, room);
    return;
  }
  const allDone = activePlayers.every(p => p.finished);
  if (allDone) endRace(io, room);
}


function endRace(io, room) {
  if (room.status === 'finished') return;
  room.status = 'finished';

  clearTimeout(room.gameTimer);
  room.gameTimer = null;

  // Build standings sorted by WPM descending
  const standings = [...room.players.values()]
    .sort((a, b) => {
      // Disconnected players rank last
      if (a.disconnected && !b.disconnected) return 1;
      if (!a.disconnected && b.disconnected) return -1;
      return b.wpm - a.wpm;
    })
    .map((p, i) => ({
      rank: i + 1,
      playerId: p.id,
      username: p.username,
      emoji: p.emoji,
      wpm: p.wpm,
      accuracy: p.accuracy,
      wordsCompleted: p.currentWordIndex,
      disconnected: p.disconnected
    }));

  io.to(room.code).emit('game:race_results', { standings });

  // Save to DB (fire-and-forget)
  saveMatchResult(room, standings).catch(() => {});

  // Auto-cleanup room after 2 minutes
  setTimeout(() => {
    if (rooms.has(room.code) && room.status === 'finished') {
      rooms.delete(room.code);
      console.log(`[ROOM] ${room.code} cleaned up (timeout)`);
    }
  }, 120000);

  console.log(`[GAME] Race ended in ${room.code} - Winner: ${standings[0]?.username} (${standings[0]?.wpm} WPM)`);
}


// Helper - imported by rooms.js so we also define it here
function findRoomBySocket(socketId) {
  for (const room of rooms.values()) {
    if (room.players.has(socketId)) return room;
  }
  return null;
}

module.exports = { registerGameHandlers, checkRaceEnd, endRace };
