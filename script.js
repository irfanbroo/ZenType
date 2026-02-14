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
        id: 'apt_cut',
        isVideo: true,
        category: 'styles',
        categories: ['styles', 'aesthetic-videos'],
        url: 'videos/apt_cut.mp4',
        thumb: 'videos/thumbs/apt_cut.png',
        opacity: 15,
        // Preset Effects
        effectType: 'snow',
        effectColor: '#ff6bca',
        effectIntensity: 77,
        tint: 'dark',
        soundProfile: 'typewriter',
        particleColor: '#ff6bca',
        caretColor: '#ff6bca',
        wordPoolId: 1,
        linkedTrackUrl: 'https://soundcloud.com/irfan-s-761237717/apt'
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

// --- 2. SOUND ENGINE (Web Audio API) ---

let audioCtx = null;
let soundEnabled = true;
let noiseBuffer = null;
let currentBgAudio = null; // Track separate audio file for wallpapers
let masterAudio = new Audio();
let masterPlaylist = [
    { url: '', name: 'No Track', type: 'none' },
    { url: 'https://soundcloud.com/irfan-s-761237717/akatsuki-no-requiem', name: 'Akatsuki no Requiem', type: 'soundcloud' },
    { url: 'https://soundcloud.com/law_xvm/boa-duvet-good-quality-slowed', name: 'Bôa - Duvet', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/crossing-fields-but-guess-what-its-lofi', name: 'Crossing Fields', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/blue-bird-but-is-it-okay-if-its-lofi', name: 'Blue Bird', type: 'soundcloud' },
    { url: 'https://soundcloud.com/ziad-a-mahmoud/interstellar-main-theme-extra-extended-soundtrack-by-hans-zimmer', name: 'Interstellar Main Theme', type: 'soundcloud' },
    { url: 'https://soundcloud.com/alex196-753703305/black-clover-ost-black-rover', name: 'Black Clover Ost Black Rover', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/uso-but-guess-what-its-lofi', name: 'USO', type: 'soundcloud' },
    { url: 'https://soundcloud.com/myabandonedhome/snowfall-w-oneheart', name: 'Snowfall', type: 'soundcloud' },
    { url: 'https://soundcloud.com/user-722231447/20250204_184406191-m4r', name: 'Call Of Silence', type: 'soundcloud' },
    { url: 'https://soundcloud.com/shardzoestuff/kimi-no-na-wa-nandemonaiya-mitsuha-ver', name: 'Nandemonaiya (Mitsuha ver.)', type: 'soundcloud' },
    { url: 'https://soundcloud.com/nightbot-59011134/sparkle-your-name-kimi-no-na-wa-piano-radwimps', name: 'Sparkle - Piano', type: 'soundcloud' },
    { url: 'https://soundcloud.com/irfan-s-761237717/akuma-no-ko', name: 'Akuma no Ko', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/hikaru-nara-but-is-it-okay-if-its-lofi', name: 'Hikaru Nara', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/kamado-tanjiro-no-uta-but-guess-what-its-lofi', name: 'Kamado Tanjiro No Uta', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/black-catcher-but-guess-what-its-lofi', name: 'Black Catcher', type: 'soundcloud' },
    { url: 'https://soundcloud.com/kijugo/lost-in-paradise-but-is-it-okay-if-its-lofi', name: 'Lost In Paradise', type: 'soundcloud' },
    { url: 'https://soundcloud.com/yukinchi/everlasting-shine-black-cloverbut-a-lofi-remix', name: 'Everlasting Shine', type: 'soundcloud' },
    { url: 'https://soundcloud.com/user-862370001/chubina-edit-audio', name: 'Chubina', type: 'soundcloud' },
    { url: 'https://soundcloud.com/eternityfounddead/stellar', name: 'Stellar', type: 'soundcloud' },
    { url: 'https://soundcloud.com/cadred/zenzenzense-lofi', name: 'Zenzenzense Lofi', type: 'soundcloud' },
    { url: 'https://soundcloud.com/txrtaa/zen-zen-zense', name: 'Zen Zen Zense', type: 'soundcloud' },
    { url: 'https://soundcloud.com/maki-chill/suzume-lofi-cover', name: 'Suzume lofi', type: 'soundcloud' },
    { url: 'https://soundcloud.com/irfan-s-761237717/apt', name: 'APT', type: 'soundcloud' }
];

// SoundCloud Widget Interface
let scWidget = null;
let currentSCUrl = 'https://soundcloud.com/user-722231447/20250204_184406191-m4r';
let currentTrackIndex = 0;
let pendingTrackIndex = null;

window.addEventListener('load', () => {
    const iframe = document.getElementById('sc-widget');
    if (iframe) {
        scWidget = SC.Widget(iframe);
        scWidget.bind(SC.Widget.Events.READY, () => {
            console.log('SoundCloud Widget Ready');
            scWidget.setVolume(userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50);

            // Play pending track if any (e.g. from initTheme with APT wallpaper)
            if (pendingTrackIndex !== null) {
                console.log("Playing pending track:", pendingTrackIndex);
                playSpecificMasterTrack(pendingTrackIndex);
                pendingTrackIndex = null;
            }
        });
        scWidget.bind(SC.Widget.Events.FINISH, () => {
            // Loop the current track
            scWidget.seekTo(0);
            scWidget.play();
        });
    }
});

function initTrackSelector() {
    const selector = document.getElementById('track-selector');
    const list = document.getElementById('track-list');
    const currentName = document.getElementById('current-track-name');

    list.innerHTML = '';
    masterPlaylist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'track-item';

        // Check if this track is the currently playing one
        // Default to "No Track" (index 0) if nothing is playing
        if (index === 0 && masterAudio.paused && (!scWidget || !currentSCUrl)) {
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
        if (scWidget) scWidget.pause();
        masterAudio.pause();
        // Update UI
        document.getElementById('current-track-name').innerText = track.name;
        document.querySelectorAll('.track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        document.getElementById('current-track-name').classList.remove('track-loading');
        return;
    }

    // Handle SoundCloud
    if (track.type === 'soundcloud') {
        if (!scWidget) {
            // Widget not ready yet, queue it
            console.log("Widget not ready, queuing track:", index);
            pendingTrackIndex = index;
            return;
        }

        // Pause local audio
        masterAudio.pause();

        // Play SC
        // SHOW LOADING INDICATOR
        const trackNameEl = document.getElementById('current-track-name');

        // Immediately update UI to show we selected this track
        document.querySelectorAll('.track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        trackNameEl.innerHTML = "LOADING";
        trackNameEl.classList.add('track-loading');

        // Helper to clear loading state
        const clearLoading = () => {
            // Verify we are still playing the SAME track we started loading
            if (currentTrackIndex === index) {
                const trackNameEl = document.getElementById('current-track-name');
                if (trackNameEl) {
                    trackNameEl.innerText = track.name;
                    trackNameEl.classList.remove('track-loading');
                }
            }
        };

        // Bind clearLoading to PLAY/PROGRESS event
        // We unbind first to avoid stacking listeners if possible, but SC widget API doesn't make unbinding easy by event name only?
        // actually scWidget.unbind(SC.Widget.Events.PLAY) works if we pass the same function reference, but we are creating new functions each time.
        // It's better to just rely on the race-condition check inside clearLoading or just use one permanent listener that checks state.
        // For now, let's just add it, but maybe we should rely on the `callback` of load() and a timeout.

        // Safety fallback: If it doesn't play in 8 seconds, clear loading
        setTimeout(clearLoading, 8000);

        if (currentSCUrl === track.url) {
            scWidget.play();
            scWidget.setVolume(userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50);
            // If it was already loaded, it might play fast.
            setTimeout(clearLoading, 1000);
        } else {
            scWidget.load(track.url, {
                auto_play: true,
                show_artwork: false,
                callback: function () {
                    scWidget.setVolume(userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50);
                    // Explicitly try to play again to be sure
                    scWidget.play();
                    // Clear loading text shortly after load finishes
                    setTimeout(clearLoading, 1000);
                }
            });
            currentSCUrl = track.url;
        }
    } else {
        // Handle Local Audio
        if (scWidget) scWidget.pause();

        masterAudio.src = track.url + "?t=" + Date.now(); // Cache bust if needed, or just normal
        masterAudio.volume = (userConfig.bgVolume !== undefined ? userConfig.bgVolume : 50) / 100;

        if (soundEnabled) {
            masterAudio.muted = false;
            masterAudio.play().catch(e => console.log("Manual track play failed:", e));
        }

        // Update UI
        document.getElementById('current-track-name').innerText = track.name;
        document.getElementById('current-track-name').classList.remove('track-loading');
        document.querySelectorAll('.track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
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
}

// Helper: create a filtered noise burst (simulates physical impact)
function createNoiseBurst(t, duration, volume, filterFreq, filterQ, filterType = 'bandpass') {
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
}

// Helper: subtle per-keypress randomization for natural variation
function rng(base, variance) {
    return base + (Math.random() - 0.5) * 2 * variance;
}

function playKeySound(correct) {
    if (!soundEnabled || !audioCtx) return;
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
            const size = (1 - s.z / canvas.width) * 3;
            const opacity = (1 - s.z / canvas.width) * Math.min(intensity, 1.3);

            const trailZ = s.z + 20;
            const prevSx = (s.x / trailZ) * 300 + cx;
            const prevSy = (s.y / trailZ) * 300 + cy;
            ctx.beginPath(); ctx.moveTo(prevSx, prevSy); ctx.lineTo(sx, sy);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
            ctx.lineWidth = size * 0.6; ctx.stroke();

            ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
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
    // Support Modal
    const supportBtn = document.querySelector('.support-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportBtn = document.getElementById('close-support');

    if (supportBtn && supportModal) {
        supportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            supportModal.classList.remove('hidden');
        });
    }

    if (closeSupportBtn && supportModal) {
        closeSupportBtn.addEventListener('click', () => {
            supportModal.classList.add('hidden');
        });
    }

    if (supportModal) {
        supportModal.addEventListener('click', (e) => {
            if (e.target === supportModal) {
                supportModal.classList.add('hidden');
            }
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