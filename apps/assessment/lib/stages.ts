/**
 * Stage content and the provisional scoring model.
 *
 * The five STAGES are the Harwood Institute's Stages of Community Life. The five
 * FACTORS in ./factors.ts are Imagine Cities' own: the Harwood report assesses nine
 * differently-named factors, and two of ours appear nowhere in it. Do not reattribute.
 *
 * Copy marked [verbatim] came from the published build. [reconstructed] could not be
 * recovered and is written to match the surrounding voice; replace it with the real
 * copy when it is available.
 */

export const STAGE_ORDER = [
  'waiting-place',
  'impasse',
  'catalytic',
  'growth',
  'sustain-renew',
] as const;

export type StageKey = (typeof STAGE_ORDER)[number];

export interface Stage {
  name: string;
  /** one line under the stage name */
  summary: string;
  /** stage-specific reassurance; a single shared line cannot do this job */
  reflection: string;
  why: string;
  focus: string;
  steps: { title: string; detail: string }[];
  /** short description used on the spectrum graphic */
  spectrum: string;
}

export const STAGES: Record<StageKey, Stage> = {
  'waiting-place': {
    name: 'Waiting Place',
    summary:
      'Hope and shared confidence are low, and residents may be waiting for outside help rather than acting together.',
    reflection:
      'This result is a reflection, not a verdict. The Waiting Place is a starting point rather than a failure. The next move is not a big project, it is naming out loud what is not working, because a problem nobody can name is one nobody can act on.',
    why: 'The neighbourhood may not yet have enough trust, connection, or leadership to turn concern into action.',
    focus: 'Start by building relationships, trust, and small signs that local action is possible.',
    spectrum: 'Nobody can quite name the problem.',
    steps: [
      { title: 'Build one real relationship', detail: 'Start with a single neighbour or group, not a committee.' },
      { title: 'Show that action is possible', detail: 'Pick something small enough to finish and visible enough to notice.' },
      { title: 'Find a willing anchor', detail: 'One person or organization willing to host or convene changes what is possible.' },
      { title: 'Create a reason to gather', detail: 'People need somewhere to meet before they can decide anything together.' },
    ],
  },
  impasse: {
    name: 'Impasse',
    summary: 'Energy exists, but it has not yet turned into coordinated action.',
    reflection:
      'This result is a reflection, not a verdict. Impasse sounds like the worst news here, and it is not. It is a step forward from the Waiting Place, because the problem has become clear enough to act on. What is missing is a way to act together, not awareness.',
    why: 'The problems are named and the urgency is real, which is further along than it feels. What is missing is a way to act together.',
    focus: 'Turn frustration into small visible wins and emerging leadership.',
    spectrum: 'The problem is named. Action has stalled.',
    steps: [
      { title: 'Surface shared frustration', detail: 'Name the problem publicly so people discover they are not alone in it.' },
      { title: 'Create a visible win', detail: 'One completed thing does more for belief than any amount of planning.' },
      { title: 'Support a willing leader', detail: 'Back the person already trying, rather than waiting for a better candidate.' },
      { title: 'Find common ground', detail: 'Start where interests overlap, not where they conflict.' },
    ],
  },
  catalytic: {
    name: 'Catalytic',
    summary: 'There is energy to act, and some groups are already testing new approaches.',
    reflection:
      'This result is a reflection, not a verdict. Something here is genuinely working. The risk at this stage is not failure, it is that scattered efforts stay scattered and fade quietly before they ever connect.',
    why: 'Action exists, but it may still be scattered and not yet connected into a shared movement.',
    focus: 'Connect isolated efforts, support emerging leaders, and turn small wins into shared momentum.',
    spectrum: 'Small groups are testing what works.',
    steps: [
      { title: 'Connect existing efforts', detail: 'The groups already working often do not know about each other.' },
      { title: 'Make small wins visible', detail: 'Progress that nobody hears about does not build belief.' },
      { title: 'Support emerging leadership', detail: 'Give new leaders something real to lead.' },
      { title: 'Build a shared story', detail: 'A common account of what is happening is what holds efforts together.' },
    ],
  },
  growth: {
    name: 'Growth',
    summary:
      'Your neighbourhood is building visible momentum, stronger connections, and a clearer sense of shared purpose.',
    reflection:
      'This result is a reflection, not a verdict. Momentum is real here, and momentum can hide who has been left out of it. The work at this stage is widening participation rather than protecting what already works.',
    why: 'Residents and organizations are beginning to see steady progress and a stronger collective identity.',
    focus: 'Broaden participation, share the benefits of progress, and prepare for deeper long-term challenges.',
    spectrum: 'Progress is visible and spreading.',
    steps: [
      { title: 'Broaden participation', detail: 'Reach the people and blocks that momentum has not touched yet.' },
      { title: 'Share credit and progress', detail: 'Widely shared credit is what keeps participation growing.' },
      { title: 'Develop new leaders', detail: 'The people who started this cannot carry it indefinitely.' },
      { title: 'Prepare for complexity', detail: 'The next set of problems will be harder than the last.' },
    ],
  },
  'sustain-renew': {
    name: 'Sustain & Renew',
    summary: 'There are strong assets, established leadership, and a shared capacity to respond to change.',
    reflection:
      'This result is a reflection, not a verdict. This stage is not an endpoint. Neighbourhoods move in both directions, and the risk here is comfort: leadership and shared vision need renewing before anyone notices they are missing.',
    why: 'The neighbourhood has built enough structure and trust to adapt, but long-term momentum still needs care.',
    focus: 'Cultivate new leaders, renew networks, address deeper issues, and avoid stagnation.',
    spectrum: 'The neighbourhood adapts and keeps going.',
    steps: [
      { title: 'Renew your leadership pipeline', detail: 'Bring in people who were not part of the original push.' },
      { title: 'Revisit your shared vision', detail: 'What the neighbourhood wanted five years ago may not be what it wants now.' },
      { title: 'Address deeper issues', detail: 'The capacity now exists for problems that were previously out of reach.' },
      { title: 'Protect against stagnation', detail: 'Comfort is the main risk at this stage.' },
    ],
  },
};

export const isStageKey = (value: string): value is StageKey =>
  (STAGE_ORDER as readonly string[]).includes(value);
