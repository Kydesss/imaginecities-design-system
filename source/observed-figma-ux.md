# Observed: "Brand Guidelines UX" Figma file (audit 2026-11-08)

> **DESCRIPTIVE, not NORMATIVE.** Same rule as `observed-website.md`: this records what a
> design file currently says. It is the website team's UX file, not the brand deck. Brand
> Guidelines v2.0.1 is the only authority, and nothing here may be promoted into
> `tokens/tokens.json`. Where this file and the deck disagree, **the deck wins** and the
> Figma file is the thing that needs fixing.
>
> Captured through the Figma MCP server from
> `https://www.figma.com/design/5Owkm20LEMhScjJIuuJXAZ/Brand-Guidelines-UX`, page
> "Prototype" (`2321:890`), on 2026-11-08. Values come from two places, which do not always
> agree: the **text labels** drawn on the canvas, and the **Figma variables** (saved styles)
> that designs actually bind to. Where they differ, both are recorded.

## Scope

Only the **Design System Information** section (`4498:8114`) and the separate **Spacing**
section (`3096:10194`) were audited. The page also holds Final designs, WEBSITE (the
numbered 1.0–9.0 prototype flow), Components, LOGIN – WIREFRAMES and Login and Profile –
Prototype. Those were **not** audited. Fills in those frames that are not bound to a
variable could still carry off-palette colours.

## Summary

The base palette and the desktop type labels are v2.0.1 exactly. Three values disagree
with the deck: the `Desktop/Subtitle` variable and two tint swatches. The file is also the
first written source found for spacing, radius, shadows and a mobile type scale, all of
which the deck leaves undocumented.

## What it gets right

- **All seven brand colours are exact**, as labelled swatches and as variables:
  Gold `#FFB827`, Deep Azure `#0656BF`, Serene White `#F5F7F2`, Charcoal Black `#242525`,
  Forest Green `#527302`, Fresh Green `#C6FDC2`, Bold Red `#C73124`.
- **Gold 20% swatch `#F7EAC9`** matches `color.tint.gold.20`.
- **Every font is Poppins.** No Montserrat, and no 2021-palette colours.
- **All 12 desktop type labels match v2.0.1 §3.2**, including the counter-intuitive
  values: Subtitle is SemiBold 48px, Headline is Regular 20px with a 24% line height. The
  `Desktop/Headline` variable stores line height `0.24`, so the Figma file carries the same
  defect as the deck. It confirms the printed value but does not resolve it.
- **Iconography** embeds deck slide 4.2 (Material Symbols, outlined) and adds sizing:
  **24px desktop, 20px mobile**.

## Disagreements with v2.0.1

| Item | Figma | v2.0.1 / token | Notes |
|---|---|---|---|
| `Desktop/Subtitle` variable | SemiBold **32px**, line height 120%, letter spacing **0%** | SemiBold **48px**, 120%, **−2%** (`typography.subtitle`) | The canvas label beside it says 48px / −2%, so the file contradicts itself. The **Link** component (`4498:8341`) binds this variable, so anything built from the variable renders Subtitle at 32px. The most consequential finding. |
| Forest Green 20% swatch | `#D6DEC5` | `#D4DCC1` (`color.tint.forest-green.20`) | Close, not exact. Not the same as the live site's `#D4DDC2` either. |
| Deep Azure 20% swatch | `#C9DAF1` | `#C5D6E7` (`color.tint.deep-azure.20`) | Close, not exact. **This is where the live site's off-palette `#C9DAF1` background comes from** (see `observed-website.md`, item 6). |
| `Primary Colours/Cobalt` `#006AC3`, `Secondary/Cobalt Tint` `#BFDAF0` | Variables used only on the two demo shapes in the Radius frame (`4498:8366`) | Not in the palette | Likely imported from another library. Not brand colours. |
| `var(--sds-size-space-600)` = 24 | Variable name from Figma's Simple Design System | n/a | Another sign of an imported library. Value agrees with the 24 step below. |

## Only in Figma (the deck documents none of this)

### Spacing scale (`3096:10194`)

| Label | Value |
|---|---|
| ex small | 4 |
| ex small | 8 |
| ex small | 16 |
| small | 24 |
| Medium | 48 |
| Large | 64 |
| Ex. Large | 80 |
| Ex. Large | 120 |

The labels are inconsistent: three steps are all "ex small" and two are "Ex. Large".

### Spacing rules (Spacing frame, `4498:8328`)

| Gap | Desktop | Mobile |
|---|---|---|
| Between page sections | 80 (5rem) | 40 (2.5rem) |
| Between content | 64 (4rem) | 32 (2rem) |
| Between buttons | 24 (1.5rem) | 20 (1.25rem) |
| Column gap, image and content | 24 (1.5rem) | 16 (1rem) |
| Between headings | 16 (1rem) | 16 (1rem) |
| Between subheading and text | 16 (1rem) | not stated |

The mobile values **40, 32 and 20 are not steps on the scale above**.

### Radius (`4498:8366`)

- **Radius Medium: 8px** (variables `Radius M` and `Radius/md`).
- **Radius Extra Large: 360px** (variable `Radius/3xl`), giving pill shapes. The canvas
  label reads "360px".

The live site uses `8px` and pill CTAs (`50px`, `2em`), so the site loosely follows these.

### Shadows

| Variable | Value |
|---|---|
| `ds2` | drop shadow, `#2425251F` (Charcoal Black at about 12%), offset 0 4, blur 24, spread 0 |
| `ds3` | drop shadow, `#2425253D` (Charcoal Black at about 24%), offset 0 4, blur 24, spread 0 |

### Mobile type scale (Mobile Fonts, `4498:8115`)

Five of the seven styles disagree between label and variable. **Do not use this scale until
the file is reconciled.**

| Style | Canvas label | Variable |
|---|---|---|
| Heading 1 | SemiBold 24px, LH 110%, LS 0% | SemiBold 24px, LH 110%, LS 0% |
| Heading 2 | **Bold** 22px, LH 150%, LS 0% | **SemiBold** 22px, LH 150%, LS 0% |
| Subheading | **SemiBold** 16px, LH 150%, LS 0% | **Bold** 16px, LH 150%, LS 0% |
| Paragraph 1 | **Regular** 14px, LH 150%, LS 2% | **Light (300)** 14px, LH 150%, LS 2% |
| Paragraph 2 | **SemiBold** 12px, LH 150%, LS 2% | **Medium** 12px, LH 150%, LS 2% |
| Button Text | **Regular** 14px, LH 150%, LS 4% | **Medium** 14px, LH 150%, LS 4% |
| Tag | Medium 11px, LH Auto, LS 4% | Medium 11px, LH auto, LS 4% |

There is also a stray `Tablet/Heading 2` variable: SemiBold 32px, LH 110%, LS 0%. No other
tablet styles exist.

### Component states (Buttons `4498:8179`, Input Field `4498:8283`, Link `4498:8341`)

- **Primary** (pill, Gold or Charcoal fill), **Secondary** (pill, outline or Charcoal fill)
  and **Tertiary** (text link) buttons, each in Regular and Hover, desktop and mobile, with
  and without a trailing external-link icon. Buttons bind `Desktop/Button Text` (matches
  v2.0.1) and `Mobile/Button Text` (14px Medium, LS 4%).
- **Digital Tools buttons**: rectangular, 8px radius, in a light-blue, Deep Azure, outline
  and Charcoal set. The light-blue fill is **not bound to a variable**, so its exact value
  was not captured.
- **Input field**: Default, Success, Focus, Error (binds Forest Green, Deep Azure, Bold Red,
  Charcoal Black).
- **Search bar**: Default, Focus.

## What this means

- **Fix in Figma, not in tokens:** the `Desktop/Subtitle` variable (to 48px / −2%), and the
  Forest Green and Deep Azure 20% swatches (to `#D4DCC1` and `#C5D6E7`). Fixing the Deep
  Azure swatch should be followed by fixing the live site's `#C9DAF1`.
- **Spacing, radius, shadows and component states** are the website team's decisions,
  recorded in a design file. They are the best written candidate found for the gaps
  `CLAUDE.md` describes, but they are not brand values. Adopting them as tokens is a
  decision for the brand owner, and any such tokens should be labelled as website-level,
  sourced from this file.
- **The mobile type scale** cannot be adopted in any form until its labels and variables
  agree.
