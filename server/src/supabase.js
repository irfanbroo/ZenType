const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  console.log('[SUPABASE] Server-side client initialized');
} else {
  console.warn('[SUPABASE] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — stats API disabled');
}

module.exports = { supabase };
