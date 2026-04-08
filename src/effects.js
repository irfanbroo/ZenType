// ══════════════════════════════════════════════════════════
// EFFECTS ENGINE — Background effects + keypress particles
// ══════════════════════════════════════════════════════════

// --- Config/UI references (set by script.js at init) ---
let _config = {};
let _particleCanvas = null;
let _keypressCanvas = null;

export function setEffectsRefs(config, particleCanvas, keypressCanvas) {
    _config = config;
    _particleCanvas = particleCanvas;
    _keypressCanvas = keypressCanvas;
}

export let effectAnimId = null;
export function setEffectAnimId(id) { effectAnimId = id; }

let keyParticles = [];
let keypressAnimId = null;
export function getKeypressAnimId() { return keypressAnimId; }
export function setKeypressAnimId(id) { keypressAnimId = id; }
export function getKeyParticles() { return keyParticles; }

// --- 3. EFFECTS ENGINE ---


function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export function initParticles() {
    if (effectAnimId) cancelAnimationFrame(effectAnimId);
    const canvas = _particleCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const type = _config.effectType || 'dust';
    const effects = { dust: runDustEffect, matrix: runMatrixEffect, starfield: runStarfieldEffect, fireflies: runFirefliesEffect, snow: runSnowEffect, rain: runRainEffect };
    (effects[type] || effects.dust)(canvas);
}

// ── EFFECT 1: FLOATING DUST ──
function runDustEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const intensity = _config.effectIntensity / 50; // 0.2 to 2.0
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#ffd700');
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
export function playSoundSheath(ctx, vol) {
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

export function playSoundGong(ctx, vol) {
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
    const intensity = _config.effectIntensity / 50;
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#39ff14');
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
    const intensity = _config.effectIntensity / 50;
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#ffffff');
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
    const intensity = _config.effectIntensity / 50;
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#ffd700');
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
    const intensity = _config.effectIntensity / 50;
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#ffffff');
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
    const intensity = _config.effectIntensity / 50;
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
        const { r, g, b } = hexToRgb(_config.effectColor || '#00d4ff');
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
    _particleCanvas.width = window.innerWidth;
    _particleCanvas.height = window.innerHeight;
});

// ── KEYPRESS PARTICLES ──
let keyCtx;

export function initKeypressParticles() {
    const canvas = _keypressCanvas;
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

export function loopKeypressParticles() {
    if (!keyCtx) return;

    keyCtx.clearRect(0, 0, _keypressCanvas.width, _keypressCanvas.height);

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

export function spawnKeypressParticles(x, y) {
    if (!_config.particle) return;

    const count = 4 + Math.random() * 6;
    const color = _config.particleColor || '#ffd700';
    const shape = _config.particleShape || 'default';

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

export function spawnHagakureParticles(x, y) {
    // Blood splash is intrinsic to hagakure mode — always spawn regardless of particle toggle

    // Ensure keypress canvas context is ready
    if (!keyCtx && _keypressCanvas) {
        keyCtx = _keypressCanvas.getContext('2d');
        _keypressCanvas.width = window.innerWidth;
        _keypressCanvas.height = window.innerHeight;
    }
    if (!keyCtx) return;

    // Force canvas visible (overrides clean-mode display:none !important)
    if (_keypressCanvas) _keypressCanvas.classList.add('force-visible');

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


