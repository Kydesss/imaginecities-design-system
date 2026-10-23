"use client";

import Link from "next/link";
import { FACTORS, FACTOR_ORDER, type Answers } from "@/lib/factors";
import { STAGES, STAGE_ORDER, type StageKey } from "@/lib/stages";
import { Alert } from "./Alert";
import { Resources } from "./Resources";
import { ShareAssessment, TrackJourney } from "./ResultActions";
import { Spectrum } from "./Spectrum";
import styles from "./AssessmentFlow.module.css";

/*
 * The results journey, after question five:
 *
 *   1. ResultStep      the assigned stage, why, and "does this feel accurate?"
 *   2. ChooseStep      only on "no": all five stages, the reader picks one
 *   3. NextStepsStep   focus areas and resources for the stage the reader accepted
 *   4. DoneStep        thank you, an optional emailed copy, and a link to share the
 *                      tool (never the reader's results)
 *
 * The point of steps 1 and 2 is to get the reader to the stage they recognise, not to
 * measure how often the assessment is right. Nothing about the yes/no answer is stored
 * or sent: tracking it would need its own data and privacy design first.
 */

type Announce = (message: string) => void;

/** The heading sentence, shared by the result and next-steps bands. */
function StageHeading({ stage, lead }: { stage: StageKey; lead: string }) {
    return (
        <h1 id="step-heading" className={`${styles.resultHeading} headingLead`}>
            <span className="icon iconLead" aria-hidden="true">
                location_city
            </span>
            {/*
              The sentence is wrapped so the flex row sees one item. Left bare, the
              words, the stage chip and "stage" would each become a separate flex item
              and the sentence would break apart instead of wrapping.
            */}
            <span>
                {lead}{" "}
                <span className={styles.stageChip}>{STAGES[stage].name}</span>{" "}
                stage
            </span>
        </h1>
    );
}

export function ResultStep({
    stage,
    answers,
    onAccurate,
    onNotAccurate,
    onBack,
}: {
    stage: StageKey;
    answers: Answers;
    onAccurate: () => void;
    onNotAccurate: () => void;
    onBack: () => void;
}) {
    const data = STAGES[stage];
    const answered = FACTOR_ORDER.every((key) => answers[key]);

    return (
        <>
            <div className={`${styles.resultBand} ${styles[`ground-${stage}`]}`}>
                <StageHeading stage={stage} lead="Your neighbourhood is in the" />
                <p>{data.summary}</p>
            </div>

            <Spectrum annotation={{ kind: "you-are-here", stage }} />

            <section className={styles.whyBlock} aria-labelledby="why-heading">
                <h2 id="why-heading" className="headingLead">
                    <span className="icon iconLead" aria-hidden="true">
                        insights
                    </span>
                    Why you&rsquo;re in this stage
                </h2>
                <p>{data.why}</p>

                {/*
                  The reader's own answers, as the concrete half of "why". Hidden in the
                  ?stage= preview, which jumps here without answering anything.
                */}
                {answered && (
                    <>
                        <h3 className={styles.answersHeading}>Your answers</h3>
                        <dl className={styles.answers}>
                            {FACTOR_ORDER.map((key) => {
                                const value = answers[key];
                                return (
                                    <div key={key}>
                                        <dt>{FACTORS[key].name}</dt>
                                        <dd>
                                            {value
                                                ? FACTORS[key].options[value - 1]
                                                      .short
                                                : ""}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </>
                )}
            </section>

            <section
                className={styles.accuracy}
                aria-labelledby="accuracy-heading"
            >
                <h2 id="accuracy-heading" className="headingLead">
                    <span className="icon iconLead" aria-hidden="true">
                        rate_review
                    </span>
                    Does this feel accurate?
                </h2>
                <p>
                    Your neighbourhood knows itself best. If this does not match
                    what you see, you can choose the stage that fits.
                </p>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={onAccurate}
                    >
                        Yes, show my next steps
                    </button>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnQuiet}`}
                        onClick={onNotAccurate}
                    >
                        No, let me choose
                    </button>
                </div>
            </section>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnQuiet}`}
                    onClick={onBack}
                >
                    Back to the questions
                </button>
            </div>
        </>
    );
}

export function ChooseStep({
    suggested,
    choice,
    showError,
    onChoose,
    onBack,
    onContinue,
}: {
    suggested: StageKey;
    choice: StageKey | null;
    showError: boolean;
    onChoose: (stage: StageKey) => void;
    onBack: () => void;
    onContinue: () => void;
}) {
    const errorId = "error-choose";
    return (
        <>
            <h1 id="step-heading">Which stage fits your neighbourhood?</h1>
            <p className={styles.contextIntro}>
                Read the five descriptions and choose the one closest to what
                you see. The assessment suggested{" "}
                <strong>{STAGES[suggested].name}</strong>. There is no wrong
                choice: you will get the next steps for the stage you pick.
            </p>

            {showError && <Alert id={errorId}>Choose a stage to continue.</Alert>}

            <fieldset className={styles.fieldset}>
                <legend className="srOnly">The five stages</legend>
                <div className={`${styles.options} stagger`}>
                    {STAGE_ORDER.map((key) => (
                        <div
                            className={`${styles.option} ${styles.stageOption} ${styles[`swatch-${key}`]}`}
                            key={key}
                        >
                            <input
                                type="radio"
                                id={`stage-${key}`}
                                name="stage"
                                value={key}
                                checked={choice === key}
                                aria-describedby={showError ? errorId : undefined}
                                onChange={() => onChoose(key)}
                            />
                            <label htmlFor={`stage-${key}`}>
                                <span className={styles.tick} aria-hidden="true">
                                    ✓
                                </span>
                                <span className={styles.optionShort}>
                                    {STAGES[key].name}
                                    {key === suggested && (
                                        <span className={styles.suggestedTag}>
                                            Assessment result
                                        </span>
                                    )}
                                </span>
                                <span className={styles.optionLong}>
                                    {STAGES[key].summary}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnQuiet}`}
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={onContinue}
                >
                    Show next steps
                </button>
            </div>
        </>
    );
}

export function NextStepsStep({
    stage,
    suggested,
    onBack,
    onFinish,
}: {
    stage: StageKey;
    /** what the assessment assigned, when the reader chose something else */
    suggested: StageKey | null;
    onBack: () => void;
    onFinish: () => void;
}) {
    const data = STAGES[stage];
    return (
        <>
            <div className={`${styles.resultBand} ${styles[`ground-${stage}`]}`}>
                <StageHeading stage={stage} lead="Next steps for the" />
                <p>{data.focus}</p>
                {suggested && (
                    <p className={styles.muted}>
                        You chose this stage. The assessment suggested{" "}
                        {STAGES[suggested].name}.
                    </p>
                )}
            </div>

            {/*
              One card per focus area rather than one long dark panel: each is a
              separate instruction, and a reader on a phone should be able to take
              them one at a time.
            */}
            <section aria-labelledby="focus-heading">
                <h2 id="focus-heading" className="headingLead">
                    <span className="icon iconLead" aria-hidden="true">
                        signpost
                    </span>
                    Take the next step in building and maintaining a thriving
                    neighbourhood
                </h2>
                <ol className={`${styles.focusGrid} stagger`} role="list">
                    {data.steps.map((item, i) => (
                        <li key={item.title} className={styles.focusCard}>
                            <span
                                className={styles.focusNumber}
                                aria-hidden="true"
                            >
                                {i + 1}
                            </span>
                            <h3>{item.title}</h3>
                            <p>{item.detail}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Imagine Cities resources first, then external reading. */}
            <Resources stage={stage} />

            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnQuiet}`}
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={onFinish}
                >
                    Finish
                </button>
            </div>
        </>
    );
}

export function DoneStep({
    announce,
    onBack,
    onRestart,
}: {
    announce: Announce;
    onBack: () => void;
    onRestart: () => void;
}) {
    return (
        <>
            <div className={styles.doneBand}>
                <h1 id="step-heading" className="headingLead">
                    <span className="icon iconLead" aria-hidden="true">
                        task_alt
                    </span>
                    Thank you for completing the assessment
                </h1>
            </div>

            {/*
              Optional, on the last step, after every result has been shown. Where
              email capture should sit is still being researched, so it does not move
              ahead of the results until that is settled.
            */}
            <TrackJourney announce={announce} />

            <ShareAssessment announce={announce} />

            {/*
              All quiet. The invitation to share is this step's one gold action, and
              Start over discards the result, so it should never look recommended.
            */}
            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnQuiet}`}
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnQuiet}`}
                    onClick={onRestart}
                >
                    <span className="icon" aria-hidden="true">
                        restart_alt
                    </span>
                    Start over
                </button>
                <Link className={`${styles.btn} ${styles.btnQuiet}`} href="/">
                    Back to home
                </Link>
            </div>
        </>
    );
}
