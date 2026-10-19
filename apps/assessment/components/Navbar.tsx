"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export const Navbar = () => {
    /*
     * Phones only: the toggle is display:none above 640px and the nav is always shown
     * there, so this state has no effect on desktop whatever its value.
     */
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Escape closes the menu and puts focus back on the toggle that opened it.
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            buttonRef.current?.focus();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className={`${styles.siteHeader} wrap`}>
            {/*
                Logo and product name are one link, so the whole lockup is the target
                rather than just the image.

                No aria-label. Both pages previously set one ("Imagine Cities home",
                "Back to the assessment overview"), which would now override the
                visible words and leave an accessible name that does not contain them,
                which is what WCAG 2.5.3 Label in Name exists to prevent. The name is
                the visible text: "Imagine Cities Neighbourhood Tools".

                Sentence case in the markup, uppercased in CSS. Some screen reader and
                voice control setups spell out runs of capitals letter by letter.
            */}
            <Link href="/" className={styles.lockup}>
                <Image
                    src="/logo/primary-logo-black.png"
                    alt="Imagine Cities"
                    width={200}
                    height={78}
                    priority
                    className={styles.logo}
                />
                <span className={styles.lockupSub}>Neighbourhood Tools</span>
            </Link>

            {/*
                A disclosure button, not role="menu": these are ordinary page links, and
                the menu role would promise arrow-key navigation they do not have. The
                name stays "Menu" in both states; aria-expanded carries open or closed.
            */}
            <button
                ref={buttonRef}
                type="button"
                className={styles.menuButton}
                aria-expanded={open}
                aria-controls="site-nav"
                aria-label="Menu"
                onClick={() => setOpen((value) => !value)}
            >
                <span className="icon" aria-hidden="true">
                    {open ? "close" : "menu"}
                </span>
            </button>

            {/* Closing on click covers links back to the page already showing, which do not remount the header. */}
            <nav
                id="site-nav"
                className={`${styles.nav} ${open ? styles.navOpen : ""}`}
                aria-label="Main"
                onClick={(event) => {
                    if ((event.target as HTMLElement).closest("a")) setOpen(false);
                }}
            >
                <Link href="/">Courses</Link>
                <Link href="/assessment">Assessments</Link>
                <Link href="/">Membership</Link>
                <Link href="/">About</Link>
            </nav>
        </header>
    );
};
