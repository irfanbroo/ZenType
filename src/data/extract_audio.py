#!/usr/bin/env python3
"""
ZenType .osz Audio Extractor
=============================
Extracts the audio file from an osu! .osz beatmap.

Usage:
    python extract_audio.py <path_to_file.osz>

Example:
    python extract_audio.py "C:/Users/irfan/Downloads/381334.osz"

Output:
    Saves the audio file next to the .osz with the song title as the name.
"""

import sys
import os
import zipfile

def extract_audio(osz_path):
    if not os.path.exists(osz_path):
        print(f'File not found: {osz_path}')
        sys.exit(1)

    out_dir = os.path.dirname(os.path.abspath(osz_path))
    song_title = 'Unknown'

    with zipfile.ZipFile(osz_path, 'r') as z:
        names = z.namelist()

        # Find the .osu file to get AudioFilename and title
        osu_file = next((n for n in names if n.endswith('.osu')), None)
        audio_filename = None

        if osu_file:
            with z.open(osu_file) as f:
                for line in f.read().decode('utf-8', errors='replace').splitlines():
                    if line.startswith('AudioFilename:'):
                        audio_filename = line.split(':', 1)[1].strip()
                    if line.startswith('Title:'):
                        song_title = line.split(':', 1)[1].strip()
                    if audio_filename and song_title != 'Unknown':
                        break

        # Find audio file in zip
        if not audio_filename:
            # fallback: find any mp3/ogg/wav
            audio_filename = next(
                (n for n in names if n.lower().endswith(('.mp3', '.ogg', '.wav', '.m4a'))),
                None
            )

        if not audio_filename:
            print('No audio file found in .osz!')
            sys.exit(1)

        # Find matching file in zip (case-insensitive)
        match = next(
            (n for n in names if n.lower() == audio_filename.lower()),
            audio_filename
        )

        ext = os.path.splitext(match)[1]
        # Clean title for filename
        safe_title = ''.join(c for c in song_title if c.isalnum() or c in ' -_()[]').strip()
        out_name = f'{safe_title or "audio"}{ext}'
        out_path = os.path.join(out_dir, out_name)

        print(f'Extracting: {match}')
        print(f'Song: {song_title}')
        with z.open(match) as src, open(out_path, 'wb') as dst:
            dst.write(src.read())

    print(f'\nDone! Audio saved to:')
    print(f'  {out_path}')
    print(f'\nNext steps:')
    print(f'  1. Upload this file to your YouTube channel')
    print(f'  2. Copy the YouTube video ID')
    print(f'  3. Add it to FEATURED_MAPS in starroad.js')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    extract_audio(sys.argv[1])
