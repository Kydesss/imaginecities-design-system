/**
 * The five factors. These are Imagine Cities' own, not the Harwood Institute's.
 *
 * `ground` names the colour token the question sits on, and the same key drives the
 * matching segment of the progress bar. The reasoning for each colour, and why the
 * result colours are deliberately not ordered from bad to good, is in
 * docs/colour-emotion-map.md at the repo root.
 *
 * Copy marked [reconstructed] could not be recovered from the published build.
 */

export const FACTOR_ORDER = ['hope', 'collaboration', 'leadership', 'progress', 'resilience'] as const;

export type FactorKey = (typeof FACTOR_ORDER)[number];

export interface Factor {
  /** short label above the question */
  name: string;
  /** Material Symbols name, outlined. Verified against Google's icon metadata. */
  icon: string;
  question: string;
  /** answers run weakest to strongest; index + 1 is the stored value */
  options: { short: string; long: string }[];
}

export const FACTORS: Record<FactorKey, Factor> = {
  hope: {
    name: 'Hope and optimism',
    icon: 'psychology',
    question: 'How do most people in your neighbourhood feel about solving local problems?',
    options: [
      { short: 'Low collective confidence', long: 'Most people feel powerless and believe that local problems cannot be solved by residents.' },
      { short: 'Frustrated but not moving yet', long: 'Most people recognize the problems exist, but collective action feels stalled.' },
      { short: 'Strong collective belief', long: 'Most people are optimistic that local residents can identify problems and implement solutions.' },
    ],
  },
  collaboration: {
    name: 'Collaboration',
    icon: 'handshake',
    question: 'How do residents typically collaborate when addressing neighbourhood issues or small projects?',
    options: [
      { short: 'Limited connection', long: 'People mostly keep to themselves, with little to no connection or collaboration between neighbours.' },
      { short: 'Occasional collaboration', long: 'Small groups occasionally form to tackle minor neighbourhood issues, but efforts are short-lived.' },
      // [reconstructed]
      { short: 'Regular collaboration', long: 'Residents and groups work together regularly, and efforts carry on beyond a single project.' },
    ],
  },
  leadership: {
    name: 'Leadership',
    icon: 'campaign',
    question: 'How does leadership show up within your neighbourhood?',
    options: [
      { short: 'Passive leadership', long: 'Leadership is absent or passive, and residents wait for someone external to solve local problems.' },
      { short: 'Emerging leadership', long: 'A few individuals or groups are stepping up, but leadership remains limited, informal, or inconsistent.' },
      { short: 'Shared leadership', long: 'Leadership is visible across levels, with people and organizations working together toward shared goals.' },
    ],
  },
  progress: {
    name: 'Progress',
    icon: 'trending_up',
    question: 'In the last year, how many visible and tangible achievements have residents experienced or benefited from?',
    options: [
      { short: 'No visible progress', long: 'There are no visible changes or achievements that most residents can identify.' },
      { short: 'Some isolated wins', long: 'There have been a couple of successes, but they are not widely visible or experienced across the neighbourhood.' },
      { short: 'Visible momentum', long: 'There are several visible improvements experienced by a growing number of residents.' },
    ],
  },
  resilience: {
    name: 'Resilience',
    icon: 'autorenew',
    question: "What is your neighbourhood's capacity to adapt and continue solving future problems?",
    options: [
      { short: 'No shared vision', long: 'There is no tangible, shared vision for the future.' },
      // [reconstructed]
      { short: 'Ideas not yet aligned', long: 'People have ideas about the future, but they have not been brought together into a shared direction.' },
      // [reconstructed]
      { short: 'Adaptive shared vision', long: 'There is a shared vision that residents can adapt as circumstances change.' },
    ],
  },
};

/** 1, 2 or 3 per factor, in FACTOR_ORDER */
export type Answers = Record<FactorKey, 1 | 2 | 3 | undefined>;
