"use client";

import { useEffect, useRef } from "react";
import styles from "./AssessmentFlow.module.css";

/**
 * A standalone validation alert: Serene White on Bold Red, set at 20px bold because the
 * deck allows that pairing only at 14pt bold (18.7px) or larger. It sits outside the
 * coloured answer panel so the red never lands on a tint.
 *
 * No role="alert": the flow's polite live region already announces the same sentence,
 * and both would read it twice. The alert scrolls itself into view instead, since the
 * button that triggers it is below the choices and the alert is above them.
 */
export function Alert({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        ref.current?.scrollIntoView({
            block: "center",
            behavior: reduce ? "auto" : "smooth",
        });
    }, []);
    return (
        <div ref={ref} id={id} className={styles.alert}>
            <span className="icon" aria-hidden="true">
                error
            </span>
            <p>{children}</p>
        </div>
    );
}
