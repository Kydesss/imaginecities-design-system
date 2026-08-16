import { STAGES, STAGE_ORDER, type StageKey } from '@/lib/stages';
import styles from './Spectrum.module.css';

const NODE_X = [120, 320, 520, 720, 920];

/**
 * SVG text does not wrap, so the per-stage descriptions are split across two tspans.
 * Balanced by character count, breaking on the word that crosses the midpoint.
 */
function splitIntoTwoLines(text: string): [string, string] {
  const words = text.split(' ');
  const half = text.length / 2;
  let first = '';
  let i = 0;
  while (i < words.length && (first.length + words[i].length) / 1 <= half) {
    first += (first ? ' ' : '') + words[i];
    i += 1;
  }
  if (!first) {
    first = words[0] ?? '';
    i = 1;
  }
  return [first, words.slice(i).join(' ')];
}

type Annotation =
  /** intro page: the argument for taking the assessment */
  | { kind: 'assumption' }
  /** result page: marks where the reader landed */
  | { kind: 'you-are-here'; stage: StageKey }
  | { kind: 'none' };

/**
 * The five stages as a spectrum.
 *
 * Deliberately NOT a progress bar. The source framework calls its index a touchstone
 * rather than a scorecard, says communities move backwards as well as forwards, and
 * states that a Waiting Place community must move into Impasse, which makes Impasse
 * progress rather than failure. So every node is the same size and colour, the
 * connectors are double-headed, and there are no numbers, because numbering five
 * stages makes them read as a score out of five.
 *
 * The SVG is aria-hidden and the caller renders a text list alongside it, which is the
 * accessible equivalent.
 */
export function Spectrum({ annotation = { kind: 'none' } }: { annotation?: Annotation }) {
  const currentIndex =
    annotation.kind === 'you-are-here' ? STAGE_ORDER.indexOf(annotation.stage) : -1;
  const annotationX =
    annotation.kind === 'assumption' ? NODE_X[3] : currentIndex >= 0 ? NODE_X[currentIndex] : NODE_X[0];

  return (
    <svg className={styles.spectrum} viewBox="0 0 1040 300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="spectrumArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,1 L9,5 L0,9 z" fill="var(--ic-color-charcoal-black)" />
        </marker>
      </defs>

      {annotation.kind === 'assumption' && (
        <g>
          <text x={annotationX} y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ic-color-charcoal-black)">
            Where most people assume
          </text>
          <text x={annotationX} y={46} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ic-color-charcoal-black)">
            their neighbourhood already is
          </text>
          <line x1={annotationX} y1={58} x2={annotationX} y2={86} stroke="var(--ic-color-charcoal-black)" strokeWidth={2} strokeDasharray="4 4" />
        </g>
      )}

      {annotation.kind === 'you-are-here' && (
        <g>
          {/*
            Drawn rather than set in Material Symbols. An icon-font ligature inside SVG
            text is fragile: with the font unloaded the graphic renders the literal word
            "location_city" in the middle of the diagram.
          */}
          <g
            transform={`translate(${annotationX},18)`}
            fill="none"
            stroke="var(--ic-color-charcoal-black)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path d="M -11 2 L 0 -8 L 11 2" />
            <path d="M -8 1 L -8 12 L 8 12 L 8 1" />
            <path d="M -2.5 12 L -2.5 6 L 2.5 6 L 2.5 12" />
          </g>
          <text x={annotationX} y={48} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ic-color-charcoal-black)">
            Your neighbourhood
          </text>
          <line x1={annotationX} y1={60} x2={annotationX} y2={86} stroke="var(--ic-color-charcoal-black)" strokeWidth={2} />
        </g>
      )}

      {/* connectors, double-headed: movement runs both ways */}
      {NODE_X.slice(0, -1).map((x, i) => (
        <line
          key={x}
          x1={x + 26}
          y1={120}
          x2={NODE_X[i + 1] - 26}
          y2={120}
          stroke="var(--ic-color-charcoal-black)"
          strokeWidth={2.5}
          markerStart="url(#spectrumArrow)"
          markerEnd="url(#spectrumArrow)"
        />
      ))}

      {STAGE_ORDER.map((key, i) => (
        <circle
          key={key}
          className={`${styles.node} ${i === currentIndex ? styles.nodeCurrent : ''}`}
          cx={NODE_X[i]}
          cy={120}
          r={20}
        />
      ))}

      {STAGE_ORDER.map((key, i) => (
        <text
          key={key}
          className={i === currentIndex ? styles.labelCurrent : undefined}
          x={NODE_X[i]}
          y={180}
          textAnchor="middle"
          fontSize={17}
          fontWeight={i === currentIndex ? 700 : 600}
          fill="var(--ic-color-charcoal-black)"
        >
          {STAGES[key].name}
        </text>
      ))}

      {annotation.kind !== 'you-are-here' &&
        STAGE_ORDER.map((key, i) => {
          const [line1, line2] = splitIntoTwoLines(STAGES[key].spectrum);
          return (
            <g key={key} fontSize={13} fill="var(--ic-color-charcoal-black)" textAnchor="middle">
              <text x={NODE_X[i]} y={204}>{line1}</text>
              <text x={NODE_X[i]} y={221}>{line2}</text>
            </g>
          );
        })}

      <text x={520} y={annotation.kind === 'you-are-here' ? 240 : 270} textAnchor="middle" fontSize={14} fill="var(--ic-color-charcoal-black)">
        Neighbourhoods move in both directions, and a stage can be temporary.
      </text>
    </svg>
  );
}

/** The text equivalent of the graphic, for assistive tech and narrow screens. */
export function StageList({ current }: { current?: StageKey }) {
  return (
    <ol className={styles.stageList} role="list">
      {STAGE_ORDER.map((key) => (
        <li key={key} aria-current={key === current ? 'step' : undefined}>
          <span className={styles.stageName}>{STAGES[key].name}</span>
          <span className={styles.stageWhat}>{STAGES[key].spectrum}</span>
          {key === current && <span className="srOnly"> (your result)</span>}
        </li>
      ))}
    </ol>
  );
}
