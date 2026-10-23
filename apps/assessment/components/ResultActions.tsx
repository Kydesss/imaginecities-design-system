"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import styles from "./AssessmentFlow.module.css";

type Announce = (message: string) => void;

/**
 * Optional, after the result. The email is offered for a copy of the results, not as
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
                "Enter an email address to receive a copy of your results.",
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
                Receive a copy of your results
            </h2>
            <p>Provide your email address to receive a copy of your results.</p>

            {sentTo ? (
                <p
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={styles.confirmation}
                    role="status"
                >
                    <strong>Thank you.</strong> A copy of your results will go
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
                                your results.
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
                    {/*
                      The newsletter is a separate, unticked opt-in (CASL express
                      consent). Nothing about the copy of the results depends on it.
                    */}
                    <div className={styles.consent}>
                        <input id="optin" name="optin" type="checkbox" />
                        <label htmlFor="optin">
                            Sign up for updates about our work. You can
                            unsubscribe at any time.
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

/**
 * Sharing the TOOL, never the reader's result. The link is the intro page, so a
 * neighbour arrives at the explanation rather than the first question, and nothing in
 * the link or the message says what anyone scored.
 *
 * No form for neighbours' names or emails: collecting a third party's address to
 * message them brings in CASL's referral rules and PIPEDA consent for someone who
 * never visited. Copying hands the link to the reader's own clipboard; this site
 * transmits and stores nothing about the neighbour.
 *
 * Copy link is the only action. The native share sheet and the WhatsApp, Facebook and
 * Email links that used to sit beside it were removed per client feedback.
 */
export function ShareAssessment({ announce }: { announce: Announce }) {
    // useSyncExternalStore with a server snapshot, so the server and the first client
    // render agree on the link.
    const origin = useSyncExternalStore(
        noSubscribe,
        () => window.location.origin,
        () => "",
    );
    const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

    const url = `${origin}/`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied("copied");
            announce("Assessment link copied.");
        } catch {
            setCopied("failed");
            announce(`Could not copy the link. It is ${url}`);
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
            <p className={styles.muted}>
                This shares a link to the assessment only. Your results are not
                included.
            </p>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={copy}
                >
                    <span className="icon" aria-hidden="true">
                        {copied === "copied" ? "check" : "link"}
                    </span>
                    {copied === "copied"
                        ? "Link copied"
                        : "Copy assessment link"}
                </button>
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
