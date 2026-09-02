# My Song Writer — Build Specification

Lyric-first songwriting app. A user who arrives with lyrics, a melody, or an
accompaniment idea builds it out into a full song. Fork of the Sine Tone
Composer engine — a **separate app**, not a mode inside tone-composer.

## Constraints (non-negotiable)

- Single-file `index.html`, zero CDN dependencies, fully offline-capable.
- Deployable to GitHub Pages (own repo, e.g. `jpdold.github.io/my-song-writer/`).
- Primarily smartphone/tablet; desktop must also work well.
- Interface must be clean and *especially beautiful* — this app is judged on looks.
- No jargon in the UI. In particular: do **not** use the word "quantize";
  pick a friendly label (e.g. "Snap to beat" / "Tidy timing" — final wording
  is an open item, confirm with Joseph).

## Source files in this repo

| File | Role |
|---|---|
| `index.html` (from tone-composer) | Canonical engine to fork. Strip composer-specific UI; keep the engine as foundation. |
| `genre_chord_bank_v9.xlsx` | The project's metrics workbook (source of truth for all musical data). |
| `compile_data.py` | Compiler: workbook → `song_data.js`. Re-run whenever the workbook changes. |
| `song_data.js` | Generated data module. Embed its contents in `index.html` (single-file rule) — never hand-edit. |

Data pipeline: `python compile_data.py genre_chord_bank_v9.xlsx song_data.js`.
It validates genre/pattern/chord cross-references and prints warnings; a clean
run means the workbook is internally consistent (v9 currently compiles clean).
Note: Joseph's ear-check of the drafted pattern mappings is still pending —
the Genre_Pattern_Map defaults are drafts he will correct later, so expect
workbook re-uploads and recompiles.

## Engine reuse (from tone-composer index.html)

Reuse as much as possible. Keep: Web Audio synthesis path, staff/grid
rendering, bar model, pattern machinery, pinch-zoom, note display styles,
mobile tap handling (a tap regression was already fixed — don't regress it),
localStorage persistence approach. Strip: composer-specific menus/tools that
don't serve the song-builder flow. The engine file is ~400 KB; refactor into
clearly-sectioned code as you strip.

## Core layout

- Song title at top.
- **Section indicator** at top showing the current section (Intro, Verse 1, …).
- Bar-level **lyric fields** aligned to the music.
- Two staves per system: **top = melody**, **bottom = bass/accompaniment**.
- Lyric syllables act as **time anchors** that notes align to.
- Follow standard lyric-engraving conventions / the MusicXML syllabic model
  (begin/middle/end/single syllables, hyphens between, extender lines for
  melisma).

## Song setup

- User selects key and time signature.
- Optional genre/style selection (25 genres in the data: pop variants, rock,
  hip-hop, trap, R&B, funk, disco, EDM, country, folk, blues, jazz, latin,
  gospel, metal, classical forms, …). Choosing a genre loads its template:
  song structure (sections + bar ranges), chord progression (one chord per
  bar), default BPM/meter, and default patterns per instrument from
  `genrePatternMap`.
- Classical genres: draft upgraded progressions (inversions, cadential 6-4,
  V7) are generated **at compile time as alternates** — agreed approach.

## Voices / parts

All register placement is governed by `SONG_DATA.registerMap` (default
registers, position vs melody, voicing/collision rules, hard clamps).

1. **Melody (lead vocal)** — primary; set by the singer's entered notes.
2. **Sub vocal** — duet partner ("I sing, you sing"): call-and-response in the
   lead's rests, or unison/harmony locked to the lead's syllable chips with a
   pitch offset. Secondary to melody.
3. **Backup vocals** — chord tones only; pads/oohs, echoes, short responses;
   always quieter than lead and sub.
4. **Bass** — bass guitar (mono), patterns from `patternBanks.bass`.
5. **Accompaniment** — guitar (acoustic / 12-string / electric clean / drive)
   or piano, patterns from `patternBanks.guitar` / `.piano`.
6. **Countermelody / ensemble** — strings, horns, clarinet, trumpet, tuba;
   patterns from `patternBanks.ensemble`; answers in the melody's rests.

All vocal parts calibrate with the **reference bar** (see Register_Map).
Timbre synth hints per instrument are in `SONG_DATA.instruments`.

## Lyric entry — the make-or-break feature

Must be intuitive. Two modes that coexist:

- **Free typing**: user types lyrics naturally; the app sorts out word flow —
  syllabification and distribution across bars/beats.
- **Precise arrangement**: user can place/drag words and syllables exactly
  along the melody.
- Input methods planned: type, speak, or sing (speech/audio input can be a
  later phase; typing is MVP).

## Chords

- Display **chord names in the selected key by default** (e.g. C, G, Am, F);
  Roman numerals available as an option.
- **Chord builder** for entering/editing chords: root, 6, 6-4, diminished, 7,
  etc. Vocabulary and tiers come from `SONG_DATA.chordVocabulary` —
  **Simple** tier (triads, inversions, V7, sus, power chords…) shown first;
  **Advanced** tier (aug, dim7, half-dim, figured-bass inversions, add9,
  secondary dominants) behind a toggle.

## Custom entry (accompaniment/bass)

- Simple by default: user enters just chord progression / notes / rhythm
  (tap or pick note lengths). Envelope auto-fills from the default rule on the
  Reference sheet.
- Optional **advanced tier** exposes the technical settings (per-slot ratio /
  sustain / mute) — mirrors the "Custom (user-defined)" rows in each bank.

## Timing model

- All pattern slot durations in the data are **ms at the 60 BPM reference**
  (quarter = 1000 ms, 4/4 bar = 4000 ms). Scale by `60 / BPM` at runtime.
- Patterns carry per-slot ratio / sustain / mute values for the envelope.
- BPM ranges per pattern indicate where each pattern sounds right.

## Section operations

With minimal navigation: add custom section, omit, delete, edit, copy/paste.
Section indicator at top always shows where you are.

## Progression indicator

One small **rounded vertical light per bar** across the top:

- **Green**: every voice in that bar is 100% filled (notes or rests cover
  every beat).
- **White**: all voices are at 0% for that bar.
- **Yellow**: anything in between.
- The rule checks **all voices** per bar.

## Full-screen accompaniment entry

Toggle that expands the accompaniment entry area to full screen, with a close
control that restores the original size and position.

## Export & Share (expanded step)

Song sharing and collaboration:

- **Part extraction**: each musician gets their assigned part, maximized for a
  tablet on a music stand.
- **QR / URL share** of a song or a part.
- **Performance mode**: karaoke-machine upload; groups of friends singing
  from phones.

## Suggested build order

1. Fork + strip: engine foundation, embed `song_data.js`, app shell/branding.
2. Song setup (key, time signature, genre template load) + section model.
3. Melody stave + lyric entry (typing mode, syllable anchors).
4. Chords: display, chord builder (Simple tier), progression from template.
5. Bass + accompaniment staves, pattern playback, custom simple entry.
6. Progression lights, section ops, full-screen toggle, register-map voicing.
7. Sub vocal + backup vocals, ensemble/countermelody.
8. Advanced tiers (chord vocab, envelope settings), Roman-numeral option.
9. Export & Share (part extraction, QR/URL, performance mode).
10. Speak/sing input.

## Open items (do not resolve unilaterally — ask Joseph)

- Friendly replacement label for "quantize".
- Ear-check of Genre_Pattern_Map defaults (Joseph will correct; recompile after).
- Which copy of tone-composer `index.html` is canonical is whichever Joseph
  provides in this repo — treat the repo as the single source of truth from
  now on (commits, no parallel forks).
