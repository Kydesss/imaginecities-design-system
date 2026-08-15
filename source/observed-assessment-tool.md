# Observed: Neighbourhood Adaptability Assessment Flow (audit 2026-08-15)

> **DESCRIPTIVE, not NORMATIVE.** Same rule as `observed-website.md`: this records what a
> build currently does. Brand Guidelines v2.0.1 is the only authority, and nothing here may
> be promoted into `tokens/tokens.json`. Where this build and the deck disagree, the deck
> wins.
>
> Captured from `https://fun-tested-13948191.figma.site/` and its stylesheet
> (`/_components/v2/80691f11…css`, 102KB) on 2026-08-15.
>
> "This tool guides users through an assessment of their neighbourhood's adaptability,
> providing insights and actionable steps for community leaders and residents."

## Summary

This is the **most brand-compliant Imagine Cities build audited so far**, and the only one
with a real component set. It is also the one that most needs a token pipeline: its colour
decisions were made independently of the documented palette, so it carries a parallel,
undocumented colour system alongside the correct one.

## What it gets right

- **Poppins is loaded properly** — `fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700`,
  applied on `body`. This is better than the main site, which loads three fonts it never uses.
- **Six of the seven brand colours are used, 86 times between them:**

| Colour | Uses | Token |
|---|---|---|
| Charcoal Black `#242525` | 27 | `color.charcoal-black` |
| Deep Azure `#0656BF` | 20 | `color.deep-azure` |
| Gold `#FFB827` | 16 | `color.gold` |
| Forest Green `#527302` | 11 | `color.forest-green` |
| Fresh Green `#C6FDC2` | 7 | `color.fresh-green` |
| Serene White `#F5F7F2` | 5 | `color.serene-white` |

## The systemic problem: a parallel colour system

**37 uses across 16 colours are off-palette, and not one of the 20 documented tint values
appears anywhere.** The build invented its own light and dark ramps in parallel with the
ones the deck already specifies:

| Observed | Uses | Documented value that already exists |
|---|---|---|
| `#FFFAED`, `#FFF8E7`, `#FFF3D6` | 7 | Gold 20% `#F7EAC9` |
| `#E8EDE2`, `#EBF5DF`, `#D1D9C8` | 7 | Forest Green 20% `#D4DCC2` |
| `#EBF1FB` | 3 | Deep Azure 20% `#C5D6E7` |
| `#0449A6` | 2 | a darkened Deep Azure; no documented equivalent |
| `#9E6A00` | 2 | a dark gold, presumably for gold-coloured text |
| `#466102`, `#4A5340`, `#5A6350`, `#9CA89A` | 13 | green shades and muted greys; none documented |

This is the failure mode the tint values were recorded to prevent. The section-background
role in §2.3 is served by the documented 20% tints; this build has three cream golds and
three light greens doing that job instead.

### shadcn/ui defaults leaking through

Three values are the stock shadcn/ui theme, not brand decisions:

- `#030213` — shadcn's default `foreground`, where Charcoal Black `#242525` is the brand value
- `#CBCED4` — shadcn's default `border`
- `#D4183D` — shadcn's default `destructive`

That last one matters: **`#D4183D` is the alert/error colour, where the brand's is Bold Red
`#C73124`.** Bold Red appears nowhere in the build. An assessment tool has validation and
error states, so the one place §2.3 explicitly assigns Bold Red is exactly where an
off-brand red is being used.

## Other notes

- **Poppins weight 300 (Light) is loaded** but is not a brand weight — the documented scale
  uses Regular 400, Medium 500, SemiBold 600 and Bold 700 only.
- **The tool is published on `fun-tested-13948191.figma.site`**, an auto-generated Figma
  Sites domain with no Imagine Cities branding in the URL. Fine for a prototype; worth
  moving to an IC domain before it is shared with residents or funders.

## What to do with this

The build is close enough to brand that the gap is fixable rather than fundamental. The
highest-value change is to drive its colours from `tokens/tokens.json` instead of a
hand-maintained theme — that alone resolves the parallel tint ramps, the shadcn leakage,
and the wrong error red in one pass.

Its components (assessment flow, question steps, results) are the closest thing Imagine
Cities has to a component library. If a component library is ever documented at brand
level, this is the natural starting point — but the specs would have to be authored into
the guidelines, not reverse-engineered from this CSS.
