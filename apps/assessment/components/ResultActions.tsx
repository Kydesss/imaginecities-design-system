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
                    {/*
                      The newsletter is a separate, unticked opt-in (CASL express
                      consent). Nothing about the copy of the results depends on it.
                    */}
                    <div className={styles.consent}>
                        <input id="optin" name="optin" type="checkbox" />
                        <label htmlFor="optin">
                            Also send me the Imagine Cities newsletter. You can
                            unsubscribe at any time. Leaving this unticked does
                            not affect the copy of your results.
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
 * Sharing the TOOL, never the reader's result. The link is the intro page, so a
 * neighbour arrives at the explanation rather than the first question, and nothing in
 * the link or the message says what anyone scored.
 *
 * No form for neighbours' names or emails: collecting a third party's address to
 * message them brings in CASL's referral rules and PIPEDA consent for someone who
 * never visited. Everything here hands the link to the reader's own clipboard, app or
 * mail client; this site transmits and stores nothing about the neighbour.
 *
 * WhatsApp and Facebook are their public share URLs (wa.me and sharer.php): plain
 * links, no SDK, no third-party script on this page, so nothing loads or tracks until
 * the reader chooses one. The native share sheet that used to sit here is gone, per
 * the feedback asking for a single Copy assessment link action.
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
    const message = `${SHARE_TEXT} ${url}`;
    const links = [
        {
            label: "WhatsApp",
            icon: "chat",
            href: `https://wa.me/?text=${encodeURIComponent(message)}`,
            newTab: true,
        },
        {
            label: "Facebook",
            icon: "public",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            newTab: true,
        },
        {
            label: "Email",
            icon: "mail",
            href: `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(message)}`,
            newTab: false,
        },
    ];

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
                {links.map((link) => (
                    <a
                        key={link.label}
                        className={`${styles.btn} ${styles.btnQuiet}`}
                        href={link.href}
                        {...(link.newTab
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                    >
                        <span className="icon" aria-hidden="true">
                            {link.icon}
                        </span>
                        {link.label}
                        {link.newTab && (
                            <span className="srOnly"> (opens in a new tab)</span>
                        )}
                    </a>
                ))}
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
