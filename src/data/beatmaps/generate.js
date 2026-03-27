// Beatmap generator for Star Road
// Usage: node generate.js
// Generates full-length .osu files for all songs

const fs = require('fs');
const path = require('path');

const SONGS = [
    { file: 'megalovania.osu', title: 'Megalovania', artist: 'Toby Fox', bpm: 120, duration: 156, diff: 'Easy', od: 3 },
    { file: 'badapple.osu', title: 'Bad Apple!! feat. nomico', artist: 'Alstroemeria Records', bpm: 138, duration: 219, diff: 'Easy', od: 3 },
    { file: 'renaicirculation.osu', title: 'Renai Circulation', artist: 'Kana Hanazawa', bpm: 130, duration: 253, diff: 'Easy', od: 3 },
    { file: 'shelter.osu', title: 'Shelter', artist: 'Porter Robinson & Madeon', bpm: 130, duration: 219, diff: 'Normal', od: 5 },
    { file: 'gurenge.osu', title: 'Gurenge', artist: 'LiSA', bpm: 150, duration: 231, diff: 'Normal', od: 5 },
    { file: 'bloodystream.osu', title: 'Bloody Stream', artist: 'Coda', bpm: 138, duration: 264, diff: 'Normal', od: 5 },
    { file: 'bluzenith.osu', title: 'Blue Zenith', artist: 'xi', bpm: 180, duration: 252, diff: 'Hard', od: 7 },
    { file: 'nightofnights.osu', title: 'Night of Nights', artist: 'BEAT MARIO', bpm: 220, duration: 198, diff: 'Insane', od: 8 },
];

// X positions for 4K mania lanes
const LANE_X = [64, 192, 320, 448];

// Pattern library — each pattern is an array of [laneIndex, beatOffset] pairs
// beatOffset is in fractions of a beat (1 = full beat, 0.5 = half beat, etc.)
const PATTERNS = {
    easy: [
        // Single notes, one per beat, simple left-to-right
        [[0,0], [2,1], [1,2], [3,3]],
        [[1,0], [3,1], [0,2], [2,3]],
        [[0,0], [1,1], [2,2], [3,3]],
        [[3,0], [2,1], [1,2], [0,3]],
        // Alternating
        [[0,0], [3,1], [0,2], [3,3]],
        [[1,0], [2,1], [1,2], [2,3]],
        // With gap
        [[0,0], [2,2], [1,3]],
        [[3,0], [1,2], [2,3]],
        // Simple hold + tap
        [[0,0,'hold',2], [2,2], [3,3]],
        [[3,0,'hold',2], [1,2], [0,3]],
    ],
    normal: [
        // Faster singles
        [[0,0], [1,0.5], [2,1], [3,1.5], [1,2], [0,2.5], [2,3], [3,3.5]],
        [[2,0], [0,0.5], [3,1], [1,1.5], [0,2], [2,2.5], [1,3], [3,3.5]],
        // Doubles
        [[0,0], [3,0], [1,1], [2,1], [0,2], [2,2], [1,3], [3,3]],
        [[1,0], [2,0], [0,1], [3,1], [1,2], [3,2], [0,3], [2,3]],
        // Stairs fast
        [[0,0], [1,0.5], [2,1], [3,1.5], [2,2], [1,2.5], [0,3]],
        // Hold + taps
        [[0,0,'hold',2], [2,0.5], [3,1], [2,1.5], [3,2], [1,2.5], [2,3]],
        [[3,0,'hold',2], [1,0.5], [0,1], [1,1.5], [0,2], [2,2.5], [1,3]],
        // Jumps (doubles) with singles between
        [[0,0], [3,0], [2,1], [1,2], [2,2], [0,3], [3,3]],
    ],
    hard: [
        // Dense singles
        [[0,0], [2,0.25], [1,0.5], [3,0.75], [0,1], [1,1.25], [3,1.5], [2,1.75], [0,2], [3,2.25], [1,2.5], [2,2.75], [3,3], [0,3.25], [2,3.5], [1,3.75]],
        // Jacks (same lane repeated)
        [[1,0], [1,0.5], [2,1], [2,1.5], [3,2], [3,2.5], [0,3], [0,3.5]],
        // Double stairs
        [[0,0], [1,0], [1,0.5], [2,0.5], [2,1], [3,1], [3,1.5], [2,1.5], [2,2], [1,2], [1,2.5], [0,2.5]],
        // Hold + stream
        [[0,0,'hold',3], [1,0.5], [2,1], [3,1.5], [2,2], [1,2.5], [3,3], [2,3.5]],
        [[3,0,'hold',3], [2,0.5], [1,1], [0,1.5], [1,2], [2,2.5], [0,3], [1,3.5]],
        // Trills
        [[0,0], [1,0.25], [0,0.5], [1,0.75], [2,1], [3,1.25], [2,1.5], [3,1.75], [1,2], [0,2.25], [1,2.5], [0,2.75]],
        // Chord + singles
        [[0,0], [1,0], [3,0], [2,0.5], [1,1], [0,1.5], [2,1.5], [3,2], [0,2], [1,2.5], [2,3], [3,3], [0,3]],
    ],
    insane: [
        // Very dense streams
        [[0,0], [1,0.25], [2,0.5], [3,0.75], [2,1], [1,1.25], [0,1.5], [1,1.75], [2,2], [3,2.25], [2,2.5], [1,2.75], [0,3], [2,3.25], [3,3.5], [1,3.75]],
        // Double jacks
        [[0,0], [1,0], [0,0.25], [1,0.25], [2,0.5], [3,0.5], [2,0.75], [3,0.75], [0,1], [1,1], [2,1.25], [3,1.25], [0,1.5], [3,1.5], [1,1.75], [2,1.75]],
        // Long hold + fast stream
        [[0,0,'hold',3.5], [1,0.25], [2,0.5], [3,0.75], [2,1], [1,1.25], [3,1.5], [2,1.75], [1,2], [3,2.25], [2,2.5], [1,2.75], [3,3], [2,3.25]],
        // Quad chords + singles
        [[0,0], [1,0], [2,0], [3,0], [1,0.5], [2,1], [0,1], [3,1], [1,1.5], [0,2], [1,2], [2,2], [3,2], [2,2.5], [1,3], [0,3.5]],
        // Speed trills
        [[0,0], [3,0.125], [0,0.25], [3,0.375], [0,0.5], [3,0.625], [0,0.75], [3,0.875], [1,1], [2,1.125], [1,1.25], [2,1.375], [1,1.5], [2,1.625], [1,1.75], [2,1.875]],
        // Hold brackets
        [[0,0,'hold',2], [3,0,'hold',2], [1,0.5], [2,1], [1,1.5], [2,2], [1,2.5], [0,3], [3,3], [1,3.25], [2,3.5]],
    ],
};

function getDiffKey(diff) {
    if (diff === 'Easy') return 'easy';
    if (diff === 'Normal') return 'normal';
    if (diff === 'Hard') return 'hard';
    return 'insane';
}

function generateBeatmap(song) {
    const beatMs = 60000 / song.bpm;
    const totalMs = song.duration * 1000;
    const diffKey = getDiffKey(song.diff);
    const patterns = PATTERNS[diffKey];

    const notes = []; // { x, time, type, endTime }
    let currentTime = beatMs * 2; // Start 2 beats in (intro skip)
    let patternIdx = 0;
    let lastLane = -1;

    // Song sections: intro (sparse), verse, chorus (dense), bridge, outro
    // We approximate sections as % of total duration
    function getSectionDensity(time) {
        const pct = time / totalMs;
        if (pct < 0.05) return 0.3;  // Intro — sparse
        if (pct < 0.25) return 0.7;  // Verse 1
        if (pct < 0.40) return 1.0;  // Chorus 1
        if (pct < 0.50) return 0.5;  // Bridge/break
        if (pct < 0.65) return 0.8;  // Verse 2
        if (pct < 0.85) return 1.0;  // Chorus 2 (peak)
        if (pct < 0.95) return 0.9;  // Final section
        return 0.4;                   // Outro — sparse
    }

    while (currentTime < totalMs - beatMs * 4) {
        const density = getSectionDensity(currentTime);

        // Sometimes skip patterns in less dense sections
        if (Math.random() > density) {
            currentTime += beatMs * 2;
            continue;
        }

        // Pick pattern
        const pattern = patterns[patternIdx % patterns.length];
        patternIdx++;

        // Apply pattern
        for (const note of pattern) {
            const lane = note[0];
            const beatOffset = note[1];
            const isHold = note[2] === 'hold';
            const holdBeats = note[3] || 0;

            const noteTime = Math.round(currentTime + beatOffset * beatMs);
            if (noteTime >= totalMs - beatMs * 2) break;

            const x = LANE_X[lane];
            if (isHold) {
                const endTime = Math.round(noteTime + holdBeats * beatMs);
                notes.push({ x, time: noteTime, type: 128, endTime });
            } else {
                notes.push({ x, time: noteTime, type: 1, endTime: 0 });
            }
        }

        // Advance by 4 beats (one bar)
        currentTime += beatMs * 4;
    }

    // Sort by time
    notes.sort((a, b) => a.time - b.time);

    // Build .osu file
    let osu = `osu file format v14\n\n`;
    osu += `[General]\nAudioFilename: audio.mp3\nAudioLeadIn: 0\nMode: 3\n\n`;
    osu += `[Metadata]\nTitle:${song.title}\nArtist:${song.artist}\nCreator:ZenType\nVersion:${song.diff}\n\n`;
    osu += `[Difficulty]\nHPDrainRate:${song.od}\nCircleSize:4\nOverallDifficulty:${song.od}\nApproachRate:${song.od}\nSliderMultiplier:1.4\nSliderTickRate:1\n\n`;
    osu += `[TimingPoints]\n0,${beatMs},4,1,0,70,1,0\n\n`;
    osu += `[HitObjects]\n`;

    for (const n of notes) {
        if (n.type === 128) {
            osu += `${n.x},192,${n.time},128,0,${n.endTime}:0:0:0:0:\n`;
        } else {
            osu += `${n.x},192,${n.time},1,0,0:0:0:0:\n`;
        }
    }

    return osu;
}

// Generate all beatmaps
for (const song of SONGS) {
    const osuContent = generateBeatmap(song);
    const filePath = path.join(__dirname, song.file);
    fs.writeFileSync(filePath, osuContent);
    // Count notes
    const noteCount = (osuContent.match(/\n\d/g) || []).length;
    console.log(`Generated ${song.file}: ${song.diff} | ${song.bpm} BPM | ${song.duration}s | ~${osuContent.split('\n').filter(l => l.match(/^\d+,192,/)).length} notes`);
}

console.log('\nDone! All beatmaps generated.');
