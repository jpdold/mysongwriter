// The convert stage: Score -> My Song Writer song -> backup file.
//
// The app's own code is not in this repository, so the song shape below is
// built from what the migration page (../index.html) reads: a song has
// id, title, key, created, updated, bars[] and sections[], a bar has ev
// keyed by part, and an event has m (MIDI number) and rest. Every other
// field is a guess marked TODO(schema); README.md lists what to confirm.

(function (root) {
  "use strict";

  function keyName(key) {
    if (!key || !key.tonic) return "";
    return key.tonic + " " + (key.mode === "minor" ? "minor" : "major");
  }

  function songId() {
    return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // One Score event -> one or more song events (a chord becomes one event per pitch).
  function toEvents(ev) {
    var base = {
      at: ev.at,            // TODO(schema): beat offset within the bar; confirm name and unit
      dur: ev.dur,          // TODO(schema): length in beats; confirm name and unit
      tie: !!ev.tieToNext,  // TODO(schema): confirm how the app marks ties
      lyric: ev.lyric || "" // TODO(schema): confirm where lyrics live
    };
    if (ev.rest || !ev.pitches || !ev.pitches.length) {
      return [Object.assign({ m: null, rest: true }, base)];
    }
    return ev.pitches.map(function (m) { return Object.assign({ m: m, rest: false }, base); });
  }

  function toSong(score) {
    var now = Date.now();
    var partIds = (score.parts || []).map(function (p) { return p.id; });

    var bars = (score.measures || []).map(function (m) {
      var ev = {};
      partIds.forEach(function (id) { ev[id] = []; });
      (m.events || []).forEach(function (pe) {
        if (!pe || !pe.part) return;
        ev[pe.part] = (ev[pe.part] || []).concat((pe.list || []).reduce(function (acc, e) { return acc.concat(toEvents(e)); }, []));
      });
      var bar = { n: m.n, ev: ev };
      if (m.chords && m.chords.length) bar.chords = m.chords;              // TODO(schema): chord symbols on a bar
      if (m.timeSignatureChange) bar.time = m.timeSignatureChange;        // TODO(schema): per-bar meter change
      if (m.keyChange) bar.key = m.keyChange;                              // TODO(schema): per-bar key change
      return bar;
    });

    // Measure numbers -> bar indexes, so a section can point at bars by position.
    var indexOf = {};
    bars.forEach(function (b, i) { indexOf[b.n] = i; });
    var sections = (score.sections || []).map(function (s) {
      return {
        name: s.name,
        from: indexOf[s.from] != null ? indexOf[s.from] : 0,                       // TODO(schema): confirm sections reference bars by index
        to: indexOf[s.to] != null ? indexOf[s.to] : Math.max(0, bars.length - 1),
        repeat: !!s.repeat
      };
    });

    return {
      id: songId(),
      title: score.title || "Untitled song",
      composer: score.composer || "",                                   // TODO(schema)
      key: keyName(score.key),                                          // TODO(schema): string or structured
      time: score.time ? score.time.beats + "/" + score.time.unit : "", // TODO(schema)
      tempo: score.tempo || 0,                                          // TODO(schema)
      pickupBeats: score.pickupBeats || 0,                              // TODO(schema)
      parts: (score.parts || []).map(function (p) { return { id: p.id, name: p.name, clef: p.clef }; }), // TODO(schema)
      bars: bars,
      sections: sections,
      created: now,
      updated: now,
      imported: { from: "sheet-import", model: score._model || "", doubts: score.doubts || [] }
    };
  }

  // Wrap songs the way the migration page does, so the app's existing
  // "Bring songs in from a backup file…" accepts the result.
  function toBackup(songs) {
    var keys = {};
    songs.forEach(function (s) { keys["mySongWriter.song." + s.id] = JSON.stringify(s); }); // TODO(schema): confirm per-song key prefix
    return {
      app: "My Song Writer backup",
      v: 1,
      at: new Date().toISOString(),
      from: "sheet-import",
      count: songs.length,
      keys: keys
    };
  }

  root.SheetImport = root.SheetImport || {};
  root.SheetImport.toSong = toSong;
  root.SheetImport.toBackup = toBackup;
})(typeof window !== "undefined" ? window : globalThis);
