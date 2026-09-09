# My Song Writer

Lyric-first songwriting app. Start with words, a tune, or an accompaniment idea and build it out into a full song with melody, chords, bass, accompaniment, backing vocals and ensemble parts.

Single-file, zero dependencies, works offline: open `index.html` in any modern browser, or serve the folder for GitHub Pages.

## Using it

The screen is one bar at a time, laid out like the design mock: title, ☰ menu / ▶ ⏸ / ⚙ settings, the bar bracket with ◀ ▶ and a dot per bar, the beat row (tap a beat for its chord), the **Melody** window, the **Rhythm** strip, the **Lyrics** strip, a block of ↑ ↓ ← → arrows with UNDO / REDO and MOVE / DELETE beneath, the note palette, then the **Accompaniment** and **Bass** windows. Beside the arrows, in the left half, sits a small **quick palette**: the 32nd, sixteenth and eighth notes beside the quarter along the top (the quarter at the top right), beneath them a quarter rest and the double whole, whole and half notes, and a third row with SLUR, TIE, the ghost note and the dot. A tap picks that length just as in the tools. Its 🔒 unlocks it: then hold a button and drop it on another and the two trade places (or the displaced one takes the nearest empty cell). ⧉ floats it so you can drag it by its grip anywhere on the screen; ⤶ puts it back. The 💾 beside the tempo opens the song library to save. Chords… lives in ☰ → Song setup. Each stave has a 🗑 at the bottom of its button column: it deletes the selected note (or word, on the melody) or clears the active beat. The arrows move the selected note (pitch up and down, earlier and later), nudge a selected word, shift a picked run, or step the active beat across bars; with nothing selected ↑ ↓ move the stave's register.

1. **☰ → New song…** — opens Setup for name, genre, key, time signature and tempo (a genre loads structure, chords and band patterns); ☰ → Song setup changes them later. Setup also adds a **pickup** (a ½-, 1- or 2-beat bar before beat 1).
2. **Rhythm & notes** — one beat is active at a time. Tap a beat on any stave to activate it (tinted across all three); everything else is locked and a tap there just moves the active beat. Inside the active beat: pick a length, tap once to show the orange box at the next free spot, tap a pitch to enter the note; tap a note or rest to select it for the palette tools. Note lengths, the slur, the tie, the dot and the ghost note (an X head: it goes in softly, barely heard — tap it to arm the next note, or to toggle a selected note) are all on the quick palette beside the arrows. The top row's left corner holds the whole, half, eighth, 16th and 32nd rests (the quarter rest is on the quick palette): with a beat active a tap puts that rest at the next free spot (a whole rest is the bar; longer rests run on into the following bars as far as they are clear), on a note or rest you tapped yourself it becomes a rest of that length, and otherwise it arms that rest for your next tap on a stave or the Rhythm strip. Staccato and tenuto sit at the top right of the tools and the editing tools on the row below; MOVE and DELETE sit under UNDO and REDO beside the quick palette. A double whole spans two bars in 4/4, tied. Ties and slurs may still reach into locked beats. The Rhythm strip adds boxes without a pitch; a rest button arms a rest for the next box. ⌒ ties a note to the next (or into the next bar). Tap a box or the Rhythm strip to select a note and change its length, dot it, move or delete it.
3. **Melody** — tap a pitch inside a box to give that note its pitch, or tap an empty spot to add a note at the palette length. Notes align with the rhythm on their left edge. ▲▼ beside a window move its register (hold for an octave); ⚙ sets instrument, sound and extra voices, and the stave's paper shade: default, aged (tanned like old paper), light eggshell, or plain white.
4. **Words** — tap the Lyrics tag (or the strip): the keyboard opens with the entry box at the left edge of the strip. Type and press **NEW CHIP SAME BEAT**: what you typed becomes a chip exactly as wide as the word, flush against the chip before it (edge to edge, running across beat lines if the word is long), and the box waits just after it — a new chip never goes in before the right edge of the right-most chip, and if the beat there has no room left for even a letter, a notice asks for **NEW CHIP NEXT BEAT** instead; **NEW CHIP NEXT BEAT** makes the chip (in the next beat when this one is full) and moves the box to the next free beat. UNDO and REDO sit on the keyboard just above NEW CHIP NEXT BEAT. Deleting a chip selects its neighbour on the left (or the right, if none). **NEW CHIP ↔** on the keyboard makes a blank spacer chip, white with a dashed edge: drag it along the strip and it clicks onto the edges of other chips and onto beat lines, or sits in free space; let go and it fills the room up to the next beat line or chip, and is an ordinary chip from then on (type into it with Edit and it becomes a word chip of that width). While the keyboard is open, taps on the Lyrics strip work as usual, but a tap anywhere else is held off: the keyboard blinks twice around its edge and its small ✕ flashes — that ✕ is what closes it. NEW CHIP ↔ sits at the foot of the right-hand stack, solid white. **SET**, styled like a chip on the strip, sets whatever is in hand as it is — a spacer still being placed, or the words in the box — and a tap off the keyboard does the same. The two buttons beside ⌨ in the keyboard's header choose what the text becomes — **Multi-chip** (one chip per word, side by side; the selection each time the keyboard opens) or **Single chip** (the entry box itself stretches across the bar, and everything typed becomes one chip that fills it, the box moving on to the next bar). Words have no bearing on the notes; drag a chip anywhere along the strip (it clicks onto beat lines when close; chips never overlap — pressed together they squeeze to about three quarters of their width and stay readable, and a bar too full for even that shrinks them all alike, side by side), put spaces inside a word to spread its syllables under their notes, and press the gold 🔒 beside the strip to lock a chip in place (select it and press 🔒 again to unlock). With the entry box empty, ⌫ backs over what is behind it: an unlocked chip is removed, a locked chip is passed through and kept (the box lands just before it, so the unlocked chips behind it can go too); free space steps back a quarter beat, and the start of the bar steps to the bar before. Space with the box empty goes the other way: over the chip ahead, locked or not, to land just after it, else a quarter beat on, and the end of the bar steps to the next. Close the keyboard and the first word you typed is already selected. Tap a chip and the palette shows its tools: Edit, 🔒, and **Narrow** / **Widen**, which shrink or grow that chip a tenth at a time wherever it sits — narrowed text condenses, widened text spreads its letters, and neighbours make way when a chip grows.
5. **Chords** — tap a beat in the beat row or use Chords… for a per-beat grid. A chord holds until the next change.
6. **Band** — Accompaniment and Bass follow genre patterns; ⚙ on each window sets instrument, sound, pattern, volume, or Custom to place notes yourself. Hand-placed notes tie within a bar and across the bar line like the melody's.
Articulation: • staccato and ‒ tenuto sit in the tools palette, ◠ slur on the quick palette. With a note selected, a tap applies the mark; otherwise a tap arms it so entered notes carry it and tapping existing notes marks them, and a second tap returns to note entry. Slurs: tap the first note, then the last. Playback shortens staccato, holds tenuto and plays slurred notes legato.

Notes follow standard engraving: eighths and shorter are beamed per beat (per dotted quarter in 6/8), sixteenths get a second beam and each halving after that one more, stems lengthen to carry extra flags or beams, a double whole has its two bars, and stems point down above the middle of the window.

Windows share the screen: the melody gets the most room and Accompaniment and Bass split the rest. The small button under each window's ⚙ cycles it open → half → closed (one window always stays open) and the others take up the space. Pinch a window with two fingers to zoom its rows (sideways pinch changes how many bars show). On a wide screen the ⛶ button under a window's controls gives that window the whole screen; tap it again to go back.

7. **⚙ Settings** — view: **rolled up** (the default — Melody, Accompaniment and Bass as three labelled bars across the top with + / − to open and close each stave; the melody starts open) or stacked staves; theme (default, dark, custom colours), window shows 1, 2, 3 or 4 bars (more bars widen the staves; everything scrolls together), window sizing (small, medium, large: the row height and how much of the screen the staves may take), chords displayed (names / Roman / hidden), note appearance (traditional / pills / circles), note size (small, medium, large: heads, stems and flags scale together and never outgrow the space they sit in), half steps on lines, keep the screen awake while the app is open (on by default; the phone stops dimming and sleeping once you have touched the app, where the browser allows it), lyrics font, metronome and count-in.
8. **☰ Menu / Save…** — share a link, per-musician parts and performance mode; export/import files; save, open, copy and start songs.

The dots under the bar bracket show each bar of the section: green when every voice is full, white when empty, yellow in between.

## Chord mode

The two-row button beside each stave turns chord mode on for that stave: every tap at a note's time stacks another note on it, the same pitch again gives a unison (marked with a red edge), and a tap on empty space starts the next chord. Chord-mode notes are drawn in the chord colour (white by default, changeable in Settings) with a thin black edge on head and stem. Rests enter as usual. Tap the button again for single notes.

## Playing

Top row: **|▶ Play All** plays the whole song from the start, **▶… Play Range** asks for a start and end bar and beat and plays that stretch in every part, **■** stops. Beside each stave, **▶** plays that part alone for the current bar, and the **▶ in the blue box** is Play Select: tap it, tap the note heads you want to hear, tap it again — only the chosen notes sound, the rest are greyed, and it stops when they are done or when you press it or ■ again.

## Time signature calculator

☰ → Time signature calculator. Tap note and rest values (whole down to 128th, with dots, double dots and ties) onto a free strip one at a time, hear it tapped out at the song's tempo, then press Calculate: every plausible signature is scored on how the rhythm falls into bars — bar lines landing between entries on struck notes, complete last bars, onsets on the beat, and a preference for regular metres — and the best fits are listed with the rhythm sectioned bar by bar for each.

## Floating tool palette

⧉ at the end of the tools pops them out into a small draggable palette. The stave keeps its size and stops taking taps; you step through beats (or bars) with ◀ ▶, set the pitch with ▲ ▼, and tap a note length to enter the note at the dashed box, or to change a selected note's length. M / A / B pick the window, ⚙ sets the palette's size and which side the pitch arrows sit, ⤶ pops it back in.

## Running without the browser bars

- **Android / desktop:** ☰ → *Full screen* hides the address bar (tap again, or press Esc, to leave).
- **Any phone, best option:** add the page to your Home Screen (Chrome: ⋮ → *Add to Home screen*; iPhone Safari: Share → *Add to Home Screen*). The icon then opens the app on its own, with no address bar in either orientation. `manifest.webmanifest` and `icons/` provide the name and icon for that.

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
