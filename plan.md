> **Handoff note:** Steps 1–5 are DONE. `source/brand-v2.0.1.md` holds the full
> transcription; `tokens/tokens.json` (DTCG) and `dsds/imagine-cities.dsds.json` (54
> entities) are authored from it and `npm run validate` passes both schema and
> cross-reference checks. Remaining: transcribe the accessibility pairing matrix, sample
> the tint hexes, verify the Subheadline line height, download assets, git commit,
> optional docs site. See README "Known gaps".
>
> Two deviations from the plan below, both to avoid inventing values:
> - **§3 tint sub-groups** hold the documented *percentages*, not colour values — the
>   deck's tint swatches are a visual chart and their hexes were never transcribed.
> - **§4 `contrast` data** is computed from the token hexes per WCAG 2.1 and labelled as
>   such. The deck's own pairing classification is a visual grid, still untranscribed, so
>   the `accessibility` guide is `draft`.

# Imagine Cities Design System (DSDS + DTCG)

## Context

Joaquin is joining Imagine Cities (IC) as a volunteer UI/UX designer and will help
rebuild the design team and revamp the website. Ron shared a Google Drive design folder
containing IC's brand guidelines. Goal: capture the brand as a **machine-readable design
system** so that AI tools (Claude Code, etc.) get accurate, structured brand context and
apply it correctly when building the website and other assets — instead of re-reading a
23-slide deck each time.

Format: **DSDS** (Design System Documentation Schema, github.com/somerandomdude/design-system-documentation-schema,
JSON Schema Draft 2020-12, v0.15.2) for the *documentation*, plus a **W3C DTCG
`tokens.json`** for raw token *values* (DSDS references DTCG for values by design).

Decisions locked with the user:
- **Location:** new **standalone Git repo** (separate Claude Code instance, not the job-search vault).
- **Scope:** **Full brand DSDS** — Foundations + Tokens + Guides + color-usage Patterns (no invented components).
- **Token values:** emit **both** DSDS docs and a DTCG `tokens.json`.

### Source-of-truth + safety notes (critical)
- **Build only from "Imagine Cities Brand Guidelines" v2.0.1 (Oct 2024)** — Google Slides,
  Drive id `1c0F9BWUlD3Jozm-dHOAv-diGGWcH5wueKYUQxyc7ISI`. Transcribed to `source/brand-v2.0.1.md`.
- **Ignore / mark deprecated: "Design Guidelines.pdf" (2021)**, Drive id
  `1QC5-0AE9SMJ5NoXgf4yhYx3eIFVczQbf`. It uses a DIFFERENT palette (Montserrat,
  Azure/Viridian/Turquoise/Aqua, gold #F9AF42) and will corrupt the tokens if mixed in.
- **Never ingest** the `Usernames & Passwords` doc (id `1jQGHlIIDn2ufN...`) — it holds live
  plaintext credentials. Out of scope entirely. (Separately: advise Ron to move those to a
  password manager and rotate them, since the folder is link-shared.)

## Approach

### 1. Scaffold the repo
- `git init`; `npm init`; dev deps `ajv`, `ajv-cli`, `ajv-formats` (matching DSDS tooling).
- Vendor the DSDS bundled schema: reference
  `https://designsystemdocspec.org/v0.15.2/dsds.bundled.schema.json` via `$schema`, and
  keep a local copy under `schema/` for offline `ajv` validation.
- `package.json` script: `"validate": "ajv validate -c ajv-formats -s schema/dsds.bundled.schema.json -d 'dsds/*.json'"`.
- Structure: `CLAUDE.md`, `README.md`, `plan.md`, `schema/`, `dsds/`, `tokens/`, `assets/`, `source/`.

### 2. Extract v2.0.1 fully — DONE
See `source/brand-v2.0.1.md`. Still to pull: logo + mark assets from Drive `Design Assets/`
(`ImagineCities Logos` id `1pcSC3O6GQpO0vRXTZ8x5tX6VcPX3dYTY`; marks `city_diamond_large`)
into `assets/`.

### 3. Author `tokens/tokens.json` (W3C DTCG)
- `color.*`: brand colours as `{ "$type": "color", "$value": "#FFB827" }`, plus a tint
  sub-group per colour (Gold/Deep Azure/Forest Green/Bold Red at 20/40/60/80/100).
- `font.family.brand` = Poppins; `font.family.system` = Roboto; `font.weight.*`;
  `typography.*` composite tokens for each of the 12 scale steps (fontSize, lineHeight,
  letterSpacing, weight) per `source/brand-v2.0.1.md` §3.2.
- Semantic aliases: `color.action` -> gold, `color.link`/`color.header` -> deep azure,
  `color.text` -> charcoal, `color.background` -> serene white, `color.danger` -> bold red.

### 4. Author `dsds/imagine-cities.dsds.json` (DSDS document)
Top level: `$schema`, `dsdsVersion: "0.15.2"`, `entities: [...]`. Entities:
- **Foundations:** `color`, `typography`, `logo`, `iconography`, `imagery` — `principles`/
  `guidelines`/`scales` blocks summarising v2.0.1.
- **Token groups + tokens:** mirror the DTCG groups; each DSDS token `source` references the
  DTCG token id; add `contrast` where §2.4 specifies pairings (re-check the visual grid).
- **Guides:** `color-usage`, `accessibility`, `voice-and-content` (no ALL CAPS, title case,
  left-align, no hyphenation; Poppins-vs-Roboto usage from §3.4).
- **Patterns:** `colour-usage` pattern (primary/secondary/accent roles; 20% tint section
  backgrounds; Bold Red sparingly).
- No **Components** (guidelines don't document a component library; do not invent).
- Set each entity `status` + `metadata` (source = "IC Brand Guidelines v2.0.1", link to Slides).

### 5. Make it AI-consumable
- `CLAUDE.md` (done) points Claude at the DSDS + tokens files, states v2.0.1-only rule,
  forbids the 2021 PDF and inventing values.
- `README.md` (done): what it is, validate, regenerate, downstream import of `tokens.json`.

### 6. (Optional, later) Docs site
DSDS ships `node scripts/build-site.js`. Layer on once the JSON is stable for a shareable
HTML reference for the IC team.

## Verification
- `npm run validate` passes (ajv validates DSDS against v0.15.2; DTCG `tokens.json` parses).
- Every colour/type value traces back to `source/brand-v2.0.1.md` — zero 2021-PDF values.
- DSDS token `source` refs resolve to real DTCG ids (no dangling refs).
- Fresh Claude Code instance asked to "style a button with the IC brand" returns Gold CTA on
  Serene White, Poppins, correct hex, Button Text = Medium 16px — no Montserrat/old palette.
- No credentials or 2021-PDF content anywhere in the repo.
