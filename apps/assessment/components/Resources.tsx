import { EXTERNAL, INTERNAL, INTERNAL_SLOT_HINT } from '@/lib/resources';
import { STAGES, type StageKey } from '@/lib/stages';
import styles from './Resources.module.css';

/**
 * PRD screen 6. Sits after the guidance, because the guidance is what a resource is
 * supposed to help someone act on.
 *
 * Links open in a new tab. Normally that is worth avoiding, but someone reading their
 * result has state in this page that a back button will not always restore, and losing
 * a result to a stray navigation is worse than the tab. `rel="noreferrer"` covers both
 * the opener reference and the referrer header.
 */
export function Resources({ stage }: { stage: StageKey }) {
  const internal = INTERNAL[stage];

  return (
    <section className={styles.resources} aria-labelledby="resources-heading">
      <h2 id="resources-heading">
        <span className="icon iconHeading" aria-hidden="true">
          menu_book
        </span>
        Where to go from here
      </h2>

      <h3 className={styles.subhead}>From Imagine Cities</h3>
      {internal.length > 0 ? (
        <ul className={styles.list} role="list">
          {internal.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      ) : (
        /*
          A labelled gap, not a placeholder pretending to be content. Which resource
          suits a neighbourhood at this stage is Imagine Cities' call, and inventing
          plausible-looking course names here would be the one thing worse than an
          empty section.
        */
        <div className={styles.slot}>
          <p>
            <strong>Imagine Cities resources for the {STAGES[stage].name} stage go here.</strong>
          </p>
          <p>{INTERNAL_SLOT_HINT[stage]}</p>
        </div>
      )}

      <h3 className={styles.subhead}>Background and further reading</h3>
      <ul className={`${styles.list} stagger`} role="list">
        {EXTERNAL.map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.title}
            </a>
            <span>{item.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
