
// ══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ══════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ══════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ══════════════════════════════════════════════════════════

// NOTE: The Supabase 'Anon' key is designed to be public. 
// It is safe to use in client-side code as long as RLS (Row Level Security) is enabled on Supabase.
const SUPABASE_URL = "https://zcubjnqfouqurxacssrj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWJqbnFmb3VxdXJ4YWNzc3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTE3MTUsImV4cCI6MjA4NjQ4NzcxNX0.lDOmJidV8cyVlEQoCxy5gKazRfCITz3t6pXf-Kpgzyg";


let supabaseClient = null;

try {
    if (window.supabase && SUPABASE_URL !== 'INSERT_YOUR_SUPABASE_URL_HERE') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase initialized successfully");
    } else {
        console.error("Supabase Initialization Failed:");
        if (!window.supabase) console.error("- Supabase SDK not loaded (check script tag)");
        if (SUPABASE_URL === 'INSERT_YOUR_SUPABASE_URL_HERE') console.error("- Supabase credentials missing (check config.js)");
    }
} catch (e) {
    console.error("Error initializing Supabase:", e);
}

// ══════════════════════════════════════════════════════════
// AUTHENTICATION LOGIC
// ══════════════════════════════════════════════════════════

function initAuth() {
    console.log("Auth.js: Initializing...");

    const authUI = {
        modal: document.getElementById('auth-modal'),
        openBtn: document.getElementById('login-btn'),
        closeBtn: document.getElementById('close-auth'),

        // Containers
        authForms: document.getElementById('auth-forms'),
        userProfile: document.getElementById('user-profile'),

        // Login Form
        loginContainer: document.getElementById('login-form-container'),
        loginForm: document.getElementById('login-form'),
        loginEmail: document.getElementById('login-email'),
        loginPass: document.getElementById('login-password'),
        googleBtn: document.getElementById('google-btn'),
        switchToSignup: document.getElementById('switch-to-signup'),

        // Signup Form
        signupContainer: document.getElementById('signup-form-container'),
        signupForm: document.getElementById('signup-form'),
        signupEmail: document.getElementById('signup-email'),
        signupPass: document.getElementById('signup-password'),
        googleSignupBtn: document.getElementById('google-signup-btn'),
        switchToLogin: document.getElementById('switch-to-login'),

        // Profile Elements
        userEmailDisplay: document.getElementById('user-email-display'),
        userInitial: document.getElementById('user-initial'),
        logoutBtn: document.getElementById('logout-btn'),

        // Leaderboard
        leaderboardBtn: document.getElementById('leaderboard-btn'),
        leaderboardModal: document.getElementById('leaderboard-modal'),
        closeLeaderboardBtn: document.getElementById('close-leaderboard'),
        leaderboardList: document.getElementById('leaderboard-list')
    };

    console.log("Auth.js: UI Elements found:", authUI);

    // 1. Toggle Modal
    if (authUI.openBtn) {
        // Use onclick to avoid multiple listeners stacking up if re-run
        authUI.openBtn.onclick = (e) => {
            console.log("Auth.js: Login Button Clicked");
            e.preventDefault();
            authUI.modal.classList.remove('hidden');
        };
        console.log("Auth.js: Attached click listener to Login Button");
    } else {
        console.error("Auth.js: Login Button NOT FOUND - Check ID 'login-btn'");
    }

    if (authUI.closeBtn) {
        authUI.closeBtn.onclick = () => {
            authUI.modal.classList.add('hidden');
        };
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === authUI.modal) {
            authUI.modal.classList.add('hidden');
        }
    });

    // 2. Switch Forms
    if (authUI.switchToSignup) {
        authUI.switchToSignup.onclick = (e) => {
            e.preventDefault();
            authUI.loginContainer.classList.add('hidden');
            authUI.signupContainer.classList.remove('hidden');
        };
    }

    if (authUI.switchToLogin) {
        authUI.switchToLogin.onclick = (e) => {
            e.preventDefault();
            authUI.signupContainer.classList.add('hidden');
            authUI.loginContainer.classList.remove('hidden');
        };
    }

    // 3. Auth Actions

    // --- GOOGLE LOGIN ---
    const handleGoogleLogin = async () => {
        if (!supabaseClient) return alert("Supabase not initialized");
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
        if (error) alert("Error: " + error.message);
    };

    if (authUI.googleBtn) authUI.googleBtn.onclick = handleGoogleLogin;
    if (authUI.googleSignupBtn) authUI.googleSignupBtn.onclick = handleGoogleLogin;


    // --- EMAIL LOGIN ---
    if (authUI.loginForm) {
        authUI.loginForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!supabaseClient) return alert("Supabase not initialized");

            const email = authUI.loginEmail.value;
            const password = authUI.loginPass.value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

            if (error) {
                alert("Login Failed: " + error.message);
            } else {
                console.log("Logged in:", data);
                authUI.modal.classList.add('hidden');
                authUI.loginEmail.value = '';
                authUI.loginPass.value = '';
            }
        };
    }

    // --- EMAIL SIGNUP ---
    if (authUI.signupForm) {
        authUI.signupForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!supabaseClient) return alert("Supabase not initialized");

            const email = authUI.signupEmail.value;
            const password = authUI.signupPass.value;

            const { data, error } = await supabaseClient.auth.signUp({ email, password });

            if (error) {
                alert("Signup Failed: " + error.message);
            } else {
                // If email confirmation is disabled, user is likely signed in automatically.
                if (data.session) {
                    console.log("Signup successful!");
                    authUI.modal.classList.add('hidden');
                } else {
                    // Fallback: If session not created immediately, show login
                    alert("Account created! Please sign in.");
                    authUI.signupContainer.classList.add('hidden');
                    authUI.loginContainer.classList.remove('hidden');
                }
            }
        };
    }

    // --- LOGOUT ---
    if (authUI.logoutBtn) {
        authUI.logoutBtn.onclick = async () => {
            if (!supabaseClient) return;
            await supabaseClient.auth.signOut();
        };
    }

    // 4. Stats Management
    async function fetchUserStats() {
        if (!supabaseClient) return;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        let { data, error } = await supabaseClient
            .from('profiles')
            .select('tests_completed, best_wpm, time_typed_seconds, username')
            .eq('id', user.id)
            .single();

        if (error || !data) {
            console.warn("Profile missing. Creating one now...");
            // Auto-create profile if missing (for users who signed up before the trigger)
            const { error: insertError } = await supabaseClient
                .from('profiles')
                .insert([{ id: user.id }]);

            if (insertError) {
                console.error("Failed to create profile:", insertError);
                return;
            }
            // Retry fetch
            return fetchUserStats();
        }

        if (data) {
            console.log("Stats fetched:", data);

            // Setup Username Edit
            setupUsernameEdit(data.username);

            // Update UI safely
            const testsEl = document.getElementById('tests-count');
            const bestEl = document.getElementById('best-wpm');
            const timeEl = document.getElementById('total-time');

            if (testsEl) testsEl.innerText = data.tests_completed || 0;
            if (bestEl) bestEl.innerText = data.best_wpm || 0;

            // Convert seconds to readable time
            const seconds = data.time_typed_seconds || 0;
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);

            if (timeEl) {
                if (hrs > 0) timeEl.innerText = `${hrs}h ${mins}m`;
                else timeEl.innerText = `${mins}m`;
            }
        }
    }

    // Expose update function globally for script.js
    window.updateUserStats = async (wpm, timeElapsedSeconds) => {
        if (!supabaseClient) return;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        console.log(`Saving Stats: WPM=${wpm}, Time=${timeElapsedSeconds}s`);

        // 1. Get current stats (or create if missing)
        let { data: current, error: fetchError } = await supabaseClient
            .from('profiles')
            .select('tests_completed, best_wpm, time_typed_seconds')
            .eq('id', user.id)
            .single();

        if (!current) {
            console.warn("Profile missing during update. Creating...");
            await supabaseClient.from('profiles').insert([{ id: user.id }]);
            current = { tests_completed: 0, best_wpm: 0, time_typed_seconds: 0 };
        }

        // 2. Calculate new values
        const newTests = (current.tests_completed || 0) + 1;
        const newTime = (current.time_typed_seconds || 0) + Math.round(timeElapsedSeconds);
        const newBest = Math.max(current.best_wpm || 0, wpm);

        // 3. Update Supabase
        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
                tests_completed: newTests,
                time_typed_seconds: newTime,
                best_wpm: newBest,
                last_updated: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error("Failed to save stats:", updateError);
        } else {
            console.log("Stats saved successfully!");
            fetchUserStats(); // Refresh UI
        }
    };

    // --- LEADERBOARD LOGIC ---
    if (authUI.leaderboardBtn && authUI.leaderboardModal) {
        authUI.leaderboardBtn.onclick = () => {
            authUI.leaderboardModal.classList.remove('hidden');
            fetchLeaderboard();
        };

        if (authUI.closeLeaderboardBtn) {
            authUI.closeLeaderboardBtn.onclick = () => {
                authUI.leaderboardModal.classList.add('hidden');
            };
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === authUI.leaderboardModal) {
                authUI.leaderboardModal.classList.add('hidden');
            }
        });
    }

    async function fetchLeaderboard() {
        if (!authUI.leaderboardList) return;
        authUI.leaderboardList.innerHTML = '<div class="loading-spinner"></div>';

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('username, best_wpm, time_typed_seconds')
            .order('best_wpm', { ascending: false })
            .limit(10);

        if (error) {
            console.error("Error fetching leaderboard:", error);
            authUI.leaderboardList.innerHTML = '<p class="param-label" style="text-align:center">Failed to load leaderboard.</p>';
            return;
        }

        authUI.leaderboardList.innerHTML = '';
        data.forEach((player, index) => {
            const rank = index + 1;
            let rankClass = '';
            if (rank === 1) rankClass = 'gold';
            else if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';

            const item = document.createElement('div');
            item.className = `leaderboard-item ${rankClass}`;

            // Format time
            const hrs = Math.floor(player.time_typed_seconds / 3600);
            const mins = Math.floor((player.time_typed_seconds % 3600) / 60);
            const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

            // Avatar Letter
            const initial = (player.username || 'Z').charAt(0).toUpperCase();

            item.innerHTML = `
                <div class="l-left">
                    <div class="l-rank">#${rank}</div>
                    <div class="l-avatar">${initial}</div>
                </div>
                
                <div class="l-info">
                    <div class="l-name">${player.username || 'ZenTyper'}</div>
                    <div class="l-stats">
                        <span class="l-stat-pill"><i class="ri-time-line"></i> ${timeStr}</span>
                    </div>
                </div>

                <div class="l-right">
                    <div class="l-wpm">${player.best_wpm}</div>
                    <div class="l-label">WPM</div>
                </div>
            `;
            authUI.leaderboardList.appendChild(item);
        });
    }

    // --- USERNAME EDIT LOGIC ---
    // Inject edit icon into profile if not present
    function setupUsernameEdit(currentUsername) {
        const emailDisplay = authUI.userEmailDisplay;
        if (!emailDisplay) return;

        // Clear previous content and set HTML structure
        emailDisplay.innerHTML = `
            <div class="username-edit">
                <span id="username-text">${currentUsername || 'ZenTyper'}</span>
                <i class="ri-edit-line edit-icon" id="edit-username-btn" title="Edit Username"></i>
            </div>
        `;

        const editBtn = document.getElementById('edit-username-btn');
        const usernameText = document.getElementById('username-text');

        editBtn.onclick = () => {
            const currentName = usernameText.innerText;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.className = 'username-input';
            input.maxLength = 15;

            // Replace text with input
            usernameText.replaceWith(input);
            input.focus();
            editBtn.style.display = 'none';

            // Save on blur or enter
            const saveName = async () => {
                const newName = input.value.trim() || 'ZenTyper';

                // Optimistic update
                const newSpan = document.createElement('span');
                newSpan.id = 'username-text';
                newSpan.innerText = newName;
                input.replaceWith(newSpan);
                editBtn.style.display = 'inline-block';

                // Update Supabase
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    await supabaseClient
                        .from('profiles')
                        .update({ username: newName })
                        .eq('id', user.id);
                }
            };

            input.onblur = saveName;
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            };
        };
    }

    // 5. State Management
    function updateAuthState(session) {
        if (session) {
            // Logged In
            authUI.authForms.classList.add('hidden');
            authUI.userProfile.classList.remove('hidden');

            const email = session.user.email;
            // We won't use email anymore for display, we'll fetch profile
            if (authUI.userInitial) authUI.userInitial.innerText = email.charAt(0).toUpperCase();
            if (authUI.openBtn) authUI.openBtn.classList.add('logged-in');

            fetchUserStats(); // Load stats on login
        } else {
            // Logged Out
            authUI.authForms.classList.remove('hidden');
            authUI.userProfile.classList.add('hidden');

            authUI.loginContainer.classList.remove('hidden');
            authUI.signupContainer.classList.add('hidden');
            if (authUI.openBtn) authUI.openBtn.classList.remove('logged-in');
        }
    }

    // Check Logic
    if (supabaseClient) {
        supabaseClient.auth.getSession().then(({ data: { session } }) => updateAuthState(session));
        supabaseClient.auth.onAuthStateChange((_event, session) => updateAuthState(session));
    }
}

// ══════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
