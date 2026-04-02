const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS mp_matches (
        id            SERIAL PRIMARY KEY,
        room_code     VARCHAR(6) NOT NULL,
        time_limit    INTEGER NOT NULL,
        player_count  INTEGER NOT NULL,
        started_at    TIMESTAMPTZ NOT NULL,
        ended_at      TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS mp_match_players (
        id              SERIAL PRIMARY KEY,
        match_id        INTEGER REFERENCES mp_matches(id) ON DELETE CASCADE,
        user_id         UUID NOT NULL,
        username        VARCHAR(20) NOT NULL,
        rank            INTEGER NOT NULL,
        wpm             INTEGER NOT NULL,
        accuracy        INTEGER NOT NULL,
        words_completed INTEGER NOT NULL,
        disconnected    BOOLEAN DEFAULT FALSE
      );
    `);

    // Create indexes if they don't exist
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mp_match_players_user ON mp_match_players(user_id);
      CREATE INDEX IF NOT EXISTS idx_mp_matches_started ON mp_matches(started_at);
    `);

    console.log('[DB] Schema initialized');
  } finally {
    client.release();
  }
}

async function saveMatchResult(room, standings) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO mp_matches (room_code, time_limit, player_count, started_at)
       VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
       RETURNING id`,
      [room.code, room.timeLimit, room.players.size, room.startTime]
    );
    const matchId = rows[0].id;

    for (const s of standings) {
      await client.query(
        `INSERT INTO mp_match_players (match_id, user_id, username, rank, wpm, accuracy, words_completed, disconnected)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [matchId, s.playerId, s.username, s.rank, s.wpm, s.accuracy, s.wordsCompleted, s.disconnected || false]
      );
    }

    await client.query('COMMIT');
    console.log(`[DB] Saved match ${matchId} (room ${room.code})`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('[DB] Failed to save match:', e.message);
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB, saveMatchResult };
