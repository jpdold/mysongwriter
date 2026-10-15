# Sheet music import (experimental)

Takes a photo or scan of sheet music (printed or hand-written), works out what
is on the page, and turns it into a My Song Writer song.

Nothing here is wired into the app yet. The page at `sheet-import/index.html`
runs the whole pipeline on its own and hands back a backup file that the app's
existing **Find saved songs → Bring songs in from a backup file…** flow accepts,
so the feature can be tried end to end before it is given a place in the app.

## Pipeline

```
upload ─▶ prepare ─▶ analyze ─▶ review ─▶ convert ─▶ bring in
images     resize,    vision     user      Score     backup file
(1+ pages) order      model      edits     → song    for the app
```

| Stage   | File                | What it does                                                                                  |
| ------- | ------------------- | --------------------------------------------------------------------------------------------- |
| prepare | `index.html`        | Accepts one or more images, keeps page order, shrinks each to ≤ 2000 px and re-encodes as JPEG. |
| analyze | `analyze-claude.js` | Sends the pages to Claude with a structured-output schema and gets back a **Score** (below).   |
| review  | `index.html`        | Shows the Score as editable JSON plus the model's list of doubtful spots, so a person can fix them before conversion. |
| convert | `to-msw.js`         | Turns a Score into a My Song Writer song object and wraps it in the app's backup format.       |

The analyzer is the only stage that depends on a provider. It sits behind a
one-function interface, `analyzeScore(pages, options) → Score`, so a different
recogniser (a server-side OMR engine, a second model for a vote, a hand-typed
Score) can be dropped in without touching the rest.

## The Score: what the analyzer has to produce

`score-schema.js` is the single source of truth. In short:

- **Header**: title, composer, key (tonic + mode), time signature, tempo, pickup length.
- **Parts**: one per staff or voice, each with a clef and an instrument guess.
- **Sections**: named spans of measures (intro, verse, chorus…) with repeat marks.
- **Measures**: for each part, a list of events. Each event is a note (MIDI number),
  a chord (several MIDI numbers) or a rest, with a duration in beats and an
  offset from the start of the bar. Ties, dots, triplets and lyrics ride along.
- **Chord symbols** per measure (lead-sheet style) when present.
- **Doubts**: a list of `{measure, part, what, why}` where the model was unsure.
  Hand-written input lives or dies on this list being honest.

Pitches are MIDI numbers so the converter never has to parse note names, and
durations are in beats so the time signature is the only thing that decides
how a bar is filled.

## The song shape the converter targets

The app's code lives at its private address and is not in this repository, so
`to-msw.js` targets the shape visible from the migration page in `index.html`
at the repository root:

```js
{ id, title, key, created, updated,
  bars: [ { ev: { <part>: [ { m: <midi>, rest: <bool>, … } ] } } ],
  sections: [ … ] }
```

Everything beyond those fields is a stated guess and is marked `TODO(schema)`
in `to-msw.js`. Before the feature is wired into the app, open the app's song
loader and settle these against it:

1. The per-event timing fields (beat offset and duration) and their units.
2. The part names the app expects inside `ev` (e.g. melody, chords, bass).
3. The shape of a section entry and how a section points at its bars.
4. Whether `key` is a string such as "G major" or a structured value.
5. Where tempo and time signature live on the song.

## Running the analyzer

The page talks to the Claude API straight from the browser, which needs an API
key in the browser. That is fine for trying the idea on a private page and not
fine for shipping: the key goes into `localStorage` under
`mySongWriter.sheetImport.apiKey` and anyone who can run script on the page can
read it. Before this leaves the experiment stage, put a small proxy (a
Cloudflare Worker or similar) in front of the API so the key lives server-side
and the page only sends images.

Model: `claude-opus-5-5` with effort `high`. Server-side refusal fallback is
switched on (`fallbacks: "default"`), so a safety decline re-runs the request on
another model inside the same call instead of failing the upload.

## Not done yet

- PDF input. Pages have to be images for now; a PDF needs rasterising first
  (pdf.js in the browser would do it).
- Multi-voice staves. The schema allows one part per voice, but the prompt does
  not yet ask the model to split voices on a single staff.
- A proper review UI. Editing JSON by hand works for testing; the real thing
  should render the Score as notation next to the scan.
- Tests for `to-msw.js` once the song schema is confirmed.
