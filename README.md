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
- [x] Transcribe the accessibility pairing matrix — 13 pairings, all three classes
- [ ] Resolve the Headline line height (the slide reads 24%, which renders 4.8px)
- [ ] Sample the tint swatch hex values from the deck (percentages only so far)
- [ ] Download logo + mark assets from Drive into `assets/`
- [ ] `git commit` (repo has no commits yet)
- [ ] (optional) DSDS docs site

### Colour accessibility
All 13 documented pairings are encoded on the colour foundation. Each is symmetric —
either colour may be the text:

| Class | Pairings | Ratio |
|---|---|---|
| **Fully compliant** — any text size | Charcoal Black with Serene White, Fresh Green, or Gold | 8.88–14.25:1 |
| **Large or bold only** — min 14pt bold / 18pt regular | Serene White with Deep Azure, Forest Green, or Bold Red; Fresh Green with Deep Azure, Forest Green, or Bold Red | 4.68–6.30:1 |
| **Not compliant for texts** — never | Deep Azure + Forest Green, Bold Red + Deep Azure, Gold + Fresh Green, Forest Green + Bold Red | 1.02–1.50:1 |

Two consequences worth knowing before designing:

- **Every fully-compliant pairing involves Charcoal Black.** Small text in Deep Azure,
  Forest Green or Bold Red has no compliant option — change the size or the colour.
- **The deck is stricter than WCAG AA.** Its fully-compliant band starts at 7:1 (AAA for
  normal text), and every pairing it restricts to large-or-bold actually clears 4.5:1.
  Follow the deck.

Pairings the slide does not show are undocumented — neither approved nor forbidden.

### Known gaps — read before relying on this
Nothing here is guessed. Two items are still open:

1. **Headline line height.** The slide reads 24%, which at 20px renders 4.8px. It is
   transcribed verbatim and the token is `draft`. Confirm the intended value with whoever
   owns the deck — do not silently substitute 120%.
2. **Tint hexes.** The 2.2 chart is a raster image; reading swatch colours off it by eye
   is guesswork, so `tokens/tokens.json` still carries the *percentages* only. A linear
   white mix would land close but is a guess at how the deck was built. Sample them from
   the source file. The chart's **recommended font colour per tint** is recorded — it's on
   the colour foundation, and Gold takes Charcoal Black at every stop while Deep Azure and
   Bold Red hold Serene White down to 60%.

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
