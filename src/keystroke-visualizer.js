// ═══════════════════════════════════════════════════════════
// LIVE KEYSTROKE VISUALIZER — 10 Styles
// Bottom-left animated display that reacts to keypresses
// ═══════════════════════════════════════════════════════════

(function () {
    const canvas = document.getElementById('keystroke-visualizer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Shared State ──
    let currentStyle = localStorage.getItem('vizStyle') || 'equalizer';
    let animFrameId = null;
    let idlePhase = 0;

    // ── Color Helpers ──
    // Default cyan for first-time users (matches Koi Pond theme), empty for returning users
    let customVizColor = localStorage.getItem('vizColor') || (localStorage.getItem('zenType_config') ? '' : '#00d4ff');

    function getAccentColor() {
        if (customVizColor) return customVizColor;
        const root = getComputedStyle(document.documentElement);
        return root.getPropertyValue('--accent-gold')?.trim() || '#ffd700';
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
    }

    // ── Resize for DPI ──
    let W, H;
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        
        // Prevent canvas internal size from inflating the rect by locking CSS size or reading parent
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        
        // If parent has padding, we might want just clientWidth/clientHeight or assume it's snug
        // Let's lock the canvas CSS size to the measured parent size
        const cssWidth = rect.width || 280;
        const cssHeight = rect.height || 40;
        
        canvas.style.width = cssWidth + 'px';
        canvas.style.height = cssHeight + 'px';

        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        W = cssWidth;
        H = cssHeight;
    }

    // ══════════════════════════════════════════════════════════
    //  STYLE 1: EQUALIZER — Classic random audio bars
    // ══════════════════════════════════════════════════════════
    const eq = {
        bars: new Array(32).fill(0),
        nextBar: 0,
        trigger() {
            const spread = Math.floor(Math.random() * 2) + 1;
            for (let s = -spread; s <= spread; s++) {
                const idx = (eq.nextBar + s + 32) % 32;
                const intensity = s === 0 ? (0.7 + Math.random() * 0.3) : (0.3 + Math.random() * 0.3);
                eq.bars[idx] = Math.min(1, Math.max(eq.bars[idx], intensity));
            }
            eq.nextBar = (eq.nextBar + 1 + Math.floor(Math.random() * 2)) % 32;
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            const barW = (W - 31 * 2) / 32;
            for (let i = 0; i < 32; i++) {
                eq.bars[i] = Math.max(0, eq.bars[i] - 0.03);
                const idle = (Math.sin(idlePhase + i * 0.4) * 0.5 + 0.5) * 0.1;
                const dh = Math.max(2 / H, eq.bars[i] + idle * (1 - eq.bars[i]));
                const x = i * (barW + 2), h = dh * H, y = H - h;
                if (eq.bars[i] > 0.05) { ctx.shadowColor = `rgba(${r},${g},${b},${eq.bars[i] * 0.4})`; ctx.shadowBlur = 8; }
                const grad = ctx.createLinearGradient(x, y, x, H);
                const a = 0.3 + dh * 0.7;
                grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
                grad.addColorStop(1, `rgba(${r},${g},${b},${a * 0.3})`);
                ctx.fillStyle = grad;
                const rad = Math.min(barW / 2, 3);
                ctx.beginPath();
                ctx.moveTo(x + rad, y); ctx.lineTo(x + barW - rad, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + rad);
                ctx.lineTo(x + barW, H); ctx.lineTo(x, H); ctx.lineTo(x, y + rad);
                ctx.quadraticCurveTo(x, y, x + rad, y);
                ctx.closePath(); ctx.fill();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 2: MIRRORED — Symmetric bars from center line
    // ══════════════════════════════════════════════════════════
    const mirrored = {
        bars: new Array(32).fill(0),
        trigger() {
            const count = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * 32);
                mirrored.bars[idx] = Math.min(1, 0.5 + Math.random() * 0.5);
            }
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            const barW = (W - 31 * 2) / 32;
            const mid = H / 2;
            // Center line
            ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
            for (let i = 0; i < 32; i++) {
                mirrored.bars[i] = Math.max(0, mirrored.bars[i] - 0.03);
                const idle = (Math.sin(idlePhase + i * 0.35) * 0.5 + 0.5) * 0.08;
                const dh = Math.max(1 / H, mirrored.bars[i] + idle * (1 - mirrored.bars[i]));
                const x = i * (barW + 2);
                const halfH = dh * mid;
                const a = 0.25 + dh * 0.75;
                if (mirrored.bars[i] > 0.05) { ctx.shadowColor = `rgba(${r},${g},${b},${mirrored.bars[i] * 0.3})`; ctx.shadowBlur = 6; }
                // Top half
                const g1 = ctx.createLinearGradient(x, mid - halfH, x, mid);
                g1.addColorStop(0, `rgba(${r},${g},${b},${a})`);
                g1.addColorStop(1, `rgba(${r},${g},${b},${a * 0.2})`);
                ctx.fillStyle = g1;
                ctx.fillRect(x, mid - halfH, barW, halfH);
                // Bottom half
                const g2 = ctx.createLinearGradient(x, mid, x, mid + halfH);
                g2.addColorStop(0, `rgba(${r},${g},${b},${a * 0.2})`);
                g2.addColorStop(1, `rgba(${r},${g},${b},${a})`);
                ctx.fillStyle = g2;
                ctx.fillRect(x, mid, barW, halfH);
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 3: CIRCULAR — Bars in a circle pulsing outward
    // ══════════════════════════════════════════════════════════
    const circular = {
        bars: new Array(24).fill(0),
        trigger() {
            const count = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * 24);
                circular.bars[idx] = Math.min(1, 0.5 + Math.random() * 0.5);
            }
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            const cx = W / 2, cy = H / 2;
            const baseR = Math.min(W, H) * 0.2;
            const maxBarH = Math.min(W, H) * 0.25;
            for (let i = 0; i < 24; i++) {
                circular.bars[i] = Math.max(0, circular.bars[i] - 0.025);
                const idle = (Math.sin(idlePhase + i * 0.5) * 0.5 + 0.5) * 0.1;
                const dh = Math.max(0.05, circular.bars[i] + idle * (1 - circular.bars[i]));
                const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
                const x1 = cx + Math.cos(angle) * baseR;
                const y1 = cy + Math.sin(angle) * baseR;
                const barLen = baseR + dh * maxBarH;
                const x2 = cx + Math.cos(angle) * barLen;
                const y2 = cy + Math.sin(angle) * barLen;
                const a = 0.3 + dh * 0.7;
                ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                if (circular.bars[i] > 0.1) { ctx.shadowColor = `rgba(${r},${g},${b},${circular.bars[i] * 0.5})`; ctx.shadowBlur = 8; }
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
            // Center dot
            ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
            ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 4: HEARTBEAT — ECG-style line
    // ══════════════════════════════════════════════════════════
    const heartbeat = {
        points: new Array(80).fill(0),
        spikes: [],
        trigger() {
            // Insert a spike at a random-ish position near the "write head"
            const pos = heartbeat.writeHead;
            heartbeat.spikes.push({ pos, amp: 0.5 + Math.random() * 0.5, phase: 0 });
        },
        writeHead: 0,
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            const n = heartbeat.points.length;
            heartbeat.writeHead = (heartbeat.writeHead + 0.3) % n;

            // Process spikes into points
            for (let s = heartbeat.spikes.length - 1; s >= 0; s--) {
                const sp = heartbeat.spikes[s];
                sp.phase += 0.15;
                if (sp.phase > Math.PI) { heartbeat.spikes.splice(s, 1); continue; }
                const idx = Math.round(sp.pos) % n;
                const spread = 3;
                for (let d = -spread; d <= spread; d++) {
                    const ii = (idx + d + n) % n;
                    const env = Math.sin(sp.phase) * sp.amp;
                    const shape = d === 0 ? 1 : d === -1 || d === 1 ? -0.4 : 0.15;
                    heartbeat.points[ii] = Math.max(-1, Math.min(1, heartbeat.points[ii] + env * shape * 0.2));
                }
            }

            // Decay points
            for (let i = 0; i < n; i++) heartbeat.points[i] *= 0.92;

            // Idle baseline wobble
            const baseY = H / 2;
            ctx.strokeStyle = `rgba(${r},${g},${b},0.7)`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
                const x = (i / (n - 1)) * W;
                const idle = Math.sin(idlePhase * 2 + i * 0.2) * 1.5;
                const y = baseY - heartbeat.points[i] * (H * 0.4) + idle;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;

            // Faint baseline
            ctx.strokeStyle = `rgba(${r},${g},${b},0.08)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(W, baseY); ctx.stroke();
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 5: WAVE — Smooth sine wave that ripples
    // ══════════════════════════════════════════════════════════
    const wave = {
        amplitude: 0,
        freq: 0,
        trigger() {
            wave.amplitude = Math.min(1, wave.amplitude + 0.3 + Math.random() * 0.2);
            wave.freq += 0.5 + Math.random() * 0.5;
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            wave.amplitude = Math.max(0, wave.amplitude - 0.012);
            wave.freq = Math.max(0, wave.freq - 0.02);

            const mid = H / 2;
            const idleAmp = 3;
            const activeAmp = wave.amplitude * (H * 0.35);
            const baseFreq = 0.03;
            const activeFreq = baseFreq + wave.freq * 0.005;

            // Draw 3 layered waves
            for (let layer = 0; layer < 3; layer++) {
                const layerOffset = layer * 0.8;
                const layerAlpha = (0.5 - layer * 0.12);
                const lw = 2 - layer * 0.5;
                ctx.strokeStyle = `rgba(${r},${g},${b},${layerAlpha})`;
                ctx.lineWidth = lw;
                if (layer === 0 && wave.amplitude > 0.1) {
                    ctx.shadowColor = `rgba(${r},${g},${b},${wave.amplitude * 0.3})`;
                    ctx.shadowBlur = 8;
                }
                ctx.beginPath();
                for (let x = 0; x <= W; x += 2) {
                    const y = mid + Math.sin(idlePhase * 1.5 + x * activeFreq + layerOffset) * (idleAmp + activeAmp) +
                        Math.sin(idlePhase * 0.7 + x * 0.015 + layerOffset * 2) * (idleAmp * 0.5);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
        }
    };


    // ══════════════════════════════════════════════════════════
    //  STYLE 7: SPECTRUM — Rainbow gradient frequency bars
    // ══════════════════════════════════════════════════════════
    const spectrum = {
        bars: new Array(32).fill(0),
        trigger() {
            const count = 2 + Math.floor(Math.random() * 4);
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * 32);
                spectrum.bars[idx] = Math.min(1, 0.5 + Math.random() * 0.5);
            }
        },
        render() {
            const barW = (W - 31 * 1.5) / 32;
            for (let i = 0; i < 32; i++) {
                spectrum.bars[i] = Math.max(0, spectrum.bars[i] - 0.025);
                const idle = (Math.sin(idlePhase + i * 0.3) * 0.5 + 0.5) * 0.08;
                const dh = Math.max(2 / H, spectrum.bars[i] + idle * (1 - spectrum.bars[i]));
                const hue = (i / 32) * 300 + idlePhase * 10;
                const { r, g, b } = hslToRgb(hue % 360, 80, 55);
                const x = i * (barW + 1.5), h = dh * H, y = H - h;
                const a = 0.3 + dh * 0.7;
                if (spectrum.bars[i] > 0.1) {
                    ctx.shadowColor = `rgba(${r},${g},${b},${spectrum.bars[i] * 0.4})`;
                    ctx.shadowBlur = 8;
                }
                const grad = ctx.createLinearGradient(x, y, x, H);
                grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
                grad.addColorStop(1, `rgba(${r},${g},${b},${a * 0.2})`);
                ctx.fillStyle = grad;
                const rad = Math.min(barW / 2, 3);
                ctx.beginPath();
                ctx.moveTo(x + rad, y); ctx.lineTo(x + barW - rad, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + rad);
                ctx.lineTo(x + barW, H); ctx.lineTo(x, H); ctx.lineTo(x, y + rad);
                ctx.quadraticCurveTo(x, y, x + rad, y);
                ctx.closePath(); ctx.fill();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 8: RAIN — Droplets falling from top
    // ══════════════════════════════════════════════════════════
    const rain = {
        drops: [],
        trigger() {
            const count = 3 + Math.floor(Math.random() * 4);
            for (let i = 0; i < count; i++) {
                rain.drops.push({
                    x: Math.random() * 280,
                    y: -2,
                    speed: 1.5 + Math.random() * 2.5,
                    length: 4 + Math.random() * 8,
                    alpha: 0.4 + Math.random() * 0.6
                });
            }
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            // Idle ambient drops
            if (Math.random() < 0.03) {
                rain.drops.push({
                    x: Math.random() * W,
                    y: -2,
                    speed: 0.5 + Math.random() * 1,
                    length: 3 + Math.random() * 5,
                    alpha: 0.1 + Math.random() * 0.2
                });
            }
            for (let i = rain.drops.length - 1; i >= 0; i--) {
                const d = rain.drops[i];
                d.y += d.speed;
                if (d.y > H + d.length) { rain.drops.splice(i, 1); continue; }
                ctx.strokeStyle = `rgba(${r},${g},${b},${d.alpha})`;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                if (d.alpha > 0.4) {
                    ctx.shadowColor = `rgba(${r},${g},${b},${d.alpha * 0.3})`;
                    ctx.shadowBlur = 4;
                }
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x, d.y - d.length);
                ctx.stroke();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;

                // Splash at bottom
                if (d.y >= H - 2 && d.y < H + 2) {
                    ctx.fillStyle = `rgba(${r},${g},${b},${d.alpha * 0.5})`;
                    ctx.beginPath(); ctx.arc(d.x, H - 1, 2, 0, Math.PI * 2); ctx.fill();
                }
            }
            // Cap drops array
            if (rain.drops.length > 80) rain.drops.splice(0, rain.drops.length - 80);
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 9: PULSE — Expanding concentric rings
    // ══════════════════════════════════════════════════════════
    const pulse = {
        rings: [],
        trigger() {
            pulse.rings.push({
                x: W * (0.2 + Math.random() * 0.6),
                y: H * (0.3 + Math.random() * 0.4),
                radius: 0,
                maxRadius: 15 + Math.random() * 25,
                alpha: 0.7 + Math.random() * 0.3,
                speed: 0.8 + Math.random() * 0.8
            });
        },
        render() {
            const { r, g, b } = hexToRgb(getAccentColor());
            // Idle pulse
            const idleR = 3 + Math.sin(idlePhase) * 2;
            ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(W / 2, H / 2, idleR, 0, Math.PI * 2); ctx.stroke();

            for (let i = pulse.rings.length - 1; i >= 0; i--) {
                const ring = pulse.rings[i];
                ring.radius += ring.speed;
                const progress = ring.radius / ring.maxRadius;
                const a = ring.alpha * (1 - progress);
                if (a <= 0.01) { pulse.rings.splice(i, 1); continue; }
                ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
                ctx.lineWidth = 2 * (1 - progress * 0.5);
                ctx.shadowColor = `rgba(${r},${g},${b},${a * 0.4})`;
                ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2); ctx.stroke();
                // Inner fill
                ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.08})`;
                ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2); ctx.fill();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
            if (pulse.rings.length > 20) pulse.rings.splice(0, pulse.rings.length - 20);
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE 10: EMBER — Glowing particles that float up
    // ══════════════════════════════════════════════════════════
    const ember = {
        particles: [],
        trigger() {
            const count = 4 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                ember.particles.push({
                    x: Math.random() * 280,
                    y: 40,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -(1 + Math.random() * 2),
                    size: 1.5 + Math.random() * 2.5,
                    life: 1,
                    decay: 0.01 + Math.random() * 0.02,
                    hueShift: Math.random() * 30 - 15
                });
            }
        },
        render() {
            const accent = getAccentColor();
            const { r: br, g: bg, b: bb } = hexToRgb(accent);
            // Idle ambient embers
            if (Math.random() < 0.04) {
                ember.particles.push({
                    x: Math.random() * W,
                    y: H,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -(0.3 + Math.random() * 0.5),
                    size: 1 + Math.random() * 1.5,
                    life: 0.3 + Math.random() * 0.3,
                    decay: 0.005 + Math.random() * 0.01,
                    hueShift: Math.random() * 20 - 10
                });
            }
            for (let i = ember.particles.length - 1; i >= 0; i--) {
                const p = ember.particles[i];
                p.x += p.vx + Math.sin(idlePhase * 3 + i) * 0.2;
                p.y += p.vy;
                p.vy *= 0.995;
                p.life -= p.decay;
                if (p.life <= 0 || p.y < -5) { ember.particles.splice(i, 1); continue; }
                const a = p.life;
                // Warm color shift
                const r = Math.min(255, br + p.hueShift);
                const g = Math.max(0, bg + p.hueShift * 0.5);
                const b = Math.max(0, bb - Math.abs(p.hueShift));
                ctx.shadowColor = `rgba(${r},${g},${b},${a * 0.5})`;
                ctx.shadowBlur = p.size * 3;
                ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            }
            if (ember.particles.length > 100) ember.particles.splice(0, ember.particles.length - 100);
        }
    };

    // ══════════════════════════════════════════════════════════
    //  STYLE REGISTRY
    // ══════════════════════════════════════════════════════════
    const styles = {
        equalizer: eq,
        mirrored: mirrored,
        circular: circular,
        heartbeat: heartbeat,
        wave: wave,
        spectrum: spectrum,
        rain: rain,
        pulse: pulse,
        ember: ember
    };

    // Styles that ignore custom color (they use their own palette)
    const fixedColorStyles = ['spectrum'];

    // ══════════════════════════════════════════════════════════
    //  MAIN RENDER LOOP
    // ══════════════════════════════════════════════════════════
    function render() {
        ctx.clearRect(0, 0, W, H);
        idlePhase += 0.015;
        const style = styles[currentStyle] || styles.equalizer;
        style.render();
        animFrameId = requestAnimationFrame(render);
    }

    // ══════════════════════════════════════════════════════════
    //  INPUT HANDLING
    // ══════════════════════════════════════════════════════════
    document.addEventListener('keydown', function (e) {
        if (['Shift', 'Control', 'Alt', 'Meta', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5',
            'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) return;
        const style = styles[currentStyle] || styles.equalizer;
        style.trigger();
    });

    // ══════════════════════════════════════════════════════════
    //  PUBLIC API — used by settings UI
    // ══════════════════════════════════════════════════════════
    window.setVisualizerStyle = function (styleName) {
        if (styles[styleName]) {
            currentStyle = styleName;
            localStorage.setItem('vizStyle', styleName);
            // Highlight active button
            document.querySelectorAll('.viz-style-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.vizStyle === styleName);
            });
            // Show/hide color picker based on style
            const colorRow = document.getElementById('viz-color-row');
            if (colorRow) {
                colorRow.style.display = fixedColorStyles.includes(styleName) ? 'none' : 'flex';
            }
        }
    };

    window.getVisualizerStyle = function () {
        return currentStyle;
    };

    window.setVisualizerColor = function (color) {
        if (color) {
            customVizColor = color;
            localStorage.setItem('vizColor', color);
        }
    };

    window.resetVisualizerColor = function () {
        customVizColor = '';
        localStorage.removeItem('vizColor');
    };

    // ══════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════
    setTimeout(() => {
        resizeCanvas();
        render();
        // Sync button active state on load
        document.querySelectorAll('.viz-style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.vizStyle === currentStyle);
        });
        // Sync color picker visibility
        const colorRow = document.getElementById('viz-color-row');
        if (colorRow) {
            colorRow.style.display = fixedColorStyles.includes(currentStyle) ? 'none' : 'flex';
        }
        // Sync color picker value and dot active state
        const picker = document.getElementById('viz-color-picker');
        if (picker && customVizColor) picker.value = customVizColor;
        if (customVizColor) {
            document.querySelectorAll('.viz-color-dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.vizColor === customVizColor);
            });
        }
    }, 100);

    window.addEventListener('resize', resizeCanvas);
})();
