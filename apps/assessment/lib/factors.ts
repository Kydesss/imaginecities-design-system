/**
 * The five factors. These are Imagine Cities' own, not the Harwood Institute's.
 *
 * `ground` names the colour token the question sits on, and the same key drives the
 * matching segment of the progress bar. The reasoning for each colour, and why the
 * result colours are deliberately not ordered from bad to good, is in
 * docs/colour-emotion-map.md at the repo root.
 *
 * Question and option copy follows the PRD, Step 3. Three options were previously
 * marked [reconstructed] because they could not be recovered from the published build;
 * the PRD supplies all three, so no option text here is invented any more.
 *
 * `blurb` answers "what is this factor actually asking about", shown under the factor
 * name. Leadership and Progress are the client's own wording from the user testing
 * notes, with "it's" expanded. The other three had no supplied text and are written to
 * the same "X looks at whether..." shape from the PRD's factor definitions; they are
 * the only invented copy in this file and are the first thing to replace if the client
 * writes their own.
 */

export const FACTOR_ORDER = ['hope', 'collaboration', 'leadership', 'progress', 'resilience'] as const;

export type FactorKey = (typeof FACTOR_ORDER)[number];

export interface Factor {
  /** short label above the question */
  name: string;
  /** one line under the factor name, explaining what it measures */
  blurb: string;
  /** Material Symbols name, outlined. Verified against Google's icon metadata. */
  icon: string;
  question: string;
  /** answers run weakest to strongest; index + 1 is the stored value */
  options: { short: string; long: string }[];
}

export const FACTORS: Record<FactorKey, Factor> = {
  hope: {
    name: 'Hope and optimism',
    blurb:
      'Hope and optimism looks at whether residents believe local problems can be solved by the people who live there, rather than by someone from outside.',
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
    blurb:
      'Collaboration looks at whether neighbours connect and work together when something in the neighbourhood needs doing.',
    icon: 'handshake',
    question: 'How do residents typically collaborate when addressing neighbourhood issues or small projects?',
    options: [
      { short: 'Limited connection', long: 'People mostly keep to themselves, with little to no connection or collaboration between neighbours.' },
      { short: 'Occasional collaboration', long: 'Small groups occasionally form to tackle minor neighbourhood issues, but efforts are short-lived.' },
      { short: 'Regular collaboration', long: 'Residents come together in larger groups regularly, combining their skills and expertise to address neighbourhood problems.' },
    ],
  },
  leadership: {
    name: 'Leadership',
    blurb:
      'Leadership looks at whether there are individuals, groups or organizations taking initiative, supporting each other, and helping move shared goals forward in your neighbourhood.',
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
    blurb:
      'Progress looks at whether residents can see tangible signs that action is happening and that it is making a difference.',
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
    blurb:
      'Resilience looks at whether the neighbourhood has a shared direction for the future that it can adapt as circumstances change.',
    icon: 'autorenew',
    question: "What is your neighbourhood's capacity to adapt and continue solving future problems?",
    options: [
      { short: 'No shared vision', long: 'There is no tangible, shared vision for the future.' },
      { short: 'Ideas not yet aligned', long: 'There are multiple, exciting ideas and projects about the future, but they are not yet aligned into a cohesive neighbourhood vision.' },
      { short: 'Adaptive shared vision', long: 'The neighbourhood has a shared vision and a strategy that is regularly updated based on changing conditions, new learning, and new leadership.' },
    ],
  },
};

/** 1, 2 or 3 per factor, in FACTOR_ORDER */
export type Answers = Record<FactorKey, 1 | 2 | 3 | undefined>;
