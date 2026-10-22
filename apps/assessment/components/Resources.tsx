'use client';

import { useEffect, useRef, useState } from 'react';
import { EXTERNAL, INTERNAL, INTERNAL_SLOT_HINT, type ResourceLink } from '@/lib/resources';
import { STAGES, type StageKey } from '@/lib/stages';
import styles from './Resources.module.css';

type Card =
  | { kind: 'link'; source: string; item: ResourceLink }
  | { kind: 'slot'; source: string };

/**
 * PRD screen 6. Sits after the focus areas, because they are what a resource is
 * supposed to help someone act on.
 *
 * A carousel of cards: Imagine Cities resources first, then external reading, each
 * card tagged with its source. A track that scrolls and snaps, with Previous and Next
 * buttons, rather than an auto-advancing slider: nothing moves unless the reader moves
 * it, and on a phone the track swipes like any other horizontal list.
 *
 * Each card has one link, the visible "Open resource" button, stretched over the whole
 * card so the card is clickable too. One link per card keeps the tab order and the
 * screen reader's link list to one entry per resource.
 *
 * Links open in a new tab. Normally that is worth avoiding, but someone reading their
 * result has state in this page that a back button will not always restore, and losing
 * a result to a stray navigation is worse than the tab. `rel="noreferrer"` covers both
 * the opener reference and the referrer header.
 */
export function Resources({ stage }: { stage: StageKey }) {
  const internal = INTERNAL[stage];
  const cards: Card[] = [
    /*
      An empty Imagine Cities list becomes a labelled slot card, not a placeholder
      pretending to be content. Which resource suits a neighbourhood at this stage is
      Imagine Cities' call, and inventing plausible-looking course names here would be
      the one thing worse than an empty card.
    */
    ...(internal.length > 0
      ? internal.map((item): Card => ({ kind: 'link', source: 'Imagine Cities', item }))
      : [{ kind: 'slot', source: 'Imagine Cities' } as Card]),
    ...EXTERNAL.map((item): Card => ({ kind: 'link', source: 'Further reading', item })),
  ];

  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ overflow: false, atStart: true, atEnd: true });

  // Which controls are useful depends on layout, so it is read from the track whenever
  // it scrolls or resizes. The observer also fires once on observe, which sets the
  // initial state without a setState call in the effect body.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setEdges({
        overflow: max > 1,
        atStart: track.scrollLeft <= 1,
        atEnd: track.scrollLeft >= max - 1,
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', update);
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector('li');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <section className={styles.resources} aria-labelledby="resources-heading">
      <div className={styles.header}>
        <h2 id="resources-heading" className="headingLead">
          <span className="icon iconLead" aria-hidden="true">
            menu_book
          </span>
          Resources to help you take the next step
        </h2>
        {/* Hidden, not disabled, when every card already fits: there is nothing to page. */}
        <div className={styles.controls} hidden={!edges.overflow}>
          <button
            type="button"
            className={styles.control}
            aria-label="Previous resources"
            aria-controls="resource-track"
            disabled={edges.atStart}
            onClick={() => scroll(-1)}
          >
            <span className="icon" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className={styles.control}
            aria-label="Next resources"
            aria-controls="resource-track"
            disabled={edges.atEnd}
            onClick={() => scroll(1)}
          >
            <span className="icon" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <ul id="resource-track" ref={trackRef} className={styles.track} role="list">
        {cards.map((card) =>
          card.kind === 'link' ? (
            <li key={card.item.href} className={styles.card}>
              <span className={styles.tag}>{card.source}</span>
              <h3 className={styles.cardTitle}>{card.item.title}</h3>
              <p className={styles.cardNote}>{card.item.note}</p>
              <a
                className={styles.cardLink}
                href={card.item.href}
                target="_blank"
                rel="noreferrer"
                // Starts with the visible words, so speech input can still say "Open resource".
                aria-label={`Open resource: ${card.item.title} (opens in a new tab)`}
              >
                Open resource
                <span className="icon" aria-hidden="true">
                  arrow_outward
                </span>
              </a>
            </li>
          ) : (
            <li key="slot" className={`${styles.card} ${styles.slot}`}>
              <span className={styles.tag}>{card.source}</span>
              <h3 className={styles.cardTitle}>
                Imagine Cities resources for the {STAGES[stage].name} stage go here
              </h3>
              <p className={styles.cardNote}>{INTERNAL_SLOT_HINT[stage]}</p>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
