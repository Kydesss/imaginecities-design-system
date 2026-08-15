# Imagine Cities Design System — Claude Code context

This repo is the **machine-readable brand/design system for Imagine Cities (IC)**, a
Calgary nonprofit. Purpose: give AI tools accurate, structured brand context so anything
built (the IC website, graphics, docs) matches the brand without re-reading a slide deck.

## Authoritative sources (in priority order)
1. `dsds/imagine-cities.dsds.json` — DSDS documentation (human + AI readable).
2. `tokens/tokens.json` — W3C DTCG raw token values (hex, px, weights). Import these.
3. `source/brand-v2.0.1.md` — transcription of the official Brand Guidelines v2.0.1.

## Hard rules
- **Only** use Brand Guidelines **v2.0.1 (Oct 2024)** values. Brand font is **Poppins**
  (system fallback **Roboto**). Hero colour is **Gold `#FFB827`**.
- **Never** use the 2021 "Design Guidelines.pdf" (Montserrat + Azure/Viridian/Turquoise/
  Aqua palette). It is superseded and will corrupt the brand. If you see Montserrat or
  those colours, it is wrong.
- **Never invent** colours, type values, or components. The guidelines are brand-level and
  do not document a component library — do not fabricate component specs.
- **Tint swatch hexes are deliberately absent** — only the 100/80/60/40/20% *percentages*
  are recorded, for Deep Azure, Gold, Forest Green and Bold Red only. Sample them from the
  deck; never compute them from a white mix. The recommended font colour per tint IS
  recorded, on the `color` foundation.
- **Colour pairings:** only Charcoal Black with Serene White / Fresh Green / Gold is safe
  at any text size. Six further pairings need 14pt bold or 18pt regular minimum, and four
  must never carry text. Full matrix on the `color` foundation. Do not classify a pairing
  the deck does not show.
- **Type scale sizes are counter-intuitive and confirmed:** Subtitle is 48px; Headline and
  Subheadline are both 20px. Do not "correct" them to a conventional hierarchy.
- Headline's line height is **24%** as printed on the slide, which renders 4.8px at 20px.
  It is unresolved, not a value to build on — do not substitute 120% for it.
- **Never ingest credentials.** The shared Drive folder contains a `Usernames & Passwords`
  doc; it is out of scope and must never enter this repo.

## Build / validate
- `npm run validate` — ajv-validates the DSDS doc against the v0.15.2 schema in `schema/`.
- Plan of record: `plan.md`.
