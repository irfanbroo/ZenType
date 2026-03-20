// ══════════════════════════════════════════════════════════
// MUSIC MODE — Golden Brown
// Typing lyrics + WebGL shader + SoundCloud
// ══════════════════════════════════════════════════════════

const TRACK_URL = 'https://soundcloud.com/dyarsabah10000/the-stranglers-golden-brown';

// ── Lyrics ─────────────────────────────────────────────────
const LYRICS_LINES = [
    'Golden brown texture like sun',
    'Lays me down with my mind she runs',
    'Throughout the night',
    'No need to fight',
    'Never a frown with golden brown',
    'Every time just like the last',
    'On her ship tied to the mast',
    'To distant lands',
    'Takes both my hands',
    'Never a frown with golden brown',
    'Golden brown finer temptress',
    "Through the ages she's heading west",
    'From far away',
    'Stays for a day',
    'Never a frown with golden brown',
    'Never a frown',
    'With golden brown',
    'Never a frown',
    'With golden brown',
];

// Flat word list: { text, lineIdx }
const WORDS = LYRICS_LINES.flatMap((line, li) =>
    line.split(' ').map(w => ({ text: w, lineIdx: li }))
);

// ── Lyrics State ───────────────────────────────────────────
let wordIdx   = 0;
let typed     = '';
let hasError  = false;

function currentLine() {
    return wordIdx < WORDS.length ? WORDS[wordIdx].lineIdx : LYRICS_LINES.length;
}

// Build a line's HTML: spans per word with status classes
function buildLineHTML(lineIdx, activeWordIdx) {
    return LYRICS_LINES[lineIdx]
        .split(' ')
        .map((word, wi) => {
            // Global word index for this word
            const gIdx = WORDS.findIndex((w, i) => w.lineIdx === lineIdx &&
                WORDS.slice(0, i).filter(x => x.lineIdx === lineIdx).length === wi);

            if (gIdx < activeWordIdx) {
                // Already typed — correct or error tracked per-word
                const cls = WORDS[gIdx]._error ? 'lw lw--error' : 'lw lw--done';
                return `<span class="${cls}">${word}</span>`;
            } else if (gIdx === activeWordIdx) {
                // Active word — char-by-char feedback
                return buildActiveWord(word, typed);
            } else {
                return `<span class="lw lw--pending" style="animation-delay:${(wi * 0.28).toFixed(2)}s">${word}</span>`;
            }
        })
        .join('<span class="lw-space"> </span>');
}

function buildActiveWord(word, input) {
    let html = '<span class="lw lw--active">';
    const len = Math.max(word.length, input.length);
    for (let i = 0; i < len; i++) {
        if (i >= word.length) {
            // Extra typed chars
            html += `<span class="lc lc--extra">${input[i]}</span>`;
        } else if (i < input.length) {
            const match = input[i] === word[i];
            html += `<span class="lc ${match ? 'lc--ok' : 'lc--err'}">${word[i]}</span>`;
        } else if (i === input.length) {
            // Caret position
            html += `<span class="lc lc--caret">${word[i]}</span>`;
        } else {
            html += `<span class="lc lc--pending">${word[i]}</span>`;
        }
    }
    // Caret after all chars if input matches word length
    if (input.length >= word.length) {
        html += '<span class="lc-caret-end"></span>';
    }
    html += '</span>';
    return html;
}

function renderLyrics() {
    const li   = currentLine();
    const prev = document.getElementById('lyrics-prev');
    const curr = document.getElementById('lyrics-curr');
    const next = document.getElementById('lyrics-next');
    const done = document.getElementById('lyrics-done');

    if (wordIdx >= WORDS.length) {
        if (prev)  prev.innerHTML  = '';
        if (curr)  curr.innerHTML  = '';
        if (next)  next.innerHTML  = '';
        done?.classList.remove('hidden');
        return;
    }

    done?.classList.add('hidden');
    if (prev)  prev.innerHTML  = li > 0 ? buildLineHTML(li - 1, wordIdx) : '';
    if (curr)  curr.innerHTML  = buildLineHTML(li, wordIdx);
    if (next)  next.innerHTML  = li < LYRICS_LINES.length - 1 ? buildLineHTML(li + 1, wordIdx) : '';
}

function advanceWord() {
    const word = WORDS[wordIdx];
    word._error = hasError || typed !== word.text;
    wordIdx++;
    typed    = '';
    hasError = false;
    renderLyrics();
    // Burst on word completion
    const pos = getCaretPos();
    spawnSparkles(pos.x, pos.y, 12, true);
}

function handleLyricsKey(e) {
    if (wordIdx >= WORDS.length) return;
    const word = WORDS[wordIdx].text;

    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (typed.length > 0) advanceWord();
        return;
    }

    if (e.key === 'Backspace') {
        typed = typed.slice(0, -1);
        renderLyrics();
        return;
    }

    if (e.key.length !== 1) return;

    typed += e.key;
    if (typed !== word.slice(0, typed.length)) hasError = true;
    renderLyrics();

    // Sparkle on each character
    const pos = getCaretPos();
    spawnSparkles(pos.x, pos.y, 4);
}

function resetLyrics() {
    wordIdx  = 0;
    typed    = '';
    hasError = false;
    WORDS.forEach(w => delete w._error);
    renderLyrics();
}

// ── Sparkle System ────────────────────────────────────────
let sparkleCanvas = null;
let sparkleCtx    = null;
let sparkleFrame  = null;
let particles     = [];

const SPARKLE_COLORS = ['#ffd700', '#ffec7a', '#ff9500', '#ffffff', '#ffb347'];

function getCaretPos() {
    const caret = document.querySelector('#lyrics-curr .lc--caret, #lyrics-curr .lc-caret-end');
    if (caret) {
        const r = caret.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    const curr = document.getElementById('lyrics-curr');
    if (curr) {
        const r = curr.getBoundingClientRect();
        return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
}

function spawnSparkles(x, y, count = 5, burst = false) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? (Math.random() * 4 + 2) : (Math.random() * 2 + 0.8);
        particles.push({
            x:        x + (Math.random() - 0.5) * 12,
            y:        y + (Math.random() - 0.5) * 12,
            vx:       Math.cos(angle) * speed * 0.55,
            vy:       Math.sin(angle) * speed - (burst ? 3.5 : 2.2),
            life:     1,
            decay:    burst ? 0.016 : 0.024,
            size:     burst ? (Math.random() * 5 + 3) : (Math.random() * 3 + 1.5),
            color:    SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
            isStar:   Math.random() > 0.45,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.12,
        });
    }
}

function drawStar4(ctx, x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const a      = (i / 8) * Math.PI * 2 + rot;
        const radius = i % 2 === 0 ? r : r * 0.32;
        const px     = x + Math.cos(a) * radius;
        const py     = y + Math.sin(a) * radius;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
}

function sparkleLoop() {
    if (!sparkleCtx || !sparkleCanvas) return;
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    particles = particles.filter(p => p.life > 0.02);
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.97;
        p.life -= p.decay;
        p.rotation += p.rotSpeed;
        sparkleCtx.save();
        sparkleCtx.globalAlpha = Math.max(0, p.life * p.life);
        sparkleCtx.fillStyle   = p.color;
        sparkleCtx.shadowColor = p.color;
        sparkleCtx.shadowBlur  = p.size * 4;
        p.isStar
            ? drawStar4(sparkleCtx, p.x, p.y, p.size, p.rotation)
            : (sparkleCtx.beginPath(), sparkleCtx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2), sparkleCtx.fill());
        sparkleCtx.restore();
    }
    sparkleFrame = requestAnimationFrame(sparkleLoop);
}

function initSparkles(overlay) {
    sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:15;';
    sparkleCanvas.width  = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
    overlay.appendChild(sparkleCanvas);
    sparkleCtx  = sparkleCanvas.getContext('2d');
    sparkleFrame = requestAnimationFrame(sparkleLoop);
}

function destroySparkles() {
    if (sparkleFrame) { cancelAnimationFrame(sparkleFrame); sparkleFrame = null; }
    sparkleCanvas?.remove();
    sparkleCanvas = null;
    sparkleCtx    = null;
    particles     = [];
}

// ── GLSL ───────────────────────────────────────────────────
const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

const VERTS = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

// ── WebGL ──────────────────────────────────────────────────
let glCtx     = null;
let animFrame = null;

function setupGL(canvas) {
    const gl = canvas.getContext('webgl2');
    if (!gl) return null;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTEX_SRC); gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAGMENT_SRC); gl.compileShader(fs);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, VERTS, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    prog._res  = gl.getUniformLocation(prog, 'resolution');
    prog._time = gl.getUniformLocation(prog, 'time');
    return { gl, prog };
}

function resizeCanvas(canvas) {
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    if (glCtx) glCtx.gl.viewport(0, 0, canvas.width, canvas.height);
}

function renderLoop(now) {
    if (!glCtx) return;
    const { gl, prog } = glCtx;
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(prog._res, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(prog._time, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animFrame = requestAnimationFrame(renderLoop);
}

// ── SoundCloud ─────────────────────────────────────────────
let scIframe  = null;
let scWidget  = null;
let isPlaying = false;

function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
        ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
        : `${m}:${String(sec).padStart(2,'0')}`;
}

function setTotalTime(ms) {
    const el = document.getElementById('music-time-total');
    if (el) el.textContent = fmtTime(ms);
}

function updateScrubber(currentMs, relative) {
    const fill  = document.getElementById('music-progress-fill');
    const thumb = document.getElementById('music-progress-thumb');
    const cur   = document.getElementById('music-time-current');
    const pct   = (relative * 100).toFixed(2) + '%';
    if (fill)  fill.style.width = pct;
    if (thumb) thumb.style.left = pct;
    if (cur)   cur.textContent  = fmtTime(currentMs);
}

function updateVolIcon(val) {
    const btn = document.getElementById('music-vol-btn');
    if (!btn) return;
    const v = Number(val);
    btn.innerHTML = v === 0
        ? '<i class="ri-volume-mute-line"></i>'
        : v < 40
        ? '<i class="ri-volume-down-line"></i>'
        : '<i class="ri-volume-up-line"></i>';
    document.getElementById('music-vol-slider')
        ?.style.setProperty('--vol-pct', v + '%');
}

function setPlayBtn(playing) {
    const btn = document.getElementById('music-play-btn');
    if (!btn) return;
    btn.innerHTML = playing ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>';
    btn.classList.toggle('is-playing', playing);
}

function initScrubber() {
    const track = document.getElementById('music-progress-track');
    if (!track) return;
    let dragging = false;
    const seek = (e) => {
        if (!scWidget) return;
        const rect = track.getBoundingClientRect();
        const pct  = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        scWidget.getDuration(ms => scWidget.seekTo(pct * ms));
        document.getElementById('music-progress-fill').style.width = (pct*100)+'%';
        document.getElementById('music-progress-thumb').style.left = (pct*100)+'%';
    };
    track.addEventListener('pointerdown', (e) => { dragging = true; track.setPointerCapture(e.pointerId); seek(e); });
    track.addEventListener('pointermove', (e) => { if (dragging) seek(e); });
    track.addEventListener('pointerup',   ()  => { dragging = false; });
}

function injectPlayer() {
    if (scIframe) return;
    scIframe = document.createElement('iframe');
    scIframe.id    = 'sc-widget';
    scIframe.allow = 'autoplay';
    scIframe.src   = `https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}&auto_play=true&color=%23ffd700&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    scIframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;';
    document.body.appendChild(scIframe);

    const sdk = document.createElement('script');
    sdk.src = 'https://w.soundcloud.com/player/api.js';
    sdk.onload = () => {
        scWidget = SC.Widget(scIframe);
        scWidget.bind(SC.Widget.Events.READY, () => {
            scWidget.getDuration(ms => setTotalTime(ms));
            scWidget.setVolume(80);
        });

        let revealed = false;
        function revealUI() {
            if (revealed) return;
            revealed = true;
            isPlaying = true; setPlayBtn(true);
            const loading  = document.getElementById('music-loading');
            const lyricsEl = document.getElementById('music-lyrics-area');
            const controls = document.getElementById('music-controls');
            lyricsEl.style.display = '';
            lyricsEl.style.opacity = '0';
            loading.classList.add('fade-out');
            requestAnimationFrame(() => requestAnimationFrame(() => {
                lyricsEl.style.opacity       = '1';
                controls.style.opacity       = '1';
                controls.style.pointerEvents = 'all';
            }));
            setTimeout(() => { loading.style.display = 'none'; }, 700);
            document.getElementById('music-lyrics-input')?.focus();
        }

        scWidget.bind(SC.Widget.Events.PLAY, () => { revealUI(); isPlaying = true; setPlayBtn(true); });
        scWidget.bind(SC.Widget.Events.PAUSE,         () => { isPlaying = false; setPlayBtn(false); });
        scWidget.bind(SC.Widget.Events.FINISH,        () => { isPlaying = false; setPlayBtn(false); });
        scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => updateScrubber(e.currentPosition, e.relativePosition));
    };
    document.head.appendChild(sdk);
}

function destroyPlayer() {
    if (scWidget) { try { scWidget.pause(); } catch(_){} scWidget = null; }
    if (scIframe) { scIframe.remove(); scIframe = null; }
    isPlaying = false;
    setPlayBtn(false);
}

// ── Show / Hide ────────────────────────────────────────────
function showMusicOverlay() {
    const overlay = document.getElementById('music-mode-overlay');
    const canvas  = document.getElementById('music-shader-canvas');
    if (!overlay || !canvas) return;

    document.getElementById('settings-modal')?.classList.add('hidden');
    overlay.classList.remove('hidden');

    // Silence background wallpaper while music mode is active
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) bgVideo.pause();

    // Restart title animations each open
    const titleBlock = document.getElementById('music-overlay-title-block');
    if (titleBlock) {
        titleBlock.style.animation = 'none';
        titleBlock.querySelectorAll('.music-overlay-label, .music-overlay-title, .music-overlay-artist')
            .forEach(el => el.style.animation = 'none');
        requestAnimationFrame(() => {
            titleBlock.style.animation = '';
            titleBlock.querySelectorAll('.music-overlay-label, .music-overlay-title, .music-overlay-artist')
                .forEach(el => el.style.animation = '');
        });
    }

    resizeCanvas(canvas);
    glCtx = setupGL(canvas);
    if (glCtx) animFrame = requestAnimationFrame(renderLoop);

    initSparkles(overlay);

    const onResize = () => {
        resizeCanvas(canvas);
        if (sparkleCanvas) {
            sparkleCanvas.width  = window.innerWidth;
            sparkleCanvas.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', onResize);
    overlay._onResize = onResize;

    // Show loading, hide content until SC ready
    document.getElementById('music-loading').style.display     = '';
    document.getElementById('music-lyrics-area').style.display = 'none';
    document.getElementById('music-controls').style.opacity    = '0';
    document.getElementById('music-controls').style.pointerEvents = 'none';

    initScrubber();
    resetLyrics();

    // Focus the lyrics input
    setTimeout(() => document.getElementById('music-lyrics-input')?.focus(), 100);

    injectPlayer();
}

function hideMusicOverlay() {
    const overlay = document.getElementById('music-mode-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        if (overlay._onResize) {
            window.removeEventListener('resize', overlay._onResize);
            delete overlay._onResize;
        }
    }
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (glCtx)     { glCtx.gl.deleteProgram(glCtx.prog); glCtx = null; }
    destroySparkles();
    destroyPlayer();

    // Resume background video that browser paused when SC audio started
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) bgVideo.play().catch(() => {});
}

// ── Wire up ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Collapsible header
    const toggle  = document.getElementById('music-mode-toggle');
    const list    = document.getElementById('music-mode-list');
    const chevron = toggle?.querySelector('.music-toggle-chevron');
    toggle?.addEventListener('click', () => {
        const isOpen = list.style.display !== 'none';
        list.style.display = isOpen ? 'none' : 'grid';
        chevron?.classList.toggle('music-toggle-chevron--open', !isOpen);
    });

    document.getElementById('golden-brown-card')
        ?.addEventListener('click', showMusicOverlay);

    document.getElementById('music-overlay-back')
        ?.addEventListener('click', hideMusicOverlay);

    document.getElementById('music-play-btn')
        ?.addEventListener('click', () => {
            if (!scWidget) return;
            isPlaying ? scWidget.pause() : scWidget.play();
        });

    // Volume
    const volBtn    = document.getElementById('music-vol-btn');
    const volSlider = document.getElementById('music-vol-slider');

    const volWrap = document.getElementById('music-vol-slider-wrap');
    volBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        volWrap?.classList.toggle('open');
    });

    // Close slider when clicking elsewhere
    document.getElementById('music-mode-overlay')
        ?.addEventListener('click', (e) => {
            if (!e.target.closest('#music-volume')) {
                volWrap?.classList.remove('open');
            }
        });

    volSlider?.addEventListener('input', () => {
        if (scWidget) scWidget.setVolume(volSlider.value);
        updateVolIcon(volSlider.value);
        volSlider.style.setProperty('--vol-pct', volSlider.value + '%');
    });

    // Lyrics input
    const input = document.getElementById('music-lyrics-input');
    input?.addEventListener('keydown', handleLyricsKey);

    // Keep input focused when overlay is clicked
    document.getElementById('music-mode-overlay')
        ?.addEventListener('click', (e) => {
            if (!e.target.closest('button, #music-progress-track')) {
                input?.focus();
            }
        });
});
