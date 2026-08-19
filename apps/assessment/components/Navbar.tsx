import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export const Navbar = () => {
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
            <nav className={styles.nav} aria-label="Main">
                <Link href="/">Courses</Link>
                <Link href="/assessment">Assessments</Link>
                <Link href="/">Membership</Link>
                <Link href="/">About</Link>
            </nav>
        </header>
    );
};
