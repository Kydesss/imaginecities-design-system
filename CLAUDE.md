# Imagine Cities Design System — Claude Code context

This repo is the **machine-readable brand/design system for Imagine Cities (IC)**, a
Calgary nonprofit. Purpose: give AI tools accurate, structured brand context so anything
built (the IC website, graphics, docs) matches the brand without re-reading a slide deck.

## Authoritative sources (in priority order)
1. `dsds/imagine-cities.dsds.json` — DSDS documentation (human + AI readable).
2. `tokens/tokens.json` — W3C DTCG raw token values (hex, px, weights). Import these.
3. `source/brand-v2.0.1.md` — transcription of the official Brand Guidelines v2.0.1.

`source/observed-website.md` and `source/observed-assessment-tool.md` are **not** sources of
truth. They record what shipped builds do today (descriptive only). Never promote a value
from them into `tokens/tokens.json`; where a build and the deck disagree, the deck wins and
the build is what needs fixing.

## Hard rules
- **Only** use Brand Guidelines **v2.0.1 (Oct 2024)** values. Brand font is **Poppins**
  (system fallback **Roboto**). Hero colour is **Gold `#FFB827`**.
- **Never** use the 2021 "Design Guidelines.pdf" (Montserrat + Azure/Viridian/Turquoise/
  Aqua palette). It is superseded and will corrupt the brand. If you see Montserrat or
  those colours, it is wrong — **with one documented exception, below.**
- **The logo artwork is the exception.** v2.0.1 kept the existing logo unchanged, so the
  files in `assets/logos/` are painted in legacy colours — `#F9AF42` (not Gold `#FFB827`),
  `#149ED3`, `#13A89E` — and the wordmark is not Poppins. This is correct and intended:
  slide 1.2 says "do not change the colour or font" of the logo. **Never recolour the logo
  to the v2.0.1 palette, and never treat these hexes as brand colours** — they are not
  tokens, they exist only inside the logo art.
- **Never invent** colours, type values, or components. The guidelines are brand-level and
  do not document a component library — do not fabricate component specs.
- **There is no spacing scale, radius scale, or component-state spec** — not in the deck,
  and not derivable from the live site (audited: twelve ad-hoc padding values, five radii).
  If a build needs them, say they are undocumented and pick explicitly; do not present a
  choice as brand.
- **Tints** live at `color.tint.<colour>.<stop>` for Deep Azure, Gold, Forest Green and
  Bold Red only. They are mixed against Serene White `#F5F7F2`, **not** pure white — never
  regenerate them by formula, use the values.
- **Never put Serene White text on the Deep Azure 60% tint `#6697D4`** (2.80:1). The 2.2
  chart pairs them, but it fails every WCAG threshold; use Charcoal Black (5.08:1).
- **Colour pairings:** only Charcoal Black with Serene White / Fresh Green / Gold is safe
  at any text size. Six further pairings need 14pt bold or 18pt regular minimum, and four
  must never carry text. Full matrix on the `color` foundation. Do not classify a pairing
  the deck does not show.
- **Type scale sizes are counter-intuitive and confirmed:** Subtitle is 48px; Headline and
  Subheadline are both 20px. Do not "correct" them to a conventional hierarchy.
- Headline's line height is **24%** as printed on the slide — confirmed, not a mis-read. It
  renders 4.8px at 20px, so it is a defect in the deck awaiting the brand owner. Likely
  meant 24px (= 120%). Do not substitute 120% until that is confirmed.
- **Never ingest credentials.** The shared Drive folder contains a `Usernames & Passwords`
  doc; it is out of scope and must never enter this repo.

## Build / validate
- `npm run validate` — ajv-validates the DSDS doc against the v0.15.2 schema in `schema/`.
- Plan of record: `plan.md`.
