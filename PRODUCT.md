# PRODUCT.md

Context for design tooling. Audience, tone and strategic principles live here; **visual
values do not.** Colours, type and tints are defined once in `tokens/tokens.json` and
documented in `dsds/imagine-cities.dsds.json`. Never restate a hex or type value in this
file — a second copy is a second source of truth, and this repo exists to prevent that.

register: product

## Product purpose

Imagine Cities is a Calgary nonprofit. It positions itself as a **capability builder**:
helping people in neighbourhoods build skills while improving their neighbourhoods, at the
same time. Four products — educational courses, problem-solving hackathons, neighbourhood
assessments, and membership — under a LEARN · SOLVE · GROW framework.

The surface currently in focus is the **Neighbourhood Adaptability Assessment**, a
five-question self-assessment that places a neighbourhood in one of five stages and returns
plain-language next steps. It is product 3 of 4, and the one institutional buyers use to
justify spend. Scoring logic is deliberately hidden from users.

## Users

Three readers, often on the same page:

- **Primary buyers — provincial government and municipalities.** Procurement budgets,
  need measurable outcomes. WCAG 2.1 AA is routinely a contract condition.
- **Secondary buyers — foundations and non-profits.** Need to know their investments are
  aimed at real problems and are having impact.
- **End users — community practitioners, community association staff, neighbourhood
  leaders, volunteers.** Described in the strategy as cash-poor but the actual unit of
  change. Not design-literate, not necessarily desk-based, often doing this unpaid in the
  evening.

Design consequence: institutional credibility and community warmth have to coexist. A page
that reads as a government form loses the volunteer; a page that reads as a campaign
microsite loses the procurement officer.

## Tone

Plain language, Canadian spelling. Title case headings, left-aligned body. Encouraging
without being saccharine — the assessment tells some neighbourhoods they are in a
"Waiting Place," and that has to land as a starting point, not a verdict. The tool's own
line is the standard to hold: "This result is a reflection, not a verdict."

Never ALL CAPS. Never underline for emphasis. Both are documented brand rules.

## Anti-references

- **Government form.** Dense, unexplained, bureaucratic. Loses the volunteer audience.
- **SaaS dashboard.** Hero metrics, stat tiles, gradient accents. Wrong register entirely —
  and the assessment deliberately shows no scores.
- **Quiz / BuzzFeed personality test.** Playful scoring, shareable badges. Undermines the
  credibility funders are buying.
- **Consultancy report.** Impressive, unreadable, PDF-shaped.

## Strategic principles

1. **The result is the product.** Everything before it is a means to it. Anything that
   delays or taxes the result had better earn its place.
2. **Diagnosis without judgement.** Five stages, no score. The lowest stage must feel like
   a beginning.
3. **Leave capacity behind.** The organization's stated durability claim. Interfaces should
   send people away able to act, not dependent on the tool.
4. **The brand is fixed; the components are not.** v2.0.1 governs colour, type and logo.
   Spacing, radii and component states are undocumented — decide them explicitly and get
   them approved rather than inventing them silently.

## Sources

- `source/brand-v2.0.1.md` — brand, authoritative for visual values
- `source/strategy-2026-03.md` — audiences, products, positioning
- `source/strategy-2026-11.md` — website redesign messaging: narrative, hero line, About text
- `source/observed-assessment-tool.md` — what the tool's code does today
- `docs/assessment-tool-punchlist.md` — the work queue
