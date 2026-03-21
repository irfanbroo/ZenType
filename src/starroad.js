// ══════════════════════════════════════════════════════════
// STAR ROAD — Falling Notes Rhythm Game
// DOM notes with CSS border-style: double (gpop.io technique)
// ══════════════════════════════════════════════════════════

const LANE_KEYS = ['a', 's', 'd', 'f'];
const LANE_LABELS = ['A', 'S', 'D', 'F'];
const LANE_COUNT = 4;

const PERFECT_WINDOW = 50;
const GREAT_WINDOW   = 100;
const GOOD_WINDOW    = 150;
const PERFECT_PTS = 300;
const GREAT_PTS   = 200;
const GOOD_PTS    = 100;

const SPEED_MAP = { slow: 280, normal: 420, fast: 620 };

// ── State ──────────────────────────────────────────────────
let srState = {
    notes: [], score: 0, combo: 0, maxCombo: 0,
    perfects: 0, greats: 0, goods: 0, misses: 0, totalNotes: 0,
    isActive: false, speed: 'normal', noteSpeed: SPEED_MAP.normal,
    nextNoteId: 0, spawnTimer: null, animFrame: null, lastFrame: 0,
    ytPlayer: null, ytReady: false, ytDuration: 0, videoId: null,
};

// Starfield
let stars = [], starCanvas = null, starCtx = null, starFrame = null;
let splashStars = [], splashCanvas = null, splashCtx = null, splashFrame = null;

// ── YouTube ────────────────────────────────────────────────
function extractVideoId(url) {
    if (!url) return null;
    let m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    return null;
}

function loadYouTubeAPI() {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) { resolve(); return; }
        if (document.getElementById('yt-iframe-api')) {
            const check = setInterval(() => { if (window.YT && window.YT.Player) { clearInterval(check); resolve(); } }, 100);
            return;
        }
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => resolve();
    });
}

function createYTPlayer(videoId) {
    return new Promise((resolve) => {
        const c = document.getElementById('sr-yt-visible');
        if (c) c.innerHTML = '';
        const d = document.createElement('div');
        d.id = 'sr-yt-player';
        if (c) c.appendChild(d); else document.body.appendChild(d);
        srState.ytPlayer = new YT.Player('sr-yt-player', {
            width: 280, height: 158, videoId,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { autoplay: 1, controls: 1, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
            events: {
                onReady: (e) => { srState.ytReady = true; srState.ytDuration = e.target.getDuration(); e.target.setVolume(80); e.target.playVideo(); resolve(); },
                onStateChange: (e) => { if (e.data === 0 && srState.isActive) endGame(); },
            },
        });
    });
}

function destroyYTPlayer() {
    if (srState.ytPlayer) { try { srState.ytPlayer.stopVideo(); srState.ytPlayer.destroy(); } catch (_) {} srState.ytPlayer = null; }
    srState.ytReady = false;
    const c = document.getElementById('sr-yt-visible');
    if (c) c.innerHTML = '';
}

// ── Starfield — STATIC bright white pixel squares (like gpop game bg) ──
function drawStaticStars(canvas, ctx, count) {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const size = [1, 1, 1, 2, 2, 2, 3, 3, 4][Math.floor(Math.random() * 9)];
        const bright = Math.floor(Math.random() * 120 + 136); // 136-255
        ctx.fillStyle = `rgb(${bright},${bright},${bright})`;
        ctx.fillRect(x, y, size, size);
    }
}

function initStarfield() {
    starCanvas = document.getElementById('starroad-bg-canvas');
    if (!starCanvas) return;
    starCtx = starCanvas.getContext('2d');
    drawStaticStars(starCanvas, starCtx, 300);
}
function destroyStarfield() { starCanvas = null; starCtx = null; }

function initSplashStarfield() {
    splashCanvas = document.getElementById('starroad-splash-canvas');
    if (!splashCanvas) return;
    splashCtx = splashCanvas.getContext('2d');
    drawStaticStars(splashCanvas, splashCtx, 250);
}
function destroySplashStarfield() { splashCanvas = null; splashCtx = null; }

// ── Dancer — gpop Gbob-style pixel mascot ──────────────────
// 16x22 pixel art drawn on canvas, scaled up via CSS image-rendering: pixelated
// Directional: reacts to which lane is pressed (lean/reach left/right)
const DANCER_FRAMES = {};
const DANCER_PALETTE = [
    '#ffffff', // 0: W - white body
    '#2a2a3a', // 1: O - dark outline
    '#1a1a2e', // 2: E - eyes
    '#ffd700', // 3: G - crown gold
    '#ff4466', // 4: R - crown gem / heart
    '#ffaaaa', // 5: B - blush cheeks
    '#ddddee', // 6: S - body shadow
    '#aaaacc', // 7: A - arm/limb
];

function buildDancerFrames() {
    const O = 1, W = 0, E = 2, G = 3, R = 4, B = 5, S = 6, A = 7, _ = -1;

    // IDLE — standing center, legs together
    DANCER_FRAMES.idle = [
        [_, _, _, _, _, G, G, G, G, G, G, _, _, _, _, _],
        [_, _, _, _, G, G, R, G, G, R, G, G, _, _, _, _],
        [_, _, _, _, _, G, G, G, G, G, G, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, E, W, W, E, W, W, O, _, _, _],
        [_, _, _, O, W, B, W, W, W, W, B, W, O, _, _, _],
        [_, _, _, O, W, W, W, O, O, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, R, R, W, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, A, O, _, O, S, S, S, S, O, _, O, A, _, _],
        [_, _, A, _, _, _, O, S, S, O, _, _, _, A, _, _],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, O, O, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, O, _, _, O, W, W, O, _, _, _],
        [_, _, _, O, O, O, _, _, _, _, O, O, O, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // LEAN LEFT — head/body tilt left, left leg steps out (lane 1 = S)
    DANCER_FRAMES.leanLeft = [
        [_, _, _, _, G, G, G, G, G, G, _, _, _, _, _, _],
        [_, _, _, G, G, R, G, G, R, G, G, _, _, _, _, _],
        [_, _, _, _, G, G, G, G, G, G, _, _, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, _, O, W, W, E, W, W, E, W, W, O, _, _, _, _],
        [_, _, O, W, B, W, W, W, W, B, W, O, _, _, _, _],
        [_, _, O, W, W, W, O, O, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, O, _, _, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, _, O, W, W, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, O, W, W, W, R, R, W, W, W, O, _, _, _, _],
        [_, _, O, W, W, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, A, O, _, O, S, S, S, S, O, _, O, A, _, _, _],
        [_, A, _, _, _, O, S, S, O, _, _, _, A, _, _, _],
        [_, _, _, _, O, W, W, W, W, O, _, _, _, _, _, _],
        [_, _, _, O, W, W, O, O, W, W, O, _, _, _, _, _],
        [_, _, O, W, W, O, _, _, O, W, W, O, _, _, _, _],
        [_, _, O, O, O, _, _, _, _, O, O, O, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // LEAN RIGHT — head/body tilt right, right leg steps out (lane 2 = D)
    DANCER_FRAMES.leanRight = [
        [_, _, _, _, _, _, G, G, G, G, G, G, _, _, _, _],
        [_, _, _, _, _, G, G, R, G, G, R, G, G, _, _, _],
        [_, _, _, _, _, _, G, G, G, G, G, G, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, E, W, W, E, W, W, O, _, _],
        [_, _, _, _, O, W, B, W, W, W, W, B, W, O, _, _],
        [_, _, _, _, O, W, W, W, O, O, W, W, W, O, _, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, _, _, O, W, W, W, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, W, W, O, _, _],
        [_, _, _, _, O, W, W, W, R, R, W, W, W, O, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, W, W, O, _, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, A, O, _, O, S, S, S, S, O, _, O, A, _],
        [_, _, _, A, _, _, _, O, S, S, O, _, _, _, A, _],
        [_, _, _, _, _, _, O, W, W, W, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, O, O, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, O, _, _, O, W, W, O, _, _],
        [_, _, _, _, O, O, O, _, _, _, _, O, O, O, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // REACH LEFT — arm extends far left (lane 0 = A)
    DANCER_FRAMES.reachLeft = [
        [_, _, _, G, G, G, G, G, G, _, _, _, _, _, _, _],
        [_, _, G, G, R, G, G, R, G, G, _, _, _, _, _, _],
        [_, _, _, G, G, G, G, G, G, _, _, _, _, _, _, _],
        [_, _, O, W, W, W, W, W, W, O, _, _, _, _, _, _],
        [_, O, W, W, E, W, W, E, W, W, O, _, _, _, _, _],
        [_, O, W, B, W, W, W, W, B, W, O, _, _, _, _, _],
        [_, O, W, W, W, O, O, W, W, W, O, _, _, _, _, _],
        [_, _, O, W, W, W, W, W, W, O, _, _, _, _, _, _],
        [_, _, _, O, W, W, W, W, O, _, _, _, _, _, _, _],
        [_, _, O, W, W, W, W, W, W, O, _, _, _, _, _, _],
        [_, O, W, W, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, O, W, W, W, R, R, W, W, W, O, _, _, _, _, _],
        [A, O, W, W, W, W, W, W, W, W, O, _, _, _, _, _],
        [_, A, O, W, W, W, W, W, W, O, _, _, _, _, _, _],
        [_, _, A, _, O, S, S, S, S, O, _, O, A, _, _, _],
        [_, _, _, _, _, O, S, S, O, _, _, _, A, _, _, _],
        [_, _, _, _, O, W, W, W, W, O, _, _, _, _, _, _],
        [_, _, _, O, W, W, O, O, W, W, O, _, _, _, _, _],
        [_, O, W, W, O, _, _, _, O, W, W, O, _, _, _, _],
        [_, O, O, O, _, _, _, _, _, O, O, O, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // REACH RIGHT — arm extends far right (lane 3 = F)
    DANCER_FRAMES.reachRight = [
        [_, _, _, _, _, _, _, G, G, G, G, G, G, _, _, _],
        [_, _, _, _, _, _, G, G, R, G, G, R, G, G, _, _],
        [_, _, _, _, _, _, _, G, G, G, G, G, G, _, _, _],
        [_, _, _, _, _, _, O, W, W, W, W, W, W, O, _, _],
        [_, _, _, _, _, O, W, W, E, W, W, E, W, W, O, _],
        [_, _, _, _, _, O, W, B, W, W, W, W, B, W, O, _],
        [_, _, _, _, _, O, W, W, W, O, O, W, W, W, O, _],
        [_, _, _, _, _, _, O, W, W, W, W, W, W, O, _, _],
        [_, _, _, _, _, _, _, O, W, W, W, W, O, _, _, _],
        [_, _, _, _, _, _, O, W, W, W, W, W, W, O, _, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, W, W, O, _],
        [_, _, _, _, _, O, W, W, W, R, R, W, W, W, O, _],
        [_, _, _, _, _, O, W, W, W, W, W, W, W, W, O, A],
        [_, _, _, _, _, _, O, W, W, W, W, W, W, O, A, _],
        [_, _, _, A, O, _, O, S, S, S, S, O, _, A, _, _],
        [_, _, _, A, _, _, _, O, S, S, O, _, _, _, _, _],
        [_, _, _, _, _, _, O, W, W, W, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, O, O, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, O, _, _, _, O, W, W, O, _],
        [_, _, _, _, O, O, O, _, _, _, _, _, O, O, O, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // BOTH ARMS — arms reaching both sides (A+F, A+D, S+F, or 3+ keys)
    DANCER_FRAMES.bothArms = [
        [_, _, _, _, _, G, G, G, G, G, G, _, _, _, _, _],
        [_, _, _, _, G, G, R, G, G, R, G, G, _, _, _, _],
        [_, _, _, _, _, G, G, G, G, G, G, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, E, W, W, E, W, W, O, _, _, _],
        [_, _, _, O, W, B, W, W, W, W, B, W, O, _, _, _],
        [_, _, _, O, W, W, O, W, W, O, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, R, R, W, W, W, O, _, _, _],
        [A, _, _, O, W, W, W, W, W, W, W, W, O, _, _, A],
        [_, A, _, _, O, W, W, W, W, W, W, O, _, _, A, _],
        [_, _, A, _, _, O, S, S, S, S, O, _, _, A, _, _],
        [_, _, _, _, _, _, O, S, S, O, _, _, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, O, O, W, W, O, _, _, _, _],
        [_, O, W, W, O, _, _, _, _, _, O, W, W, O, _, _],
        [_, O, O, O, _, _, _, _, _, _, _, O, O, O, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // MISS — sad, droopy
    DANCER_FRAMES.miss = [
        [_, _, _, _, _, _, G, G, G, G, G, G, _, _, _, _],
        [_, _, _, _, _, G, G, R, G, G, R, G, G, _, _, _],
        [_, _, _, _, _, _, G, G, G, G, G, G, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, O, W, W, O, W, W, O, _, _, _],
        [_, _, _, O, W, W, E, W, W, E, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, O, W, W, O, W, O, _, _, _, _],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, O, W, W, W, W, W, W, W, W, O, _, _, _],
        [_, _, _, _, O, W, W, W, W, W, W, O, _, _, _, _],
        [_, A, _, O, _, O, S, S, S, S, O, _, O, _, A, _],
        [A, _, _, _, _, _, O, S, S, O, _, _, _, _, _, A],
        [_, _, _, _, _, O, W, W, W, W, O, _, _, _, _, _],
        [_, _, _, _, O, W, W, O, O, W, W, O, _, _, _, _],
        [_, _, _, O, W, W, O, _, _, O, W, W, O, _, _, _],
        [_, _, _, O, O, O, _, _, _, _, O, O, O, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];
}

let dancerState = 'idle';
let dancerTimer = null;
let dancerKeysHeld = new Set(); // track which lanes are currently held

function drawDancerFrame(frameData, canvas) {
    if (!canvas || !frameData) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 16, 22);
    for (let row = 0; row < frameData.length; row++) {
        for (let col = 0; col < frameData[row].length; col++) {
            const ci = frameData[row][col];
            if (ci === -1) continue;
            ctx.fillStyle = DANCER_PALETTE[ci];
            ctx.fillRect(col, row, 1, 1);
        }
    }
}

function setDancerPose(frameName) {
    const canvas = document.getElementById('sr-dancer-canvas');
    const glow = document.getElementById('sr-dancer-glow');
    const frame = DANCER_FRAMES[frameName];
    if (!frame) return;
    drawDancerFrame(frame, canvas);
    if (glow) drawDancerFrame(frame, glow);
}

// Pick the right frame based on ALL currently held keys
function getDancerPoseFromKeys() {
    const hasA = dancerKeysHeld.has(0); // far left
    const hasS = dancerKeysHeld.has(1); // mid left
    const hasD = dancerKeysHeld.has(2); // mid right
    const hasF = dancerKeysHeld.has(3); // far right
    const hasLeft = hasA || hasS;
    const hasRight = hasD || hasF;

    // Both sides pressed → both arms out
    if (hasLeft && hasRight) return 'bothArms';
    // Left side only
    if (hasA) return 'reachLeft';
    if (hasS) return 'leanLeft';
    // Right side only
    if (hasF) return 'reachRight';
    if (hasD) return 'leanRight';
    return 'idle';
}

function initDancer() {
    buildDancerFrames();
    dancerKeysHeld.clear();
    setDancerPose('idle');
    dancerState = 'idle';
}

// Called on keydown — dancer poses based on all held keys
function dancerKeyDown(lane) {
    dancerKeysHeld.add(lane);
    if (dancerState === 'miss') return;
    setDancerPose(getDancerPoseFromKeys());
}

// Called on keyup — update pose based on remaining held keys
function dancerKeyUp(lane) {
    dancerKeysHeld.delete(lane);
    if (dancerState === 'miss') return;
    setDancerPose(getDancerPoseFromKeys());
}

function dancerReact(type) {
    const area = document.getElementById('sr-dancer-area');
    if (!area) return;

    if (dancerTimer) clearTimeout(dancerTimer);
    area.classList.remove('sr-dancer-hit', 'sr-dancer-miss');

    if (type === 'hit') {
        area.classList.add('sr-dancer-hit');
        dancerState = 'hit';
        dancerTimer = setTimeout(() => {
            area.classList.remove('sr-dancer-hit');
            dancerState = 'idle';
        }, 200);
    } else if (type === 'miss') {
        setDancerPose('miss');
        area.classList.add('sr-dancer-miss');
        dancerState = 'miss';
        dancerTimer = setTimeout(() => {
            area.classList.remove('sr-dancer-miss');
            dancerState = 'idle';
            // Restore pose based on all held keys
            setDancerPose(getDancerPoseFromKeys());
        }, 400);
    }

    updateDancerGlow();
}

function updateDancerGlow() {
    const area = document.getElementById('sr-dancer-area');
    if (!area) return;
    area.classList.remove('sr-dancer-glow', 'sr-dancer-rainbow');
    if (srState.combo >= 30) {
        area.classList.add('sr-dancer-rainbow');
    } else if (srState.combo >= 10) {
        area.classList.add('sr-dancer-glow');
    }
}

// ── Note Spawner ───────────────────────────────────────────
function startSpawner() {
    if (srState.spawnTimer) clearInterval(srState.spawnTimer);
    let lastLane = -1;
    srState.spawnTimer = setInterval(() => {
        if (!srState.isActive) return;
        if (Math.random() < 0.6) {
            let lane;
            do { lane = Math.floor(Math.random() * LANE_COUNT); } while (lane === lastLane && Math.random() < 0.6);
            lastLane = lane;
            spawnNote(lane, Math.random() < 0.15);
        }
        if (Math.random() < 0.1) {
            const l2 = Math.floor(Math.random() * LANE_COUNT);
            if (l2 !== lastLane) spawnNote(l2);
        }
    }, 600);
}

function spawnNote(lane, isHold = false) {
    const container = document.getElementById('sr-notes-container');
    if (!container) return;

    const NOTE_H = 28; // gpop exact note height
    const holdH = isHold ? (120 + Math.floor(Math.random() * 100)) : 0;
    const noteH = isHold ? holdH + NOTE_H : NOTE_H;

    const note = {
        id: srState.nextNoteId++, lane, y: -noteH,
        hit: false, missed: false,
        hold: isHold, holdHeight: holdH, holding: false, holdComplete: false,
        el: null, noteH,
    };

    const el = document.createElement('div');
    el.className = `sr-note sr-note-${LANE_KEYS[lane]}${isHold ? ' sr-note-hold' : ''}`;
    el.style.height = noteH + 'px';
    el.style.top = note.y + 'px';
    el.dataset.lane = lane;

    // Letter at the bottom for hold notes, centered for tap
    const txt = document.createElement('span');
    txt.className = 'sr-note-letter';
    txt.textContent = LANE_LABELS[lane];
    el.appendChild(txt);

    // Position in correct lane column
    el.style.left = `calc(${lane} * var(--sr-lane-w) + var(--sr-lanes-left))`;

    container.appendChild(el);
    note.el = el;
    srState.notes.push(note);
    srState.totalNotes++;
}

function stopSpawner() { if (srState.spawnTimer) { clearInterval(srState.spawnTimer); srState.spawnTimer = null; } }

// ── Game Loop ──────────────────────────────────────────────
function gameLoop(now) {
    if (!srState.isActive) return;
    const dt = srState.lastFrame ? (now - srState.lastFrame) / 1000 : 0.016;
    srState.lastFrame = now;

    const gameArea = document.getElementById('sr-game-area');
    if (!gameArea) return;
    const hitLineY = gameArea.offsetHeight * 0.55;
    const missThreshold = hitLineY + GOOD_WINDOW * (srState.noteSpeed / 1000) + 40;

    for (const note of srState.notes) {
        // Move notes — but NOT ones being held (they anchor at hit zone)
        if (!note.missed && !(note.hold && note.holding)) {
            note.y += srState.noteSpeed * dt;
            if (note.el) note.el.style.top = note.y + 'px';
        }

        // Skip missed notes, but let hit notes keep falling (for fade animation)
        if (note.missed) continue;
        if (note.hit && !note.holding && !note.el?.parentNode) continue;

        // Hold note: anchor at hit zone and shrink from top
        if (note.hold && note.holding && !note.holdComplete) {
            // Anchor bottom of note at hit zone
            const anchorY = hitLineY - 14; // half of 28px note height
            // Shrink the note height as it's consumed
            note.holdHeight -= srState.noteSpeed * dt;
            if (note.holdHeight <= 0) note.holdHeight = 0;
            note.noteH = note.holdHeight + 28;
            // Keep note anchored: top moves down as height shrinks
            note.y = anchorY - note.holdHeight;
            if (note.el) {
                note.el.style.top = note.y + 'px';
                note.el.style.height = note.noteH + 'px';
            }
            // Auto-complete when fully consumed
            if (note.holdHeight <= 0) {
                // Tail reached hit zone — auto-complete!
                note.holdComplete = true;
                note.holding = false;
                srState.score += GREAT_PTS;
                srState.combo++;
                if (srState.combo > srState.maxCombo) srState.maxCombo = srState.combo;
                srState.greats++;
                showJudgment('PERFECT');
                if (note.el) {
                    // gpop: remove holding class, add hit — keep current size
                    note.el.classList.remove('sr-note-holding');
                    note.el.classList.add('sr-note-hit');
                    setTimeout(() => note.el?.remove(), 600);
                }
                // Release pop reaction on ghost, hit cell, lane
                holdReleaseEffect(note.lane);
                dancerReact('hit');
                continue;
            }
        }

        // Miss check for non-held notes
        if (!note.hit) {
            const noteHitY = note.hold ? (note.y + note.holdHeight + 14) : (note.y + 14);
            if (noteHitY > missThreshold) {
                note.missed = true;
                srState.misses++;
                srState.combo = 0;
                showJudgment('MISS');
                dancerReact('miss');
                if (note.el) { note.el.classList.add('sr-note-missed'); setTimeout(() => note.el?.remove(), 200); }
            }
        }
    }

    srState.notes = srState.notes.filter(n => {
        if (n.holdComplete && !n.el?.parentNode) return false;
        if (n.hit && !n.holding && !n.el?.parentNode) return false;
        if (n.missed && !n.el?.parentNode) return false;
        return true;
    });

    updateHUD();

    if (srState.ytPlayer && srState.ytReady && srState.ytDuration > 0) {
        try {
            const pct = (srState.ytPlayer.getCurrentTime() / srState.ytDuration) * 100;
            const fill = document.getElementById('starroad-progress-fill');
            if (fill) fill.style.width = pct + '%';
        } catch (_) {}
    }

    srState.animFrame = requestAnimationFrame(gameLoop);
}

// ── Hit Detection ──────────────────────────────────────────
function tryHit(lane) {
    const gameArea = document.getElementById('sr-game-area');
    if (!gameArea) return;
    const hitLineY = gameArea.offsetHeight * 0.55;

    let closest = null, closestDist = Infinity;
    for (const note of srState.notes) {
        if (note.lane !== lane || note.hit || note.missed) continue;
        if (note.hold && note.holding) continue;
        const noteHitY = note.hold ? (note.y + note.holdHeight + 14) : (note.y + 14);
        const dist = Math.abs(noteHitY - hitLineY);
        if (dist < closestDist) { closestDist = dist; closest = note; }
    }
    if (!closest) return;

    const timingMs = (closestDist / srState.noteSpeed) * 1000;
    const hitCell = document.querySelector(`.starroad-hit-cell[data-lane="${lane}"]`);

    if (closest.hold) {
        if (timingMs <= GOOD_WINDOW) {
            closest.holding = true; closest.hit = true;
            srState.score += GOOD_PTS; srState.combo++;
            if (srState.combo > srState.maxCombo) srState.maxCombo = srState.combo;
            srState.goods++;
            showJudgment('NICE');
            if (closest.el) closest.el.classList.add('sr-note-holding');
            if (hitCell) { hitCell.classList.add('hit-great'); setTimeout(() => hitCell.classList.remove('hit-great'), 150); }
            // Lane glow + ghost glow while holding
            hitLane(lane);
            const holdGhost = document.querySelector(`.sr-ghost[data-lane="${lane}"]`);
            if (holdGhost) holdGhost.classList.add('sr-ghost-glow');
            // Keep lane lit while holding
            const holdLine = document.querySelector(`.sr-lane-line[style*="--lane:${lane}"]`);
            if (holdLine) { holdLine.classList.add('sr-lane-hit'); }
            dancerReact('hit');
        }
    } else {
        if (timingMs <= PERFECT_WINDOW) registerHit(closest, 'PERFECT', 'sr-perfect', PERFECT_PTS, hitCell);
        else if (timingMs <= GREAT_WINDOW) registerHit(closest, 'GREAT', 'sr-great', GREAT_PTS, hitCell);
        else if (timingMs <= GOOD_WINDOW) registerHit(closest, 'GOOD', 'sr-good', GOOD_PTS, hitCell);
    }
}

function registerHit(note, label, _cls, pts, hitCell) {
    note.hit = true;
    srState.score += pts; srState.combo++;
    if (srState.combo > srState.maxCombo) srState.maxCombo = srState.combo;
    if (label === 'PERFECT') srState.perfects++;
    else if (label === 'GREAT') srState.greats++;
    else if (label === 'GOOD') srState.goods++;

    showJudgment(label);
    if (note.el) { note.el.classList.add('sr-note-hit'); setTimeout(() => note.el?.remove(), 1000); }
    if (hitCell) { const c = 'hit-' + label.toLowerCase(); hitCell.classList.add(c); setTimeout(() => hitCell.classList.remove(c), 150); }

    // Score bump animation (gpop scorehit)
    const scoreEl = document.getElementById('starroad-score');
    if (scoreEl) { scoreEl.style.animation = 'none'; scoreEl.offsetHeight; scoreEl.style.animation = 'scorehit 0.08s ease 1'; }

    // Glow ghost target
    const ghost = document.querySelector(`.sr-ghost[data-lane="${note.lane}"]`);
    if (ghost) { ghost.classList.add('sr-ghost-glow'); setTimeout(() => ghost.classList.remove('sr-ghost-glow'), 150); }

    // Lane hit — milky rainbow glow
    hitLane(note.lane);
    // Dancer mini lane hit flash
    const dLane = document.querySelector(`.sr-dancer-lane[data-lane="${note.lane}"]`);
    if (dLane) { dLane.classList.add('hit'); setTimeout(() => dLane.classList.remove('hit'), 200); }
    // Dancer reacts to hit
    dancerReact('hit');
}

// ── Lane Hit Effect (gpop scaleX + huerotate technique) ────
let laneHitTimers = {};
function hitLane(lane) {
    const line = document.querySelector(`.sr-lane-line[style*="--lane:${lane}"]`);
    if (!line) return;
    if (laneHitTimers[lane]) clearTimeout(laneHitTimers[lane]);
    line.classList.remove('sr-lane-click');
    line.classList.add('sr-lane-hit');
    laneHitTimers[lane] = setTimeout(() => {
        line.classList.remove('sr-lane-hit');
    }, 200);
}
function clickLane(lane) {
    const line = document.querySelector(`.sr-lane-line[style*="--lane:${lane}"]`);
    if (!line) return;
    line.classList.add('sr-lane-click');
    // removed on keyup
}

// ── Hold Release Effect (gpop keyhit2 pop on hold complete) ──
function holdReleaseEffect(lane) {
    // Ghost pop animation
    const ghost = document.querySelector(`.sr-ghost[data-lane="${lane}"]`);
    if (ghost) {
        ghost.classList.remove('sr-ghost-glow');
        ghost.classList.add('sr-ghost-release');
        setTimeout(() => ghost.classList.remove('sr-ghost-release'), 250);
    }
    // Hit cell release flash
    const cell = document.querySelector(`.starroad-hit-cell[data-lane="${lane}"]`);
    if (cell) {
        cell.classList.add('hold-release');
        setTimeout(() => cell.classList.remove('hold-release'), 300);
    }
    // Stop lane hit glow
    const line = document.querySelector(`.sr-lane-line[style*="--lane:${lane}"]`);
    if (line) line.classList.remove('sr-lane-hit');
}

// ── Rating Display (gpop pp-ratings style) ────────────────
// Rating levels: 0=MISS, 1=OK, 2=GOOD, 3=GREAT, 4=PERFECT, 5=NICE(hold)
const RATING_MAP = {
    'MISS': 0, 'OK': 1, 'GOOD': 2, 'GREAT': 3, 'PERFECT': 4, 'NICE': 5,
};
const RATING_TEXT = { 0: 'MISS!', 1: 'OK!', 2: 'GOOD!', 3: 'GREAT!', 4: 'PERFECT', 5: 'NICE!' };

// gpop has 3 slots on each side (left/right) at different heights
// left: top 41%/-30px, 55%/-25px, 66%/-22px  right: 41%/+30px, 55%/+25px, 66%/+22px
const RATING_SLOTS = [
    { top: '41%', offsetX: -30, rot: -10, scale: 1.4, side: 'left' },
    { top: '41%', offsetX: 30, rot: 10, scale: 1.4, side: 'right' },
    { top: '55%', offsetX: -25, rot: -25, scale: 1.3, side: 'left' },
    { top: '55%', offsetX: 25, rot: 25, scale: 1.3, side: 'right' },
    { top: '66%', offsetX: -22, rot: -25, scale: 1.2, side: 'left' },
    { top: '66%', offsetX: 22, rot: 25, scale: 1.2, side: 'right' },
];
let ratingSlot = 0;
function showJudgment(text) {
    const container = document.getElementById('sr-ratings');
    if (!container) return;
    const level = RATING_MAP[text] ?? 2;
    const el = document.createElement('div');
    el.className = `pp-rating pp-rating-${level}`;
    el.textContent = RATING_TEXT[level];

    // Pick a slot (cycle through all 6)
    const slot = RATING_SLOTS[ratingSlot % RATING_SLOTS.length];
    ratingSlot++;

    // Position relative to lane center (lanes are centered at 50%)
    // Lane area: 4 * 44px = 176px wide, centered
    const laneHalfW = 88; // half of total lane width
    const centerX = container.clientWidth / 2;
    const baseX = slot.side === 'left' ? (centerX - laneHalfW + slot.offsetX) : (centerX + laneHalfW + slot.offsetX);

    el.style.top = slot.top;
    el.style.left = baseX + 'px';
    el.style.transform = `translateX(-50%) rotate(${slot.rot}deg) scale(${slot.scale})`;
    el.style.opacity = '1';
    container.appendChild(el);

    // Fade out after 600ms (gpop timing)
    setTimeout(() => {
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        el.style.opacity = '0';
        el.style.transform = `translateX(-50%) rotate(${slot.rot}deg) scale(${slot.scale * 0.8})`;
    }, 400);
    setTimeout(() => el.remove(), 600);
}

// ── HUD ────────────────────────────────────────────────────
let fpsFrames = 0, fpsLast = performance.now(), fpsValue = 60;
function updateHUD() {
    const s = document.getElementById('starroad-score');
    const c = document.getElementById('starroad-combo');
    const a = document.getElementById('starroad-accuracy');
    const b = document.getElementById('starroad-best-streak');
    const f = document.getElementById('starroad-fps');
    if (s) s.textContent = srState.score.toLocaleString();
    if (c) c.textContent = srState.combo;
    if (b) b.textContent = srState.maxCombo;
    const total = srState.perfects + srState.greats + srState.goods + srState.misses;
    if (total > 0 && a) a.textContent = ((srState.perfects + srState.greats + srState.goods) / total * 100).toFixed(1) + '%';
    // FPS counter
    fpsFrames++;
    const now = performance.now();
    if (now - fpsLast >= 1000) { fpsValue = Math.round(fpsFrames * 1000 / (now - fpsLast)); fpsFrames = 0; fpsLast = now; }
    if (f) f.textContent = fpsValue;
}

// ── Key Input ──────────────────────────────────────────────
function handleKeyDown(e) {
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (srState.ytPlayer && srState.ytReady) { const s = srState.ytPlayer.getPlayerState(); if (s === 1) srState.ytPlayer.pauseVideo(); else srState.ytPlayer.playVideo(); }
        return;
    }
    if (e.key.toLowerCase() === 'r' && srState.videoId) { e.preventDefault(); startGame(srState.videoId); return; }
    if (!srState.isActive) return;
    const lane = LANE_KEYS.indexOf(e.key.toLowerCase());
    if (lane === -1) return;
    e.preventDefault();
    const cell = document.querySelector(`.starroad-hit-cell[data-lane="${lane}"]`);
    if (cell) cell.classList.add('pressed');
    // Ghost click reaction (gpop pp-lane-click .pp-square)
    const ghost = document.querySelector(`.sr-ghost[data-lane="${lane}"]`);
    if (ghost) ghost.classList.add('sr-ghost-click');
    // Dancer mini lane lights up + dancer poses toward lane
    const dLane = document.querySelector(`.sr-dancer-lane[data-lane="${lane}"]`);
    if (dLane) dLane.classList.add('active');
    dancerKeyDown(lane);
    clickLane(lane);
    tryHit(lane);
}

function handleKeyUp(e) {
    const lane = LANE_KEYS.indexOf(e.key.toLowerCase());
    if (lane === -1) return;
    const cell = document.querySelector(`.starroad-hit-cell[data-lane="${lane}"]`);
    if (cell) cell.classList.remove('pressed');
    // Remove ghost click reaction
    const ghost = document.querySelector(`.sr-ghost[data-lane="${lane}"]`);
    if (ghost) ghost.classList.remove('sr-ghost-click');
    // Remove click effect on lane
    const line = document.querySelector(`.sr-lane-line[style*="--lane:${lane}"]`);
    if (line) line.classList.remove('sr-lane-click');
    // Dancer mini lane off + dancer reverts pose
    const dLane = document.querySelector(`.sr-dancer-lane[data-lane="${lane}"]`);
    if (dLane) { dLane.classList.remove('active'); dLane.classList.remove('hit'); }
    dancerKeyUp(lane);
    // Early release of hold note = break combo
    if (srState.isActive) {
        for (const note of srState.notes) {
            if (note.lane === lane && note.hold && note.holding && !note.holdComplete) {
                note.holdComplete = true; note.holding = false;
                // Released too early — break combo, count as miss
                srState.combo = 0;
                srState.misses++;
                showJudgment('MISS');
                dancerReact('miss');
                if (note.el) { note.el.classList.add('sr-note-missed'); setTimeout(() => note.el?.remove(), 200); }
                // Release pop reaction (even on miss, the release is visually reactive)
                holdReleaseEffect(note.lane);
                break;
            }
        }
    }
    // If no hold note was active on this lane, just remove glow
    if (ghost) ghost.classList.remove('sr-ghost-glow');
}

// ── Game Lifecycle ─────────────────────────────────────────
async function startGame(videoId) {
    srState.notes = []; srState.score = 0; srState.combo = 0; srState.maxCombo = 0;
    srState.perfects = 0; srState.greats = 0; srState.goods = 0; srState.misses = 0;
    srState.totalNotes = 0; srState.nextNoteId = 0; srState.lastFrame = 0;
    srState.isActive = true; srState.videoId = videoId;
    srState.noteSpeed = SPEED_MAP[srState.speed] || SPEED_MAP.normal;

    document.querySelectorAll('.sr-note').forEach(el => el.remove());
    document.getElementById('starroad-setup').classList.add('hidden');
    document.getElementById('starroad-game').classList.remove('hidden');
    document.getElementById('starroad-results').classList.add('hidden');

    initDancer();
    document.getElementById('starroad-score').textContent = '0';
    const combo = document.getElementById('starroad-combo'); if (combo) combo.textContent = '0';
    const bs = document.getElementById('starroad-best-streak'); if (bs) bs.textContent = '0';
    document.getElementById('starroad-accuracy').textContent = '0%';
    // Clear old ratings
    const ratings = document.getElementById('sr-ratings'); if (ratings) ratings.innerHTML = '';
    document.getElementById('starroad-progress-fill').style.width = '0%';

    const w = document.getElementById('sr-waiting');
    if (w) w.classList.remove('hidden');

    await loadYouTubeAPI();
    await createYTPlayer(videoId);
    if (w) w.classList.add('hidden');

    setTimeout(() => {
        if (srState.isActive) {
            const w2 = document.getElementById('sr-waiting'); if (w2) w2.classList.add('hidden');
            startSpawner();
            srState.animFrame = requestAnimationFrame(gameLoop);
        }
    }, 1500);
}

function endGame() {
    srState.isActive = false; stopSpawner();
    if (srState.animFrame) { cancelAnimationFrame(srState.animFrame); srState.animFrame = null; }
    destroyYTPlayer();
    document.getElementById('starroad-game').classList.add('hidden');
    document.getElementById('starroad-results').classList.remove('hidden');
    document.getElementById('starroad-final-score').textContent = srState.score.toLocaleString();
    document.getElementById('starroad-final-combo').textContent = srState.maxCombo;
    const total = srState.perfects + srState.greats + srState.goods + srState.misses;
    document.getElementById('starroad-final-accuracy').textContent = (total > 0 ? ((srState.perfects + srState.greats + srState.goods) / total * 100).toFixed(1) : '0') + '%';
    document.getElementById('starroad-count-perfect').textContent = srState.perfects;
    document.getElementById('starroad-count-great').textContent = srState.greats;
    document.getElementById('starroad-count-good').textContent = srState.goods;
    document.getElementById('starroad-count-miss').textContent = srState.misses;
}

function cleanup() {
    srState.isActive = false; stopSpawner();
    if (srState.animFrame) { cancelAnimationFrame(srState.animFrame); srState.animFrame = null; }
    destroyYTPlayer(); destroyStarfield();
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.querySelectorAll('.sr-note').forEach(el => el.remove());
}

// ── Show / Hide ────────────────────────────────────────────
window.showStarRoadOverlay = function () {
    const overlay = document.getElementById('starroad-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    initStarfield();
    document.getElementById('starroad-setup').classList.remove('hidden');
    document.getElementById('starroad-game').classList.add('hidden');
    document.getElementById('starroad-results').classList.add('hidden');
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    const onResize = () => { if (starCanvas) { starCanvas.width = window.innerWidth; starCanvas.height = window.innerHeight; } };
    window.addEventListener('resize', onResize);
    overlay._onResize = onResize;
};

window.hideStarRoadOverlay = function () {
    cleanup(); destroyStarfield();
    const overlay = document.getElementById('starroad-overlay');
    if (overlay) { overlay.classList.add('hidden'); if (overlay._onResize) { window.removeEventListener('resize', overlay._onResize); delete overlay._onResize; } }
};

window.initSplashStarfield = initSplashStarfield;
window.destroySplashStarfield = destroySplashStarfield;

// ── Wire up DOM ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.starroad-speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.starroad-speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            srState.speed = btn.dataset.speed || 'normal';
        });
    });
    document.getElementById('starroad-start-btn')?.addEventListener('click', () => {
        const url = document.getElementById('starroad-url-input')?.value.trim();
        const videoId = extractVideoId(url);
        const err = document.getElementById('starroad-url-error');
        if (!videoId) { err?.classList.remove('hidden'); return; }
        err?.classList.add('hidden');
        startGame(videoId);
    });
    document.getElementById('starroad-exit-btn')?.addEventListener('click', () => { window.hideStarRoadOverlay(); window.exitStarRoad?.(); });
    document.getElementById('starroad-retry-btn')?.addEventListener('click', () => { if (srState.videoId) startGame(srState.videoId); });
    document.getElementById('starroad-leave-btn')?.addEventListener('click', () => { window.hideStarRoadOverlay(); window.exitStarRoad?.(); });
});
