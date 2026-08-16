import { type StageKey } from './stages';
import { type Answers } from './factors';

/**
 * PROVISIONAL SCORING MODEL — needs validation before it ships.
 *
 * The real methodology is internal to the existing tool and was not available. This is
 * a designed stand-in, isolated here so that replacing this one function leaves the
 * rest of the app untouched.
 *
 * HOW IT WORKS. Not a total and not an average. Averaging was tried first and rejected
 * on evidence: across all 243 answer combinations it collapsed toward the middle,
 * leaving Waiting Place and Sustain & Renew reachable by one combination each, and it
 * classified strong optimism and leadership with no visible progress as Growth, which
 * the report defines by visible forward movement.
 *
 * Instead each stage has entry conditions, checked from the top down, and a
 * neighbourhood lands in the highest stage it qualifies for. That matches the
 * framework's position that stages are sequential and cannot be skipped.
 *
 * DISTRIBUTION across all 243 combinations: Waiting Place 4%, Impasse 27%, Catalytic
 * 59%, Growth 8%, Sustain & Renew 2%. Uniform random answers are not a real
 * population, so this is not a target to flatten, but the Catalytic share is worth
 * revisiting against real response data. Growth and Sustain & Renew being hard to
 * reach is deliberate, and consistent with the report's finding that most people
 * assume their community is further along than it is.
 *
 * WHAT THIS IS NOT: validated, Harwood's, or the existing tool's. It produces
 * plausible, explainable, inspectable results for review. It should not be described
 * to users or funders as a methodology until Imagine Cities confirms one.
 */
export interface ScoreResult {
  stage: StageKey;
  /** plain-language reason the matching gate fired, shown under ?debug=1 */
  why: string;
}

export function scoreToStage(answers: Answers): ScoreResult {
  const h = answers.hope ?? 1;
  const c = answers.collaboration ?? 1;
  const l = answers.leadership ?? 1;
  const p = answers.progress ?? 1;
  const r = answers.resilience ?? 1;

  // Sustain & Renew: established leadership, visible progress and a vision that adapts.
  if (h >= 2 && c >= 2 && l === 3 && p === 3 && r === 3) {
    return { stage: 'sustain-renew', why: 'top leadership, progress and shared vision together' };
  }

  // Growth: defined by forward movement experienced by a growing number of residents,
  // so p === 3 is required rather than merely helpful.
  if (h >= 2 && p === 3 && l >= 2 && c >= 2) {
    return { stage: 'growth', why: 'visible progress experienced widely, with leadership and collaboration behind it' };
  }

  // Catalytic: small groups taking risks AND producing enough visible result to build
  // faith. Action alone is not sufficient, so one isolated win stays at Impasse.
  if ((p >= 2 && (c >= 2 || l >= 2)) || (h >= 2 && c >= 2 && l >= 2)) {
    return { stage: 'catalytic', why: 'action is happening and there is some collective capacity behind it' };
  }

  // Waiting Place by its own markers, not by being the lowest total.
  if (h === 1 && p === 1 && l === 1) {
    return { stage: 'waiting-place', why: 'no action, no leadership, and residents feel powerless' };
  }

  // Impasse is the default: a step FORWARD from the Waiting Place, not a low score.
  return { stage: 'impasse', why: 'there is recognition or energy, but it has not turned into action yet' };
}
