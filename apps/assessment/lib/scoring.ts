import { STAGE_ORDER, type StageKey } from './stages';
import { type Answers, type FactorKey } from './factors';

/**
 * Answers with every factor filled in. Not `Required<Answers>`: `Required` strips
 * optionality, and `Answers` declares `undefined` inside the value union instead, so
 * `Required<Answers>` still admits it.
 */
type Scored = Record<FactorKey, 1 | 2 | 3>;

/**
 * The scoring model documented in the Neighbourhood Adaptability Assessment Tool PRD
 * (last updated 9 May 2026), Step 3, plus two floor rules this prototype adds.
 *
 * PART 1, THE PRD'S MODEL. Each factor scores 1, 2 or 3 (option A, B or C). The five
 * are summed, giving 5 to 15, and the total falls in one of five bands:
 *
 *     Waiting Place    5 - 6
 *     Impasse          7 - 8
 *     Catalytic        9 - 10
 *     Growth          11 - 13
 *     Sustain & Renew 14 - 15
 *
 * PART 2, THE FLOORS. Addition alone lets two strong factors compensate for two absent
 * ones, which produced results the PRD's own stage definitions contradict:
 *
 *     33311  totals 11, so Growth, with NO visible progress at all. The PRD defines
 *            Growth by "clear and unmistakable signs of progress".
 *     11333  totals 11, so Growth, with no hope and no collaboration, which the PRD
 *            treats as the defining markers of the Waiting Place.
 *
 * So a stage also has to clear a floor on the factors that define it, and a
 * neighbourhood that fails one drops to the next stage down until it clears:
 *
 *     Growth     needs progress, collaboration and leadership all at 2 or better.
 *                The PRD's Growth is "propelled by a sense of connection and shared
 *                purpose", with "recognizable leaders", and visible progress.
 *     Catalytic  needs hope at 2 or better, and collaboration or leadership at 2 or
 *                better. The PRD's Catalytic residents "possess the collective energy
 *                and willingness needed to act", which option A for hope, "most people
 *                feel powerless", directly denies.
 *
 * Impasse and Waiting Place carry no floor. Nothing can be demoted INTO the Waiting
 * Place, because Impasse is a step forward from it rather than a worse result, and a
 * floor should not push anyone backwards past that line. Sustain & Renew needs no
 * floor: a total of 14 or 15 already puts every factor at 2 or better.
 *
 * Floors can only ever demote, never promote. Verified across all 243 combinations.
 *
 * DISTRIBUTION across all 243 combinations, PRD bands alone then with floors:
 *
 *     Waiting Place     2.5%  ->   2.5%
 *     Impasse          18.5%  ->  37.9%
 *     Catalytic        39.5%  ->  37.4%
 *     Growth           37.0%  ->  19.8%
 *     Sustain & Renew   2.5%  ->   2.5%
 *
 * 85 of 243 combinations demote. Uniform random answers are not a real population, so
 * these are not targets, but the shift is large enough that Imagine Cities should see
 * it before this is described to anyone as their methodology.
 *
 * THE FLOORS ARE THIS PROTOTYPE'S ADDITION, NOT THE CLIENT'S. The PRD documents the
 * bands only. Deleting FLOORS below restores their model exactly.
 *
 * The user never sees the total. PRD design principle 3, "hidden scoring": the points
 * drive the result but the experience should not feel score-heavy. `total` is returned
 * only so ?debug=1 can show it during review.
 *
 * One inconsistency in the PRD, recorded rather than resolved: it says each factor
 * "will have 3 questions", which cannot produce a 5 to 15 range. Fifteen questions
 * would run 15 to 45. The range, the published tool and this app all use one question
 * per factor.
 */

/** Inclusive upper bound of each band, in STAGE_ORDER. */
const BAND_MAX = [6, 8, 10, 13, 15] as const;

/** Factor floors a stage must clear, keyed by index into STAGE_ORDER. */
const FLOORS: Record<number, (a: Scored) => boolean> = {
  3: (a) => a.progress >= 2 && a.collaboration >= 2 && a.leadership >= 2,
  2: (a) => a.hope >= 2 && (a.collaboration >= 2 || a.leadership >= 2),
};

export interface ScoreResult {
  stage: StageKey;
  /** 5 to 15. Never shown to users; ?debug=1 only. */
  total: number;
  /** true when a floor rule pulled the result below its band */
  demoted: boolean;
  /** plain-language reason, shown under ?debug=1 */
  why: string;
}

export function scoreToStage(answers: Answers): ScoreResult {
  const a: Scored = {
    hope: answers.hope ?? 1,
    collaboration: answers.collaboration ?? 1,
    leadership: answers.leadership ?? 1,
    progress: answers.progress ?? 1,
    resilience: answers.resilience ?? 1,
  };
  const total = a.hope + a.collaboration + a.leadership + a.progress + a.resilience;

  const banded = BAND_MAX.findIndex((max) => total <= max);
  let index = banded;
  while (index > 0 && FLOORS[index] && !FLOORS[index](a)) index -= 1;

  const demoted = index < banded;
  return {
    stage: STAGE_ORDER[index],
    total,
    demoted,
    why: demoted
      ? `${total} of 15 lands in ${STAGE_ORDER[banded]}, demoted by a factor floor`
      : `${total} of 15`,
  };
}
