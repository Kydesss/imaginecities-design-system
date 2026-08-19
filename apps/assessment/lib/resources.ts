import { STAGE_ORDER, type StageKey } from './stages';

/**
 * Resources shown after the guidance. PRD screen 6, "Resources + Email Capture", and
 * the reason the PRD calls this tool "the start of the user journey when using Imagine
 * Cities and our tools/resources". Without it the journey ends at the result.
 *
 * NOTHING HERE IS INVENTED. Every link is one that has been verified to exist: the
 * Harwood report from the URL Imagine Cities themselves cited in the user testing
 * notes, and the Imagine Cities home page from the site audit in
 * source/observed-website.md.
 *
 * The per-stage Imagine Cities resources are the part that matters most and the part
 * that cannot be written from outside the organization: which course, guide or session
 * a Waiting Place neighbourhood should be sent to is theirs to decide. So `internal`
 * starts empty for every stage and the UI renders a labelled slot saying what belongs
 * there. Filling one in is adding an object to the array below, nothing else.
 */

export interface ResourceLink {
  title: string;
  href: string;
  /** one line on what it is and why it suits this stage */
  note: string;
}

/** Shown on every stage. Framework background rather than stage-specific advice. */
export const EXTERNAL: ResourceLink[] = [
  {
    title: 'Community Rhythms: The Five Stages of Community Life',
    href: 'https://theharwoodinstitute.org/report-catalog/community-rhythms-the-five-stages-of-community-life',
    note: 'The Harwood Institute report the five stages come from. Free, and the source for every stage description here.',
  },
  {
    title: 'Imagine Cities',
    href: 'https://www.imaginecities.com/',
    note: 'Courses, membership and the rest of the tools.',
  },
];

/**
 * Imagine Cities resources matched to each stage. Empty until the organization says
 * what belongs in each one; see the note at the top of this file.
 */
export const INTERNAL: Record<StageKey, ResourceLink[]> = Object.fromEntries(
  STAGE_ORDER.map((key) => [key, [] as ResourceLink[]]),
) as Record<StageKey, ResourceLink[]>;

/** What the client needs to supply for each stage, shown in the empty slot. */
export const INTERNAL_SLOT_HINT: Record<StageKey, string> = {
  'waiting-place':
    'Something a single person can use on their own, before any group exists. Relationship building, or how to start a conversation with neighbours.',
  impasse:
    'Something for a small group that has energy but no first step. Running a first small project, or finding others already trying.',
  catalytic:
    'Something about connecting groups that already exist, and supporting the leaders who have emerged.',
  growth:
    'Something about widening participation and reaching the people momentum has passed by.',
  'sustain-renew':
    'Something about renewing leadership and keeping a shared vision current.',
};
