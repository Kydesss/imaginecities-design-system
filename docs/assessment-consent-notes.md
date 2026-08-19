# Consent and privacy notes — Neighbourhood Adaptability Assessment

> Written 18 August 2026 against the PRD dated 9 May 2026 and the user testing notes.
>
> **This is a design record, not legal advice.** It exists so the questions get asked
> before the backend is built rather than after. Imagine Cities should confirm anything
> here with someone qualified before launch.

Two Canadian regimes apply, and they ask different things:

- **PIPEDA** governs *collecting* personal information. Consent has to be meaningful,
  the purpose has to be identified at or before collection, and collection has to be
  limited to what the identified purpose needs.
- **CASL** governs *sending* commercial electronic messages. It needs express consent,
  obtained separately, not as a condition of something else.

A postal code plus a neighbourhood name plus an email address is personal information
under PIPEDA. So is a set of assessment answers tied to any of them.

---

## 1. The partial-response capture request — do not build as written

PRD, User Journey item 7:

> Is there a way for us to capture the results and get an email in case the user does
> not complete the survey? Capture the responses provided up to a certain point.

**The intent is reasonable. The mechanism as described is not.** Two separate problems:

**Capturing answers from someone who did not finish.** A person who abandons the
assessment has not consented to anything. Storing what they entered up to that point is
collection without meaningful consent. Abandonment is closer to a withdrawal of consent
than to an omission.

**Emailing someone who did not finish.** If their address was collected for one purpose
and then used to send a follow-up, that is a commercial electronic message without
express consent under CASL. Penalties are administrative and apply per violation.

**What can be built instead, and gets most of the value:**

- Count abandonment **anonymously**. A counter of how many people left at each question
  answers the design question ("where do people drop out") without holding anyone's
  data. No identifier, no answers, nothing joinable back to a person.
- If Imagine Cities wants completed-but-unsent results, ask on the page: a "send me this
  later" action the person takes deliberately is consent. A silent capture is not.
- Never join an abandoned session to an email address entered earlier in the same
  session. That is exactly the case the rule exists to prevent.

---

## 2. What this prototype already does correctly

| Requirement | Where | Status |
|---|---|---|
| Purpose identified at collection | Context step, "Why we ask" | Client's own copy, three stated purposes |
| Location step genuinely optional | Context step | Labelled optional, Skip button clears both fields |
| Marketing consent unbundled | Email gate | Separate checkbox, **unticked**, nothing on the page depends on it |
| Marketing consent not a condition | Email gate | Guidance unlocks whether or not it is ticked |
| Sender identified | Consent label | Names Imagine Cities, states unsubscribe |
| No silent collection | Whole flow | "This is a prototype. Nothing you enter is stored or sent." |

The unbundling is the part most easily lost in a rebuild. CASL requires express consent
to be sought *separately* from the transaction. A single "enter your email to continue"
with implied marketing consent folded into it would not meet that, however the copy is
worded.

---

## 3. Open questions for Imagine Cities

1. **Does the email gate itself survive review?** The PRD puts email capture last and
   optional (screen 6), and says a user who declines can simply return to the homepage.
   This prototype gates the guidance behind it — a deliberate product decision, but it
   is a departure from the PRD and the client should be the one making it.
2. **Retention.** Nothing in the PRD says how long results, emails or postal codes are
   kept, or who inside the organization can see them. PIPEDA expects a stated period.
3. **Who is the sender of record**, and what unsubscribe mechanism will exist? CASL
   requires identification and a working unsubscribe in every message.
4. **Is location data actually aggregated before use?** The "Why we ask" copy promises
   aggregate use. If individual postal codes are queryable next to individual results,
   the copy is inaccurate and the promise is the thing people consented to.
