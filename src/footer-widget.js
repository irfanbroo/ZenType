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
    let lastAccResult = 0;
    let justBrokeStreak = false;
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
        
        // Prevent canvas internal size from inflating the parent
        const cssWidth = wrap.clientWidth || 60;
        const cssHeight = wrap.clientHeight || 24;
        
        if (cssWidth === 0) return;
        
        // Lock CSS sizes
        canvas.style.width = cssWidth + 'px';
        canvas.style.height = cssHeight + 'px';
        
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const W = cssWidth;
        const H = cssHeight;
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

    // ── Predefined Personality-based flavour text tiers (Non-Delta) ──
    const wpmFlavours = [
        {
            min: 0, max: 14, // 🐌 Crawl
            improve: [
                'Hey, progress is progress',
                'The turtle wins the race... eventually',
                'Baby steps, literally',
                'At least the keyboard\'s warm now',
                'A step in the mostly right direction',
                'Moving at the speed of dial-up',
                'Gravity is working with you today',
                'Like a glacier, but faster',
                'I see you trying... kinda',
                'We\'ll get there, I promise',
                'I didn\'t think you\'d improve, but here we are',
                'At least you\'re moving now, I was worried',
                'I\'m watching you type... are you okay?',
                'We need to practice more, head to the dojo',
                'I see you trying... kinda',
                'We\'ll get there, I promise',
                'I didn\'t think you\'d improve, but here we are',
                'At least you\'re moving now, I was worried',
                'I\'m watching you type... are you okay?',
                'We need to practice more, head to the dojo',
                'I was about to intervene, but you\'re doing okay.',
                'We survived that one. Barely.',
                'I\'ll pretend I didn\'t see the start of that test.',
                'You\'re making me sweat watching this.',
                'I was about to intervene, but you\'re doing okay.',
                'We survived that one. Barely.',
                'I\'ll pretend I didn\'t see the start of that test.',
                'You\'re making me sweat watching this.'
            ],
            decline: [
                'Did you fall asleep mid-word?',
                'Even autocorrect is faster',
                'Are you typing with oven mitts?',
                'Your grandma texts faster',
                'Are the keys stuck together?',
                'Did you forget the alphabet?',
                'The cursor is begging you to move',
                'Are we taking a nap?',
                'I am watching you type and you had to fail me?',
                'Did we just give up halfway?',
                'I could have typed that faster with my nose',
                'Are we taking a nap together?',
                'I expected little, and I\'m still disappointed',
                'We both know you can do better than that',
                'I am watching you type and you had to fail me?',
                'Did we just give up halfway?',
                'I could have typed that faster with my nose',
                'Are we taking a nap together?',
                'I expected little, and I\'m still disappointed',
                'We both know you can do better than that',
                'I\'m not mad, I\'m just disappointed.',
                'Are we lagging, or is it just you?',
                'I\'m going to need you to look at the screen.',
                'We need a tactical timeout.',
                'I\'m not mad, I\'m just disappointed.',
                'Are we lagging, or is it just you?',
                'I\'m going to need you to look at the screen.',
                'We need a tactical timeout.'
            ],
            same: [
                'Consistently... something',
                'Stable as a rock. A very slow rock',
                'If nothing else, you\'re persistent',
                'Flawlessly repeating the same mistakes',
                'A masterclass in taking your time',
                'The definition of unchanging',
                'I admire your dedication to going nowhere',
                'We are officially stuck in mud',
                'I keep watching, but nothing changes',
                'Are we just going to stay at this speed forever?',
                'I admire your dedication to going nowhere',
                'We are officially stuck in mud',
                'I keep watching, but nothing changes',
                'Are we just going to stay at this speed forever?',
                'I\'m feeling intense déjà vu right now.',
                'We\'re drawing a perfectly flat line.',
                'I respect your commitment to this exact speed.',
                'I\'m feeling intense déjà vu right now.',
                'We\'re drawing a perfectly flat line.',
                'I respect your commitment to this exact speed.'
            ],
            pb: [
                'A personal best is a personal best!',
                'New record! ...don\'t tell anyone the number',
                'PB! The bar was low but you cleared it',
                'A new peak on a very small mountain',
                'We\'re breaking records! Technically.',
                'King of the slow lane',
                'A PB? I\'ll allow it, barely',
                'We broke a record! Kind of down bad, but still',
                'I didn\'t think this was possible, but I\'m proud',
                'You actually did it. I\'m shocked.',
                'A PB? I\'ll allow it, barely',
                'We broke a record! Kind of down bad, but still',
                'I didn\'t think this was possible, but I\'m proud',
                'You actually did it. I\'m shocked.',
                'I mean... yes, technically that is a PB.',
                'We take those. A win is a win.',
                'I\'ll let you have this one. Good job.',
                'I mean... yes, technically that is a PB.',
                'We take those. A win is a win.',
                'I\'ll let you have this one. Good job.'
            ]
        },
        {
            min: 15, max: 29, // 🚶 Slow
            improve: [
                'Now we\'re cooking... on low heat',
                'The engine is warming up',
                'Okay okay, getting somewhere',
                'Slow and steady — emphasis on slow',
                'The gears are finally catching',
                'A light jog for your fingers',
                'Starting to look like real typing',
                'Taking the training wheels off',
                'I\'m starting to see the vision',
                'Okay, you\'re waking up, I like this',
                'We\'re finally leaving the slow lane',
                'I knew you had a pulse somewhere',
                'You\'re improving, I didn\'t think you would so soon',
                'I\'m starting to see the vision',
                'Okay, you\'re waking up, I like this',
                'We\'re finally leaving the slow lane',
                'I knew you had a pulse somewhere',
                'You\'re improving, I didn\'t think you would so soon',
                'I see the spark starting to catch.',
                'We\'re actually gaining traction now.',
                'I told you we just needed to warm up.',
                'You\'re making me look good here.',
                'I see the spark starting to catch.',
                'We\'re actually gaining traction now.',
                'I told you we just needed to warm up.',
                'You\'re making me look good here.'
            ],
            decline: [
                'Taking it easy huh?',
                'That was... a vibe check',
                'Coffee break mid-test?',
                'The backspace key needs a break too',
                'Backing up into the driveway',
                'Did a cat walk across your keyboard?',
                'A scenic route through the test',
                'We lost some altitude there',
                'I thought we were making progress...',
                'Why are you doing this to me?',
                'I looked away for one second and you dropped',
                'We were doing so well, what happened?',
                'Did you forget I\'m watching you?',
                'I thought we were making progress...',
                'Why are you doing this to me?',
                'I looked away for one second and you dropped',
                'We were doing so well, what happened?',
                'Did you forget I\'m watching you?',
                'I must have jinxed it, sorry.',
                'We lost the rhythm entirely there.',
                'I felt that stumble from here.',
                'You disconnected from the matrix for a second.',
                'I must have jinxed it, sorry.',
                'We lost the rhythm entirely there.',
                'I felt that stumble from here.',
                'You disconnected from the matrix for a second.'
            ],
            same: [
                'Cruise control engaged',
                'Comfort zone: activated',
                'You and this WPM are besties now',
                'Locked in a very casual groove',
                'A comfortable holding pattern',
                'Refusing to change lanes',
                'I guess we\'re getting comfortable here',
                'You\'re testing my patience with this consistency',
                'We need to break out of this loop',
                'I\'m waiting for a plot twist',
                'I guess we\'re getting comfortable here',
                'You\'re testing my patience with this consistency',
                'We need to break out of this loop',
                'I\'m waiting for a plot twist',
                'I\'m getting comfortable watching this speed.',
                'We found the pocket, now we just stay in it.',
                'I feel like I\'m babysitting a steady heartbeat.',
                'I\'m getting comfortable watching this speed.',
                'We found the pocket, now we just stay in it.',
                'I feel like I\'m babysitting a steady heartbeat.'
            ],
            pb: [
                'Personal best! You\'re leveling up',
                'New heights! Relatively speaking',
                'PB secured — momentum is building',
                'A solid new benchmark',
                'The climb has officially started',
                'Breaking out of the comfort zone',
                'I see that PB! We\'re actually climbing',
                'You\'re proving me wrong, keep it up',
                'We just broke through, don\'t stop now',
                'I\'m officially impressed. Slightly.',
                'I see that PB! We\'re actually climbing',
                'You\'re proving me wrong, keep it up',
                'We just broke through, don\'t stop now',
                'I\'m officially impressed. Slightly.',
                'I see you! That\'s a real PB right there.',
                'We\'re on the board! Keep that energy.',
                'I\'m quietly cheering for you right now.',
                'I see you! That\'s a real PB right there.',
                'We\'re on the board! Keep that energy.',
                'I\'m quietly cheering for you right now.'
            ]
        },
        {
            min: 30, max: 49, // ⚡ Average
            improve: [
                'Solid improvement, keep stacking',
                'That\'s more like it',
                'You\'re finding your rhythm',
                'The fingers are waking up',
                'Catching a nice tailwind',
                'The flow state is approaching',
                'Good tempo, keep it rolling',
                'Starting to flex a little',
                'I see the focus in your eyes now',
                'We\'re hitting a real stride together',
                'I love watching you lock in like this',
                'You\'re making this look easy now',
                'I think we can go even faster, push it',
                'I see the focus in your eyes now',
                'We\'re hitting a real stride together',
                'I love watching you lock in like this',
                'You\'re making this look easy now',
                'I think we can go even faster, push it',
                'I like this tempo, let\'s hold it.',
                'We\'re cruising now, don\'t drop it.',
                'I can see the mechanics clicking into place.',
                'You\'re getting dangerous now.',
                'I like this tempo, let\'s hold it.',
                'We\'re cruising now, don\'t drop it.',
                'I can see the mechanics clicking into place.',
                'You\'re getting dangerous now.'
            ],
            decline: [
                'Just a warmup round',
                'Shake it off, next one\'s better',
                'Temporary setback, permanent comeback',
                'Everyone has an off run',
                'A slight wobble in the orbit',
                'Just testing the suspension',
                'Missed a gear shift there',
                'A tactical retreat',
                'I know you\'re better than this run',
                'Are we slipping? Focus up!',
                'I blinked, don\'t let me catch you slacking again',
                'We don\'t accept regressions in this house',
                'You disappointed me a little there',
                'I know you\'re better than this run',
                'Are we slipping? Focus up!',
                'I blinked, don\'t let me catch you slacking again',
                'We don\'t accept regressions in this house',
                'You disappointed me a little there',
                'I saw you hesitate! Don\'t overthink it.',
                'We gave up too much ground there.',
                'I need you to lock back in immediately.',
                'You\'re letting the keyboard win.',
                'I saw you hesitate! Don\'t overthink it.',
                'We gave up too much ground there.',
                'I need you to lock back in immediately.',
                'You\'re letting the keyboard win.',
                'You\'re paid by the word, not the hour. Pick it up.',
                'If you pause too long, the cursor gets lonely... and impatient.',
                'I can see you overthinking. Thinking wastes time.',
                'Are we window shopping for the right letter? Type it!',
                'Time is ticking, and we aren\'t getting those seconds back.',
                'You\'re paid by the word, not the hour. Pick it up.',
                'If you pause too long, the cursor gets lonely... and impatient.',
                'I can see you overthinking. Thinking wastes time.',
                'Are we window shopping for the right letter? Type it!',
                'Time is ticking, and we aren\'t getting those seconds back.',
                'You\'re paid by the word, not the hour. Pick it up.',
                'If you pause too long, the cursor gets lonely... and impatient.',
                'I can see you overthinking. Thinking wastes time.',
                'Are we window shopping for the right letter? Type it!',
                'Time is ticking, and we aren\'t getting those seconds back.'
            ],
            same: [
                'Rock solid consistency',
                'Like clockwork',
                'The definition of reliable',
                'Dialed into the exact frequency',
                'Holding the line perfectly',
                'A metronome with a keyboard',
                'I appreciate the reliability, I guess',
                'We\'re holding the exact same line',
                'I feel like I\'m watching a replay',
                'Can you surprise me next time?',
                'I appreciate the reliability, I guess',
                'We\'re holding the exact same line',
                'I feel like I\'m watching a replay',
                'Can you surprise me next time?',
                'I could set my watch to this consistency.',
                'We\'re vibrating at the exact same frequency.',
                'I appreciate a stable performance.',
                'I could set my watch to this consistency.',
                'We\'re vibrating at the exact same frequency.',
                'I appreciate a stable performance.'
            ],
            pb: [
                'Personal best! You\'re breaking through',
                'New record — you felt that one',
                'Crown earned, not given',
                'A new ceiling has been established',
                'That\'s what progress looks like',
                'You\'re moving up the ranks',
                'Now that\'s what I want to see! PB!',
                'We elevate together! Nice record',
                'I told you we had more in the tank',
                'You just made me proud',
                'Now that\'s what I want to see! PB!',
                'We elevate together! Nice record',
                'I told you we had more in the tank',
                'You just made me proud',
                'I knew we had a record in us today!',
                'We just stepped it up another level!',
                'I\'m giving that run a standing ovation.',
                'I knew we had a record in us today!',
                'We just stepped it up another level!',
                'I\'m giving that run a standing ovation.'
            ]
        },
        {
            min: 50, max: 74, // 🔥 Fast
            improve: [
                'Speed demon activated',
                'Fingers are literally smoking',
                'Built different, proven again',
                'The keyboard fears you',
                'Injecting nitrous into the switches',
                'A certified blur on the keys',
                'You\'re a menace to this keyboard',
                'Entering the fast lane',
                'Okay, now you\'re showing off for me',
                'I can barely track your fingers right now',
                'We are absolutely cooking',
                'I knew betting on you was the right choice',
                'You\'re scaring the keyboard, and I love it',
                'Okay, now you\'re showing off for me',
                'I can barely track your fingers right now',
                'We are absolutely cooking',
                'I knew betting on you was the right choice',
                'You\'re scaring the keyboard, and I love it',
                'I\'m grabbing popcorn, this is getting good.',
                'We\'re putting on a clinic right now.',
                'I love the aggression, keep pushing.',
                'You\'re making the switches scream.',
                'I\'m grabbing popcorn, this is getting good.',
                'We\'re putting on a clinic right now.',
                'I love the aggression, keep pushing.',
                'You\'re making the switches scream.',
                'I see you found the gas pedal.',
                'You\'re actually making me proud right now.',
                'We might need a fire extinguisher for your keyboard.',
                'I didn\'t know you had this gear in you.',
                'Keep holding that W, I love to see it.',
                'You\'re typing like you have somewhere to be.',
                'I can feel the breeze from your hands over here.',
                'I see you found the gas pedal.',
                'You\'re actually making me proud right now.',
                'We might need a fire extinguisher for your keyboard.',
                'I didn\'t know you had this gear in you.',
                'Keep holding that W, I love to see it.',
                'You\'re typing like you have somewhere to be.',
                'I can feel the breeze from your hands over here.',
                'Gaining real velocity now.',
                'The physical pace quickens.',
                'Entering the flow state.',
                'The flow is starting to look very clean.',
                'I can tell you\'re zoned in right now.',
                'Nice pace! Keep that exact rhythm.',
                'This is the speed where the magic happens.',
                'The flow is starting to look very clean.',
                'I can tell you\'re zoned in right now.',
                'Nice pace! Keep that exact rhythm.',
                'This is the speed where the magic happens.',
                'Look at that pacing, absolutely textbook.',
                'I could watch you type at this speed all day.',
                'There is zero hesitation in those keystrokes.',
                'You\'re making the keyboard earn its keep.',
                'Look at that pacing, absolutely textbook.',
                'I could watch you type at this speed all day.',
                'There is zero hesitation in those keystrokes.',
                'You\'re making the keyboard earn its keep.',
                'Look at that pacing, absolutely textbook.',
                'I could watch you type at this speed all day.',
                'There is zero hesitation in those keystrokes.',
                'You\'re making the keyboard earn its keep.',
                'Okay, now we\'re talking my language.',
                'I knew you had it in you. Don\'t stop now.',
                'The rhythm is perfect. Let\'s build on this.',
                'You\'re finally starting to impress me. A little.',
                'I\'m nodding in approval over here.',
                'Okay, now we\'re talking my language.',
                'I knew you had it in you. Don\'t stop now.',
                'The rhythm is perfect. Let\'s build on this.',
                'You\'re finally starting to impress me. A little.',
                'I\'m nodding in approval over here.',
                'Okay, now we\'re talking my language.',
                'I knew you had it in you. Don\'t stop now.',
                'The rhythm is perfect. Let\'s build on this.',
                'You\'re finally starting to impress me. A little.',
                'I\'m nodding in approval over here.'
            ],
            decline: [
                'Even legends cool down sometimes',
                'Saving energy for the next one',
                'Redemption arc incoming',
                'You\'ve seen higher — go get it back',
                'Just giving the switches a rest',
                'A quick pit stop for the fingers',
                'Gravity caught up for a second',
                'A rare mortal moment',
                'I expected you to keep the heat up',
                'Did we run out of gas?',
                'I know you\'re tired, but I need more',
                'You let me down on that drop',
                'We can\'t get sloppy when we\'re playing fast',
                'I expected you to keep the heat up',
                'Did we run out of gas?',
                'I know you\'re tired, but I need more',
                'You let me down on that drop',
                'We can\'t get sloppy when we\'re playing fast',
                'I know you can go faster than that.',
                'We took our foot off the gas.',
                'I felt the energy dip, what happened?',
                'You owe me a faster run after that.',
                'I know you can go faster than that.',
                'We took our foot off the gas.',
                'I felt the energy dip, what happened?',
                'You owe me a faster run after that.',
                'Hey, don\'t fall asleep on me now.',
                'We were doing so well, pick the pace back up!',
                'I know your wrists are tired, but I need more.',
                'Did you get distracted by a notification?',
                'I\'m pretending I didn\'t see that drop.',
                'You\'re testing my patience with that speed.',
                'Don\'t make me get the metronome out.',
                'Hey, don\'t fall asleep on me now.',
                'We were doing so well, pick the pace back up!',
                'I know your wrists are tired, but I need more.',
                'Did you get distracted by a notification?',
                'I\'m pretending I didn\'t see that drop.',
                'You\'re testing my patience with that speed.',
                'Don\'t make me get the metronome out.',
                'Cooling down the mechanical switches.',
                'A slight but noticeable deceleration.',
                'Dropping out of the fast lane.',
                'Don\'t let the focus slip now.',
                'I know your wrists are feeling it. Push through.',
                'We dropped a gear, let\'s pick it back up.',
                'Blink if you need to, then back to the keys.',
                'Don\'t let the focus slip now.',
                'I know your wrists are feeling it. Push through.',
                'We dropped a gear, let\'s pick it back up.',
                'Blink if you need to, then back to the keys.',
                'Check your posture and get back into it.',
                'You skipped a beat, but you\'re still in the fast lane.',
                'Don\'t let the fatigue win quite yet.',
                'Take a breath, center yourself, and push.',
                'Check your posture and get back into it.',
                'You skipped a beat, but you\'re still in the fast lane.',
                'Don\'t let the fatigue win quite yet.',
                'Take a breath, center yourself, and push.',
                'Check your posture and get back into it.',
                'You skipped a beat, but you\'re still in the fast lane.',
                'Don\'t let the fatigue win quite yet.',
                'Take a breath, center yourself, and push.',
                'I need a steady flow of inputs, not stop-and-go traffic.',
                'Every backspace is a second we could have spent winning.',
                'Stop negotiating with the keyboard and just type.',
                'We had a solid workflow, who hit the pause button?',
                'Hesitation is just a polite word for \'typing too slow\'.',
                'I need a steady flow of inputs, not stop-and-go traffic.',
                'Every backspace is a second we could have spent winning.',
                'Stop negotiating with the keyboard and just type.',
                'We had a solid workflow, who hit the pause button?',
                'Hesitation is just a polite word for \'typing too slow\'.',
                'I need a steady flow of inputs, not stop-and-go traffic.',
                'Every backspace is a second we could have spent winning.',
                'Stop negotiating with the keyboard and just type.',
                'We had a solid workflow, who hit the pause button?',
                'Hesitation is just a polite word for \'typing too slow\'.',
                'We were on a roll, what happened to the focus?',
                'I can tolerate a lot, but not slacking.',
                'Did you think I wouldn\'t notice that drop?',
                'You\'re better than whatever that last burst was.',
                'Shake it off. I want the old speed back.',
                'We were on a roll, what happened to the focus?',
                'I can tolerate a lot, but not slacking.',
                'Did you think I wouldn\'t notice that drop?',
                'You\'re better than whatever that last burst was.',
                'Shake it off. I want the old speed back.',
                'We were on a roll, what happened to the focus?',
                'I can tolerate a lot, but not slacking.',
                'Did you think I wouldn\'t notice that drop?',
                'You\'re better than whatever that last burst was.',
                'Shake it off. I want the old speed back.'
            ],
            same: [
                'Locked in at elite level',
                'Consistency is a superpower',
                'Machine-like precision',
                'A perfect echo of your last run',
                'Back-to-back bangers',
                'Refusing to yield an inch',
                'I\'m hypnotized by this consistency',
                'You\'re proving to me this wasn\'t a fluke',
                'We built a perfect machine here',
                'I\'m just enjoying the show at this point',
                'I\'m hypnotized by this consistency',
                'You\'re proving to me this wasn\'t a fluke',
                'We built a perfect machine here',
                'I\'m just enjoying the show at this point',
                'I am mesmerized by this.',
                'We\'re holding a masterclass in pacing.',
                'I\'m watching a machine at work.',
                'I am mesmerized by this.',
                'We\'re holding a masterclass in pacing.',
                'I\'m watching a machine at work.',
                'You are incredibly stubborn staying at this exact speed.',
                'I feel like I\'m watching a loading screen at 99%.',
                'Are we just going to set up camp at this WPM?',
                'Consistency is great, but show me some hustle.',
                'I admire your commitment to this exact number.',
                'We are officially pacing ourselves, aren\'t we?',
                'I could literally set a timer to your keystrokes.',
                'You are incredibly stubborn staying at this exact speed.',
                'I feel like I\'m watching a loading screen at 99%.',
                'Are we just going to set up camp at this WPM?',
                'Consistency is great, but show me some hustle.',
                'I admire your commitment to this exact number.',
                'We are officially pacing ourselves, aren\'t we?',
                'I could literally set a timer to your keystrokes.',
                'Machine-like, relentless pace.',
                'Sustained rapid-fire typing.',
                'Cruising effortlessly at high speed.',
                'We have found the golden pacing.',
                'I love seeing this number stay the exact same.',
                'Like a metronome, but with a keyboard.',
                'We have found the golden pacing.',
                'I love seeing this number stay the exact same.',
                'Like a metronome, but with a keyboard.',
                'I\'m charting this consistency, it\'s impressive.',
                'This is exactly what I meant by \'staying in the pocket\'.',
                'Rock steady. Don\'t budge an inch.',
                'I\'m charting this consistency, it\'s impressive.',
                'This is exactly what I meant by \'staying in the pocket\'.',
                'Rock steady. Don\'t budge an inch.',
                'I\'m charting this consistency, it\'s impressive.',
                'This is exactly what I meant by \'staying in the pocket\'.',
                'Rock steady. Don\'t budge an inch.'
            ],
            pb: [
                'PERSONAL BEST 🔥 You\'re on another level',
                'New all-time! The ceiling keeps rising',
                'Record shattered — this is your era',
                'A dominant performance. 👑',
                'You just casually raised the bar',
                'That\'s a highlight reel run',
                'We just set the standard! Look at that PB!',
                'I am screaming right now, absolutely elite',
                'You just blew my expectations out of the water',
                'We\'re taking trophies today!',
                'We just set the standard! Look at that PB!',
                'I am screaming right now, absolutely elite',
                'You just blew my expectations out of the water',
                'We\'re taking trophies today!',
                'I\'m throwing my papers in the air! PB!',
                'We are unstoppable at this point!',
                'I didn\'t even know you had that gear!',
                'I\'m throwing my papers in the air! PB!',
                'We are unstoppable at this point!',
                'I didn\'t even know you had that gear!',
                'I AM YELLING. A NEW PERSONAL BEST!',
                'You actually did it. You proved me wrong!',
                'Print out this WPM and frame it on your wall.',
                'I\'m telling everyone about this run.',
                'We did it! And by we, I mean you, but I\'m claiming credit.',
                'I am speechless. Mostly.',
                'I knew you were the chosen one.',
                'I AM YELLING. A NEW PERSONAL BEST!',
                'You actually did it. You proved me wrong!',
                'Print out this WPM and frame it on your wall.',
                'I\'m telling everyone about this run.',
                'We did it! And by we, I mean you, but I\'m claiming credit.',
                'I am speechless. Mostly.',
                'I knew you were the chosen one.',
                'A blazing new milestone.',
                'Pushing past previous limits.',
                'Yes! That\'s the breakthrough we needed!',
                'A new personal best! I knew you had it.',
                'Frame this WPM, you earned it.',
                'Yes! That\'s the breakthrough we needed!',
                'A new personal best! I knew you had it.',
                'Frame this WPM, you earned it.',
                'Put that in the record books!',
                'Another ceiling shattered!',
                'I didn\'t think we could squeeze more juice out of this keyboard!',
                'Put that in the record books!',
                'Another ceiling shattered!',
                'I didn\'t think we could squeeze more juice out of this keyboard!',
                'Put that in the record books!',
                'Another ceiling shattered!',
                'I didn\'t think we could squeeze more juice out of this keyboard!'
            ]
        },
        {
            min: 75, max: 99, // 💎 Blazing
            improve: [
                'Are those fingers or jet engines?',
                'Approaching the speed of thought',
                'The keyboard can barely keep up',
                'Typing.exe running at max FPS',
                'Warp drive engaged',
                'A hazard to nearby keyboards',
                'Operating outside of normal physics',
                'That\'s not typing, that\'s flying',
                'I ducked for cover watching you type that',
                'We are breaking the sound barrier',
                'I physically cannot type that fast, show off',
                'Are you actually human? Because I\'m scared',
                'I\'ve created a monster',
                'I ducked for cover watching you type that',
                'We are breaking the sound barrier',
                'I physically cannot type that fast, show off',
                'Are you actually human? Because I\'m scared',
                'I\'ve created a monster',
                'I physically stepped back from the monitor.',
                'We are bending reality right now.',
                'I don\'t think humans are supposed to type like this.',
                'You\'re a threat to national security.',
                'I physically stepped back from the monitor.',
                'We are bending reality right now.',
                'I don\'t think humans are supposed to type like this.',
                'You\'re a threat to national security.',
                'You are a certified weapon on this keyboard.',
                'I\'m holding onto my seat watching this.',
                'Are you streaming this? Because you should be.',
                'I feel like I need to pay a subscription to watch this.',
                'You\'re making the rest of us look bad.',
                'I physically cannot process these inputs fast enough.',
                'I think you might have superpowers.',
                'You are a certified weapon on this keyboard.',
                'I\'m holding onto my seat watching this.',
                'Are you streaming this? Because you should be.',
                'I feel like I need to pay a subscription to watch this.',
                'You\'re making the rest of us look bad.',
                'I physically cannot process these inputs fast enough.',
                'I think you might have superpowers.',
                'Supersonic speeds detected.',
                'Keys are practically melting.',
                'Functioning as an absolute blur.',
                'Did you spill coffee on the keyboard? You\'re flying.',
                'I\'m getting whiplash watching these numbers.',
                'The keyboard is asking for a break, don\'t give it one.',
                'I\'m running out of compliments for this speed.',
                'Did you spill coffee on the keyboard? You\'re flying.',
                'I\'m getting whiplash watching these numbers.',
                'The keyboard is asking for a break, don\'t give it one.',
                'I\'m running out of compliments for this speed.',
                'The keys are practically glowing at this point.',
                'You\'re writing the code faster than it can compile.',
                'I\'m taking notes on how not to blink.',
                'This is pure, unadulterated typing talent.',
                'The keys are practically glowing at this point.',
                'You\'re writing the code faster than it can compile.',
                'I\'m taking notes on how not to blink.',
                'This is pure, unadulterated typing talent.',
                'The keys are practically glowing at this point.',
                'You\'re writing the code faster than it can compile.',
                'I\'m taking notes on how not to blink.',
                'This is pure, unadulterated typing talent.',
                'I am grinning from ear to ear watching this.',
                'You are making this look entirely too easy.',
                'This is exactly why you\'re my favorite typist.',
                'I\'m running out of critiques. You\'re just that good.',
                'Keep this up and I might just give you a digital high-five.',
                'I am grinning from ear to ear watching this.',
                'You are making this look entirely too easy.',
                'This is exactly why you\'re my favorite typist.',
                'I\'m running out of critiques. You\'re just that good.',
                'Keep this up and I might just give you a digital high-five.',
                'I am grinning from ear to ear watching this.',
                'You are making this look entirely too easy.',
                'This is exactly why you\'re my favorite typist.',
                'I\'m running out of critiques. You\'re just that good.',
                'Keep this up and I might just give you a digital high-five.'
            ],
            decline: [
                'Even rockets need to refuel',
                'Dip? What dip? You\'re still elite',
                'A slow day for you is fast for everyone',
                'The wind-down before the wind-up',
                'Just a slight atmospheric drag',
                'Even supercars have to brake',
                'A momentary lapse in omniscience',
                'Coasting instead of accelerating',
                'I thought gods didn\'t bleed?',
                'Even you have limits, it seems',
                'I caught you resting on your laurels',
                'We can\'t afford to slow down now',
                'You made me think you were mortal for a second',
                'I thought gods didn\'t bleed?',
                'Even you have limits, it seems',
                'I caught you resting on your laurels',
                'We can\'t afford to slow down now',
                'You made me think you were mortal for a second',
                'I guess gravity still applies to you.',
                'We blinked and lost the combo.',
                'I hold you to a higher standard.',
                'You remembered you\'re not a machine?',
                'I guess gravity still applies to you.',
                'We blinked and lost the combo.',
                'I hold you to a higher standard.',
                'You remembered you\'re not a machine?',
                'It\'s okay, even pros have off-seconds.',
                'I\'ll let you catch your breath. Just this once.',
                'We dropped a frame, but you\'re still insane.',
                'Are you human after all?',
                'I guess you do need to blink occasionally.',
                'You spoiled me earlier, don\'t slow down now!',
                'I expected godhood, and you gave me demigod.',
                'It\'s okay, even pros have off-seconds.',
                'I\'ll let you catch your breath. Just this once.',
                'We dropped a frame, but you\'re still insane.',
                'Are you human after all?',
                'I guess you do need to blink occasionally.',
                'You spoiled me earlier, don\'t slow down now!',
                'I expected godhood, and you gave me demigod.',
                'Exiting high-altitude orbit.',
                'Experiencing minor turbulence.',
                'Primary thrusters cooling down.',
                'Even at this speed, I saw that hesitation.',
                'You slipped, but you\'re still moving faster than most.',
                'I expect perfection when you type this fast.',
                'Even at this speed, I saw that hesitation.',
                'You slipped, but you\'re still moving faster than most.',
                'I expect perfection when you type this fast.',
                'Even sports cars need to change tires sometimes.',
                'You dropped a frame, but you\'re still moving at mach speed.',
                'I\'ll let you catch your breath. Just barely.',
                'Even sports cars need to change tires sometimes.',
                'You dropped a frame, but you\'re still moving at mach speed.',
                'I\'ll let you catch your breath. Just barely.',
                'Even sports cars need to change tires sometimes.',
                'You dropped a frame, but you\'re still moving at mach speed.',
                'I\'ll let you catch your breath. Just barely.',
                'I\'m charting our efficiency, and that drop just ruined my graph.',
                'We don\'t do \'breaks\' when we\'re pushing 80 WPM.',
                'Are you admiring your own typing? Keep your eyes on the clock.',
                'That typo just cost us precious momentum.',
                'Let\'s treat the backspace key like it\'s radioactive. Don\'t touch it.',
                'I\'m charting our efficiency, and that drop just ruined my graph.',
                'We don\'t do \'breaks\' when we\'re pushing 80 WPM.',
                'Are you admiring your own typing? Keep your eyes on the clock.',
                'That typo just cost us precious momentum.',
                'Let\'s treat the backspace key like it\'s radioactive. Don\'t touch it.',
                'I\'m charting our efficiency, and that drop just ruined my graph.',
                'We don\'t do \'breaks\' when we\'re pushing 80 WPM.',
                'Are you admiring your own typing? Keep your eyes on the clock.',
                'That typo just cost us precious momentum.',
                'Let\'s treat the backspace key like it\'s radioactive. Don\'t touch it.',
                'I expect perfection in this bracket. Try again.',
                'Don\'t get cocky just because you\'re fast.',
                'We don\'t accept \'good enough\' when we\'re aiming for godlike.',
                'I felt that mistake from across the network.',
                'You owe me 10 flawless words for that stumble.',
                'I expect perfection in this bracket. Try again.',
                'Don\'t get cocky just because you\'re fast.',
                'We don\'t accept \'good enough\' when we\'re aiming for godlike.',
                'I felt that mistake from across the network.',
                'You owe me 10 flawless words for that stumble.',
                'I expect perfection in this bracket. Try again.',
                'Don\'t get cocky just because you\'re fast.',
                'We don\'t accept \'good enough\' when we\'re aiming for godlike.',
                'I felt that mistake from across the network.',
                'You owe me 10 flawless words for that stumble.'
            ],
            same: [
                'You\'ve achieved orbit — holding steady',
                'Cruising at mach speed',
                'Auto-pilot at 80+ WPM is insane',
                'Frozen at the edge of human limits',
                'A flawless playback of greatness',
                'Maintaining supersonic speeds',
                'I\'m watching perfection loop itself',
                'We\'ve reached the absolute peak of the mountain',
                'I\'m trying to find a flaw, but I can\'t',
                'You\'re just mocking me now with this speed',
                'I\'m watching perfection loop itself',
                'We\'ve reached the absolute peak of the mountain',
                'I\'m trying to find a flaw, but I can\'t',
                'You\'re just mocking me now with this speed',
                'I\'m terrified to interrupt this flow.',
                'We are skating on the edge of the speed limit.',
                'I think my tracking software is breaking.',
                'I\'m terrified to interrupt this flow.',
                'We are skating on the edge of the speed limit.',
                'I think my tracking software is breaking.',
                'I am perfectly content just watching you cruise.',
                'We are holding a masterclass in elite typing right now.',
                'I don\'t want you to change a thing.',
                'You are floating at the peak of the mountain.',
                'I am taking notes on how you type.',
                'This consistency at this speed is terrifying.',
                'You\'ve broken my critique module. I have no notes.',
                'I am perfectly content just watching you cruise.',
                'We are holding a masterclass in elite typing right now.',
                'I don\'t want you to change a thing.',
                'You are floating at the peak of the mountain.',
                'I am taking notes on how you type.',
                'This consistency at this speed is terrifying.',
                'You\'ve broken my critique module. I have no notes.',
                'High-speed orbit stabilized.',
                'Sustaining near-mach velocities.',
                'Relentless, blinding velocity.',
                'I am entranced by this sustained speed.',
                'Your consistency at this level is actually scary.',
                'Let\'s just freeze the WPM counter here.',
                'I am entranced by this sustained speed.',
                'Your consistency at this level is actually scary.',
                'Let\'s just freeze the WPM counter here.',
                'Hypnotic. Truly mesmerizing speed.',
                'The definition of locked in.',
                'If I was a keyboard, I\'d be terrified of you.',
                'Hypnotic. Truly mesmerizing speed.',
                'The definition of locked in.',
                'If I was a keyboard, I\'d be terrified of you.',
                'Hypnotic. Truly mesmerizing speed.',
                'The definition of locked in.',
                'If I was a keyboard, I\'d be terrified of you.'
            ],
            pb: [
                'PERSONAL BEST 💎 You\'re in the stratosphere',
                'Are you even human?? New record!',
                'Legendary run — history has been made',
                'A transcendental typing experience',
                'You just broke the sound barrier',
                'An absolute masterclass in speed',
                'I\'m archiving this run, that PB is illegal',
                'We just redefined what fast means',
                'I bowing down to you right now',
                'You are terrifying. Good job.',
                'I\'m archiving this run, that PB is illegal',
                'We just redefined what fast means',
                'I bowing down to you right now',
                'You are terrifying. Good job.',
                'I am calling the Guinness World Records.',
                'We just broke through the atmosphere!',
                'I\'m retiring. My work here is done.',
                'I am calling the Guinness World Records.',
                'We just broke through the atmosphere!',
                'I\'m retiring. My work here is done.',
                'I AM RESIGNING. YOU HAVE DEFEATED THE SYSTEM.',
                'I need to lie down after witnessing that PB.',
                'You just rewrote the rules of typing.',
                'I am legally adopting you as my typing prodigy.',
                'Unreal. Unbelievable. Unmatched.',
                'I am logging this run into the hall of fame.',
                'We have ascended beyond mere keystrokes.',
                'I AM RESIGNING. YOU HAVE DEFEATED THE SYSTEM.',
                'I need to lie down after witnessing that PB.',
                'You just rewrote the rules of typing.',
                'I am legally adopting you as my typing prodigy.',
                'Unreal. Unbelievable. Unmatched.',
                'I am logging this run into the hall of fame.',
                'We have ascended beyond mere keystrokes.',
                'Shattering all standard expectations.',
                'A completely meteoric rise.',
                'I am printing this score out and putting it on my fridge.',
                'You are a menace! That PB is insane!',
                'I have no words. Just pure speed.',
                'I am printing this score out and putting it on my fridge.',
                'You are a menace! That PB is insane!',
                'I have no words. Just pure speed.',
                'We are breaking the laws of physics today!',
                'I am requesting a medal on your behalf.',
                'Spectacular. Simply unparalleled.',
                'We are breaking the laws of physics today!',
                'I am requesting a medal on your behalf.',
                'Spectacular. Simply unparalleled.',
                'We are breaking the laws of physics today!',
                'I am requesting a medal on your behalf.',
                'Spectacular. Simply unparalleled.'
            ]
        },
        {
            min: 100, max: Infinity, // 👑 Godlike
            improve: [
                'You\'re not typing, you\'re transcribing thoughts',
                'The keyboard is just a suggestion at this point',
                'Beyond mortal comprehension',
                'The matrix has you',
                'Are you jacking directly into the mainframe?',
                'The switches are begging for mercy',
                'A literal typing deity',
                'You\'re writing code into reality',
                'I am convinced you\'re a typing AI',
                'We shouldn\'t be able to go this fast',
                'I\'m calling the authorities, this is reckless',
                'Are you hacking? I\'m watching the logs',
                'I have nothing left to teach you',
                'I am convinced you\'re a typing AI',
                'We shouldn\'t be able to go this fast',
                'I\'m calling the authorities, this is reckless',
                'Are you hacking? I\'m watching the logs',
                'I have nothing left to teach you',
                'I am disconnecting your keyboard, this is unsafe.',
                'We just hacked the mainframe.',
                'I require a captcha to prove you\'re not a bot.',
                'You just ascended to a higher plane of existence.',
                'I am disconnecting your keyboard, this is unsafe.',
                'We just hacked the mainframe.',
                'I require a captcha to prove you\'re not a bot.',
                'You just ascended to a higher plane of existence.',
                'I am reporting you for speed hacks.',
                'The typing test is suing you for emotional damages.',
                'I am reporting you for speed hacks.',
                'The typing test is suing you for emotional damages.',
                'I\'m submitting this to a scientific journal.',
                'We have officially left human limitations behind.',
                'My servers are starting to smoke.',
                'I am genuinely afraid of what you could do to a database.',
                'This is a certified speedrun of the alphabet.',
                'Fingers moving faster than my refresh rate.',
                'I\'m submitting this to a scientific journal.',
                'We have officially left human limitations behind.',
                'My servers are starting to smoke.',
                'I am genuinely afraid of what you could do to a database.',
                'This is a certified speedrun of the alphabet.',
                'Fingers moving faster than my refresh rate.',
                'I\'m submitting this to a scientific journal.',
                'We have officially left human limitations behind.',
                'My servers are starting to smoke.',
                'I am genuinely afraid of what you could do to a database.',
                'This is a certified speedrun of the alphabet.',
                'Fingers moving faster than my refresh rate.',
                'Are your fingers even touching the keys?',
                'I\'m calling an exorcist for your keyboard.',
                'You\'ve officially broken my WPM tracker.',
                'Did you just download the dictionary into your brain?',
                'Are your fingers even touching the keys?',
                'I\'m calling an exorcist for your keyboard.',
                'You\'ve officially broken my WPM tracker.',
                'Did you just download the dictionary into your brain?',
                'Are your fingers even touching the keys?',
                'I\'m calling an exorcist for your keyboard.',
                'You\'ve officially broken my WPM tracker.',
                'Did you just download the dictionary into your brain?',
                'Are you secretly an octopus or something?',
                'The spacebar must be terrified of you.',
                'I\'m putting you under typing arrest. That\'s illegal speed.',
                'You\'re reading my mind and typing the words before I even think them.',
                'Are you secretly an octopus or something?',
                'The spacebar must be terrified of you.',
                'I\'m putting you under typing arrest. That\'s illegal speed.',
                'You\'re reading my mind and typing the words before I even think them.',
                'Are you secretly an octopus or something?',
                'The spacebar must be terrified of you.',
                'I\'m putting you under typing arrest. That\'s illegal speed.',
                'You\'re reading my mind and typing the words before I even think them.',
                'I am watching pure instinct take over.',
                'Even the CPU is struggling to keep up with you.',
                'You\'ve transcended the need for physical keyboards.',
                'I\'m calling it: you are legally a robot now.', ,
                'I am watching pure instinct take over.',
                'Even the CPU is struggling to keep up with you.',
                'You\'ve transcended the need for physical keyboards.',
                'I\'m calling it: you are legally a robot now.', ,
                'I am watching pure instinct take over.',
                'Even the CPU is struggling to keep up with you.',
                'You\'ve transcended the need for physical keyboards.',
                'I\'m calling it: you are legally a robot now.', ,
                'My tracking algorithms are starting to smoke.',
                'Are you secretly an AI sent back from the future?',
                'The keyboard is practically begging for a break.',
                'I\'m not even sure human hands can move like this.',
                'You\'re typing at the speed of light now.',
                'I think you just broke the sound barrier.',
                'This is what peak typing performance looks like.',
                'I\'m officially scared of your typing speed.',
                'Did you overclock your fingers?',
                'You\'re writing code faster than the CPU can process it.',
                'My tracking algorithms are starting to smoke.',
                'Are you secretly an AI sent back from the future?',
                'The keyboard is practically begging for a break.',
                'I\'m not even sure human hands can move like this.',
                'You\'re typing at the speed of light now.',
                'I think you just broke the sound barrier.',
                'This is what peak typing performance looks like.',
                'I\'m officially scared of your typing speed.',
                'Did you overclock your fingers?',
                'You\'re writing code faster than the CPU can process it.',
                'My tracking algorithms are starting to smoke.',
                'Are you secretly an AI sent back from the future?',
                'The keyboard is practically begging for a break.',
                'I\'m not even sure human hands can move like this.',
                'You\'re typing at the speed of light now.',
                'I think you just broke the sound barrier.',
                'This is what peak typing performance looks like.',
                'I\'m officially scared of your typing speed.',
                'Did you overclock your fingers?',
                'You\'re writing code faster than the CPU can process it.'
            ],
            decline: [
                'Even gods rest between miracles',
                'A \'bad\' run at 100+ is still legendary',
                'Just flexing range at this point',
                'Warming up for the real show',
                'A drop in the ocean of your skill',
                'Merely pacing yourself for the mortals',
                'Even the cosmos takes a breath',
                'A tactical downshift',
                'I see you pacing yourself for my sake',
                'You dropped... to a speed I can still only dream of',
                'Even at your worst, I\'m terrified of you',
                'We both know you\'re just taking a breather',
                'I\'ll let this one slide, your majesty',
                'I see you pacing yourself for my sake',
                'You dropped... to a speed I can still only dream of',
                'Even at your worst, I\'m terrified of you',
                'We both know you\'re just taking a breather',
                'I\'ll let this one slide, your majesty',
                'I see, letting the keyboard cool down.',
                'Even the sun sets, my friend.',
                'I\'ll look the other way on this one.',
                'We can\'t always be perfect, just almost.',
                'I see, letting the keyboard cool down.',
                'Even the sun sets, my friend.',
                'I\'ll look the other way on this one.',
                'We can\'t always be perfect, just almost.',
                'I guess mortals must breathe occasionally.',
                'It\'s fine, I didn\'t want to see 200 WPM anyway.',
                'I guess mortals must breathe occasionally.',
                'It\'s fine, I didn\'t want to see 200 WPM anyway.',
                'Even deities rest on the seventh day.',
                'I see you stepping back from the abyss of perfection.',
                'Did a fly land on your screen?',
                'You dropped an RPM, maybe check your oil.',
                'I suppose infinite acceleration is impossible.',
                'I blinked and you slowed down. Don\'t do it again.',
                'Even deities rest on the seventh day.',
                'I see you stepping back from the abyss of perfection.',
                'Did a fly land on your screen?',
                'You dropped an RPM, maybe check your oil.',
                'I suppose infinite acceleration is impossible.',
                'I blinked and you slowed down. Don\'t do it again.',
                'Even deities rest on the seventh day.',
                'I see you stepping back from the abyss of perfection.',
                'Did a fly land on your screen?',
                'You dropped an RPM, maybe check your oil.',
                'I suppose infinite acceleration is impossible.',
                'I blinked and you slowed down. Don\'t do it again.',
                'Looks like you remembered you are human.',
                'Ah, a momentary lapse in your godhood.',
                'I was starting to think you didn\'t need to breathe.',
                'Take a microsecond break, you earned it.',
                'Looks like you remembered you are human.',
                'Ah, a momentary lapse in your godhood.',
                'I was starting to think you didn\'t need to breathe.',
                'Take a microsecond break, you earned it.',
                'Looks like you remembered you are human.',
                'Ah, a momentary lapse in your godhood.',
                'I was starting to think you didn\'t need to breathe.',
                'Take a microsecond break, you earned it.',
                'Even lightning has to strike twice sometimes.',
                'You blinked! I saw it!',
                'A minor drop in performance. Still terrifying, but minor.',
                'Don\'t tease me with slower speeds, keep the heat up.',
                'Even lightning has to strike twice sometimes.',
                'You blinked! I saw it!',
                'A minor drop in performance. Still terrifying, but minor.',
                'Don\'t tease me with slower speeds, keep the heat up.',
                'Even lightning has to strike twice sometimes.',
                'You blinked! I saw it!',
                'A minor drop in performance. Still terrifying, but minor.',
                'Don\'t tease me with slower speeds, keep the heat up.',
                'The typing deities frown upon this minor slowdown.',
                'Did you forget which key W is for a millisecond?',
                'A momentary glitch in the matrix, I presume.',
                'I\'m willing to overlook that stutter. barely.',
                'The typing deities frown upon this minor slowdown.',
                'Did you forget which key W is for a millisecond?',
                'A momentary glitch in the matrix, I presume.',
                'I\'m willing to overlook that stutter. barely.',
                'The typing deities frown upon this minor slowdown.',
                'Did you forget which key W is for a millisecond?',
                'A momentary glitch in the matrix, I presume.',
                'I\'m willing to overlook that stutter. barely.',
                'Did you stop to take a sip of water?',
                'A slight dip, but you\'re still miles ahead of everyone else.',
                'Even machines need to cool down I guess.',
                'Let\'s pretend that small hesitation didn\'t happen.',
                'I saw that! But I\'ll let it slide because of the speed.',
                'You dropped a few WPM, but who\'s counting at this point?',
                'Just a minor speed bump on the autobahn.',
                'Did the keyboard push back for a second?',
                'A rare moment of mortality from the typing god.',
                'Taking a breather? Good, I need one just watching you.',
                'Did you stop to take a sip of water?',
                'A slight dip, but you\'re still miles ahead of everyone else.',
                'Even machines need to cool down I guess.',
                'Let\'s pretend that small hesitation didn\'t happen.',
                'I saw that! But I\'ll let it slide because of the speed.',
                'You dropped a few WPM, but who\'s counting at this point?',
                'Just a minor speed bump on the autobahn.',
                'Did the keyboard push back for a second?',
                'A rare moment of mortality from the typing god.',
                'Taking a breather? Good, I need one just watching you.',
                'Did you stop to take a sip of water?',
                'A slight dip, but you\'re still miles ahead of everyone else.',
                'Even machines need to cool down I guess.',
                'Let\'s pretend that small hesitation didn\'t happen.',
                'I saw that! But I\'ll let it slide because of the speed.',
                'You dropped a few WPM, but who\'s counting at this point?',
                'Just a minor speed bump on the autobahn.',
                'Did the keyboard push back for a second?',
                'A rare moment of mortality from the typing god.',
                'Taking a breather? Good, I need one just watching you.',
                'Did you trip over a semicolon?',
                'Oh no, the friction finally caught up to your fingertips.',
                'I was promised a machine, but I guess I got a human.',
                'Ah, I see the caffeine is starting to wear off.',
                'Did your cat just walk across the keyboard?',
                'You dropped a frame. Unacceptable. I want a refund.',
                'Looks like gravity still applies to you after all.',
                'Are we remembering that typos cost time now?',
                'Even superheroes have to stop for red lights, I guess.',
                'I\'ll close my eyes and pretend that didn\'t just happen.',
                'The illusion shatters. You are mortal, after all.',
                'A tragic fall from grace in the blink of an eye.',
                'The heavens weep at this sudden deceleration.',
                'I watched a god bleed WPM today.',
                'How quickly the mighty stumble.',
                'A catastrophic lapse in concentration.',
                'The momentum dies, and silence takes the keys.',
                'I am witnessing the collapse of an empire.',
                'From the stratosphere back down to the dirt.',
                'Perfection was in our grasp, and we let it slip.',
                'Did you trip over a semicolon?',
                'Oh no, the friction finally caught up to your fingertips.',
                'I was promised a machine, but I guess I got a human.',
                'Ah, I see the caffeine is starting to wear off.',
                'Did your cat just walk across the keyboard?',
                'You dropped a frame. Unacceptable. I want a refund.',
                'Looks like gravity still applies to you after all.',
                'Are we remembering that typos cost time now?',
                'Even superheroes have to stop for red lights, I guess.',
                'I\'ll close my eyes and pretend that didn\'t just happen.',
                'The illusion shatters. You are mortal, after all.',
                'A tragic fall from grace in the blink of an eye.',
                'The heavens weep at this sudden deceleration.',
                'I watched a god bleed WPM today.',
                'How quickly the mighty stumble.',
                'A catastrophic lapse in concentration.',
                'The momentum dies, and silence takes the keys.',
                'I am witnessing the collapse of an empire.',
                'From the stratosphere back down to the dirt.',
                'Perfection was in our grasp, and we let it slip.',
                'Did you trip over a semicolon?',
                'Oh no, the friction finally caught up to your fingertips.',
                'I was promised a machine, but I guess I got a human.',
                'Ah, I see the caffeine is starting to wear off.',
                'Did your cat just walk across the keyboard?',
                'You dropped a frame. Unacceptable. I want a refund.',
                'Looks like gravity still applies to you after all.',
                'Are we remembering that typos cost time now?',
                'Even superheroes have to stop for red lights, I guess.',
                'I\'ll close my eyes and pretend that didn\'t just happen.',
                'The illusion shatters. You are mortal, after all.',
                'A tragic fall from grace in the blink of an eye.',
                'The heavens weep at this sudden deceleration.',
                'I watched a god bleed WPM today.',
                'How quickly the mighty stumble.',
                'A catastrophic lapse in concentration.',
                'The momentum dies, and silence takes the keys.',
                'I am witnessing the collapse of an empire.',
                'From the stratosphere back down to the dirt.',
                'Perfection was in our grasp, and we let it slip.',
                'I\'m not paying you to hit the backspace key.',
                'Every second you hesitate, a slower typist gets their wings.',
                'We are on the clock here, let\'s keep the pace.',
                'Did you think we had time for a coffee break mid-sentence?',
                'I didn\'t realize \'hesitation\' was part of the strategy.',
                'Typos aren\'t just mistakes; they\'re wasted milliseconds.',
                'You\'re bleeding speed, and frankly, it\'s hurting my metrics.',
                'Is your backspace key getting sticky, or is that just you?',
                'I need 110% efficiency, and right now I\'m getting 95%.',
                'Remember: hesitation is the enemy of a new PB.',
                'I\'m not paying you to hit the backspace key.',
                'Every second you hesitate, a slower typist gets their wings.',
                'We are on the clock here, let\'s keep the pace.',
                'Did you think we had time for a coffee break mid-sentence?',
                'I didn\'t realize \'hesitation\' was part of the strategy.',
                'Typos aren\'t just mistakes; they\'re wasted milliseconds.',
                'You\'re bleeding speed, and frankly, it\'s hurting my metrics.',
                'Is your backspace key getting sticky, or is that just you?',
                'I need 110% efficiency, and right now I\'m getting 95%.',
                'Remember: hesitation is the enemy of a new PB.',
                'I\'m not paying you to hit the backspace key.',
                'Every second you hesitate, a slower typist gets their wings.',
                'We are on the clock here, let\'s keep the pace.',
                'Did you think we had time for a coffee break mid-sentence?',
                'I didn\'t realize \'hesitation\' was part of the strategy.',
                'Typos aren\'t just mistakes; they\'re wasted milliseconds.',
                'You\'re bleeding speed, and frankly, it\'s hurting my metrics.',
                'Is your backspace key getting sticky, or is that just you?',
                'I need 110% efficiency, and right now I\'m getting 95%.',
                'Remember: hesitation is the enemy of a new PB.'
            ],
            same: [
                'Pinned at the ceiling of human ability',
                'This isn\'t typing, this is art',
                'Consistent god-tier — not even fair',
                'A flawless cycle of perfection',
                'Untouchable consistency at the top',
                'You are the benchmark now',
                'I am stuck in an endless loop of your greatness',
                'We broke the matrix, it\'s just repeating now',
                'I don\'t even know how to react anymore',
                'You broke my scale.',
                'I am stuck in an endless loop of your greatness',
                'We broke the matrix, it\'s just repeating now',
                'I don\'t even know how to react anymore',
                'You broke my scale.',
                'I am watching a loop of perfection.',
                'We broke the engine. It\'s stuck at max speed.',
                'I bow down to consistent godhood.',
                'I am watching a loop of perfection.',
                'We broke the engine. It\'s stuck at max speed.',
                'I bow down to consistent godhood.',
                'I am staring at perfection.',
                'We are officially a hivemind with the keyboard.',
                'I am staring at perfection.',
                'We are officially a hivemind with the keyboard.',
                'A continuous river of absolute typing mastery.',
                'I am witnessing a digital phenomenon.',
                'If I close my eyes, it sounds like rain.',
                'A perfectly tuned engine running at redline.',
                'I have run out of things to say. Keep going.',
                'You are a machine, and I respect that.',
                'A continuous river of absolute typing mastery.',
                'I am witnessing a digital phenomenon.',
                'If I close my eyes, it sounds like rain.',
                'A perfectly tuned engine running at redline.',
                'I have run out of things to say. Keep going.',
                'You are a machine, and I respect that.',
                'A continuous river of absolute typing mastery.',
                'I am witnessing a digital phenomenon.',
                'If I close my eyes, it sounds like rain.',
                'A perfectly tuned engine running at redline.',
                'I have run out of things to say. Keep going.',
                'You are a machine, and I respect that.',
                'The consistency of a quantum computer.',
                'I am watching an anomaly in real-time.',
                'You\'re trapped in a loop of pure speed.',
                'How are you maintaining this? Actually, don\'t tell me.',
                'The consistency of a quantum computer.',
                'I am watching an anomaly in real-time.',
                'You\'re trapped in a loop of pure speed.',
                'How are you maintaining this? Actually, don\'t tell me.',
                'The consistency of a quantum computer.',
                'I am watching an anomaly in real-time.',
                'You\'re trapped in a loop of pure speed.',
                'How are you maintaining this? Actually, don\'t tell me.'
            ],
            pb: [
                'PERSONAL BEST 👑 Absolutely inhuman',
                'The record that shouldn\'t be possible',
                'Hall of fame. No debate',
                'A legendary event just occurred',
                'You are the reason speed caps exist',
                'An immortal run. 🤯',
                'I\'m literally crying, how did you PB here?!',
                'We just won the internet. Shut it down.',
                'I bow to the one true typing deity',
                'You destroyed the universe with that speed.',
                'I\'m literally crying, how did you PB here?!',
                'We just won the internet. Shut it down.',
                'I bow to the one true typing deity',
                'You destroyed the universe with that speed.',
                'I am legally not allowed to comprehend this speed.',
                'We just caused a singularity.',
                'I have ascended just by watching you.',
                'I am legally not allowed to comprehend this speed.',
                'We just caused a singularity.',
                'I have ascended just by watching you.',
                'The universe just expanded to make room for this PB.',
                'I quit. You win typing.',
                'The universe just expanded to make room for this PB.',
                'I quit. You win typing.',
                'The simulation cannot handle you!',
                'I\'m speechless. Just... wow.',
                'I will be telling my grandchildren about this run.',
                'We have achieved maximum velocity.',
                'You are officially the final boss of typing.',
                'The simulation is breaking down. PB secured!',
                'The simulation cannot handle you!',
                'I\'m speechless. Just... wow.',
                'I will be telling my grandchildren about this run.',
                'We have achieved maximum velocity.',
                'You are officially the final boss of typing.',
                'The simulation is breaking down. PB secured!',
                'The simulation cannot handle you!',
                'I\'m speechless. Just... wow.',
                'I will be telling my grandchildren about this run.',
                'We have achieved maximum velocity.',
                'You are officially the final boss of typing.',
                'The simulation is breaking down. PB secured!',
                'That was a legendary performance, full stop.',
                'A new high score on a machine that shouldn\'t exist.',
                'I bow before the typing mastermind.',
                'This run will be studied by future generations.',
                'That was a legendary performance, full stop.',
                'A new high score on a machine that shouldn\'t exist.',
                'I bow before the typing mastermind.',
                'This run will be studied by future generations.',
                'That was a legendary performance, full stop.',
                'A new high score on a machine that shouldn\'t exist.',
                'I bow before the typing mastermind.',
                'This run will be studied by future generations.'
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
            { max: 3, messages: ['↑{d} WPM — not bad, not great', '+{d}? hey, a win\'s a win', 'up by {d}... baby steps count', '{d} WPM bump — slow clap', 'a whole {d} WPM faster — progress', '+{d} WPM, you blinked and improved', 'inched up by {d} — we take those', '↑{d} — barely, but it counts'] },
            { max: 8, messages: ['↑{d} WPM — now that\'s movement', '+{d}? okay, we see you', 'jumped {d} WPM — getting warmer', '{d} WPM faster, the gears are turning', 'up {d} — that felt smooth', '+{d} WPM, momentum is real', '↑{d} — the engine\'s revving', 'climbed {d} WPM — keep that energy'] },
            { max: 15, messages: ['↑{d} WPM — that\'s a real jump!', '+{d}? you just hit a growth spurt', 'up {d} WPM — the grind is paying off', '{d} WPM leap — who even are you right now', '+{d} — went from walking to sprinting', '↑{d} WPM, that\'s not luck, that\'s skill', 'gained {d} WPM — your fingers leveled up', '+{d}? did you just download typing skills?'] },
            { max: 25, messages: ['↑{d} WPM — uhh, what happened??', '+{d}? that\'s literally a glow up', 'jumped {d} WPM — someone had their coffee', '{d} WPM surge — actual protagonist behavior', '+{d} — you skipped a whole rank', '↑{d} WPM, were you sandbagging before?', 'gained {d} WPM — the plot twist nobody saw', '+{d}? the keyboard owes you an apology'] },
            { max: Infinity, messages: ['↑{d} WPM — EXCUSE ME??', '+{d}? that\'s not improvement, that\'s evolution', 'up {d} WPM — you broke the simulation', '{d} WPM gain — illegal amount of progress', '+{d} — did you just unlock a cheat code?', '↑{d} WPM, from NPC to final boss', 'gained {d} WPM — the glow up of the century', '+{d}? someone call the authorities'] }
        ],
        decline: [
            { max: 3, messages: ['↓{d} WPM — basically nothing', '−{d}? margin of error tbh', 'dropped {d} WPM — just a hiccup', '−{d} WPM, even robots have variance', 'down {d} — that\'s rounding error', '↓{d} — blink and you\'d miss it', 'lost {d} WPM — doesn\'t even count', '−{d}? the keyboard sneezed'] },
            { max: 8, messages: ['↓{d} WPM — just cooling off', '−{d}? take a breath, you\'re fine', 'down {d} WPM — a pit stop, not a crash', '−{d} — shaking off some rust', 'dropped {d} WPM, the comeback writes itself', '↓{d} — savings energy for the next one', 'lost {d} WPM — character development', '−{d}? just the setup for a better punchline'] },
            { max: 15, messages: ['↓{d} WPM — okay, shake that off', '−{d}? it happens to the best of us', 'down {d} WPM — growth isn\'t linear', '−{d} — the plot needed some tension', 'dropped {d} WPM, your fingers are just stretching', '↓{d} — every legend has a chapter like this', 'lost {d} WPM — fuel for the motivation fire', '−{d}? the redemption arc starts now'] },
            { max: 25, messages: ['↓{d} WPM — yikes, you good?', '−{d}? maybe the keyboard needs therapy', 'down {d} WPM — we don\'t talk about this one', '−{d} — ...were you typing with your elbows?', 'dropped {d} WPM, let\'s pretend this didn\'t happen', '↓{d} — the gravity was strong on this one', 'lost {d} WPM — emotional damage', '−{d}? that test had bad vibes'] },
            { max: Infinity, messages: ['↓{d} WPM — was that even the same person?', '−{d}? did someone swap your hands?', 'down {d} WPM — catastrophic, but recoverable', '−{d} — that test needs to be classified', 'dropped {d} WPM, witness protection needed', '↓{d} — we\'re choosing to forget this one', 'lost {d} WPM — the keyboard is filing a complaint', '−{d}? speedrun to the bottom???'] }
        ],
        pb: [
            { max: 5, messages: ['NEW PB! +{d} above your best — every bit counts', 'PB by {d} WPM — squeezed it out 👑', 'beat your record by {d} — the grind works', '+{d} over your PB — clutch performance', 'new best by {d} WPM — respect the increment', 'PB +{d} — the ceiling just moved'] },
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

    function pick(arr) {
        if (arr.length <= 1) return arr[0];
        let idx;
        do {
            idx = Math.floor(Math.random() * arr.length);
        } while (idx === arr._lastPickIdx);
        arr._lastPickIdx = idx;
        return arr[idx];
    }

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


            // 🎯 Accuracy & Streak System Override
            const accuracyFlavours = {
                100: [
                    "Flawless execution. Not a single backspace needed.",
                    "Surgical precision. You didn't even blink.",
                    "100% accuracy. The keyboard is an extension of your mind.",
                    "Perfectly typed. I respect the discipline.",
                    "Not a single typo. You're a machine.",
                    "100% on the dot. I’m saving this run to my hard drive.",
                    "I was watching your backspace key. It didn't move once.",
                    "Pure 100%. You type like you already know the future.",
                    "Zero mistakes. Zero hesitation. Absolute perfection.",
                    "A 100% accuracy rate? Are you trying to take my job?"
                ],
                90: [
                    "You're typing fast, but your backspace key is doing half the work.",
                    "We call that the 'pray and spray' method.",
                    "Speed means nothing if you can't hit the right keys.",
                    "I think you need to apologize to your backspace key.",
                    "Slow down and aim. You're misfiring everywhere.",
                    `${lastAccResult}% accuracy? That is actually bad.`,
                    `I'm looking at ${lastAccResult}% accuracy and I am judging you.`,
                    `You went fast, but at the cost of ${lastAccResult}% accuracy. Not worth it.`,
                    `Only ${lastAccResult}%? We need to go back to the basics.`,
                    `I physically winced watching you type with ${lastAccResult}% accuracy.`,
                    `${lastAccResult}% accuracy... did you type that with your elbows?`,
                    `Are we just guessing where the keys are now? ${lastAccResult}%...`,
                    `I can hear your backspace key crying from here.`,
                    `Fast hands, zero aim. ${lastAccResult}% proves it.`,
                    `I'm revoking your speed license until that ${lastAccResult}% goes up.`,
                    `You're treating the keyboard like a drum kit. Aim!`,
                    `My grandmother types with better than ${lastAccResult}% accuracy.`,
                    `At ${lastAccResult}%, you're just creating more work for yourself.`,
                    `I'm prescribing you 10 minutes of slow practice after that ${lastAccResult}%.`,
                    `You know the backspace key isn't a required part of the test, right?`,
                    `We do not accept ${lastAccResult}% accuracy in this dojo.`,
                    `That was painful to watch. Get your accuracy up.`,
                    `I saw you panic hitting keys at the end there. ${lastAccResult}%.`,
                    `Slow down. Breathe. Hit the CORRECT keys.`,
                    `If I wanted to see ${lastAccResult}% accuracy, I'd let a cat walk on the keyboard.`,
                    `I would applaud your speed, but the ${lastAccResult}% accuracy makes me sad.`,
                    `You look like you're fighting the keyboard instead of typing on it.`,
                    `${lastAccResult}% accuracy... did you close your eyes for half the test?`,
                    `I can see the ${lastAccResult}% accuracy. Stop mashing the keys.`,
                    `There are 26 letters in the alphabet. Try hitting the right ones next time.`,
                    `I'm going to pretend I didn't see that ${lastAccResult}% accuracy.`,
                    `You're typing like you're wearing mittens.`,
                    `${lastAccResult}% accuracy is a crime against this mechanical keyboard.`,
                    `Speed: High. Accuracy: ${lastAccResult}%. Overall rating: Disappointing.`,
                    `I think we need to recalibrate your fingers.`,
                    `That ${lastAccResult}% accuracy hurts me on a spiritual level.`,
                    `You're basically just mashing the keyboard and hoping for the best.`,
                    `Did someone change your keyboard layout halfway through? ${lastAccResult}%...`,
                    `Let's focus on hitting the keys instead of just bruising them.`,
                    `${lastAccResult}%... I guess we left our reading glasses in the other room.`,
                    `Next time, try using the Force. It might be better than ${lastAccResult}%.`,
                    `If ${lastAccResult}% accuracy was a grade, you would have failed the class.`,
                    `I see the ${lastAccResult}%. Your backspace key is working overtime today.`,
                    `At ${lastAccResult}%, you're typing more corrections than actual words.`,
                    `Please tell me you weren't trying your hardest for that ${lastAccResult}%.`,
                    `Your accuracy is so low, I thought a bird flew into the window. ${lastAccResult}%...`,
                    `Are you typing with your toes? Be honest. ${lastAccResult}% is suspicious.`,
                    `I’ve seen better aim from a toddler with a water gun. ${lastAccResult}% accuracy?`,
                    `The keyboard called. It wants an apology for that ${lastAccResult}% massacre.`,
                    `If typos were worth points, you'd be at the top of the leaderboard. ${lastAccResult}%!`,
                    `You’re making the spellcheck engine sweat. ${lastAccResult}% accuracy is a lot.`,
                    `I thought my sensors were glitching, but no, you really hit ${lastAccResult}%.`,
                    `Are we practicing for a 'most typos' world record? Because you're winning at ${lastAccResult}%.`,
                    `Your keyboard is 90% keys and you still missed most of them. ${lastAccResult}%?`,
                    `I’m not saying it's bad, but the autocorrect just quit its job. ${lastAccResult}%.`,
                    `Did you replace your fingers with hot dogs recently? ${lastAccResult}% accuracy...`,
                    `I’ve seen more precision in a landslide. ${lastAccResult}%?`,
                    `Is this a typing test or a stress test for the backspace key? ${lastAccResult}%.`,
                    `You’re hitting everything except the right letters. ${lastAccResult}% accuracy is impressive.`,
                    `I should charge you for the wear and tear on that backspace key. ${lastAccResult}%.`,
                    `You're pushing your speed, but the ${lastAccResult}% shows we need to focus on precision first.`,
                    `Speed is a byproduct of accuracy. Slow down slightly to fix that ${lastAccResult}%.`,
                    `At ${lastAccResult}%, you're losing more time on corrections than you're gaining in raw speed.`,
                    `Focus on your rhythm. Let's aim to bring that ${lastAccResult}% back into the 90s.`,
                    `A good coach knows when to slow down. That ${lastAccResult}% is a sign to reset.`,
                    `Let's work on 'clean' typing. Each typo on that ${lastAccResult}% run is a break in focus.`,
                    `Consistency over speed, always. ${lastAccResult}% is where the growth happens.`,
                    `Try to hit each key with intent. The ${lastAccResult}% will improve as you stay calm.`,
                    `Practice doesn't make perfect; perfect practice makes perfect. Focus on that ${lastAccResult}%.`,
                    `You've got the speed, now let's refine the control. ${lastAccResult}% is our starting point.`,
                    `Don't chase the WPM yet. Chase the 100%. That ${lastAccResult}% is just a stepping stone.`,
                    `Visualize the word before you type it. It will help clear up those ${lastAccResult}% errors.`,
                    `Accuracy is the foundation. Let's rebuild it from this ${lastAccResult}% run.`,
                    `Watch your hands, not the screen if you have to. We need to stabilize that ${lastAccResult}%.`,
                    `Every pro started where you are now. Take that ${lastAccResult}% and learn from the misses.`
                ]
            };

            const streakFlavours = {
                10: [
                    "TEN IN A ROW. You are officially untouchable.",
                    "A double-digit streak! The keyboard bows to you.",
                    "I have never seen such flawless, sustained performance.",
                    `${winStreak} wins back-to-back. You are entering legendary status.`,
                    `A ${winStreak} win streak... I'm submitting this to the archives.`
                ],
                5: [
                    "Back to back to back to back to back. Unstoppable.",
                    "Five runs without dropping. You've entered the flow state.",
                    "Your consistency is actually terrifying me right now.",
                    `A ${winStreak} streak! The momentum is undeniable.`,
                    `Don't look down now, you're ${winStreak} tests deep into a streak!`
                ],
                3: [
                    "Three solid runs in a row. You're heating up.",
                    "I see a streak forming. Don't choke now.",
                    "Consistent performance. Let's keep the chain going.",
                    `That's ${winStreak} in a row. We are building something here.`,
                    `${winStreak} consecutive wins. The engine is warm.`
                ],
                broken: [
                    "And the streak dies. Shake it off, let's start a new one.",
                    "You had a good run going. Don't let that drop ruin your mental.",
                    "The streak is over, but the grind continues.",
                    `And the streak dies at ${winStreak}. Shake it off, let's start a new one.`,
                    `You had a ${winStreak} run going. Don't let that drop ruin your mental.`,
                    `We lost the ${winStreak} streak... I'm actually mourning right now.`,
                    `Even the best drop a ${winStreak} streak eventually. Let's rebuild.`
                ]
            };

            const pbSloppyFlavours = [
                `NEW PB! But ${lastAccResult}% accuracy? You won, but at what cost?`,
                `A new best of ${lastWpmResult} WPM! Just imagine if you actually hit the right keys...`,
                `PB SHATTERED! 👑 (Ignore the ${lastAccResult}% accuracy... we'll fix that later).`,
                `You're faster than ever, but as sloppy as ever. ${lastAccResult}% accuracy on a PB is wild.`,
                `New Record! 🔥 But ${lastAccResult}% accuracy is a lot of backspacing. Control that speed!`,
                `PB attained. Accuracy sacrificed. ${lastAccResult}% is the price of glory, I guess?`,
                `You just beat your best! 👑 Now let's try to do it without the ${lastAccResult}% misfire rate.`,
                `Speed: Legendary. Precision: ...needs work. Congrats on the ${lastAccResult}% accuracy PB!`,
                `A bittersweet PB. Fast enough to win, sloppy enough to worry me. ${lastAccResult}% accuracy.`,
                `You've reached a new peak speed! Just don't look down at the ${lastAccResult}% accuracy carnage.`,
                `Speed record broken! 🏎️ But the ${lastAccResult}% accuracy means there's still a long way to go.`,
                `That's a massive PB! 👑 (Maybe we should check if your backspace key is still alive after that ${lastAccResult}%).`,
                `You're getting faster, but your aim is still in the bronze tier. ${lastAccResult}% accuracy PB!`,
                `A chaotic PB. ${lastWpmResult} WPM with ${lastAccResult}% accuracy is the definition of 'controlled' panic.`,
                `You broke the record! 🎉 Now let's break the habit of hitting the wrong keys. ${lastAccResult}%...`
            ];



            function getOverrideText(isNewPB) {

                if (justBrokeStreak) return pick(streakFlavours.broken);

                // Sloppy PB (High priority - Celebrate speed but mention accuracy)
                if (isNewPB && lastAccResult > 0 && lastAccResult < 90) {
                    return pick(pbSloppyFlavours);
                }

                // Accuracy overrides (Only trigger if 20+ WPM and NOT a PB roast)
                if (lastWpmResult >= 20 && !isNewPB) {
                    if (lastAccResult === 100) return pick(accuracyFlavours[100]);
                    if (lastAccResult > 0 && lastAccResult < 90) return pick(accuracyFlavours[90]);
                }

                // Streak overrides
                if (winStreak >= 10) return pick(streakFlavours[10]);
                if (winStreak >= 5) return pick(streakFlavours[5]);
                if (winStreak >= 3) return pick(streakFlavours[3]);

                return null;
            }

            const override = prevWpm > 0 ? getOverrideText(isNewPB) : null;

            const showDelta = showDeltaCommentaryNext && lastWpmResult >= 20;
            let finalMsg = '';


            if (diff > 0) {
                if (arrowEl) arrowEl.textContent = '↑';
                if (diffEl) diffEl.textContent = diff;
                deltaEl.classList.remove('declined', 'same');
                deltaEl.classList.add('improved');

                if (isNewPB) {
                    finalMsg = override || (showDelta ? getDeltaComment('pb', diff, lastWpmResult) : pick(tier.pb));
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
                    finalMsg = override || (showDelta ? getDeltaComment('improve', diff, lastWpmResult) : pick(tier.improve));
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

                finalMsg = override || (showDelta ? getDeltaComment('decline', diff, lastWpmResult) : pick(tier.decline));

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

                finalMsg = override || (showDelta ? getDeltaComment('same', diff, lastWpmResult) : pick(tier.same));
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
    window.onTestComplete = function (wpm, accuracy = 0) {
        prevWpm = lastWpmResult;
        lastWpmResult = wpm;
        lastAccResult = accuracy;

        // Detect PB BEFORE updating it
        justHitPB = (wpm > personalBest && personalBest >= 0);

        // Update PB
        if (wpm > personalBest) {
            personalBest = wpm;
            localStorage.setItem(getPBKey(), personalBest);
        }

        // Update streak
        justBrokeStreak = false;
        if (prevWpm > 0 && wpm > prevWpm) {
            winStreak++;
        } else if (prevWpm > 0 && wpm < prevWpm) {
            if (winStreak >= 3) justBrokeStreak = true;
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
