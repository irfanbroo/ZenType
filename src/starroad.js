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
    // .osu beatmap queue
    beatmap: null,      // parsed beatmap { notes: [...], title, artist, ... }
    noteQueue: [],       // sorted notes to spawn, consumed as time passes
    noteQueueIdx: 0,     // current position in queue
    currentSong: null,   // song library entry
};

// ── .osu Beatmap Parser ────────────────────────────────────
// Parses osu!mania 4K .osu file format
function parseOsuBeatmap(osuText) {
    const lines = osuText.split('\n').map(l => l.trim());
    const result = {
        title: '', artist: '', version: '', creator: '',
        audioFilename: '', overallDifficulty: 5,
        notes: [], // { lane, time, isHold, endTime }
    };

    let section = '';
    for (const line of lines) {
        if (line.startsWith('[') && line.endsWith(']')) {
            section = line.slice(1, -1);
            continue;
        }
        if (!line || line.startsWith('//')) continue;

        if (section === 'Metadata') {
            if (line.startsWith('Title:')) result.title = line.slice(6);
            else if (line.startsWith('Artist:')) result.artist = line.slice(7);
            else if (line.startsWith('Version:')) result.version = line.slice(8);
            else if (line.startsWith('Creator:')) result.creator = line.slice(8);
        }
        else if (section === 'General') {
            if (line.startsWith('AudioFilename:')) result.audioFilename = line.slice(14).trim();
        }
        else if (section === 'Difficulty') {
            if (line.startsWith('OverallDifficulty:')) result.overallDifficulty = parseFloat(line.split(':')[1]);
        }
        else if (section === 'HitObjects') {
            // Format: x,y,time,type,hitSound[,endTime:...]
            const parts = line.split(',');
            if (parts.length < 4) continue;
            const x = parseInt(parts[0]);
            const time = parseInt(parts[2]);
            const type = parseInt(parts[3]);
            // Lane: floor(x * 4 / 512)
            const lane = Math.min(3, Math.max(0, Math.floor(x * 4 / 512)));
            // Type bitmask: bit 0 = circle (tap), bit 7 = hold (128)
            const isHold = (type & 128) !== 0;
            let endTime = 0;
            if (isHold && parts.length >= 6) {
                // endTime is in the 6th field, before the colon-separated extras
                const endParts = parts[5].split(':');
                endTime = parseInt(endParts[0]);
            }
            result.notes.push({ lane, time, isHold, endTime: isHold ? endTime : 0 });
        }
    }

    // Sort by time
    result.notes.sort((a, b) => a.time - b.time);
    return result;
}

// ── Song Library ───────────────────────────────────────────
// Each song: { id, title, artist, youtubeId, difficulty, bpm, osuFile (URL or inline) }
const SONG_LIBRARY = [];

// Register songs dynamically
function registerSong(song) {
    SONG_LIBRARY.push(song);
}

// Fetch and parse a .osu file
async function loadBeatmap(url) {
    const resp = await fetch(url);
    const text = await resp.text();
    return parseOsuBeatmap(text);
}

// ── Default Song Library ─────────────────────────────────── (empty — all songs are in FEATURED_MAPS)

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

function createYTPlayer(videoId, startTime = 0) {
    return new Promise((resolve) => {
        const c = document.getElementById('sr-yt-visible');
        if (c) c.innerHTML = '';
        const d = document.createElement('div');
        d.id = 'sr-yt-player';
        if (c) c.appendChild(d); else document.body.appendChild(d);
        srState.ytPlayer = new YT.Player('sr-yt-player', {
            width: 380, height: 214, videoId,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, iv_load_policy: 3, start: startTime },
            events: {
                onReady: (e) => {
                    srState.ytReady = true;
                    srState.ytDuration = e.target.getDuration();
                    e.target.setVolume(80);
                    e.target.playVideo();
                    // Update top bar with video info
                    try {
                        const data = e.target.getVideoData();
                        const title = data.title || 'Unknown';
                        const author = data.author || 'Unknown';
                        const np = document.getElementById('sr-now-playing');
                        if (np) np.textContent = 'Now playing: ' + title;
                        const nt = document.getElementById('sr-now-time');
                        if (nt) nt.textContent = author + ' - --:-- / ' + formatTime(srState.ytDuration);
                    } catch(_) {}
                    resolve();
                },
                onStateChange: (e) => { if (e.data === 0 && srState.isActive) endGame(); },
            },
        });
    });
}

function destroyYTPlayer() {
    if (srState.ytPlayer) { try { srState.ytPlayer.stopVideo(); srState.ytPlayer.destroy(); } catch (_) {} srState.ytPlayer = null; }
    srState.ytReady = false;
    if (srState._scPollInterval) { clearInterval(srState._scPollInterval); srState._scPollInterval = null; }
    const c = document.getElementById('sr-yt-visible');
    if (c) c.innerHTML = '';
}

// ── SoundCloud Player ──────────────────────────────────────
function loadSCWidgetAPI() {
    return new Promise(resolve => {
        if (window.SC) { resolve(); return; }
        if (document.getElementById('sc-widget-api')) {
            const check = setInterval(() => { if (window.SC) { clearInterval(check); resolve(); } }, 100);
            return;
        }
        const s = document.createElement('script');
        s.id = 'sc-widget-api';
        s.src = 'https://w.soundcloud.com/player/api.js';
        s.onload = () => resolve();
        document.head.appendChild(s);
    });
}

function createSCPlayer(trackUrl) {
    return new Promise(async (resolve) => {
        // SC iframe hidden — audio only, YouTube shows visually
        const iframe = document.createElement('iframe');
        iframe.id = 'sr-sc-iframe';
        iframe.style.cssText = 'width:1px;height:1px;position:fixed;top:-9999px;left:-9999px;border:none;';
        iframe.allow = 'autoplay';
        iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
        document.body.appendChild(iframe);

        await loadSCWidgetAPI();
        const widget = window.SC.Widget(iframe);

        let cachedPosition = 0;
        let cachedDuration = 0;

        // Wrap SC widget to look like YT player
        srState.ytPlayer = {
            _widget: widget,
            _iframe: iframe,
            _state: -1,
            getCurrentTime: () => cachedPosition / 1000,
            getDuration: () => cachedDuration / 1000,
            getPlayerState: () => srState.ytPlayer._state,
            setVolume: (v) => widget.setVolume(v),
            playVideo: () => { widget.play(); srState.ytPlayer._state = 1; },
            pauseVideo: () => { widget.pause(); srState.ytPlayer._state = 2; },
            stopVideo: () => { widget.pause(); },
            destroy: () => {
                if (srState._scPollInterval) { clearInterval(srState._scPollInterval); srState._scPollInterval = null; }
                try { iframe.remove(); } catch(_) {}
            },
            getVideoData: () => ({
                title: srState.currentSong?.title || '',
                author: srState.currentSong?.artist || '',
            }),
        };

        widget.bind(window.SC.Widget.Events.READY, () => {
            widget.getDuration(d => {
                cachedDuration = d;
                srState.ytDuration = d / 1000;
                srState.ytReady = true;
                srState.ytPlayer._state = 1;

                widget.setVolume(80);

                // Poll position every 50ms (SC API is async)
                srState._scPollInterval = setInterval(() => {
                    widget.getPosition(p => { cachedPosition = p; });
                }, 50);

                // Update top bar
                const np = document.getElementById('sr-now-playing');
                if (np) np.textContent = 'Now playing: ' + (srState.currentSong?.title || 'Unknown');
                const nt = document.getElementById('sr-now-time');
                if (nt) nt.textContent = (srState.currentSong?.artist || '') + ' - --:-- / ' + formatTime(d / 1000);

                resolve();
            });
        });

        widget.bind(window.SC.Widget.Events.PLAY,   () => { srState.ytPlayer._state = 1; });
        widget.bind(window.SC.Widget.Events.PAUSE,  () => { srState.ytPlayer._state = 2; });
        widget.bind(window.SC.Widget.Events.FINISH, () => {
            srState.ytPlayer._state = 0;
            if (srState.isActive) endGame();
        });

        // Timeout fallback — if READY doesn't fire in 10s, resolve anyway
        setTimeout(() => {
            if (!srState.ytReady) {
                console.warn('SoundCloud READY timeout — starting anyway');
                srState.ytReady = true;
                srState.ytPlayer._state = 1;
                resolve();
            }
        }, 10000);
    });
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
// Old random spawner (fallback when no beatmap loaded)
function startRandomSpawner() {
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

// Beatmap-based spawner: spawn notes ahead of time based on YT currentTime
// Notes need lead time to fall from top to hit zone
function getLeadTimeMs() {
    // How long a note takes to fall from spawn to hit zone (pixels / speed * 1000)
    // Game area ~55% is hit zone, so note travels ~55% of game area height
    const gameArea = document.getElementById('sr-game-area');
    const h = gameArea ? gameArea.offsetHeight * 0.55 : 400;
    return (h / srState.noteSpeed) * 1000;
}

function startBeatmapSpawner() {
    // Use a fast interval to check if notes should spawn
    if (srState.spawnTimer) clearInterval(srState.spawnTimer);
    let randomFallbackStarted = false;
    srState.spawnTimer = setInterval(() => {
        if (!srState.isActive || !srState.ytPlayer || !srState.ytReady) return;
        const currentTimeMs = srState.ytPlayer.getCurrentTime() * 1000;
        const leadTime = getLeadTimeMs();
        const spawnTime = currentTimeMs + leadTime;

        // Spawn all notes whose time <= spawnTime
        while (srState.noteQueueIdx < srState.noteQueue.length) {
            const n = srState.noteQueue[srState.noteQueueIdx];
            if (n.time <= spawnTime) {
                if (n.isHold) {
                    const holdDurationMs = n.endTime - n.time;
                    const holdPx = (holdDurationMs / 1000) * srState.noteSpeed;
                    spawnNote(n.lane, true, holdPx);
                } else {
                    spawnNote(n.lane, false);
                }
                srState.noteQueueIdx++;
            } else {
                break;
            }
        }

        // When beatmap notes run out, switch to random spawner for the rest of the song
        if (!randomFallbackStarted && srState.noteQueueIdx >= srState.noteQueue.length) {
            randomFallbackStarted = true;
            startRandomSpawner();
        }
    }, 16); // ~60fps check rate
}

function startSpawner() {
    if (srState.beatmap && srState.noteQueue.length > 0) {
        startBeatmapSpawner();
    } else {
        startRandomSpawner();
    }
}

function spawnNote(lane, isHold = false, holdPx = 0) {
    const container = document.getElementById('sr-notes-container');
    if (!container) return;

    const NOTE_H = 28; // gpop exact note height
    const holdH = isHold ? (holdPx > 0 ? holdPx : (120 + Math.floor(Math.random() * 100))) : 0;
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
    el.style.left = `calc(${lane} * var(--sr-lane-w) + var(--sr-lanes-left) + (var(--sr-lane-w) - var(--sr-note-w)) / 2)`;

    container.appendChild(el);
    note.el = el;
    srState.notes.push(note);
    // Only increment totalNotes for random mode; beatmap mode pre-sets the count
    if (!srState.beatmap) srState.totalNotes++;
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
function formatTime(sec) {
    if (!sec || sec < 0) return '--:--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

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
    // Update top bar time
    if (srState.ytPlayer && srState.ytReady) {
        const nt = document.getElementById('sr-now-time');
        if (nt) {
            try {
                const cur = srState.ytPlayer.getCurrentTime();
                const author = srState.ytPlayer.getVideoData()?.author || 'Unknown';
                nt.textContent = author + ' - ' + formatTime(cur) + ' / ' + formatTime(srState.ytDuration);
            } catch(_) {}
        }
    }
}

// ── Key Input ──────────────────────────────────────────────
function handleKeyDown(e) {
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (srState.ytPlayer && srState.ytReady) {
            const s = srState.ytPlayer.getPlayerState();
            const pauseEl = document.getElementById('sr-pause-overlay');
            const mutedFrame = srState._mutedYtFrame;
            if (s === 1) {
                srState.ytPlayer.pauseVideo();
                if (mutedFrame) mutedFrame.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                srState.isActive = false;
                if (srState.animFrame) { cancelAnimationFrame(srState.animFrame); srState.animFrame = null; }
                if (srState.spawnTimer) { clearInterval(srState.spawnTimer); srState.spawnTimer = null; }
                if (pauseEl) pauseEl.classList.remove('hidden');
            } else {
                srState.ytPlayer.playVideo();
                if (mutedFrame) mutedFrame.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                srState.isActive = true;
                srState.lastFrame = 0;
                startSpawner();
                srState.animFrame = requestAnimationFrame(gameLoop);
                if (pauseEl) pauseEl.classList.add('hidden');
            }
        }
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
    srState.noteQueueIdx = 0;
    // If we have a beatmap loaded, use its notes as the queue
    if (srState.beatmap && srState.beatmap.notes.length > 0) {
        srState.noteQueue = [...srState.beatmap.notes];
        srState.totalNotes = srState.noteQueue.length;
    } else {
        srState.noteQueue = [];
    }

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
    // SoundCloud = audio source, YouTube = visual only (muted)
    if (srState.currentSong?.soundcloudUrl) {
        // Show muted YouTube video for visuals
        if (videoId) {
            const c = document.getElementById('sr-yt-visible');
            if (c) {
                c.innerHTML = '';
                const mutedFrame = document.createElement('iframe');
                mutedFrame.width = '380';
                mutedFrame.height = '214';
                mutedFrame.style.cssText = 'border:none;border-radius:8px;pointer-events:none;';
                mutedFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&disablekb=1&fs=0&modestbranding=1&start=6&enablejsapi=1`;
                mutedFrame.allow = 'autoplay';
                c.appendChild(mutedFrame);
                srState._mutedYtFrame = mutedFrame;
            }
        }
        await createSCPlayer(srState.currentSong.soundcloudUrl);
    } else {
        await createYTPlayer(videoId, srState.currentSong?.startTime || 0);
    }
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
    if (srState._mutedYtFrame) { srState._mutedYtFrame = null; }
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
    // Show song select if we have songs, otherwise show URL input
    const songSelect = document.getElementById('starroad-song-select');
    const setup = document.getElementById('starroad-setup');
    songSelect?.classList.remove('hidden');
    setup.classList.add('hidden');
    renderSongList();
    renderFeaturedMaps();
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

// ── Song Selection UI ──────────────────────────────────────
function renderSongList() {
    const grid = document.getElementById('sr-song-grid');
    if (!grid) return;
    grid.innerHTML = '';
    SONG_LIBRARY.forEach((song, idx) => {
        const card = document.createElement('div');
        card.className = 'sr-song-card';
        card.dataset.idx = idx;
        card.innerHTML = `
            <div class="sr-song-thumb" style="background-image:url(https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg)"></div>
            <div class="sr-song-info">
                <div class="sr-song-title">${song.title}</div>
                <div class="sr-song-artist">${song.artist}</div>
                <div class="sr-song-meta">
                    <span class="sr-song-diff sr-diff-${(song.difficulty || 'normal').toLowerCase()}">${song.difficulty || 'Normal'}</span>
                    ${song.bpm ? `<span class="sr-song-bpm">${song.bpm} BPM</span>` : ''}
                </div>
            </div>
        `;
        card.addEventListener('click', () => selectSong(idx));
        grid.appendChild(card);
    });
}

async function selectSong(idx) {
    const song = SONG_LIBRARY[idx];
    if (!song) return;
    srState.currentSong = song;

    // Show loading state
    const grid = document.getElementById('sr-song-grid');
    const cards = grid?.querySelectorAll('.sr-song-card');
    cards?.forEach(c => c.classList.remove('sr-song-selected'));
    cards?.[idx]?.classList.add('sr-song-selected');

    try {
        // Load beatmap
        if (song.osuData) {
            // Inline .osu data (string)
            srState.beatmap = parseOsuBeatmap(song.osuData);
        } else if (song.osuFile) {
            srState.beatmap = await loadBeatmap(song.osuFile);
        } else {
            srState.beatmap = null;
        }

        // Switch to game
        document.getElementById('starroad-song-select')?.classList.add('hidden');
        document.getElementById('starroad-setup')?.classList.add('hidden');
        startGame(song.youtubeId);
    } catch (err) {
        console.error('Failed to load beatmap:', err);
        // Fallback: play with random notes
        srState.beatmap = null;
        document.getElementById('starroad-song-select')?.classList.add('hidden');
        startGame(song.youtubeId);
    }
}

// ── Featured Maps (curated osu!mania 4K links) ─────────────
const FEATURED_MAPS = [
    {
        title: 'Bad Apple!! feat. nomico',
        artist: 'Alstroemeria Records',
        mapper: 'ZenType',
        difficulty: 'Easy',
        bpm: 138,
        stars: 2.0,
        youtubeId: 'FtutLA63Cp8',
        osuFile: 'src/data/beatmaps/badapple.osu',
    },
    {
        title: 'Bokutachi no Tabi to Epilogue.[Long ver.]',
        artist: 'aaaa',
        mapper: 'Dailyji',
        difficulty: 'Hard',
        bpm: 183,
        stars: 5.1,
        osuId: 381334,
        youtubeId: 'nLt34T-Q7-0',
    },
    {
        title: 'Language of the Lost (feat. Kasane Teto SV)',
        artist: 'R.I.P',
        mapper: 'real_BCMC',
        difficulty: 'Normal',
        bpm: 130,
        stars: 3.88,
        osuId: 2306785,
        youtubeId: '1xEfMnXyGkA',
        soundcloudUrl: 'https://soundcloud.com/irfan-s-761237717/language-of-the-lost-feat',
    },
    {
        title: 'Renai Circulation',
        artist: 'Kana Hanazawa',
        mapper: 'ZenType',
        difficulty: 'Easy',
        bpm: 130,
        stars: 1.8,
        youtubeId: 'uKxyLmbOc0Q',
        osuFile: 'src/data/beatmaps/renaicirculation.osu',
    },
    {
        title: 'Night of Nights',
        artist: 'BEAT MARIO',
        mapper: 'ZenType',
        difficulty: 'Insane',
        bpm: 220,
        stars: 6.5,
        youtubeId: 'vS_a8Edde8k',
        osuFile: 'src/data/beatmaps/nightofnights.osu',
    },
];

function renderFeaturedMaps() {
    const grid = document.getElementById('sr-featured-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (FEATURED_MAPS.length === 0) {
        grid.innerHTML = `<p class="sr-featured-empty">No featured maps yet!</p>`;
        return;
    }

    FEATURED_MAPS.forEach((map, idx) => {
        const thumb = map.osuId
            ? `https://assets.ppy.sh/beatmaps/${map.osuId}/covers/list.jpg`
            : `https://img.youtube.com/vi/${map.youtubeId}/mqdefault.jpg`;
        const osuUrl = `https://osu.ppy.sh/beatmapsets/${map.osuId}`;
        const diffClass = map.stars >= 6 ? 'insane' : map.stars >= 4 ? 'hard' : map.stars >= 2.5 ? 'normal' : 'easy';

        const card = document.createElement('div');
        card.className = 'sr-song-card sr-featured-card';
        card.dataset.idx = idx;
        card.innerHTML = `
            <div class="sr-song-thumb" style="background-image:url(${thumb})"></div>
            <div class="sr-song-info">
                <div class="sr-song-title">${map.title}</div>
                <div class="sr-song-artist">${map.artist}${map.mapper ? ` · <span class="sr-mapper-credit">mapped by ${map.mapper}</span>` : ''}</div>
                <div class="sr-song-meta">
                    <span class="sr-song-diff sr-diff-${diffClass}">⭐ ${map.stars}</span>
                    ${map.bpm ? `<span class="sr-song-bpm">${map.bpm} BPM</span>` : ''}
                </div>
            </div>
            <div class="sr-featured-actions">
                <button class="sr-featured-play-btn" data-idx="${idx}" title="Play now">
                    <i class="ri-play-fill"></i> PLAY
                </button>
                <a class="sr-featured-btn sr-featured-osu" href="${osuUrl}" target="_blank" rel="noopener noreferrer" title="Open on osu!">
                    <i class="ri-external-link-line"></i>
                </a>
            </div>
        `;

        // PLAY button
        card.querySelector('.sr-featured-play-btn').addEventListener('click', () => playFeaturedMap(map, card));
        grid.appendChild(card);
    });
}

async function playFeaturedMap(map, card) {
    if (!map.youtubeId && !map.soundcloudUrl) {
        alert('No audio source set for this map yet.');
        return;
    }

    const playBtn = card.querySelector('.sr-featured-play-btn');
    playBtn.disabled = true;
    playBtn.innerHTML = '<i class="ri-loader-4-line"></i> Loading...';

    try {
        srState.currentSong = map;

        if (map.osuFile) {
            // Direct .osu file (auto-generated or bundled)
            const resp = await fetch(map.osuFile);
            if (!resp.ok) throw new Error('not_found');
            const text = await resp.text();
            srState.beatmap = parseOsuBeatmap(text);
        } else if (map.osuId) {
            // .osz bundle
            const resp = await fetch(`src/data/beatmaps/${map.osuId}.osz`);
            if (!resp.ok) throw new Error('not_found');
            const arrayBuffer = await resp.arrayBuffer();
            const osuFiles = await extractOsuFromOsz(arrayBuffer);
            const mania4k = osuFiles.find(f => f.parsed.notes.length > 0);
            srState.beatmap = mania4k ? mania4k.parsed : null;
        } else {
            srState.beatmap = null;
        }

        document.getElementById('starroad-song-select')?.classList.add('hidden');
        startGame(map.youtubeId);

    } catch (err) {
        playBtn.disabled = false;
        playBtn.innerHTML = '<i class="ri-play-fill"></i> PLAY';

        if (err.message === 'not_found') {
            // File not bundled yet — show instructions
            showFeaturedDownloadHint(map, card);
        } else {
            console.error('Failed to load featured map:', err);
            playBtn.innerHTML = '<i class="ri-error-warning-line"></i> Error';
        }
    }
}

function showFeaturedDownloadHint(map, card) {
    // Show a small inline hint under the card
    let hint = card.parentNode.querySelector(`.sr-featured-hint[data-id="${map.osuId}"]`);
    if (hint) { hint.remove(); return; } // toggle off if already shown

    hint = document.createElement('div');
    hint.className = 'sr-featured-hint';
    hint.dataset.id = map.osuId;
    hint.innerHTML = `
        <i class="ri-information-line"></i>
        Beatmap file not found. <a href="https://osu.ppy.sh/beatmapsets/${map.osuId}" target="_blank">Download from osu!</a>,
        rename to <code>${map.osuId}.osz</code> and place in <code>src/data/beatmaps/</code>
    `;
    card.after(hint);
}

// ── Import .osu File ───────────────────────────────────────
let importedOsuText = null;

function showImportModal() {
    const modal = document.getElementById('sr-import-modal');
    if (modal) modal.classList.remove('hidden');
    importedOsuText = null;
    const fileInput = document.getElementById('sr-import-file');
    if (fileInput) fileInput.value = '';
    const fname = document.getElementById('sr-import-filename');
    if (fname) { fname.textContent = ''; fname.classList.add('hidden'); }
    const dropzone = document.getElementById('sr-import-dropzone');
    if (dropzone) dropzone.classList.remove('has-file');
    const playBtn = document.getElementById('sr-import-play');
    if (playBtn) playBtn.disabled = true;
    const err = document.getElementById('sr-import-error');
    if (err) { err.textContent = ''; err.classList.add('hidden'); }
    const ytInput = document.getElementById('sr-import-yt-url');
    if (ytInput) ytInput.value = '';
}

function hideImportModal() {
    const modal = document.getElementById('sr-import-modal');
    if (modal) modal.classList.add('hidden');
}

// ── .osz (zip) extraction using browser native APIs ────────
async function extractOsuFromOsz(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    const files = [];

    // Find all local file headers (PK\x03\x04)
    for (let i = 0; i < data.length - 4; i++) {
        if (data[i] === 0x50 && data[i+1] === 0x4B && data[i+2] === 0x03 && data[i+3] === 0x04) {
            const compressionMethod = data[i+8] | (data[i+9] << 8);
            const compressedSize = data[i+18] | (data[i+19] << 8) | (data[i+20] << 16) | (data[i+21] << 24);
            const nameLen = data[i+26] | (data[i+27] << 8);
            const extraLen = data[i+28] | (data[i+29] << 8);
            const nameBytes = data.slice(i+30, i+30+nameLen);
            const fileName = new TextDecoder().decode(nameBytes);
            const dataStart = i + 30 + nameLen + extraLen;
            const fileData = data.slice(dataStart, dataStart + compressedSize);

            if (fileName.endsWith('.osu')) {
                let text;
                if (compressionMethod === 0) {
                    // STORED — no compression
                    text = new TextDecoder().decode(fileData);
                } else if (compressionMethod === 8) {
                    // DEFLATE — use browser DecompressionStream
                    try {
                        const blob = new Blob([fileData]);
                        const ds = new DecompressionStream('deflate-raw');
                        const stream = blob.stream().pipeThrough(ds);
                        const decompressed = await new Response(stream).arrayBuffer();
                        text = new TextDecoder().decode(decompressed);
                    } catch (e) {
                        console.warn('Failed to decompress', fileName, e);
                        continue;
                    }
                } else {
                    continue; // unsupported compression
                }

                const parsed = parseOsuBeatmap(text);
                // Only include mania maps (Mode: 3) with 4 keys
                files.push({ fileName, text, parsed });
            }
        }
    }
    return files;
}

// Store extracted .osu files for selection
let oszExtractedFiles = [];

function handleOsuFile(file) {
    if (!file) return;
    const isOsz = file.name.endsWith('.osz');
    const isOsu = file.name.endsWith('.osu');

    if (!isOsz && !isOsu) {
        const err = document.getElementById('sr-import-error');
        if (err) { err.textContent = 'Please select a .osu or .osz file'; err.classList.remove('hidden'); }
        return;
    }

    const errEl = document.getElementById('sr-import-error');
    if (errEl) errEl.classList.add('hidden');

    if (isOsu) {
        // Direct .osu file
        const reader = new FileReader();
        reader.onload = (e) => {
            importedOsuText = e.target.result;
            oszExtractedFiles = [];
            const parsed = parseOsuBeatmap(importedOsuText);
            showImportedFileInfo(file.name, parsed);
        };
        reader.readAsText(file);
    } else {
        // .osz file — extract .osu files from the zip
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const osuFiles = await extractOsuFromOsz(e.target.result);
                if (osuFiles.length === 0) {
                    if (errEl) { errEl.textContent = 'No osu!mania maps found in this .osz file. Make sure it\'s a mania (4K) beatmap.'; errEl.classList.remove('hidden'); }
                    return;
                }
                oszExtractedFiles = osuFiles;
                // If only one, auto-select it
                if (osuFiles.length === 1) {
                    importedOsuText = osuFiles[0].text;
                    showImportedFileInfo(osuFiles[0].fileName, osuFiles[0].parsed);
                } else {
                    // Multiple difficulties — show picker
                    showDifficultyPicker(osuFiles);
                }
            } catch (err) {
                console.error('Failed to extract .osz:', err);
                if (errEl) { errEl.textContent = 'Failed to read .osz file'; errEl.classList.remove('hidden'); }
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

function showImportedFileInfo(fileName, parsed) {
    const fname = document.getElementById('sr-import-filename');
    if (fname) {
        fname.textContent = `${parsed.title || fileName} by ${parsed.artist || 'Unknown'} [${parsed.version || '?'}] — ${parsed.notes.length} notes`;
        fname.classList.remove('hidden');
    }
    const dropzone = document.getElementById('sr-import-dropzone');
    if (dropzone) dropzone.classList.add('has-file');
    // Hide difficulty picker if showing
    const picker = document.getElementById('sr-import-diffpicker');
    if (picker) picker.classList.add('hidden');
    updateImportPlayBtn();
}

function showDifficultyPicker(osuFiles) {
    const dropzone = document.getElementById('sr-import-dropzone');
    if (dropzone) dropzone.classList.add('has-file');
    const fname = document.getElementById('sr-import-filename');
    if (fname) {
        fname.textContent = `${osuFiles[0].parsed.title || 'Unknown'} — ${osuFiles.length} difficulties found. Pick one:`;
        fname.classList.remove('hidden');
    }

    // Create or get difficulty picker
    let picker = document.getElementById('sr-import-diffpicker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'sr-import-diffpicker';
        picker.className = 'sr-import-diffpicker';
        fname.parentNode.insertBefore(picker, fname.nextSibling);
    }
    picker.classList.remove('hidden');
    picker.innerHTML = '';

    osuFiles.forEach((f, idx) => {
        const btn = document.createElement('button');
        btn.className = 'sr-diff-pick-btn';
        btn.textContent = `${f.parsed.version || 'Diff ' + (idx+1)} (${f.parsed.notes.length} notes)`;
        btn.addEventListener('click', () => {
            importedOsuText = f.text;
            picker.querySelectorAll('.sr-diff-pick-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showImportedFileInfo(f.fileName, f.parsed);
        });
        picker.appendChild(btn);
    });
}

function updateImportPlayBtn() {
    const playBtn = document.getElementById('sr-import-play');
    const ytUrl = document.getElementById('sr-import-yt-url')?.value.trim();
    const hasFile = importedOsuText !== null;
    const hasUrl = ytUrl && extractVideoId(ytUrl);
    if (playBtn) playBtn.disabled = !(hasFile && hasUrl);
}

function playImported() {
    const ytUrl = document.getElementById('sr-import-yt-url')?.value.trim();
    const videoId = extractVideoId(ytUrl);
    if (!importedOsuText || !videoId) return;

    const parsed = parseOsuBeatmap(importedOsuText);
    srState.beatmap = parsed;

    // Add to session library so it shows in song list
    const song = {
        id: 'imported-' + Date.now(),
        title: parsed.title || 'Imported Beatmap',
        artist: parsed.artist || 'Unknown Artist',
        youtubeId: videoId,
        difficulty: parsed.version || 'Normal',
        bpm: '',
        osuData: importedOsuText,
    };
    registerSong(song);
    srState.currentSong = song;

    hideImportModal();
    document.getElementById('starroad-song-select')?.classList.add('hidden');
    startGame(videoId);
}

// Allow switching back to URL input mode
function showCustomUrlMode() {
    document.getElementById('starroad-song-select')?.classList.add('hidden');
    document.getElementById('starroad-setup')?.classList.remove('hidden');
    srState.beatmap = null;
}

// Go back to song select from setup
function showSongSelect() {
    document.getElementById('starroad-setup')?.classList.add('hidden');
    document.getElementById('starroad-song-select')?.classList.remove('hidden');
    renderSongList();
    renderFeaturedMaps();
}

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
    document.getElementById('starroad-retry-btn')?.addEventListener('click', () => {
        if (srState.videoId) startGame(srState.videoId);
    });
    document.getElementById('starroad-leave-btn')?.addEventListener('click', () => {
        // Go back to song select instead of exiting entirely
        document.getElementById('starroad-results')?.classList.add('hidden');
        if (SONG_LIBRARY.length > 0) {
            showSongSelect();
        } else {
            document.getElementById('starroad-setup')?.classList.remove('hidden');
        }
    });
    // Volume controls
    let currentVolume = 80;
    function updateVolumeUI() {
        document.querySelectorAll('#sr-vol-blocks .sr-vol-block').forEach(b => {
            const vol = parseInt(b.dataset.vol);
            b.classList.toggle('active', vol <= currentVolume);
        });
    }
    function setVolume(vol) {
        currentVolume = Math.max(0, Math.min(100, vol));
        if (srState.ytPlayer && srState.ytReady) srState.ytPlayer.setVolume(currentVolume);
        updateVolumeUI();
    }
    document.getElementById('sr-vol-down')?.addEventListener('click', () => setVolume(currentVolume - 10));
    document.getElementById('sr-vol-up')?.addEventListener('click', () => setVolume(currentVolume + 10));
    document.querySelectorAll('#sr-vol-blocks .sr-vol-block').forEach(b => {
        b.addEventListener('click', () => setVolume(parseInt(b.dataset.vol)));
    });

    // Game exit button — stop and go back to song select
    document.getElementById('sr-game-exit-btn')?.addEventListener('click', () => {
        srState.isActive = false;
        stopSpawner();
        if (srState.animFrame) { cancelAnimationFrame(srState.animFrame); srState.animFrame = null; }
        destroyYTPlayer();
        document.getElementById('starroad-game')?.classList.add('hidden');
        if (SONG_LIBRARY.length > 0) {
            showSongSelect();
        } else {
            document.getElementById('starroad-setup')?.classList.remove('hidden');
        }
    });
    // Song select wiring
    document.getElementById('sr-custom-url-btn')?.addEventListener('click', showCustomUrlMode);
    document.getElementById('sr-back-to-songs-btn')?.addEventListener('click', showSongSelect);
    document.getElementById('sr-song-exit-btn')?.addEventListener('click', () => { window.hideStarRoadOverlay(); window.exitStarRoad?.(); });

    // Import modal wiring
    document.getElementById('sr-import-btn')?.addEventListener('click', showImportModal);
    document.getElementById('sr-import-cancel')?.addEventListener('click', hideImportModal);
    document.getElementById('sr-import-play')?.addEventListener('click', playImported);

    // File input
    const dropzone = document.getElementById('sr-import-dropzone');
    const fileInput = document.getElementById('sr-import-file');
    dropzone?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => { if (e.target.files[0]) handleOsuFile(e.target.files[0]); });

    // Drag & drop
    dropzone?.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) handleOsuFile(file);
    });

    // YouTube URL input updates play button state
    document.getElementById('sr-import-yt-url')?.addEventListener('input', updateImportPlayBtn);
});
