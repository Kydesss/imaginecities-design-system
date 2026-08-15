# Punch list — Neighbourhood Adaptability Assessment

Design work to finish before the assessment tool ships. Ordered by (impact × urgency) ÷ cost.

**Scope:** the tool at `fun-tested-13948191.figma.site` only. Not the main website, not a
component library, not a redesign of the assessment flow — five questions, three options,
five minutes is sound and should be left alone.

**How this was compiled:** static audit of the published CSS (102KB) and component bundle
on 2026-08-15 — see `source/observed-assessment-tool.md`. The live UI could not be opened
from this environment, so **items marked ⚠ VERIFY need confirming by clicking through**.
Everything else is quoted from shipped code and is factual.

**Citations** point at `source/brand-v2.0.1.md` (the brand deck) or `tokens/tokens.json`.
Brand violations below are documented `must` / `must-not` rules, not preferences.

---

## P0 — decide and fix before launch

### 1. The email gate ⚠ needs a stakeholder decision, not a design fix

The result is gated: the flow summary says **"Required before result"**, and the screen
reads *"Enter your email to view your result"* with *"We'll also send you related resources
from Imagine Cities."*

Three problems converge:

- **CASL.** Canadian anti-spam law requires express consent for commercial electronic
  messages. Making marketing consent the price of a result the tool has already computed is
  bundled consent. IC sells to municipalities and foundations, where a complaint does
  outsized reputational damage.
- **Audience fit.** The March 2026 strategy names community practitioners and CA leaders as
  end users — "cash poor but the unit of change." A hard gate taxes precisely the people the
  mission exists to serve.
- **Trust.** Scoring is deliberately hidden ("No scores, totals, or calculation details are
  shown to the user at any point"). Hidden logic plus a mandatory email reads as extractive.

**Recommendation:** show the result, then offer an emailed copy, with a separate and
unticked marketing opt-in. Expect *more* addresses, given willingly.

- [ ] Raise with Ron — this changes the build, so it goes first
- [ ] If gate is kept, at minimum unbundle marketing consent from result delivery

### 2. ALL CAPS throughout the UI — documented brand violation

v2.0.1 §3: **"do NOT type in ALL CAPS."** A `must-not`. The tool uses caps as its standard
eyebrow/label pattern in 20+ places, including:

`ACCURACY CHECK` · `THE FIVE STAGES` · `THE FIVE FACTORS` · `WHAT YOU'LL GET` ·
`UNDERSTANDING YOUR RESULT` · `WHAT THIS ASSESSMENT LOOKS AT` · `WHY WE ASK` ·
`YOUR STAGE PROGRESSION` · `MAIN FOCUS` · `WHAT'S INCLUDED IN YOUR RESULT` ·
`WHERE THIS FITS IN THE FIVE-STAGE ADAPTABILITY FRAMEWORK` · `IMAGINE CITIES RESOURCES` ·
`NEIGHBOURHOOD TOOLS`

The replacement already exists in the system: **`typography.label`** — Bold 11px, letter
spacing 0 — which is the documented small-label style and needs no capitals. Sentence case
or title case per §3.

- [ ] Replace every ALL CAPS label with `typography.label` in sentence/title case
- [ ] Check the logo wordmark is untouched — it is artwork, not type (see the logo foundation)

### 3. Accessibility — this is a procurement requirement, not a nicety

Primary customers are provincial government and municipalities. WCAG 2.1 AA is routinely a
contract condition, so failures here block sales.

**Hard palette constraint from the 2.4 audit:** every fully compliant pairing involves
Charcoal Black. Small text in Deep Azure, Forest Green or Bold Red has **no** compliant
option at any size. Small UI text must be Charcoal Black.

Component-scoped checklist — the tool is a form, so this is most of its surface:

**Five factor questions (radio groups, A/B/C)**
- [ ] Real `<fieldset>` + `<legend>` per factor, or `role="radiogroup"` with `aria-labelledby`
- [ ] Arrow keys move between options; Tab enters/leaves the group (SC 2.1.1)
- [ ] Selection visible without relying on colour alone (SC 1.4.1) — check mark or border, not just fill
- [ ] Focus indicator visible on every option, 3:1 against its background (SC 2.4.11)
- [ ] Option label text is the clickable target, not just the control

**Text inputs (postal code, neighbourhood name, email)**
- [ ] Persistent visible `<label>` — not placeholder-as-label (SC 3.3.2)
- [ ] `autocomplete="postal-code"` / `"email"` (SC 1.3.5)
- [ ] `inputmode` and `type="email"` set correctly
- [ ] Optional fields marked optional in text, not only with styling

**Errors and validation** — the tool's core interaction
- [ ] Error text is programmatically associated with its field (SC 3.3.1)
- [ ] Errors announced via a live region, not colour change alone
- [ ] "Select an answer to continue" is not the only signal — verify it reaches AT ⚠ VERIFY
- [ ] Error colour is Bold Red `#C73124` (see P1.1), and error *text* on white is Charcoal

**Flow and results**
- [ ] Progress conveyed in text ("Question 3 of 5"), not only visually
- [ ] Each step change moves focus to the new heading; heading order is sequential ⚠ VERIFY
- [ ] Result stage is announced on arrival, not silently swapped in ⚠ VERIFY
- [ ] The five-stage progression graphic has a text equivalent (SC 1.1.1)
- [ ] Target sizes ≥ 24×24 CSS px (SC 2.5.8)
- [ ] Zoom to 200% without loss of content (SC 1.4.4); reflow at 320px (SC 1.4.10)
- [ ] Keyboard-only run of the entire flow, start to result ⚠ VERIFY
- [ ] Screen-reader pass (NVDA or VoiceOver) of one full run ⚠ VERIFY

---

## P1 — fix during finishing

### 1. Wire colours to the tokens

One pass resolves three defects at once. Details in `source/observed-assessment-tool.md`.

- [ ] **Error/alert colour → Bold Red `#C73124`.** The build uses `#D4183D`, which is
      shadcn/ui's stock `destructive`. §2.3 assigns alerts and warnings to Bold Red, and
      Bold Red appears nowhere in the build. This is the tool's most-used state.
- [ ] **Replace the parallel tint ramps with documented tints.** The build invented
      `#FFFAED` / `#FFF8E7` / `#FFF3D6` where Gold 20% `#F7EAC9` exists; `#E8EDE2` /
      `#EBF5DF` / `#D1D9C8` where Forest Green 20% `#D4DCC2` exists; `#EBF1FB` where Deep
      Azure 20% `#C5D6E7` exists. Not one documented tint is currently used.
- [ ] **Remove remaining shadcn defaults:** `#030213` (its `foreground`; use Charcoal Black
      `#242525`) and `#CBCED4` (its `border`).
- [ ] Drop Poppins weight 300 from the font load — not a brand weight (400/500/600/700 only)

### 2. Remove internal frames from the published build

These ship publicly today:

- [ ] `DEVELOPER HANDOFF NOTE` — "This frame is for the development team. It is not part of
      the user-facing assessment flow."
- [ ] `HOMEPAGE INTEGRATION RECOMMENDATION` and `SUGGESTED CTA CARD`
- [ ] `IMPLEMENTATION NOTES` / `ASSESSMENT FLOW SUMMARY`

---

## P2 — before it goes public

- [ ] **Canadian spelling.** Copy mixes `organisations` (in Factor 3 and the Growth stage
      text) with Canadian spelling elsewhere. Standardize to `-ize`; the brand and the deck
      use Canadian English throughout.
- [ ] **Harwood Institute attribution.** The tool says it is "informed by the Harwood
      Institute's Community Rhythms framework," and the five stages are theirs. Confirm the
      attribution is sufficient for a product sold to government — a contract-risk question
      to ask out loud, not to settle in design.
- [ ] **Move off `fun-tested-13948191.figma.site`.** An auto-generated URL with no IC
      branding is fine for a prototype, not for something shown to residents or funders.
- [ ] **Logo asset quality.** If the tool renders the logo: no vector artwork exists
      anywhere in the shared Drive, and the Secondary Logo is a 379×431 JPEG with a baked
      white background that cannot sit on a coloured surface.

---

## The durable piece

Nobody has documented **spacing, radii, or component states** — not the brand deck, and not
derivable from the main website (audited: twelve ad-hoc padding values, five radii).

Rather than inventing a system, extract the minimal set this tool actually needs, get the
brand owner to approve it, and write it back into the guidelines.

- [ ] Inventory the spacing steps, radii and states this tool genuinely uses
- [ ] Reduce to the smallest defensible set
- [ ] Get Ron's sign-off, so it becomes brand rather than one build's convention
- [ ] Add to `tokens/tokens.json` + the DSDS document, and `npm run validate`

That converts finishing one tool into the foundation for the website revamp and the other
three products.

---

## Known defects in the guidelines themselves

Not this tool's fault, but they will surface while building it. Both are recorded verbatim
and flagged rather than silently corrected — amending the deck is the brand owner's call.

- **Headline line height reads 24%** (renders 4.8px at 20px). Likely meant `24px` = 120%.
- **Deep Azure 60% `#6697D4` + Serene White is 2.80:1** — the 2.2 chart pairs them, but it
  fails every WCAG threshold. Use Charcoal Black (5.08:1) on that tint.
