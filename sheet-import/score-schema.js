// The Score: the one shape every analyzer has to hand back, and the only
// thing the converter reads. Pitches are MIDI numbers (middle C = 60), all
// durations and offsets are in beats (a quarter note = 1 in x/4 time).
// JSON Schema draft 2020-12, written to be accepted as a structured-output
// schema (every object closed with additionalProperties: false, every
// property required).

(function (root) {
  "use strict";

  var EVENT = {
    type: "object",
    properties: {
      at: { type: "number", description: "Offset from the start of the measure, in beats" },
      dur: { type: "number", description: "Sounding length in beats; a dotted quarter in 4/4 is 1.5, a triplet eighth is 0.333" },
      pitches: { type: "array", items: { type: "integer" }, description: "MIDI numbers 0-127, empty for a rest; several for a chord" },
      rest: { type: "boolean" },
      tieToNext: { type: "boolean", description: "This event is tied into the next event of the same part" },
      lyric: { type: "string", description: "Syllable under this note, empty when none" }
    },
    required: ["at", "dur", "pitches", "rest", "tieToNext", "lyric"],
    additionalProperties: false
  };

  var MEASURE = {
    type: "object",
    properties: {
      n: { type: "integer", description: "Measure number, 1-based, 0 for a pickup bar" },
      events: {
        type: "array",
        description: "One entry per part, each holding that part's events in this measure in time order",
        items: {
          type: "object",
          properties: {
            part: { type: "string", description: "A part id from parts[]" },
            list: { type: "array", items: EVENT }
          },
          required: ["part", "list"],
          additionalProperties: false
        }
      },
      chords: {
        type: "array",
        description: "Lead-sheet chord symbols in this measure, if any",
        items: {
          type: "object",
          properties: {
            at: { type: "number" },
            symbol: { type: "string", description: "As written, e.g. G, Am7, D/F#" }
          },
          required: ["at", "symbol"],
          additionalProperties: false
        }
      },
      timeSignatureChange: { type: "string", description: "e.g. 3/4 when the meter changes at this bar, otherwise empty" },
      keyChange: { type: "string", description: "e.g. D major when the key changes at this bar, otherwise empty" }
    },
    required: ["n", "events", "chords", "timeSignatureChange", "keyChange"],
    additionalProperties: false
  };

  var SCORE = {
    type: "object",
    properties: {
      title: { type: "string" },
      composer: { type: "string" },
      key: {
        type: "object",
        properties: {
          tonic: { type: "string", description: "Letter with accidental: C, F#, Bb" },
          mode: { type: "string", enum: ["major", "minor"] }
        },
        required: ["tonic", "mode"],
        additionalProperties: false
      },
      time: {
        type: "object",
        properties: {
          beats: { type: "integer", description: "Top number" },
          unit: { type: "integer", description: "Bottom number" }
        },
        required: ["beats", "unit"],
        additionalProperties: false
      },
      tempo: { type: "integer", description: "Beats per minute; 0 when the page gives none" },
      tempoText: { type: "string", description: "Any tempo marking as written, e.g. Andante" },
      pickupBeats: { type: "number", description: "Length of the pickup bar in beats, 0 when none" },
      parts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Short stable id referenced by measures[].events[].part, e.g. melody, bass, rh, lh" },
            name: { type: "string", description: "Instrument or voice as written or guessed" },
            clef: { type: "string", enum: ["treble", "bass", "alto", "tenor", "percussion", "unknown"] }
          },
          required: ["id", "name", "clef"],
          additionalProperties: false
        }
      },
      sections: {
        type: "array",
        description: "Named spans of measures: rehearsal marks, verse/chorus labels, or a sensible split when the page has none",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            from: { type: "integer", description: "First measure number" },
            to: { type: "integer", description: "Last measure number, inclusive" },
            repeat: { type: "boolean", description: "Enclosed in repeat barlines" }
          },
          required: ["name", "from", "to", "repeat"],
          additionalProperties: false
        }
      },
      measures: { type: "array", items: MEASURE },
      doubts: {
        type: "array",
        description: "Everything the reader was not sure about; be generous, this list is reviewed by a person",
        items: {
          type: "object",
          properties: {
            measure: { type: "integer" },
            part: { type: "string" },
            what: { type: "string", description: "The reading chosen" },
            why: { type: "string", description: "What made it doubtful and the likely alternative" }
          },
          required: ["measure", "part", "what", "why"],
          additionalProperties: false
        }
      }
    },
    required: ["title", "composer", "key", "time", "tempo", "tempoText", "pickupBeats", "parts", "sections", "measures", "doubts"],
    additionalProperties: false
  };

  root.SheetImport = root.SheetImport || {};
  root.SheetImport.SCORE_SCHEMA = SCORE;
})(typeof window !== "undefined" ? window : globalThis);
