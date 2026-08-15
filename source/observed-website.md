# Observed: www.imaginecities.com (audit 2026-08-15)

> **This file is DESCRIPTIVE, not NORMATIVE.** It records what the live website currently
> does. The website is an implementation, not a source of brand truth — Brand Guidelines
> v2.0.1 is the only authority, and nothing here may be promoted into
> `tokens/tokens.json` or treated as a documented brand value. Where the site and the deck
> disagree, **the deck wins** and the site is the thing that needs fixing.
>
> Captured from `https://www.imaginecities.com/` and its five stylesheets
> (`/static/css/{base,navbar,home,carousel,footer}.css`) on 2026-08-15.

## Why this exists

The v2.0.1 guidelines are brand-level: they document colour, type, logo, iconography and
imagery, but no spacing scale, no radii, and no component states. The live site was checked
to see whether it supplies those missing pieces.

**It does not.** It has real button implementations worth knowing about, but no spacing
system to extract — see "What the site cannot supply" below.

## Domain

`www.imaginecities.ca`, the URL printed in the v2.0.1 deck, **does not resolve** (DNS
failure). The live site is `www.imaginecities.com`.

## What the site gets right

- Every `font-family` declaration in the site's own CSS is **Poppins**. No exceptions.
- The palette is v2.0.1: Charcoal Black `#242525` (11 uses), Serene White `#F5F7F2` (7),
  Gold `#FFB827` (6), Deep Azure `#0656BF` (1).
- `#D4DDC2` appears once — exactly the documented Forest Green 20% tint.
- Gold is used for calls to action, matching §2.3.

## Button implementations

Two competing CTA components exist.

**`.primary-button`** (base.css):
```css
font-family: 'Poppins' !important;
border-radius: 50px;
padding: 1em 1.6em;
background-color: #FFB827;
color: #242525;
display: inline-flex;
align-items: center;
gap: 0.625em;
```
Hover inverts: `background-color: #242525; color: #FFB827;`

**`.learn-more-btn`** (home.css):
```css
background-color: #ffb827;
padding: 1em 2em;
font-size: 1em;
font-weight: 600;
border-radius: 2em;
```
Hover inverts the same way.

Worth adopting from these: the CTA is a **pill** (`50px` / `2em`), which is a rounded
rectangle and so consistent with §4.1 holding shapes; and the hover pattern is a **full
inversion to Charcoal Black on Gold**, which is 8.88:1 — a fully compliant pairing.

## Defects found on the live site

1. **Three dead font loads, one of them the superseded brand font.** The HTML links
   Montserrat, Raleway and Noto Serif from Google Fonts. Zero CSS rules reference any of
   them — they are downloaded and never used. Montserrat is the 2021 brand font and should
   not appear on the site at all.
2. **`.learn-more-btn` never sets a text colour.** It declares `color` only on `:hover`.
   No anchor colour rule covers it, so the default state falls back to the user agent's
   link colour on a Gold background. This needs measuring in a browser and almost certainly
   fails contrast.
3. **Font weights are requested but never loaded.** Poppins is loaded at 400/500/600, but
   the CSS uses `font-weight: 800` twice and `font-weight: bold` (700) twice. Those render
   as browser-synthesized fakes, not real Poppins weights.
4. **Button weight conflicts with the brand.** `.learn-more-btn` uses `font-weight: 600`
   (SemiBold); the documented Button Text style is **Medium (500)**.
5. **Two competing button components** with different padding (`1em 1.6em` vs `1em 2em`)
   and different radii (`50px` vs `2em`).
6. **Off-palette colours:** `#000000` (used for text and a hover background, where Charcoal
   Black `#242525` is the brand value), `#272728`, `#E0E0E0`, `#CCCCCC`, and `#C9DAF1` as a
   background. None is a v2.0.1 colour or a documented tint.

## What the site cannot supply

- **No spacing scale.** Padding values are ad-hoc: `0.2em`, `0.5em`, `0.625em`, `0.75em`,
  `1em`, `1.5em`, `1.6em`, `1.875em`, `2em`, `2.5em`, `5em`, `6em`. There is no common
  step, so nothing can be extracted without inventing the system that isn't there.
- **No radius scale.** Five different values are in use: `50px`, `8px`, `2rem`, `2em`,
  `5px`. The only defensible reading is "CTAs are pills"; the rest is inconsistent.
- **No type scale.** Sizes are ad-hoc `em` values (`0.5em`, `0.875em`, `0.9em`, `1.125em`,
  `1.13em`, `1.375em`, `1.2em`, `1.5em`, `2em`, `2.625em`, `2.8em`, `3em`) that do not map
  onto the twelve documented styles.

Spacing, radii and component states therefore remain undocumented at brand level. Defining
them is a decision for the brand owner, not something to reverse-engineer from a site that
is itself inconsistent.
