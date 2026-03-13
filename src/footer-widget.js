// ═══════════════════════════════════════════════════════════
// FOOTER WIDGET MANAGER
// Widgets: Visualizer | Live Stats | Progress
// ═══════════════════════════════════════════════════════════

(function () {
    let currentWidget = localStorage.getItem('footerWidget') || 'visualizer';

    // ═══════════════════════════════════════════════════════════
    //  LIVE STATS — Rank tiers + Flow states
    // ═══════════════════════════════════════════════════════════
    const ranks = [
        { min: 0, icon: '🥉', label: 'Bronze' },
        { min: 25, icon: '🥈', label: 'Silver' },
        { min: 45, icon: '🥇', label: 'Gold' },
        { min: 65, icon: '💎', label: 'Diamond' },
        { min: 85, icon: '👑', label: 'Legend' }
    ];

    const flowStates = [
        { label: 'Cold', icon: '🧊', className: 'level-cold' },
        { label: 'Warm', icon: '🔥', className: 'level-warm' },
        { label: 'Flow', icon: '⚡', className: 'level-flow' },
        { label: 'Zen', icon: '💜', className: 'level-zen' }
    ];

    let keystrokeTimestamps = [];
    let lastRankLabel = '';
    let tickerColor = localStorage.getItem('tickerColor') || '';

    function getTickerColor() {
        if (tickerColor) return tickerColor;
        const root = getComputedStyle(document.documentElement);
        return root.getPropertyValue('--accent-gold')?.trim() || '#ffd700';
    }

    function applyTickerColor() {
        const color = getTickerColor();
        const el = document.getElementById('ticker-wpm');
        if (el) {
            el.style.color = color;
            el.style.textShadow = `0 0 12px ${color}40`;
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  PROGRESS — Beat your last score
    // ═══════════════════════════════════════════════════════════
    let progressColor = localStorage.getItem('progressColor') || '';
    let progressTheme = localStorage.getItem('progressTheme') || 'clean';
    let prevWpm = 0;
    let lastWpmResult = 0;
    let progressUserId = '';  // Set by auth.js on login/logout
    let personalBest = 0;  // Loaded when auth resolves via setProgressUserId
    let winStreak = 0;
    let justHitPB = false;  // Flag set by onTestComplete, consumed by renderProgress
    let wpmHistory = [];    // Last 10 WPM scores for sparkline
    const MAX_HISTORY = 10;
    let sparklineEnabled = localStorage.getItem('sparklineEnabled') !== 'false';
    let sparklineStyle = localStorage.getItem('sparklineStyle') || 'line';
    let sparklineColor = localStorage.getItem('sparklineColor') || '';

    function getPBKey() {
        return progressUserId ? `progressPB_${progressUserId}` : 'progressPB';
    }

    function getHistoryKey() {
        return progressUserId ? `progressHistory_${progressUserId}` : 'progressHistory';
    }

    function loadPB() {
        personalBest = parseInt(localStorage.getItem(getPBKey())) || 0;
    }

    function loadHistory() {
        try {
            wpmHistory = JSON.parse(localStorage.getItem(getHistoryKey())) || [];
        } catch { wpmHistory = []; }
    }

    function saveHistory() {
        localStorage.setItem(getHistoryKey(), JSON.stringify(wpmHistory));
    }

    function drawSparkline() {
        const wrap = document.getElementById('progress-sparkline-wrap');
        const canvas = document.getElementById('progress-sparkline');
        if (!canvas || !wrap) return;

        if (!sparklineEnabled || wpmHistory.length < 2) {
            wrap.style.display = 'none';
            return;
        }
        wrap.style.display = '';

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0) return;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;
        const pad = 4;

        ctx.clearRect(0, 0, W, H);

        const data = wpmHistory;
        const min = Math.max(0, Math.min(...data) - 5);
        const max = Math.max(...data) + 5;
        const range = max - min || 1;
        const color = getSparklineColor();

        const getX = (i) => pad + (i / (data.length - 1)) * (W - pad * 2);
        const getY = (v) => H - pad - ((v - min) / range) * (H - pad * 2);

        if (sparklineStyle === 'bars') {
            // ── BARS ──
            const barW = Math.max(3, (W - pad * 2) / data.length - 2);
            for (let i = 0; i < data.length; i++) {
                const x = pad + (i / data.length) * (W - pad * 2);
                const h = ((data[i] - min) / range) * (H - pad * 2);
                const isLast = i === data.length - 1;

                ctx.save();
                if (isLast) { ctx.shadowColor = color; ctx.shadowBlur = 6; }
                ctx.fillStyle = isLast ? color : color + '70';
                ctx.beginPath();
                ctx.roundRect(x, H - pad - h, barW, h, [2, 2, 0, 0]);
                ctx.fill();
                ctx.restore();
            }

        } else if (sparklineStyle === 'dots') {
            // ── DOTS ──
            // Faint connecting lines
            ctx.beginPath();
            ctx.strokeStyle = color + '25';
            ctx.lineWidth = 1;
            for (let i = 0; i < data.length; i++) {
                if (i === 0) ctx.moveTo(getX(i), getY(data[i]));
                else ctx.lineTo(getX(i), getY(data[i]));
            }
            ctx.stroke();

            // Dots
            for (let i = 0; i < data.length; i++) {
                const isLast = i === data.length - 1;
                ctx.save();
                if (isLast) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
                ctx.beginPath();
                ctx.arc(getX(i), getY(data[i]), isLast ? 4 : 2.5, 0, Math.PI * 2);
                ctx.fillStyle = isLast ? color : color + '80';
                ctx.fill();
                ctx.restore();
            }

        } else if (sparklineStyle === 'pulse') {
            // ── PULSE — thick line, glowing endpoint ──
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            for (let i = 0; i < data.length; i++) {
                if (i === 0) ctx.moveTo(getX(i), getY(data[i]));
                else ctx.lineTo(getX(i), getY(data[i]));
            }
            ctx.stroke();
            ctx.restore();

            // Pulsing endpoint
            const lx = getX(data.length - 1);
            const ly = getY(data[data.length - 1]);
            for (let r = 8; r >= 3; r -= 2.5) {
                ctx.beginPath();
                ctx.arc(lx, ly, r, 0, Math.PI * 2);
                ctx.fillStyle = color + (r > 5 ? '20' : r > 3 ? '50' : 'ff');
                ctx.fill();
            }

        } else if (sparklineStyle === 'steps') {
            // ── STEPS — staircase ──
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.moveTo(getX(0), getY(data[0]));
            for (let i = 1; i < data.length; i++) {
                ctx.lineTo(getX(i), getY(data[i - 1]));  // horizontal
                ctx.lineTo(getX(i), getY(data[i]));      // vertical
            }
            ctx.stroke();
            ctx.restore();

            // Fill below steps
            ctx.lineTo(getX(data.length - 1), H);
            ctx.lineTo(getX(0), H);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, color + '20');
            grad.addColorStop(1, color + '05');
            ctx.fillStyle = grad;
            ctx.fill();

            // Endpoint dot
            ctx.beginPath();
            ctx.arc(getX(data.length - 1), getY(data[data.length - 1]), 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

        } else if (sparklineStyle === 'wave') {
            // ── WAVE — smooth bezier curves ──
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.moveTo(getX(0), getY(data[0]));
            for (let i = 1; i < data.length; i++) {
                const cpx = (getX(i - 1) + getX(i)) / 2;
                ctx.bezierCurveTo(cpx, getY(data[i - 1]), cpx, getY(data[i]), getX(i), getY(data[i]));
            }
            ctx.stroke();
            ctx.restore();

            // Gradient fill below wave
            ctx.lineTo(getX(data.length - 1), H);
            ctx.lineTo(getX(0), H);
            ctx.closePath();
            const wGrad = ctx.createLinearGradient(0, 0, 0, H);
            wGrad.addColorStop(0, color + '25');
            wGrad.addColorStop(1, color + '03');
            ctx.fillStyle = wGrad;
            ctx.fill();

        } else if (sparklineStyle === 'mountain') {
            // ── MOUNTAIN — filled smooth curve with peak markers ──
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(data[0]));
            for (let i = 1; i < data.length; i++) {
                const cpx = (getX(i - 1) + getX(i)) / 2;
                ctx.bezierCurveTo(cpx, getY(data[i - 1]), cpx, getY(data[i]), getX(i), getY(data[i]));
            }
            ctx.lineTo(getX(data.length - 1), H);
            ctx.lineTo(getX(0), H);
            ctx.closePath();

            const mGrad = ctx.createLinearGradient(0, 0, 0, H);
            mGrad.addColorStop(0, color + '50');
            mGrad.addColorStop(0.6, color + '15');
            mGrad.addColorStop(1, color + '03');
            ctx.fillStyle = mGrad;
            ctx.fill();

            // Ridge line
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.strokeStyle = color + 'cc';
            ctx.lineWidth = 1;
            ctx.moveTo(getX(0), getY(data[0]));
            for (let i = 1; i < data.length; i++) {
                const cpx = (getX(i - 1) + getX(i)) / 2;
                ctx.bezierCurveTo(cpx, getY(data[i - 1]), cpx, getY(data[i]), getX(i), getY(data[i]));
            }
            ctx.stroke();
            ctx.restore();

            // Peak markers (local maxima)
            for (let i = 0; i < data.length; i++) {
                const prev = i > 0 ? data[i - 1] : -Infinity;
                const next = i < data.length - 1 ? data[i + 1] : -Infinity;
                if (data[i] >= prev && data[i] >= next) {
                    ctx.beginPath();
                    ctx.arc(getX(i), getY(data[i]) - 1, 2, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

        } else if (sparklineStyle === 'needle') {
            // ── NEEDLE — vertical spikes from baseline ──
            const baseY = H - pad;
            for (let i = 0; i < data.length; i++) {
                const x = getX(i);
                const y = getY(data[i]);
                const isLast = i === data.length - 1;

                ctx.save();
                ctx.strokeStyle = isLast ? color : color + '60';
                ctx.lineWidth = isLast ? 2.5 : 1.5;
                ctx.lineCap = 'round';
                if (isLast) { ctx.shadowColor = color; ctx.shadowBlur = 8; }
                ctx.beginPath();
                ctx.moveTo(x, baseY);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.restore();

                // Tip dot
                ctx.beginPath();
                ctx.arc(x, y, isLast ? 3 : 1.5, 0, Math.PI * 2);
                ctx.fillStyle = isLast ? color : color + '80';
                ctx.fill();
            }

        } else if (sparklineStyle === 'scatter') {
            // ── SCATTER — bubbles sized by deviation ──
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            for (let i = 0; i < data.length; i++) {
                const x = getX(i);
                const y = getY(data[i]);
                const isLast = i === data.length - 1;
                const deviation = Math.abs(data[i] - avg);
                const r = Math.max(2, Math.min(6, 2 + (deviation / (range * 0.3)) * 4));

                ctx.save();
                if (isLast) { ctx.shadowColor = color; ctx.shadowBlur = 12; }
                ctx.beginPath();
                ctx.arc(x, y, isLast ? r + 1 : r, 0, Math.PI * 2);
                ctx.fillStyle = isLast ? color : color + '55';
                ctx.fill();
                ctx.restore();

                if (isLast) {
                    ctx.beginPath();
                    ctx.arc(x, y, r + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = color + '30';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

        } else if (sparklineStyle === 'area') {
            // ── AREA — solid filled, no visible line ──
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(data[0]));
            for (let i = 1; i < data.length; i++) {
                ctx.lineTo(getX(i), getY(data[i]));
            }
            ctx.lineTo(getX(data.length - 1), H);
            ctx.lineTo(getX(0), H);
            ctx.closePath();

            const aGrad = ctx.createLinearGradient(0, 0, 0, H);
            aGrad.addColorStop(0, color + '60');
            aGrad.addColorStop(0.5, color + '25');
            aGrad.addColorStop(1, color + '05');
            ctx.fillStyle = aGrad;
            ctx.fill();

            // Subtle top edge
            ctx.beginPath();
            ctx.strokeStyle = color + '90';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < data.length; i++) {
                if (i === 0) ctx.moveTo(getX(i), getY(data[i]));
                else ctx.lineTo(getX(i), getY(data[i]));
            }
            ctx.stroke();

            // Glowing last point
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(getX(data.length - 1), getY(data[data.length - 1]), 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();

        } else {
            // ── LINE (default) ──
            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            for (let i = 0; i < data.length; i++) {
                if (i === 0) ctx.moveTo(getX(i), getY(data[i]));
                else ctx.lineTo(getX(i), getY(data[i]));
            }
            ctx.stroke();
            ctx.restore();

            // Gradient fill
            ctx.lineTo(getX(data.length - 1), H);
            ctx.lineTo(getX(0), H);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, color + '30');
            grad.addColorStop(1, color + '05');
            ctx.fillStyle = grad;
            ctx.fill();

            // Dots
            for (let i = 0; i < data.length; i++) {
                const isLast = i === data.length - 1;
                ctx.beginPath();
                ctx.arc(getX(i), getY(data[i]), isLast ? 3 : 1.5, 0, Math.PI * 2);
                ctx.fillStyle = isLast ? color : color + '90';
                ctx.fill();
                if (isLast) {
                    ctx.save();
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(getX(i), getY(data[i]), 3, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
    }

    // Called by auth.js when user logs in or out
    window.setProgressUserId = function (uid) {
        progressUserId = uid || '';
        // Reset session so old account readings don't linger
        prevWpm = 0;
        lastWpmResult = 0;
        winStreak = 0;
        justHitPB = false;
        loadPB();
        loadHistory();
        drawSparkline();
        renderProgress();
    };

    // Fresh session — clear session data, keep PB
    localStorage.removeItem('progressPrevWpm');
    localStorage.removeItem('progressLastWpm');
    localStorage.removeItem('progressStreak');

    // ── WPM-reactive flavour text — 6 tiers, each with its own personality ──
    const wpmFlavours = [
        {
            min: 0, max: 14, // 🐌 Crawl
            improve: [
                'Hey, progress is progress',
                'The turtle wins the race... eventually',
                'Baby steps, literally',
                'At least the keyboard\'s warm now'
            ],
            decline: [
                'Did you fall asleep mid-word?',
                'Even autocorrect is faster',
                'Are you typing with oven mitts?',
                'Your grandma texts faster'
            ],
            same: [
                'Consistently... something',
                'Stable as a rock. A very slow rock',
                'If nothing else, you\'re persistent'
            ],
            pb: [
                'A personal best is a personal best!',
                'New record! ...don\'t tell anyone the number',
                'PB! The bar was low but you cleared it'
            ]
        },
        {
            min: 15, max: 29, // 🚶 Slow
            improve: [
                'Now we\'re cooking... on low heat',
                'The engine is warming up',
                'Okay okay, getting somewhere',
                'Slow and steady — emphasis on slow'
            ],
            decline: [
                'Taking it easy huh?',
                'That was... a vibe check',
                'Coffee break mid-test?',
                'The backspace key needs a break too'
            ],
            same: [
                'Cruise control engaged',
                'Comfort zone: activated',
                'You and this WPM are besties now'
            ],
            pb: [
                'Personal best! You\'re leveling up',
                'New heights! Relatively speaking',
                'PB secured — momentum is building'
            ]
        },
        {
            min: 30, max: 49, // ⚡ Average
            improve: [
                'Solid improvement, keep stacking',
                'That\'s more like it',
                'You\'re finding your rhythm',
                'The fingers are waking up'
            ],
            decline: [
                'Just a warmup round',
                'Shake it off, next one\'s better',
                'Temporary setback, permanent comeback',
                'Everyone has an off run'
            ],
            same: [
                'Rock solid consistency',
                'Like clockwork',
                'The definition of reliable'
            ],
            pb: [
                'Personal best! You\'re breaking through',
                'New record — you felt that one',
                'Crown earned, not given'
            ]
        },
        {
            min: 50, max: 74, // 🔥 Fast
            improve: [
                'Speed demon activated',
                'Fingers are literally smoking',
                'Built different, proven again',
                'The keyboard fears you'
            ],
            decline: [
                'Even legends cool down sometimes',
                'Saving energy for the next one',
                'Redemption arc incoming',
                'You\'ve seen higher — go get it back'
            ],
            same: [
                'Locked in at elite level',
                'Consistency is a superpower',
                'Machine-like precision'
            ],
            pb: [
                'PERSONAL BEST 🔥 You\'re on another level',
                'New all-time! The ceiling keeps rising',
                'Record shattered — this is your era'
            ]
        },
        {
            min: 75, max: 99, // 💎 Blazing
            improve: [
                'Are those fingers or jet engines?',
                'Approaching the speed of thought',
                'The keyboard can barely keep up',
                'Typing.exe running at max FPS'
            ],
            decline: [
                'Even rockets need to refuel',
                'Dip? What dip? You\'re still elite',
                'A slow day for you is fast for everyone',
                'The wind-down before the wind-up'
            ],
            same: [
                'You\'ve achieved orbit — holding steady',
                'Cruising at mach speed',
                'Auto-pilot at 80+ WPM is insane'
            ],
            pb: [
                'PERSONAL BEST 💎 You\'re in the stratosphere',
                'Are you even human?? New record!',
                'Legendary run — history has been made'
            ]
        },
        {
            min: 100, max: Infinity, // 👑 Godlike
            improve: [
                'You\'re not typing, you\'re transcribing thoughts',
                'The keyboard is just a suggestion at this point',
                'Beyond mortal comprehension',
                'The matrix has you'
            ],
            decline: [
                'Even gods rest between miracles',
                'A \'bad\' run at 100+ is still legendary',
                'Just flexing range at this point',
                'Warming up for the real show'
            ],
            same: [
                'Pinned at the ceiling of human ability',
                'This isn\'t typing, this is art',
                'Consistent god-tier — not even fair'
            ],
            pb: [
                'PERSONAL BEST 👑 Absolutely inhuman',
                'The record that shouldn\'t be possible',
                'Hall of fame. No debate'
            ]
        }
    ];

    function getFlavourTier(wpm) {
        for (let i = wpmFlavours.length - 1; i >= 0; i--) {
            if (wpm >= wpmFlavours[i].min) return wpmFlavours[i];
        }
        return wpmFlavours[0];
    }

    // ── Delta-aware commentary text — talks about the actual numbers ──
    const deltaCommentary = {
        improve: [
            { max: 3,  messages: ['↑{d} WPM — not bad, not great', '+{d}? hey, a win\'s a win', 'up by {d}... baby steps count', '{d} WPM bump — slow clap', 'a whole {d} WPM faster — progress', '+{d} WPM, you blinked and improved', 'inched up by {d} — we take those', '↑{d} — barely, but it counts'] },
            { max: 8,  messages: ['↑{d} WPM — now that\'s movement', '+{d}? okay, we see you', 'jumped {d} WPM — getting warmer', '{d} WPM faster, the gears are turning', 'up {d} — that felt smooth', '+{d} WPM, momentum is real', '↑{d} — the engine\'s revving', 'climbed {d} WPM — keep that energy'] },
            { max: 15, messages: ['↑{d} WPM — that\'s a real jump!', '+{d}? you just hit a growth spurt', 'up {d} WPM — the grind is paying off', '{d} WPM leap — who even are you right now', '+{d} — went from walking to sprinting', '↑{d} WPM, that\'s not luck, that\'s skill', 'gained {d} WPM — your fingers leveled up', '+{d}? did you just download typing skills?'] },
            { max: 25, messages: ['↑{d} WPM — uhh, what happened??', '+{d}? that\'s literally a glow up', 'jumped {d} WPM — someone had their coffee', '{d} WPM surge — actual protagonist behavior', '+{d} — you skipped a whole rank', '↑{d} WPM, were you sandbagging before?', 'gained {d} WPM — the plot twist nobody saw', '+{d}? the keyboard owes you an apology'] },
            { max: Infinity, messages: ['↑{d} WPM — EXCUSE ME??', '+{d}? that\'s not improvement, that\'s evolution', 'up {d} WPM — you broke the simulation', '{d} WPM gain — illegal amount of progress', '+{d} — did you just unlock a cheat code?', '↑{d} WPM, from NPC to final boss', 'gained {d} WPM — the glow up of the century', '+{d}? someone call the authorities'] }
        ],
        decline: [
            { max: 3,  messages: ['↓{d} WPM — basically nothing', '−{d}? margin of error tbh', 'dropped {d} WPM — just a hiccup', '−{d} WPM, even robots have variance', 'down {d} — that\'s rounding error', '↓{d} — blink and you\'d miss it', 'lost {d} WPM — doesn\'t even count', '−{d}? the keyboard sneezed'] },
            { max: 8,  messages: ['↓{d} WPM — just cooling off', '−{d}? take a breath, you\'re fine', 'down {d} WPM — a pit stop, not a crash', '−{d} — shaking off some rust', 'dropped {d} WPM, the comeback writes itself', '↓{d} — savings energy for the next one', 'lost {d} WPM — character development', '−{d}? just the setup for a better punchline'] },
            { max: 15, messages: ['↓{d} WPM — okay, shake that off', '−{d}? it happens to the best of us', 'down {d} WPM — growth isn\'t linear', '−{d} — the plot needed some tension', 'dropped {d} WPM, your fingers are just stretching', '↓{d} — every legend has a chapter like this', 'lost {d} WPM — fuel for the motivation fire', '−{d}? the redemption arc starts now'] },
            { max: 25, messages: ['↓{d} WPM — yikes, you good?', '−{d}? maybe the keyboard needs therapy', 'down {d} WPM — we don\'t talk about this one', '−{d} — ...were you typing with your elbows?', 'dropped {d} WPM, let\'s pretend this didn\'t happen', '↓{d} — the gravity was strong on this one', 'lost {d} WPM — emotional damage', '−{d}? that test had bad vibes'] },
            { max: Infinity, messages: ['↓{d} WPM — was that even the same person?', '−{d}? did someone swap your hands?', 'down {d} WPM — catastrophic, but recoverable', '−{d} — that test needs to be classified', 'dropped {d} WPM, witness protection needed', '↓{d} — we\'re choosing to forget this one', 'lost {d} WPM — the keyboard is filing a complaint', '−{d}? speedrun to the bottom???'] }
        ],
        pb: [
            { max: 5,  messages: ['NEW PB! +{d} above your best — every bit counts', 'PB by {d} WPM — squeezed it out 👑', 'beat your record by {d} — the grind works', '+{d} over your PB — clutch performance', 'new best by {d} WPM — respect the increment', 'PB +{d} — the ceiling just moved'] },
            { max: 15, messages: ['NEW PB! crushed it by {d} WPM 🔥', 'PB shattered by {d} — that\'s a breakthrough', 'beat your best by {d} WPM — you felt that one', '+{d} above PB — the old you could never', 'new record by {d} WPM — legitimately cracked', 'PB +{d} — rewrote the history books'] },
            { max: Infinity, messages: ['NEW PB! +{d} WPM — that\'s not a record, that\'s a statement', 'PB demolished by {d} — absolutely unhinged run 👑', 'beat your best by {d} WPM — new era unlocked', '+{d} over PB — the old record is embarrassed', 'new record by {d} WPM — hall of fame material', 'PB +{d} — someone needs to fact-check this'] }
        ],
        same: [
            { max: Infinity, messages: ['±0 — you\'re a literal metronome', 'same WPM? the consistency is almost scary', 'exactly the same — are you a robot?', '±0 — pixel-perfect typing', 'dead even — this is your signature speed', 'same score — the universe is in balance', '±0 WPM — couldn\'t change if you tried', 'identical — running on autopilot'] }
        ]
    };

    function getDeltaComment(category, diff, wpm) {
        const absDiff = Math.abs(diff);
        const tiers = deltaCommentary[category];
        let matchedTier = tiers[0];
        for (const tier of tiers) {
            if (absDiff <= tier.max) {
                matchedTier = tier;
                break;
            }
        }
        const msg = pick(matchedTier.messages);
        return msg.replace(/\{d\}/g, absDiff).replace(/\{wpm\}/g, wpm);
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function getProgressColor() {
        if (progressColor) return progressColor;
        const root = getComputedStyle(document.documentElement);
        return root.getPropertyValue('--accent-gold')?.trim() || '#ffd700';
    }

    function getSparklineColor() {
        if (sparklineColor) return sparklineColor;
        return getProgressColor();  // Fall back to progress color
    }

    function applyProgressTheme() {
        const display = document.getElementById('progress-display');
        if (display) {
            display.classList.remove('theme-clean', 'theme-glass', 'theme-neon', 'theme-minimal', 'theme-retro', 'theme-hologram', 'theme-vapor', 'theme-ember');
            display.classList.add(`theme-${progressTheme}`);
        }
    }

    function applyProgressColor() {
        const color = getProgressColor();
        const el = document.getElementById('progress-wpm');
        if (el) {
            el.style.color = color;
            el.style.textShadow = `0 0 16px ${color}40`;
        }
    }

    let showDeltaCommentaryNext = true;

    function renderProgress() {
        const wpmEl = document.getElementById('progress-wpm');
        const deltaEl = document.getElementById('progress-delta');
        const arrowEl = document.getElementById('progress-arrow');
        const diffEl = document.getElementById('progress-diff');
        const msgEl = document.getElementById('progress-message');
        const display = document.getElementById('progress-display');
        const pbVal = document.getElementById('progress-pb-val');
        const pbWrap = document.getElementById('progress-pb');
        const streakVal = document.getElementById('progress-streak-val');
        const streakWrap = document.getElementById('progress-streak');
        const pbBadge = document.getElementById('progress-pb-badge');

        if (!wpmEl) return;

        // PB display
        if (pbVal) pbVal.textContent = personalBest > 0 ? personalBest : '—';
        if (pbWrap) pbWrap.classList.toggle('has-pb', personalBest > 0);

        // Streak display
        if (streakVal) streakVal.textContent = winStreak;
        if (streakWrap) streakWrap.classList.toggle('hot', winStreak >= 3);

        if (lastWpmResult === 0) {
            wpmEl.textContent = '—';
            if (deltaEl) deltaEl.classList.remove('visible');
            if (msgEl) {
                msgEl.style.opacity = '1';
                msgEl.textContent = 'Complete a test to begin';
            }
            return;
        }

        wpmEl.textContent = lastWpmResult;

        const tier = getFlavourTier(lastWpmResult);

        if (prevWpm > 0) {
            const diff = lastWpmResult - prevWpm;
            if (deltaEl) deltaEl.classList.add('visible');

            // Check for new PB (flag set by onTestComplete)
            const isNewPB = justHitPB;
            justHitPB = false;

            let finalMsg = '';

            if (diff > 0) {
                if (arrowEl) arrowEl.textContent = '↑';
                if (diffEl) diffEl.textContent = diff;
                deltaEl.classList.remove('declined', 'same');
                deltaEl.classList.add('improved');

                if (isNewPB) {
                    finalMsg = showDeltaCommentaryNext ? getDeltaComment('pb', diff, lastWpmResult) : pick(tier.pb);
                    if (display) {
                        display.classList.remove('pop-declined', 'pop-improved');
                        display.classList.add('pop-pb');
                        setTimeout(() => display.classList.remove('pop-pb'), 900);
                    }
                    if (pbBadge) {
                        pbBadge.classList.add('show');
                        setTimeout(() => pbBadge.classList.remove('show'), 3000);
                    }
                } else {
                    finalMsg = showDeltaCommentaryNext ? getDeltaComment('improve', diff, lastWpmResult) : pick(tier.improve);
                    if (display) {
                        display.classList.remove('pop-declined', 'pop-pb');
                        display.classList.add('pop-improved');
                        setTimeout(() => display.classList.remove('pop-improved'), 700);
                    }
                }
            } else if (diff < 0) {
                if (arrowEl) arrowEl.textContent = '↓';
                if (diffEl) diffEl.textContent = Math.abs(diff);
                deltaEl.classList.remove('improved', 'same');
                deltaEl.classList.add('declined');
                
                finalMsg = showDeltaCommentaryNext ? getDeltaComment('decline', diff, lastWpmResult) : pick(tier.decline);
                
                if (display) {
                    display.classList.remove('pop-improved', 'pop-pb');
                    display.classList.add('pop-declined');
                    setTimeout(() => display.classList.remove('pop-declined'), 600);
                }
            } else {
                if (arrowEl) arrowEl.textContent = '=';
                if (diffEl) diffEl.textContent = '0';
                deltaEl.classList.remove('improved', 'declined');
                deltaEl.classList.add('same');
                
                finalMsg = showDeltaCommentaryNext ? getDeltaComment('same', diff, lastWpmResult) : pick(tier.same);
            }

            if (msgEl) {
                msgEl.style.transition = 'none';
                msgEl.style.opacity = '1';
                msgEl.textContent = finalMsg;
            }

        } else {
            if (deltaEl) deltaEl.classList.remove('visible');

            if (justHitPB) {
                justHitPB = false;
                if (msgEl) {
                    msgEl.style.opacity = '1';
                    msgEl.textContent = pick(tier.pb);
                }
                if (display) {
                    display.classList.add('pop-pb');
                    setTimeout(() => display.classList.remove('pop-pb'), 900);
                }
                if (pbBadge) {
                    pbBadge.classList.add('show');
                    setTimeout(() => pbBadge.classList.remove('show'), 3000);
                }
            } else {
                if (msgEl) {
                    msgEl.style.opacity = '1';
                    msgEl.textContent = 'First score set — now beat it';
                }
            }
        }

        applyProgressColor();
    }

    // Called from script.js when a test finishes
    window.onTestComplete = function (wpm) {
        prevWpm = lastWpmResult;
        lastWpmResult = wpm;

        // Detect PB BEFORE updating it
        justHitPB = (wpm > personalBest && personalBest >= 0);

        // Update PB
        if (wpm > personalBest) {
            personalBest = wpm;
            localStorage.setItem(getPBKey(), personalBest);
        }

        // Update streak
        if (prevWpm > 0 && wpm > prevWpm) {
            winStreak++;
        } else if (prevWpm > 0 && wpm < prevWpm) {
            winStreak = 0;
        }
        // Same WPM doesn't break streak

        // Toggle which flavour type to show NEXT time
        if (prevWpm > 0) {
            showDeltaCommentaryNext = !showDeltaCommentaryNext;
        }

        // Track history for sparkline
        wpmHistory.push(wpm);
        if (wpmHistory.length > MAX_HISTORY) wpmHistory.shift();
        saveHistory();

        localStorage.setItem('progressPrevWpm', prevWpm);
        localStorage.setItem('progressLastWpm', lastWpmResult);
        localStorage.setItem('progressStreak', winStreak);
        renderProgress();
        drawSparkline();
    };

    // ═══════════════════════════════════════════════════════════
    //  WIDGET SWITCHING
    // ═══════════════════════════════════════════════════════════
    window.setFooterWidget = function (widget) {
        currentWidget = widget;
        localStorage.setItem('footerWidget', widget);

        const vizWidget = document.getElementById('widget-visualizer');
        const tickerWidget = document.getElementById('widget-ticker');
        const progressWidget = document.getElementById('widget-progress');
        if (vizWidget) vizWidget.classList.toggle('active', widget === 'visualizer');
        if (tickerWidget) tickerWidget.classList.toggle('active', widget === 'ticker');
        if (progressWidget) progressWidget.classList.toggle('active', widget === 'progress');

        // Toggle settings sections
        const vizSettings = document.getElementById('viz-settings-section');
        if (vizSettings) vizSettings.style.display = widget === 'visualizer' ? '' : 'none';

        const tickerColorRow = document.getElementById('ticker-color-row');
        if (tickerColorRow) tickerColorRow.style.display = widget === 'ticker' ? '' : 'none';

        const progressThemeRow = document.getElementById('progress-theme-row');
        if (progressThemeRow) progressThemeRow.style.display = widget === 'progress' ? '' : 'none';

        const progressColorRow = document.getElementById('progress-color-row');
        if (progressColorRow) progressColorRow.style.display = widget === 'progress' ? '' : 'none';

        const sparklineSettingsRow = document.getElementById('sparkline-settings-row');
        if (sparklineSettingsRow) sparklineSettingsRow.style.display = widget === 'progress' ? '' : 'none';

        // Toggle button active state
        document.querySelectorAll('.widget-pick-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.widget === widget);
        });

        if (widget === 'ticker') applyTickerColor();
        if (widget === 'progress') { applyProgressTheme(); applyProgressColor(); renderProgress(); }

        // Re-measure canvas when visualizer becomes visible
        if (widget === 'visualizer') {
            setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        }
    };

    // ═══════════════════════════════════════════════════════════
    //  TICKER COLOR API
    // ═══════════════════════════════════════════════════════════
    window.setTickerColor = function (color) {
        if (color) {
            tickerColor = color;
            localStorage.setItem('tickerColor', color);
            applyTickerColor();
        }
    };

    window.resetTickerColor = function () {
        tickerColor = '';
        localStorage.removeItem('tickerColor');
        applyTickerColor();
    };

    window.setProgressColor = function (color) {
        if (color) {
            progressColor = color;
            localStorage.setItem('progressColor', color);
            applyProgressColor();
        }
    };

    window.resetProgressColor = function () {
        progressColor = '';
        localStorage.removeItem('progressColor');
        applyProgressColor();
    };

    window.setProgressTheme = function (theme) {
        if (theme) {
            progressTheme = theme;
            localStorage.setItem('progressTheme', theme);
            applyProgressTheme();

            document.querySelectorAll('.progress-theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.progressTheme === theme);
            });
        }
    };

    window.toggleSparkline = function (enabled) {
        sparklineEnabled = enabled;
        localStorage.setItem('sparklineEnabled', enabled ? 'true' : 'false');
        drawSparkline();

        const btns = document.getElementById('sparkline-style-buttons');
        if (btns) btns.style.opacity = enabled ? '1' : '0.3';
        if (btns) btns.style.pointerEvents = enabled ? '' : 'none';
    };

    window.setSparklineStyle = function (style) {
        sparklineStyle = style;
        localStorage.setItem('sparklineStyle', style);
        drawSparkline();

        document.querySelectorAll('.sparkline-style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sparklineStyle === style);
        });
    };

    window.setSparklineColor = function (color) {
        sparklineColor = color;
        localStorage.setItem('sparklineColor', color);
        drawSparkline();
        document.querySelectorAll('.sparkline-color-dot').forEach(b => b.classList.remove('active'));
    };

    window.resetSparklineColor = function () {
        sparklineColor = '';
        localStorage.removeItem('sparklineColor');
        drawSparkline();
    };

    // ═══════════════════════════════════════════════════════════
    //  KEYSTROKE TRACKING (for flow state)
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('keydown', function (e) {
        if (['Shift', 'Control', 'Alt', 'Meta', 'Escape', 'Tab',
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
        ].includes(e.key)) return;
        keystrokeTimestamps.push(Date.now());
        const cutoff = Date.now() - 5000;
        keystrokeTimestamps = keystrokeTimestamps.filter(t => t > cutoff);
    });

    function getFlowLevel() {
        const now = Date.now();
        const recent = keystrokeTimestamps.filter(t => t > now - 3000).length;
        if (recent >= 15) return 3;
        if (recent >= 8) return 2;
        if (recent >= 3) return 1;
        return 0;
    }

    function getRank(wpm) {
        let rank = ranks[0];
        for (const r of ranks) {
            if (wpm >= r.min) rank = r;
        }
        return rank;
    }

    function bumpValue(el) {
        if (!el) return;
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 180);
    }

    // ═══════════════════════════════════════════════════════════
    //  TICKER UPDATE LOOP
    // ═══════════════════════════════════════════════════════════
    const tickerWpm = document.getElementById('ticker-wpm');
    const rankIcon = document.getElementById('ticker-rank-icon');
    const rankLabel = document.getElementById('ticker-rank-label');
    const rankWrap = document.getElementById('ticker-rank-wrap');
    const flowIcon = document.getElementById('ticker-flow-icon');
    const flowLabel = document.getElementById('ticker-flow-label');
    const flowWrap = document.getElementById('ticker-flow-wrap');

    let lastWpm = 0;
    let lastFlowLevel = 0;

    function updateTicker() {
        if (currentWidget !== 'ticker') return;

        const wpmEl = document.getElementById('wpm');
        let wpm = 0;
        if (wpmEl) {
            const match = wpmEl.textContent.trim().match(/(\d+)/);
            if (match) wpm = parseInt(match[1], 10);
        }

        if (wpm !== lastWpm && tickerWpm) {
            tickerWpm.textContent = wpm;
            bumpValue(tickerWpm);
            lastWpm = wpm;
        }

        const rank = getRank(wpm);
        if (rank.label !== lastRankLabel) {
            if (rankIcon) rankIcon.textContent = rank.icon;
            if (rankLabel) rankLabel.textContent = rank.label;
            if (rankWrap && lastRankLabel) {
                rankWrap.classList.add('ranked-up');
                setTimeout(() => rankWrap.classList.remove('ranked-up'), 600);
            }
            lastRankLabel = rank.label;
        }

        const flowLevel = getFlowLevel();
        if (flowLevel !== lastFlowLevel) {
            const fs = flowStates[flowLevel];
            if (flowIcon) flowIcon.textContent = fs.icon;
            if (flowLabel) flowLabel.textContent = fs.label;
            if (flowWrap) {
                flowWrap.classList.remove('level-cold', 'level-warm', 'level-flow', 'level-zen');
                flowWrap.classList.add(fs.className);
            }
            lastFlowLevel = flowLevel;
        }
    }

    setInterval(updateTicker, 200);

    // ═══════════════════════════════════════════════════════════
    //  INIT
    // ═══════════════════════════════════════════════════════════
    setTimeout(() => {
        setFooterWidget(currentWidget);
        applyTickerColor();
        applyProgressTheme();
        applyProgressColor();

        // If auth hasn't set the userId yet, load guest PB as fallback
        if (!progressUserId) {
            loadPB();
            loadHistory();
        }
        renderProgress();
        drawSparkline();

        // Sync ticker color dots
        const saved = localStorage.getItem('tickerColor') || '';
        if (saved) {
            document.querySelectorAll('.ticker-color-dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.tickerColor === saved);
            });
        }
        const picker = document.getElementById('ticker-color-picker');
        if (picker && saved) picker.value = saved;

        // Sync progress color dots
        const savedP = localStorage.getItem('progressColor') || '';
        if (savedP) {
            document.querySelectorAll('.progress-color-dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.progressColor === savedP);
            });
        }
        const pickerP = document.getElementById('progress-color-picker');
        if (pickerP && savedP) pickerP.value = savedP;

        // Sync progress theme buttons
        if (progressTheme) {
            document.querySelectorAll('.progress-theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.progressTheme === progressTheme);
            });
        }

        // Sync sparkline toggle + style buttons
        const sparkToggle = document.getElementById('sparkline-toggle');
        if (sparkToggle) sparkToggle.checked = sparklineEnabled;
        const sparkBtns = document.getElementById('sparkline-style-buttons');
        if (sparkBtns) {
            sparkBtns.style.opacity = sparklineEnabled ? '1' : '0.3';
            sparkBtns.style.pointerEvents = sparklineEnabled ? '' : 'none';
        }
        document.querySelectorAll('.sparkline-style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sparklineStyle === sparklineStyle);
        });

        // Sync sparkline color dots
        const savedSC = localStorage.getItem('sparklineColor') || '';
        document.querySelectorAll('.sparkline-color-dot').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sparklineColor === savedSC);
        });
        const pickerSC = document.getElementById('sparkline-color-picker');
        if (pickerSC && savedSC) pickerSC.value = savedSC;
    }, 120);
})();
