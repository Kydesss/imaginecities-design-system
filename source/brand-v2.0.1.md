# Imagine Cities — Brand Guidelines v2.0.1 (Oct 2024)

**This is the single source of truth for the design system.** Every token/value below is
transcribed from the official Google Slides deck. Do NOT mix in the 2021 "Design
Guidelines.pdf" (Montserrat + Azure/Viridian/Turquoise/Aqua palette) — it is superseded.

- Source: Google Slides "Imagine Cities Brand Guidelines"
  (id `1c0F9BWUlD3Jozm-dHOAv-diGGWcH5wueKYUQxyc7ISI`)
- Version 2.0.1 | October 2024 | www.imaginecities.ca
- About: "We are a nonprofit that provides residents with the resources to learn, plan,
  and gather resources to build a more abundant future."
- Tagline: "Great cities are the result of fostering thriving neighbourhoods."

---

## 1. Brand Logo

- Logo features the **Calgary Tower against a backdrop of light beams**. Symbolizes a
  future where cities thrive through the collective actions of neighbourhoods.
- **Primary Logo** and **Secondary Logo** variants exist.
- Assets in Drive `Design Assets/` — subfolders: `ImagineCities Logos`,
  `Outside The Box Logos`; marks `city_diamond_large.png/.jpg`.

### Logo usage — do NOT:
- rearrange
- change the colour or font
- distort
- add any patterns or effects
- rotate
- alter size or proportion
- Respect the defined **logo safe space** (clear space marked "C" around the logo).

---

## 2. Brand Colours

Hero colour is **Gold**. "Our colour palette is carefully crafted for both accessibility
and seamless compatibility."

| Name | Hex | RGB | CMYK |
|---|---|---|---|
| **Gold** (hero) | `#FFB827` | 255 184 39 | 0 28 85 0 |
| **Deep Azure** | `#0656BF` | 6 86 191 | 97 55 0 25 |
| **Serene White** | `#F5F7F2` | 245 247 242 | 1 0 2 3 |
| **Charcoal Black** | `#242525` | 36 37 37 | 3 0 0 85 |
| **Forest Green** | `#527302` | 82 115 2 | 29 0 98 55 |
| **Fresh Green** | `#C6FDC2` | 198 253 194 | 22 0 23 1 |
| **Bold Red** | `#C73124` | 199 49 36 | 0 75 82 22 |

### 2.2 Tints
"This chart shows which tints we'd recommend for each colour in our palette as well as the
corresponding font colour pairings."

Tint stops **100 / 80 / 60 / 40 / 20%** documented for exactly four colours: **Deep Azure,
Gold, Forest Green, Bold Red**. Serene White, Charcoal Black and Fresh Green are shown as
solids, with no tint ramp.

**Font colour per tint** — each cell of the chart sets its own label in the font colour
recommended for that tint (read from the 2.2 slide image, Joaquin, 2026-08-15):

| Tint | Deep Azure | Gold | Forest Green | Bold Red |
|---|---|---|---|---|
| 100% | Serene White | Charcoal Black | Serene White | Serene White |
| 80% | Serene White | Charcoal Black | Serene White | Serene White |
| 60% | Serene White | Charcoal Black | Charcoal Black | Serene White |
| 40% | Charcoal Black | Charcoal Black | Charcoal Black | Charcoal Black |
| 20% | Charcoal Black | Charcoal Black | Charcoal Black | Charcoal Black |

The pattern: Gold takes Charcoal Black at every stop; Deep Azure and Bold Red switch from
Serene White to Charcoal Black between 60% and 40%; Forest Green switches one stop earlier,
between 80% and 60%.

**Tint hex values are still NOT recorded.** The chart is a raster image, and reading swatch
colours off it by eye is guesswork. A linear mix of the base colour with white would
reproduce something close, but that is a hypothesis about how the deck was built, not a
transcription — the tints may have been mixed against Serene White `#F5F7F2`, or picked by
hand. Sample the swatches from the source file before recording any hex.

### 2.3 Colour Usage
- **Primary:** Gold for call-to-action buttons, key icons, standout elements. Deep Azure
  ("Azure Blue") for headers, links, secondary elements. Charcoal Black for text; Serene
  White for backgrounds.
- **Secondary:** 20% tints (gold, azure, forest green) for section backgrounds to signify
  important components.
- **Accent:** for minor highlights or notifications.
- **Bold Red:** use *sparingly* for alerts, warnings, or emphasizing specific areas.

### 2.4 Accessibility
"These are the font colour pairings that are accessible for online use."

Pairings are classified **Fully compliant / Large-or-Bold text only / Not compliant for
texts**. Large-or-bold threshold = **minimum 14pt bold or 18pt regular text**.

The slide shows each pairing twice, once in each direction (text-on-background and its
inverse). Contrast is symmetric, so the classification belongs to the unordered *pair* —
the tables below list each pair once. Transcribed from the 2.4 slide image
(Joaquin, 2026-08-15). Ratios are computed from the hexes above per WCAG 2.1, and are
shown only as a cross-check — the deck's classification governs.

**Fully compliant** (every pair pairs with Charcoal Black):
| Pair | Ratio |
|---|---|
| Gold + Charcoal Black | 8.88 |
| Serene White + Charcoal Black | 14.25 |
| Fresh Green + Charcoal Black | 13.34 |

**Large/Bold text only** (min 14pt bold or 18pt regular):
| Pair | Ratio |
|---|---|
| Deep Azure + Fresh Green | 5.90 |
| Serene White + Deep Azure | 6.30 |
| Fresh Green + Bold Red | 4.68 |
| Serene White + Bold Red | 5.00 |
| Fresh Green + Forest Green | 4.78 |
| Serene White + Forest Green | 5.11 |

**Not compliant for texts:**
| Pair | Ratio |
|---|---|
| Deep Azure + Forest Green | 1.23 |
| Bold Red + Deep Azure | 1.26 |
| Gold + Fresh Green | 1.50 |
| Forest Green + Bold Red | 1.02 |

Note: the deck is **stricter than WCAG AA**. Every "Large/Bold only" pair above actually
clears 4.5:1 and would pass AA for normal text; the deck's "Fully compliant" band starts
at 7:1, i.e. WCAG AAA for normal text. Follow the deck, not the looser AA line.

Pairs not shown on the slide are undocumented — they are neither approved nor forbidden
here. Do not infer a classification for them.

---

## 3. Typography

- **Brand font: Poppins** (contemporary sans serif). Glyphs shown A–Z, a–z, 0–9, symbols.
- **System font: Roboto** — used where Poppins is unavailable (weights: Black, Bold,
  Medium, Regular). "Roboto offers a similar modern and clean aesthetic to Poppins."
- **Rules:** do NOT underline, do NOT type in ALL CAPS. Headings use **title case** and
  centre- or left-alignment. Body copy is **left-aligned**; **avoid hyphenation**.

### 3.2 Font System — type scale
> Note: the deck lists specs and Aa style-labels side by side, so an initial pass mapped
> them by reading order and got Set 1 wrong. **Both sets below are now confirmed against
> the slide images** (Joaquin, 2026-08-15).
>
> Set 1 corrections: Subtitle is the 48px style, Headline is the 20px/24% style, and
> Subheadline is the 20px/120% style — Headline and Subheadline are both smaller than
> Subtitle. Set 2 needed no corrections.

**Set 1 (headings)** — confirmed from the slide image:
| Style | Weight | Size | Line height | Letter spacing |
|---|---|---|---|---|
| Title - Display | SemiBold | 72px | 120% | -3% |
| Title Page | Bold | 48px | 120% | -2% |
| Subtitle | SemiBold | 48px | 120% | -2% |
| Headline | Regular | 20px | 24% (verify — renders 4.8px) | -2% |
| Subheadline | SemiBold | 20px | 120% | 0% |

**Set 2 (body / UI)** — confirmed from the slide image:
| Style | Weight | Size | Line height | Letter spacing |
|---|---|---|---|---|
| Paragraph 1 | Regular | 16px | 140% | 0% |
| Paragraph 1 Bold | SemiBold | 16px | Auto | 0% |
| Paragraph Small | Regular | 14px | 140% | 0% |
| Paragraph Small Bold | SemiBold | 14px | 140% | 0% |
| Button Text | Medium | 16px | 150% | 0% |
| Tag | Medium | 14px | Auto | 0% |
| Label | Bold | 11px | Auto | 0% |

### 3.4 Font Usage
- **Poppins for:** printed materials (brochures, thought leadership, event materials);
  hard-copy client deliverables (reports, proposals); PDFs of Word/other docs emailed
  (save as locked PDFs); **website copy**.
- **Roboto for:** any client deliverable that cannot be saved as PDF and is emailed only;
  all other instances where Poppins is unavailable.

---

## 4. Visual & Graphic Elements

### 4.1 Holding Shapes
Backbone of layouts. Shapes are **Circles** and **Rounded Rectangles**. Uses: as text
holders, as image holders, and to **mask images**.

### 4.2 Iconography
**Google Material Symbols and Icons**, **outlined** style with standard stylistic axes.
Icon colours: **Charcoal Black, Serene White, Deep Azure**. Source: Material Symbols and
Icons — Google Fonts.

### 4.3 Imagery
Images must reflect **diversity** — communication and collaboration between individuals of
all ages and backgrounds. A **black-and-white filter or colour overlay** with tints at the
recommended percentages (see Tints) may be applied for visual effect.

---

## Provenance / exclusions
- Built from v2.0.1 Slides only.
- EXCLUDED: `Design Guidelines.pdf` (2021, superseded); `Usernames & Passwords` doc
  (live plaintext credentials — never ingest; advise Ron to move to a password manager).
