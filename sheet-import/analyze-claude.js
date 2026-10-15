// The analyze stage, Claude edition: sends the prepared page images to the
// Messages API and gets a Score back as structured output.
//
// analyzeScore(pages, options) -> Promise<Score>
//   pages:   [{ mediaType: "image/jpeg", data: <base64, no newlines> }, ...] in page order
//   options: { apiKey, model?, effort?, hint? }
//
// This runs in the browser with the key in hand, which is only acceptable for
// a private experiment: see README.md, "Running the analyzer".

(function (root) {
  "use strict";

  var API_URL = "https://api.anthropic.com/v1/messages";
  var DEFAULT_MODEL = "claude-opus-5-5";

  var SYSTEM = [
    "You read sheet music from photographs and scans, printed or hand-written, and transcribe it exactly as a careful copyist would.",
    "Work bar by bar through every page in order. Count beats in every bar against the time signature and make the events of each part fill the bar; when they do not, say so in doubts rather than silently padding.",
    "Pitches are MIDI numbers, with the key signature and any accidentals applied and the clef of the part respected (middle C is 60). Offsets and durations are in beats of the time signature's unit.",
    "Give every staff or independent voice its own part with a short id, and give every part an entry in every measure's events, by that id.",
    "Use the title, tempo marking, chord symbols, lyrics, rehearsal letters and repeat signs that are on the page; leave a field empty rather than inventing one.",
    "Hand-written pages are messy: note heads drift off their lines, stems point the wrong way, rests are scribbles. Choose the most musical reading and put every such choice in doubts with the alternative you rejected."
  ].join(" ");

  function userText(pageCount, hint) {
    var t = "Transcribe the " + (pageCount === 1 ? "page" : pageCount + " pages, in the order given,") + " into the Score schema.";
    if (hint) t += " The uploader adds: " + hint;
    return t;
  }

  function buildRequest(pages, options) {
    var content = pages.map(function (p) {
      return { type: "image", source: { type: "base64", media_type: p.mediaType, data: p.data } };
    });
    content.push({ type: "text", text: userText(pages.length, options.hint) });
    return {
      model: options.model || DEFAULT_MODEL,
      max_tokens: 32000,
      system: SYSTEM,
      messages: [{ role: "user", content: content }],
      output_config: {
        effort: options.effort || "high",
        format: { type: "json_schema", schema: root.SheetImport.SCORE_SCHEMA }
      },
      fallbacks: "default"
    };
  }

  function analyzeScore(pages, options) {
    options = options || {};
    if (!options.apiKey) return Promise.reject(new Error("No API key"));
    if (!pages || !pages.length) return Promise.reject(new Error("No pages"));
    var body = buildRequest(pages, options);
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": options.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "server-side-fallback-2026-07-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (json) {
        if (!res.ok) {
          var msg = json && json.error && json.error.message ? json.error.message : ("HTTP " + res.status);
          throw new Error(msg);
        }
        return json;
      });
    }).then(function (msg) {
      if (msg.stop_reason === "refusal") {
        var d = msg.stop_details || {};
        throw new Error("The model declined to read this (" + (d.category || "no category") + ")" + (d.explanation ? ": " + d.explanation : ""));
      }
      if (msg.stop_reason === "max_tokens") throw new Error("The transcription ran past the output limit; try fewer pages at once");
      var text = (msg.content || []).filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("");
      var score;
      try { score = JSON.parse(text); } catch (e) { throw new Error("The reply was not valid JSON"); }
      score._usage = msg.usage;
      score._model = msg.model;
      return score;
    });
  }

  root.SheetImport = root.SheetImport || {};
  root.SheetImport.analyzeScore = analyzeScore;
  root.SheetImport.buildRequest = buildRequest;
})(typeof window !== "undefined" ? window : globalThis);
