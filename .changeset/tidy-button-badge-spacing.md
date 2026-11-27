---
"@outfitter/parks": patch
---

Tighten rectangular buttons and even out badge spacing. A rectangular button's text padding and corner no longer grow with the corner smoothing, which had been applied twice, so the button hugs its label. A dot on a rectangular badge now sits as far from the edge as from its label, and badge labels are lifted slightly so mostly lowercase text reads as vertically centred. Button and Badge now wrap their text so the vertical trim applies to it: bare text was never trimmed and sat about a pixel high.
