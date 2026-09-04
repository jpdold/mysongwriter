# My Song Writer

Lyric-first songwriting app. Start with words, a tune, or an accompaniment idea and build it out into a full song with melody, chords, bass, accompaniment, backing vocals and ensemble parts.

Single-file, zero dependencies, works offline: open `index.html` in any modern browser, or serve the folder for GitHub Pages.

## Using it

The screen is one bar at a time, laid out like the design mock: title, ☰ menu / ▶ ⏸ / ⚙ settings, the bar bracket with ◀ ▶ and a dot per bar, the beat row (tap a beat for its chord), the **Melody** window, the **Rhythm** strip, the **Lyrics** strip, the note palette, then the **Accompaniment** and **Bass** windows and the Chords… / Save… bar. ▶ at the top plays from the current bar (hold for the whole song); the small ▶ beside each window plays that part alone.

1. **☰ → New song…** — opens Setup for name, genre, key, time signature and tempo (a genre loads structure, chords and band patterns); ☰ → Song setup changes them later. Setup also adds a **pickup** (a ½-, 1- or 2-beat bar before beat 1).
2. **Rhythm & notes** — one beat is active at a time. Tap a beat on any stave to activate it (tinted across all three); everything else is locked and a tap there just moves the active beat. Inside the active beat: pick a length, tap once to show the orange box at the next free spot, tap a pitch to enter the note; tap a note or rest to select it for the palette tools. Ties and slurs may still reach into locked beats. The Rhythm strip adds boxes without a pitch (＋ adds one at the end); 𝄽 arms a rest for the next box. ⌒ ties a note to the next (or into the next bar). Tap a box or the Rhythm strip to select a note and change its length, dot it, move or delete it.
3. **Melody** — tap a pitch inside a box to give that note its pitch, or tap an empty spot to add a note at the palette length. Notes align with the rhythm on their left edge. ▲▼ beside a window move its register (hold for an octave); ⚙ sets instrument, sound and extra voices.
4. **Words** — tap the Lyrics strip at a beat and type straight into the strip (↵ moves to the next note; tapping elsewhere keeps what you typed), or tap the Lyrics tag to paste a whole section. The editor has its own QWERTY keyboard with a symbols page (’ — … ‿ _ 𝄽) and an accents page; ⌨ switches to the phone's keyboard. Words sit on the rhythm's notes; drag one to line it up. Tap a word to select it: nudge it, split it into letters you can drag one by one, edit or delete it (the rest stays put). `_` is a rest.
5. **Chords** — tap a beat in the beat row or use Chords… for a per-beat grid. A chord holds until the next change.
6. **Band** — Accompaniment and Bass follow genre patterns; ⚙ on each window sets instrument, sound, pattern, volume, or Custom to place notes yourself.
Articulation: • staccato, ‒ tenuto and ◠ slur sit in the palette. With a note selected, a tap applies the mark; otherwise a tap arms it so entered notes carry it and tapping existing notes marks them, and a second tap returns to note entry. Slurs: tap the first note, then the last. Playback shortens staccato, holds tenuto and plays slurred notes legato.

Notes follow standard engraving: eighths and shorter are beamed per beat (per dotted quarter in 6/8), sixteenths get a second beam, and stems point down above the middle of the window.

Windows share the screen: the melody gets the most room and Accompaniment and Bass split the rest. The small button under each window's ⚙ cycles it open → half → closed (one window always stays open) and the others take up the space. Pinch a window with two fingers to zoom its rows (sideways pinch changes how many bars show). On a wide screen the ⛶ button under a window's controls gives that window the whole screen; tap it again to go back.

7. **⚙ Settings** — theme (default, dark, custom colours), window shows 1, 2, 3 or 4 bars (more bars widen the staves; everything scrolls together), window sizing, chords displayed (names / Roman / hidden), note appearance (traditional / pills / circles), half steps on lines, lyrics font, metronome and count-in.
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
