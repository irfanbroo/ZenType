// ══════════════════════════════════════════════════════════
// SOUND ENGINE — Web Audio API Key Sound Synthesis
// 12 keyboard sound profiles + combo sound
// ══════════════════════════════════════════════════════════

let audioCtx = null;
let soundEnabled = true;
let noiseBuffer = null;

// --- Config reference (set by script.js at init) ---
let _config = {};
export function setSoundConfig(config) { _config = config; }

export function getAudioCtx() { return audioCtx; }
export function isSoundEnabled() { return soundEnabled; }
export function setSoundEnabled(val) { soundEnabled = val; }

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!noiseBuffer) {
        const bufferSize = audioCtx.sampleRate * 0.1;
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

export function autoInitAudio() {
    if (!audioCtx) {
        initAudio();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log("AudioContext resumed successfully");
        });
    }
    if (audioCtx) {
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
    }
    window.removeEventListener('click', autoInitAudio);
    window.removeEventListener('keydown', autoInitAudio);
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

export function playKeySound(correct) {
    if (!soundEnabled) return;
    if (!audioCtx) {
        console.warn("AudioCtx not initialized in playKeySound");
        return;
    }
    if (audioCtx.state !== 'running') {
        console.warn("AudioCtx state is:", audioCtx.state);
        audioCtx.resume();
    }

    const vol = (_config.soundVolume || 70) / 100;
    const profile = _config.soundProfile || 'typewriter';
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
// ══════════════════════════════════════════════════════════
function playSoundTypewriter(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.025, 0.12 * vol, rng(4500, 500), 2, 'highpass');
        const body = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(rng(1100, 100), t);
        body.frequency.exponentialRampToValueAtTime(400, t + 0.03);
        bodyGain.gain.setValueAtTime(0.07 * vol, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        body.connect(bodyGain); bodyGain.connect(audioCtx.destination);
        body.start(t); body.stop(t + 0.05);
        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(rng(180, 30), t);
        thud.frequency.exponentialRampToValueAtTime(80, t + 0.04);
        thudGain.gain.setValueAtTime(0.04 * vol, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        thud.connect(thudGain); thudGain.connect(audioCtx.destination);
        thud.start(t); thud.stop(t + 0.07);
        const spring = audioCtx.createOscillator();
        const springGain = audioCtx.createGain();
        spring.type = 'sine';
        spring.frequency.setValueAtTime(rng(5500, 400), t + 0.005);
        springGain.gain.setValueAtTime(0.015 * vol, t + 0.005);
        springGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        spring.connect(springGain); springGain.connect(audioCtx.destination);
        spring.start(t + 0.005); spring.stop(t + 0.05);
    } else {
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
// ══════════════════════════════════════════════════════════
function playSoundBlue(t, vol, correct) {
    if (correct) {
        const click1 = audioCtx.createOscillator();
        const click1Gain = audioCtx.createGain();
        click1.type = 'square';
        click1.frequency.setValueAtTime(rng(5000, 400), t);
        click1.frequency.exponentialRampToValueAtTime(2200, t + 0.006);
        click1Gain.gain.setValueAtTime(0.09 * vol, t);
        click1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
        click1.connect(click1Gain); click1Gain.connect(audioCtx.destination);
        click1.start(t); click1.stop(t + 0.015);
        createNoiseBurst(t, 0.01, 0.06 * vol, rng(6000, 500), 3, 'bandpass');
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
        createNoiseBurst(t + delay2, 0.012, 0.05 * vol, rng(5000, 500), 2.5, 'bandpass');
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
// ══════════════════════════════════════════════════════════
function playSoundCreamy(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.045, 0.14 * vol, rng(700, 100), 2.5, 'lowpass');
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
// ══════════════════════════════════════════════════════════
function playSoundRed(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.025, 0.08 * vol, rng(3000, 500), 2, 'bandpass');
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(rng(700, 50), t);
        osc.frequency.exponentialRampToValueAtTime(250, t + 0.05);
        gain.gain.setValueAtTime(0.12 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.08);
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
// PROFILE 5: BUBBLE — soft rounded "pop" with gentle ring
// ══════════════════════════════════════════════════════════
function playSoundBubble(t, vol, correct) {
    if (correct) {
        const pop = audioCtx.createOscillator();
        const popGain = audioCtx.createGain();
        pop.type = 'sine';
        pop.frequency.setValueAtTime(rng(1200, 150), t);
        pop.frequency.exponentialRampToValueAtTime(rng(350, 50), t + 0.06);
        popGain.gain.setValueAtTime(0.001, t);
        popGain.gain.linearRampToValueAtTime(0.1 * vol, t + 0.004);
        popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        pop.connect(popGain); popGain.connect(audioCtx.destination);
        pop.start(t); pop.stop(t + 0.1);
        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(rng(800, 80), t);
        ring.frequency.exponentialRampToValueAtTime(500, t + 0.08);
        ringGain.gain.setValueAtTime(0.04 * vol, t + 0.003);
        ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        ring.connect(ringGain); ringGain.connect(audioCtx.destination);
        ring.start(t + 0.003); ring.stop(t + 0.13);
        createNoiseBurst(t, 0.025, 0.02 * vol, rng(2000, 300), 0.7, 'lowpass');
    } else {
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
// PROFILE 6: LASER — sci-fi energy zap with harmonics
// ══════════════════════════════════════════════════════════
function playSoundLaser(t, vol, correct) {
    if (correct) {
        const osc1 = audioCtx.createOscillator();
        const osc1Gain = audioCtx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(rng(3200, 400), t);
        osc1.frequency.exponentialRampToValueAtTime(rng(200, 50), t + 0.07);
        osc1Gain.gain.setValueAtTime(0.06 * vol, t);
        osc1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc1.connect(osc1Gain); osc1Gain.connect(audioCtx.destination);
        osc1.start(t); osc1.stop(t + 0.09);
        const osc2 = audioCtx.createOscillator();
        const osc2Gain = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(rng(2400, 300), t);
        osc2.frequency.exponentialRampToValueAtTime(150, t + 0.06);
        osc2Gain.gain.setValueAtTime(0.03 * vol, t);
        osc2Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
        osc2.connect(osc2Gain); osc2Gain.connect(audioCtx.destination);
        osc2.start(t); osc2.stop(t + 0.07);
        createNoiseBurst(t, 0.015, 0.04 * vol, rng(7000, 800), 1.5, 'highpass');
    } else {
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
// PROFILE 7: TACTILE — Cherry MX Brown subtle bump
// ══════════════════════════════════════════════════════════
function playSoundTactile(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.018, 0.08 * vol, rng(3500, 400), 2, 'bandpass');
        const bump = audioCtx.createOscillator();
        const bumpGain = audioCtx.createGain();
        bump.type = 'sine';
        bump.frequency.setValueAtTime(rng(1800, 200), t);
        bump.frequency.exponentialRampToValueAtTime(700, t + 0.015);
        bumpGain.gain.setValueAtTime(0.06 * vol, t);
        bumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        bump.connect(bumpGain); bumpGain.connect(audioCtx.destination);
        bump.start(t); bump.stop(t + 0.03);
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
// PROFILE 8: MEMBRANE — soft mushy office keyboard
// ══════════════════════════════════════════════════════════
function playSoundMembrane(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.03, 0.1 * vol, rng(800, 100), 1.5, 'lowpass');
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
        squishGain.gain.linearRampToValueAtTime(0.09 * vol, t + 0.005);
        squishGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        squish.connect(squishFilter); squishFilter.connect(squishGain);
        squishGain.connect(audioCtx.destination);
        squish.start(t); squish.stop(t + 0.05);
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
// PROFILE 9: NEON — futuristic cyberpunk synth tone
// ══════════════════════════════════════════════════════════
function playSoundNeon(t, vol, correct) {
    if (correct) {
        const ping = audioCtx.createOscillator();
        const pingGain = audioCtx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(rng(2800, 300), t);
        ping.frequency.exponentialRampToValueAtTime(rng(1600, 200), t + 0.025);
        pingGain.gain.setValueAtTime(0.08 * vol, t);
        pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        ping.connect(pingGain); pingGain.connect(audioCtx.destination);
        ping.start(t); ping.stop(t + 0.05);
        const shimmer = audioCtx.createOscillator();
        const shimmerGain = audioCtx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(rng(1400, 150), t);
        shimmer.frequency.exponentialRampToValueAtTime(800, t + 0.05);
        shimmerGain.gain.setValueAtTime(0.04 * vol, t);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        shimmer.connect(shimmerGain); shimmerGain.connect(audioCtx.destination);
        shimmer.start(t); shimmer.stop(t + 0.08);
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
// PROFILE 10: RETRO — 8-bit chiptune blip
// ══════════════════════════════════════════════════════════
function playSoundRetro(t, vol, correct) {
    if (correct) {
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
        createNoiseBurst(t, 0.008, 0.04 * vol, rng(4000, 500), 4, 'bandpass');
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
// PROFILE 11: SPACE — ethereal cosmic whoosh
// ══════════════════════════════════════════════════════════
function playSoundSpace(t, vol, correct) {
    if (correct) {
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
        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(rng(3200, 300), t);
        ring.frequency.exponentialRampToValueAtTime(2000, t + 0.06);
        ringGain.gain.setValueAtTime(0.025 * vol, t);
        ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        ring.connect(ringGain); ringGain.connect(audioCtx.destination);
        ring.start(t); ring.stop(t + 0.1);
        createNoiseBurst(t, 0.05, 0.03 * vol, rng(3000, 500), 0.8, 'highpass');
    } else {
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
// PROFILE 12: BULLET — sharp percussive snap
// ══════════════════════════════════════════════════════════
function playSoundBullet(t, vol, correct) {
    if (correct) {
        createNoiseBurst(t, 0.012, 0.16 * vol, rng(6000, 800), 1.5, 'highpass');
        const snap = audioCtx.createOscillator();
        const snapGain = audioCtx.createGain();
        snap.type = 'sawtooth';
        snap.frequency.setValueAtTime(rng(2000, 300), t);
        snap.frequency.exponentialRampToValueAtTime(200, t + 0.012);
        snapGain.gain.setValueAtTime(0.1 * vol, t);
        snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        snap.connect(snapGain); snapGain.connect(audioCtx.destination);
        snap.start(t); snap.stop(t + 0.025);
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

export function previewSound(profile) {
    initAudio();
    const vol = (_config.soundVolume || 70) / 100;
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

export function playComboSound(comboLevel) {
    if (!soundEnabled || !audioCtx || !_config.comboSound) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const baseFreq = _config.pitchShift ? 500 + (comboLevel * 30) : 500;

    if (_config.pitchShift) {
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

export function toggleSound(soundBtnEl) {
    soundEnabled = !soundEnabled;
    const icon = soundBtnEl.querySelector('i');
    if (soundEnabled) {
        icon.className = 'ri-volume-up-line text-xl';
        soundBtnEl.classList.remove('muted');
    } else {
        icon.className = 'ri-volume-mute-line text-xl';
        soundBtnEl.classList.add('muted');
    }
    localStorage.setItem('zenTypeSoundEnabled', soundEnabled);
}
