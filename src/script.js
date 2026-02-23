const wordPools = [
    // Pool 0: Cyberpunk words
    "aesthetics code neon glitch cyberpunk silence focus drift matrix neural synthwave terminal logic vector pixel render compile debug execute system data flow stream signal noise ghost shell binary pulse orbit horizon zenith nadir void echo prism quartz isotope kinetic velocity".split(" "),

    // Pool 1: APT - ROSÉ ft. Bruno Mars
    "kissy face kissy face sent to your phone but im tryna kiss your lips for real red hearts red hearts thats what im on yeah come give me somethin i can feel oh oh oh dont you want me like i want you baby dont you need me like i need you now sleep tomorrow but tonight go crazy all you gotta do is just meet me at the its whatever its whatever its whatever you like turn this apt into a club im talking drink dance smoke freak party all night dont you want me like i want you baby dont you need me like i need you now sleep tomorrow but tonight go crazy all you gotta do is just meet me at the".split(" "),

    // Pool 2: Blinding Lights - The Weeknd
    "I been tryna call I been on my own for long enough maybe you can show me how to love city cold and empty no one around to judge me I can feel it coming from the edge of the night so I take another look at you in the blinding lights".split(" "),

    // Pool 3: Die With A Smile - Lady Gaga ft. Bruno Mars
    "wherever you go I will follow cause life is too short to be alone I just wanna hold you so tight my love is never gonna let you die with a smile on your face every day every night falling to pieces watching you leave I just need you here with me".split(" "),

    // Pool 4: As It Was - Harry Styles
    "holding me back gravity is holding me back I want you to hold out the palm of your hand why dont we just play pretend like we are not scared of what is coming next or scared of having nothing left go home get ahead light speed internet I dont wanna talk about the way that it was".split(" "),

    // Pool 5: Starboy - The Weeknd ft. Daft Punk
    "I am a star boy every day a star is born look what you have done I am a legend now coming alive all I wanna hear is the sound of my city burning let the sky fall we are the ones who made it all the way to the top and now we living like a star boy".split(" ")
];

const hagakureWords = [
    "blade", "honor", "death", "glory", "steel", "blood", "spirit", "warrior", "silence", "strike", "swift", "kill", "void", "ghost", "shadow", "ronin", "samurai", "katana", "feudal", "bushido", "focus", "breath", "cherry", "blossom", "peace", "war", "enemy", "defeat", "victory", "master", "legend", "myth", "soul", "mind", "eternal", "night", "darkness", "light", "flash", "thunder", "storm", "calm", "stillness", "meditate", "discipline", "respect", "loyalty", "sacrifice", "bravery", "courage", "fear", "pain", "endure", "survive", "conquer", "rule", "shogun", "emperor", "kingdom", "dynasty", "legacy", "destiny", "fate", "karma", "life", "death", "rebirth", "cycle", "nature", "mountain", "river", "ocean", "sky", "moon", "star", "sun", "fire", "water", "earth", "wind", "metal", "wood", "dragon", "phoenix", "tiger", "wolf", "hawk", "eagle", "snake", "viper", "cobra", "venom", "poison", "cure", "heal", "wound", "scar", "battle", "fight", "war", "combat", "duel", "clash", "strike", "cut", "slash", "pierce", "stab", "thrust", "parry", "block", "dodge", "evade", "counter", "attack", "defend", "guard", "stance", "move", "step", "walk", "run", "sprint", "jump", "leap", "fly", "soar", "dive", "fall", "rise", "stand", "sit", "kneel", "bow", "pray", "chant", "sing", "shout", "scream", "whisper", "talk", "speak", "listen", "hear", "see", "watch", "look", "observe", "perceive", "understand", "knowing", "wise", "fool", "strong", "weak", "fast", "slow", "heavy", "light", "hard", "soft", "sharp", "dull", "cold", "hot", "wet", "dry", "clean", "dirty", "pure", "traint", "evil", "good", "right", "wrong", "true", "false", "real", "fake", "lie", "truth"
];

const hagakureFailMessages = [
    "DISHONOR", "UNWORTHY", "FALLEN", "DEFEAT", "SHAME", "BROKEN", "TOO SLOW", "WEAKNESS", "FATAL", "END",
    "DISGRACE", "FAILURE", "IMPURE", "HESITATION", "SLOPPY", "ERROR", "MISTAKE", "YIELDED", "CRUMBLED", "LOST",
    "FINISH", "OBLIVION", "VOID", "NULL", "WASTED", "EXPIRED", "CEASED", "GONE", "RUIN", "COLLAPSE"
];

const hagakureEarlyFailMessages = [
    "- Your blade remains sheathed.",
    "- You tripped on the first step.",
    "- Pathetic start.",
    "- Not even a single cut?",
    "- Hesitation is defeat.",
    "- Return to the academy.",
    "- Too slow to begin.",
    "- The enemy laughs.",
    "- You were not ready."
];

const hagakureGeneralFailMessages = [
    "Your focus wavered.",
    "A moment of weakness.",
    "Discipline is key.",
    "Go back to the dojo.",
    "Steel requires tempering.",
    "A true warrior never stops.",
    "Mind and body disconnected.",
    "Refine your spirit.",
    "Silence the mind."
];

const hagakureMiddleFailMessages = [
    "Halfway is not enough.",
    "Your endurance failed.",
    "Fatigue is the mind killer.",
    "Mediocrity is a sin.",
    "You lost the rhythm.",
    "Focus must be absolute.",
    "Do not stop halfway.",
    "The path is long.",
    "Incomplete."
];

const hagakureLateFailMessages = [
    "So close to glory.",
    "You stumbled at the gates.",
    "The final step is the hardest.",
    "Victory was in your grasp.",
    "To fall at the end is tragedy.",
    "One mistake costs everything.",
    "Bitter defeat.",
    "Almost a legend.",
    "The finish line mocks you."
];

let currentPool = 0;

// --- 1. WALLPAPER CONFIGURATION ---
const wallpaperCategories = [
    { id: 'relax', label: 'Relax', icon: 'ri-cup-line' },
    { id: 'styles', label: 'Styles', icon: 'ri-magic-line' },
    { id: 'anime-videos', label: 'Anime Videos', icon: 'ri-movie-2-line' },
    { id: 'anime-stills', label: 'Anime (Stills)', icon: 'ri-image-line' },
    { id: 'aesthetic-videos', label: 'Aesthetic Videos', icon: 'ri-film-line' },
    { id: 'aesthetic', label: 'Aesthetic', icon: 'ri-palette-line' },

    { id: 'cars', label: 'Cars', icon: 'ri-roadster-line' },
    { id: 'nature', label: 'Nature', icon: 'ri-leaf-line' },
    { id: 'space', label: 'Space', icon: 'ri-rocket-line' }
];

let currentCategory = 'anime-videos';

// --- STYLES CONFIGURATION ---
// --- STYLES CONFIGURATION ---
// Styles are now just wallpapers in the 'styles' category with preset effects attached.


const wallpapers = [
    // ═══ ANIME VIDEOS ═══

    {
        id: 'anime_girls',
        isVideo: true,
        hasAudio: true,
        category: 'anime-videos',
        url: 'videos/anime_girls.mp4',
        thumb: 'videos/thumbs/anime_girls_thumb.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'anime_main',
        isVideo: true,
        hasAudio: true,
        category: 'anime-videos',
        url: 'videos/anime_main.mp4',
        thumb: 'videos/thumbs/anime_main_thumb.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'goth_girl',
        isVideo: true,
        category: 'anime-videos',
        url: 'videos/goth girl.mp4',
        thumb: 'videos/thumbs/goth girl.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'hypno_eyes',
        isVideo: true,
        category: 'anime-videos',
        url: 'videos/hypno eyes.mp4',
        thumb: 'videos/thumbs/hypno eyes.png',
        tint: 'dark',
        opacity: 15
    },

    // ═══ ANIME (STILLS) ═══
    // Add anime still images here:
    // { id: 'anime-still-1', isVideo: false, category: 'anime-stills', url: 'images/YOUR_IMAGE.jpg', thumb: 'images/thumbs/YOUR_THUMB.jpg', tint: 'dark', opacity: 60 },

    // ═══ AESTHETIC VIDEOS ═══
    {
        id: 'aesthetic_clouds',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/aesthetic clouds_updated (2).mp4',
        thumb: 'videos/thumbs/aesthetic clouds_updated (2).png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'samuraibw',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/samuraibw.mp4',
        thumb: 'videos/thumbs/samuraibw.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'whiteeyes',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/whiteeyes.mp4',
        thumb: 'videos/thumbs/whiteeyes.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'castle',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/castle.mp4',
        thumb: 'videos/thumbs/castle.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'batman',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/batman.mp4',
        thumb: 'videos/thumbs/batman.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'dark_queen',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/dark queen.mp4',
        thumb: 'videos/thumbs/dark queen.png',
        tint: 'dark',
        opacity: 15
    },


    {
        id: 'space1',
        isVideo: true,
        category: 'styles',
        categories: ['styles', 'space'],
        url: 'videos/space1.mp4',
        thumb: 'videos/thumbs/space1.png',
        opacity: 15,
        tint: 'dark',
        // Style Presets
        effectType: 'starfield',
        effectColor: '#ffffff',
        effectIntensity: 38,
        soundProfile: 'creamy'
    },

    // ═══ RELAX ═══
    {
        id: 'gura_yuri',
        isVideo: true,
        hasAudio: true,
        category: 'relax',
        url: 'videos/Gura Yuri Camp.mp4',
        thumb: 'videos/thumbs/Gura Yuri Camp.png',
        tint: 'dark',
        opacity: 0
    },
    { id: 'relax2', isVideo: false, category: 'relax', url: 'images/relax2.jpg', thumb: 'images/relax2.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax3', isVideo: false, category: 'relax', url: 'images/relax3.jpg', thumb: 'images/relax3.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax4', isVideo: false, category: 'relax', url: 'images/relax4.jpg', thumb: 'images/relax4.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax5', isVideo: false, category: 'relax', url: 'images/relax5.jpg', thumb: 'images/relax5.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax6', isVideo: false, category: 'relax', url: 'images/relax6.jpg', thumb: 'images/relax6.jpg', tint: 'dark', opacity: 15 },

    // ═══ AESTHETIC ═══
    { id: 'neon-1', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400' },
    { id: 'japan-night', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400' },
    { id: 'lofi-room', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1598198414976-ddb788ec80c1?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1598198414976-ddb788ec80c1?q=80&w=400' },
    { id: 'minimal-dark', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },

    // ═══ CARS ═══
    {
        id: 'i_dowt_it',
        isVideo: true,
        hasAudio: true,
        category: 'cars',
        url: 'videos/I Dowt it.mp4',
        thumb: 'videos/thumbs/I Dowt it.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'nissancarpink',
        isVideo: true,
        category: 'cars',
        url: 'videos/nissancarpink.mp4',
        thumb: 'videos/thumbs/nissancarpink.png',
        tint: 'dark',
        opacity: 15
    },

    // ═══ NATURE ═══
    { id: 'sunset', isVideo: false, category: 'nature', tint: 'light', opacity: 15, url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?q=80&w=400' },
    { id: 'white-room', isVideo: false, category: 'nature', tint: 'light', opacity: 15, url: 'https://images.unsplash.com/photo-1493723843689-d60feeb0333d?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1493723843689-d60feeb0333d?q=80&w=400' }
];

let userConfig = {
    wallpaperId: 'gura_yuri',
    effectType: 'snow',
    effectColor: '#ff6bca',
    effectIntensity: 22,
    opacity: 0,
    tint: 'dark',
    soundProfile: 'membrane',
    soundVolume: 50,
    bgVolume: 50,
    caretStyle: 'line',
    fontFamily: 'modern',
    caretColor: '#ffd700',
    zenMode: false,
    particle: true,
    particleColor: '#ffd700',
    showTrackSelector: true,
    comboSound: true,
    pitchShift: true,
    wallpaperAudio: true // Default to true
};

const UI = {
    container: document.getElementById('words-container'),
    input: document.getElementById('hidden-input'),
    timer: document.getElementById('timer'),
    wpm: document.getElementById('wpm'),
    zenBtn: document.getElementById('zen-btn'),
    keypressCanvas: document.getElementById('keypress-canvas'),
    results: document.getElementById('results-overlay'),
    finalWpm: document.getElementById('final-wpm'),
    finalAcc: document.getElementById('final-acc'),
    settingsModal: document.getElementById('settings-modal'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettingsBtn: document.getElementById('close-settings'),
    wallpaperGrid: document.getElementById('wallpaper-grid'),
    opacitySlider: document.getElementById('opacity-slider'),
    opacityValue: document.getElementById('opacity-value'),
    tintBtns: document.querySelectorAll('.tint-btn'),
    loadingOverlay: document.getElementById('loading-overlay'),
    bgVideo: document.getElementById('bg-video'),
    soundBtn: document.getElementById('sound-btn'),
    wallpaperSoundBtn: document.getElementById('wallpaper-sound-btn'), // New Button
    timeModes: document.getElementById('time-modes'),
    comboDisplay: document.getElementById('combo-display'),
    comboCount: document.getElementById('combo-count'),
    comboLabel: document.getElementById('combo-label'),
    gameUI: document.getElementById('game-ui'),
    particleCanvas: document.getElementById('particles')
};

let state = {
    words: [],
    startTime: null,
    timerInterval: null,
    timeLimit: 30,
    timeLeft: 30,
    currWordIndex: 0,
    correctChars: 0,
    totalCharsTyped: 0,
    isActive: false,
    combo: 0,
    maxCombo: 0
};

// --- DISCORD RICH PRESENCE ---
const discordPresence = {
    previousWpm: 0,
    concludedTimeout: null,
    currentState: 'idle',

    async setIdle() {
        if (this.currentState === 'idle') return;
        this.currentState = 'idle';
        try {
            await window.__TAURI_INTERNALS__.invoke('set_discord_presence', {
                stateText: 'In Stillness',
                largeImageText: `Last Practice: ${this.previousWpm} WPM`
            });
        } catch (e) { /* Discord not connected */ }
    },

    async setTyping(duration) {
        if (this.concludedTimeout) {
            clearTimeout(this.concludedTimeout);
            this.concludedTimeout = null;
        }
        if (this.currentState === 'typing') return;
        this.currentState = 'typing';
        try {
            await window.__TAURI_INTERNALS__.invoke('set_discord_presence', {
                stateText: `Mastering the Keys (${duration}s)`,
                largeImageText: 'Calm Hands. Clear Mind.'
            });
        } catch (e) { /* Discord not connected */ }
    },

    async setConcluded(finalWpm, accuracy) {
        this.previousWpm = finalWpm;
        this.currentState = 'concluded';
        try {
            await window.__TAURI_INTERNALS__.invoke('set_discord_presence', {
                stateText: `${finalWpm} WPM · ${accuracy}% Accuracy`,
                largeImageText: 'Practice Concluded'
            });
        } catch (e) { /* Discord not connected */ }

        // After 5 seconds, return to idle (unless a new test starts)
        this.concludedTimeout = setTimeout(() => {
            this.concludedTimeout = null;
            this.setIdle();
        }, 5000);
    }
};

// --- AUTO-INIT AUDIO ON FIRST INTERACTION ---
function autoInitAudio() {
    if (!audioCtx) {
        initAudio();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log("AudioContext resumed successfully");
        });
    }
    // Try to play silent buffer to unlock audio on iOS/strict browsers
    if (audioCtx) {
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
    }

    // Remove listeners once initialized
    window.removeEventListener('click', autoInitAudio);
    window.removeEventListener('keydown', autoInitAudio);
}

window.addEventListener('click', autoInitAudio);
window.addEventListener('keydown', autoInitAudio);

// --- 2. SOUND ENGINE (Web Audio API) ---

let audioCtx = null;
let soundEnabled = true;
let noiseBuffer = null;
let currentBgAudio = null; // Track separate audio file for wallpapers
let masterAudio = new Audio();

// Hagakure Mode Theme Music — Playlist
const hagakurePlaylist = [
    { url: '/hagakure-theme.mp3', name: 'Warrior\'s Requiem' },
    // Add more tracks here:
    // { url: '/hagakure-track2.mp3', name: 'Blood & Steel' },
    // { url: '/hagakure-track3.mp3', name: 'Crimson Dawn' },
];
let hagakureAudio = new Audio(hagakurePlaylist[0].url);
hagakureAudio.loop = true;
hagakureAudio.volume = 0.5;
let currentHagakureTrack = 0;
let wasPlayingBeforeHagakure = { masterPlaying: false, scPlaying: false, bgAudioPlaying: false, trackIndex: 0 };

// ── SHADOW MODE MUSIC ──────────────────────────────────────────────────────
const shadowPlaylist = [
    { url: '/shadow1.mp3', name: 'Abyssal Whispers' },
    // { url: '/shadow2.mp3', name: 'Void Resonance' },
];
let shadowAudio = new Audio(shadowPlaylist[0].url);
shadowAudio.loop = true;
shadowAudio.volume = 0.5;
let currentShadowTrack = 0;
let wasPlayingBeforeShadow = { masterPlaying: false, scPlaying: false, bgAudioPlaying: false };

function initShadowTrackSelector() {
    const list = document.getElementById('s-track-list');
    if (!list) return;
    list.innerHTML = '';

    shadowPlaylist.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'sm-track-item' + (i === currentShadowTrack ? ' active' : '');
        item.innerHTML = `<i class="${i === currentShadowTrack ? 'ri-play-fill' : 'ri-disc-fill'}"></i><span>${track.name}</span>`;
        item.addEventListener('click', () => playShadowTrack(i));
        list.appendChild(item);
    });

    const btn = document.getElementById('s-music-btn');
    const panel = document.getElementById('s-track-panel');
    const closeBtn = document.getElementById('s-track-close');

    if (btn) btn.onclick = (e) => { e.stopPropagation(); panel.classList.toggle('hidden'); };
    if (closeBtn) closeBtn.onclick = () => panel.classList.add('hidden');

    updateShadowMusicBtn();
}

function playShadowTrack(index) {
    if (index < 0 || index >= shadowPlaylist.length) return;
    currentShadowTrack = index;
    shadowAudio.src = shadowPlaylist[index].url;
    shadowAudio.volume = (userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50) / 100;
    shadowAudio.currentTime = 0;
    shadowAudio.play().catch(e => console.log('Shadow track play failed:', e));

    document.querySelectorAll('.sm-track-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
        const icon = el.querySelector('i');
        if (icon) icon.className = i === index ? 'ri-play-fill' : 'ri-disc-fill';
    });

    updateShadowMusicBtn();
}

function updateShadowMusicBtn() {
    const btn = document.getElementById('s-music-btn');
    if (!btn) return;
    btn.classList.toggle('playing', !shadowAudio.paused);
}


// Build Hagakure track selector UI
function initHagakureTrackSelector() {
    const list = document.getElementById('h-track-list');
    if (!list) return;
    list.innerHTML = '';

    hagakurePlaylist.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'h-track-item' + (i === currentHagakureTrack ? ' active' : '');
        item.innerHTML = `<i class="${i === currentHagakureTrack ? 'ri-play-fill' : 'ri-music-fill'}"></i><span>${track.name}</span>`;
        item.addEventListener('click', () => {
            playHagakureTrack(i);
        });
        list.appendChild(item);
    });

    // Music button toggle
    const btn = document.getElementById('h-music-btn');
    const panel = document.getElementById('h-track-panel');
    const closeBtn = document.getElementById('h-track-close');

    if (btn) {
        btn.onclick = (e) => {
            e.stopPropagation();
            panel.classList.toggle('hidden');
        };
    }
    if (closeBtn) {
        closeBtn.onclick = () => panel.classList.add('hidden');
    }

    // Update music button playing state
    updateHagakureMusicBtn();
}

function playHagakureTrack(index) {
    if (index < 0 || index >= hagakurePlaylist.length) return;
    currentHagakureTrack = index;
    const track = hagakurePlaylist[index];

    hagakureAudio.src = track.url;
    hagakureAudio.volume = (userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50) / 100;
    hagakureAudio.currentTime = 0;
    hagakureAudio.play().catch(e => console.log('Hagakure track play failed:', e));

    // Update track list UI
    const items = document.querySelectorAll('.h-track-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
        const icon = item.querySelector('i');
        if (icon) icon.className = i === index ? 'ri-play-fill' : 'ri-music-fill';
    });

    updateHagakureMusicBtn();
}

function updateHagakureMusicBtn() {
    const btn = document.getElementById('h-music-btn');
    if (!btn) return;
    if (!hagakureAudio.paused) {
        btn.classList.add('playing');
    } else {
        btn.classList.remove('playing');
    }
}
let masterPlaylist = [
    { url: '', name: 'No Track', type: 'none' },
    { url: 'Dark Sky.mp3', name: 'Dark Sky', type: 'local' },
    { url: 'Daydreams.mp3', name: 'Daydreams', type: 'local' },
    { url: 'Lavender.mp3', name: 'Lavender', type: 'local' },
    { url: 'Sunroof.mp3', name: 'Sunroof', type: 'local' },
    { url: 'The Quiet Between Us.mp3', name: 'The Quiet Between Us', type: 'local' },
    { url: 'Warm Lights.mp3', name: 'Warm Lights', type: 'local' },
];

let currentTrackIndex = 0;


function initTrackSelector() {
    const selector = document.getElementById('track-selector');
    const list = document.getElementById('track-list');
    const currentName = document.getElementById('current-track-name');

    list.innerHTML = '';
    masterPlaylist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'track-item';

        // Default to "No Track" (index 0) if nothing is playing
        if (index === 0 && masterAudio.paused) {
            item.classList.add('active');
            currentName.innerText = track.name;
        }

        item.innerHTML = `<i class="ri-music-fill"></i><span>${track.name}</span>`;
        item.addEventListener('click', () => {
            playSpecificMasterTrack(index);
        });
        list.appendChild(item);
    });

    // Show selector initially for a moment or checking storage could be added
    if (userConfig.showTrackSelector !== false) selector.classList.remove('hidden');
}

function playNextMasterTrack() {
    // Filter out "No Track" (type: 'none') so we don't randomly stop music
    const playableTracks = masterPlaylist.map((t, i) => ({ ...t, originalIndex: i }))
        .filter(t => t.type !== 'none');

    if (playableTracks.length === 0) return;

    // Equal probability for all playable tracks
    const randomIndex = Math.floor(Math.random() * playableTracks.length);
    const selectedTrack = playableTracks[randomIndex];

    // Play using the original index to ensure UI updates correctly
    playSpecificMasterTrack(selectedTrack.originalIndex);
}

function playSpecificMasterTrack(index) {
    const track = masterPlaylist[index];
    if (!track) return;
    currentTrackIndex = index;

    // Handle 'No Track'
    if (track.type === 'none') {
        masterAudio.pause();
        document.getElementById('current-track-name').innerText = track.name;
        document.querySelectorAll('.track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        document.getElementById('current-track-name').classList.remove('track-loading');
        return;
    }

    // Handle Local Audio
    masterAudio.src = track.url + '?t=' + Date.now();
    masterAudio.volume = (userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50) / 100;

    if (soundEnabled) {
        masterAudio.muted = false;
        masterAudio.play().catch(e => console.log('Manual track play failed:', e));
    }

    // Update UI
    document.getElementById('current-track-name').innerText = track.name;
    document.getElementById('current-track-name').classList.remove('track-loading');
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}



masterAudio.addEventListener('ended', () => {
    playSpecificMasterTrack(currentTrackIndex);
});
// Init first track but don't play yet
masterAudio.src = masterPlaylist[0].url;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Pre-generate a noise buffer for realistic impact sounds (guard against re-entry)
    if (!noiseBuffer) {
        const bufferSize = audioCtx.sampleRate * 0.1; // 100ms of noise
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Helper: create a filtered noise burst (simulates physical impact)
function createNoiseBurst(t, duration, volume, filterFreq, filterQ, filterType = 'bandpass') {
    try {
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.setValueAtTime(filterFreq, t);
        filter.Q.setValueAtTime(filterQ, t);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        source.start(t);
        source.stop(t + duration);
        return { source, filter, gain };
    } catch (e) {
        console.error("NoiseBurst Error:", e);
    }
}

// Helper: subtle per-keypress randomization for natural variation
function rng(base, variance) {
    return base + (Math.random() - 0.5) * 2 * variance;
}

function playKeySound(correct) {
    if (!soundEnabled) {
        // console.log("Sound disabled");
        return;
    }
    if (!audioCtx) {
        console.warn("AudioCtx not initialized in playKeySound");
        return;
    }
    if (audioCtx.state !== 'running') {
        console.warn("AudioCtx state is:", audioCtx.state);
        audioCtx.resume();
    }

    const vol = (userConfig.soundVolume || 70) / 100;
    const profile = userConfig.soundProfile || 'typewriter';
    const t = audioCtx.currentTime;

    const profiles = {
        typewriter: () => playSoundTypewriter(t, vol, correct),
        blue: () => playSoundBlue(t, vol, correct),
        red: () => playSoundRed(t, vol, correct),
        creamy: () => playSoundCreamy(t, vol, correct),
        bubble: () => playSoundBubble(t, vol, correct),
        laser: () => playSoundLaser(t, vol, correct),
        tactile: () => playSoundTactile(t, vol, correct),
        membrane: () => playSoundMembrane(t, vol, correct),
        neon: () => playSoundNeon(t, vol, correct),
        retro: () => playSoundRetro(t, vol, correct),
        space: () => playSoundSpace(t, vol, correct),
        bullet: () => playSoundBullet(t, vol, correct)
    };
    (profiles[profile] || profiles.typewriter)();
}

// ══════════════════════════════════════════════════════════
// PROFILE 1: TYPEWRITER — metallic clack + hammer resonance
// Models: key lever striking platen + spring return
// ══════════════════════════════════════════════════════════
function playSoundTypewriter(t, vol, correct) {
    if (correct) {
        // Layer 1: sharp metallic impact noise (the "clack")
        createNoiseBurst(t, 0.025, 0.12 * vol, rng(4500, 500), 2, 'highpass');

        // Layer 2: body resonance — hammer hitting platen
        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(rng(1100, 100), t);
        body.frequency.exponentialRampToValueAtTime(400, t + 0.03);
        bodyGain.gain.setValueAtTime(0.07 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.05);

        // Layer 3: subtle low thud (case/desk resonance)
        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(rng(180, 30), t);
        thud.frequency.exponentialRampToValueAtTime(80, t + 0.04);
        thudGain.gain.setValueAtTime(0.04 * vol, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        thud.connect(thudGain); thudGain.connect(audioCtx.destination);
        thud.start(t); thud.stop(t + 0.07);

        // Layer 4: spring ping — very faint high ring
        const spring = audioCtx.createOscillator();
        const springGain = audioCtx.createGain();
        spring.type = 'sine';
        spring.frequency.setValueAtTime(rng(5500, 400), t + 0.005);
        springGain.gain.setValueAtTime(0.015 * vol, t + 0.005);
        springGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        spring.connect(springGain); springGain.connect(audioCtx.destination);
        spring.start(t + 0.005); spring.stop(t + 0.05);
    } else {
        // Error: duller, heavier impact
        createNoiseBurst(t, 0.035, 0.14 * vol, rng(2000, 300), 1.5, 'bandpass');

        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'square';
        body.frequency.setValueAtTime(rng(400, 50), t);
        body.frequency.exponentialRampToValueAtTime(120, t + 0.06);
        bodyGain.gain.setValueAtTime(0.08 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.1);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 2: BLUE SWITCH — Cherry MX Blue two-stage click
// Models: tactile bump → audible click → bottom-out thud
// ══════════════════════════════════════════════════════════
function playSoundBlue(t, vol, correct) {
    if (correct) {
        // Stage 1: tactile bump — short bright click
        const click1 = audioCtx.createOscillator();
        const click1Gain = audioCtx.createGain();
        click1.type = 'square';
        click1.frequency.setValueAtTime(rng(5000, 400), t);
        click1.frequency.exponentialRampToValueAtTime(2200, t + 0.006);
        click1Gain.gain.setValueAtTime(0.09 * vol, t);
        click1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
        click1.connect(click1Gain); click1Gain.connect(audioCtx.destination);
        click1.start(t); click1.stop(t + 0.015);

        // Impact noise for the bump
        createNoiseBurst(t, 0.01, 0.06 * vol, rng(6000, 500), 3, 'bandpass');

        // Stage 2: release click — slightly delayed, metallic
        const click2 = audioCtx.createOscillator();
        const click2Filter = audioCtx.createBiquadFilter();
        const click2Gain = audioCtx.createGain();
        click2.type = 'triangle';
        const delay2 = rng(0.015, 0.003);
        click2.frequency.setValueAtTime(rng(3800, 300), t + delay2);
        click2.frequency.exponentialRampToValueAtTime(1200, t + delay2 + 0.015);
        click2Filter.type = 'highpass';
        click2Filter.frequency.setValueAtTime(1500, t + delay2);
        click2Gain.gain.setValueAtTime(0.001, t);
        click2Gain.gain.setValueAtTime(0.07 * vol, t + delay2);
        click2Gain.gain.exponentialRampToValueAtTime(0.001, t + delay2 + 0.025);
        click2.connect(click2Filter); click2Filter.connect(click2Gain);
        click2Gain.connect(audioCtx.destination);
        click2.start(t + delay2); click2.stop(t + delay2 + 0.03);

        // Secondary click noise
        createNoiseBurst(t + delay2, 0.012, 0.05 * vol, rng(5000, 500), 2.5, 'bandpass');

        // Case bottom-out thud
        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(rng(250, 30), t + 0.008);
        thud.frequency.exponentialRampToValueAtTime(100, t + 0.04);
        thudGain.gain.setValueAtTime(0.035 * vol, t + 0.008);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        thud.connect(thudGain); thudGain.connect(audioCtx.destination);
        thud.start(t + 0.008); thud.stop(t + 0.06);
    } else {
        // Error: harsh rattly click
        createNoiseBurst(t, 0.03, 0.13 * vol, rng(2500, 400), 1, 'bandpass');

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(rng(1800, 200), t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
        gain.gain.setValueAtTime(0.1 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.08);

        const thud = audioCtx.createOscillator();
        const thudG = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(150, t);
        thud.frequency.exponentialRampToValueAtTime(60, t + 0.06);
        thudG.gain.setValueAtTime(0.06 * vol, t);
        thudG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        thud.connect(thudG); thudG.connect(audioCtx.destination);
        thud.start(t); thud.stop(t + 0.1);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 3: CREAMY — deep lubed linear "thock"
// Models: lubed linear switches on dampened plate, no click
// ══════════════════════════════════════════════════════════
function playSoundCreamy(t, vol, correct) {
    if (correct) {
        // Layer 1: muted impact noise — soft dampened contact
        createNoiseBurst(t, 0.045, 0.14 * vol, rng(700, 100), 2.5, 'lowpass');

        // Layer 2: warm sine body — the core "thock" sound
        const body = audioCtx.createOscillator();
        const bodyFilter = audioCtx.createBiquadFilter();
        const bodyGain = audioCtx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(rng(450, 50), t);
        body.frequency.exponentialRampToValueAtTime(180, t + 0.06);
        bodyFilter.type = 'lowpass';
        bodyFilter.frequency.setValueAtTime(800, t);
        bodyFilter.frequency.exponentialRampToValueAtTime(200, t + 0.05);
        bodyFilter.Q.setValueAtTime(3, t);
        bodyGain.gain.setValueAtTime(0.15 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        body.connect(bodyFilter); bodyFilter.connect(bodyGain);
        bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.1);

        // Layer 3: low body resonance — adds warmth and weight
        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(rng(160, 20), t);
        sub.frequency.exponentialRampToValueAtTime(90, t + 0.07);
        subGain.gain.setValueAtTime(0.1 * vol, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        sub.connect(subGain); subGain.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 0.12);
    } else {
        // Error: muffled thud, deeper and longer
        createNoiseBurst(t, 0.05, 0.15 * vol, 400, 2, 'lowpass');

        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(250, t);
        body.frequency.exponentialRampToValueAtTime(100, t + 0.08);
        bodyGain.gain.setValueAtTime(0.16 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.12);

        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(120, t);
        sub.frequency.exponentialRampToValueAtTime(60, t + 0.09);
        subGain.gain.setValueAtTime(0.1 * vol, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        sub.connect(subGain); subGain.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 0.14);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 4: RED SWITCH — Linear, smooth, "clacky"
// Models: Smooth travel, no bump, sharp plastic bottom-out
// ══════════════════════════════════════════════════════════
function playSoundRed(t, vol, correct) {
    if (correct) {
        // Linear Impact - smooth but fast
        // Noise for plastic-on-plastic impact (lighter than blue, sharper)
        createNoiseBurst(t, 0.025, 0.08 * vol, rng(3000, 500), 2, 'bandpass');

        // Body: lighter clack
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(rng(700, 50), t);
        osc.frequency.exponentialRampToValueAtTime(250, t + 0.05);

        gain.gain.setValueAtTime(0.12 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07); // Fast decay

        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.08);

        // Subtle sub-bass for feeling
        const sub = audioCtx.createOscillator();
        const subG = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(150, t);
        sub.frequency.exponentialRampToValueAtTime(80, t + 0.06);
        subG.gain.setValueAtTime(0.06 * vol, t);
        subG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        sub.connect(subG); subG.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 0.1);

    } else {
        // Error: dull thud
        createNoiseBurst(t, 0.04, 0.12 * vol, 600, 1.5, 'lowpass');
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0.1 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.15);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 4: BUBBLE — soft rounded "pop" with gentle ring
// Models: soft membrane / topre-like cushioned keypress
// ══════════════════════════════════════════════════════════
function playSoundBubble(t, vol, correct) {
    if (correct) {
        // Layer 1: sine chirp — the "pop" character
        const pop = audioCtx.createOscillator();
        const popGain = audioCtx.createGain();
        pop.type = 'sine';
        pop.frequency.setValueAtTime(rng(1200, 150), t);
        pop.frequency.exponentialRampToValueAtTime(rng(350, 50), t + 0.06);
        popGain.gain.setValueAtTime(0.001, t);
        popGain.gain.linearRampToValueAtTime(0.1 * vol, t + 0.004); // soft attack
        popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        pop.connect(popGain); popGain.connect(audioCtx.destination);
        pop.start(t); pop.stop(t + 0.1);

        // Layer 2: harmonic ring — gentle overtone
        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(rng(800, 80), t);
        ring.frequency.exponentialRampToValueAtTime(500, t + 0.08);
        ringGain.gain.setValueAtTime(0.04 * vol, t + 0.003);
        ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        ring.connect(ringGain); ringGain.connect(audioCtx.destination);
        ring.start(t + 0.003); ring.stop(t + 0.13);

        // Layer 3: very soft air noise — the cushion release
        createNoiseBurst(t, 0.025, 0.02 * vol, rng(2000, 300), 0.7, 'lowpass');
    } else {
        // Error: deeper, slightly "deflated" bubble
        const pop = audioCtx.createOscillator();
        const popGain = audioCtx.createGain();
        pop.type = 'sine';
        pop.frequency.setValueAtTime(rng(600, 80), t);
        pop.frequency.exponentialRampToValueAtTime(150, t + 0.08);
        popGain.gain.setValueAtTime(0.001, t);
        popGain.gain.linearRampToValueAtTime(0.12 * vol, t + 0.004);
        popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        pop.connect(popGain); popGain.connect(audioCtx.destination);
        pop.start(t); pop.stop(t + 0.12);

        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(250, t);
        ring.frequency.exponentialRampToValueAtTime(100, t + 0.1);
        ringGain.gain.setValueAtTime(0.06 * vol, t);
        ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        ring.connect(ringGain); ringGain.connect(audioCtx.destination);
        ring.start(t); ring.stop(t + 0.15);

        createNoiseBurst(t, 0.03, 0.03 * vol, 1200, 0.5, 'lowpass');
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 5: LASER — sci-fi energy zap with harmonics
// Models: retro arcade / sci-fi blaster sound
// ══════════════════════════════════════════════════════════
function playSoundLaser(t, vol, correct) {
    if (correct) {
        // Layer 1: primary sawtooth sweep — the core "pew"
        const osc1 = audioCtx.createOscillator();
        const osc1Gain = audioCtx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(rng(3200, 400), t);
        osc1.frequency.exponentialRampToValueAtTime(rng(200, 50), t + 0.07);
        osc1Gain.gain.setValueAtTime(0.06 * vol, t);
        osc1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc1.connect(osc1Gain); osc1Gain.connect(audioCtx.destination);
        osc1.start(t); osc1.stop(t + 0.09);

        // Layer 2: square wave harmonic — adds grit/buzz
        const osc2 = audioCtx.createOscillator();
        const osc2Gain = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(rng(2400, 300), t);
        osc2.frequency.exponentialRampToValueAtTime(150, t + 0.06);
        osc2Gain.gain.setValueAtTime(0.03 * vol, t);
        osc2Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
        osc2.connect(osc2Gain); osc2Gain.connect(audioCtx.destination);
        osc2.start(t); osc2.stop(t + 0.07);

        // Layer 3: bright noise burst — energy dispersion
        createNoiseBurst(t, 0.015, 0.04 * vol, rng(7000, 800), 1.5, 'highpass');
    } else {
        // Error: lower, longer, more menacing zap
        const osc1 = audioCtx.createOscillator();
        const osc1Gain = audioCtx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(rng(1200, 200), t);
        osc1.frequency.exponentialRampToValueAtTime(60, t + 0.1);
        osc1Gain.gain.setValueAtTime(0.08 * vol, t);
        osc1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        osc1.connect(osc1Gain); osc1Gain.connect(audioCtx.destination);
        osc1.start(t); osc1.stop(t + 0.12);

        const osc2 = audioCtx.createOscillator();
        const osc2Gain = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, t);
        osc2.frequency.exponentialRampToValueAtTime(40, t + 0.09);
        osc2Gain.gain.setValueAtTime(0.05 * vol, t);
        osc2Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc2.connect(osc2Gain); osc2Gain.connect(audioCtx.destination);
        osc2.start(t); osc2.stop(t + 0.11);

        createNoiseBurst(t, 0.025, 0.05 * vol, 3000, 1, 'bandpass');
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 6: TACTILE — Cherry MX Brown subtle bump
// Models: tactile bump without audible click, smooth bottom-out
// ══════════════════════════════════════════════════════════
function playSoundTactile(t, vol, correct) {
    if (correct) {
        // Layer 1: soft bump — brief filtered noise, not as sharp as blue
        createNoiseBurst(t, 0.018, 0.08 * vol, rng(3500, 400), 2, 'bandpass');

        // Layer 2: subtle tactile peak — sine blip for the bump feel
        const bump = audioCtx.createOscillator();
        const bumpGain = audioCtx.createGain();
        bump.type = 'sine';
        bump.frequency.setValueAtTime(rng(1800, 200), t);
        bump.frequency.exponentialRampToValueAtTime(700, t + 0.015);
        bumpGain.gain.setValueAtTime(0.06 * vol, t);
        bumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        bump.connect(bumpGain); bumpGain.connect(audioCtx.destination);
        bump.start(t); bump.stop(t + 0.03);

        // Layer 3: smooth bottom-out — warm, muted landing
        const land = audioCtx.createOscillator();
        const landFilter = audioCtx.createBiquadFilter();
        const landGain = audioCtx.createGain();
        land.type = 'sine';
        land.frequency.setValueAtTime(rng(400, 50), t + 0.008);
        land.frequency.exponentialRampToValueAtTime(150, t + 0.04);
        landFilter.type = 'lowpass';
        landFilter.frequency.setValueAtTime(600, t + 0.008);
        landFilter.Q.setValueAtTime(2, t);
        landGain.gain.setValueAtTime(0.07 * vol, t + 0.008);
        landGain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
        land.connect(landFilter); landFilter.connect(landGain);
        landGain.connect(audioCtx.destination);
        land.start(t + 0.008); land.stop(t + 0.06);
    } else {
        // Error: scratchy, unsatisfying bump
        createNoiseBurst(t, 0.03, 0.12 * vol, rng(2000, 300), 1.5, 'bandpass');

        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'triangle';
        body.frequency.setValueAtTime(rng(500, 60), t);
        body.frequency.exponentialRampToValueAtTime(150, t + 0.05);
        bodyGain.gain.setValueAtTime(0.09 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.09);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 7: MEMBRANE — soft mushy office keyboard
// Models: rubber dome membrane keyboard, dampened and quiet
// ══════════════════════════════════════════════════════════
function playSoundMembrane(t, vol, correct) {
    if (correct) {
        // Layer 1: soft muted tap — heavily filtered noise
        createNoiseBurst(t, 0.03, 0.1 * vol, rng(800, 100), 1.5, 'lowpass');

        // Layer 2: rubber dome squish — very brief, low-mid sine
        const squish = audioCtx.createOscillator();
        const squishFilter = audioCtx.createBiquadFilter();
        const squishGain = audioCtx.createGain();
        squish.type = 'sine';
        squish.frequency.setValueAtTime(rng(350, 40), t);
        squish.frequency.exponentialRampToValueAtTime(180, t + 0.03);
        squishFilter.type = 'lowpass';
        squishFilter.frequency.setValueAtTime(500, t);
        squishFilter.Q.setValueAtTime(1, t);
        squishGain.gain.setValueAtTime(0.001, t);
        squishGain.gain.linearRampToValueAtTime(0.09 * vol, t + 0.005); // soft attack
        squishGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        squish.connect(squishFilter); squishFilter.connect(squishGain);
        squishGain.connect(audioCtx.destination);
        squish.start(t); squish.stop(t + 0.05);

        // Layer 3: faint plastic rattle — slight high frequency
        const rattle = audioCtx.createOscillator();
        const rattleGain = audioCtx.createGain();
        rattle.type = 'triangle';
        rattle.frequency.setValueAtTime(rng(2200, 200), t);
        rattle.frequency.exponentialRampToValueAtTime(900, t + 0.012);
        rattleGain.gain.setValueAtTime(0.02 * vol, t);
        rattleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        rattle.connect(rattleGain); rattleGain.connect(audioCtx.destination);
        rattle.start(t); rattle.stop(t + 0.025);
    } else {
        // Error: dull flat thud
        createNoiseBurst(t, 0.04, 0.12 * vol, 500, 1, 'lowpass');

        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(220, t);
        body.frequency.exponentialRampToValueAtTime(90, t + 0.06);
        bodyGain.gain.setValueAtTime(0.12 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.1);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 8: NEON — futuristic cyberpunk synth tone
// Models: digital/synth keypress with harmonic shimmer
// ══════════════════════════════════════════════════════════
function playSoundNeon(t, vol, correct) {
    if (correct) {
        // Layer 1: short bright sine ping — digital "tick"
        const ping = audioCtx.createOscillator();
        const pingGain = audioCtx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(rng(2800, 300), t);
        ping.frequency.exponentialRampToValueAtTime(rng(1600, 200), t + 0.025);
        pingGain.gain.setValueAtTime(0.08 * vol, t);
        pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        ping.connect(pingGain); pingGain.connect(audioCtx.destination);
        ping.start(t); ping.stop(t + 0.05);

        // Layer 2: triangle shimmer — the "neon hum" overtone
        const shimmer = audioCtx.createOscillator();
        const shimmerGain = audioCtx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(rng(1400, 150), t);
        shimmer.frequency.exponentialRampToValueAtTime(800, t + 0.05);
        shimmerGain.gain.setValueAtTime(0.04 * vol, t);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        shimmer.connect(shimmerGain); shimmerGain.connect(audioCtx.destination);
        shimmer.start(t); shimmer.stop(t + 0.08);

        // Layer 3: subtle sub-click — electronic contact
        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'square';
        sub.frequency.setValueAtTime(rng(600, 80), t);
        sub.frequency.exponentialRampToValueAtTime(300, t + 0.015);
        subGain.gain.setValueAtTime(0.03 * vol, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        sub.connect(subGain); subGain.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 0.03);
    } else {
        // Error: glitchy digital buzz
        const buzz = audioCtx.createOscillator();
        const buzzGain = audioCtx.createGain();
        buzz.type = 'sawtooth';
        buzz.frequency.setValueAtTime(rng(900, 100), t);
        buzz.frequency.exponentialRampToValueAtTime(200, t + 0.06);
        buzzGain.gain.setValueAtTime(0.07 * vol, t);
        buzzGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        buzz.connect(buzzGain); buzzGain.connect(audioCtx.destination);
        buzz.start(t); buzz.stop(t + 0.09);

        const glitch = audioCtx.createOscillator();
        const glitchGain = audioCtx.createGain();
        glitch.type = 'square';
        glitch.frequency.setValueAtTime(rng(1500, 200), t);
        glitch.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        glitchGain.gain.setValueAtTime(0.05 * vol, t);
        glitchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        glitch.connect(glitchGain); glitchGain.connect(audioCtx.destination);
        glitch.start(t); glitch.stop(t + 0.07);

        createNoiseBurst(t, 0.02, 0.04 * vol, 4000, 2, 'highpass');
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 9: RETRO — 8-bit chiptune blip
// Models: classic NES/Game Boy button press
// ══════════════════════════════════════════════════════════
function playSoundRetro(t, vol, correct) {
    if (correct) {
        // Layer 1: square wave blip — classic 8-bit character
        const blip = audioCtx.createOscillator();
        const blipGain = audioCtx.createGain();
        blip.type = 'square';
        blip.frequency.setValueAtTime(rng(880, 100), t);
        blip.frequency.setValueAtTime(rng(660, 80), t + 0.015);
        blip.frequency.setValueAtTime(rng(440, 60), t + 0.03);
        blipGain.gain.setValueAtTime(0.07 * vol, t);
        blipGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        blip.connect(blipGain); blipGain.connect(audioCtx.destination);
        blip.start(t); blip.stop(t + 0.06);

        // Layer 2: noise crunch — lo-fi digital artifact
        createNoiseBurst(t, 0.008, 0.04 * vol, rng(4000, 500), 4, 'bandpass');

        // Layer 3: sub pulse — rumble from the console speaker
        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'square';
        sub.frequency.setValueAtTime(rng(220, 30), t);
        sub.frequency.exponentialRampToValueAtTime(110, t + 0.03);
        subGain.gain.setValueAtTime(0.03 * vol, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        sub.connect(subGain); subGain.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 0.05);
    } else {
        // Error: descending "fail" tone
        const fail = audioCtx.createOscillator();
        const failGain = audioCtx.createGain();
        fail.type = 'square';
        fail.frequency.setValueAtTime(rng(440, 50), t);
        fail.frequency.setValueAtTime(rng(330, 40), t + 0.03);
        fail.frequency.setValueAtTime(rng(220, 30), t + 0.06);
        failGain.gain.setValueAtTime(0.09 * vol, t);
        failGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        fail.connect(failGain); failGain.connect(audioCtx.destination);
        fail.start(t); fail.stop(t + 0.1);

        createNoiseBurst(t, 0.015, 0.05 * vol, 2500, 2, 'bandpass');
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 10: SPACE — ethereal cosmic whoosh
// Models: spaceship console key, ambient sci-fi
// ══════════════════════════════════════════════════════════
function playSoundSpace(t, vol, correct) {
    if (correct) {
        // Layer 1: airy sine sweep — cosmic "wooo"
        const sweep = audioCtx.createOscillator();
        const sweepFilter = audioCtx.createBiquadFilter();
        const sweepGain = audioCtx.createGain();
        sweep.type = 'sine';
        sweep.frequency.setValueAtTime(rng(600, 80), t);
        sweep.frequency.exponentialRampToValueAtTime(rng(1800, 200), t + 0.04);
        sweep.frequency.exponentialRampToValueAtTime(rng(900, 100), t + 0.08);
        sweepFilter.type = 'bandpass';
        sweepFilter.frequency.setValueAtTime(1200, t);
        sweepFilter.Q.setValueAtTime(2, t);
        sweepGain.gain.setValueAtTime(0.001, t);
        sweepGain.gain.linearRampToValueAtTime(0.07 * vol, t + 0.01);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        sweep.connect(sweepFilter); sweepFilter.connect(sweepGain);
        sweepGain.connect(audioCtx.destination);
        sweep.start(t); sweep.stop(t + 0.12);

        // Layer 2: soft shimmer — high harmonic ring
        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(rng(3200, 300), t);
        ring.frequency.exponentialRampToValueAtTime(2000, t + 0.06);
        ringGain.gain.setValueAtTime(0.025 * vol, t);
        ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        ring.connect(ringGain); ringGain.connect(audioCtx.destination);
        ring.start(t); ring.stop(t + 0.1);

        // Layer 3: white noise breath — air dispersion
        createNoiseBurst(t, 0.05, 0.03 * vol, rng(3000, 500), 0.8, 'highpass');
    } else {
        // Error: deep void rumble
        const rumble = audioCtx.createOscillator();
        const rumbleGain = audioCtx.createGain();
        rumble.type = 'sine';
        rumble.frequency.setValueAtTime(rng(200, 30), t);
        rumble.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        rumbleGain.gain.setValueAtTime(0.1 * vol, t);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        rumble.connect(rumbleGain); rumbleGain.connect(audioCtx.destination);
        rumble.start(t); rumble.stop(t + 0.14);

        const hiss = audioCtx.createOscillator();
        const hissGain = audioCtx.createGain();
        hiss.type = 'sawtooth';
        hiss.frequency.setValueAtTime(600, t);
        hiss.frequency.exponentialRampToValueAtTime(150, t + 0.08);
        hissGain.gain.setValueAtTime(0.04 * vol, t);
        hissGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        hiss.connect(hissGain); hissGain.connect(audioCtx.destination);
        hiss.start(t); hiss.stop(t + 0.12);
    }
}

// ══════════════════════════════════════════════════════════
// PROFILE 11: BULLET — sharp percussive snap
// Models: crisp gunshot-like transient, very short
// ══════════════════════════════════════════════════════════
function playSoundBullet(t, vol, correct) {
    if (correct) {
        // Layer 1: sharp attack noise — the "crack"
        createNoiseBurst(t, 0.012, 0.16 * vol, rng(6000, 800), 1.5, 'highpass');

        // Layer 2: hard transient — percussive snap body
        const snap = audioCtx.createOscillator();
        const snapGain = audioCtx.createGain();
        snap.type = 'sawtooth';
        snap.frequency.setValueAtTime(rng(2000, 300), t);
        snap.frequency.exponentialRampToValueAtTime(200, t + 0.012);
        snapGain.gain.setValueAtTime(0.1 * vol, t);
        snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        snap.connect(snapGain); snapGain.connect(audioCtx.destination);
        snap.start(t); snap.stop(t + 0.025);

        // Layer 3: low punch — impact thump
        const punch = audioCtx.createOscillator();
        const punchGain = audioCtx.createGain();
        punch.type = 'sine';
        punch.frequency.setValueAtTime(rng(300, 40), t);
        punch.frequency.exponentialRampToValueAtTime(80, t + 0.02);
        punchGain.gain.setValueAtTime(0.08 * vol, t);
        punchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        punch.connect(punchGain); punchGain.connect(audioCtx.destination);
        punch.start(t); punch.stop(t + 0.04);
    } else {
        // Error: dull misfire thud
        createNoiseBurst(t, 0.025, 0.14 * vol, rng(2500, 400), 1, 'bandpass');

        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'triangle';
        body.frequency.setValueAtTime(rng(600, 80), t);
        body.frequency.exponentialRampToValueAtTime(100, t + 0.04);
        bodyGain.gain.setValueAtTime(0.1 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.08);
    }
}

function previewSound(profile) {
    initAudio();
    const vol = (userConfig.soundVolume || 70) / 100;
    const t = audioCtx.currentTime;
    const profiles = {
        typewriter: () => playSoundTypewriter(t, vol, true),
        blue: () => playSoundBlue(t, vol, true),
        red: () => playSoundRed(t, vol, true),
        creamy: () => playSoundCreamy(t, vol, true),
        bubble: () => playSoundBubble(t, vol, true),
        laser: () => playSoundLaser(t, vol, true),
        tactile: () => playSoundTactile(t, vol, true),
        membrane: () => playSoundMembrane(t, vol, true),
        neon: () => playSoundNeon(t, vol, true),
        retro: () => playSoundRetro(t, vol, true),
        space: () => playSoundSpace(t, vol, true),
        bullet: () => playSoundBullet(t, vol, true)
    };
    (profiles[profile] || profiles.typewriter)();
}

function playComboSound(comboLevel) {
    if (!soundEnabled || !audioCtx || !userConfig.comboSound) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Pitch Shift Logic: Use fixed freq if disabled, otherwise scale with combo
    const baseFreq = userConfig.pitchShift ? 500 + (comboLevel * 30) : 500;

    // Slight ramp if pitch shift is on, otherwise steady tone
    if (userConfig.pitchShift) {
        osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.1);
    } else {
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    }

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = UI.soundBtn.querySelector('i');
    if (soundEnabled) {
        icon.className = 'ri-volume-up-line text-xl';
        UI.soundBtn.classList.remove('muted');
    } else {
        icon.className = 'ri-volume-mute-line text-xl';
        UI.soundBtn.classList.add('muted');
    }
    localStorage.setItem('zenTypeSoundEnabled', soundEnabled);
}

// --- 3. EFFECTS ENGINE ---

let effectAnimId = null;

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function initParticles() {
    if (effectAnimId) cancelAnimationFrame(effectAnimId);
    const canvas = UI.particleCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const type = userConfig.effectType || 'dust';
    const effects = { dust: runDustEffect, matrix: runMatrixEffect, starfield: runStarfieldEffect, fireflies: runFirefliesEffect, snow: runSnowEffect, rain: runRainEffect };
    (effects[type] || effects.dust)(canvas);
}

// ── EFFECT 1: FLOATING DUST ──
function runDustEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50; // 0.2 to 2.0
    const count = Math.floor(35 * intensity);
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1, speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.3 - 0.1, opacity: (Math.random() * 0.4 + 0.1) * Math.min(intensity, 1.2),
            pulse: Math.random() * Math.PI * 2
        });
    }
    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#ffd700');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY; p.pulse += 0.02;
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
            const flicker = p.opacity + Math.sin(p.pulse) * 0.15;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flicker * 0.15})`; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flicker})`; ctx.fill();
        });
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// --- VICTORY SOUNDS ---
function playSoundSheath(ctx, vol) {
    if (!ctx) return;
    const t = ctx.currentTime;

    // Metallic Slide (Noise + Bandpass)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.linearRampToValueAtTime(4000, t + 0.3); // Slide up
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.4);

    // Sharp "Click" (Sine burst)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t + 0.25);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0, t);
    clickGain.gain.setValueAtTime(vol, t + 0.25);
    clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    osc.connect(clickGain);
    clickGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
}

function playSoundGong(ctx, vol) {
    if (!ctx) return;
    const t = ctx.currentTime;

    // Fundamental Tone (Deep Sine)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 2); // Pitch drop slightly

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 1.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 4); // Long decay

    // Metallic Overtones (FM Synthesis / Multiple Osc)
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(150, t);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.3, t);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 2);

    osc.start(t);
    osc2.start(t);
    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);
    osc.stop(t + 4.5);
    osc2.stop(t + 4.5);
}

// ── EFFECT 2: MATRIX RAIN ──
function runMatrixEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50;
    const fontSize = 14;
    const spacing = Math.max(1, Math.floor(3 / intensity)); // denser at higher intensity
    const columns = Math.floor(canvas.width / (fontSize * spacing));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789';
    const trailLen = Math.floor(16 * intensity);

    const cols = [];
    for (let i = 0; i < columns; i++) {
        cols.push({ drop: Math.floor(Math.random() * (canvas.height / fontSize)), trail: [] });
    }

    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#39ff14');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            const char = chars[Math.floor(Math.random() * chars.length)];
            col.trail.push({ char, row: col.drop });
            if (col.trail.length > trailLen) col.trail.shift();

            for (let t = 0; t < col.trail.length; t++) {
                const age = (t + 1) / col.trail.length;
                const opacity = age * Math.min(0.7 * intensity, 0.95);
                ctx.fillStyle = t === col.trail.length - 1
                    ? `rgba(${Math.min(r + 80, 255)}, ${Math.min(g + 80, 255)}, ${Math.min(b + 80, 255)}, ${Math.min(0.9 * intensity, 1)})`
                    : `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.fillText(col.trail[t].char, i * fontSize * spacing, col.trail[t].row * fontSize);
            }

            col.drop++;
            if (col.drop * fontSize > canvas.height && Math.random() > 0.975) {
                col.drop = 0;
                col.trail = [];
            }
        }
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── EFFECT 3: STARFIELD ──
function runStarfieldEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50;
    const count = Math.floor(200 * intensity);
    const speed = 3 * intensity;
    const stars = [];
    const cx = canvas.width / 2, cy = canvas.height / 2;
    for (let i = 0; i < count; i++) {
        stars.push({
            x: (Math.random() - 0.5) * canvas.width,
            y: (Math.random() - 0.5) * canvas.height,
            z: Math.random() * canvas.width
        });
    }

    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#ffffff');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(s => {
            s.z -= speed;
            if (s.z <= 0) {
                s.x = (Math.random() - 0.5) * canvas.width;
                s.y = (Math.random() - 0.5) * canvas.height;
                s.z = canvas.width;
            }
            const sx = (s.x / s.z) * 300 + cx;
            const sy = (s.y / s.z) * 300 + cy;
            const size = Math.max(0, (1 - s.z / canvas.width) * 3);
            const opacity = (1 - s.z / canvas.width) * Math.min(intensity, 1.3);

            if (size > 0) {
                const trailZ = s.z + 20;
                const prevSx = (s.x / trailZ) * 300 + cx;
                const prevSy = (s.y / trailZ) * 300 + cy;
                ctx.beginPath(); ctx.moveTo(prevSx, prevSy); ctx.lineTo(sx, sy);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
                ctx.lineWidth = size * 0.6; ctx.stroke();

                ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.fill();
            }
        });
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── EFFECT 4: FIREFLIES ──
function runFirefliesEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50;
    const count = Math.floor(20 * intensity);
    const flies = [];
    for (let i = 0; i < count; i++) {
        flies.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: (Math.random() * 5 + 3) * Math.min(intensity, 1.5),
            angle: Math.random() * Math.PI * 2, speed: (Math.random() * 0.5 + 0.2) * intensity,
            wanderSpeed: Math.random() * 0.02 + 0.005,
            pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * 0.03 + 0.01
        });
    }

    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#ffd700');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        flies.forEach(f => {
            f.angle += (Math.random() - 0.5) * f.wanderSpeed * 10;
            f.x += Math.cos(f.angle) * f.speed;
            f.y += Math.sin(f.angle) * f.speed;
            f.pulse += f.pulseSpeed;

            if (f.x < -20) f.x = canvas.width + 20;
            if (f.x > canvas.width + 20) f.x = -20;
            if (f.y < -20) f.y = canvas.height + 20;
            if (f.y > canvas.height + 20) f.y = -20;

            const glow = (0.3 + Math.sin(f.pulse) * 0.35 + 0.35) * Math.min(intensity, 1.3);

            const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 6);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glow * 0.3})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.beginPath(); ctx.arc(f.x, f.y, f.radius * 6, 0, Math.PI * 2);
            ctx.fillStyle = grad; ctx.fill();

            ctx.beginPath(); ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${glow})`;
            ctx.fill();
        });
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── EFFECT 5: SNOW ──
function runSnowEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50;
    const count = Math.floor(80 * intensity);
    const flakes = [];
    for (let i = 0; i < count; i++) {
        flakes.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1, speedY: (Math.random() * 1 + 0.3) * intensity,
            sway: Math.random() * Math.PI * 2, swaySpeed: Math.random() * 0.02 + 0.005,
            swayAmp: Math.random() * 0.8 + 0.2,
            opacity: (Math.random() * 0.5 + 0.3) * Math.min(intensity, 1.2)
        });
    }

    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#ffffff');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        flakes.forEach(f => {
            f.sway += f.swaySpeed;
            f.x += Math.sin(f.sway) * f.swayAmp;
            f.y += f.speedY;
            if (f.y > canvas.height + 10) { f.y = -10; f.x = Math.random() * canvas.width; }

            ctx.beginPath(); ctx.arc(f.x, f.y, f.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${f.opacity * 0.15})`; ctx.fill();

            ctx.beginPath(); ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${f.opacity})`; ctx.fill();
        });
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── EFFECT 6: RAIN ──
function runRainEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = userConfig.effectIntensity / 50;
    const count = Math.floor(100 * intensity);
    const drops = [];

    for (let i = 0; i < count; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: (Math.random() * 10 + 5) * intensity,
            opacity: (Math.random() * 0.5 + 0.1) * Math.min(intensity, 1.2)
        });
    }

    function frame() {
        const { r, g, b } = hexToRgb(userConfig.effectColor || '#00d4ff');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear but allow trails if desired (complex) - keeping simple clear

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        drops.forEach(d => {
            d.y += d.speed;
            if (d.y > canvas.height) {
                d.y = -d.length;
                d.x = Math.random() * canvas.width;
            }

            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y + d.length);
            // Dynamic opacity based on individual drop and global intensity
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${d.opacity})`;
            ctx.stroke();
        });
        effectAnimId = requestAnimationFrame(frame);
    }
    frame();
}

window.addEventListener('resize', () => {
    UI.particleCanvas.width = window.innerWidth;
    UI.particleCanvas.height = window.innerHeight;
});

// ── KEYPRESS PARTICLES ──
let keyCtx;
let keyParticles = [];

function initKeypressParticles() {
    const canvas = UI.keypressCanvas;
    if (!canvas) return;
    keyCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    loopKeypressParticles();
}

function loopKeypressParticles() {
    requestAnimationFrame(loopKeypressParticles);
    if (!keyCtx) return;

    keyCtx.clearRect(0, 0, UI.keypressCanvas.width, UI.keypressCanvas.height);

    for (let i = keyParticles.length - 1; i >= 0; i--) {
        const p = keyParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0; // Support for gravity
        p.life -= p.decay;
        p.size *= 0.94;

        if (p.life <= 0 || p.size < 0.1) {
            keyParticles.splice(i, 1);
            continue;
        }

        keyCtx.beginPath();
        keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const { r, g, b } = hexToRgb(p.color);
        keyCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life})`;
        keyCtx.fill();
    }
}

function spawnKeypressParticles(x, y) {
    if (!userConfig.particle) return;

    const count = 4 + Math.random() * 6;
    const color = userConfig.particleColor || '#ffd700';

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        keyParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            decay: 0.03 + Math.random() * 0.05,
            size: 2 + Math.random() * 3,
            color: color
        });
    }
}

function spawnHagakureParticles(x, y) {
    if (!userConfig.particle) return;

    // 1. Blood Spray
    const bloodCount = 8 + Math.random() * 8;
    for (let i = 0; i < bloodCount; i++) {
        const angle = (Math.random() * Math.PI) + Math.PI; // Upward-ish arc
        const speed = 2 + Math.random() * 5;
        keyParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.025,
            size: 1.5 + Math.random() * 2.5,
            color: '#ce1126',
            gravity: 0.18
        });
    }

    // 2. Steel Sparks
    const sparkCount = 4 + Math.random() * 4;
    for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 6;
        keyParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.8,
            decay: 0.05 + Math.random() * 0.1,
            size: 1 + Math.random() * 1.5,
            color: '#ffffff',
            gravity: 0.05
        });
    }
}


// --- 4. THEME MANAGER ---

function initTheme() {
    const savedConfig = localStorage.getItem('zenTypeConfig');
    if (savedConfig) {
        userConfig = { ...userConfig, ...JSON.parse(savedConfig) };
        // Ensure wallpaperAudio is present (migration)
        if (userConfig.wallpaperAudio === undefined) userConfig.wallpaperAudio = true;
    }

    // Restore sound preference
    const savedSound = localStorage.getItem('zenTypeSoundEnabled');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
        if (!soundEnabled) {
            const icon = UI.soundBtn.querySelector('i');
            icon.className = 'ri-volume-mute-line text-xl';
            UI.soundBtn.classList.add('muted');
        }
    }

    renderWallpaperGrid();
    setupSettingsListeners();
    applyTheme();

    // Sync effect UI
    document.querySelectorAll('.effect-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.effect === userConfig.effectType));
    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.toggle('active', dot.dataset.color === userConfig.effectColor));
    document.getElementById('custom-color-picker').value = userConfig.effectColor;
    document.getElementById('intensity-slider').value = userConfig.effectIntensity;
    document.getElementById('intensity-value').innerText = userConfig.effectIntensity + '%';

    // Sync sound UI
    document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.sound === userConfig.soundProfile));
    document.getElementById('volume-slider').value = userConfig.soundVolume;
    document.getElementById('volume-value').innerText = userConfig.soundVolume + '%';

    // Sync music volume UI
    const bgVol = userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50;
    document.getElementById('bg-volume-slider').value = bgVol;
    document.getElementById('bg-volume-value').innerText = bgVol + '%';

    // Apply Caret Style
    document.body.dataset.caret = userConfig.caretStyle || 'line';
    document.querySelectorAll('.caret-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.caret === (userConfig.caretStyle || 'line'))
    );

    // Apply Font
    const font = userConfig.fontFamily || 'modern';
    document.documentElement.style.setProperty('--font-main', `var(--font-${font})`);
    document.querySelectorAll('.font-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.font === font)
    );
}

function toggleZenMode(forceState = null) {
    const isZen = forceState !== null ? forceState : !document.body.classList.contains('zen-mode');

    if (isZen) {
        document.body.classList.add('zen-mode');
        // If UI.zenBtn exists, update icon? (Optional)
    } else {
        document.body.classList.remove('zen-mode');
    }
    userConfig.zenMode = isZen;
    saveConfig();
}

function applyTheme(skipLoader = false) {
    const wp = wallpapers.find(w => w.id === userConfig.wallpaperId) || wallpapers[0];

    // --- AUDIO TOGGLE UI ---
    if (UI.wallpaperSoundBtn) {
        if (wp.hasAudio) {
            UI.wallpaperSoundBtn.classList.remove('hidden');
            const icon = UI.wallpaperSoundBtn.querySelector('i');
            if (userConfig.wallpaperAudio) {
                icon.className = 'ri-volume-up-line text-xl';
                UI.wallpaperSoundBtn.classList.remove('muted');
            } else {
                icon.className = 'ri-volume-mute-line text-xl';
                UI.wallpaperSoundBtn.classList.add('muted');
            }
        } else {
            UI.wallpaperSoundBtn.classList.add('hidden');
        }
    }

    // --- AUDIO CLASH PREVENTION & LINKED TRACKS ---
    // If wallpaper has audio enabled, we stop music. 
    // If it's disabled, we allow music.

    if (wp.linkedTrackUrl) {
        // Find the track in masterPlaylist
        const trackIndex = masterPlaylist.findIndex(t => t.url === wp.linkedTrackUrl);
        if (trackIndex !== -1) {
            playSpecificMasterTrack(trackIndex);
        }
    }
    // Decoupled: Removed logic that stops master music if wallpaper has audio.
    // They can now play simultaneously.

    // --- HANDLE AUDIO (Master vs Specific) ---
    // Since we removed local audio files, we only check for Soundboard (SC) or Video Audio.
    // Master Audio (Local) Logic Removed.

    // 2. Handle Specific Audio File (No longer used, removed audioUrl)
    if (currentBgAudio) {
        currentBgAudio.pause();
        currentBgAudio = null;
    }

    if (!skipLoader) UI.loadingOverlay.classList.remove('hidden');

    if (wp.isVideo) {
        UI.bgVideo.classList.add('fade-out');
        UI.bgVideo.oncanplay = null;
        UI.bgVideo.onerror = null;

        // Always start muted to ensure autoplay works visually
        UI.bgVideo.muted = true;
        UI.bgVideo.volume = (userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50) / 100;
        UI.bgVideo.src = wp.url;
        UI.bgVideo.load();

        UI.bgVideo.oncanplay = () => {
            UI.bgVideo.oncanplay = null;
            // Attempt to play immediately (should succeed since muted)
            const playPromise = UI.bgVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    UI.bgVideo.classList.remove('fade-out');
                    document.body.style.backgroundImage = 'none';
                    if (!skipLoader) UI.loadingOverlay.classList.add('hidden');

                    // If video has audio, unmute on first interaction
                    // If video has audio, unmute on first interaction if enabled
                    if (wp.hasAudio) {
                        const enableAudio = () => {
                            if (soundEnabled && userConfig.wallpaperAudio) UI.bgVideo.muted = false;
                            else UI.bgVideo.muted = true; // Ensure muted if disabled

                            document.removeEventListener('click', enableAudio);
                            document.removeEventListener('keydown', enableAudio);
                        };

                        // If we are re-applying (skipLoader=true), we might already have interacted
                        if (skipLoader && userConfig.wallpaperAudio) {
                            UI.bgVideo.muted = false;
                        } else if (skipLoader && !userConfig.wallpaperAudio) {
                            UI.bgVideo.muted = true;
                        } else {
                            document.addEventListener('click', enableAudio);
                            document.addEventListener('keydown', enableAudio);
                        }
                    }
                }).catch(error => {
                    console.log("Autoplay failed:", error);
                    // Fallback: wait for interaction
                    const forcePlay = () => {
                        UI.bgVideo.play();
                        UI.bgVideo.classList.remove('fade-out');
                        document.body.style.backgroundImage = 'none';
                    };
                    document.addEventListener('click', forcePlay, { once: true });
                    document.addEventListener('keydown', forcePlay, { once: true });
                    if (!skipLoader) UI.loadingOverlay.classList.add('hidden');
                });
            }
        };

        UI.bgVideo.onerror = () => {
            console.error('Video failed to load:', wp.url);
            const fallback = wallpapers.find(w => !w.isVideo);
            if (fallback) document.body.style.backgroundImage = `url('${fallback.url}')`;
            if (!skipLoader) UI.loadingOverlay.classList.add('hidden');
        };
    } else {
        UI.bgVideo.classList.add('fade-out');
        UI.bgVideo.muted = true;
        setTimeout(() => UI.bgVideo.pause(), 500);

        const img = new Image();
        img.src = wp.url;
        img.onload = () => {
            document.body.style.backgroundImage = `url('${wp.url}')`;
            if (!skipLoader) UI.loadingOverlay.classList.add('hidden');
        };
    }

    setTimeout(() => {
        if (!skipLoader && !UI.loadingOverlay.classList.contains('hidden')) {
            UI.loadingOverlay.classList.add('hidden');
        }
    }, 5000);

    document.documentElement.style.setProperty('--panel-opacity', userConfig.opacity / 100);
    UI.opacitySlider.value = userConfig.opacity;
    UI.opacityValue.innerText = userConfig.opacity + '%';

    let rgb = '20, 20, 30';
    if (userConfig.tint === 'light') rgb = '255, 255, 255';
    if (userConfig.tint === 'glass') rgb = '100, 100, 100';
    if (userConfig.tint === 'midnight') rgb = '10, 10, 46';
    if (userConfig.tint === 'warm') rgb = '42, 26, 10';
    if (userConfig.tint === 'transparent') rgb = '0, 0, 0';
    document.documentElement.style.setProperty('--panel-bg', rgb);

    // Handle transparent tint — override opacity to 0, remove border/shadow
    const glassPanel = document.querySelector('.glass-panel');
    if (userConfig.tint === 'transparent') {
        document.documentElement.style.setProperty('--panel-opacity', '0');
        if (glassPanel) {
            glassPanel.style.border = 'none';
            glassPanel.style.boxShadow = 'none';
            glassPanel.style.backdropFilter = 'none';
            glassPanel.style.webkitBackdropFilter = 'none';
        }
    } else {
        if (glassPanel) {
            glassPanel.style.border = '';
            glassPanel.style.boxShadow = '';
            glassPanel.style.backdropFilter = '';
            glassPanel.style.webkitBackdropFilter = '';
        }
    }

    if (userConfig.tint === 'light') {
        document.documentElement.style.setProperty('--text-main', '#1a1a1a');
        document.documentElement.style.setProperty('--text-muted', 'rgba(0,0,0,0.5)');
    } else {
        document.documentElement.style.setProperty('--text-main', 'rgba(255, 255, 255, 0.9)');
        document.documentElement.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.4)');
    }

    document.querySelectorAll('.tint-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tint === userConfig.tint));
    document.querySelectorAll('.wallpaper-thumb').forEach(thumb => thumb.classList.toggle('active', thumb.dataset.id === userConfig.wallpaperId));

    document.querySelectorAll('.wallpaper-thumb').forEach(thumb => thumb.classList.toggle('active', thumb.dataset.id === userConfig.wallpaperId));

    // Apply Caret Style
    document.body.dataset.caret = userConfig.caretStyle || 'line';
    document.documentElement.style.setProperty('--caret-color', userConfig.caretColor || '#ffd700');
    document.querySelectorAll('.caret-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.caret === (userConfig.caretStyle || 'line'))
    );

    // Sync Caret Color UI
    document.querySelectorAll('.caret-color-dot').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.caretColor === (userConfig.caretColor || '#ffd700'));
    });
    const caretPicker = document.getElementById('caret-custom-color');
    if (caretPicker) caretPicker.value = userConfig.caretColor || '#ffd700';

    // Apply Font
    const font = userConfig.fontFamily || 'modern';
    document.documentElement.style.setProperty('--font-main', `var(--font-${font})`);
    document.querySelectorAll('.font-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.font === font)
    );

    // Particle UI
    const pToggle = document.getElementById('particle-toggle');
    if (pToggle) pToggle.checked = userConfig.particle !== false;

    document.querySelectorAll('.color-btn').forEach(btn => {
        const colorMap = { gold: '#ffd700', cyan: '#00d4ff', magenta: '#ff00ff', white: '#ffffff' };
        const hex = colorMap[btn.dataset.color] || btn.dataset.color;
        btn.classList.toggle('active', hex === (userConfig.particleColor || '#ffd700'));
    });

    saveConfig();
}

function renderWallpaperGrid() {
    // --- Render category tabs ---
    const tabsContainer = document.getElementById('wallpaper-tabs');
    tabsContainer.innerHTML = wallpaperCategories.map(cat => {
        const count = wallpapers.filter(w => w.category === cat.id || (w.categories && w.categories.includes(cat.id))).length;
        return `<button class="category-tab ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
            <i class="${cat.icon}"></i>
            <span>${cat.label}</span>
            <span class="tab-count">${count}</span>
        </button>`;
    }).join('');

    // --- Tab click handler ---
    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;
        currentCategory = tab.dataset.category;
        renderWallpaperGrid();
    });

    // --- Render filtered wallpaper thumbnails ---
    const filtered = wallpapers.filter(w => w.category === currentCategory || (w.categories && w.categories.includes(currentCategory)));

    if (filtered.length === 0) {
        UI.wallpaperGrid.innerHTML = `
            <div class="empty-category">
                <i class="ri-add-circle-line"></i>
                <span>No wallpapers yet</span>
                <span class="empty-hint">Add items to this category in script.js</span>
            </div>`;
    } else {
        UI.wallpaperGrid.innerHTML = filtered.map(wp =>
            `<div class="wallpaper-thumb ${wp.id === userConfig.wallpaperId ? 'active' : ''}" 
                  style="background-image: url('${wp.thumb}')" 
                  data-id="${wp.id}"
                  title="${wp.id}">
                  ${wp.isVideo ? '<i class="ri-movie-fill text-white absolute bottom-1 right-1 text-xs drop-shadow-md"></i>' : ''}
            </div>`
        ).join('');
    }
}


function setupSettingsListeners() {
    UI.settingsBtn.addEventListener('click', () => UI.settingsModal.classList.remove('hidden'));
    UI.closeSettingsBtn.addEventListener('click', () => {
        UI.settingsModal.classList.add('hidden');
        UI.input.focus();
    });

    // Style selection removed (integrated into wallpaper grid)

    // Settings tab switching
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // --- MODES MODAL LOGIC ---
    const modesBtn = document.getElementById('modes-btn');
    const modesModal = document.getElementById('modes-modal');
    const closeModesBtn = document.getElementById('close-modes-btn');

    if (modesBtn && modesModal && closeModesBtn) {
        modesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modesModal.classList.remove('hidden');
        });

        closeModesBtn.addEventListener('click', () => {
            modesModal.classList.add('hidden');
        });

        modesModal.addEventListener('click', (e) => {
            if (e.target === modesModal) {
                modesModal.classList.add('hidden');
            }
        });

        // Hagakure Card Click
        const hagakureCard = document.querySelector('.mode-card.active'); // Assuming Hagakure is the only active one for now
        if (hagakureCard) {
            hagakureCard.addEventListener('click', () => {
                startHagakureMode();
                modesModal.classList.add('hidden');
            });
        }

        // Shadow Mode Card Click
        const shadowCard = document.getElementById('shadow-mode-card');
        if (shadowCard) {
            shadowCard.addEventListener('click', () => {
                startShadowMode();
                modesModal.classList.add('hidden');
            });
        }

        // Dojo Mode Card Click
        const dojoCard = document.getElementById('dojo-mode-card');
        if (dojoCard) {
            dojoCard.addEventListener('click', () => {
                startDojoMode();
                modesModal.classList.add('hidden');
            });
        }
    }

    // ═══════════════════════════════════════════════════════
    //                    DOJO MODE
    //     "The Dojo is where the blade learns to sing."
    // ═══════════════════════════════════════════════════════

    let dojoState = {
        active: false,
        target: null,
        streak: 0,
        maxStreak: 0,
        total: 0,
        correct: 0,
        listener: null,
        handGuideOn: false
    };

    function startDojoMode() {
        const splash = document.getElementById('dojo-splash');
        if (!splash) return;

        splash.classList.remove('hidden');

        setTimeout(() => {
            splash.classList.add('hidden');

            // Hide main UI
            const gameUI = document.getElementById('game-ui');
            const appHeader = document.getElementById('app-header');
            const navButtons = document.getElementById('top-nav-buttons');
            const footer = document.querySelector('footer') || document.querySelector('.site-footer');

            if (gameUI) gameUI.classList.add('hidden');
            if (appHeader) appHeader.style.display = 'none';
            if (navButtons) navButtons.style.display = 'none';
            if (footer) footer.style.display = 'none';

            // Show Dojo UI with setup screen
            const dojoUI = document.getElementById('dojo-ui');
            if (dojoUI) dojoUI.classList.remove('hidden');

            state.gameMode = 'dojo';

            initDojoSetup();

        }, 2500);
    }

    const dojoLevelInfo = {
        1: {
            title: "KATANA POSITION",
            desc: "The foundation of all swordplay begins with the grip. In typing, this is the Home Row position for your index fingers (F & J). Mastering this anchors your hands, allowing you to strike any key without looking.",
            benefits: [
                "Establishes core muscle memory",
                "Eliminates the need to look at the keyboard",
                "foundation for all future speed"
            ]
        },
        2: {
            title: "FIRST STRIKES",
            desc: "The Home Row (A-S-D-F-G-H-J-K-L) is your center of gravity. These keys are the most accessible and frequently used. Mastery here means you never lose your balance.",
            benefits: [
                "Covers 70% of common typing strokes",
                "Maximum speed with minimal movement",
                "Reduces finger fatigue significantly"
            ]
        },
        3: {
            title: "RISING BLADE",
            desc: "The Top Row contains many of the most dominant letters (E, R, T, O, I). Reaching up without lifting your palms is the mark of a disciplined warrior.",
            benefits: [
                "Access to high-frequency vowels (E, I, O)",
                "Develops vertical finger independence",
                "Essential for fluid sentence structure"
            ]
        },
        4: {
            title: "GROUNDING STANCE",
            desc: "The Bottom Row is often the most neglected. Striking downwards requires a shift in weight and intent. Mastery ensures no weakness in your defense.",
            benefits: [
                "Conquers the hardest-to-reach keys",
                "Prevents rhythm breaks on common letters (N, M, C)",
                "Completes full keyboard control"
            ]
        },
        5: {
            title: "FLOWING WATER",
            desc: "Now you must blend all stances. There are no rows anymore, only the flow of characters. Your fingers should move like water, adapting to any letter instantly.",
            benefits: [
                "Seamless transitions between rows",
                "Unified mental map of the keyboard",
                "Preparation for real-world typing"
            ]
        },
        6: {
            title: "WORDS OF POWER",
            desc: "Individual strikes mean nothing if they do not form meaning. Here you channel your technique into actual words, learning the rhythm of language itself.",
            benefits: [
                "Transition from letters to patterns",
                "Recognize common word shapes",
                "Increases Words Per Minute (WPM) drastically"
            ]
        },
        7: {
            title: "WAY OF THE WIND",
            desc: "Attributes: Speed, Reflexes, Instinct. You have the technique; now you need the speed. This level pushes you to your absolute limit. Hesitation is defeat.",
            benefits: [
                "Raw reaction time training",
                "Stress-testing your muscle memory",
                "The path to becoming a Grandmaster"
            ]
        }
    };

    function initDojoSetup() {
        // Show setup, hide game board
        const setup = document.getElementById('dojo-setup');
        const board = document.getElementById('dojo-game-board');
        if (setup) setup.style.display = '';
        if (board) board.classList.add('hidden');

        // Exit btn — leaves dojo entirely
        const exitBtn = document.getElementById('dojo-exit-btn');
        if (exitBtn) exitBtn.onclick = exitDojoMode;

        // Back btn — returns from game to level select
        const backBtn = document.getElementById('dojo-back-btn');
        if (backBtn) backBtn.onclick = backToDojoSetup;

        const guideBtn = document.getElementById('dojo-guide-btn');
        if (guideBtn) guideBtn.onclick = toggleHandGuide;

        // Info Modal Elements
        const infoModal = document.getElementById('dojo-level-info-modal');
        const closeInfoBtn = document.getElementById('close-dojo-info');
        const infoOverlay = document.querySelector('.dojo-info-overlay');

        if (closeInfoBtn) closeInfoBtn.onclick = () => infoModal.classList.add('hidden');
        if (infoOverlay) infoOverlay.onclick = () => infoModal.classList.add('hidden');

        // Info Triggers
        document.querySelectorAll('.dojo-info-trigger').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent level launch
                const level = btn.dataset.level;
                const data = dojoLevelInfo[level];

                if (data && infoModal) {
                    document.getElementById('d-info-title').textContent = data.title;
                    document.getElementById('d-info-desc').textContent = data.desc;
                    const list = document.getElementById('d-info-list');
                    list.innerHTML = data.benefits.map(b => `<li>${b}</li>`).join('');
                    infoModal.classList.remove('hidden');
                }
            };
        });

        // Level card click handlers
        const cards = document.querySelectorAll('.dojo-level-card');
        cards.forEach(card => {
            card.onclick = () => {
                if (card.classList.contains('locked')) return;
                const level = parseInt(card.dataset.level);
                launchDojoLevel(level);
            };
        });
    }

    function launchDojoLevel(level) {
        // Hide setup, show game board
        const setup = document.getElementById('dojo-setup');
        const board = document.getElementById('dojo-game-board');
        if (setup) setup.style.display = 'none';
        if (board) board.classList.remove('hidden');

        // Level config
        const levelConfig = {
            1: { name: 'KATANA POSITION', keys: ['f', 'j'], mode: 'key' },
            2: { name: 'FIRST STRIKES', keys: 'asdfghjkl'.split(''), mode: 'key' },
            3: { name: 'RISING BLADE', keys: 'qwertyuiop'.split(''), mode: 'key' },
            4: { name: 'GROUNDING STANCE', keys: 'zxcvbnm'.split(''), mode: 'key' },
            5: { name: 'FLOWING WATER', keys: 'abcdefghijklmnopqrstuvwxyz'.split(''), mode: 'key' },
            6: {
                name: 'WORDS OF POWER', mode: 'word', words: [
                    'blade', 'steel', 'flame', 'storm', 'blood', 'honor', 'death', 'swift',
                    'strike', 'power', 'focus', 'spirit', 'shadow', 'light', 'brave',
                    'wrath', 'forge', 'might', 'clash', 'guard', 'slash', 'force',
                    'wind', 'fury', 'oath', 'doom', 'edge', 'iron', 'soul', 'dark',
                    'shield', 'valor', 'reign', 'dread', 'stone', 'blaze', 'frost'
                ]
            },
            7: {
                name: 'WAY OF THE WIND', mode: 'word', words: [
                    'warrior', 'katana', 'samurai', 'destiny', 'victory', 'silence',
                    'thunder', 'resolve', 'courage', 'balance', 'mastery', 'tornado',
                    'phantom', 'eclipse', 'ancient', 'diamond', 'harmony', 'inferno',
                    'justice', 'kingdom', 'legends', 'tempest', 'unleash', 'volatile',
                    'whisper', 'zealous', 'ascend', 'conquer', 'defend', 'empower',
                    'immortal', 'invincible', 'relentless', 'unstoppable', 'discipline',
                    'perseverance', 'enlightenment', 'transcendence'
                ]
            }
        };

        const config = levelConfig[level] || levelConfig[1];
        dojoState.currentLevel = level;
        dojoState.keyPool = config.keys || [];
        dojoState.wordMode = config.mode === 'word';
        dojoState.timedMode = (level === 7);
        dojoState.wordPool = config.words || [];
        dojoState.currentWord = null;
        dojoState.wordCharIndex = 0;
        dojoState.timerInterval = null;

        // Toggle key prompt vs word display
        const promptArea = document.querySelector('#dojo-game-board .dojo-prompt-area');
        const wordDisplay = document.getElementById('dojo-word-display');
        const timerBar = document.getElementById('dojo-timer-bar');
        if (dojoState.wordMode) {
            if (promptArea) promptArea.style.display = 'none';
            if (wordDisplay) wordDisplay.classList.remove('hidden');
            if (timerBar) timerBar.classList.toggle('hidden', !dojoState.timedMode);
        } else {
            if (promptArea) promptArea.style.display = '';
            if (wordDisplay) wordDisplay.classList.add('hidden');
            if (timerBar) timerBar.classList.add('hidden');
        }

        // Update header
        const titleEl = document.getElementById('dojo-board-title');
        const levelEl = document.getElementById('dojo-board-level');
        if (titleEl) titleEl.textContent = 'THE DOJO';
        if (levelEl) levelEl.textContent = `LEVEL ${level} \u2014 ${config.name}`;

        // Show/hide global timer for Level 7
        const globalTimer = document.getElementById('dojo-global-timer');
        const globalTimerValue = document.getElementById('dojo-global-timer-value');
        if (dojoState.timedMode) {
            if (globalTimer) globalTimer.classList.remove('hidden');
            if (globalTimerValue) {
                globalTimerValue.textContent = '00:15';
                globalTimerValue.classList.remove('danger');
            }
            dojoState.globalTimeLeft = 15; // 15 seconds (Final)
            dojoState.globalTimerInterval = null;
        } else {
            if (globalTimer) globalTimer.classList.add('hidden');
            if (dojoState.globalTimerInterval) {
                clearInterval(dojoState.globalTimerInterval);
                dojoState.globalTimerInterval = null;
            }
        }

        renderDojoKeyboard();
        initDojoLevel1();
    }

    function backToDojoSetup() {
        // Cleanup listener
        if (dojoState.listener) {
            document.removeEventListener('keydown', dojoState.listener);
            dojoState.listener = null;
        }
        if (dojoState.timerInterval) {
            clearInterval(dojoState.timerInterval);
            dojoState.timerInterval = null;
        }
        if (dojoState.globalTimerInterval) {
            clearInterval(dojoState.globalTimerInterval);
            dojoState.globalTimerInterval = null;
        }
        dojoState.active = false;

        initDojoSetup();
    }


    function exitDojoMode() {
        // Cleanup listener
        if (dojoState.listener) {
            document.removeEventListener('keydown', dojoState.listener);
            dojoState.listener = null;
        }
        if (dojoState.timerInterval) {
            clearInterval(dojoState.timerInterval);
            dojoState.timerInterval = null;
        }
        if (dojoState.globalTimerInterval) {
            clearInterval(dojoState.globalTimerInterval);
            dojoState.globalTimerInterval = null;
        }
        dojoState.active = false;

        // Hide Dojo UI
        const dojoUI = document.getElementById('dojo-ui');
        if (dojoUI) dojoUI.classList.add('hidden');

        // Restore main UI
        const gameUI = document.getElementById('game-ui');
        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (gameUI) gameUI.classList.remove('hidden');
        if (appHeader) appHeader.style.display = '';
        if (navButtons) navButtons.style.display = '';
        if (footer) footer.style.display = '';

        state.gameMode = 'time';
        newGame();
    }

    function renderDojoKeyboard() {
        const container = document.getElementById('dojo-keyboard-container');
        if (!container) return;

        const keyW = 60, keyH = 60, gap = 5;
        const rows = [
            { keys: 'QWERTYUIOP'.split(''), offsetX: 20 },
            { keys: 'ASDFGHJKL'.split(''), offsetX: 40 },
            { keys: 'ZXCVBNM'.split(''), offsetX: 72 }
        ];

        const svgW = 10 * (keyW + gap) + 80;
        const svgH = 3 * (keyH + gap) + 30;

        let svg = `<svg id="dojo-keyboard" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">`;

        rows.forEach((row, ri) => {
            const y = 15 + ri * (keyH + gap);
            row.keys.forEach((key, ki) => {
                const x = row.offsetX + ki * (keyW + gap);
                const isBalance = (key === 'F' || key === 'J');
                const groupClass = isBalance ? 'balance-point' : '';

                svg += `<g class="dojo-key ${groupClass}" data-key="${key.toLowerCase()}">`;
                svg += `<rect class="key-bg" x="${x}" y="${y}" width="${keyW}" height="${keyH}" rx="6" ry="6"/>`;
                svg += `<text class="key-label" x="${x + keyW / 2}" y="${y + keyH / 2}">${key}</text>`;

                // Balance point bump indicator
                if (isBalance) {
                    svg += `<line class="balance-marker" x1="${x + keyW / 2 - 6}" y1="${y + keyH - 8}" x2="${x + keyW / 2 + 6}" y2="${y + keyH - 8}"/>`;

                    // Blood drips from F and J keys
                    const drips = [
                        { dx: keyW * 0.25, delay: 0 },
                        { dx: keyW * 0.55, delay: 1.2 },
                        { dx: keyW * 0.75, delay: 2.4 }
                    ];
                    drips.forEach((drip, di) => {
                        const dripX = x + drip.dx;
                        const dripStartY = y + keyH;
                        svg += `<g class="blood-drip" style="animation-delay: ${drip.delay}s">`;
                        svg += `<ellipse cx="${dripX}" cy="${dripStartY + 6}" rx="2.5" ry="3.5" class="blood-drop"/>`;
                        svg += `<rect x="${dripX - 1}" y="${dripStartY}" width="2" height="6" class="blood-trail" rx="1"/>`;
                        svg += `</g>`;
                    });
                }

                svg += `</g>`;
            });
        });

        svg += `</svg>`;
        container.innerHTML = svg;

        // Add hand guide overlay
        createHandGuideOverlay(container);
    }

    function createHandGuideOverlay(container) {
        const old = document.getElementById('hand-guide-overlay');
        if (old) old.remove();

        // Keyboard: keyW=60, keyH=60, gap=5
        // Home row: y=80..140, key centers: A=70, S=135, D=200, F=265 | J=460, K=525, L=590
        const palmY = 150; // Where fingers meet the palm

        // ── Finger SVG generator ──
        // Creates a natural tapered finger with knuckle detail + fingernail arc
        function finger(cx, tipY, baseW, tipW, name) {
            const bh = baseW / 2;
            const th = tipW / 2;
            const len = palmY - tipY;
            const k1Y = tipY + len * 0.35;
            const k2Y = tipY + len * 0.65;
            const midW = (bh + th) / 2;

            let d = `M ${cx - bh} ${palmY}`;
            d += ` C ${cx - bh} ${k2Y + 5}, ${cx - midW - 0.5} ${k1Y + 8}, ${cx - th} ${tipY + th}`;
            d += ` Q ${cx - th} ${tipY - 1}, ${cx} ${tipY - 2}`;
            d += ` Q ${cx + th} ${tipY - 1}, ${cx + th} ${tipY + th}`;
            d += ` C ${cx + midW + 0.5} ${k1Y + 8}, ${cx + bh} ${k2Y + 5}, ${cx + bh} ${palmY}`;

            let g = `<g class="guide-finger-position" data-finger="${name}">`;
            g += `<g class="guide-finger-squish">`; // Inner group for squish animation
            g += `<path d="${d}" class="guide-finger"/>`;

            const nailW = th * 0.75;
            const nailY = tipY + 3;
            g += `<path d="M ${cx - nailW} ${nailY + 4} Q ${cx - nailW} ${nailY}, ${cx} ${nailY - 1} Q ${cx + nailW} ${nailY}, ${cx + nailW} ${nailY + 4}" class="guide-nail"/>`;

            const crW1 = midW * 0.7;
            const crW2 = (midW + bh) / 2 * 0.6;
            g += `<line x1="${cx - crW1}" y1="${k1Y}" x2="${cx + crW1}" y2="${k1Y}" class="guide-crease"/>`;
            g += `<line x1="${cx - crW2}" y1="${k2Y}" x2="${cx + crW2}" y2="${k2Y}" class="guide-crease"/>`;

            // Marker for ripple effect origin
            g += `<circle cx="${cx}" cy="${tipY}" r="0" class="guide-tip-marker" style="display:none;"/>`;

            g += `</g>`; // End squish group
            g += `</g>`; // End position group
            return g;
        }

        let svg = `<svg viewBox="0 0 730 310" preserveAspectRatio="xMidYMid meet" class="hand-guide-svg" xmlns="http://www.w3.org/2000/svg">`;

        // ═══════ LEFT HAND ═══════
        svg += `<g class="guide-hand guide-hand-left">`;
        //              center  tipY  baseW  tipW   name
        svg += finger(70, 102, 13, 10, 'l-pinky');
        svg += finger(135, 90, 15, 12, 'l-ring');
        svg += finger(200, 83, 16, 13, 'l-mid');
        svg += finger(265, 89, 16, 13, 'l-index');

        // Skin webs between fingers (natural V-curves)
        // svg += `<path d="M 77 ${palmY} Q 102 ${palmY - 14}, 127 ${palmY}" class="guide-web"/>`;
        // svg += `<path d="M 143 ${palmY} Q 168 ${palmY - 18}, 192 ${palmY}" class="guide-web"/>`;
        // svg += `<path d="M 208 ${palmY} Q 233 ${palmY - 15}, 257 ${palmY}" class="guide-web"/>`;

        // Left palm — slim, stays within finger span
        // svg += `<path d="
        //     M 63 ${palmY}
        //     C 63 ${palmY + 15}, 65 ${palmY + 35}, 72 ${palmY + 52}
        //     C 80 ${palmY + 70}, 100 ${palmY + 78}, 140 ${palmY + 80}
        //     L 200 ${palmY + 78}
        //     C 240 ${palmY + 75}, 260 ${palmY + 68}, 268 ${palmY + 50}
        //     C 273 ${palmY + 35}, 273 ${palmY + 15}, 273 ${palmY}
        // " class="guide-palm"/>`;

        // Palm crease lines
        // svg += `<path d="M 72 ${palmY + 20} Q 120 ${palmY + 35}, 168 ${palmY + 32} Q 220 ${palmY + 28}, 260 ${palmY + 15}" class="guide-crease" fill="none"/>`;
        // svg += `<path d="M 78 ${palmY + 42} Q 130 ${palmY + 54}, 175 ${palmY + 52} Q 230 ${palmY + 48}, 262 ${palmY + 38}" class="guide-crease" fill="none"/>`;

        // Wrist — tapers in slightly
        // svg += `<path d="
        //     M 80 ${palmY + 76} L 92 ${palmY + 110}
        // " class="guide-wrist"/>`;
        // svg += `<path d="
        //     M 258 ${palmY + 72} L 248 ${palmY + 110}
        // " class="guide-wrist"/>`;

        svg += `</g>`;

        // ═══════ RIGHT HAND ═══════
        svg += `<g class="guide-hand guide-hand-right">`;

        svg += finger(460, 89, 16, 13, 'r-index');
        svg += finger(525, 83, 16, 13, 'r-mid');
        svg += finger(590, 90, 15, 12, 'r-ring');
        svg += finger(648, 102, 13, 10, 'r-pinky');

        // Skin webs between fingers
        // svg += `<path d="M 468 ${palmY} Q 493 ${palmY - 15}, 517 ${palmY}" class="guide-web"/>`;
        // svg += `<path d="M 533 ${palmY} Q 558 ${palmY - 18}, 582 ${palmY}" class="guide-web"/>`;
        // svg += `<path d="M 598 ${palmY} Q 620 ${palmY - 14}, 641 ${palmY}" class="guide-web"/>`;


        // Right palm — slim, mirrored
        // svg += `<path d="
        //     M 453 ${palmY}
        //     C 453 ${palmY + 15}, 451 ${palmY + 35}, 456 ${palmY + 50}
        //     C 464 ${palmY + 68}, 484 ${palmY + 75}, 524 ${palmY + 78}
        //     L 580 ${palmY + 80}
        //     C 620 ${palmY + 78}, 644 ${palmY + 70}, 652 ${palmY + 52}
        //     C 659 ${palmY + 35}, 661 ${palmY + 15}, 661 ${palmY}
        // " class="guide-palm"/>`;

        // Palm crease lines
        // svg += `<path d="M 464 ${palmY + 15} Q 510 ${palmY + 28}, 556 ${palmY + 32} Q 610 ${palmY + 35}, 652 ${palmY + 20}" class="guide-crease" fill="none"/>`;
        // svg += `<path d="M 462 ${palmY + 38} Q 504 ${palmY + 48}, 549 ${palmY + 52} Q 604 ${palmY + 54}, 646 ${palmY + 42}" class="guide-crease" fill="none"/>`;

        // Wrist — tapers in slightly
        // svg += `<path d="
        //     M 466 ${palmY + 72} L 476 ${palmY + 110}
        // " class="guide-wrist"/>`;
        // svg += `<path d="
        //     M 644 ${palmY + 76} L 632 ${palmY + 110}
        // " class="guide-wrist"/>`;

        svg += `</g>`;
        svg += `</svg>`;

        const overlay = document.createElement('div');
        overlay.id = 'hand-guide-overlay';
        overlay.innerHTML = svg;
        overlay.style.display = dojoState.handGuideOn ? '' : 'none'; // Hidden by default
        container.appendChild(overlay);
    }

    // ── Key-to-finger mapping ──
    const keyFingerMap = {
        'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky',
        'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
        'e': 'l-mid', 'd': 'l-mid', 'c': 'l-mid',
        'r': 'l-index', 'f': 'l-index', 'v': 'l-index',
        't': 'l-index', 'g': 'l-index', 'b': 'l-index',
        'y': 'r-index', 'h': 'r-index', 'n': 'r-index',
        'u': 'r-index', 'j': 'r-index', 'm': 'r-index',
        'i': 'r-mid', 'k': 'r-mid',
        'o': 'r-ring', 'l': 'r-ring',
        'p': 'r-pinky'
    };

    // Key center positions (in SVG viewBox coords)
    // Row 0: y=45, Row 1: y=110, Row 2: y=175
    const keyCenters = {
        'q': { x: 50, y: 45 }, 'w': { x: 115, y: 45 }, 'e': { x: 180, y: 45 },
        'r': { x: 245, y: 45 }, 't': { x: 310, y: 45 }, 'y': { x: 375, y: 45 },
        'u': { x: 440, y: 45 }, 'i': { x: 505, y: 45 }, 'o': { x: 570, y: 45 },
        'p': { x: 635, y: 45 },
        'a': { x: 70, y: 110 }, 's': { x: 135, y: 110 }, 'd': { x: 200, y: 110 },
        'f': { x: 265, y: 110 }, 'g': { x: 330, y: 110 }, 'h': { x: 395, y: 110 },
        'j': { x: 460, y: 110 }, 'k': { x: 525, y: 110 }, 'l': { x: 590, y: 110 },
        'z': { x: 102, y: 175 }, 'x': { x: 167, y: 175 }, 'c': { x: 232, y: 175 },
        'v': { x: 297, y: 175 }, 'b': { x: 362, y: 175 }, 'n': { x: 427, y: 175 },
        'm': { x: 492, y: 175 }
    };

    // Finger home positions (center of home row key)
    const fingerHomes = {
        'l-pinky': { x: 70, y: 110 },
        'l-ring': { x: 135, y: 110 },
        'l-mid': { x: 200, y: 110 },
        'l-index': { x: 265, y: 110 },
        'r-index': { x: 460, y: 110 },
        'r-mid': { x: 525, y: 110 },
        'r-ring': { x: 590, y: 110 },
        'r-pinky': { x: 648, y: 110 }
    };

    function highlightGuideFinger(key) {
        if (!dojoState.handGuideOn) return;

        // Reset ALL fingers to home position and remove active class
        document.querySelectorAll('.guide-finger-position').forEach(g => {
            g.style.transform = '';
            g.querySelector('.guide-finger')?.classList.remove('finger-active');
        });

        if (!key) return;
        const info = keyFingerMap[key.toLowerCase()];
        const fingerName = typeof info === 'string' ? info : (info ? info.finger : null);
        if (!fingerName) return;

        // Highlight the legend panel
        updateFingerLegend(fingerName);

        const k = key.toLowerCase();
        const target = keyCenters[k];
        const home = fingerHomes[fingerName];
        if (!target || !home) return;

        const group = document.querySelector(`.guide-finger-position[data-finger="${fingerName}"]`);
        if (!group) return;

        // Calculate delta from home to target key
        const dx = target.x - home.x;
        const dy = target.y - home.y;

        // Create ghost trail if moving significantly
        const currentDx = parseFloat(group.style.getPropertyValue('--finger-dx') || 0);
        const currentDy = parseFloat(group.style.getPropertyValue('--finger-dy') || 0);
        const dist = Math.hypot(dx - currentDx, dy - currentDy);

        if (dist > 10) {
            const ghost = group.cloneNode(true);
            ghost.classList.add('guide-ghost');
            // Ensure ghost stays at old position
            ghost.style.transform = `translate(${currentDx}px, ${currentDy}px)`;
            // Remove ID if any to avoid duplicates
            ghost.removeAttribute('id');
            // Insert before the active group so it appears behind
            group.parentNode.insertBefore(ghost, group);

            // Remove after animation
            setTimeout(() => ghost.remove(), 300);
        }

        // Move the finger position group
        // We set vars on the *position* group, but they are inherited if needed
        group.style.setProperty('--finger-dx', `${dx}px`);
        group.style.setProperty('--finger-dy', `${dy}px`);
        group.style.transform = `translate(${dx}px, ${dy}px)`;
        group.querySelector('.guide-finger')?.classList.add('finger-active');
    }

    function animateFingerPress(key) {
        if (!dojoState.handGuideOn || !key) return;
        const k = key.toLowerCase();
        const info = keyFingerMap[k];
        const fingerName = typeof info === 'string' ? info : (info ? info.finger : null);
        if (!fingerName) return;

        const posGroup = document.querySelector(`.guide-finger-position[data-finger="${fingerName}"]`);
        if (posGroup) {
            const squishGroup = posGroup.querySelector('.guide-finger-squish');
            if (squishGroup) {
                squishGroup.classList.remove('guide-finger-pressing');
                void squishGroup.offsetWidth; // Force reflow
                squishGroup.classList.add('guide-finger-pressing');

                // Create Ripple at fingertip
                const marker = squishGroup.querySelector('.guide-tip-marker');
                if (marker) {
                    const cx = parseFloat(marker.getAttribute('cx'));
                    const cy = parseFloat(marker.getAttribute('cy'));
                    const dx = parseFloat(posGroup.style.getPropertyValue('--finger-dx') || 0);
                    const dy = parseFloat(posGroup.style.getPropertyValue('--finger-dy') || 0);

                    const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    ripple.setAttribute("cx", cx + dx);
                    ripple.setAttribute("cy", cy + dy);
                    ripple.setAttribute("r", "5");
                    ripple.setAttribute("class", "guide-ripple");

                    // Match ripple color to finger color? 
                    // Let's just use the white/default for now as it looks clean on dark bg

                    const svg = document.querySelector('.hand-guide-svg');
                    if (svg) {
                        svg.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 400);
                    }
                }
            }
        }
    }

    function flashCorrectFinger() {
        if (!dojoState.handGuideOn) return;
        // Find the currently active finger (the one the user SHOULD use)
        const activeFinger = document.querySelector('.guide-finger.finger-active');
        if (activeFinger) {
            activeFinger.classList.add('finger-wrong');
            setTimeout(() => activeFinger.classList.remove('finger-wrong'), 300);
        }
    }

    function toggleHandGuide() {
        dojoState.handGuideOn = !dojoState.handGuideOn;
        const overlay = document.getElementById('hand-guide-overlay');
        const btn = document.getElementById('dojo-guide-btn');
        const legend = document.getElementById('finger-legend-scroll');
        if (overlay) overlay.style.display = dojoState.handGuideOn ? '' : 'none';
        if (btn) btn.classList.toggle('active', dojoState.handGuideOn);

        if (legend) {
            if (dojoState.handGuideOn) {
                // Show first, then play open animation
                legend.style.display = '';
                legend.classList.remove('scroll-closing');
                // Force reflow so animation restarts
                void legend.offsetWidth;
                legend.classList.add('scroll-opening');
            } else {
                // Play close animation, then hide
                legend.classList.remove('scroll-opening');
                legend.classList.add('scroll-closing');
                legend.addEventListener('animationend', () => {
                    if (legend.classList.contains('scroll-closing')) {
                        legend.style.display = 'none';
                        legend.classList.remove('scroll-closing');
                    }
                }, { once: true });
            }
        }

        if (dojoState.handGuideOn) {
            // Move the correct finger to the currently active key
            const activeKey = document.querySelector('#dojo-keyboard .key-active');
            if (activeKey) highlightGuideFinger(activeKey.dataset.key);
        } else {
            // Reset all fingers to home
            document.querySelectorAll('.guide-finger-group').forEach(g => {
                g.style.transform = '';
                g.querySelector('.guide-finger')?.classList.remove('finger-active');
            });
            // Clear legend highlights
            document.querySelectorAll('.finger-legend-item').forEach(i => i.classList.remove('legend-active'));
        }
    }

    // Update the legend panel to highlight the active finger
    function updateFingerLegend(fingerName) {
        if (!dojoState.handGuideOn) return;
        const items = document.querySelectorAll('.finger-legend-item');
        items.forEach(item => {
            const legFinger = item.dataset.legendFinger;
            const isActive = fingerName && fingerName.includes(legFinger);
            item.classList.toggle('legend-active', isActive);
        });
    }

    function initDojoLevel1() {
        // Reset state
        dojoState.active = true;
        dojoState.streak = 0;
        dojoState.maxStreak = 0;
        dojoState.total = 0;
        dojoState.correct = 0;
        dojoState.wordCharIndex = 0;

        updateDojoStats();
        nextDojoPrompt();

        // Start global 30-min countdown for Level 7
        if (dojoState.timedMode && dojoState.globalTimeLeft > 0) {
            if (dojoState.globalTimerInterval) clearInterval(dojoState.globalTimerInterval);

            dojoState.globalTimerInterval = setInterval(() => {
                if (!dojoState.active) return;

                dojoState.globalTimeLeft--;
                const mins = Math.floor(dojoState.globalTimeLeft / 60);
                const secs = dojoState.globalTimeLeft % 60;
                const timerEl = document.getElementById('dojo-global-timer-value');
                if (timerEl) {
                    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                    if (dojoState.globalTimeLeft <= 60) {
                        timerEl.classList.add('danger');
                    }
                }

                if (dojoState.globalTimeLeft <= 0) {
                    clearInterval(dojoState.globalTimerInterval);
                    dojoState.globalTimerInterval = null;
                    dojoLevel7Victory();
                }
            }, 1000);
        }

        // Remove old listener if any
        if (dojoState.listener) {
            document.removeEventListener('keydown', dojoState.listener);
        }

        dojoState.listener = (e) => {
            if (!dojoState.active) return;
            if (state.gameMode !== 'dojo') return;

            const pressed = e.key.toLowerCase();
            if (pressed.length !== 1 || pressed < 'a' || pressed > 'z') return;

            e.preventDefault();

            if (dojoState.wordMode) {
                // === WORD MODE ===
                handleDojoWordInput(pressed);
            } else {
                // === KEY MODE ===
                handleDojoKeyInput(pressed);
            }

            updateDojoStats();
        };

        document.addEventListener('keydown', dojoState.listener);
    }

    function handleDojoKeyInput(pressed) {
        dojoState.total++;

        if (pressed === dojoState.target) {
            dojoState.correct++;
            dojoState.streak++;
            if (dojoState.streak > dojoState.maxStreak) dojoState.maxStreak = dojoState.streak;

            const keyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${pressed}"]`);
            if (keyEl) {
                keyEl.classList.remove('key-active');
                keyEl.classList.add('key-correct');
                setTimeout(() => keyEl.classList.remove('key-correct'), 300);
            }

            showDojoSliceEffect();
            playDojoSliceSound();
            animateFingerPress(pressed);

            setTimeout(() => {
                if (dojoState.active) nextDojoPrompt();
            }, 300);
        } else {
            dojoState.streak = 0;
            flashCorrectFinger();

            const keyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${pressed}"]`);
            if (keyEl) {
                keyEl.classList.add('key-wrong');
                setTimeout(() => keyEl.classList.remove('key-wrong'), 400);
            }

            showDojoClashEffect();
            playDojoClashSound();

            const container = document.getElementById('dojo-keyboard-container');
            if (container) {
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 300);
            }
        }
    }

    function handleDojoWordInput(pressed) {
        const word = dojoState.currentWord;
        if (!word) return;

        const expected = word[dojoState.wordCharIndex];
        const charSpans = document.querySelectorAll('#dojo-word-chars .dojo-word-char');
        dojoState.total++;

        // Highlight pressed key on keyboard
        const keyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${pressed}"]`);

        if (pressed === expected) {
            // Correct character
            dojoState.correct++;
            dojoState.streak++;
            if (dojoState.streak > dojoState.maxStreak) dojoState.maxStreak = dojoState.streak;

            // Mark char as typed
            if (charSpans[dojoState.wordCharIndex]) {
                charSpans[dojoState.wordCharIndex].classList.remove('active');
                charSpans[dojoState.wordCharIndex].classList.add('typed');
            }

            // Flash key green
            if (keyEl) {
                keyEl.classList.add('key-correct');
                setTimeout(() => keyEl.classList.remove('key-correct'), 300);
            }

            dojoState.wordCharIndex++;

            // Check if word is complete
            if (dojoState.wordCharIndex >= word.length) {
                // Clear timer if timed mode
                if (dojoState.timerInterval) {
                    clearInterval(dojoState.timerInterval);
                    dojoState.timerInterval = null;
                }

                // Word done — slice effect!
                showDojoSliceEffect();
                playDojoSliceSound();
                animateFingerPress(pressed); // Animate last char press

                setTimeout(() => {
                    if (dojoState.active) nextDojoPrompt();
                }, 400);
            } else {
                // Highlight next char
                if (charSpans[dojoState.wordCharIndex]) {
                    charSpans[dojoState.wordCharIndex].classList.add('active');
                }

                // Animate press for current char (before moving to next)
                animateFingerPress(pressed);

                // Highlight next key on keyboard
                const nextKey = word[dojoState.wordCharIndex];
                document.querySelectorAll('#dojo-keyboard .key-active').forEach(el => el.classList.remove('key-active'));
                const nextKeyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${nextKey}"]`);
                if (nextKeyEl) nextKeyEl.classList.add('key-active');
                highlightGuideFinger(nextKey);
            }
        } else {
            // Wrong character
            dojoState.streak = 0;
            flashCorrectFinger();

            // Level 7: instant kick on mistake
            if (dojoState.timedMode) {
                if (dojoState.timerInterval) {
                    clearInterval(dojoState.timerInterval);
                    dojoState.timerInterval = null;
                }
                dojoLevel7Fail();
                return;
            }

            // Flash current char red
            if (charSpans[dojoState.wordCharIndex]) {
                charSpans[dojoState.wordCharIndex].classList.add('wrong');
                setTimeout(() => {
                    if (charSpans[dojoState.wordCharIndex]) {
                        charSpans[dojoState.wordCharIndex].classList.remove('wrong');
                    }
                }, 400);
            }

            // Flash wrong key red
            if (keyEl) {
                keyEl.classList.add('key-wrong');
                setTimeout(() => keyEl.classList.remove('key-wrong'), 400);
            }

            showDojoClashEffect();
            playDojoClashSound();

            const container = document.getElementById('dojo-keyboard-container');
            if (container) {
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 300);
            }
        }
    }

    async function dojoLevel7Victory() {
        // Stop everything
        dojoState.active = false;
        if (dojoState.listener) {
            document.removeEventListener('keydown', dojoState.listener);
            dojoState.listener = null;
        }
        if (dojoState.timerInterval) {
            clearInterval(dojoState.timerInterval);
            dojoState.timerInterval = null;
        }
        if (dojoState.globalTimerInterval) {
            clearInterval(dojoState.globalTimerInterval);
            dojoState.globalTimerInterval = null;
        }

        // Increment win count in localStorage immediately
        let wins = parseInt(localStorage.getItem('dojo_level7_wins') || '0', 10);
        wins++;
        localStorage.setItem('dojo_level7_wins', wins.toString());

        // Play slice sound for victory
        playDojoSliceSound();
        showDojoSliceEffect();

        // Random praise text
        const praises = [
            { main: 'TRUE WARRIOR.', sub: 'THE WIND BOWS TO YOUR SPEED' },
            { main: 'MASTERY ACHIEVED.', sub: 'THE BLADE AND YOU ARE ONE' },
            { main: 'LEGENDARY.', sub: 'YOUR NAME ECHOES THROUGH THE DOJO' },
            { main: 'PERFECTION.', sub: 'EVEN THE MASTERS APPLAUD' },
            { main: 'UNSTOPPABLE.', sub: 'NO WORD CAN OUTRUN YOU' },
            { main: 'HONORED SAMURAI.', sub: 'YOU HAVE EARNED YOUR PLACE' },
            { main: 'THE WIND OBEYS.', sub: 'YOUR FINGERS MOVE LIKE LIGHTNING' },
            { main: 'FLAWLESS VICTORY.', sub: 'FIFTEEN SECONDS OF PURE DISCIPLINE' },
            { main: 'ABSOLUTE FOCUS.', sub: 'THE PATH OF THE WARRIOR IS YOURS' },
            { main: 'TRANSCENDENT.', sub: 'YOU HAVE SURPASSED ALL LIMITS' },
            { main: 'A LIVING BLADE.', sub: 'SPEED AND PRECISION IN HARMONY' },
            { main: 'SENSEI MATERIAL.', sub: 'SOON YOU WILL TEACH THE DOJO' },
            { main: 'IMMORTAL HANDS.', sub: 'THEY WILL WRITE SONGS ABOUT THIS' },
            { main: 'MASTER OF THE WIND.', sub: 'THE STORM ITSELF YIELDS TO YOU' },
            { main: 'BEYOND MORTAL.', sub: 'YOUR DISCIPLINE IS UNMATCHED' },
            { main: 'SACRED SPEED.', sub: 'THE ANCESTORS SMILE UPON YOU' },
            { main: 'UNTOUCHABLE.', sub: 'NO ERROR COULD FIND YOU' },
            { main: 'CHAMPION.', sub: 'THE DOJO BOWS IN YOUR PRESENCE' },
            { main: 'IRON WILL.', sub: 'FIFTEEN SECONDS WITHOUT FALTERING' },
            { main: 'ENLIGHTENED.', sub: 'THE WAY OF THE WIND IS YOURS FOREVER' }
        ];

        const praise = praises[Math.floor(Math.random() * praises.length)];

        // Create victory overlay
        const overlay = document.createElement('div');
        overlay.className = 'dojo-victory-overlay';
        overlay.innerHTML = `
            <div class="dojo-victory-kanji">勝</div>
            <div class="dojo-victory-text">${praise.main}</div>
            <div class="dojo-victory-sub">${praise.sub}</div>
            <div class="dojo-victory-wins">WIND CONQUESTS: ${wins}</div>
        `;
        document.body.appendChild(overlay);

        // Record in Supabase (Global Leaderboard) in BACKGROUND
        if (window.recordDojoWin) {
            window.recordDojoWin().then(dbWins => {
                if (dbWins !== null) {
                    // Sync local storage to match DB
                    localStorage.setItem('dojo_level7_wins', dbWins.toString());
                    // Update overlay if still visible? 
                    // No need to be distracting, just store it for next time.
                }
            });
        }

        // Fade out and return to dojo setup
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                initDojoSetup();
            }, 500);
        }, 3500);
    }

    function dojoLevel7Fail() {
        // Stop the game
        dojoState.active = false;
        if (dojoState.listener) {
            document.removeEventListener('keydown', dojoState.listener);
            dojoState.listener = null;
        }
        if (dojoState.globalTimerInterval) {
            clearInterval(dojoState.globalTimerInterval);
            dojoState.globalTimerInterval = null;
        }

        playDojoClashSound();
        showDojoClashEffect();

        // Random roast text
        const roasts = [
            { main: 'WHO LET YOU IN HERE?', sub: 'BACK TO THE BASICS, NOVICE' },
            { main: 'GET OUT.', sub: 'YOU ARE NOT READY' },
            { main: 'YOU DON\'T BELONG HERE', sub: 'RETURN WHEN YOU ARE WORTHY' },
            { main: 'PATHETIC.', sub: 'A TRUE WARRIOR DOES NOT FALTER' },
            { main: 'DISGRACEFUL', sub: 'THE BLADE WEEPS FOR YOU' },
            { main: 'TOO SLOW.', sub: 'THE WIND DOES NOT WAIT' },
            { main: 'UNWORTHY', sub: 'MASTER THE BASICS FIRST' },
            { main: 'LAUGHABLE.', sub: 'EVEN THE WOODEN SWORD MOCKS YOU' },
            { main: 'SHAMEFUL DISPLAY', sub: 'YOUR SENSEI WOULD BE DISAPPOINTED' },
            { main: 'FAILURE.', sub: 'BEGIN AGAIN FROM NOTHING' },
            { main: 'ABSOLUTE AMATEUR.', sub: 'YOUR ANCESTORS ARE WEEPING' },
            { main: 'BEGONE.', sub: 'THE DOJO IS FOR THE DISCIPLINED' },
            { main: 'A SWORDSMAN?', sub: 'YOU ARE BARELY A PEASANT' },
            { main: 'STICK TO TEA.', sub: 'THE KATANA IS FOR WARRIORS' },
            { main: 'PITIFUL STANCE.', sub: 'YOU TRIP OVER YOUR OWN SHADOW' },
            { main: 'LOST IN THE FOG.', sub: 'SEARCH FOR YOUR SOUL AT LEVEL 1' },
            { main: 'THE VOID CALLS.', sub: 'AND YOU HAVE NO ANSWER' },
            { main: 'BROKEN SPIRIT.', sub: 'REFORGE YOURSELF FROM THE BOTTOM' },
            { main: 'CLUMSY.', sub: 'THE MOUNTAIN DOES NOT SHAKE, BUT YOU DO' },
            { main: 'DULL BLADE.', sub: 'YOU CANNOT EVEN CUT THE AIR' },
            { main: 'YOU THINK YOU BELONG HERE?', sub: 'NOT WITH THAT REFLEX' },
            { main: 'DREAMING OF MASTERY?', sub: 'WAKE UP IN LEVEL 1' },
            { main: 'A FOOL\'S ERRAND.', sub: 'DO NOT WASTE THE MASTER\'S TIME' },
            { main: 'IS THAT ALL?', sub: 'MY GRANDMOTHER TYPES FASTER WITH ONE CHOPSTICK' },
            { main: 'SIMPLY UNBALANCED.', sub: 'FIND YOUR CENTER AT THE START' },
            { main: 'GO BACK TO SCHOOL.', sub: 'YOU HAVE MUCH TO LEARN, CHILD' },
            { main: 'GET OUT OF MY SIGHT.', sub: 'YOU ARE AN EMBARRASSMENT' },
            { main: 'IS THIS A JOKE?', sub: 'MY CAT TYPES BEYOND YOUR SKILL' },
            { main: 'STICK TO COLORING BOOKS.', sub: 'THE WAY OF THE BLADE IS NOT FOR YOU' },
            { main: 'MOCKERY OF A WARRIOR.', sub: 'YOUR HANDS ARE MADE OF BUTTER' },
            { main: 'GO HOME.', sub: 'YOU ARE NOT WELCOME IN THIS DOJO' }
        ];

        const roast = roasts[Math.floor(Math.random() * roasts.length)];

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dojo-fail-overlay';
        overlay.innerHTML = `
            <div class="dojo-fail-text">${roast.main}</div>
            <div class="dojo-fail-sub">${roast.sub}</div>
        `;
        document.body.appendChild(overlay);

        // Fade out and kick to Level 1
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                launchDojoLevel(1);
            }, 500);
        }, 2000);
    }

    function nextDojoPrompt() {
        // Clear old active states
        document.querySelectorAll('#dojo-keyboard .key-active').forEach(el => el.classList.remove('key-active'));

        if (dojoState.wordMode) {
            // === WORD MODE ===
            const pool = dojoState.wordPool;
            dojoState.currentWord = pool[Math.floor(Math.random() * pool.length)];
            dojoState.wordCharIndex = 0;

            // Render word as character spans
            const charsContainer = document.getElementById('dojo-word-chars');
            if (charsContainer) {
                charsContainer.innerHTML = dojoState.currentWord.split('').map((ch, i) =>
                    `<span class="dojo-word-char ${i === 0 ? 'active' : ''}">${ch.toUpperCase()}</span>`
                ).join('');
            }

            // Highlight first key on keyboard
            const firstKey = dojoState.currentWord[0];
            const keyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${firstKey}"]`);
            if (keyEl) keyEl.classList.add('key-active');
            highlightGuideFinger(firstKey);

            // Update word label based on timed mode
            const wordLabel = document.querySelector('.dojo-word-label');
            if (wordLabel) {
                wordLabel.textContent = dojoState.timedMode ? 'TYPE BEFORE TIME RUNS OUT' : 'TYPE THE WORD';
            }

            // Start timer for Level 7
            if (dojoState.timerInterval) {
                clearInterval(dojoState.timerInterval);
                dojoState.timerInterval = null;
            }
            if (dojoState.timedMode) {
                const timerFill = document.getElementById('dojo-timer-fill');
                const timeLimit = Math.max(1200, dojoState.currentWord.length * 250); // 250ms per char, min 1.2s
                const startTime = Date.now();

                if (timerFill) {
                    timerFill.style.width = '100%';
                    timerFill.classList.remove('danger');
                }

                dojoState.timerInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, 1 - elapsed / timeLimit);

                    if (timerFill) {
                        timerFill.style.width = `${remaining * 100}%`;
                        if (remaining < 0.3) {
                            timerFill.classList.add('danger');
                        }
                    }

                    if (remaining <= 0) {
                        // Time's up!
                        clearInterval(dojoState.timerInterval);
                        dojoState.timerInterval = null;
                        dojoState.streak = 0;

                        dojoLevel7Fail();
                    }
                }, 50);
            }

        } else {
            // === KEY MODE ===
            const pool = dojoState.keyPool && dojoState.keyPool.length > 0
                ? dojoState.keyPool
                : ['f', 'j'];
            dojoState.target = pool[Math.floor(Math.random() * pool.length)];

            const promptEl = document.getElementById('dojo-prompt');
            if (promptEl) promptEl.textContent = dojoState.target.toUpperCase();

            const leftKeys = 'qwertasdfgzxcvb';
            const stanceEl = document.getElementById('dojo-stance');
            if (stanceEl) {
                stanceEl.textContent = leftKeys.includes(dojoState.target)
                    ? 'HOME STANCE \u2014 LEFT HAND'
                    : 'HOME STANCE \u2014 RIGHT HAND';
            }

            const keyEl = document.querySelector(`#dojo-keyboard .dojo-key[data-key="${dojoState.target}"]`);
            if (keyEl) keyEl.classList.add('key-active');
            highlightGuideFinger(dojoState.target);
        }
    }

    function updateDojoStats() {
        const streakEl = document.getElementById('dojo-streak');
        const accEl = document.getElementById('dojo-accuracy');
        const totalEl = document.getElementById('dojo-total');

        if (streakEl) streakEl.textContent = dojoState.streak;
        if (totalEl) totalEl.textContent = dojoState.total;
        if (accEl) {
            const acc = dojoState.total > 0
                ? Math.round((dojoState.correct / dojoState.total) * 100)
                : 100;
            accEl.textContent = acc + '%';
        }

        const overlay = document.getElementById('hand-guide-overlay');
        if (overlay) {
            overlay.classList.remove('glow-low', 'glow-med', 'glow-high');
            if (dojoState.streak > 50) overlay.classList.add('glow-high');
            else if (dojoState.streak > 25) overlay.classList.add('glow-med');
            else if (dojoState.streak > 10) overlay.classList.add('glow-low');
        }
    }

    function showDojoSliceEffect() {
        const el = document.createElement('div');
        el.className = 'dojo-slice-effect';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 500);
    }

    function showDojoClashEffect() {
        // Radial clash
        const clash = document.createElement('div');
        clash.className = 'dojo-clash-effect';
        document.body.appendChild(clash);
        setTimeout(() => clash.remove(), 500);

        // Vignette flash
        const vig = document.createElement('div');
        vig.className = 'dojo-vignette-flash';
        document.body.appendChild(vig);
        setTimeout(() => vig.remove(), 400);
    }

    function playDojoSliceSound() {
        if (!audioCtx || !soundEnabled) return;
        const t = audioCtx.currentTime;
        const vol = (userConfig.soundVolume || 70) / 100;

        // Metallic shing — high freq sweep down
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4000, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
        gain.gain.setValueAtTime(0.12 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.15);

        // Air whoosh
        if (noiseBuffer) {
            createNoiseBurst(t, 0.06, 0.06 * vol, 3000, 1.5, 'highpass');
        }
    }

    function playDojoClashSound() {
        if (!audioCtx || !soundEnabled) return;
        const t = audioCtx.currentTime;
        const vol = (userConfig.soundVolume || 70) / 100;

        // Low rumble
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0.1 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.2);

        // Harsh impact noise
        if (noiseBuffer) {
            createNoiseBurst(t, 0.05, 0.12 * vol, 1500, 1, 'bandpass');
        }
    }

    // --- VICTORY PARTICLES ---
    let victoryAnimId = null;

    function runVictoryParticles(color, type = 'falling') {
        const canvas = document.createElement('canvas');
        canvas.id = 'victory-particles';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '8000'; // Behind text (9999) but above BG
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push(createVictoryParticle(canvas, color, type));
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                // Update Position
                if (type === 'rising') {
                    p.y -= p.speedY;
                    p.x += Math.sin(p.wobble) * 0.5;
                } else { // falling
                    p.y += p.speedY;
                    p.x += Math.sin(p.wobble) * 1;
                }
                p.wobble += p.wobbleSpeed;

                // Reset if out of bounds
                if (type === 'rising' && p.y < -10) {
                    particles[i] = createVictoryParticle(canvas, color, type, true);
                } else if (type === 'falling' && p.y > canvas.height + 10) {
                    particles[i] = createVictoryParticle(canvas, color, type, true);
                }

                // Draw
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                if (type === 'falling') {
                    // Petal shape (oval-ish)
                    ctx.ellipse(p.x, p.y, p.size, p.size * 1.5, p.tilt, 0, Math.PI * 2);
                } else {
                    // Spark/Ember (Circle)
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                }
                ctx.fill();
            });

            victoryAnimId = requestAnimationFrame(frame);
        }
        frame();
    }

    function createVictoryParticle(canvas, color, type, reset = false) {
        const x = Math.random() * canvas.width;
        const y = reset ? (type === 'rising' ? canvas.height + 10 : -10) : Math.random() * canvas.height;
        return {
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1.5 + 0.5,
            color: color,
            opacity: Math.random() * 0.6 + 0.4,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05,
            tilt: Math.random() * Math.PI // For petals
        };
    }

    function startShadowMode() {
        const shadowSplash = document.getElementById('shadow-splash');
        if (shadowSplash) {
            shadowSplash.classList.remove('hidden');

            // Hide Main UI Elements
            const elementsToHide = [
                'landing-page', 'game-ui', 'test-config',
                'words-container', 'results-screen', 'modes-modal'
            ];

            elementsToHide.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });

            // Save current audio state then pause everything
            wasPlayingBeforeShadow.masterPlaying = !masterAudio.paused;
            wasPlayingBeforeShadow.bgAudioPlaying = currentBgAudio && !currentBgAudio.paused;
            wasPlayingBeforeShadow.bgVideoMuted = UI.bgVideo ? UI.bgVideo.muted : true;
            if (!masterAudio.paused) masterAudio.pause();
            if (currentBgAudio && !currentBgAudio.paused) currentBgAudio.pause();
            // Mute wallpaper video audio (e.g. Gura Yuri has built-in audio)
            if (UI.bgVideo) UI.bgVideo.muted = true;

            // Start Shadow music immediately
            playShadowTrack(currentShadowTrack);

            // Transition to Shadow Setup after ritual
            setTimeout(() => {
                shadowSplash.classList.add('hidden');

                const shadowUI = document.getElementById('shadow-ui');
                if (shadowUI) {
                    shadowUI.classList.remove('hidden');
                    initShadowTrackSelector();
                    initShadowSetup(); // Initialize listeners
                }
            }, 3000);
        }
    }
    window.startShadowMode = startShadowMode; // Expose for testing

    function initShadowSetup() {
        // Exit Button
        const exitBtn = document.getElementById('s-exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                exitShadowMode();
            });
        }

        // Difficulty Buttons
        const opts = document.querySelectorAll('.s-opt-btn');
        opts.forEach(btn => {
            btn.addEventListener('click', () => {
                const label = btn.innerText;
                let msPerWord = 2000; // Ghost (2s per word)

                if (label === 'WRAITH') msPerWord = 1400; // 1.4s
                if (label === 'VOID') msPerWord = 900; // 0.9s - Very Fast

                // Fallback / Specific overrides from previous logic
                if (btn.id === 's-wraith-btn') msPerWord = 1400;
                if (btn.id === 's-void-btn') msPerWord = 60000 / 70; // ~857ms

                state.shadowBloomDuration = msPerWord;
                initShadowGame();
            });
        });

        // Shadow Result Buttons (Result Overlay)
        const retryBtn = document.getElementById('s-retry-btn');
        if (retryBtn) {
            // Remove old listeners to be safe (clone node tactic or just simple add)
            // Since this runs once on init, simple add is fine.
            retryBtn.onclick = () => initShadowGame();
        }

        const leaveBtn = document.getElementById('s-leave-btn');
        if (leaveBtn) {
            leaveBtn.onclick = () => exitShadowMode();
        }
    }

    function initShadowGame() {
        // STRICT CLEANUP
        if (torchIntervalID) {
            clearInterval(torchIntervalID);
            torchIntervalID = null;
        }
        document.getElementById('s-result-overlay').classList.add('hidden');

        document.getElementById('s-setup').classList.add('hidden');
        const board = document.getElementById('s-game-board');
        board.classList.remove('hidden');

        state.isActive = true;
        state.gameMode = 'shadow';
        state.words = [];
        state.currWordIndex = 0;
        state.currCharIndex = 0;
        state.correctChars = 0;
        state.correctChars = 0;
        state.startTime = null;
        state.shadowStreak = 0; // Sanity Meter
        startShadowStatsUpdater();

        // Torch State
        state.torchWordIndex = 0; // Starts at 0

        // Generate Words (Cyberpunk Pool)
        const pool = wordPools[0];
        for (let i = 0; i < 30; i++) {
            state.words.push(pool[Math.floor(Math.random() * pool.length)]);
        }

        renderShadowWords();

        // Focus Input
        const input = document.getElementById('s-input');
        input.value = '';
        input.focus();
        input.onblur = () => input.focus();

        // Input Listener
        input.oninput = (e) => {
            if (!state.isActive) return;
            const val = e.target.value;

            // Start Torch on first input
            if (!state.startTime && val.length > 0) {
                state.startTime = Date.now();
                startTorchTimer();
            }

            handleShadowInput(val);
            e.target.value = '';
        };

        updateTorchVisuals();
    }

    function startShadowStatsUpdater() {
        if (state.shadowStatsInterval) clearInterval(state.shadowStatsInterval);
        state.shadowStatsInterval = setInterval(updateShadowHUD, 200);
    }

    function updateShadowHUD() {
        if (!state.isActive) return;

        // SANITY (Progress %)
        const sanityEl = document.getElementById('s-hud-sanity');
        if (sanityEl) {
            const total = state.words.length;
            const current = state.currWordIndex;
            const percent = Math.floor((current / total) * 100);
            sanityEl.innerText = percent + '%';
        }

        // WPM
        const wpmEl = document.getElementById('s-hud-wpm');
        if (wpmEl) {
            if (!state.startTime) {
                wpmEl.innerText = '0';
            } else {
                const timeInMinutes = (Date.now() - state.startTime) / 60000;
                const wpm = Math.round((state.correctChars / 5) / timeInMinutes) || 0;
                wpmEl.innerText = wpm;
            }
        }
    }

    let torchIntervalID = null;

    function startTorchTimer() {
        if (torchIntervalID) clearInterval(torchIntervalID);

        const speed = state.shadowBloomDuration;

        torchIntervalID = setInterval(() => {
            if (!state.isActive) {
                clearInterval(torchIntervalID);
                return;
            }
            moveTorchForward();
        }, speed);
    }

    function moveTorchForward() {
        // The Torch moves blindly. It does not care about the user.
        // It shines light. If you are behind, you are in darkness.

        // Advance Torch
        state.torchWordIndex++;

        if (state.torchWordIndex >= state.words.length) {
            console.log("Torch Reached End - Darkness Consumes All");
            clearInterval(torchIntervalID);
            // Torch goes out. User must finish in pitch black if they are behind.
        }

        updateTorchVisuals();
    }

    function updateTorchVisuals() {
        // Clear all lit
        document.querySelectorAll('.s-word.torch-lit').forEach(el => el.classList.remove('torch-lit'));

        // Light up Torch Position
        const wordEls = document.querySelectorAll('.s-word');
        const tWord = wordEls[state.torchWordIndex];

        if (tWord) {
            tWord.classList.add('torch-lit');
            tWord.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }

    function renderShadowWords() {
        const container = document.getElementById('s-words-container');
        container.innerHTML = '';
        state.words.forEach((word) => {
            const wordEl = document.createElement('div');
            wordEl.className = 's-word'; // No 'active' class used now, only torch
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                wordEl.appendChild(charSpan);
            });
            container.appendChild(wordEl);
        });
    }

    function handleShadowInput(char) {
        if (!state.isActive) return;

        const currentWord = state.words[state.currWordIndex];

        // CASE 1: Word Completed, Waiting for Space
        if (state.currCharIndex === currentWord.length) {
            if (char === ' ') {
                // Space typed -> Advance to next word
                state.currWordIndex++;
                state.currCharIndex = 0;
                return;
            } else {
                // User typed a letter instead of space -> Mistake
                handleShadowFail("MISTAKE (EXPECTED SPACE)");
                return;
            }
        }

        // CASE 2: Typing Characters
        const targetChar = currentWord[state.currCharIndex];

        if (char === targetChar) {
            state.currCharIndex++;
            state.correctChars++;

            // Visual: Mark Correct
            const wordEls = document.querySelectorAll('.s-word');
            const currEl = wordEls[state.currWordIndex];
            const charSpan = currEl.querySelectorAll('span')[state.currCharIndex - 1];
            charSpan.classList.add('correct');

            // Update Sanity (Streak)
            state.shadowStreak++;
            updateShadowHUD();

            // --- JUICE: SPLASH PARTICLE ---
            const rect = charSpan.getBoundingClientRect();
            spawnShadowSlash(rect.left + rect.width / 2, rect.top + rect.height / 2);

            // Check if Word is now Finished
            if (state.currCharIndex === currentWord.length) {
                // If it's the LAST word, we win immediately (no space needed)
                if (state.currWordIndex === state.words.length - 1) {
                    // VICTORY
                    handleShadowVictory();
                } else {
                    // Visual cue that we are waiting for space
                    currEl.classList.add('correct');
                }
            }
        } else {
            // --- JUICE: GLITCH EFFECT ---
            triggerShadowGlitch();
            state.shadowStreak = 0; // Sanity Lost
            updateShadowHUD();
            handleShadowFail("MISTAKE");
        }
    }

    const shadowFailureQuotes = [
        "Quit now. You’re just wasting the electricity.",
        "The world doesn't need another quitter. Close the tab.",
        "Your mediocrity is the only thing shining here.",
        "The light didn't fail you. You failed the light.",
        "Some people are meant to lead; you were clearly meant to trip.",
        "Give up. The shadows are the only place you'll ever fit in.",
        "Imagine failing at something this simple. Now imagine the rest of your life.",
        "Do you always quit when things get difficult, or is today special?",
        "Your parents expect more than a failure who can't even type in the dark.",
        "The void sees you for what you truly are: a disappointment.",
        "You can restart the test, but you can't restart your lack of talent.",
        "The light is gone. Just like every opportunity you've ever had.",
        "Stop trying. The silence is better than your clumsy attempts.",
        "You’re not 'out of practice.' You are simply out of potential.",
        "Go ahead and cry. The shadows have heard better sobs than yours.",
        "If you disappeared right now, the dark wouldn't even notice the difference.",
        "You’re a waste of atoms.",
        "Stop. You’re embarrassing the human race.",
        "The mirror hates you most.",
        "Every time they look at you, they see their own wasted years.",
        "Typing like a toddler in the dark. Pathetic.",
        "The keyboard isn't the problem. The person touching it is.",
        "The letters haven't moved since 1873. What's your excuse?"
    ];

    const shadowVictoryQuotes = [
        "The void gazes back, and blinks.", "You have become the absence of light.", "Perfect stillness in motion.",
        "The blade and the spirit are one.", "Darkness is your ally.", "You walk where others fear to tread.",
        "Silence is the loudest sound.", "A master of the unseen arts.", "The shadows whisper your name.",
        "Reality bends to your will.", "No footprint, no sound, no mercy.", "You are the storm that makes no noise.",
        "The night embraces its own.", "Beyond the edge of the blade.", "Your focus cuts through time.",
        "Eternity in a single stroke.", "The abyss finds no flaw in you.", "Pure intent, pure execution.",
        "You have ascended beyond the light.", "The ritual is complete.", "Shadows do not bleed.",
        "The world is an illusion; you are real.", "Faster than the falling dark.", "You are the ghost in the machine.",
        "Nothing remains but your victory.", "The perfect cut leaves no seam.", "You strike from everywhere at once.",
        "Blindness is no obstacle to true sight.", "The void accepts your offering.", "Legend requires no witness."
    ];

    function handleShadowFail(reason) {
        state.isActive = false;
        if (torchIntervalID) clearInterval(torchIntervalID);
        if (state.shadowStatsInterval) clearInterval(state.shadowStatsInterval);

        // Show Overlay
        const overlay = document.getElementById('s-result-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.remove('victory');
        overlay.classList.add('failure');

        const title = document.getElementById('s-result-title');
        const rText = document.getElementById('s-result-reason');

        title.innerText = "CONSUMED";

        // Flavor Text Logic
        const randomQuote = shadowFailureQuotes[Math.floor(Math.random() * shadowFailureQuotes.length)];
        rText.innerText = randomQuote;

        // --- VISUALS ---
        title.classList.remove('failure-title-enter');
        void title.offsetWidth;
        title.classList.add('failure-title-enter');

        spawnResultParticles(30);
        triggerVoidEruption();
    }

    function handleShadowVictory() {
        state.isActive = false;
        if (torchIntervalID) clearInterval(torchIntervalID);
        if (state.shadowStatsInterval) clearInterval(state.shadowStatsInterval);

        const overlay = document.getElementById('s-result-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.remove('failure');
        overlay.classList.add('victory');

        const title = document.getElementById('s-result-title');
        const rText = document.getElementById('s-result-reason');

        title.innerText = "ASCENDED";

        const randomQuote = shadowVictoryQuotes[Math.floor(Math.random() * shadowVictoryQuotes.length)];
        rText.innerText = randomQuote;

        playSound('gong');
        playSound('sheath');

        // --- VISUALS ---
        title.classList.remove('victory-title-enter');
        void title.offsetWidth;
        title.classList.add('victory-title-enter');

        spawnResultParticles(60);
        triggerVoidEruption();
    }

    // --- SHADOW JUICE FUNCTIONS ---
    function spawnShadowSlash(x, y) {
        // Create a fast, sharp "cut" line
        const el = document.createElement('div');
        el.className = 's-slash-particle';
        document.body.appendChild(el);

        // Random stylized slash properties
        const angle = Math.random() * 360 + 'deg';
        const length = 40 + Math.random() * 60 + 'px';
        const width = 2 + Math.random() * 2 + 'px';

        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = width;
        el.style.height = length;
        el.style.setProperty('--angle', angle);
        el.style.setProperty('--tx', (Math.random() - 0.5) * 50 + 'px');
        el.style.setProperty('--ty', (Math.random() - 0.5) * 50 + 'px');

        // Animate
        el.style.animation = 'slashAnim 0.3s ease-out forwards';

        setTimeout(() => el.remove(), 300);
    }

    function triggerShadowGlitch() {
        if (!state.isActive) return;
        const ui = document.getElementById('shadow-ui');
        ui.classList.add('shadow-glitch-active');

        // Intense screen shake
        document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;

        setTimeout(() => {
            ui.classList.remove('shadow-glitch-active');
            document.body.style.transform = 'none';
        }, 200);
    }

    function spawnResultParticles(count) {
        const overlay = document.getElementById('s-result-overlay');

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 's-result-particle';

            // Random physics
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * (velocity + Math.random() * 100) + 'px';
            const ty = Math.sin(angle) * (velocity + Math.random() * 100) + 'px';

            // Random size
            const size = 4 + Math.random() * 6 + 'px';
            el.style.width = size;
            el.style.height = size;

            // Set styles relative to center (50% 50% in CSS)
            el.style.left = '50%';
            el.style.top = '50%';
            el.style.setProperty('--tx', tx);
            el.style.setProperty('--ty', ty);

            // Random delay
            el.style.animation = `particleFly ${0.8 + Math.random() * 0.5}s cubic-bezier(0.1, 0.9, 0.2, 1) forwards`;

            overlay.appendChild(el);

            // Cleanup
            setTimeout(() => el.remove(), 1500);
        }
    }

    function triggerVoidEruption() {
        const ui = document.getElementById('shadow-ui');
        ui.classList.remove('void-eruption');
        void ui.offsetWidth;
        ui.classList.add('void-eruption');
    }



    function exitShadowMode() {
        state.isActive = false;
        if (torchIntervalID) {
            clearInterval(torchIntervalID);
            torchIntervalID = null;
        }

        // Cleanup Visuals
        const ui = document.getElementById('shadow-ui');
        ui.classList.remove('void-eruption');

        const title = document.getElementById('s-result-title');
        if (title) title.classList.remove('victory-title-enter');

        // Stop Shadow music and restore previous audio
        shadowAudio.pause();
        shadowAudio.currentTime = 0;
        if (wasPlayingBeforeShadow.masterPlaying) {
            masterAudio.play().catch(e => console.log('Resume master failed:', e));
        }
        if (wasPlayingBeforeShadow.bgAudioPlaying && currentBgAudio) {
            currentBgAudio.play().catch(e => console.log('Resume bg failed:', e));
        }
        // Restore wallpaper video audio
        if (UI.bgVideo) UI.bgVideo.muted = wasPlayingBeforeShadow.bgVideoMuted ?? true;

        // Hide Shadow UI completely
        document.getElementById('shadow-ui').classList.add('hidden');

        // Close track panel
        const sTPanel = document.getElementById('s-track-panel');
        if (sTPanel) sTPanel.classList.add('hidden');

        // Reset internal Shadow states
        document.getElementById('s-game-board').classList.add('hidden');
        document.getElementById('s-result-overlay').classList.add('hidden');
        document.getElementById('s-setup').classList.remove('hidden'); // Reset for next time

        // Restore Main UI Elements
        // We explicitly unhide everything that startShadowMode hid to ensure full restoration
        const elementsToRestore = ['landing-page', 'game-ui', 'test-config', 'words-container'];
        elementsToRestore.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });

        // Ensure Results Screen and Modal are closed/hidden to start fresh
        const elementsToKeepHidden = ['results-screen', 'modes-modal'];
        elementsToKeepHidden.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Trigger a refresh of the words if possible, or just focus input
        const mainInput = document.getElementById('words-input');
        if (mainInput) mainInput.focus();
    }

    function startHagakureMode() {
        const hagakureQuotes = [
            "THE WAY OF THE WARRIOR",
            "HESITATION IS DEFEAT",
            "ONE STRIKE. ONE KILL.",
            "SILENCE THE MIND",
            "FOCUS ABSOLUTE",
            "DEATH BEFORE DISHONOR",
            "STEEL YOUR SOUL",
            "EMBRACE THE VOID",
            "NO SECOND CHANCES",
            "PERFECTION OR NOTHING",
            "THE BLADE NEVER LIES",
            "BREATHE. STRIKE. WIN.",
            "FEAR IS THE MIND-KILLER",
            "VICTORY IN STILLNESS",
            "UNLEASH YOUR DEMON",
            "A WARRIOR STANDS ALONE",
            "SHARPEN YOUR SPIRIT",
            "TOTAL CONCENTRATION",
            "HONOR THE CODE",
            "BECOME THE BLADE",
            "MIND LIKE WATER",
            "STRIKE TRUE",
            "NO FEAR. NO MERCY.",
            "THE PATH IS LONE",
            "DISCIPLINE IS FREEDOM",
            "CONQUER YOURSELF",
            "FLASH OF STEEL",
            "SILENT VICTORY",
            "ENDURE AND PREVAIL",
            "THE SWORD IS THE SOUL"
        ];

        const randomQuote = hagakureQuotes[Math.floor(Math.random() * hagakureQuotes.length)];
        const splashTitle = document.querySelector('.hagakure-title');
        if (splashTitle) splashTitle.innerText = randomQuote;

        // 1. Show Splash
        const splash = document.getElementById('hagakure-splash');
        splash.classList.remove('hidden');

        // 2. Pause all existing audio and play Hagakure theme
        // Save current audio state for restoration on exit
        wasPlayingBeforeHagakure.trackIndex = currentTrackIndex;
        wasPlayingBeforeHagakure.masterPlaying = !masterAudio.paused;
        wasPlayingBeforeHagakure.bgAudioPlaying = currentBgAudio && !currentBgAudio.paused;
        wasPlayingBeforeHagakure.bgVideoMuted = UI.bgVideo ? UI.bgVideo.muted : true;

        // Pause master audio
        if (!masterAudio.paused) masterAudio.pause();

        // Pause wallpaper bg audio
        if (currentBgAudio && !currentBgAudio.paused) currentBgAudio.pause();
        // Mute wallpaper video audio (e.g. Gura Yuri has built-in audio)
        if (UI.bgVideo) UI.bgVideo.muted = true;

        // Play Hagakure theme music (default track or last selected)
        playHagakureTrack(currentHagakureTrack);

        // 3. Wait 2 seconds, then transition
        setTimeout(() => {
            splash.classList.add('hidden');

            // Hide standard UI
            const gameUI = document.getElementById('game-ui');
            const appHeader = document.getElementById('app-header');
            const navButtons = document.getElementById('top-nav-buttons');
            const footer = document.querySelector('footer') || document.querySelector('.site-footer');

            if (gameUI) gameUI.classList.add('hidden');
            if (appHeader) appHeader.style.display = 'none';
            if (navButtons) navButtons.style.display = 'none';
            if (footer) footer.style.display = 'none';

            // Show Hagakure UI
            const hUI = document.getElementById('hagakure-ui');
            hUI.classList.remove('hidden');

            // Init hagakure track selector UI
            initHagakureTrackSelector();

            // Set Game State
            state.gameMode = 'hagakure';

            // Global Shortcuts for Hagakure (Tab to Retry)
            if (!window.hTabListener) {
                window.hTabListener = (e) => {
                    if (state.gameMode === 'hagakure' && e.key === 'Tab') {
                        e.preventDefault();
                        // If we are in setup screen, do nothing or restart setup? 
                        // If we are in game, restart game with current settings
                        const setupInfo = document.getElementById('h-setup');
                        if (setupInfo && !setupInfo.classList.contains('hidden')) {
                            // Do nothing in setup
                        } else {
                            initHagakureGame(); // Restart with current settings
                        }
                    }
                };
                document.addEventListener('keydown', window.hTabListener);
            }

            initHagakureSetup();
        }, 2000);
    }

    function initHagakureSetup() {
        // Show Setup, Hide Board
        const setup = document.getElementById('h-setup');
        const board = document.getElementById('h-game-board');
        if (setup) setup.classList.remove('hidden');
        if (board) board.classList.add('hidden');

        // Exit Button Listener
        const exitBtn = document.getElementById('h-exit-path-btn');
        if (exitBtn) {
            exitBtn.onclick = exitHagakureMode;
        }

        // Reset any previous listeners to avoid duplicates (smarter way is to do once, but this is safe)
        const opts = document.querySelectorAll('.h-opt-btn');
        opts.forEach(btn => {
            btn.onclick = () => {
                const mode = btn.dataset.mode;
                let wordCount = 50; // Default Original

                if (mode === '1') wordCount = 10;
                if (mode === '3') wordCount = 25; // Adjusted to ~3 visual lines
                if (mode === '5') wordCount = 40; // Adjusted to ~5 visual lines
                if (mode === 'original') wordCount = 60; // Epic length

                // Save config for restart
                state.hagakureMode = mode;
                state.hagakureWordCount = wordCount;

                initHagakureGame();
            };
        });
    }

    function exitHagakureMode() {
        const hUI = document.getElementById('hagakure-ui');
        if (hUI) hUI.classList.add('hidden');

        // Close track panel if open
        const trackPanel = document.getElementById('h-track-panel');
        if (trackPanel) trackPanel.classList.add('hidden');

        // Show Standard UI
        const gameUI = document.getElementById('game-ui');
        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (gameUI) gameUI.classList.remove('hidden');
        if (appHeader) appHeader.style.display = ''; // Reset to default CSS
        if (navButtons) navButtons.style.display = ''; // Reset to default CSS
        if (footer) footer.style.display = ''; // Reset to default CSS

        state.gameMode = 'time'; // Default back to time or previous

        // Stop Hagakure theme music
        hagakureAudio.pause();
        hagakureAudio.currentTime = 0;

        // Resume previous audio state
        if (wasPlayingBeforeHagakure.masterPlaying) {
            masterAudio.play().catch(e => console.log('Resume master audio failed:', e));
        }
        if (wasPlayingBeforeHagakure.bgAudioPlaying && currentBgAudio) {
            currentBgAudio.play().catch(e => console.log('Resume bg audio failed:', e));
        }
        // Restore wallpaper video audio
        if (UI.bgVideo) UI.bgVideo.muted = wasPlayingBeforeHagakure.bgVideoMuted ?? true;

        // Clear Hagakure specific state
        if (state.timerInterval) clearInterval(state.timerInterval);

        // Re-init standard game
        newGame();
    }

    function initHagakureGame() {
        // Hide Setup, Show Board
        const setup = document.getElementById('h-setup');
        const board = document.getElementById('h-game-board');
        if (setup) setup.classList.add('hidden');
        if (board) board.classList.remove('hidden');
        const overlay = document.getElementById('hand-guide-overlay');
        if (overlay) {
            overlay.classList.remove('glow-low', 'glow-med', 'glow-high');
            if (dojoState.streak > 50) overlay.classList.add('glow-high');
            else if (dojoState.streak > 25) overlay.classList.add('glow-med');
            else if (dojoState.streak > 10) overlay.classList.add('glow-low');
        }

        // Show Header
        const hHeader = document.querySelector('.h-header');
        if (hHeader) hHeader.style.display = 'flex';

        // CLEANUP EFFECTS
        const hUI = document.getElementById('hagakure-ui');
        if (hUI) hUI.classList.remove('shake-screen');
        const flash = document.querySelector('.red-flash-overlay');
        if (flash) flash.remove();
        const goldFlash = document.querySelector('.gold-flash-overlay');
        if (goldFlash) goldFlash.remove();

        // Cleanup Victory Particles
        if (victoryAnimId) cancelAnimationFrame(victoryAnimId);
        const vParticles = document.getElementById('victory-particles');
        if (vParticles) vParticles.remove();

        const hInput = document.getElementById('h-input');
        if (hInput) {
            hInput.disabled = false;
        }
        const hContainer = document.getElementById('h-words-container');
        const hWpm = document.getElementById('h-wpm');
        const hStreak = document.getElementById('h-streak');

        // Clear any existing timer
        if (state.timerInterval) clearInterval(state.timerInterval);

        // Reset State
        state.words = [];
        const count = state.hagakureWordCount || 50;
        for (let i = 0; i < count; i++) {
            state.words.push(hagakureWords[Math.floor(Math.random() * hagakureWords.length)]);
        }
        state.currWordIndex = 0;
        state.correctChars = 0;
        state.totalCharsTyped = 0;
        state.startTime = null;
        state.isActive = false;
        state.streak = 0;
        if (hStreak) hStreak.innerText = '0';
        if (hWpm) hWpm.innerText = '0'; // Fix: Reset UI WPM

        // Render Words (Character Level)
        hContainer.innerHTML = '';
        state.words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('div');
            wordSpan.className = 'h-word';

            // Create letters
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                charSpan.className = 'h-letter';
                wordSpan.appendChild(charSpan);
            });

            hContainer.appendChild(wordSpan);
        });

        // Mark first word/letter active
        updateHagakureVisuals();

        // Focus Input force
        hInput.value = '';
        hInput.focus();
        hInput.click();

        // Auto-focus listener
        document.addEventListener('click', (e) => {
            // Only refocus if we are actually in Hagakure mode and clicked HUI
            if (state.gameMode === 'hagakure' && e.target.closest('#hagakure-ui')) {
                hInput.focus();
            }
        });

        // Input Handling
        hInput.oninput = (e) => {
            const value = hInput.value;
            const currWord = state.words[state.currWordIndex];

            // Start Timer
            if (!state.isActive && value.length === 1) {
                state.isActive = true;
                state.startTime = Date.now();
                startHagakureTimer();
            }

            // CHECK INPUT (Character by Character)

            // 1a. Check for Last Word Completion (No Space Needed)
            if (state.currWordIndex === state.words.length - 1 && value === currWord) {
                // Particles for last character
                const hWordsContainer = document.getElementById('h-words-container');
                const lastWordEl = hWordsContainer.children[state.currWordIndex];
                if (lastWordEl && lastWordEl.children.length > 0) {
                    const lastLetterEl = lastWordEl.children[lastWordEl.children.length - 1];
                    const rect = lastLetterEl.getBoundingClientRect();
                    spawnHagakureParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }

                state.correctChars += currWord.length;
                state.currWordIndex++;
                state.streak++;
                hInput.value = '';
                showHagakureVictory();
                return;
            }

            // 1b. Space -> Next Word (only if word is complete)
            if (value.endsWith(' ')) {
                if (value.trim() === currWord) {
                    // Update correct chars for the completed word + space
                    state.correctChars += currWord.length + 1;

                    state.currWordIndex++;
                    state.streak++;
                    const hStreak = document.getElementById('h-streak');
                    if (hStreak) hStreak.innerText = state.streak;
                    hInput.value = '';

                    if (state.currWordIndex >= state.words.length) {
                        showHagakureVictory(); // Win
                    } else {
                        updateHagakureVisuals();
                    }
                } else {
                    // Space pressed but word incomplete/wrong -> Game Over
                    gameOverHagakure();
                }
                return;
            }

            // 2. Check for Mistake (Standard typing)
            if (!currWord.startsWith(value)) {
                gameOverHagakure();
                return;
            }

            // Particles for character just typed
            if (value.length > 0) {
                const hWordsContainer = document.getElementById('h-words-container');
                const activeWordEl = hWordsContainer.children[state.currWordIndex];
                if (activeWordEl) {
                    const letterIndex = value.length - 1;
                    const letterEl = activeWordEl.children[letterIndex];
                    if (letterEl) {
                        const rect = letterEl.getBoundingClientRect();
                        spawnHagakureParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }
                }
            }

            // 3. Update Visuals (Highlight typed letters)
            updateHagakureVisuals(value.length);
        };
    }

    function updateHagakureVisuals(typedLength = 0) {
        const hContainer = document.getElementById('h-words-container');
        const words = hContainer.children;

        // 1. Reset all words
        Array.from(words).forEach((w, i) => {
            w.classList.remove('active', 'correct', 'waiting-space');
            if (i < state.currWordIndex) w.classList.add('correct');
        });

        // 2. set Active Word
        if (state.currWordIndex < words.length) {
            const activeWord = words[state.currWordIndex];
            activeWord.classList.add('active');

            // 3. Letter styling (Correct / Cursor)
            const letters = activeWord.children;
            Array.from(letters).forEach((l, i) => {
                l.classList.remove('h-correct', 'h-cursor');
                if (i < typedLength) {
                    l.classList.add('h-correct');
                }
                // Cursor on the NEXT char to be typed
                if (i === typedLength) {
                    l.classList.add('h-cursor');
                }
            });

            // If we typed passed the last char (waiting for space), maybe cursor on last char?
            // Or render an extra "space" cursor. For now simple:
            if (typedLength === letters.length) {
                // Maybe add a subtle cursor at the end via CSS on the word
                activeWord.classList.add('waiting-space');
            } else {
                activeWord.classList.remove('waiting-space');
            }
        }
    }

    function startHagakureTimer() {
        state.timerInterval = setInterval(() => {
            if (!state.isActive) return;
            const elapsed = (Date.now() - state.startTime) / 1000 / 60;

            // Calculate total correct chars (completed words + current input)
            const currentInputLen = document.getElementById('h-input').value.length;
            const totalChars = state.correctChars + currentInputLen;

            const wpm = Math.round((totalChars / 5) / elapsed) || 0;
            const hWpm = document.getElementById('h-wpm');
            if (hWpm) hWpm.innerText = wpm;
        }, 500); // 500ms update
    }

    function showHagakureVictory() {
        state.isActive = false;
        clearInterval(state.timerInterval);

        // Calculate Final WPM
        const elapsed = (Date.now() - state.startTime) / 1000 / 60;
        const wpm = Math.round((state.correctChars / 5) / elapsed) || 0;

        // SAVE STATS (HAGAKURE MODE)
        if (window.updateUserStats) {
            const timeSeconds = (Date.now() - state.startTime) / 1000;
            window.updateUserStats(wpm, timeSeconds, 'hagakure');
        }

        let rank = "RONIN";
        let msg = "Your blade is heavy. Train harder.";
        let color = "#9e9e9e"; // Grey (Ronin - Unmastered)

        if (wpm >= 100) {
            rank = "KENSEI";
            msg = "Sword Saint. You are the storm.";
            color = "#00e5ff"; // Cyan/Diamond (Kensei - Godlike)
        } else if (wpm >= 80) {
            rank = "SHOGUN";
            msg = "A master of the unseen blade.";
            color = "#ffd700"; // Gold (Shogun - Ruler)
        } else if (wpm >= 60) {
            rank = "DAIMYO";
            msg = "You command the flow of battle.";
            color = "#d32f2f"; // Crimson (Daimyo - Warlord) -- Changed from Silver to thematic Warlord Red
        } else if (wpm >= 40) {
            rank = "SAMURAI";
            msg = "Sharp. Precise. Honorable.";
            color = "#ff4444"; // Red (Samurai - Blood)
        }

        const hContainer = document.getElementById('h-words-container');

        // Hide Header
        const hHeader = document.querySelector('.h-header');
        if (hHeader) hHeader.style.display = 'none';

        // Disable input
        const hInput = document.getElementById('h-input');
        if (hInput) {
            hInput.disabled = true;
            hInput.blur();
        }

        // Epic Dynamic Flash
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'gold-flash-overlay';
        flashOverlay.style.background = color; // Apply Rank Color
        document.body.appendChild(flashOverlay);
        setTimeout(() => flashOverlay.remove(), 2000);

        // Visual Feast (Particles)
        // High ranks = Rising Sparks (Ascension)
        // Low ranks = Falling Petals (Melancholy)
        const particleType = (rank === 'DAIMYO' || rank === 'SHOGUN' || rank === 'KENSEI') ? 'rising' : 'falling';
        runVictoryParticles(color, particleType);

        hContainer.innerHTML = `
            <div class="victory-rise" style="width: 100%; text-align: center; color: ${color}; font-family: Shojumaru; font-size: 4rem; text-shadow: 0 0 20px ${color}80; animation-delay: 0.2s;">VICTORY</div>
            <div class="victory-rise" style="width: 100%; text-align: center; font-size: 2rem; color: #fff; margin-top: 10px; font-weight: bold; letter-spacing: 4px; animation-delay: 0.5s;">${rank}</div>
            <div class="victory-rise" style="width: 100%; text-align: center; font-size: 1.2rem; color: #aaa; margin-top: 20px; font-style: italic; animation-delay: 0.8s;">"${msg}"</div>
            <div class="victory-rise" style="width: 100%; text-align: center; font-size: 1.5rem; color: ${color}; margin-top: 20px; animation-delay: 1.1s;">WPM: ${wpm}</div>
        `;

        // Click to restart
        const restartHandler = () => {
            document.removeEventListener('click', restartHandler);
            initHagakureGame();
        };
        setTimeout(() => document.addEventListener('click', restartHandler), 500);
    }

    function gameOverHagakure() {
        state.isActive = false;
        clearInterval(state.timerInterval);

        const hContainer = document.getElementById('h-words-container');
        const failMsg = hagakureFailMessages[Math.floor(Math.random() * hagakureFailMessages.length)];

        let subMsg = "";

        // Progress Logic (Dynamic)
        const total = state.hagakureWordCount || 50;
        const p = state.currWordIndex / total;

        if (p < 0.1) {
            subMsg = hagakureEarlyFailMessages[Math.floor(Math.random() * hagakureEarlyFailMessages.length)];
        } else if (p >= 0.8) {
            subMsg = hagakureLateFailMessages[Math.floor(Math.random() * hagakureLateFailMessages.length)];
        } else {
            // General/Middle
            const useMiddle = Math.random() > 0.5;
            if (useMiddle) {
                subMsg = hagakureMiddleFailMessages[Math.floor(Math.random() * hagakureMiddleFailMessages.length)];
            } else {
                subMsg = hagakureGeneralFailMessages[Math.floor(Math.random() * hagakureGeneralFailMessages.length)];
            }
        }

        // Disable input to prevent further typing
        const hInput = document.getElementById('h-input');
        if (hInput) {
            hInput.disabled = true;
            hInput.blur();
        }

        // --- EPIC EFFECTS ---
        const hUI = document.getElementById('hagakure-ui');
        hUI.classList.add('shake-screen');

        // Red Flash
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'red-flash-overlay';
        document.body.appendChild(flashOverlay);
        // Remove flash after anim
        setTimeout(() => flashOverlay.remove(), 600);

        // Render
        hContainer.innerHTML = `
            <div class="text-slam" style="width: 100%; text-align: center; color: #ce1126; font-family: Shojumaru; font-size: 4rem; text-shadow: 0 0 10px rgba(206, 17, 38, 0.5);">${failMsg}</div>
            <div style="width: 100%; text-align: center; font-size: 1.2rem; color: #888; margin-top: 10px; font-style: italic;">${subMsg}</div>
            <div style="width: 100%; text-align: right; font-size: 0.8rem; margin-top: 10px; opacity: 0.6; letter-spacing: 2px; color: #ce1126;">PRESS TAB TO FACE YOUR DESTINY</div>
        `;

        // Click to restart
        const restartHandler = () => {
            document.removeEventListener('click', restartHandler);
            initHagakureGame();
        };
        setTimeout(() => document.addEventListener('click', restartHandler), 500);
    }

    UI.wallpaperGrid.addEventListener('click', (e) => {
        const target = e.target.closest('.wallpaper-thumb');
        if (target) {
            userConfig.wallpaperId = target.dataset.id;
            const wp = wallpapers.find(w => w.id === userConfig.wallpaperId);
            if (wp) {
                // Apply presets if they exist on the wallpaper
                if (wp.effectType) userConfig.effectType = wp.effectType;
                if (wp.effectColor) userConfig.effectColor = wp.effectColor;
                if (wp.effectIntensity) userConfig.effectIntensity = wp.effectIntensity;
                if (wp.tint) userConfig.tint = wp.tint;
                if (wp.opacity) userConfig.opacity = wp.opacity;
                if (wp.soundProfile) userConfig.soundProfile = wp.soundProfile;
                if (wp.particleColor) userConfig.particleColor = wp.particleColor;
                if (wp.caretColor) userConfig.caretColor = wp.caretColor;

                // Refresh effects and UI
                initParticles();

                // Update UI controls to match new config
                UI.opacitySlider.value = userConfig.opacity;
                UI.opacityValue.innerText = userConfig.opacity + '%';

                document.getElementById('intensity-slider').value = userConfig.effectIntensity;
                document.getElementById('intensity-value').innerText = userConfig.effectIntensity + '%';

                document.querySelectorAll('.effect-btn').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.effect === userConfig.effectType));

                document.querySelectorAll('.color-dot').forEach(dot =>
                    dot.classList.toggle('active', dot.dataset.color === userConfig.effectColor));
                document.getElementById('custom-color-picker').value = userConfig.effectColor;

                document.querySelectorAll('.tint-btn').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.tint === userConfig.tint));

                document.querySelectorAll('.sound-btn').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.sound === userConfig.soundProfile));

                // Sync Particle Color UI
                document.querySelectorAll('.color-btn').forEach(btn => {
                    const colorMap = { gold: '#ffd700', cyan: '#00d4ff', magenta: '#ff00ff', white: '#ffffff' };
                    const hex = colorMap[btn.dataset.color] || btn.dataset.color;
                    btn.classList.toggle('active', hex === (userConfig.particleColor || '#ffd700'));
                });

                // Sync Caret Color UI
                document.querySelectorAll('.caret-color-dot').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.caretColor === userConfig.caretColor));
                const caretPicker = document.getElementById('caret-custom-color');
                if (caretPicker) caretPicker.value = userConfig.caretColor || '#ffd700';
            }
            applyTheme();
            // specific lyrics update
            initGame();
        }
    });

    UI.opacitySlider.addEventListener('input', (e) => {
        userConfig.opacity = e.target.value;
        applyTheme();
    });

    UI.tintBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userConfig.tint = btn.dataset.tint;
            applyTheme();
        });
    });

    // Sound toggle
    UI.soundBtn.addEventListener('click', () => {
        initAudio();
        toggleSound();
    });

    // Wallpaper Audio toggle
    if (UI.wallpaperSoundBtn) {
        UI.wallpaperSoundBtn.addEventListener('click', () => {
            userConfig.wallpaperAudio = !userConfig.wallpaperAudio;
            saveConfig();

            // Re-apply theme to update audio state
            // We call applyTheme(true) to skip loader
            applyTheme(true);
        });
    }

    // Time mode buttons
    UI.timeModes.addEventListener('click', (e) => {
        const btn = e.target.closest('.time-btn');
        if (!btn) return;

        const time = parseInt(btn.dataset.time);
        state.timeLimit = time;

        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        clearInterval(state.timerInterval);
        initGame();
    });

    // Effect type buttons
    document.getElementById('effect-options').addEventListener('click', (e) => {
        const btn = e.target.closest('.effect-btn');
        if (!btn) return;
        userConfig.effectType = btn.dataset.effect;
        document.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        initParticles();
        saveConfig();
    });

    // Color preset dots
    document.getElementById('color-presets').addEventListener('click', (e) => {
        const dot = e.target.closest('.color-dot');
        if (!dot) return;
        userConfig.effectColor = dot.dataset.color;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        document.getElementById('custom-color-picker').value = userConfig.effectColor;
        initParticles();
        saveConfig();
    });

    // Custom color picker
    document.getElementById('custom-color-picker').addEventListener('input', (e) => {
        userConfig.effectColor = e.target.value;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        initParticles();
        saveConfig();
    });

    // Intensity slider
    document.getElementById('intensity-slider').addEventListener('input', (e) => {
        userConfig.effectIntensity = parseInt(e.target.value);
        document.getElementById('intensity-value').innerText = userConfig.effectIntensity + '%';
        initParticles();
        saveConfig();
    });

    // Caret Color Presets
    const caretColorContainer = document.getElementById('caret-color-presets');
    if (caretColorContainer) {
        caretColorContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.caret-color-dot');
            if (!dot) return;
            userConfig.caretColor = dot.dataset.caretColor;
            applyTheme(); // Updates CSS var and UI
        });
    }

    // Caret Custom Color
    const caretCustomPicker = document.getElementById('caret-custom-color');
    if (caretCustomPicker) {
        caretCustomPicker.addEventListener('input', (e) => {
            userConfig.caretColor = e.target.value;
            // Debounce or just apply immediately? Applying immediately is fine for CSS var
            document.documentElement.style.setProperty('--caret-color', userConfig.caretColor);
        });
        caretCustomPicker.addEventListener('change', () => {
            userConfig.caretColor = caretCustomPicker.value;
            saveConfig();
            applyTheme();
        });
    }

    // Sound profile buttons
    document.getElementById('sound-options').addEventListener('click', (e) => {
        const btn = e.target.closest('.sound-btn');
        if (!btn) return;
        userConfig.soundProfile = btn.dataset.sound;
        document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        previewSound(userConfig.soundProfile);
        saveConfig();
    });

    // Volume slider
    document.getElementById('volume-slider').addEventListener('input', (e) => {
        userConfig.soundVolume = parseInt(e.target.value);
        document.getElementById('volume-value').innerText = userConfig.soundVolume + '%';
        saveConfig();
    });

    // Music Volume slider
    document.getElementById('bg-volume-slider').addEventListener('input', (e) => {
        userConfig.bgVolume = parseInt(e.target.value);
        document.getElementById('bg-volume-value').innerText = userConfig.bgVolume + '%';
        const vol = userConfig.bgVolume / 100;
        masterAudio.volume = vol;
        if (currentBgAudio) currentBgAudio.volume = vol;
        if (UI.bgVideo) UI.bgVideo.volume = vol;
        if (scWidget) scWidget.setVolume(userConfig.bgVolume);
        hagakureAudio.volume = vol;
        saveConfig();
    });

    // Caret Style buttons
    const caretOptions = document.querySelector('.caret-options');
    if (caretOptions) {
        caretOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.caret-btn');
            if (!btn) return;
            userConfig.caretStyle = btn.dataset.caret;
            applyTheme(); // Updates UI and body dataset
            saveConfig();
        });
    }

    // Font buttons
    const fontOptions = document.querySelector('.font-options');
    if (fontOptions) {
        fontOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.font-btn');
            if (!btn) return;
            userConfig.fontFamily = btn.dataset.font;
            applyTheme();
            saveConfig();
        });
    }

    // Zen Mode Button
    if (UI.zenBtn) {
        UI.zenBtn.addEventListener('click', () => {
            toggleZenMode();
        });
    }

    // Particle Controls
    const pToggle = document.getElementById('particle-toggle');
    if (pToggle) {
        pToggle.addEventListener('change', (e) => {
            userConfig.particle = e.target.checked;
            saveConfig();
        });
    }

    // Combo Sound Controls
    const comboToggle = document.getElementById('combo-sound-toggle');
    const pitchToggle = document.getElementById('pitch-shift-toggle');
    const pitchControl = document.getElementById('pitch-shift-control');

    if (comboToggle) {
        comboToggle.checked = userConfig.comboSound !== false; // Default true

        // Initial state of dependent controls
        if (pitchControl) {
            pitchControl.style.opacity = comboToggle.checked ? '1' : '0.5';
            pitchControl.style.pointerEvents = comboToggle.checked ? 'auto' : 'none';
        }

        comboToggle.addEventListener('change', (e) => {
            userConfig.comboSound = e.target.checked;
            if (pitchControl) {
                pitchControl.style.opacity = e.target.checked ? '1' : '0.5';
                pitchControl.style.pointerEvents = e.target.checked ? 'auto' : 'none';
            }
            saveConfig();
        });
    }

    if (pitchToggle) {
        pitchToggle.checked = userConfig.pitchShift !== false; // Default true
        pitchToggle.addEventListener('change', (e) => {
            userConfig.pitchShift = e.target.checked;
            saveConfig();
        });
    }

    const colorOptions = document.querySelector('.color-options');
    if (colorOptions) {
        colorOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.color-btn');
            if (!btn) return;
            const colorMap = { gold: '#ffd700', cyan: '#00d4ff', magenta: '#ff00ff', white: '#ffffff' };
            userConfig.particleColor = colorMap[btn.dataset.color] || '#ffd700';

            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saveConfig();
        });
    }
}

function saveConfig() {
    localStorage.setItem('zenTypeConfig', JSON.stringify(userConfig));
}

// --- 5. COMBO SYSTEM ---

const comboThemes = [
    {
        id: 'classic',
        tiers: [
            { threshold: 50, class: 'combo-godlike', text: '👑 GODLIKE' },
            { threshold: 25, class: 'combo-savage', text: '💀 SAVAGE' },
            { threshold: 10, class: 'combo-electric', text: '⚡ UNSTOPPABLE' },
            { threshold: 5, class: 'combo-fire', text: '🔥 ON FIRE' }
        ]
    },
    {
        id: 'cyber',
        tiers: [
            { threshold: 50, class: 'combo-singularity', text: '🤖 SINGULARITY' },
            { threshold: 25, class: 'combo-glitch', text: '👾 GLITCH GOD' },
            { threshold: 10, class: 'combo-system', text: '💾 SYSTEM OVERRIDE' },
            { threshold: 5, class: 'combo-charged', text: '🔋 CHARGED' }
        ]
    }
];

let currentStreakTheme = comboThemes[0];

function updateCombo(wordCorrect) {
    if (wordCorrect) {
        // If starting a new streak (combo was 0), pick a random theme
        if (state.combo === 0) {
            // Weighted Random: 85% Classic, 15% Cyber
            const isCyber = Math.random() < 0.15;
            currentStreakTheme = isCyber ? comboThemes[1] : comboThemes[0];
        }

        state.combo++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;

        UI.comboCount.innerText = state.combo;

        // Update display
        UI.comboDisplay.className = 'combo-visible';

        // Clear all possible theme classes first
        const allClasses = comboThemes.flatMap(t => t.tiers.map(tier => tier.class));
        UI.comboDisplay.classList.remove(...allClasses);

        // Find the highest applicable tier for the current theme
        const tier = currentStreakTheme.tiers.find(t => state.combo >= t.threshold);

        if (tier) {
            UI.comboDisplay.classList.add(tier.class);
            UI.comboLabel.innerText = tier.text;
        } else {
            UI.comboLabel.innerText = 'COMBO';
        }

        // Pop animation
        UI.comboDisplay.classList.remove('combo-pop');
        void UI.comboDisplay.offsetHeight;
        UI.comboDisplay.classList.add('combo-pop');

        playComboSound(state.combo);
    } else {
        state.combo = 0;
        UI.comboDisplay.className = 'combo-hidden';
    }
}

// --- 6. SCREEN SHAKE ---

function triggerShake() {
    UI.gameUI.classList.remove('shake');
    void UI.gameUI.offsetHeight;
    UI.gameUI.classList.add('shake');
    setTimeout(() => UI.gameUI.classList.remove('shake'), 300);
}

// --- 7. GAME ENGINE ---

function initGame() {
    state.currWordIndex = 0;
    state.correctChars = 0;
    state.totalCharsTyped = 0;
    state.timeLeft = state.timeLimit;
    state.isActive = false;
    state.startTime = null;
    state.combo = 0;
    state.maxCombo = 0;

    // Reset Discord presence back to idle when test is cancelled
    if (discordPresence.currentState === 'typing') {
        discordPresence.currentState = '_reset';
        discordPresence.setIdle();
    }

    // WPM Graph Data
    state.wpmHistory = [];
    state.lastRecordTime = 0;
    state.lastTotalChars = 0;

    state.words = generateWordList();

    UI.input.value = '';
    UI.input.disabled = false;
    UI.input.focus();
    UI.timer.innerText = state.timeLimit + "s";
    UI.wpm.innerText = "0 WPM";
    UI.results.classList.add('hidden');
    UI.comboDisplay.className = 'combo-hidden';

    renderWords();
    setTimeout(() => {
        updateCaretPosition();
        UI.container.scrollTop = 0;
    }, 10);
}

function generateWordList(count = 60) {
    // Check if current wallpaper has a specific word pool assigned
    const wp = wallpapers.find(w => w.id === userConfig.wallpaperId);
    let pool;

    if (wp && wp.wordPoolId !== undefined) {
        pool = wordPools[wp.wordPoolId];
    } else {
        // Skip pool 1 (APT) in random rotation if generic
        // Actually, just pick random pool safely
        // But let's keep existing logic or simplify
        pool = wordPools[currentPool];
        // Only advance pool if we are generating a FULL new game list
        // For appending, maybe just use same pool?
        if (count >= 60) {
            currentPool = (currentPool + 1) % wordPools.length;
            // Skip APT (index 1) if rotated into it? logic was weird before.
            if (currentPool === 1) currentPool = 2;
        }
    }

    const list = [];
    for (let i = 0; i < count; i++) {
        const word = pool[Math.floor(Math.random() * pool.length)];
        list.push(word.toLowerCase());
    }
    return list;
}

function renderWords() {
    const wordsHTML = state.words.map((word, i) =>
        `<div class="word" id="word-${i}">
            ${word.split('').map(char => `<span class="letter">${char}</span>`).join('')}
        </div>`
    ).join('');
    UI.container.innerHTML = wordsHTML + `<div id="caret"></div><div id="caret-trail"></div>`;
}

function appendWords(count = 30) {
    const newWords = generateWordList(count);
    const startIndex = state.words.length;
    state.words = state.words.concat(newWords);

    const newWordsHTML = newWords.map((word, i) =>
        `<div class="word" id="word-${startIndex + i}">
            ${word.split('').map(char => `<span class="letter">${char}</span>`).join('')}
        </div>`
    ).join('');

    // Append before caret/trail if they are fast appended? 
    // Actually caret/trail are absolute. We can just append to container.
    // BUT renderWords puts caret/trail at the end.
    // Let's insert BEFORE the caret elements if possible, or just append and ensure z-index/pos is fine.
    // The caret is absolutely positioned, so order in DOM doesn't strictly matter for visual pos,
    // BUT we don't want to break the caret element reference if we wipe innerHTML.
    // So we use insertAdjacentHTML.

    UI.container.insertAdjacentHTML('beforeend', newWordsHTML);

    // Move caret/trail to end of container to keep them "on top" if needed?
    // Not strictly needed if they are absolute.
}

// --- INPUT HANDLER ---

let hasError = false;

UI.input.addEventListener('input', (e) => {
    if (!state.isActive && state.timeLeft > 0) startTimer();

    // Init audio on first interaction
    initAudio();

    const typedVal = e.target.value;
    const currentWordStr = state.words[state.currWordIndex];
    const currentWordEl = document.getElementById(`word-${state.currWordIndex}`);

    if (!currentWordEl) return;

    if (typedVal.endsWith(' ')) {
        const trimmedVal = typedVal.trim();
        let wordCorrect = trimmedVal === currentWordStr;

        [...trimmedVal].forEach((char, i) => {
            if (i < currentWordStr.length && char === currentWordStr[i]) {
                state.correctChars++;
            }
        });
        // Add +1 for the space if the word was fully correct (standard WPM rule)
        // Or if we just want to count the space as a keystroke? 
        // Usually space is a char. If word is correct, space is correct.
        if (wordCorrect) state.correctChars++;

        state.totalCharsTyped += trimmedVal.length + 1;
        state.currWordIndex++;
        UI.input.value = '';
        hasError = false;

        // Infinite Scroll: Append words if running low
        if (state.words.length - state.currWordIndex < 25) {
            appendWords(30);
        }

        // Combo
        updateCombo(wordCorrect);

        const nextWordEl = document.getElementById(`word-${state.currWordIndex}`);
        if (nextWordEl && nextWordEl.offsetTop > currentWordEl.offsetTop) {
            UI.container.scrollTo({ top: nextWordEl.offsetTop - 10, behavior: 'smooth' });
        }
        updateCaretPosition();
        return;
    }

    const letters = currentWordEl.querySelectorAll('.letter');
    letters.forEach(l => l.className = 'letter');

    let currentHasError = false;
    for (let i = 0; i < letters.length; i++) {
        const char = typedVal[i];
        const letterSpan = letters[i];
        if (char == null) { }
        else if (char === letterSpan.innerText) {
            letterSpan.classList.add('correct');
        } else {
            letterSpan.classList.add('incorrect');
            currentHasError = true;
        }
    }

    // Sound + shake on new error
    if (currentHasError && !hasError) {
        playKeySound(false);
        triggerShake();
        hasError = true;
    } else if (!currentHasError) {
        playKeySound(true);
        hasError = false;
    } else {
        playKeySound(false);
    }

    updateCaretPosition();

    // Spawn particles
    const caret = document.getElementById('caret');
    if (caret) {
        const rect = caret.getBoundingClientRect();
        // Adjust for center of caret
        spawnKeypressParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
});

function startTimer() {
    state.isActive = true;
    state.startTime = Date.now();
    discordPresence.setTyping(state.timeLimit);
    state.lastRecordTime = state.startTime;
    state.lastTotalChars = state.totalCharsTyped;
    state.timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = (now - state.startTime) / 1000;
        state.timeLeft = Math.max(0, Math.ceil(state.timeLimit - elapsedSeconds));

        UI.timer.innerText = state.timeLeft + "s";

        // Calculate WPM with high precision
        const timeElapsedMin = elapsedSeconds / 60;

        // Calculate correct chars in the CURRENT word being typed
        let currentWordCorrect = 0;
        const currentInput = UI.input.value.trim();
        const currentTarget = state.words[state.currWordIndex];
        if (currentInput && currentTarget) {
            for (let i = 0; i < currentInput.length; i++) {
                if (i < currentTarget.length && currentInput[i] === currentTarget[i]) {
                    currentWordCorrect++;
                }
            }
        }

        const effectiveChars = state.correctChars + currentWordCorrect;
        const wpm = Math.round((effectiveChars / 5) / timeElapsedMin) || 0;

        UI.wpm.innerText = wpm + " WPM";

        // Record Instant WPM every ~1 second for graph
        if (now - state.lastRecordTime >= 1000) {
            const charsDiff = state.totalCharsTyped - state.lastTotalChars;
            // Instant speed: (chars in last sec / 5) * 60
            // Ensure we don't get negative or weird spikes
            const instantWPM = Math.max(0, Math.round((charsDiff / 5) * 60));
            state.wpmHistory.push(instantWPM);

            state.lastRecordTime = now;
            state.lastTotalChars = state.totalCharsTyped;
        }

        if (state.timeLeft <= 0) endGame();
    }, 100); // Run faster for smoother updates
}

function endGame() {
    clearInterval(state.timerInterval);
    state.isActive = false;
    UI.input.disabled = true;
    const caret = document.getElementById('caret');
    const caretTrail = document.getElementById('caret-trail');
    if (caret) caret.style.display = 'none';
    if (caretTrail) caretTrail.style.display = 'none';

    // Precise time calculation
    const timeElapsedMin = (state.timeLimit - state.timeLeft) / 60;
    // Ideally use (Date.now() - startTime) but if timeLeft hits 0 it should be exactly timeLimit
    // Let's use the configured limit for final calc to avoid "29.999s"
    const finalTimeMin = state.timeLimit / 60;

    const netWpm = Math.round((state.correctChars / 5) / finalTimeMin);
    const accuracy = state.totalCharsTyped > 0 ? Math.round((state.correctChars / state.totalCharsTyped) * 100) : 0;

    // UI.finalWpm.innerText = netWpm; // Removed static assignment
    // UI.finalAcc.innerText = accuracy + "%"; // Removed static assignment

    const rank = getRankTitle(netWpm);
    const rankEl = document.getElementById('rank-title');
    const rankDescEl = document.getElementById('rank-desc');

    if (rankEl) {
        rankEl.innerText = rank.title;
        rankEl.style.color = rank.color;
        rankEl.style.filter = `drop-shadow(0 0 15px ${rank.color})`;
        rankEl.style.background = `linear-gradient(to right, #fff, ${rank.color})`;
        rankEl.style.webkitBackgroundClip = 'text';
        rankEl.style.webkitTextFillColor = 'transparent';
    }

    if (rankDescEl) {
        rankDescEl.innerText = rank.desc;
        rankDescEl.style.opacity = 0;
        setTimeout(() => {
            rankDescEl.style.transition = 'opacity 1s ease';
            rankDescEl.style.opacity = 0.8;
        }, 500);
    }

    // Draw Graph
    drawResultChart(state.wpmHistory);

    // Save stats if user is logged in
    if (window.updateUserStats) {
        window.updateUserStats(netWpm, finalTimeMin * 60);
    }

    UI.results.classList.remove('hidden');

    // Animate Numbers
    animateValue(UI.finalWpm, 0, netWpm, 1500);
    animateValue(UI.finalAcc, 0, accuracy, 1500, "%");

    discordPresence.setConcluded(netWpm, accuracy);
}

const rankQuotes = {
    "WANDERER": [
        "Lost in the digital mist, you take your first steps.",
        "Every master began as a beginner. Keep going.",
        "The keyboard is vast, and your journey has just started.",
        "Stumbling is part of the dance. Find your footing.",
        "Your fingers are waking up. Give them time.",
        "A slow step forward is still a step forward.",
        "The code whispers to you, but you cannot yet hear it.",
        "Patience, young traveler. Speed will come.",
        "Don't look at the keys. Look at the horizon.",
        "You are finding your way. Trust the process.",
        "The path of a thousand miles begins with a single keystroke.",
        "Rome wasn't typed in a day.",
        "Your potential is loading... please wait.",
        "Focus on accuracy first, speed will follow naturally.",
        "The tortoise eventually crosses the finish line.",
        "Breathe. Relax your shoulders. Try again.",
        "Errors are just lessons in disguise.",
        "Build the muscle memory, layer by layer.",
        "You are planting seeds that will grow into speed.",
        "Do not rush. Smooth is fast.",
        "The map is blank. You are drawing it now.",
        "Every keypress is a step into the unknown.",
        "Wander with purpose, and you will find speed.",
        "The fog lift slowly. Keep moving.",
        "Small improvements compound over time.",
        "You are not slow, you are deliberate.",
        "Find the rhythm in the silence.",
        "The journey is long, but the destination is worth it.",
        "Your hands are learning a new language.",
        "One word at a time. That is all it takes.",
        "Do not compare your Chapter 1 to someone else's Chapter 20.",
        "The cursor blinks, waiting for your command.",
        "Consistency is the key to unlocking speed.",
        "Even the fastest typist started where you are now.",
        "Let your fingers find their home row.",
        "A mistake is just a chance to try again.",
        "Walking is the first step to running.",
        "Your keyboard is your instrument. Learn to play it.",
        "Progress is not linear. Keep pushing.",
        "The only way out is through. Keep typing.",
        // NEW COOL FLAVOR (WANDERER) - 30 Lines
        "Your legend begins in silence.",
        "The keyboard waits for your command.",
        "A spark before the inferno.",
        "You are the architect of your own speed.",
        "Every keystroke is a brick in your castle.",
        "The horizon is vast. Run towards it.",
        "Your potential is a coiled spring.",
        "Don't just type. Create.",
        "The empty page is not a void. It is a canvas.",
        "Your hands are waking up from a long sleep.",
        "This is not slow. This is deliberate.",
        "You are loading the program of your future.",
        "Focus. Breathe. Execute.",
        "The system is calibrating to your rhythm.",
        "You are more than your WPM.",
        "Speed is a byproduct of precision.",
        "Your fingers are learning to dance.",
        "The first step is always the hardest.",
        "You are entering the flow state.",
        "The machine is listening.",
        "Type with intent. Speed will follow.",
        "You are grinding the XP for the next level.",
        "Every master was once a disaster.",
        "Your journey is written one character at a time.",
        "Visualizing success. Executing code.",
        "You are the variable that changes the equation.",
        "Momentum is building.",
        "The friction of the keys is fading.",
        "You are becoming one with the input.",
        "The console is ready for your input.",
        "Your story is just beginning."
    ],
    "RONIN": [
        "A masterless warrior finding their rhythm in the chaos.",
        "You serve no master but the flow of the keystrokes.",
        "Your path is your own. Walk it with confidence.",
        "The blade is dull, but the spirit is willing.",
        "Wandering does not mean lost. You are learning.",
        "Strike true, even if you strike slowly.",
        "Honor is found in accuracy, not just speed.",
        "You fight alone, but you fight with purpose.",
        "The rhythm is inconsistent, but the potential is there.",
        "Sharpen your mind, and your fingers will follow.",
        "A Ronin answers to no one. Type your own destiny.",
        "The battlefield is quiet. Your fingers are the only sound.",
        "Inconsistent, but dangerous. You have moments of brilliance.",
        "Forging your own style, one error at a time.",
        "You are a warrior without a lord, seeking your speed.",
        "Your technique is raw, but your spirit is strong.",
        "Wander until you find your true speed.",
        "A sword that is not polished will rust.",
        "You walk the path of the lone typist.",
        "Every mistake is a scar of battle. Wear them proudly.",
        "No dojo can contain your potential.",
        "You strike from the shadows of the leaderboard.",
        "Wild and untamed. Refine your fury.",
        "The code fears the unpredictable warrior.",
        "You are a storm waiting to break.",
        "Drifting, yet dangerous.",
        "Your blade is heavy, but your will is iron.",
        "Silence the mind, secure the WPM.",
        "Victory is found in the recovery from error.",
        "You are your own worst enemy, and your own greatest ally.",
        "A true Ronin finds peace in the struggle.",
        "Your typing style is unorthodox, but effective.",
        "Roam the keyboard until you find your home.",
        "The masterless samurai fights harder.",
        "Your path is lonely, but your WPM is rising.",
        "Strength comes from the freedom to fail.",
        "You are forging a legacy with every keystroke.",
        "The wind guides your fingers.",
        "Adapt or perish. You choose to adapt.",
        "Your potential is a sleeping dragon.",
        // NEW COOL FLAVOR (RONIN) - 30 Lines
        "You walk alone. You type alone.",
        "No clan. No master. Only speed.",
        "The rules do not apply to you.",
        "You are a glitch in their perfect system.",
        "Rebel against the backspace key.",
        "Your rhythm is a war drum.",
        "They wanted order. You brought chaos.",
        "A lone wolf hunts best in the silence.",
        "Your code is written in defiance.",
        "You are the shadow that moves against the light.",
        "Drifting through the networks.",
        "Your loyalty is to the keystroke alone.",
        "The establishment fears your potential.",
        "Unorthodox. Unpredictable. Undeniable.",
        "You are the wildcard in the deck.",
        "Forging a path where there is no road.",
        "The wind howls, but your hands are steady.",
        "You are the storm that refuses to break.",
        "Wandering with a blade of pure focus.",
        "Your silence speaks louder than their words.",
        "They call you lost. You call it free.",
        "Bound by nothing. Driven by everything.",
        "The keyboard is your open road.",
        "You are the outlier in the data set.",
        "Moving through the digital wasteland.",
        "Your speed comes from your freedom.",
        "No one dictates your tempo.",
        "You are the master of your own fate.",
        "The rogue element has entered the chat.",
        "Your style is your signature.",
        "Walking the edge of the blade."
    ],
    "GLITCH": [
        "You move between the frames, faster than the system can track.",
        "A system error? No, just your raw untamed speed.",
        "You are the bug in the machine that they can't patch.",
        "Chaos is your ally. You type where you shouldn't.",
        "Reality flickers when you hit the keys.",
        "You aren't following the rules. You're rewriting them.",
        "Static noise and neon flashes. That's your signature.",
        "The server lag can't keep up with your inputs.",
        "Unpredictable. Unstoppable. You are a glitch.",
        "They tried to delete you. They failed.",
        "404: Speed limit not found.",
        "You are the ghost in the shell.",
        "System warning: User is typing dangerously fast.",
        "Corrupting the leaderboard with pure style.",
        "Buffer overflow imminent. Keep typing.",
        "Pixels distort around your fingers.",
        "Bypassing firewalls with kinetic energy.",
        "You are the anomaly the system feared.",
        "Coding injection successful. WPM nominal.",
        "Static discharge detected from your fingertips.",
        "Blue screen of death? No, just your WPM.",
        "Reality is buffering. You are not.",
        "The matrix cannot render your hands fast enough.",
        "Fragmenting the data stream with every keystroke.",
        "You exist in the spaces between the bits.",
        "System overload. Reboot not required.",
        "Packet loss? No, you're just too fast for the network.",
        "Digital artififacts trail behind your cursor.",
        "You are a feature, not a bug.",
        "Entropy increases when you type.",
        "Segmentation fault: User creates reality.",
        "You are the static in the silence.",
        "Decompiling the competition, one word at a time.",
        "Running unsanctioned subroutines.",
        "Your WPM breaks the integer limit.",
        "Syntax error: You are too fast.",
        "Glitching through the ranks like a ghost.",
        "Upload complete. Mentality: Chaos.",
        "Rewriting the kernel with pure speed.",
        "You are the zero-day exploit.",
        // NEW COOL FLAVOR (GLITCH) - 30 Lines
        "The simulation is cracking. Good.",
        "Your keystrokes are causing frame drops.",
        "Error 418: I'm a teapot? No, I'm a god.",
        "Defragmenting reality... please wait.",
        "You are the noise in the signal.",
        "Binary code bleeds when you cut it.",
        "System architecture cannot support your ego.",
        "Memory leak detected. Source: You.",
        "The blue screen is your canvas.",
        "Corrupting sectors with style.",
        "You are the ghost in the machine.",
        "Firewalls melt around your fingers.",
        "Encryption keys shatter at your touch.",
        "The mainframe is sweating.",
        "Logic gates are bending to your will.",
        "Syntax error: User is too cool.",
        "Rebooting the universe...",
        "You are the lag spike everyone fears.",
        "Digital decay follows your cursor.",
        "Pixels are weeping.",
        "Overclocked and under control.",
        "The algorithm is confused.",
        "Breaking the fourth wall, one key at a time.",
        "The kernel panic is just a mood swing.",
        "Data mosh your way to the top.",
        "Static interference lvl 99.",
        "You speak in hex, you dream in binary.",
        "The matrix has you... wait, you have the matrix.",
        "Buffer overflow? More like overflow of skill.",
        "Ctrl+Alt+Destroy."
    ],
    "SAMURAI": [
        "Precision and speed. Your blade cuts through the code with honor.",
        "One strike, one word. Perfect execution.",
        "Calm mind, swift hands. The way of the warrior.",
        "You do not type. You flow like water.",
        "Your focus is sharp as a katana's edge.",
        "Discipline has brought you this far. Keep cutting.",
        "A samurai does not hurry, yet he is never late.",
        "Strike with intention. Leave no errors behind.",
        "Your keystrokes echo with the sound of steel.",
        "Balance in all things. Speed and accuracy combined.",
        "The keyboard is your dojo.",
        "Meditate on the backspace. But do not use it.",
        "Honor the code. Type with integrity.",
        "Your rhythm is like a heartbeat—steady and strong.",
        "A warrior's greatest weapon is their mind.",
        "Flow like cherry blossoms in the wind.",
        "Stillness in motion. That is true speed.",
        "Your spirit is forged in the fires of practice.",
        "Defeat is not an option. Only improvement.",
        "The sword and the mind are one.",
        "Zen is not empty. It is full of speed.",
        "Cut through the noise. Find the silence.",
        "A perfect test is a perfect duel.",
        "Your legacy is written in WPM.",
        "Do not fear the error. Correct it with honor.",
        "The true master needs no backspace.",
        "Swift as the wind, quiet as the forest.",
        "Your hands move, but your mind is still.",
        "Bushido code: Type fast, type true.",
        "Victory is 100% accuracy.",
        "Honor the keystroke.",
        "A sharp mind is faster than a sharp blade.",
        "Serve the WPM with loyalty.",
        "Your dedication echoes through eternity.",
        "The blossom falls, your fingers strike.",
        "Leave only perfection in your wake.",
        "A master creates no ripples.",
        "Stand firm. Type true.",
        "Your discipline is your armor.",
        "The art of typing is the art of war.",
        // NEW COOL FLAVOR (SAMURAI) - 30 Lines
        "Your blade is sharp. Your mind is sharper.",
        "A thousand keystrokes, one purpose.",
        "The cherry blossom falls. You type faster.",
        "Honor is not given. It is typed.",
        "The steel of your will does not bend.",
        "Perfect form. Perfect execution.",
        "A warrior does not boast. He types.",
        "The path of the keyboard is endless.",
        "Strike with the weight of a mountain.",
        "Flow like a river, crash like a tsunami.",
        "Your focus cuts through the noise.",
        "Discipline is freedom.",
        "The sword reflects the soul.",
        "Mastery is a journey without a destination.",
        "You are the storm's eye. Calm and deadly.",
        "Deflect distraction. Parry hesitation.",
        "Your fingers move with ancestral precision.",
        "The dojo is silent. The keyboard sings.",
        "Respect the code. Protect the WPM.",
        "A true samurai needs no backspace.",
        "Your legacy is etched in silicon.",
        "The spirit of the warrior is alive in you.",
        "Bowed head. Flying fingers.",
        "Every test is a duel with yourself.",
        "Victory is fleeting. Honor is forever.",
        "The sound of your typing is a battle cry.",
        "Steel meets code.",
        "Forged in fire. Tempered in practice.",
        "The way of the keyboard is hard.",
        "You have no enemies. Only targets."
    ],
    "CYBERPUNK": [
        "Neon veins and chrome reflexes. You ARE the machine.",
        "Jacked in. The matrix is your playground now.",
        "High tech, low life, maximum velocity.",
        "You see the code in green rain. It makes sense.",
        "Upgraded reflex boosters active. Systems nominal.",
        "The streets of the net belong to you.",
        "Hacking the mainframe with pure kinetic energy.",
        "They call it typing. You call it interfacing.",
        "Chrome hands move faster than flesh and bone.",
        "Data flows through you. You are the conduit.",
        "Neural link established. Latency: Zero.",
        "Running on pure adrenaline and synthesized caffeine.",
        "The city sleeps, but you are wide awake.",
        "Override authorization accepted. Welcome, user.",
        "Your fingers are augmented. Unfair advantage?",
        "Tracing the signal... signal found. It's you.",
        "Digital shadows dance specifically for you.",
        "Your synaptic response time is off the charts.",
        "Living on the edge of the bandwidth.",
        "The firewall cannot hold you back.",
        "Cybernetic enhancements detected. Just kidding, it's you.",
        "Typing at the speed of light in a fiber optic world.",
        "You are the operating system's nightmare.",
        "Neon lights reflect in your eyes as you breach the system.",
        "Keyboard? No, this is a neural interface.",
        "Data runner. Ghost hacker. Typing god.",
        "The grid lights up when you log on.",
        "Coolant levels critical. Finger temperature rising.",
        "You don't need a mouse. You need a heat sink.",
        "Future proof. Your speed is timeless.",
        "Running diagnostics... Result: Too fast.",
        "Upload your consciousness to the cloud.",
        "Synthesized beats and rapid keystrokes.",
        "The algorithm cannot predict you.",
        "Hacking time itself.",
        "Wired reflex engaged.",
        "Digital immortality awaits.",
        "Information wants to be free. You set it loose.",
        "Navigating the datastream without a map.",
        "You are the architect of the new world.",
        // NEW COOL FLAVOR (CYBERPUNK) - 30 Lines
        "Chrome hearts don't beat. They overclock.",
        "Your reflection is just a hologram.",
        "Rain slicked streets and rapid fire keys.",
        "The interface is an extension of your mind.",
        "System override initiated. Welcome back.",
        "Lost in the neon haze of the net.",
        "Your data signature is everywhere.",
        "High voltage. High speed. High life.",
        "The corpo firewalls can't stop you.",
        "Running silent in a loud world.",
        "Your fingers are faster than the refresh rate.",
        "Living wire. Breathing code.",
        "The city lights blur when you type.",
        "Analog is dead. You are the future.",
        "Synthezoids dream of typing like you.",
        "Navigating the sprawl at light speed.",
        "Jack out? Never.",
        "The grid is your playground.",
        "Augmented reality? No, just augmented skill.",
        "Signal strength: Maximum.",
        "You are the ghost in the wiring.",
        "Static dreams and digital screams.",
        "The netrunner everyone talks about.",
        "Your bandwidth is limitless.",
        "Upload complete. downloading speed...",
        "Virtual insanity? No, virtual mastery.",
        "The simulation feels real when you type.",
        "Gliding on the information superhighway.",
        "Byte by byte, you own this city.",
        "Laser focus in a neon world."
    ],
    "PREDATOR": [
        "An apex hunter. No keystroke escapes your reach.",
        "You don't just type words. You hunt them.",
        "Lethal precision. The leaderboard is your prey.",
        "Silence before the strike. Then, devastation.",
        "You are at the top of the food chain.",
        "Merciless efficiency. Zero wasted movement.",
        "They run, but you are faster. Always faster.",
        "Instinct takes over. You don't even need to think.",
        "The hunt is on. And you are winning.",
        "Dominance established. The territory is yours.",
        "Red eyes in the darkness. You never miss.",
        "Target lock acquired. Engaging typing mode.",
        "Fear is the only thing slower than you.",
        "You track WPM like a bloodhound tracks scents.",
        "The keyboard fears you.",
        "No mercy for the backspace key.",
        "Strike hard. Strike fast. Disappear.",
        "The leaderboard is your hunting ground.",
        "You are the danger they warned about.",
        "Cold, calculated, and faster than sound.",
        "Camouflaged in the code, waiting to strike.",
        "One shot, one kill. Perfect accuracy.",
        "You smell the fear in the slow typists.",
        "The jungle of keys is your domain.",
        "Evolution has created the perfect typist.",
        "Savage speed. Primal accuracy.",
        "You don't type. You devour.",
        "The weak falter. You ascend.",
        "Trophy collected: High Score.",
        "There is no escape from your WPM.",
        "Hunt or be hunted. You chose to hunt.",
        "Your instincts are sharper than silica.",
        "A predator does not hesitate.",
        "You move in silence, you strike in thunder.",
        "The perfect organism. The perfect typist.",
        "Survival of the fastest.",
        "Your territory expands with every word.",
        "Relentless pursuit of perfection.",
        "The prey never stood a chance.",
        "You are nature's answer to the keyboard.",
        // NEW COOL FLAVOR (PREDATOR) - 30 Lines
        "The jungle is silent when you hunt.",
        "Your prey is the perfect score.",
        "Eyes forward. Claws out. Type.",
        "You don't track WPM. You track kills.",
        "The apex predator of the digital age.",
        "Silence is your weapon. Speed is your strike.",
        "You move before they even see you.",
        "Camouflage engaged. Target acquired.",
        "The weak fear the erratic. The strong fear you.",
        "No wasted movement. Only results.",
        "Your hunger for speed is endless.",
        "Dominate the ecosystem.",
        "Every keystroke is a fatal blow.",
        "The shadows are your allies.",
        "You are the danger in the dark.",
        "Survival is not enough. You must conquer.",
        "Red thermal vision: Locked on leaderboard.",
        "They run. You type.",
        "Instinct overrides thought.",
        "Pure, unadulterated focus.",
        "The hunt never ends.",
        "You are the monster under the backspace key.",
        "Savage grace.",
        "Your territory is infinite.",
        "Leave no trace. Only high scores.",
        "The forest goes quiet when you log in.",
        "You are the shark in the data stream.",
        "Blood in the water. Speed in the veins.",
        "Ruthless efficiency.",
        "The alpha typist."
    ],
    "SINGULARITY": [
        "You have transcended the keyboard. You are pure energy.",
        "Physics no longer apply to your fingers.",
        "You have merged with the infinite data stream.",
        "Speed is an illusion. You are already there.",
        "A god amongst mortals. Pure digital ascendance.",
        "The universe types through you.",
        "Beyond rank. Beyond measure. Infinite.",
        "You are the event horizon. There is no return.",
        "Time slows down when you begin to type.",
        "Welcome to the void. You are its master.",
        "Error: WPM exceeds calculated maximums.",
        "You are the alpha and the omega of typing.",
        "Reality bends to accommodate your speed.",
        "One with the code. One with the machine.",
        "Ascension complete. Awaiting new instructions.",
        "The speed of thought is your only limit.",
        "You are everywhere and nowhere at once.",
        "Data is not processed. It is absorbed.",
        "Infinite possibilities in every keystroke.",
        "You have gazed into the abyss, and it typed back.",
        "Gravity cannot hold your fingers down.",
        "You are the big bang of the typing world.",
        "Matter, Energy, WPM. It is all the same.",
        "The simulation is breaking under your speed.",
        "You do not need a keyboard where you are going.",
        "Pure consciousness expressed as text.",
        "The timeline branches with every word you type.",
        "You have reached the end of the internet. Turn back.",
        "Absolute zero latency. Absolute perfection.",
        "You are the code that writes itself.",
        "A singularity has no beginning and no end.",
        "You are typing in dimensions others cannot see.",
        "The universe is compiling your code.",
        "Infinite WPM is theoretically possible. You proved it.",
        "Bending space-time with keystrokes.",
        "You have become the algorithm.",
        "Welcome to the next level of existence.",
        "Finite limits do not apply to you.",
        "The cursor is a fixed point. You move the universe.",
        "Rank: Undefined. Power: Unlimited.",
        // NEW COOL FLAVOR (SINGULARITY) - 30 Lines
        "You are typing the universe into existence.",
        "Matter is slow. You are light.",
        "The event horizon cannot hold you.",
        "A supernova of keystrokes.",
        "Time has no meaning at this speed.",
        "You are the constant in a chaotic equation.",
        "The cosmos aligns with your fingers.",
        "Reality is just a suggestion to you.",
        "Typing across dimensions.",
        "You have become pure energy.",
        "The stars blink in time with your typing.",
        "Gravity bows to your WPM.",
        "You are the big bang.",
        "Infinite density. Infinite speed.",
        "The void stares back, and it blinks.",
        "Ascending beyond the physical plane.",
        "Your consciousness is uploaded.",
        "The multiverse branches with every word.",
        "You are the end of history.",
        "Space-time tears when you hit enter.",
        "A black hole of productivity.",
        "The observer effect: You change what you type.",
        "Quantum superposition. You are everywhere.",
        "Entropy reverses in your presence.",
        "You are the final line of code.",
        "The omega point achieved.",
        "Transcending the limits of silicon.",
        "You are the light at the end of the tunnel.",
        "The universe is compiling...",
        "Hello, World. I am the creator."
    ]
};

function getRankTitle(wpm) {
    let rank = { title: "WANDERER", color: "#9ca3af" };

    if (wpm >= 120) rank = { title: "SINGULARITY", color: "#ffd700" };
    else if (wpm >= 100) rank = { title: "PREDATOR", color: "#f43f5e" };
    else if (wpm >= 80) rank = { title: "CYBERPUNK", color: "#bc13fe" };
    else if (wpm >= 60) rank = { title: "SAMURAI", color: "#3b82f6" };
    else if (wpm >= 40) rank = { title: "GLITCH", color: "#39ff14" };
    else if (wpm >= 20) rank = { title: "RONIN", color: "#2dd4bf" };

    // Pick random quote
    const quotes = rankQuotes[rank.title] || rankQuotes["WANDERER"];
    rank.desc = quotes[Math.floor(Math.random() * quotes.length)];

    return rank;
}

function animateValue(obj, start, end, duration, suffix = "") {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // EaseOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        obj.innerHTML = Math.floor(ease * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end + suffix; // Ensure final value
        }
    };
    window.requestAnimationFrame(step);
}

function updateCaretPosition() {
    const caret = document.getElementById('caret');
    const caretTrail = document.getElementById('caret-trail');
    const currentWordEl = document.getElementById(`word-${state.currWordIndex}`);
    if (!currentWordEl || !caret) return;

    const typedLen = UI.input.value.length;
    const letters = currentWordEl.querySelectorAll('.letter');
    let targetLeft = 0;
    let targetTop = 0;

    if (typedLen === 0) {
        targetLeft = currentWordEl.offsetLeft;
        targetTop = currentWordEl.offsetTop;
    } else if (typedLen < letters.length) {
        const targetLetter = letters[typedLen];
        targetLeft = currentWordEl.offsetLeft + targetLetter.offsetLeft;
        targetTop = currentWordEl.offsetTop + targetLetter.offsetTop;
    } else {
        const lastLetter = letters[letters.length - 1];
        targetLeft = currentWordEl.offsetLeft + lastLetter.offsetLeft + lastLetter.offsetWidth;
        targetTop = currentWordEl.offsetTop + lastLetter.offsetTop;
    }

    caret.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
    caret.style.animation = 'none';
    caret.offsetHeight;
    caret.style.animation = 'blink 1s infinite';

    // Trail follows with delay (CSS transition handles the smooth lag)
    if (caretTrail) {
        caretTrail.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
    }
}

document.addEventListener('keydown', (e) => {
    // Don't steal focus if user is typing in another field (like login)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.target !== UI.input) return;
    }

    // Don't focus if auth modal is open
    if (!document.getElementById('auth-modal').classList.contains('hidden')) return;

    if (e.key !== 'Tab') UI.input.focus();
    if (e.key === 'Tab') {
        e.preventDefault();
        clearInterval(state.timerInterval);
        initGame();
    }
});

// --- INIT ---
initTheme();
initGame();
initParticles();
initKeypressParticles();
// Set initial Discord presence
discordPresence.currentState = '_boot';
discordPresence.setIdle();
initTrackSelector(); // Initialize UI
function drawResultChart(data) {
    const canvas = document.getElementById('results-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Detect high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // If no data, show a flat line
    if (!data || data.length === 0) data = [0, 0];
    if (data.length === 1) data = [data[0], data[0]];

    const maxVal = Math.max(...data, 60);
    const padding = 15;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Get Theme Color
    let themeColor = userConfig.effectColor || userConfig.particleColor || '#ffd700';

    const points = data.map((val, i) => {
        return {
            x: padding + (i / (data.length - 1)) * graphWidth,
            y: height - padding - (val / maxVal) * graphHeight
        };
    });

    // Draw Smooth Curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        // Quadratic Bezier to midpoint for smoothness
        const cpX = (p0.x + p1.x) / 2;
        // Actually, standard smoothing: use control point as p0? No.
        // Simple smoothing: Curve from p0 to midpoint of p0-p1?
        // Better: Curve to midpoints.
        if (i === 0) {
            ctx.lineTo(p0.x, p0.y);
        }
        ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    // Connect to last point
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = themeColor;

    // Add Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = themeColor;
    ctx.stroke();

    // Reset shadow for fill
    ctx.shadowBlur = 0;

    // Fill Gradient
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, hexToRgba(themeColor, 0.5));
    grad.addColorStop(1, hexToRgba(themeColor, 0.0));
    ctx.fillStyle = grad;
    ctx.fill();
}

// Helper for hex to rgba
function hexToRgba(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    return `rgba(255, 215, 0, ${alpha})`; // fallback gold
}

window.addEventListener('resize', updateCaretPosition);

// ══════════════════════════════════════════════════════════
// SETTINGS TAB LOGIC (Explicit Handling)
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching
    const tabs = document.querySelectorAll('.settings-tab');
    const panes = document.querySelectorAll('.tab-pane');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Activate clicked
                tab.classList.add('active');

                // Show Pane
                const targetId = `tab-${tab.dataset.tab}`;
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // 2. Profile Color Logic
    const primaryInput = document.getElementById('profile-primary-input');
    const primaryPicker = document.getElementById('profile-primary-picker');
    const primaryPreview = document.getElementById('profile-primary-preview');

    const accentInput = document.getElementById('profile-accent-input');
    const accentPicker = document.getElementById('profile-accent-picker');
    const accentPreview = document.getElementById('profile-accent-preview');

    // Sync Helper
    function setupColorSync(textInput, picker, preview, onChange) {
        if (!textInput || !picker || !preview) return;

        // Click preview to open picker
        preview.addEventListener('click', () => picker.click());

        // Picker Change
        picker.addEventListener('input', (e) => {
            const val = e.target.value;
            textInput.value = val;
            preview.style.background = val;
            if (onChange) onChange(val);
        });

        // Text Input Change
        textInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.startsWith('#') && val.length === 7) {
                picker.value = val;
                preview.style.background = val;
                if (onChange) onChange(val);
            }
        });
    }

    // Update Custom Button Border
    function updateCustomBorder(color) {
        const customBtn = document.getElementById('profile-mode-custom');
        if (customBtn) {
            customBtn.style.setProperty('--btn-active-color', color);
            // Optional: Update shadow/background tint too for full effect
            customBtn.style.boxShadow = `0 0 20px ${hexToRgba(color, 0.2)}`;
            customBtn.style.background = hexToRgba(color, 0.05);
        }
    }

    setupColorSync(primaryInput, primaryPicker, primaryPreview, updateCustomBorder);
    setupColorSync(accentInput, accentPicker, accentPreview);

    // Glow Inputs
    const glowPrimaryInput = document.getElementById('profile-glow-primary-input');
    const glowPrimaryPicker = document.getElementById('profile-glow-primary-picker');
    const glowPrimaryPreview = document.getElementById('profile-glow-primary-preview');


    setupColorSync(glowPrimaryInput, glowPrimaryPicker, glowPrimaryPreview);


    // Apply Theme Function
    function applyProfileTheme(theme, targetElement = null) {
        // Fix: Use targetElement if provided (for public profiles), else global root
        const root = targetElement || document.documentElement;

        // Default Colors
        const defPrimary = '#ffd700';
        const defAccent = '#ffb800';
        const defGlowPrimary = 'rgba(255, 215, 0, 0.15)';


        if (theme.mode === 'custom') {
            root.style.setProperty('--profile-primary', theme.primary || defPrimary);
            root.style.setProperty('--profile-accent', theme.accent || defAccent);
            root.style.setProperty('--profile-glow-primary', theme.glowPrimary || defGlowPrimary);

        } else {
            // Default Mode
            root.style.setProperty('--profile-primary', defPrimary);
            root.style.setProperty('--profile-accent', defAccent);
            root.style.setProperty('--profile-glow-primary', defGlowPrimary);

        }
    }

    // Save Button
    const saveBtn = document.getElementById('save-profile-theme-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const primary = primaryInput ? primaryInput.value : '#ffd700';
            const accent = accentInput ? accentInput.value : '#ffb800';
            const glowPrimary = glowPrimaryInput ? glowPrimaryInput.value : 'rgba(255, 215, 0, 0.15)';


            // Check active mode
            const activeBtn = document.querySelector('.layout-btn.active');
            let mode = 'default';
            if (activeBtn && activeBtn.id === 'profile-mode-custom') {
                mode = 'custom';
            }

            // Save to LocalStorage
            const themeData = {
                primary: primary,
                accent: accent,
                glowPrimary: glowPrimary,

                mode: mode
            };
            localStorage.setItem('zenType_profileTheme', JSON.stringify(themeData));

            // Apply Immediately
            if (window.applyProfileTheme) window.applyProfileTheme(themeData);

            // Save to Cloud (Supabase)
            console.log("DEBUG: script.js - Attempting to save theme:", themeData);
            if (window.saveUserTheme) {
                console.log("DEBUG: script.js - Found saveUserTheme, calling it...");
                window.saveUserTheme(themeData);
            } else {
                console.error("DEBUG: script.js - window.saveUserTheme is UNDEFINED!");
                alert("Error: Could not save to cloud. Refresh and try again.");
            }

            // Visual Feedback
            saveBtn.innerHTML = '<i class="ri-check-line"></i> Saved!';
            setTimeout(() => {
                saveBtn.innerHTML = '<i class="ri-save-line"></i> Save Theme';
            }, 2000);
        });
    }

    // Layout Toggle
    const layoutBtns = document.querySelectorAll('.layout-btn');
    const customOptions = document.getElementById('profile-custom-options');

    function toggleCustomInputs(isCustom) {
        if (!customOptions) return;
        if (isCustom) {
            customOptions.style.opacity = '1';
            customOptions.style.pointerEvents = 'auto';
        } else {
            customOptions.style.opacity = '0.5';
            customOptions.style.pointerEvents = 'none';
        }
    }

    layoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            layoutBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Unlock inputs if Custom is selected
            toggleCustomInputs(btn.id === 'profile-mode-custom');
        });
    });

    // Load Defaults on Start
    const savedTheme = JSON.parse(localStorage.getItem('zenType_profileTheme')) || { mode: 'default', primary: '#ffd700', accent: '#ffb800' };

    // Set Inputs
    if (primaryInput) {
        primaryInput.value = savedTheme.primary;
        primaryPicker.value = savedTheme.primary;
        primaryPreview.style.background = savedTheme.primary;
        // Init Border
        updateCustomBorder(savedTheme.primary);
    }
    if (accentInput) {
        accentInput.value = savedTheme.accent;
        accentPicker.value = savedTheme.accent;
        accentPreview.style.background = savedTheme.accent;
    }
    if (glowPrimaryInput) {
        const val = savedTheme.glowPrimary || 'rgba(255, 215, 0, 0.15)';
        glowPrimaryInput.value = val;
        // Picker only supports hex, so we don't set it if it's rgba
        if (val.startsWith('#')) glowPrimaryPicker.value = val;
        glowPrimaryPreview.style.background = val;
    }


    // Set Active Button
    layoutBtns.forEach(b => b.classList.remove('active'));
    const targetId = savedTheme.mode === 'custom' ? 'profile-mode-custom' : 'profile-mode-default';
    const targetBtn = document.getElementById(targetId);
    if (targetBtn) targetBtn.classList.add('active');

    // Quick Palettes
    const palettePresets = document.querySelectorAll('.palette-preset');
    if (palettePresets) {
        palettePresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const pColor = preset.getAttribute('data-primary');
                const aColor = preset.getAttribute('data-accent');

                // Set Inputs
                if (primaryInput && primaryPicker && primaryPreview) {
                    primaryInput.value = pColor;
                    primaryPicker.value = pColor;
                    primaryPreview.style.background = pColor;
                    // Trigger live update
                    if (updateCustomBorder) updateCustomBorder(pColor);
                }

                if (accentInput && accentPicker && accentPreview) {
                    accentInput.value = aColor;
                    accentPicker.value = aColor;
                    accentPreview.style.background = aColor;
                }

                // Force Switch to Custom
                const customBtn = document.getElementById('profile-mode-custom');
                if (customBtn) customBtn.click();
            });
        });
    }

    // Apply CSS
    if (window.applyProfileTheme) {
        window.applyProfileTheme(savedTheme);
    }

});

// ══════════════════════════════════════════════════════════
// GLOBAL THEME UTILS
// ══════════════════════════════════════════════════════════
window.applyProfileTheme = function (theme, targetElement = null) {
    // If targetElement is provided, we use it. Otherwise, global root.
    const root = targetElement || document.documentElement;

    // Default Colors (Gold/Orange)
    const defPrimary = '#ffd700';
    const defAccent = '#ffb800';
    const defGlowPrimary = 'rgba(255, 215, 0, 0.15)';
    const defGlowAccent = 'rgba(255, 215, 0, 0.05)';

    // Helper: deciding values
    let primary, accent, glowPrimary;

    if (theme && theme.mode === 'custom') {
        primary = theme.primary || defPrimary;
        accent = theme.accent || defAccent;
        glowPrimary = theme.glowPrimary || defGlowPrimary;
    } else {
        primary = defPrimary;
        accent = defAccent;
        glowPrimary = defGlowPrimary;
    }

    // Apply
    root.style.setProperty('--profile-primary', primary);
    root.style.setProperty('--profile-accent', accent);
    root.style.setProperty('--profile-glow-primary', glowPrimary);
};

// --- DISABLE DEV TOOLS & CONTEXT MENU ---
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', event => {
    if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) ||
        (event.ctrlKey && event.key === 'U')
    ) {
        event.preventDefault();
    }
});

