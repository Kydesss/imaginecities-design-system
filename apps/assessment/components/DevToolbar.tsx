'use client';

import dynamic from 'next/dynamic';

/**
 * The Agentation annotation toolbar, development only.
 *
 * A plain `import { Agentation } from 'agentation'` in the layout does NOT keep it out
 * of production. The `process.env.NODE_ENV === 'development'` guard stops it rendering,
 * but the static import still pulls the module into the bundle: measured at roughly
 * 400KB of toolbar code and CSS, including its dev server port, shipped to every
 * visitor of a public page.
 *
 * A dynamic import instead puts it in its own chunk that is only fetched when the
 * component actually renders, which in production is never.
 */
const Agentation = dynamic(() => import('agentation').then((m) => m.Agentation), {
  ssr: false,
});

export function DevToolbar() {
  if (process.env.NODE_ENV !== 'development') return null;
  return <Agentation />;
}
