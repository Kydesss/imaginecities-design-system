'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Animates its children in the first time they scroll into view.
 *
 * Why not just put the entrance animation on every section: the intro page is several
 * screens tall, so a load-time animation plays out entirely above the fold and the rest
 * of the page has already finished animating by the time anyone scrolls to it. The
 * motion is only worth anything if it happens when the section is actually looked at.
 *
 * Three things this deliberately gets right:
 *
 * 1. NOTHING IS HIDDEN BY DEFAULT. The hidden state is applied in an effect, so the
 *    server HTML and the no-JavaScript case render the content plainly visible. A
 *    reveal pattern that hides in CSS and shows in JS makes the whole page blank when
 *    the script fails.
 *
 * 2. ANYTHING ALREADY ON SCREEN AT MOUNT IS LEFT ALONE. Hiding it and animating it back
 *    would be a visible flash on load, and it does not need revealing: it is already
 *    being looked at.
 *
 * 3. REDUCED MOTION SKIPS THE MECHANISM ENTIRELY rather than relying on the global
 *    duration override, so there is no hidden state to get stuck in if an observer
 *    never fires.
 */
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle');

  /*
   * useLayoutEffect, not useEffect: the decision to hide has to happen before the
   * browser paints, or the content shows at full opacity for a frame and then
   * disappears to animate back in. It is guarded because useLayoutEffect warns when it
   * runs during server rendering, which it never does here, but the guard documents it.
   */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already in view, leave it visible
    setState('hidden');
  }, []);

  useEffect(() => {
    if (state !== 'hidden') return;
    const el = ref.current;
    if (!el) return;

    /*
     * Watchdog, and the reason it can be this precise: observe() always schedules an
     * initial callback for the element, whether or not it intersects. So receiving no
     * callback at all does not mean "not scrolled to yet", it means the observer is
     * not delivering. That happens in environments where the page is not compositing
     * frames, and it was reproduced here: a hand-built observer on an element sitting
     * squarely in the viewport never fired.
     *
     * Without this the failure mode is content that is invisible forever. Revealing
     * on its own is the right way to fail: the worst case is a section that was
     * already visible before it was scrolled to.
     */
    let delivered = false;
    const watchdog = window.setTimeout(() => {
      if (!delivered) setState('shown');
    }, 600);

    const observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setState('shown');
          observer.disconnect();
        }
      },
      // A little early, so the animation is underway rather than starting at the edge.
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(watchdog);
      observer.disconnect();
    };
  }, [state]);

  return (
    <div
      ref={ref}
      className={`${className} ${state === 'hidden' ? 'revealPending' : ''} ${state === 'shown' ? 'riseIn' : ''}`.trim()}
    >
      {children}
    </div>
  );
}
