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
- [x] Record the 20 tint values from the deck, with each stop's font colour
- [ ] Resolve the Headline line height (the slide reads 24%, which renders 4.8px)
- [x] Copy logo assets from Drive into `assets/`
- [x] Confirm the Headline line height against the slide — the deck does read 24%
- [ ] Raise both source defects with the brand owner (see below)
- [ ] Source vector logo artwork — every file in Drive is raster
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

### Tints
Ramps at 100/80/60/40/20% exist for four colours only — Deep Azure, Gold, Forest Green,
Bold Red — at `color.tint.<colour>.<stop>`. Serene White, Charcoal Black and Fresh Green
have none.

They are mixed against **Serene White `#F5F7F2`, not pure white**. A pure-white mix drifts
by up to 11 per channel at the 20% stop, so use the recorded values rather than
regenerating them.

Font colour per stop: Gold takes Charcoal Black throughout; Deep Azure holds Serene White
down to 60%; Forest Green and Bold Red switch to Charcoal Black at 60%.

### The logo is a palette exception
The logo artwork is painted in **legacy colours that are not in the v2.0.1 palette** —
`#F9AF42` (not Gold `#FFB827`), `#149ED3`, `#13A89E` — and its wordmark is not Poppins.
This is correct: v2.0.1 kept the existing logo, and slide 1.2 says "do not change the
colour or font".

So `#F9AF42` appearing in `assets/` is fine; `#F9AF42` appearing in `tokens/tokens.json`
would mean the superseded 2021 palette had leaked in. The two look alike and are judged
differently — `npm run validate` scans only the token file for that reason.

Every logo file is raster; there is no vector artwork anywhere in the shared Drive.

### Two defects in the guidelines — raise these with the brand owner
Every value here is now transcribed and confirmed against the deck; nothing is guessed and
nothing is outstanding to read. What remains are two places where **the deck itself is
wrong**. Both are recorded exactly as stated, flagged `draft`, and left uncorrected,
because fixing a brand document is the brand owner's call.

1. **Headline line height reads 24%.** Confirmed — not a transcription error. At 20px that
   is 4.8px, so lines would overlap and no layout can use it. The likely intent is **24px**,
   entered with a `%` unit: at 20px that is exactly 120%, which every other Set 1 heading
   uses. Persuasive, but an inference — so the literal `24%` stands until confirmed.
2. **Deep Azure 60% + Serene White is not accessible.** The 2.2 chart pairs them, but white
   on `#6697D4` measures **2.80:1** — below even the 3:1 floor for large text, while
   Charcoal Black on that stop is 5.08:1. Blocked by a `must-not` rule in the accessibility
   guide. Every other pairing in both charts holds up when measured.

Also outstanding, though not a defect: **no vector logo artwork exists** anywhere in the
shared Drive, and the Secondary Logo is a low-resolution JPEG with a baked white
background that cannot sit on a coloured surface.

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
assets/        logos/ (primary, black + white wordmark), marks/ (secondary logo)
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
