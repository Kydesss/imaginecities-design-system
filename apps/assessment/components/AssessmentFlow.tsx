"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    FACTORS,
    FACTOR_ORDER,
    type Answers,
    type FactorKey,
} from "@/lib/factors";
import { STAGES, type StageKey, isStageKey } from "@/lib/stages";
import { scoreToStage } from "@/lib/scoring";
import { Spectrum, StageList } from "./Spectrum";
import { Resources } from "./Resources";
import styles from "./AssessmentFlow.module.css";

type Step = "start" | "context" | FactorKey | "result";
const STEPS: Step[] = ["start", "context", ...FACTOR_ORDER, "result"];

const FEEDBACK = [
    "Not accurate",
    "Somewhat accurate",
    "Very accurate",
] as const;
type Feedback = (typeof FEEDBACK)[number];
import { Navbar } from "./Navbar";

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
        const value = params.get("stage");
        return value && isStageKey(value) ? (value as StageKey) : null;
    }, [params]);
    const debug = params.get("debug") === "1";

    const [step, setStep] = useState<Step>(preview ? "result" : "start");
    const [answers, setAnswers] = useState<Answers>({
        hope: undefined,
        collaboration: undefined,
        leadership: undefined,
        progress: undefined,
        resilience: undefined,
    });
    const [postal, setPostal] = useState("");
    const [hood, setHood] = useState("");
    const [errorFor, setErrorFor] = useState<FactorKey | null>(null);
    const [unlocked, setUnlocked] = useState(Boolean(preview));
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [announcement, setAnnouncement] = useState("");

    const stepRef = useRef<HTMLElement>(null);
    const guidanceRef = useRef<HTMLHeadingElement>(null);

    const result = useMemo(() => scoreToStage(answers), [answers]);
    const stageKey: StageKey = preview ?? result.stage;
    const stage = STAGES[stageKey];

    /** Focus moves to the new step so screen readers land on its heading. */
    const go = useCallback((next: Step, announce?: string) => {
        setStep(next);
        setAnnouncement(announce ?? "");
        window.scrollTo(0, 0);
        window.requestAnimationFrame(() => stepRef.current?.focus());
    }, []);

    /*
     * Selecting records the answer and nothing else. Advancing is the Next button's job.
     *
     * This used to advance on select. That is faster to click through, but it takes the
     * decision away at the moment a person is most likely to reconsider: the option text
     * runs to a full sentence, and people commonly read all three, pick one, then reread.
     * Auto-advance turns that reread into a Back press, and for anyone using a keyboard
     * it is worse than that, since arrow keys move between radios in a group and every
     * pass through the options would fire a navigation.
     */
    const answer = (factor: FactorKey, index: number) => {
        const value = (index + 1) as 1 | 2 | 3;
        setAnswers((prev) => ({ ...prev, [factor]: value }));
        setErrorFor(null);
    };

    const tryAdvance = (factor: FactorKey) => {
        if (!answers[factor]) {
            setErrorFor(factor);
            setAnnouncement("Select an answer to continue.");
            return;
        }
        go(STEPS[STEPS.indexOf(factor) + 1]);
    };

    const submitEmail = (event: React.FormEvent) => {
        event.preventDefault();
        const value = email.trim();
        const looksLikeEmail =
            value.indexOf("@") > 0 &&
            value.lastIndexOf(".") > value.indexOf("@");
        if (!looksLikeEmail) {
            setEmailError(true);
            setAnnouncement(
                "Enter an email address so we can send your result.",
            );
            return;
        }
        setEmailError(false);
        setUnlocked(true);
        setAnnouncement("Your full result is now shown below.");
        window.requestAnimationFrame(() => guidanceRef.current?.focus());
    };

    const restart = () => {
        setAnswers({
            hope: undefined,
            collaboration: undefined,
            leadership: undefined,
            progress: undefined,
            resilience: undefined,
        });
        setUnlocked(false);
        setEmail("");
        setEmailError(false);
        setFeedback(null);
        setPostal("");
        setHood("");
        go("start");
    };

    const factorIndex = FACTOR_ORDER.indexOf(step as FactorKey);
    const isQuestion = factorIndex >= 0;

    return (
        <>
            <Navbar />

            <main className="wrap">
                <p className="srOnly" role="status" aria-live="polite">
                    {announcement}
                </p>

                {/*
          key={step} remounts the section on every step change, which is what replays
          the entrance animation. The focus move in go() runs inside a
          requestAnimationFrame, so it happens after the remount has reattached the
          ref and still lands on the new step.
        */}
                <section
                    key={step}
                    ref={stepRef}
                    tabIndex={-1}
                    className={`${styles.step} riseIn`}
                    aria-labelledby="step-heading"
                >
                    {step === "start" && (
                        <>
                            <h1 id="step-heading">
                                Neighbourhood Adaptability Assessment
                            </h1>
                            <p>Five questions, about five minutes.</p>
                            <p className={styles.muted}>
                                There are no right answers, and nothing here is
                                a score. Answer from what you see around you.
                            </p>
                            <div className={styles.actions}>
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={() => go("context")}
                                >
                                    Start the assessment
                                </button>
                            </div>
                        </>
                    )}

                    {step === "context" && (
                        <>
                            <p className={styles.progress}>Before we start</p>
                            <h1 id="step-heading">
                                <span
                                    className="icon iconHeading"
                                    aria-hidden="true"
                                >
                                    place
                                </span>
                                Tell us about your neighbourhood
                            </h1>
                            <p>
                                This helps us understand the local context
                                behind your assessment. This is optional.
                            </p>
                            <div className={styles.field}>
                                <label htmlFor="postal">
                                    Postal code (optional)
                                </label>
                                {/*
                  One field for both formats, and no branching on the city name. The PRD
                  asks whether entering a city could decide which format to ask for; it
                  should not. City names collide across countries (there is a London in
                  both), the branch fires on a typo, and it makes the earlier field
                  mandatory to reach the later one. Accepting either pattern costs
                  nothing and cannot be got wrong.

                  maxLength is 10, not 7: "T2N 1N4" is 7 but ZIP+4 "12345-6789" is 10,
                  so the old limit silently truncated American input.
                */}
                                <p className={styles.hint} id="postal-hint">
                                    Canadian postal code or US ZIP, whichever
                                    applies. Either format works.
                                </p>
                                <input
                                    id="postal"
                                    name="postal"
                                    type="text"
                                    autoComplete="postal-code"
                                    aria-describedby="postal-hint"
                                    maxLength={10}
                                    value={postal}
                                    onChange={(e) => setPostal(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="hood">
                                    Neighbourhood name (optional)
                                </label>
                                <input
                                    id="hood"
                                    name="hood"
                                    type="text"
                                    autoComplete="address-level3"
                                    value={hood}
                                    onChange={(e) => setHood(e.target.value)}
                                />
                            </div>

                            {/*
                PIPEDA principle 3: the purpose has to be identified at or before
                collection, in terms a person can actually understand. One vague line
                about "improving our tools" does not do that. This is the client's own
                "WHY WE ASK" copy from the user testing notes.

                COLLAPSED BY DEFAULT, AND THAT IS DELIBERATE RATHER THAN A SHORTCUT.
                Hiding a collection notice behind a click would normally be the wrong
                move, so the shape here is a layered notice, which is what the Office
                of the Privacy Commissioner's meaningful consent guidance actually
                asks for: the substance up front, the detail one predictable click
                away. Three things stay visible no matter what:

                  - "This helps us understand the local context behind your
                    assessment. This is optional." above the fields, which is the
                    purpose in brief
                  - both fields labelled "(optional)", with a Skip button
                  - the line about answers, not location, shaping the result

                What collapses is the elaboration, not the disclosure. If that top
                line is ever cut, this has to go back to being open by default.

                <details> rather than a button and state: it is keyboard operable,
                announces its own expanded state, and still opens with JavaScript off.
              */}
                            <details className={styles.whyWeAsk}>
                                {/*
                    The flex layout goes on the h2, not on the <summary>. Giving
                    <summary> a display other than list-item costs it its implicit
                    button role: it drops to a plain generic in the accessibility
                    tree, so the control stops announcing itself as a disclosure and
                    stops reporting expanded or collapsed. Verified by reading the
                    tree, which is the only way this shows up.

                    A heading is also the one non-phrasing thing <summary> is allowed
                    to contain, so wrapping the row in a div to get the same layout
                    would trade one problem for invalid markup.
                */}
                                <summary className={styles.whyWeAskSummary}>
                                    <h2 className={styles.whyWeAskRow}>
                                        <span
                                            className="icon iconHeading"
                                            aria-hidden="true"
                                        >
                                            help
                                        </span>
                                        <span className={styles.whyWeAskLabel}>
                                            Why we ask
                                        </span>
                                        <span
                                            className={`icon ${styles.whyWeAskChevron}`}
                                            aria-hidden="true"
                                        >
                                            expand_more
                                        </span>
                                    </h2>
                                </summary>
                                <dl>
                                    <dt>
                                        Understand where our products are being
                                        used
                                    </dt>
                                    <dd>
                                        Aggregated location data helps us
                                        understand where our products are being
                                        used so we can target our efforts to
                                        those neighbourhoods.
                                    </dd>
                                    <dt>Improve our products</dt>
                                    <dd>
                                        By focusing our effort in specific
                                        areas, we are able to make updates to
                                        our products to make it easier for our
                                        users to create neighbourhoods where
                                        they can thrive.
                                    </dd>
                                    <dt>Support future resources</dt>
                                    <dd>
                                        Over time, we aim to connect people in
                                        similar neighbourhoods and stages.
                                        Location is the first step toward that.
                                    </dd>
                                </dl>
                            </details>

                            {/*
                Outside the <details> on purpose. This is the reassurance that the
                fields above cannot affect the result, which is the thing someone
                deciding whether to skip needs, so it must not depend on opening a
                disclosure to read it.
              */}
                            <p
                                className={`${styles.muted} ${styles.contextNote}`}
                            >
                                Your answers to the assessment questions are what
                                shape your result, not your location. This step is
                                about context, not the assessment.
                            </p>

                            <div className={styles.actions}>
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={() => go("hope")}
                                >
                                    Continue
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnQuiet}`}
                                    onClick={() => {
                                        setPostal("");
                                        setHood("");
                                        go("hope");
                                    }}
                                >
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
                            onSelect={(i) => answer(step as FactorKey, i)}
                            onBack={() => go(STEPS[STEPS.indexOf(step) - 1])}
                            onNext={() => tryAdvance(step as FactorKey)}
                        />
                    )}

                    {step === "result" && (
                        <>
                            <div
                                className={`${styles.resultBand} ${styles[`ground-${stageKey}`]}`}
                            >
                                <h1
                                    id="step-heading"
                                    className={`${styles.resultHeading} headingLead`}
                                >
                                    <span
                                        className="icon iconLead"
                                        aria-hidden="true"
                                    >
                                        location_city
                                    </span>
                                    {/*
                            The sentence is wrapped so the flex row sees one item.
                            Left bare, "Your neighbourhood is in the", the stage chip
                            and "stage" would each become a separate flex item and the
                            sentence would break apart instead of wrapping.
                        */}
                                    <span>
                                        Your neighbourhood is in the{" "}
                                        <span className={styles.stageChip}>
                                            {stage.name}
                                        </span>{" "}
                                        stage
                                    </span>
                                </h1>
                                <p>{stage.summary}</p>
                            </div>

                            <Spectrum
                                annotation={{
                                    kind: "you-are-here",
                                    stage: stageKey,
                                }}
                            />
                            <StageList current={stageKey} />

                            <p className={styles.reflection}>
                                {stage.reflection}
                            </p>

                            {!unlocked ? (
                                <div className={styles.gate}>
                                    <h2 className="headingLead">
                                        <span
                                            className="icon iconLead"
                                            aria-hidden="true"
                                        >
                                            lock
                                        </span>
                                        Get the rest of your result
                                    </h2>
                                    <p>
                                        Your stage is above. Enter your email
                                        and we will unlock why your
                                        neighbourhood is there and what to focus
                                        on next, and send you a copy to keep.
                                    </p>
                                    <form onSubmit={submitEmail} noValidate>
                                        <div className={styles.field}>
                                            <label htmlFor="email">
                                                <span
                                                    className="icon iconHeading"
                                                    aria-hidden="true"
                                                >
                                                    mail
                                                </span>
                                                Email address
                                            </label>
                                            <p
                                                className={styles.hint}
                                                id="email-hint"
                                            >
                                                We send your result and next
                                                steps to this address.
                                            </p>
                                            {emailError && (
                                                <p
                                                    className={styles.error}
                                                    id="email-error"
                                                >
                                                    Enter an email address so we
                                                    can send your result.
                                                </p>
                                            )}
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                inputMode="email"
                                                required
                                                aria-describedby={
                                                    emailError
                                                        ? "email-hint email-error"
                                                        : "email-hint"
                                                }
                                                aria-invalid={
                                                    emailError || undefined
                                                }
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </div>
                                        {/* Unbundled and unticked. Nothing on this page depends on it. */}
                                        <div className={styles.consent}>
                                            <input
                                                id="optin"
                                                name="optin"
                                                type="checkbox"
                                            />
                                            <label htmlFor="optin">
                                                Also send me related resources
                                                from Imagine Cities. You can
                                                unsubscribe at any time. Leaving
                                                this unticked changes nothing
                                                about what you receive here.
                                            </label>
                                        </div>
                                        <div className={styles.actions}>
                                            <button
                                                type="submit"
                                                className={`${styles.btn} ${styles.btnPrimary}`}
                                            >
                                                Show the rest
                                            </button>
                                        </div>
                                    </form>
                                    <p className={styles.muted}>
                                        This is a prototype. Nothing you enter
                                        is stored or sent. Remove this paragraph
                                        later*.
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.guidance}>
                                    {/*
                        Icons sit to the left of their headings via the shared
                        .headingLead / .iconLead pair in globals.css, which every
                        section heading on the result page uses so they match.

                        lock_open is gone. It described the gate that had just been
                        passed, not what the section contains, and once the guidance
                        is open the lock is the least interesting thing about it.
                        insights for the explanation, signpost for the direction:
                        both verified against Google's Material Symbols metadata.
                    */}
                                    <h2
                                        ref={guidanceRef}
                                        tabIndex={-1}
                                        className={`${styles.guidanceHeading} headingLead`}
                                    >
                                        <span
                                            className="icon iconLead"
                                            aria-hidden="true"
                                        >
                                            insights
                                        </span>
                                        Why you are in this stage
                                    </h2>
                                    <p>{stage.why}</p>
                                    <h2 className={`${styles.guidanceHeading} headingLead`}>
                                        <span
                                            className="icon iconLead"
                                            aria-hidden="true"
                                        >
                                            signpost
                                        </span>
                                        What to focus on next
                                    </h2>
                                    <p>{stage.focus}</p>
                                    <ul
                                        className={`${styles.nextSteps} stagger`}
                                    >
                                        {stage.steps.map((s) => (
                                            <li key={s.title}>
                                                <strong>{s.title}</strong>
                                                <span>{s.detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/*
                PRD screen 6. After the guidance, because it is what the guidance
                points at. fadeIn rather than riseIn: it appears at the same moment the
                guidance does, and two blocks sliding up together reads as a jolt.
              */}
                            {unlocked && (
                                <div className="fadeIn">
                                    <Resources stage={stageKey} />
                                </div>
                            )}

                            <section
                                className={styles.feedback}
                                aria-labelledby="feedback-heading"
                            >
                                <h2 id="feedback-heading" className="headingLead">
                                    <span
                                        className="icon iconLead"
                                        aria-hidden="true"
                                    >
                                        rate_review
                                    </span>
                                    Does this result feel accurate?
                                </h2>
                                <p className={styles.muted}>
                                    Your neighbourhood knows itself best. Let us
                                    know how well this reflects what you see.
                                </p>
                                <div className={styles.scale}>
                                    {FEEDBACK.map((option) => (
                                        <button
                                            key={option}
                                            className={`${styles.btn} ${styles.btnQuiet} ${feedback === option ? styles.chosen : ""}`}
                                            // aria-disabled rather than disabled: a truly disabled button drops
                                            // focus to the body, throwing a screen-reader user out of the page at
                                            // the moment we confirm their answer. The guard below prevents the
                                            // second submission.
                                            aria-disabled={
                                                feedback !== null || undefined
                                            }
                                            aria-pressed={feedback === option}
                                            onClick={() => {
                                                if (feedback) return;
                                                setFeedback(option);
                                                setAnnouncement(
                                                    `Thank you. You said this result feels ${option.toLowerCase()}.`,
                                                );
                                            }}
                                        >
                                            {feedback === option && (
                                                <span aria-hidden="true">
                                                    ✓{" "}
                                                </span>
                                            )}
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                {feedback && (
                                    <p className={styles.muted}>
                                        Thank you. You said this result feels{" "}
                                        {feedback.toLowerCase()}. Your response
                                        helps us improve this tool.
                                    </p>
                                )}
                            </section>

                            {/*
                Quiet, not primary. Once the guidance is open this is the only button
                left on the page, and a gold pill would make starting again look like
                the recommended next move when it is the opposite: it discards the
                result the person just earned.
              */}
                            <div className={styles.actions}>
                                <button
                                    className={`${styles.btn} ${styles.btnQuiet}`}
                                    onClick={restart}
                                >
                                    <span className="icon" aria-hidden="true">
                                        restart_alt
                                    </span>
                                    Start over
                                </button>
                            </div>

                            {debug && (
                                <p className={styles.muted}>
                                    Reviewer view. Answers (hope, collaboration,
                                    leadership, progress, resilience):{" "}
                                    {FACTOR_ORDER.map(
                                        (f) => answers[f] ?? 1,
                                    ).join(", ")}
                                    . Result: {result.stage}, because{" "}
                                    {result.why}. Bands per the PRD Step 3
                                    {result.demoted
                                        ? ", with this prototype’s factor floors applied"
                                        : ""}
                                    .
                                    {postal || hood
                                        ? ` Context given: ${[postal, hood].filter(Boolean).join(", ")}.`
                                        : ""}
                                </p>
                            )}
                        </>
                    )}
                </section>
            </main>

            <footer className="wrap">
                <p className={styles.muted}>
                    The five stages come from the Harwood Institute&rsquo;s
                    Stages of Community Life, part of their{" "}
                    <a
                        href="https://theharwoodinstitute.org/report-catalog/community-rhythms-the-five-stages-of-community-life"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Community Rhythms
                    </a>{" "}
                    research. The five factors are Imagine Cities&rsquo; own.
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
                        className={`${styles[`seg-${key}`]} ${i < index ? styles.segDone : ""} ${i === index ? styles.segCurrent : ""}`}
                    />
                ))}
            </ol>
            <p className={styles.progress}>Question {index + 1} of 5</p>

            <div className={styles.qcard}>
                <fieldset className={styles.fieldset}>
                    <p className={styles.factorName}>{data.name}</p>
                    <legend id="step-heading" className={styles.legend}>
                        <span className={styles.qRow}>
                            <span
                                className="icon"
                                aria-hidden="true"
                                style={{
                                    fontSize: "1.6em",
                                    lineHeight: 1,
                                    marginTop: "0.1em",
                                }}
                            >
                                {data.icon}
                            </span>
                            <span className={styles.qText}>
                                {data.question}
                            </span>
                        </span>
                    </legend>

                    {/*
            Outside the legend on purpose. A legend is announced whole when the
            fieldset gets focus, so folding the blurb into it would make screen reader
            users hear the definition before every question. As a sibling it stays
            available to anyone who wants it and skippable for anyone who does not.
          */}
                    <p className={styles.factorBlurb}>{data.blurb}</p>

                    {showError && (
                        <p className={styles.error} id={errorId}>
                            Select an answer to continue.
                        </p>
                    )}

                    <div className={`${styles.options} stagger`}>
                        {data.options.map((option, i) => (
                            <div className={styles.option} key={option.short}>
                                <input
                                    type="radio"
                                    id={`${factor}-${i}`}
                                    name={factor}
                                    value={i + 1}
                                    checked={selected === i + 1}
                                    aria-describedby={
                                        showError ? errorId : undefined
                                    }
                                    onChange={() => onSelect(i)}
                                />
                                <label htmlFor={`${factor}-${i}`}>
                                    <span
                                        className={styles.tick}
                                        aria-hidden="true"
                                    >
                                        ✓
                                    </span>
                                    <span className={styles.optionShort}>
                                        {option.short}
                                    </span>
                                    <span className={styles.optionLong}>
                                        {option.long}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>

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
                    onClick={onNext}
                >
                    {index === FACTOR_ORDER.length - 1
                        ? "See my result"
                        : "Next question"}
                </button>
            </div>
        </div>
    );
}
