'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FACTORS, FACTOR_ORDER, type Answers, type FactorKey } from '@/lib/factors';
import { STAGES, type StageKey, isStageKey } from '@/lib/stages';
import { scoreToStage } from '@/lib/scoring';
import { Spectrum, StageList } from './Spectrum';
import styles from './AssessmentFlow.module.css';

type Step = 'start' | 'context' | FactorKey | 'result';
const STEPS: Step[] = ['start', 'context', ...FACTOR_ORDER, 'result'];

const FEEDBACK = ['Not accurate', 'Somewhat accurate', 'Very accurate'] as const;
type Feedback = (typeof FEEDBACK)[number];

export function AssessmentFlow() {
  /*
   * useSearchParams rather than reading window during render. Reading window directly
   * would make the server render the start screen and the client render the result
   * screen: a hydration mismatch. Reading it in an effect instead would mean setting
   * state during an effect, which cascades renders. This hook is built for the case:
   * the route opts into client rendering for this subtree, so server and client agree.
   * It requires a Suspense boundary, which app/assessment/page.tsx provides.
   *
   * ?stage=impasse jumps to a result with the gate already open, for reviewing copy.
   */
  const params = useSearchParams();
  const preview = useMemo(() => {
    const value = params.get('stage');
    return value && isStageKey(value) ? (value as StageKey) : null;
  }, [params]);
  const debug = params.get('debug') === '1';

  const [step, setStep] = useState<Step>(preview ? 'result' : 'start');
  const [answers, setAnswers] = useState<Answers>({
    hope: undefined,
    collaboration: undefined,
    leadership: undefined,
    progress: undefined,
    resilience: undefined,
  });
  const [errorFor, setErrorFor] = useState<FactorKey | null>(null);
  const [unlocked, setUnlocked] = useState(Boolean(preview));
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const stepRef = useRef<HTMLElement>(null);
  const guidanceRef = useRef<HTMLHeadingElement>(null);

  const result = useMemo(() => scoreToStage(answers), [answers]);
  const stageKey: StageKey = preview ?? result.stage;
  const stage = STAGES[stageKey];

  /** Focus moves to the new step so screen readers land on its heading. */
  const go = useCallback((next: Step, announce?: string) => {
    setStep(next);
    setAnnouncement(announce ?? '');
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => stepRef.current?.focus());
  }, []);

  const answerAndAdvance = (factor: FactorKey, index: number) => {
    const value = (index + 1) as 1 | 2 | 3;
    setAnswers((prev) => ({ ...prev, [factor]: value }));
    setErrorFor(null);
    const next = STEPS[STEPS.indexOf(factor) + 1];
    go(next);
  };

  const tryAdvance = (factor: FactorKey) => {
    if (!answers[factor]) {
      setErrorFor(factor);
      setAnnouncement('Select an answer to continue.');
      return;
    }
    go(STEPS[STEPS.indexOf(factor) + 1]);
  };

  const submitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    const looksLikeEmail = value.indexOf('@') > 0 && value.lastIndexOf('.') > value.indexOf('@');
    if (!looksLikeEmail) {
      setEmailError(true);
      setAnnouncement('Enter an email address so we can send your result.');
      return;
    }
    setEmailError(false);
    setUnlocked(true);
    setAnnouncement('Your full result is now shown below.');
    window.requestAnimationFrame(() => guidanceRef.current?.focus());
  };

  const restart = () => {
    setAnswers({ hope: undefined, collaboration: undefined, leadership: undefined, progress: undefined, resilience: undefined });
    setUnlocked(false);
    setEmail('');
    setEmailError(false);
    setFeedback(null);
    go('start');
  };

  const factorIndex = FACTOR_ORDER.indexOf(step as FactorKey);
  const isQuestion = factorIndex >= 0;

  return (
    <>
      <header className={styles.bar}>
        <div className="wrap">
          <Link href="/" aria-label="Back to the assessment overview">
            <Image src="/logo/primary-logo-black.png" alt="Imagine Cities" width={160} height={62} className={styles.logo} />
          </Link>
        </div>
      </header>

      <main className="wrap">
        <p className="srOnly" role="status" aria-live="polite">
          {announcement}
        </p>

        <section ref={stepRef} tabIndex={-1} className={styles.step} aria-labelledby="step-heading">
          {step === 'start' && (
            <>
              <h1 id="step-heading">Neighbourhood Adaptability Assessment</h1>
              <p>Five questions, about five minutes.</p>
              <p className={styles.muted}>
                There are no right answers, and nothing here is a score. Answer from what you see around you.
              </p>
              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => go('context')}>
                  Start the assessment
                </button>
              </div>
            </>
          )}

          {step === 'context' && (
            <>
              <p className={styles.progress}>Before we start</p>
              <h1 id="step-heading">
                <span className="icon iconHeading" aria-hidden="true">
                  place
                </span>
                Tell us about your neighbourhood
              </h1>
              <p>This helps us understand the local context behind your assessment. This is optional.</p>
              <div className={styles.field}>
                <label htmlFor="postal">Postal code (optional)</label>
                <input id="postal" name="postal" type="text" autoComplete="postal-code" maxLength={7} />
              </div>
              <div className={styles.field}>
                <label htmlFor="hood">Neighbourhood name (optional)</label>
                <input id="hood" name="hood" type="text" autoComplete="address-level3" />
              </div>
              <p className={styles.muted}>We use this to understand where our tools are being used, and to improve them.</p>
              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => go('hope')}>
                  Continue
                </button>
                <button className={`${styles.btn} ${styles.btnQuiet}`} onClick={() => go('hope')}>
                  Skip
                </button>
              </div>
            </>
          )}

          {isQuestion && (
            <QuestionStep
              factor={step as FactorKey}
              index={factorIndex}
              selected={answers[step as FactorKey]}
              showError={errorFor === step}
              onSelect={(i) => answerAndAdvance(step as FactorKey, i)}
              onBack={() => go(STEPS[STEPS.indexOf(step) - 1])}
              onNext={() => tryAdvance(step as FactorKey)}
            />
          )}

          {step === 'result' && (
            <>
              <div className={`${styles.resultBand} ${styles[`ground-${stageKey}`]}`}>
                <h1 id="step-heading" className={styles.resultHeading}>
                  <span className="icon iconHeading" aria-hidden="true">
                    location_city
                  </span>
                  Your neighbourhood is in the <span className={styles.stageChip}>{stage.name}</span> stage
                </h1>
                <p>{stage.summary}</p>
              </div>

              <Spectrum annotation={{ kind: 'you-are-here', stage: stageKey }} />
              <StageList current={stageKey} />

              <p className={styles.reflection}>{stage.reflection}</p>

              {!unlocked ? (
                <div className={styles.gate}>
                  <h2>
                    <span className="icon iconHeading" aria-hidden="true">
                      lock
                    </span>
                    Get the rest of your result
                  </h2>
                  <p>
                    Your stage is above. Enter your email and we will unlock why your neighbourhood is there and
                    what to focus on next, and send you a copy to keep.
                  </p>
                  <form onSubmit={submitEmail} noValidate>
                    <div className={styles.field}>
                      <label htmlFor="email">
                        <span className="icon iconHeading" aria-hidden="true">
                          mail
                        </span>
                        Email address
                      </label>
                      <p className={styles.hint} id="email-hint">
                        We send your result and next steps to this address.
                      </p>
                      {emailError && (
                        <p className={styles.error} id="email-error">
                          Enter an email address so we can send your result.
                        </p>
                      )}
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        aria-describedby={emailError ? 'email-hint email-error' : 'email-hint'}
                        aria-invalid={emailError || undefined}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* Unbundled and unticked. Nothing on this page depends on it. */}
                    <div className={styles.consent}>
                      <input id="optin" name="optin" type="checkbox" />
                      <label htmlFor="optin">
                        Also send me related resources from Imagine Cities. You can unsubscribe at any time.
                        Leaving this unticked changes nothing about what you receive here.
                      </label>
                    </div>
                    <div className={styles.actions}>
                      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Show the rest
                      </button>
                    </div>
                  </form>
                  <p className={styles.muted}>This is a prototype. Nothing you enter is stored or sent.</p>
                </div>
              ) : (
                <div className={styles.guidance}>
                  <h2 ref={guidanceRef} tabIndex={-1}>
                    <span className="icon iconHeading" aria-hidden="true">
                      lock_open
                    </span>
                    Why you are in this stage
                  </h2>
                  <p>{stage.why}</p>
                  <h2>What to focus on next</h2>
                  <p>{stage.focus}</p>
                  <ul className={styles.nextSteps}>
                    {stage.steps.map((s) => (
                      <li key={s.title}>
                        <strong>{s.title}</strong>
                        <span>{s.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <section className={styles.feedback} aria-labelledby="feedback-heading">
                <h2 id="feedback-heading">
                  <span className="icon iconHeading" aria-hidden="true">
                    rate_review
                  </span>
                  Does this result feel accurate?
                </h2>
                <p className={styles.muted}>
                  Your neighbourhood knows itself best. Let us know how well this reflects what you see.
                </p>
                <div className={styles.scale}>
                  {FEEDBACK.map((option) => (
                    <button
                      key={option}
                      className={`${styles.btn} ${styles.btnQuiet} ${feedback === option ? styles.chosen : ''}`}
                      // aria-disabled rather than disabled: a truly disabled button drops
                      // focus to the body, throwing a screen-reader user out of the page at
                      // the moment we confirm their answer. The guard below prevents the
                      // second submission.
                      aria-disabled={feedback !== null || undefined}
                      aria-pressed={feedback === option}
                      onClick={() => {
                        if (feedback) return;
                        setFeedback(option);
                        setAnnouncement(`Thank you. You said this result feels ${option.toLowerCase()}.`);
                      }}
                    >
                      {feedback === option && <span aria-hidden="true">✓ </span>}
                      {option}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <p className={styles.muted}>
                    Thank you. You said this result feels {feedback.toLowerCase()}. Your response helps us improve
                    this tool.
                  </p>
                )}
              </section>

              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={restart}>
                  Start over
                </button>
              </div>

              {debug && (
                <p className={styles.muted}>
                  Reviewer view. Answers (hope, collaboration, leadership, progress, resilience):{' '}
                  {FACTOR_ORDER.map((f) => answers[f] ?? 1).join(', ')}. Result: {result.stage}, because{' '}
                  {result.why}. Provisional model, not validated methodology.
                </p>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="wrap">
        <p className={styles.muted}>
          The five stages come from the Harwood Institute&rsquo;s Stages of Community Life, part of their
          Community Rhythms research. The five factors are Imagine Cities&rsquo; own.
        </p>
      </footer>
    </>
  );
}

function QuestionStep({
  factor,
  index,
  selected,
  showError,
  onSelect,
  onBack,
  onNext,
}: {
  factor: FactorKey;
  index: number;
  selected: 1 | 2 | 3 | undefined;
  showError: boolean;
  onSelect: (optionIndex: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const data = FACTORS[factor];
  const errorId = `error-${factor}`;

  return (
    <div className={`${styles.qstep} ${styles[`ground-${factor}`]}`}>
      {/* Colours match the question grounds exactly; see docs/colour-emotion-map.md. */}
      <ol className={styles.qbar} aria-hidden="true">
        {FACTOR_ORDER.map((key, i) => (
          <li
            key={key}
            className={`${styles[`seg-${key}`]} ${i < index ? styles.segDone : ''} ${i === index ? styles.segCurrent : ''}`}
          />
        ))}
      </ol>
      <p className={styles.progress}>Question {index + 1} of 5</p>

      <div className={styles.qcard}>
        <fieldset className={styles.fieldset}>
          <p className={styles.factorName}>{data.name}</p>
          <legend id="step-heading" className={styles.legend}>
            <span className={styles.qRow}>
              <span className="icon" aria-hidden="true" style={{ fontSize: '1.6em', lineHeight: 1, marginTop: '0.1em' }}>
                {data.icon}
              </span>
              <span className={styles.qText}>{data.question}</span>
            </span>
          </legend>

          {showError && (
            <p className={styles.error} id={errorId}>
              Select an answer to continue.
            </p>
          )}

          <div className={styles.options}>
            {data.options.map((option, i) => (
              <div className={styles.option} key={option.short}>
                <input
                  type="radio"
                  id={`${factor}-${i}`}
                  name={factor}
                  value={i + 1}
                  checked={selected === i + 1}
                  aria-describedby={showError ? errorId : undefined}
                  onChange={() => onSelect(i)}
                />
                <label htmlFor={`${factor}-${i}`}>
                  <span className={styles.tick} aria-hidden="true">
                    ✓
                  </span>
                  <span className={styles.optionShort}>{option.short}</span>
                  <span className={styles.optionLong}>{option.long}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.btnQuiet}`} onClick={onBack}>
          Back
        </button>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNext}>
          {index === FACTOR_ORDER.length - 1 ? 'See my result' : 'Next question'}
        </button>
      </div>
    </div>
  );
}
