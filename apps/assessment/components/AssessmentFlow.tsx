"use client";

import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Link from "next/link";
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
import { ShareAssessment, TrackJourney } from "./ResultActions";
import styles from "./AssessmentFlow.module.css";

/*
 * No separate start screen: the intro page's "Start the assessment" link is the start,
 * so /assessment opens on the context step. A second screen repeating "five questions,
 * about five minutes" and another Start button only added a click.
 */
type Step = "context" | FactorKey | "result";
const STEPS: Step[] = ["context", ...FACTOR_ORDER, "result"];

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
     * ?stage=impasse jumps straight to that result, for reviewing copy.
     */
    const params = useSearchParams();
    const preview = useMemo(() => {
        const value = params.get("stage");
        return value && isStageKey(value) ? (value as StageKey) : null;
    }, [params]);
    const debug = params.get("debug") === "1";

    const [step, setStep] = useState<Step>(preview ? "result" : "context");
    const [answers, setAnswers] = useState<Answers>({
        hope: undefined,
        collaboration: undefined,
        leadership: undefined,
        progress: undefined,
        resilience: undefined,
    });
    const [postal, setPostal] = useState("");
    const [hood, setHood] = useState("");
    const [hasOrg, setHasOrg] = useState(false);
    const [org, setOrg] = useState("");
    const [errorFor, setErrorFor] = useState<FactorKey | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [announcement, setAnnouncement] = useState("");

    const stepRef = useRef<HTMLElement>(null);

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

    const clearContext = () => {
        setPostal("");
        setHood("");
        setHasOrg(false);
        setOrg("");
    };

    const restart = () => {
        setAnswers({
            hope: undefined,
            collaboration: undefined,
            leadership: undefined,
            progress: undefined,
            resilience: undefined,
        });
        setFeedback(null);
        clearContext();
        go("context");
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
                    {step === "context" && (
                        <>
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
                                behind your responses. This section is optional,
                                so you can skip it.
                            </p>
                            <div className={styles.field}>
                                <label htmlFor="postal">Postal code</label>
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
                                    Postal code, postcode or ZIP code, whichever
                                    applies to you.
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
                                <label htmlFor="hood">Neighbourhood name</label>
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
                A fieldset so the question is announced with the checkbox: on its own
                the checkbox would only be read as "Yes". The name field appears after
                the checkbox in the tab order, so focus is left where it is.
              */}
                            <fieldset className={styles.orgFieldset}>
                                <legend>
                                    Do you have a local organization tasked with
                                    meeting the local needs of your
                                    neighbourhood?
                                </legend>
                                <div className={styles.consent}>
                                    <input
                                        id="has-org"
                                        name="has-org"
                                        type="checkbox"
                                        checked={hasOrg}
                                        onChange={(e) =>
                                            setHasOrg(e.target.checked)
                                        }
                                    />
                                    <label htmlFor="has-org">Yes</label>
                                </div>
                                {hasOrg && (
                                    <div className={styles.field}>
                                        <label htmlFor="org">
                                            Name of the organization
                                        </label>
                                        <input
                                            id="org"
                                            name="org"
                                            type="text"
                                            autoComplete="organization"
                                            value={org}
                                            onChange={(e) =>
                                                setOrg(e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </fieldset>

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
                away. Two things stay visible no matter what:

                  - "This helps us understand the local context behind your
                    responses. This section is optional, so you can skip it."
                    above the fields, which is the purpose in brief and the only
                    place optionality is stated: the labels no longer say
                    "(optional)" and there is no Skip button, so Continue with
                    the fields empty is how a person skips
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
                                    <dt>Support local capacity building</dt>
                                    <dd>
                                        While we keep your identity and
                                        responses anonymous, we provide
                                        aggregated data to local organizations
                                        to help build local capacity to help
                                        residents thrive.
                                    </dd>
                                    <dt>Knowing where to focus our effort</dt>
                                    <dd>
                                        We have limited resources. Knowing the
                                        neighbourhood you reside in helps us
                                        focus our resources in the areas that
                                        want our support the most.
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
                                {/* A link, not a button: it leaves the flow for the intro page. */}
                                <Link
                                    className={`${styles.btn} ${styles.btnQuiet}`}
                                    href="/"
                                >
                                    Back
                                </Link>
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={() => go("hope")}
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {isQuestion && (
                        <QuestionStep
                            factor={step as FactorKey}
                            index={factorIndex}
                            answers={answers}
                            showError={errorFor === step}
                            onSelect={(i) => answer(step as FactorKey, i)}
                            onJump={(factor) => {
                                setErrorFor(null);
                                go(factor);
                            }}
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

                            {/*
                The guidance is open to everyone. It used to sit behind an email gate;
                the email is now an optional extra below, offered as a copy of the
                responses rather than as the price of the result.

                Icons sit to the left of their headings via the shared .headingLead /
                .iconLead pair in globals.css, which every section heading on the
                result page uses so they match. insights for the explanation, signpost
                for the direction: both verified against Google's Material Symbols
                metadata.
              */}
                            <div className={styles.guidance}>
                                <h2
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
                                <h2
                                    className={`${styles.guidanceHeading} headingLead`}
                                >
                                    <span
                                        className="icon iconLead"
                                        aria-hidden="true"
                                    >
                                        signpost
                                    </span>
                                    What to focus on next
                                </h2>
                                <p>{stage.focus}</p>
                                <ul className={`${styles.nextSteps} stagger`}>
                                    {stage.steps.map((s) => (
                                        <li key={s.title}>
                                            <strong>{s.title}</strong>
                                            <span>{s.detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* PRD screen 6. After the guidance, because it is what the guidance points at. */}
                            <Resources stage={stageKey} />

                            <TrackJourney announce={setAnnouncement} />

                            <ShareAssessment announce={setAnnouncement} />

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
                Finish is the gold pill and Start over stays quiet: finishing is the
                expected next move, and starting again discards the result the person
                just earned, so it should never look like the recommended one. Finish
                is a link because it leaves the flow for the intro page.
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
                                <Link
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    href="/"
                                >
                                    Finish
                                </Link>
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
                                    {postal || hood || org
                                        ? ` Context given: ${[postal, hood, org].filter(Boolean).join(", ")}.`
                                        : ""}
                                </p>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    );
}

function QuestionStep({
    factor,
    index,
    answers,
    showError,
    onSelect,
    onJump,
    onBack,
    onNext,
}: {
    factor: FactorKey;
    index: number;
    answers: Answers;
    showError: boolean;
    onSelect: (optionIndex: number) => void;
    onJump: (factor: FactorKey) => void;
    onBack: () => void;
    onNext: () => void;
}) {
    const data = FACTORS[factor];
    const selected = answers[factor];
    const errorId = `error-${factor}`;

    /*
     * A question can be jumped to if it has been answered, or if it is the first one
     * that has not. Anything past that stays locked, so the stepper cannot be used to
     * skip a question: Next is the only way forward over an unanswered one.
     */
    const firstOpen = FACTOR_ORDER.findIndex((key) => !answers[key]);
    const reachableUpTo = firstOpen === -1 ? FACTOR_ORDER.length - 1 : firstOpen;

    /*
     * The icon is sized to the question's rendered height, which changes with the
     * number of lines it wraps to, so CSS alone cannot get it. Written straight to the
     * element's style: it is layout, not state, and a re-render per resize buys nothing.
     *
     * It goes in as a custom property, not font-size, so the stylesheet can cap it and
     * ignore it on narrow screens. Uncapped side by side, it feeds back on itself: a
     * bigger icon narrows the question, which wraps taller, which grows the icon.
     */
    const iconRef = useRef<HTMLSpanElement>(null);
    const questionRef = useRef<HTMLSpanElement>(null);
    // A layout effect so the first size lands before paint, not one frame after it.
    useLayoutEffect(() => {
        const icon = iconRef.current;
        const question = questionRef.current;
        if (!icon || !question) return;
        const size = (height: number) =>
            icon.style.setProperty("--q-height", `${height}px`);
        size(question.getBoundingClientRect().height);
        const observer = new ResizeObserver(([entry]) =>
            size(entry.contentRect.height),
        );
        observer.observe(question);
        return () => observer.disconnect();
    }, []);

    /*
     * Options are stored weakest to strongest (the stored value is index + 1) and shown
     * strongest first. Reversing here keeps the scoring untouched.
     */
    const displayedOptions = data.options
        .map((option, i) => ({ option, i }))
        .reverse();

    return (
        <div className={`${styles.qstep} ${styles[`ground-${factor}`]}`}>
            {/*
              Segment colours match the question grounds exactly; see
              docs/colour-emotion-map.md. Completion is carried by the badge (a tick on
              Charcoal) and position by the ring and aria-current, never by colour alone.
            */}
            <nav aria-label="Assessment questions">
                <ol className={styles.qsteps}>
                    {FACTOR_ORDER.map((key, i) => {
                        const isCurrent = i === index;
                        const isDone = Boolean(answers[key]) && !isCurrent;
                        const isLocked = i > reachableUpTo;
                        return (
                            <li
                                key={key}
                                className={`${styles.qstepItem} ${isDone ? styles.qstepDone : ""} ${isCurrent ? styles.qstepCurrent : ""}`}
                            >
                                <button
                                    type="button"
                                    className={styles.qstepButton}
                                    aria-current={isCurrent ? "step" : undefined}
                                    disabled={isLocked}
                                    onClick={() => {
                                        if (!isCurrent) onJump(key);
                                    }}
                                >
                                    <span
                                        className={`${styles.qstepSeg} ${styles[`seg-${key}`]}`}
                                        aria-hidden="true"
                                    />
                                    <span className={styles.qstepRow}>
                                        <span
                                            className={styles.qstepBadge}
                                            aria-hidden="true"
                                        >
                                            {isDone ? (
                                                <span className="icon">check</span>
                                            ) : (
                                                i + 1
                                            )}
                                        </span>
                                        <span className={styles.qstepName}>
                                            <span className="srOnly">
                                                Question {i + 1}:{" "}
                                            </span>
                                            {FACTORS[key].name}
                                            {isDone && (
                                                <span className="srOnly">
                                                    , answered
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </nav>
            <p className={styles.progress}>Question {index + 1} of 5</p>

            {/*
              Outside the fieldset on purpose. A legend is announced whole when the
              fieldset gets focus, so folding the definition into it would make screen
              reader users hear it before every question. Ahead of the question in
              reading order, it is there for anyone who wants it and skippable for
              anyone who does not.
            */}
            <div className={styles.factorCard}>
                <span className="icon" aria-hidden="true">
                    info
                </span>
                <p>{data.blurb}</p>
            </div>

            <div className={styles.qcard}>
                <fieldset className={styles.fieldset}>
                    <legend id="step-heading" className={styles.legend}>
                        <span className={styles.qRow}>
                            <span
                                ref={iconRef}
                                className={`icon ${styles.qIcon}`}
                                aria-hidden="true"
                            >
                                {data.icon}
                            </span>
                            <span ref={questionRef} className={styles.qText}>
                                {data.question}
                            </span>
                        </span>
                    </legend>

                    {showError && (
                        <p className={styles.error} id={errorId}>
                            Select an answer to continue.
                        </p>
                    )}

                    <div className={`${styles.options} stagger`}>
                        {displayedOptions.map(({ option, i }) => (
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
