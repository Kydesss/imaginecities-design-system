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
- **Three values are deliberately absent** and must be sampled from the deck, never
  computed or guessed: the tint swatch hexes (only the 100/80/60/40/20% *percentages* are
  recorded), the accessibility pairing matrix, and the Subheadline line height (deck reads
  "24%", a probable typo). See README "Known gaps".
- **Never ingest credentials.** The shared Drive folder contains a `Usernames & Passwords`
  doc; it is out of scope and must never enter this repo.

## Build / validate
- `npm run validate` — ajv-validates the DSDS doc against the v0.15.2 schema in `schema/`.
- Plan of record: `plan.md`.
