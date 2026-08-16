import { Suspense } from 'react';
import { AssessmentFlow } from '@/components/AssessmentFlow';

export const metadata = {
  title: 'Take the assessment | Neighbourhood Adaptability Assessment',
};

export default function AssessmentPage() {
  /*
   * The flow reads ?stage= and ?debug= with useSearchParams, which requires a Suspense
   * boundary on a statically rendered route. Without it the build fails rather than
   * degrading quietly, which is the right trade: a missing boundary would otherwise
   * push the whole route to client rendering without anyone noticing.
   */
  return (
    <Suspense fallback={null}>
      <AssessmentFlow />
    </Suspense>
  );
}
