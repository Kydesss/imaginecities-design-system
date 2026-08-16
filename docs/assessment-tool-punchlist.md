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

The **UX critique** section adds flow and emotional-journey findings from an
`/impeccable critique` pass, with its own method caveats.

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

## UX critique — emotional journey and flow

From an `/impeccable critique` pass. Method notes are at the end of this section: parts of
the standard method could not run here, and the scores are weakened accordingly.

**Nielsen heuristics: 26/40.** Solid, not yet excellent.

| Heuristic | Score | Note |
|---|---|---|
| Visibility of system status | 3 | `Step 1 of 6`, `Your result is being prepared`, `Select an answer to continue` all present |
| Match with the real world | 3 | Plain language is strong; `Impasse` and `Catalytic` are Harwood jargon, but each carries a plain subtitle |
| User control and freedom | 3 | `Back` and a skippable context step exist; no retake or start-over |
| Consistency and standards | 2 | Internally consistent but breaks the brand's ALL CAPS rule, and mixes shadcn defaults with the palette — two different reds in one product |
| Error prevention | 3 | Empty answers are blocked; email validation unverified |
| Recognition over recall | 3 | Questions are self-contained; `About this factor` and `All five factors` are available |
| Flexibility and efficiency | 2 | No save/resume, no retake |
| Aesthetic and minimalist design | 2 | Caps eyebrows add noise; internal handoff frames ship publicly; not visually verified |
| Error recovery | 2 | Wrong error colour; association with fields unverified |
| Help and documentation | 3 | `About this factor`, framework attribution, `Using this with a team?` |

**Cognitive load: low — 0 confirmed failures of 8.** This is the tool's real strength and
should be protected during finishing. One factor per step, three options per question,
questions independent of each other, detail on demand rather than up front. Two items
(visual grouping, hierarchy) could not be checked without rendering.

### 4. The email gate breaks the peak-end rule ⚠ high value

Beyond the CASL problem in P0.1, the gate is in the worst possible *place*. The emotional
peak of this product is the result reveal — the single moment the user came for. The gate
sits immediately before it, taxing maximum anticipation. People remember the peak and the
ending; this design puts friction exactly on the peak.

Moving the email capture to *after* the result fixes the legal exposure and the emotional
arc in the same edit.

- [ ] Move email capture after the result reveal

### 5. Reassurance arrives after the judgement ⚠ VERIFY order

The tool has an excellent line — *"This result is a reflection, not a verdict"* — but in
the shipped string order it appears around the feedback step, after the user has absorbed
the stage and been asked to rate it.

The deepest emotional valley is a neighbourhood told it is in the **Waiting Place**, where
residents "feel powerless." That reassurance belongs beside the stage reveal, not two
screens later.

- [ ] Confirm where the line renders; move it adjacent to the stage reveal
- [ ] Check the Waiting Place result reads as a starting point, not a diagnosis of failure

### 6. The accuracy check asks for labour before delivering the payoff

`ACCURACY CHECK` sits between the result and the next steps. The user is asked to evaluate
the tool before receiving the practical advice they came for. Reversing the order — next
steps first, feedback after — asks for help once the value has landed, which is also when
feedback quality is highest.

The scale itself is well built: `Not accurate` / `Somewhat accurate` / `Very accurate` is
balanced, with a free-text follow-up. No change needed there.

- [ ] Move the accuracy check after the next-steps screen

### 7. The experience ends on a citation

The flow summary ends with `Source acknowledgement`. Endings are remembered
disproportionately, and this one closes on attribution — necessary, but not an ending.
`Share with your network` and `Using this with a team?` are the natural closers; the
citation belongs as a footer, not a final step.

- [ ] End on next steps and a forward action; demote the acknowledgement to a footer

### 8. Smaller findings

- [ ] `backdrop-filter` appears 4 times — glassmorphism should be rare and purposeful, or
      removed. Verify what it is applied to.
- [ ] The ALL CAPS in P0.2 is **authored into the copy strings**, not a CSS
      `text-transform` (only one such rule exists). It is a content pass across many
      strings, not a one-line fix — budget accordingly.
- [ ] Consider a retake or start-over affordance. Neighbourhood conditions change, and the
      strategy expects repeat engagement through membership.

### What's working — protect these

- **Cognitive load discipline.** One decision at a time, three options, five minutes. Do
  not let "finishing" add density.
- **Plain-language stage writing.** Each stage has a description, a cause, and a focus.
  This is the hardest part of the product and it is already good.
- **Honest feedback design.** A balanced accuracy scale with a negative option, and candid
  framing on why optional data is collected.
- **No AI-slop tells in the CSS.** Zero gradients, no gradient text, no side-stripe
  borders. The build reads as component-library default rather than generic AI output —
  the fix for that is the token wiring in P1.1, not a redesign.

### Method notes — what could not run

The standard critique runs two isolated assessments and a browser overlay. Here:

- **No browser pass.** The live URL is blocked by policy in this environment, so nothing
  was visually verified. Every judgement above comes from shipped copy, flow structure and
  CSS. Visual hierarchy, spacing, balance and the rendered emotional tone are **unassessed**.
- **No automated detector run.** The bundled CLI needs markup files or Puppeteer against a
  URL; neither was available. Deterministic checks were run directly against the shipped
  CSS instead, which covers the colour and slop tells but not layout-level patterns.
- **Not independently isolated.** The method calls for two separate assessments that cannot
  see each other, specifically so the scores do not anchor to one another. Both were done
  in one pass here, so treat the heuristic scores as indicative rather than calibrated.

The right next step is to re-run this against the live UI once it can be opened — that
closes the visual gap and the six ⚠ VERIFY items in one sitting.

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
- [ ] **The five factors are attributed to the wrong source.** Checked against the 1999
      Community Rhythms report: it assesses **nine** factors it calls Public Capital
      (p. 34). Of our five, only **Leadership** appears in it; **Collaboration** and
      **Resilience** appear nowhere in the document. Copy must present the *stages* as
      Harwood's and the *factors* as Imagine Cities' own. Promote to P1 if any public copy
      currently calls them the framework's factors.
- [ ] **Impasse must not read as bad news.** The report states a Waiting Place community
      *must* move into some form of Impasse (p. 6), so it is a step forward. To a reader it
      sounds like the worst outcome. Highest-risk misreading in the product; design the
      result screen against it.
- [ ] **Drop any scorecard framing.** The report calls the Index a *touchstone*, not a
      scorecard (p. 12). No progress bars, levels, tiers, or visuals implying a later stage
      is a better grade.
- [ ] **No quantitative claims.** The report contains no statistics of any kind — its
      method was interviews and workshops across five US communities, 1996–1999 (p. 9).
      Never "studies show", "X% fail", "proven", or "evidence-based".
- [ ] **Harwood permission and attribution.** ©1999, and the terminology is trademarked
      (Stages of Community Life™, Public Capital™, Centers of Strength™). Confirm
      permission for a product sold to government. Also avoid calling this "the Harwood
      assessment": the report contains no questionnaire, and its stage placements came from
      researcher fieldwork, not self-assessment. A contract-risk question for Ron, not one
      design settles.
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
