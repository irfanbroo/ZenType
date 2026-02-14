
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://zcubjnqfouqurxacssrj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWJqbnFmb3VxdXJ4YWNzc3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTE3MTUsImV4cCI6MjA4NjQ4NzcxNX0.lDOmJidV8cyVlEQoCxy5gKazRfCITz3t6pXf-Kpgzyg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
    console.log("Checking for 'profile_theme' column...");

    // Attempt to select the column from the first record
    const { data, error } = await supabase
        .from('profiles')
        .select('profile_theme')
        .limit(1);

    if (error) {
        console.error("Column check failed:", error.message);
        if (error.message.includes('dt does not exist') || error.code === 'PGRST301') {
            console.log("CONCLUSION: Column likely MISSING.");
        } else {
            console.log("CONCLUSION: Unknown error, possibly missing.");
        }
    } else {
        console.log("Column check successful. Data:", data);
        console.log("CONCLUSION: Column EXISTS.");
    }
})();
