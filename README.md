# Imagine Cities Design System

Machine-readable design system for **Imagine Cities** (Calgary nonprofit). Captures the
brand as **DSDS** (Design System Documentation Schema, v0.15.2) documentation plus a
**W3C DTCG** `tokens.json` of raw values, so AI tools and future codebases (the IC website)
consume the brand consistently.

## Status
The system validates. Extraction of Brand Guidelines v2.0.1 is complete in
`source/brand-v2.0.1.md`, and both the DTCG token file and the DSDS document are
authored from it (see `plan.md`):

- [x] `npm init` + dev deps: `ajv`, `ajv-cli`, `ajv-formats`
- [x] Vendor `schema/dsds.bundled.schema.json` (v0.15.2) for offline validation
- [x] Author `tokens/tokens.json` (DTCG)
- [x] Author `dsds/imagine-cities.dsds.json` (DSDS) — 54 entities, validates clean
- [x] Verify the type scale label→spec mapping against both "3.2 Font System" slides
- [ ] Resolve the Headline line height (the slide reads 24%, which renders 4.8px)
- [ ] Transcribe the accessibility pairing matrix (visual grid in the deck)
- [ ] Sample the tint swatch hex values from the deck (percentages only so far)
- [ ] Download logo + mark assets from Drive into `assets/`
- [ ] `git commit` (repo has no commits yet)
- [ ] (optional) DSDS docs site

### Known gaps — read before relying on this
Nothing here is guessed. Three items are still open:

1. **Headline line height.** The slide reads 24%, which at 20px renders 4.8px. It is
   transcribed verbatim and the token is `draft`. Confirm the intended value with whoever
   owns the deck — do not silently substitute 120%.
2. **Tint hexes.** The deck documents 100/80/60/40/20% stops for Deep Azure, Gold,
   Forest Green and Bold Red as a visual chart. `tokens/tokens.json` carries the
   *percentages* only. Sample the hexes from the slide — do not compute them.
3. **Pairing matrix.** The deck classifies font-colour pairings as fully compliant /
   large-or-bold only / not compliant, at a 14pt-bold or 18pt-regular threshold. The
   grid is not transcribed, so the `accessibility` guide is `draft`. The contrast
   ratios in the colour foundation are **computed** from the token hexes per WCAG 2.1,
   not read off the deck.

**Resolved:** the type scale's label→spec mapping. The deck prints each style's Aa
sample beside its spec, and a first pass mapped them by reading order, which shuffled
Set 1. Both slides have now been checked: **Subtitle is 48px, and Headline and
Subheadline are both 20px** — the two "-line" styles are smaller than Subtitle, which
reads backwards but is what the deck defines. Set 2 needed no corrections.

## Layout
```
CLAUDE.md      AI brand-context loader + hard rules
plan.md        plan of record
source/        transcribed brand guidelines (provenance) — brand-v2.0.1.md
schema/        vendored DSDS bundled schema
dsds/          the DSDS document
tokens/        W3C DTCG token values
assets/        logos, marks (from Drive Design Assets/)
scripts/       check-refs.js — cross-checks DSDS against the token file
```

## Validate
```
npm run validate
```
Runs two checks:
- `validate:schema` — ajv validates `dsds/*.json` against the vendored DSDS v0.15.2 schema.
- `validate:refs` — every DSDS `source.path` resolves to a real token in
  `tokens/tokens.json`, every relationship and scale step names a documented entity,
  identifiers are unique, and no superseded 2021 value appears in the token file.

## Brand at a glance (v2.0.1, Oct 2024)
- Hero: Gold `#FFB827`. Palette: Deep Azure `#0656BF`, Serene White `#F5F7F2`,
  Charcoal Black `#242525`, Forest Green `#527302`, Fresh Green `#C6FDC2`, Bold Red `#C73124`.
- Type: Poppins (brand), Roboto (system fallback). No ALL CAPS, no underline, title-case
  headings, left-aligned body, no hyphenation.
- Icons: Google Material Symbols, outlined. Shapes: circles + rounded rectangles.

**Source of truth:** Brand Guidelines v2.0.1 only. The 2021 PDF is superseded — do not use.
