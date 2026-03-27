#!/usr/bin/env python3
"""
ZenType Auto-Charter
====================
Analyzes a YouTube video and generates a synced osu!mania 4K beatmap.

Usage:
    python chart.py <youtube_url> [title] [artist] [difficulty: easy/normal/hard]

Examples:
    python chart.py https://youtu.be/xxxx
    python chart.py https://youtu.be/xxxx "Bad Apple" "Alstroemeria Records" normal

Requirements:
    pip install librosa yt-dlp numpy scipy
"""

import sys
import os
import struct
import zlib
import numpy as np
import tempfile
import subprocess
import re

# Fix Windows console Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Helpers ─────────────────────────────────────────────────────────────────

def sanitize(name):
    return re.sub(r'[^\w\s\-\.]', '', name).strip()

def download_audio(url, out_dir):
    import yt_dlp
    import imageio_ffmpeg

    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(out_dir, 'audio.%(ext)s'),
        'noplaylist': True,
        'quiet': False,
        'no_warnings': True,
        'ffmpeg_location': ffmpeg_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    print('  Downloading audio...')
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        video_title = info.get('title', 'Unknown')

    audio_file = os.path.join(out_dir, 'audio.mp3')
    if not os.path.exists(audio_file):
        for f in os.listdir(out_dir):
            if f.startswith('audio.'):
                audio_file = os.path.join(out_dir, f)
                break

    return audio_file, video_title

# ── Audio Analysis ──────────────────────────────────────────────────────────

def analyze(audio_path, difficulty='normal'):
    import librosa

    DIFF_SETTINGS = {
        'easy':   dict(min_gap=0.25, density=0.85, delta=0.03, wait=4, beat_div=2),
        'normal': dict(min_gap=0.15, density=0.90, delta=0.02, wait=3, beat_div=1),
        'hard':   dict(min_gap=0.08, density=1.00, delta=0.01, wait=2, beat_div=1),
    }
    cfg = DIFF_SETTINGS.get(difficulty, DIFF_SETTINGS['normal'])

    print('  Loading audio...')
    y, sr = librosa.load(audio_path, sr=22050, mono=True)
    duration = librosa.get_duration(y=y, sr=sr)

    print('  Detecting tempo and beats...')
    tempo_arr, beat_frames = librosa.beat.beat_track(y=y, sr=sr, units='frames', tightness=100)
    tempo = float(np.mean(tempo_arr)) if hasattr(tempo_arr, '__len__') else float(tempo_arr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    # Separate harmonic (piano/melody) from percussive (drums)
    print('  Separating harmonic content (piano/melody)...')
    y_harm, y_perc = librosa.effects.hpss(y, margin=3.0)

    # Detect onsets on the HARMONIC component only — matches piano notes
    print('  Detecting piano onsets...')
    onset_env = librosa.onset.onset_strength(y=y_harm, sr=sr, hop_length=512,
                                              aggregate=np.median)
    onset_frames = librosa.onset.onset_detect(
        onset_envelope=onset_env,
        sr=sr, units='frames',
        hop_length=512,
        delta=cfg['delta'],
        wait=cfg['wait'],
        backtrack=True,
    )
    onset_times_raw = librosa.frames_to_time(onset_frames, sr=sr, hop_length=512)

    # Snap each onset to nearest beat subdivision (1/2 or 1/4 beat)
    # This aligns notes to the musical grid so they feel rhythmically correct
    beat_ms = 60000.0 / tempo
    subdivisions = []
    for bt in beat_times:
        subdivisions.append(bt)
        subdivisions.append(bt + (beat_ms / 1000) * 0.5)   # half-beat
    subdivisions = sorted(subdivisions)

    def snap_to_grid(t):
        if not subdivisions:
            return t
        idx = np.argmin(np.abs(np.array(subdivisions) - t))
        return subdivisions[idx]

    onset_times_snapped = np.array([snap_to_grid(t) for t in onset_times_raw])

    # Also add beat-grid notes so sparse songs stay playable
    # beat_div=2 means every other beat, beat_div=1 means every beat
    beat_div = cfg['beat_div']
    grid_times = []
    for i, bt in enumerate(beat_times):
        if i % beat_div == 0:
            grid_times.append(bt)
            # also add half-beat subdivision
            if beat_div == 1 and i + 1 < len(beat_times):
                grid_times.append(bt + (beat_ms / 1000) * 0.5)

    # Merge onset detections + beat grid, remove duplicates
    all_times = np.concatenate([onset_times_snapped, np.array(grid_times)])
    onset_times = np.unique(np.round(all_times, 3))

    # Compute spectral data for lane assignment
    print('  Analyzing spectrum...')
    stft = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)

    # 4 frequency bands → 4 lanes
    # Lane 0 = Bass (A), 1 = Low-mid (S), 2 = High-mid (D), 3 = Treble (F)
    bands = [(0, 200), (200, 800), (800, 3000), (3000, sr // 2)]

    notes = []
    last_lane_t = [-999.0] * 4
    lane_counts = [0, 0, 0, 0]
    min_gap = cfg['min_gap']

    for t in onset_times:
        if t < 0.2:
            continue
        if t > duration - 0.5:
            break

        # Density filter
        if np.random.random() > cfg['density']:
            continue

        frame = min(librosa.time_to_frames(t, sr=sr, hop_length=512), stft.shape[1] - 1)

        # Use spectral centroid at this frame to pick lane
        # Centroid = weighted average frequency → maps naturally to a lane
        frame_spectrum = stft[:, frame]
        total_energy = np.sum(frame_spectrum) + 1e-10
        centroid = float(np.sum(freqs * frame_spectrum) / total_energy)

        # Normalize centroid to 0-1 range (most music lives between 0-4000 Hz)
        centroid_norm = min(centroid / 4000.0, 1.0)

        # Map centroid to preferred lane (with some randomness)
        preferred_lane = int(centroid_norm * 3.99)
        preferred_lane = max(0, min(3, preferred_lane))

        # Add slight random offset to avoid clustering
        jitter = np.random.randint(-1, 2)
        preferred_lane = max(0, min(3, preferred_lane + jitter))

        # Balance: if one lane has way more notes, nudge away from it
        max_count = max(lane_counts) + 1
        balance_weights = [(max_count - lane_counts[i]) / max_count for i in range(4)]

        # Try preferred lane first, then pick by balance
        candidates = [preferred_lane] + sorted(
            [i for i in range(4) if i != preferred_lane],
            key=lambda i: -balance_weights[i]
        )

        lane = None
        for candidate in candidates:
            if t - last_lane_t[candidate] >= min_gap:
                lane = candidate
                break
        if lane is None:
            lane = int(np.argmin(last_lane_t))

        last_lane_t[lane] = t
        lane_counts[lane] += 1
        notes.append({'lane': lane, 'time_ms': int(t * 1000)})

    print(f'  -> {tempo:.1f} BPM | {duration:.1f}s | {len(notes)} notes')
    return notes, tempo, duration

# ── .osu Generator ──────────────────────────────────────────────────────────

LANE_X = [64, 192, 320, 448]

def build_osu(notes, tempo, title, artist, difficulty, youtube_url):
    beat_ms = 60000.0 / tempo
    lines = [
        'osu file format v14', '',
        '[General]',
        'AudioFilename: audio.mp3',
        'AudioLeadIn: 0',
        'Mode: 3', '',
        '[Metadata]',
        f'Title:{title}',
        f'Artist:{artist}',
        'Creator:ZenType Auto-Charter',
        f'Version:{difficulty.capitalize()} (auto)',
        f'Tags:zentype auto-chart', '',
        '[Difficulty]',
        'HPDrainRate:5',
        'CircleSize:4',
        'OverallDifficulty:5',
        'ApproachRate:5',
        'SliderMultiplier:1.4',
        'SliderTickRate:1', '',
        '[TimingPoints]',
        f'0,{beat_ms:.6f},4,1,0,70,1,0', '',
        '[HitObjects]',
    ]
    for n in sorted(notes, key=lambda x: x['time_ms']):
        x = LANE_X[n['lane']]
        t = n['time_ms']
        lines.append(f'{x},192,{t},1,0,0:0:0:0:')
    return '\n'.join(lines)

# ── .osz Packager (zip) ─────────────────────────────────────────────────────

def write_osz(osu_text, audio_path, out_path):
    """Pack the .osu and audio.mp3 into a .osz (zip) file."""
    osu_bytes = osu_text.encode('utf-8')
    with open(audio_path, 'rb') as f:
        mp3_bytes = f.read()
    audio_name = 'audio.' + audio_path.rsplit('.', 1)[-1]

    def zip_entry(name, data, offset):
        name_bytes = name.encode('utf-8')
        crc = zlib.crc32(data) & 0xFFFFFFFF
        compressed = zlib.compress(data, 6)[2:-4]  # strip zlib header/trailer → raw deflate
        # Local file header
        lf = struct.pack('<4sHHHHHIIIHH',
            b'PK\x03\x04', 20, 0, 8, 0, 0,
            crc, len(compressed), len(data), len(name_bytes), 0)
        entry_bytes = lf + name_bytes + compressed
        # Central dir entry
        cd = struct.pack('<4sHHHHHHIIIHHHHHII',
            b'PK\x01\x02', 20, 20, 0, 8, 0, 0,
            crc, len(compressed), len(data),
            len(name_bytes), 0, 0, 0, 0, 0, offset)
        cd += name_bytes
        return entry_bytes, cd, offset + len(entry_bytes)

    entries = []
    cds = []
    pos = 0

    for name, data in [('chart.osu', osu_bytes), (audio_name, mp3_bytes)]:
        entry, cd, pos = zip_entry(name, data, pos)
        entries.append(entry)
        cds.append(cd)

    cd_offset = pos
    cd_data = b''.join(cds)
    eocd = struct.pack('<4sHHHHIIH',
        b'PK\x05\x06', 0, 0, len(cds), len(cds),
        len(cd_data), cd_offset, 0)

    with open(out_path, 'wb') as f:
        for e in entries:
            f.write(e)
        f.write(cd_data)
        f.write(eocd)

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    url        = sys.argv[1]
    title      = sys.argv[2] if len(sys.argv) > 2 else None
    artist     = sys.argv[3] if len(sys.argv) > 3 else 'Unknown Artist'
    difficulty = (sys.argv[4] if len(sys.argv) > 4 else 'normal').lower()

    if difficulty not in ('easy', 'normal', 'hard'):
        print(f'Unknown difficulty "{difficulty}", using normal')
        difficulty = 'normal'

    with tempfile.TemporaryDirectory() as tmp:
        print(f'\n[1/4] Downloading from YouTube...')
        audio_file, yt_title = download_audio(url, tmp)
        if not title:
            title = yt_title or 'Unknown Title'
        print(f'      Title: {title}')

        print(f'\n[2/4] Analyzing audio ({difficulty})...')
        notes, tempo, duration = analyze(audio_file, difficulty)

        print(f'\n[3/4] Building beatmap...')
        osu_text = build_osu(notes, tempo, title, artist, difficulty, url)

        print(f'\n[4/4] Saving .osz...')
        safe = sanitize(title)[:40] or 'chart'
        out_name = f'{safe} [{difficulty}].osz'
        out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', out_name)
        out_path = os.path.normpath(out_path)
        write_osz(osu_text, audio_file, out_path)


    print(f'\nDone! Saved to: {out_path}')
    print(f'\nHow to use in ZenType:')
    print(f'  1. Open Star Road')
    print(f'  2. Click "Import .osz / .osu"')
    print(f'  3. Drag in the file: {out_name}')
    print(f'  4. Paste YouTube URL: {url}')
    print(f'  5. Hit Play!')

if __name__ == '__main__':
    main()
