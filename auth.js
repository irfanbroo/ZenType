
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

            // If logged in, refresh stats to ensure we are viewing OUR profile, not a stale public one
            if (authUI.openBtn.classList.contains('logged-in')) {
                // Hide stale profile immediately to prevent "flash" of previous user data
                if (authUI.userProfile) authUI.userProfile.classList.add('hidden');
                fetchUserStats();
            }

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
            .select('tests_completed, best_wpm, time_typed_seconds, username, bio, activity_log, wpm_history')
            .eq('id', user.id)
            .single();

        if (error || !data) {
            console.warn("Profile missing. Creating one now...");

            // Auto-create profile for new user
            const { error: insertError } = await supabaseClient
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        username: 'ZenTyper',
                        bio: 'Just started typing...',
                        tests_completed: 0,
                        best_wpm: 0,
                        time_typed_seconds: 0,
                        activity_log: {},
                        wpm_history: []
                    }
                ]);

            if (insertError) {
                console.error("Failed to create profile:", insertError);
                return;
            }

            console.log("Profile created successfully!");
            // Retry fetching stats now that profile exists
            return fetchUserStats();
        }

        if (data) {
            // Calculate Streak Dynamically
            data.current_streak = calculateStreak(data.activity_log || {});
            renderProfile(data, true);
        }
    }

    // Helper to calculate streak from activity log
    function calculateStreak(activityLog) {
        let streak = 0;
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        // Start checking from today
        let current = new Date(today);

        while (true) {
            const dateStr = current.toISOString().split('T')[0];
            if (activityLog[dateStr] && activityLog[dateStr] > 0) {
                streak++;
                // Move back one day
                current.setTime(current.getTime() - oneDay);
            } else {
                // If today has no entry, check if we haven't broken streak yet (yesterday might have entry)
                if (streak === 0 && dateStr === today.toISOString().split('T')[0]) {
                    current.setTime(current.getTime() - oneDay);
                    continue;
                }
                break;
            }
        }
        return streak;
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
            .select('tests_completed, best_wpm, time_typed_seconds, activity_log, wpm_history')
            .eq('id', user.id)
            .single();

        if (!current) {
            console.warn("Profile missing during update. Creating...");
            const { error: insertError } = await supabaseClient.from('profiles').insert([
                {
                    id: user.id,
                    username: 'ZenTyper',
                    bio: 'Just started typing...',
                    tests_completed: 0,
                    best_wpm: 0,
                    time_typed_seconds: 0,
                    activity_log: {},
                    wpm_history: []
                }
            ]);

            if (insertError) console.error("Error creating profile in update:", insertError);

            current = { tests_completed: 0, best_wpm: 0, time_typed_seconds: 0, activity_log: {}, wpm_history: [] };
        }

        // 2. Calculate new values
        const newTests = (current.tests_completed || 0) + 1;
        const newTime = (current.time_typed_seconds || 0) + Math.round(timeElapsedSeconds);
        const newBest = Math.max(current.best_wpm || 0, wpm);

        // Heatmap Update
        const today = new Date().toISOString().split('T')[0];
        const activity = current.activity_log || {};
        activity[today] = (activity[today] || 0) + 1;

        // History Update (Graph)
        let history = current.wpm_history;

        // DEBUG: Log history state
        console.log("DEBUG: Current wpm_history before update:", history, "Type:", typeof history);

        if (!Array.isArray(history)) {
            console.warn("DEBUG: wpm_history is not an array! Resetting to empty array.");
            history = [];
        }

        history.push(wpm);
        if (history.length > 20) history = history.slice(history.length - 20);

        console.log("DEBUG: New history to save:", history);

        // 3. Update Supabase
        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
                tests_completed: newTests,
                time_typed_seconds: newTime,
                best_wpm: newBest,
                activity_log: activity,
                wpm_history: history,
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
            .select('id, username, best_wpm, time_typed_seconds') // Helper: Added ID
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
            // Cursor pointer handled in CSS now

            // CLICK TO VIEW PROFILE
            item.onclick = () => openPublicProfile(player.id);

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

    // --- UNIFIED PROFILE EDITING ---
    function setupProfileEditing(currentUsername, currentBio) {
        const editBtn = document.getElementById('profile-edit-btn');
        const nameDisplay = document.getElementById('user-email-display');
        const bioDisplay = document.getElementById('user-bio-display');

        if (!editBtn || !nameDisplay || !bioDisplay) return;

        // Reset to view mode initially (clean slate)
        nameDisplay.innerHTML = currentUsername || 'ZenTyper';
        bioDisplay.innerHTML = currentBio || 'ZenTyper';
        editBtn.innerHTML = '<i class="ri-pencil-fill"></i>';

        // Remove old event listeners by cloning
        const newBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(newBtn, editBtn);

        let isEditing = false;

        newBtn.onclick = async () => {
            if (!isEditing) {
                // ENTER EDIT MODE
                isEditing = true;
                newBtn.innerHTML = '<i class="ri-check-line" style="font-size: 1.2rem;"></i>';
                newBtn.style.background = '#4CAF50'; // Green for save
                newBtn.style.color = 'white';

                // Name Input
                const currentName = nameDisplay.innerText;
                nameDisplay.innerHTML = `<input type="text" id="edit-name-input" class="profile-input name-input" value="${currentName}" maxLength="15">`;

                // Bio Input
                const currentBioText = bioDisplay.innerText;
                bioDisplay.innerHTML = `<input type="text" id="edit-bio-input" class="profile-input bio-input" value="${currentBioText}" maxLength="25">`;

                // Focus Name
                document.getElementById('edit-name-input').focus();

            } else {
                // SAVE CHANGES
                const nameInput = document.getElementById('edit-name-input');
                const bioInput = document.getElementById('edit-bio-input');

                if (!nameInput || !bioInput) return; // Safety

                const newName = nameInput.value.trim() || 'ZenTyper';
                const newBio = bioInput.value.trim() || 'ZenTyper';

                // Optimistic Update
                nameDisplay.innerHTML = newName;
                bioDisplay.innerHTML = newBio;

                // Reset Button
                isEditing = false;
                newBtn.innerHTML = '<i class="ri-pencil-fill"></i>';
                newBtn.style.background = ''; // Revert to CSS default
                newBtn.style.color = '';

                // Save to Supabase
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    await supabaseClient
                        .from('profiles')
                        .update({
                            username: newName,
                            bio: newBio
                        })
                        .eq('id', user.id);
                }
            }
        };
    }

    // --- 3D TILT EFFECT ---
    function setup3DTilt() {
        const card = document.querySelector('.profile-info');
        const container = document.getElementById('user-profile');

        if (!card || !container) return;

        container.addEventListener('mousemove', (e) => {
            if (container.classList.contains('hidden')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        container.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // Call this when opening the profile
    if (authUI.userBtn) {
        const originalOnClick = authUI.userBtn.onclick;
        authUI.userBtn.onclick = () => {
            if (originalOnClick) originalOnClick();
            setTimeout(setup3DTilt, 100); // Small delay to ensure DOM visibility
        };
    }



    // --- STAT EXPLOSIONS ---
    function setupStatExplosions() {
        const stats = document.querySelectorAll('.p-val');

        stats.forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                // Spawn 12 particles
                for (let i = 0; i < 12; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('stat-particle');

                    // Random angle and distance
                    const angle = Math.random() * 360;
                    const velocity = 30 + Math.random() * 50; // 30px to 80px distance

                    const tx = Math.cos(angle * Math.PI / 180) * velocity;
                    const ty = Math.sin(angle * Math.PI / 180) * velocity;

                    // Set custom props for CSS animation
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);

                    // Random colors (Gold, White, Orange)
                    const colors = ['#FFD700', '#FFFFFF', '#FFA500', '#00e5ff'];
                    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

                    stat.appendChild(particle);

                    // Cleanup
                    setTimeout(() => particle.remove(), 800);
                }
            });
        });
    }

    // Initialize Visual Effects
    setup3DTilt();
    setupStatExplosions();

    // --- HELPER: RENDER PLAIN GRAPH (Cardiogram Style) ---
    function renderGraph(canvasId, historyData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Ensure layout is computed (fix for modal transition/display:none)
        requestAnimationFrame(() => {
            if (canvas.clientWidth === 0) {
                // Retry if still 0 (e.g. modal animation not finished)
                setTimeout(() => renderGraph(canvasId, historyData), 50);
                return;
            }

            // Resize canvas to match display size (taxes blur and ensures full width)
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Data Validation
            if (!historyData || historyData.length < 2) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.font = "12px 'Space Mono', monospace";
                ctx.fillText("Not enough data", 10, height / 2);
                return;
            }

            // Config
            const paddingY = 10;
            const paddingX = 0; // Extend to full width
            const usableWidth = width - (paddingX * 2);
            const usableHeight = height - (paddingY * 2);

            // Scales
            const maxWPM = Math.max(...historyData) + 10;
            const minWPM = Math.max(0, Math.min(...historyData) - 10);
            const range = maxWPM - minWPM || 1; // Prevent div/0

            const getX = (i) => paddingX + (i / (historyData.length - 1)) * usableWidth;
            const getY = (wpm) => height - paddingY - ((wpm - minWPM) / range) * usableHeight;

            // Draw Line
            ctx.beginPath();
            ctx.strokeStyle = '#39ff14'; // Neon Green
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.moveTo(getX(0), getY(historyData[0]));

            for (let i = 1; i < historyData.length; i++) {
                ctx.lineTo(getX(i), getY(historyData[i]));
            }
            ctx.stroke();

            // Draw Glow (we can just set shadowBlur on the line, but let's do a simple overlay)
            ctx.save();
            ctx.shadowColor = '#39ff14';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();

            // Draw Dot at end
            const lastX = getX(historyData.length - 1);
            const lastY = getY(historyData[historyData.length - 1]);

            ctx.beginPath();
            ctx.fillStyle = '#39ff14';
            ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Optional: Fill below
            ctx.lineTo(lastX, height);
            ctx.lineTo(paddingX, height);
            ctx.closePath();
            ctx.fillStyle = 'rgba(57, 255, 20, 0.1)';
            ctx.fill();
        });
    }

    // --- HELPER: RENDER PROFILE UI ---
    function renderProfile(data, isOwner) {
        // Ensure profile is visible (it might have been hidden to prevent flicker)
        if (authUI.userProfile) authUI.userProfile.classList.remove('hidden');

        // Setup Unified Editing (Only if owner)
        const editBtn = document.getElementById('profile-edit-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (isOwner) {
            if (editBtn) {
                editBtn.classList.remove('hidden');
                editBtn.style.display = 'flex'; // Enable flex
            }
            if (logoutBtn) {
                logoutBtn.classList.remove('hidden');
                logoutBtn.style.display = 'flex';
            }
            setupProfileEditing(data.username, data.bio);
        } else {
            // Read-Only View
            if (editBtn) {
                editBtn.classList.add('hidden');
                editBtn.style.display = 'none'; // Force hide
            }
            if (logoutBtn) {
                logoutBtn.classList.add('hidden');
                logoutBtn.style.display = 'none';
            }

            // Set simple text if not owner (remove inputs if any)
            const nameDisplay = document.getElementById('user-email-display');
            const bioDisplay = document.getElementById('user-bio-display');
            if (nameDisplay) nameDisplay.innerHTML = data.username || 'ZenTyper';
            if (bioDisplay) bioDisplay.innerHTML = data.bio || 'ZenTyper';
        }

        // Common Render Logic
        const initial = (data.username || 'U').charAt(0).toUpperCase();
        if (authUI.userInitial) authUI.userInitial.innerText = initial;

        // --- RENDER BADGES ---
        const badgeContainer = document.getElementById('profile-badges');
        if (badgeContainer) {
            const badges = calculateBadges(data.best_wpm || 0, data.tests_completed || 0);
            badgeContainer.innerHTML = badges.map(b => `
            <div class="badge ${b.class}" title="${b.title}">
                <i class="${b.icon}"></i> ${b.label}
            </div>
        `).join('');
        }

        // --- RENDER GRAPH ---
        // Expect wpm_history array. If missing, pass empty.
        renderGraph('wpm-chart', data.wpm_history || []);

        // --- RENDER HEATMAP ---
        renderHeatmap(data.activity_log || {});

        // Update Stats
        const testsEl = document.getElementById('tests-count');
        const bestEl = document.getElementById('best-wpm');
        const timeEl = document.getElementById('total-time');

        if (testsEl) testsEl.innerText = data.tests_completed || 0;
        if (bestEl) bestEl.innerText = data.best_wpm || 0;

        const seconds = data.time_typed_seconds || 0;
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (timeEl) {
            if (hrs > 0) timeEl.innerText = `${hrs}h ${mins}m`;
            else timeEl.innerText = `${mins}m`;
        }

        // Re-trigger effects
        setupStatExplosions();
    }

    // --- PUBLIC PROFILE ---
    async function openPublicProfile(userId) {
        console.log("Opening public profile:", userId);

        // Open Modal
        authUI.modal.classList.remove('hidden');
        authUI.authForms.classList.add('hidden');
        authUI.userProfile.classList.remove('hidden');

        // Fetch User Data
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('tests_completed, best_wpm, time_typed_seconds, username, bio, activity_log, wpm_history') // Added wpm_history
            .eq('id', userId)
            .single();

        if (data) {
            // Calculate Streak Dynamically (same as fetchUserStats)
            data.current_streak = calculateStreak(data.activity_log || {});

            renderProfile(data, false); // isOwner = false

            // Close Leaderboard if open
            if (authUI.leaderboardModal) authUI.leaderboardModal.classList.add('hidden');
        } else {
            console.error("Failed to load public profile", error);
        }
    }

    // --- HELPER: RENDER HEATMAP ---
    function renderHeatmap(activityLog) {
        const grid = document.getElementById('activity-heatmap');
        if (!grid) return;
        grid.innerHTML = '';

        // 13 Columns x 5 Rows = 65 Days
        const numCols = 13;
        const numRows = 5;
        const totalCells = numCols * numRows;

        const today = new Date();

        for (let c = 0; c < numCols; c++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'heatmap-col';

            for (let r = 0; r < numRows; r++) {
                const colIndex = c;
                const rowIndex = r;
                const cellIndex = (colIndex * numRows) + rowIndex;
                const daysAgo = (totalCells - 1) - cellIndex;

                const date = new Date();
                date.setDate(today.getDate() - daysAgo);
                const dateStr = date.toISOString().split('T')[0];

                const count = activityLog && activityLog[dateStr] ? activityLog[dateStr] : 0;

                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.title = `${dateStr}: ${count} tests`;

                if (count === 0) cell.style.background = 'rgba(255, 255, 255, 0.05)';
                else if (count <= 2) cell.style.background = 'rgba(57, 255, 20, 0.3)';
                else if (count <= 5) cell.style.background = 'rgba(57, 255, 20, 0.6)';
                else {
                    cell.style.background = 'rgba(57, 255, 20, 1.0)';
                    cell.style.boxShadow = '0 0 5px rgba(57, 255, 20, 0.6)';
                }
                colDiv.appendChild(cell);
            }
            grid.appendChild(colDiv);
        }

        // --- RENDER STREAK ---
        const streakEl = document.getElementById('streak-display');
        if (streakEl) {
            streakEl.innerText = calculateStreak(activityLog); // Use helper
        }
    }


    // --- HELPER: CALCULATE BADGES ---
    function calculateBadges(wpm, tests) {
        const badges = [];

        // Speed Badges
        if (wpm >= 120) {
            badges.push({ label: 'Godlike', icon: 'ri-flashlight-fill', class: 'badge-godlike', title: '120+ WPM' });
        } else if (wpm >= 100) {
            badges.push({ label: 'Cyber', icon: 'ri-cpu-line', class: 'badge-cyber', title: '100+ WPM' });
        } else if (wpm >= 80) {
            badges.push({ label: 'Rocket', icon: 'ri-rocket-2-fill', class: 'badge-rocket', title: '80+ WPM' });
        } else if (wpm >= 50) {
            badges.push({ label: 'Sprinter', icon: 'ri-run-line', class: 'badge-sprinter', title: '50+ WPM' });
        }

        // Dedication Badges
        if (tests >= 1000) {
            badges.push({ label: 'Titan', icon: 'ri-vip-crown-fill', class: 'badge-titan', title: '1000+ Tests' });
        } else if (tests >= 500) {
            badges.push({ label: 'Elite', icon: 'ri-sword-fill', class: 'badge-elite', title: '500+ Tests' });
        } else if (tests >= 250) {
            badges.push({ label: 'Grinder', icon: 'ri-hammer-fill', class: 'badge-grinder', title: '250+ Tests' });
        } else if (tests >= 100) {
            badges.push({ label: 'Master', icon: 'ri-trophy-fill', class: 'badge-master', title: '100+ Tests' });
        } else if (tests >= 50) {
            badges.push({ label: 'Veteran', icon: 'ri-medal-fill', class: 'badge-veteran', title: '50+ Tests' });
        } else if (tests >= 10) {
            badges.push({ label: 'Regular', icon: 'ri-award-fill', class: 'badge-regular', title: '10+ Tests' });
        }

        return badges;
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
