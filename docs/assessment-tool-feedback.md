# Assessment tool — design review

Review of the Neighbourhood Adaptability Assessment intro page, August 2026.

Design review by Joaquin (UI/UX). Contrast ratios, colour counts and code references were
measured from the published build on 2026-08-15 and are reproducible.

**The short version:** the tool works and its assessment logic is sound. The intro page is
what needs attention. It reads as generic, it does not look like Imagine Cities, and a
handful of text colours are unreadable. Most of this is cheap to fix, and none of it
requires rebuilding the tool.

---

## The three that matter most

### 1. Text that cannot be read

Some text is set in colours too light to see against the near-white background. Measured
against the brand's Serene White, where the accessibility floor is 4.5:1 for normal text
and 3:1 for large text:

| Colour | Where | Ratio | Verdict |
|---|---|---|---|
| Fresh Green `#C6FDC2` | 2 places | **1.07:1** | effectively invisible |
| Gold `#FFB827` | 3 places | **1.60:1** | fails |
| `#9CA89A` | 4 places | **2.30:1** | fails |
| `#9E6A00` | 7 places | **4.31:1** | large text only |

Fresh Green and Gold are real brand colours, but they are **background** colours. The brand
guidelines are explicit: the only pairings safe for text at any size all involve Charcoal
Black. Gold and Fresh Green are surfaces to put dark text *on*, not colours to write *in*.

This matters commercially, not just aesthetically. Provincial and municipal buyers commonly
require WCAG 2.1 AA compliance in contracts, so unreadable text is a procurement risk.

**Fix:** any text currently in Gold, Fresh Green, or the two grey-greens becomes Charcoal
Black. Roughly 16 instances.

### 2. It doesn't look like Imagine Cities

- **No logo anywhere.** The header reads "Imagine Cities Neighbourhood Tools" as plain
  text. The tool has no visual connection to the organization.
- **The main call to action is Azure Blue.** The guidelines assign Gold to calls to action
  and Azure to headers, links and secondary elements. This is backwards, and it also breaks
  consistency with the main website, where CTAs are Gold pills that invert to Charcoal on
  hover. The tool's button has no hover treatment at all.
- **The most-used text colour in the product is not a brand colour.** `#5A6350` appears 63
  times, more than any other. It is readable, but it is not in the palette. Charcoal Black
  is.
- **Decorative blurred circles.** The build uses `blur-3xl` and `blur-2xl` shapes to
  suggest a soft gradient wash. This is the default look of AI-generated layouts and it
  appears nowhere in Imagine Cities' brand or on the main website.

**Fix:** logo in the header, Gold CTA with the inverting hover the main site already uses,
Charcoal for body text, delete the blurred shapes.

### 3. The hero asks too much of a reader who has ten seconds

Current opening copy runs to two full paragraphs beginning "In a fast changing world..."
before the reader learns what the tool does or whether it is for them.

Most visitors decide in seconds. The hero needs a hook and a clear ask, not a thesis.
Something closer in shape to: *"Problems in your neighbourhood? Take this assessment to
find out where things stand."* The exact wording needs work, but the structure is the
point: a question the reader recognizes, then one line on what they get.

The same page also repeats itself. "100% free to use", "5 stage framework", "takes about 5
minutes" and "5 adaptability factors" all appear as separate promotional items, several
restating each other. One compact line under the button covers it.

**Fix:** cut the hero to a hook plus one supporting line, and collapse the repeated
badges into a single line of meta.

---

## Everything else

### Header and navigation

- No logo (see above).
- "Neighbourhood Adaptability Assessment" appears in both the header and the hero,
  immediately below itself.
- No navigation. If this is going to live inside the main website, it needs a way back out
  and a way across to the rest of the site.

### What You'll Get section

- **Two headings that are nearly identical:** "Understand your neighbourhood's capacity
  today." and "Understand your neighbourhood's capacity to adapt today." Confirmed in the
  build. One should go.
- **Adaptability to what?** The page repeatedly promises insight into "capacity" and
  "adaptability" without ever naming what a neighbourhood is adapting *to*. Naming two or
  three concrete pressures would ground the abstraction.
- **Inconsistent vocabulary.** The page uses "dimensions", "factors" and "stages" for what
  appear to be two underlying concepts. Counted in the build: "stages" 29 times, "factors"
  12 times, "dimensions" **once**. That single "dimensions" is a slip and should become
  "factors". Then the page needs one plain sentence distinguishing the two, because they
  are genuinely different things: five **factors** are what gets assessed, five **stages**
  are the possible results.
- **The persuasion line is weak.** "This assessment is built for anyone who cares about the
  future of their neighbourhood, not just professionals or experts." It defends against an
  objection the reader has not made yet.

### The framework is unexplained

The tool is built on the Harwood Institute's Community Rhythms framework, and the five
stage names come from it. Words like "Impasse" and "Catalytic" carry precise meaning inside
that framework and very little outside it. A reader who has not encountered Harwood will
not know whether a result is good news.

Each stage does have a plain-language subtitle, which helps. What is missing is one
sentence up front explaining that this is a spectrum neighbourhoods move along over time,
not a grade.

### It isn't local

The copy could describe any neighbourhood in any country. Imagine Cities is a Calgary
organization whose early focus is Calgary communities, and the people it is asking to
spend five minutes are Calgarians. Naming the city, and showing real neighbourhoods,
would do more for credibility than another round of abstract copy.

The main website is warmer and more personal than this tool. The tool should sound like the
same organization.

### Visuals

The page is almost entirely text and coloured shapes. Imagery of actual neighbourhoods and
people would frame the problem faster than any paragraph, and the brand guidelines already
call for imagery showing collaboration between people of all ages and backgrounds. There is
a photo library in the shared Drive that is currently unused here.

---

## What this would take

Ordered by value against effort. None of it requires rebuilding the assessment itself.

| Change | Effort |
|---|---|
| Text colours to Charcoal Black (~16 instances) | small |
| Gold CTA with inverting hover | small |
| Logo in header | small |
| Delete blurred decorative shapes | small |
| Fix "dimensions" and the duplicate headings | small |
| Collapse repeated badges into one meta line | small |
| Rewrite the hero to a hook | medium, needs a copy decision |
| One sentence explaining factors vs stages, and the spectrum | medium |
| Add imagery and local framing | medium, needs photo selection |
| Navigation for integration into the main site | larger, depends on the site plan |

A worked example of the first six, built from the design system, is in
`examples/assessment-intro.html`.

---

## Not covered here

This review is the intro page only. Separate documents cover the rest:

- `docs/assessment-tool-punchlist.md` — the full work queue, including the email gate,
  accessibility of the question and result screens, and the flow's emotional arc.
- `source/observed-assessment-tool.md` — the technical colour and font audit.

Two items in the punch list are worth Ron's attention specifically, because they are
decisions rather than tasks: the email gate in front of the result, and two errors in the
brand guidelines themselves that need his ruling.
