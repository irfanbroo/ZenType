
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
        logoutBtn: document.getElementById('logout-btn')
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
                alert("Account created! Please verify your email.");
                authUI.signupContainer.classList.add('hidden');
                authUI.loginContainer.classList.remove('hidden');
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

    // 4. State Management
    function updateAuthState(session) {
        if (session) {
            // Logged In
            authUI.authForms.classList.add('hidden');
            authUI.userProfile.classList.remove('hidden');

            const email = session.user.email;
            if (authUI.userEmailDisplay) authUI.userEmailDisplay.innerText = email;
            if (authUI.userInitial) authUI.userInitial.innerText = email.charAt(0).toUpperCase();
            if (authUI.openBtn) authUI.openBtn.classList.add('logged-in');
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
