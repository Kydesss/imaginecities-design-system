/**
 * Stage content.
 *
 * The five STAGES are the Harwood Institute's Stages of Community Life. The five
 * FACTORS in ./factors.ts are Imagine Cities' own: the Harwood report assesses nine
 * differently-named factors, and two of ours appear nowhere in it. Do not reattribute.
 *
 * `steps` is the "results driven guidance" from PRD Step 4, one entry per bullet, in
 * the PRD's order, with the detail lines compressed into plain language. The PRD's own
 * terms of art (Fundamental Structures, Neighbourhood Capital, Centers of Strength)
 * are deliberately not used as-is: the design brief asks for clear rather than
 * technical. Sustain & Renew is the exception and is annotated where it appears.
 *
 * `summary` and `why` together are the PRD's "Scoring Range Results" paragraph for the
 * stage, split at the first sentence so the result band gets an opening line and the
 * guidance section gets the rest, with no sentence appearing twice. Three edits to the
 * PRD's text, all mechanical: "neighborhood leaders" respelled to Canadian English, a
 * missing comma added before "leaving those who want to take action", and contractions
 * expanded to match the voice of the surrounding copy.
 *
 * `reflection` and `focus` remain this app's own copy. The PRD has no equivalent of
 * either: `reflection` is the stage-specific "this is not a verdict" line, and `focus`
 * is the one-line summary of the Step 4 guidance that follows it.
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
    summary: 'Your neighbourhood is likely fragmented and disillusioned.',
    reflection:
      'This result is a reflection, not a verdict. The Waiting Place is a starting point rather than a failure. The next move is not a big project, it is naming out loud what is not working, because a problem nobody can name is one nobody can act on.',
    why:
      'Residents have largely lost hope in their own capacity to solve the problems that your neighbourhood faces. Rather than believing that they could collectively resolve them, they wait for an outside force to fix the issues.',
    focus: 'Start by building relationships, trust, and small signs that local action is possible.',
    spectrum: 'Nobody can quite name the problem.',
    steps: [
      {
        title: 'Grow neighbourhood capital',
        detail:
          'Build internal strength: groups that can organize activities, events that build trust, leaders with support behind them, ongoing ties to elected officials and funders, and shared expectations for how the group works.',
      },
      {
        title: 'Focus on small wins, not big ones',
        detail:
          'Progress spreads through small actions. One-off large initiatives like visioning exercises or PR campaigns rarely leave a legacy when the capacity to carry them is not there yet.',
      },
      {
        title: 'Avoid misaligned strategies',
        detail:
          'Large strategies need high trust and established networks. Neither is in place yet, so starting there tends to fail.',
      },
      {
        title: 'Develop a strong core group',
        detail:
          'Find and support a small group willing to take small risks and show through results that real change is possible.',
      },
      {
        title: "Respect the neighbourhood's speed",
        detail:
          'This cannot be forced. Work at the pace the neighbourhood can sustain, so what is gained is shared and holds.',
      },
    ],
  },
  impasse: {
    name: 'Impasse',
    summary:
      'While there is widespread frustration in your neighbourhood, a lack of leadership has resulted in a collective hesitation to take the first step, leaving those who want to take action paralyzed and unable to break the cycle.',
    reflection:
      'This result is a reflection, not a verdict. Impasse sounds like the worst news here, and it is not. It is a step forward from the Waiting Place, because the problem has become clear enough to act on. What is missing is a way to act together, not awareness.',
    why:
      'Your neighbourhood could also be held back from an underlying culture of mistrust leading to an inability to agree on a path forward. Despite this, there is a clear sense of urgency and a widespread recognition that the current situation cannot continue.',
    focus: 'Turn frustration into small visible wins and emerging leadership.',
    spectrum: 'The problem is named. Action has stalled.',
    steps: [
      {
        title: 'Build fundamental structures',
        detail:
          'A small group or organization here is likely already willing to take risks and try new ways of working. Find them, and give them something to build on.',
      },
      {
        title: 'Focus on pebbles, not boulders',
        detail:
          'Prioritize small actions that produce tangible results. The point is not the size of the project, it is showing that the neighbourhood can act.',
      },
      {
        title: 'Discover shared aspirations',
        detail:
          'Help residents find the goals they already hold in common, and see that they can make a difference in small ways.',
      },
      {
        title: 'Link and spread slowly',
        detail:
          'As centres of strength emerge, connect them through networks. New ways of working spread through those connections, and new leaders are found there.',
      },
      {
        title: 'Manage expectations',
        detail:
          'Be wary of declaring victory early. If people believe the work is finished, they revert to old patterns and the momentum dies.',
      },
      {
        title: 'Nurture new leaders',
        detail:
          'Use the first small projects to identify and support new leaders from across the neighbourhood, rather than relying only on the official figures.',
      },
    ],
  },
  catalytic: {
    name: 'Catalytic',
    summary:
      'Your neighbourhood has established small groups or organizations that begin to take risks and experiment with new ways of working together.',
    reflection:
      'This result is a reflection, not a verdict. Something here is genuinely working. The risk at this stage is not failure, it is that scattered efforts stay scattered and fade quietly before they ever connect.',
    why:
      'Residents are primed to seed change because they are aware of the challenges and possess the collective energy and willingness needed to act. Even though small, there have been some successful activities that build a sense of hope and prove the neighbourhood has the capacity to act. They are supported by leadership that bridges the gap between vision and execution.',
    focus: 'Connect isolated efforts, support emerging leaders, and turn small wins into shared momentum.',
    spectrum: 'Small groups are testing what works.',
    steps: [
      {
        title: 'Deepen the structures you have',
        detail:
          'Make sure the groups already taking risks gain depth, purpose and stability, rather than starting more new things.',
      },
      {
        title: 'Build links and networks',
        detail:
          'Deliberately connect the groups and organizations that could support the work. New norms for how work gets done spread through those networks.',
      },
      {
        title: 'Identify and nurture new leaders',
        detail:
          'Look for leaders across every level, civic organizations included, so leadership is not concentrated in a few people.',
      },
      {
        title: 'Diffuse ideas and action',
        detail:
          'Use those networks to spread ideas and public actions that worked, so they are not contained inside a single group.',
      },
      {
        title: 'Keep a slow and steady pace',
        detail:
          'Structures need to grow slowly enough to build the support that lets them survive over the long term.',
      },
      {
        title: 'Guard against premature victory',
        detail:
          'Declaring the work done too early sends people back to old, divisive habits and kills the momentum.',
      },
    ],
  },
  growth: {
    name: 'Growth',
    summary:
      'The groups and organizations leading your neighbourhood are growing, propelled by a sense of connection and shared purpose.',
    reflection:
      'This result is a reflection, not a verdict. Momentum is real here, and momentum can hide who has been left out of it. The work at this stage is widening participation rather than protecting what already works.',
    why:
      'There are clear and unmistakable signs of progress. Your neighbourhood is actively transforming its challenges into visible, steady progress. Residents take deep pride in their collective identity, rallying behind recognizable neighbourhood leaders who embody their common purpose and sustain their forward momentum. They gain the confidence to take further risks and accept the possibility of failure as a learning tool.',
    focus: 'Broaden participation, share the benefits of progress, and prepare for deeper long-term challenges.',
    spectrum: 'Progress is visible and spreading.',
    steps: [
      {
        title: 'Cultivate new neighbourhood assets',
        detail:
          'Bring along new structures, new leaders and a fresh set of residents to be the next spark for action.',
      },
      {
        title: 'Address deeply rooted issues',
        detail:
          'Turn attention to the persistent problems that were set aside during the initial push for growth.',
      },
      {
        title: 'Expand networks to the disconnected',
        detail:
          'Build links into the areas and populations, including poorer and marginalized ones, that may have been left behind while things were growing.',
      },
      {
        title: 'Share the gains',
        detail:
          'Work so that the benefits achieved during the growth stage reach all residents, not only a few.',
      },
      {
        title: "Tend to the neighbourhood's soul",
        detail:
          'Progress is more than economic. Tending to social wellbeing is what keeps a sense of shared purpose.',
      },
      {
        title: 'Anticipate new challenges',
        detail: 'Look toward the horizon for the problems that have not fully materialized yet.',
      },
    ],
  },
  'sustain-renew': {
    name: 'Sustain & Renew',
    summary: 'Congrats! Your neighbourhood is well positioned to adapt to a fast changing future.',
    reflection:
      'This result is a reflection, not a verdict. This stage is not an endpoint. Neighbourhoods move in both directions, and the risk here is comfort: leadership and shared vision need renewing before anyone notices they are missing.',
    why:
      'You have developed and are cultivating new neighbourhood assets, you are addressing deeply rooted issues and including the wider neighbourhood in experiencing the outcomes of your activities, and are tending to the overall wellbeing of residents. While you are always at risk of sliding into decline or stagnation, you are well positioned to not allow that to happen as you can anticipate new challenges.',
    focus: 'Cultivate new leaders, renew networks, address deeper issues, and avoid stagnation.',
    spectrum: 'The neighbourhood adapts and keeps going.',
    /*
     * The only steps not taken from PRD Step 4. Sustain & Renew is the last stage, so
     * the PRD gives it a congratulations paragraph and no forward guidance. These are
     * drawn from what that paragraph names the neighbourhood as already doing, which
     * is the same work the Growth guidance describes, restated as maintenance. If the
     * client writes real Sustain & Renew guidance, replace this.
     */
    steps: [
      {
        title: 'Keep cultivating new assets',
        detail: 'New structures, new leaders and new residents willing to act are what stop success turning into stagnation.',
      },
      {
        title: 'Keep working on the deep issues',
        detail: 'The capacity now exists for the rooted problems that were out of reach earlier.',
      },
      {
        title: 'Include the wider neighbourhood',
        detail: 'Make sure the outcomes of the work are experienced beyond the people who did it.',
      },
      {
        title: "Tend to residents' wellbeing",
        detail: 'Overall wellbeing, not only visible achievements, is what holds a neighbourhood together at this stage.',
      },
      {
        title: 'Anticipate what is coming',
        detail: 'The risk of sliding into decline never disappears. Seeing new challenges early is what keeps it from happening.',
      },
    ],
  },
};

export const isStageKey = (value: string): value is StageKey =>
  (STAGE_ORDER as readonly string[]).includes(value);
