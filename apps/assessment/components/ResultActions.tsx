"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import styles from "./AssessmentFlow.module.css";

type Announce = (message: string) => void;

/**
 * Optional, after the result. The email is offered for a copy of the responses, not as
 * the price of the result: the guidance above is already open. Copy is the president's.
 *
 * Still a prototype: nothing is stored or sent, and the confirmation says so.
 */
export function TrackJourney({ announce }: { announce: Announce }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);
    const confirmationRef = useRef<HTMLParagraphElement>(null);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const value = email.trim();
        const looksLikeEmail =
            value.indexOf("@") > 0 &&
            value.lastIndexOf(".") > value.indexOf("@");
        if (!looksLikeEmail) {
            setError(true);
            announce(
                "Enter an email address to receive a copy of your responses.",
            );
            return;
        }
        setError(false);
        setSentTo(value);
        // The form is replaced by the confirmation, so focus would otherwise drop to the body.
        window.requestAnimationFrame(() => confirmationRef.current?.focus());
    };

    return (
        <section className={styles.emailPanel} aria-labelledby="track-heading">
            <h2 id="track-heading" className="headingLead">
                <span className="icon iconLead" aria-hidden="true">
                    history
                </span>
                Track your neighbourhood&rsquo;s journey over time
            </h2>
            <p>
                Provide your email address to receive a copy of your responses.
                We will set up user accounts in the future which will allow you
                to track your responses over time and see if there has been any
                change in your neighbourhood&rsquo;s capacity to solve local
                problems.
            </p>

            {sentTo ? (
                <p
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={styles.confirmation}
                    role="status"
                >
                    <strong>Thank you.</strong> A copy of your responses will go
                    to {sentTo}. This is a prototype, so nothing has actually
                    been sent.
                </p>
            ) : (
                <form onSubmit={submit} noValidate>
                    <div className={styles.field}>
                        <label htmlFor="email">Email address</label>
                        {error && (
                            <p className={styles.error} id="email-error">
                                Enter an email address to receive a copy of
                                your responses.
                            </p>
                        )}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            aria-describedby={error ? "email-error" : undefined}
                            aria-invalid={error || undefined}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Unbundled and unticked. Nothing on this page depends on it. */}
                    <div className={styles.consent}>
                        <input id="optin" name="optin" type="checkbox" />
                        <label htmlFor="optin">
                            Also send me related resources from Imagine Cities.
                            You can unsubscribe at any time. Leaving this
                            unticked changes nothing about what you receive
                            here.
                        </label>
                    </div>
                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            Send me a copy
                        </button>
                    </div>
                    <p className={styles.muted}>
                        This is a prototype. Nothing you enter is stored or
                        sent. Remove this paragraph later*.
                    </p>
                </form>
            )}
        </section>
    );
}

const noSubscribe = () => () => {};

const SHARE_TITLE = "Neighbourhood Adaptability Assessment";
const SHARE_TEXT =
    "I took the Neighbourhood Adaptability Assessment from Imagine Cities: five questions, about five minutes, on how our neighbourhood solves local problems. Take it too:";

/**
 * A share link, not a form for neighbours' names and emails. Collecting a third
 * party's address to email them on someone else's behalf brings in CASL's referral
 * rules and PIPEDA consent for a person who never visited; sharing from the reader's
 * own phone or mail client collects nothing about the neighbour at all.
 *
 * The link is the intro page, not /assessment, so a neighbour arrives at the
 * explanation rather than the first question.
 */
export function ShareAssessment({ announce }: { announce: Announce }) {
    // useSyncExternalStore with a server snapshot, so the server and the first client
    // render agree and the native share button appears only where it will work.
    const origin = useSyncExternalStore(
        noSubscribe,
        () => window.location.origin,
        () => "",
    );
    const canShare = useSyncExternalStore(
        noSubscribe,
        () => typeof navigator.share === "function",
        () => false,
    );
    const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

    const url = `${origin}/`;
    const mailto = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied("copied");
            announce("Link copied.");
        } catch {
            setCopied("failed");
            announce(`Could not copy the link. It is ${url}`);
        }
    };

    const share = async () => {
        try {
            await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
        } catch {
            // Dismissing the share sheet rejects too; there is nothing to report.
        }
    };

    return (
        <section className={styles.sharePanel} aria-labelledby="share-heading">
            <h2 id="share-heading" className="headingLead">
                <span className="icon iconLead" aria-hidden="true">
                    share
                </span>
                Share our assessment with your neighbours
            </h2>
            {/*
              The president's copy, with "Share their name and email address and we'll
              send them the assessment" replaced to match a share link.
            */}
            <p>
                Want to compare your responses with other neighbours? Share the
                assessment with them. Once a year, we will publish a report that
                will show your responses in comparison to your neighbours. We
                will not share user-specific information. To ensure privacy, we
                will only share aggregated data in our report.
            </p>
            <div className={styles.actions}>
                {canShare && (
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={share}
                    >
                        <span className="icon" aria-hidden="true">
                            ios_share
                        </span>
                        Share
                    </button>
                )}
                <button
                    type="button"
                    className={`${styles.btn} ${canShare ? styles.btnQuiet : styles.btnPrimary}`}
                    onClick={copy}
                >
                    <span className="icon" aria-hidden="true">
                        {copied === "copied" ? "check" : "link"}
                    </span>
                    {copied === "copied" ? "Link copied" : "Copy link"}
                </button>
                <a className={`${styles.btn} ${styles.btnQuiet}`} href={mailto}>
                    <span className="icon" aria-hidden="true">
                        mail
                    </span>
                    Email it
                </a>
            </div>
            {copied === "failed" && (
                <p>
                    Copying did not work in this browser. The link is{" "}
                    <span className={styles.shareLink}>{url}</span>
                </p>
            )}
        </section>
    );
}
