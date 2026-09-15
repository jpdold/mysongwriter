#!/usr/bin/env python3
"""Rebuild the embedded music font in index.html.

The staves are engraved in SMuFL glyphs from Bravura (Steinberg, SIL Open Font License 1.1). This builds a
small font of its own, "MSW Music" (the OFL reserves the name Bravura for the original), holding:

  * every glyph the page names in its `SM = { ... }` table, copied unchanged at its SMuFL code point — an em
    is four staff spaces and the origin is the engraved anchor, which is how the staves place them;
  * the note, rest, clef and accidental symbols the tools and text use at their Unicode code points (♩ ♪ 𝅝
    𝄽 𝄞 ♯ …), the same outlines shifted and scaled to sit on a text baseline like letters, so a label or
    a button shows them by falling through its font stack to this font.

The woff2 is spliced into the page's @font-face as a base64 data URI. To add a glyph for the staves, add its
code point to the SM table in index.html; to add a text symbol, add a row to TEXT_SYMBOLS below. Then:

    pip install fonttools brotli
    python build_music_font.py            # downloads Bravura.otf beside this script if it is not there
"""
import base64, io, os, re, sys, urllib.request
from fontTools.ttLib import TTFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.join(HERE, "index.html")
OTF = os.path.join(HERE, "Bravura.otf")
OTF_URL = "https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/Bravura.otf"
UPM = 1000; SP = UPM / 4                                      # a staff space, in font units

# the text symbols: code point, scale, and where the glyph's foot goes (em above the baseline)
NOTES = [0x2669, 0x266A, 0x1D15C, 0x1D15D, 0x1D15E, 0x1D15F, 0x1D160, 0x1D161, 0x1D162, 0x1D163, 0x1D164]   # ♩ ♪ 𝅜 𝅝 𝅗𝅥 𝅘𝅥 𝅘𝅥𝅯 … 𝅘𝅥𝅳
TEXT_SYMBOLS = [(cp, 0.85, 0.0) for cp in NOTES] + [
    (0x1D13B, 0.85, 0.50), (0x1D13C, 0.85, 0.30),            # 𝄻 whole rest hangs high, 𝄼 half rest sits lower
    (0x1D13D, 0.85, 0.08), (0x1D13E, 0.85, 0.08), (0x1D13F, 0.85, 0.06), (0x1D140, 0.85, 0.04), (0x1D141, 0.75, 0.02), (0x1D142, 0.7, 0.0),   # 𝄽 𝄾 𝄿 𝅀 𝅁 𝅂
    (0x1D11E, 0.72, -0.22), (0x1D121, 0.72, 0.0), (0x1D122, 0.72, -0.05),   # 𝄞 𝄡 𝄢: a little taller than a line of text, the G clef dipping below it as it does on a stave
    (0x266D, 0.8, 0.05), (0x266E, 0.8, 0.05), (0x266F, 0.8, 0.05),        # ♭ ♮ ♯
]

page = io.open(PAGE, encoding="utf-8").read()
table = re.search(r"const SM = \{(.*?)\};", page, re.S).group(1)
smufl = sorted({int(h, 16) for h in re.findall(r"0x([0-9A-Fa-f]{4})", table)})
print("staff glyphs named in index.html:", len(smufl), "- text symbols:", len(TEXT_SYMBOLS))

if not os.path.exists(OTF):
    print("downloading", OTF_URL); urllib.request.urlretrieve(OTF_URL, OTF)
src = TTFont(OTF); gs = src.getGlyphSet(); cmap = src.getBestCmap()
copyright_ = next(r.toUnicode() for r in src["name"].names if r.nameID == 0).split("\n")[0]

order, charstrings, metrics, newcmap = [".notdef"], {}, {}, {}
pen = T2CharStringPen(500, None); charstrings[".notdef"] = pen.getCharString(); metrics[".notdef"] = (500, 0)
def add(cp, name, transform):
    srcname = cmap.get(cp)
    if not srcname: print("  not in Bravura: U+%04X" % cp); return
    bp = BoundsPen(gs); gs[srcname].draw(TransformPen(bp, transform)); xmin = bp.bounds[0] if bp.bounds else 0
    adv = round(src["hmtx"][srcname][0] * transform[0])
    p = T2CharStringPen(adv, None); gs[srcname].draw(TransformPen(p, transform))
    order.append(name); charstrings[name] = p.getCharString(); metrics[name] = (adv, round(xmin)); newcmap[cp] = name
for cp in smufl: add(cp, "uni%04X" % cp, (1, 0, 0, 1, 0, 0))
for cp, s, foot in TEXT_SYMBOLS:
    bp = BoundsPen(gs); gs[cmap[cp]].draw(bp); ymin = bp.bounds[1] * s
    add(cp, "u%04X" % cp, (s, 0, 0, s, 0, round(foot * UPM - ymin)))

fb = FontBuilder(UPM, isTTF=False)
fb.setupGlyphOrder(order); fb.setupCharacterMap(newcmap)
fb.setupCFF("MSWMusic", { "FullName": "MSW Music", "FamilyName": "MSW Music", "Notice": copyright_ + " MSW Music is a subset, renamed under the SIL Open Font License 1.1." }, charstrings, {})
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=900, descent=-200)                         # text-like line metrics, so the font sits in a stack without widening its lines
fb.setupNameTable({ "familyName": "MSW Music", "styleName": "Regular", "psName": "MSWMusic", "fullName": "MSW Music", "uniqueFontIdentifier": "MSWMusic; subset of Bravura",
                    "copyright": copyright_, "licenseDescription": "SIL Open Font License, Version 1.1 — see BRAVURA-LICENSE.txt", "licenseInfoURL": "https://scripts.sil.org/OFL" })
fb.setupOS2(version=4, sTypoAscender=900, sTypoDescender=-200, sTypoLineGap=0, usWinAscent=1400, usWinDescent=900, fsSelection=0x80 | 0x40)   # USE_TYPO_METRICS, REGULAR
fb.setupPost()
fb.font.flavor = "woff2"
buf = io.BytesIO(); fb.font.save(buf); woff2 = buf.getvalue()

b64 = base64.b64encode(woff2).decode()
new, n = re.subn(r'(font-family: "MSW Music"; src: url\(data:font/woff2;base64,)[A-Za-z0-9+/=]+', lambda m: m.group(1) + b64, page)
assert n == 1, "the @font-face for MSW Music was not found in index.html"
io.open(PAGE, "w", encoding="utf-8", newline="\n").write(new)
print("embedded %d bytes of woff2 (%d glyphs) into index.html" % (len(woff2), len(order)))
