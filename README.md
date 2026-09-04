# My Song Writer

Lyric-first songwriting app. Start with words, a tune, or an accompaniment idea and build it out into a full song with melody, chords, bass, accompaniment, backing vocals and ensemble parts.

Single-file, zero dependencies, works offline: open `index.html` in any modern browser, or serve the folder for GitHub Pages.

## Using it

The screen is one bar at a time, laid out like the design mock: title, ☰ menu / **Setup…** / ⚙ settings, the bar bracket with ◀ ▶ and a dot per bar, the beat row (tap a beat for its chord), the **Melody** window, the **Rhythm** strip, the **Lyrics** strip, the note palette, then the **Accompaniment** and **Bass** windows and the Chords… / ▶ ⏸ ■ / Save… bar.

1. **Title and Setup…** — name the song, then Setup… for genre, key, time signature and tempo (a genre loads structure, chords and band patterns).
2. **Rhythm** — tap a length in the palette to add a note to the rhythm; each one becomes an orange box in the melody window. ⌒ ties a note to the next (or into the next bar). Tap a box or the Rhythm strip to select a note and change its length, dot it, move or delete it.
3. **Melody** — tap a pitch inside a box to give that note its pitch, or tap an empty spot to add a note at the palette length. Notes align with the rhythm on their left edge. ▲▼ beside a window move its register (hold for an octave); ⚙ sets instrument, sound and extra voices.
4. **Words** — tap the Lyrics strip at a beat to type a word there (Enter moves to the next note), or tap the Lyrics tag to paste a whole section. Words sit on the rhythm's notes; drag one to line it up. `_` is a rest.
5. **Chords** — tap a beat in the beat row or use Chords… for a per-beat grid. A chord holds until the next change.
6. **Band** — Accompaniment and Bass follow genre patterns; ⚙ on each window sets instrument, sound, pattern, volume, or Custom to place notes yourself.
7. **⚙ Settings** — theme (default, dark, custom colours), window sizing, chords displayed (names / Roman / hidden), note appearance (traditional / pills / circles), half steps on lines, metronome and count-in.
8. **☰ Menu / Save…** — share a link, per-musician parts and performance mode; export/import files; save, open, copy and start songs.

The dots under the bar bracket show each bar of the section: green when every voice is full, white when empty, yellow in between.

## Real instrument sounds

Menu → *Sounds & samples* imports instrument recordings from your device into the browser's IndexedDB; nothing is downloaded by the app. Each part then picks its sound in Band (built-in synth or a sample bank).

- **tonejs-instruments** — the `samples` folder from <https://github.com/nbrosowsky/tonejs-instruments> (guitar-acoustic, guitar-electric, bass-electric, piano, trumpet, clarinet, tuba, violin, cello, french-horn …). Pick the whole folder and every instrument becomes a bank; matching parts are assigned automatically.
- **Salamander Grand Piano** (CC BY 3.0, Alexander Holm) — the full multi-layer set or the trimmed one at <https://tonejs.github.io/audio/salamander/>. One velocity layer per note is kept (nearest v8).

File names must carry the pitch: `C4.mp3`, `Cs4.mp3`, `F#3.wav`, `A0v8.mp3`. Prefer mp3; iPhones don't decode ogg.

## Files

| File | Role |
|---|---|
| `index.html` | The app. Single file; the musical data is embedded between the `SONG_DATA_BEGIN` / `SONG_DATA_END` markers. |
| `genre_chord_bank_v9.xlsx` | Metrics workbook — the source of truth for genres, chord vocabulary, pattern banks, register map and instruments. |
| `compile_data.py` | Compiles the workbook to `song_data.js` and (with `--embed`) splices it into `index.html`. |
| `song_data.js` | Generated data module. Never hand-edit. |
| `tone-composer.html` | The Sine Tone Composer engine the app was forked from, kept for reference (MIDI and audio input live here for a later phase). |
| `BUILD_SPEC.md` | Build specification. |

## Data pipeline

After editing the workbook:

```bash
python compile_data.py genre_chord_bank_v9.xlsx song_data.js --embed index.html
```

Requires `openpyxl`. The compiler validates genre / pattern / chord cross-references and prints warnings; a clean run means the workbook is internally consistent.

## Local preview

```bash
python -m http.server 8731
```

Then open <http://127.0.0.1:8731/>.
