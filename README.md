# My Song Writer

Lyric-first songwriting app. Start with words, a tune, or an accompaniment idea and build it out into a full song with melody, chords, bass, accompaniment, backing vocals and ensemble parts.

Single-file, zero dependencies, works offline: open `index.html` in any modern browser, or serve the folder for GitHub Pages.

## Using it

1. **Words** — type or paste a section's lyrics and press *Place words*. They are split into syllables and spread across the bars. Drag any syllable on the stave to place it exactly.
2. **Melody** — tap a pitch on the top stave; the highlighted word takes that note and the next word lights up. Tap a note to nudge, stretch or delete it.
3. **Chords** — tap a chord name above a bar to open the chord builder. Chord names follow the key; Roman numerals are a toggle away.
4. **Band** — bass, accompaniment and ensemble play genre patterns automatically. Switch a part to *Custom* to write its notes by hand (⛶ gives a full-screen stave).
5. **Sections** — tap the current section's name for rename, length, omit, duplicate, copy/paste, reorder, delete. `+` adds a section.
6. **Share** — Menu → *Share & export*: a link that carries the whole song, JSON backup, per-musician parts for a tablet on a music stand, and a karaoke-style performance mode.

The row of lights under the title shows every bar: green when every voice is full, white when empty, yellow in between.

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
