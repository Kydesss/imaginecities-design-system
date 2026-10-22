import Link from "next/link";
import Image from "next/image";
import { Spectrum, StageList } from "@/components/Spectrum";
import { Reveal } from "@/components/Reveal";
import styles from "./page.module.css";
import { Navbar } from "@/components/Navbar";

const PILLARS = [
    {
        title: "Capacity",
        icon: "domain",
        body: "Not all neighbourhoods are created equal. While some possess the resources needed for residents to flourish, others face significant local deficits.",
    },
    {
        title: "Reflection",
        icon: "psychology",
        body: "How well-equipped is your neighbourhood to support residents? Given fluctuating government and charitable funding, reflect on how your neighbourhood's capacity to bridge critical service gaps and sustain long-term resilience.",
    },
    {
        title: "Insight",
        icon: "lightbulb",
        body: "What steps can your neighbourhood take to build a stronger foundation? Identify local gaps today to create an environment where future generations can thrive.",
    },
];

/*
 * Supporting imagery for the introduction. NO PHOTOGRAPHS ARE SUPPLIED YET, so every
 * entry renders a labelled placeholder rather than a stock or AI image: the hero note
 * below explains why a generic photograph works against this page. To add one, put the
 * file in public/imagery/ and set `src` and `alt`; the tile switches over by itself.
 *
 * Kept off the assessment steps on purpose. Their icons carry enough, and a photo per
 * question would slow the part people need to get through.
 */
const INTRO_IMAGERY: {
    theme: string;
    icon: string;
    brief: string;
    src: string | null;
    alt: string;
}[] = [
    {
        theme: "Collaboration",
        icon: "groups",
        brief: "Neighbours working on something together",
        src: null,
        alt: "",
    },
    {
        theme: "Creativity",
        icon: "palette",
        brief: "A local mural, market or community project",
        src: null,
        alt: "",
    },
    {
        theme: "Parks",
        icon: "park",
        brief: "People using a neighbourhood park",
        src: null,
        alt: "",
    },
    {
        theme: "Transit",
        icon: "directions_bus",
        brief: "A local stop, bike lane or main street",
        src: null,
        alt: "",
    },
];

export default function IntroPage() {
    return (
        <>
            <Navbar />

            <main>
                <section className={`${styles.hero} wrap riseIn`}>
                    <div>
                        <h1 className={styles.h1}>
                            Is Your{" "}
                            <span className={styles.goldWord}>
                                Neighbourhood
                            </span>{" "}
                            Ready for What&rsquo;s Next?
                        </h1>
                        <p className={styles.heroSupport}>
                            Get an understanding of your neighbourhood&apos;s
                            capacity to build and maintain a thriving future.
                        </p>
                        <p className={styles.lede}>
                            Five questions, takes about five minutes.
                        </p>
                        <Link className={styles.cta} href="/assessment">
                            Start the assessment
                        </Link>
                        <p className={styles.meta}>
                            For residents. It&apos;s free. No expertise needed.
                        </p>
                    </div>

                    {/*
            DELIBERATELY A PLACEHOLDER. The image that was here came from Imagine
            Cities' own home page, which made it seem safe: it is Sheep Meadow in
            Central Park, with the Manhattan skyline behind it, and nobody in it is
            talking to anybody. A New York stock photograph on a page whose argument is
            local familiarity, under a logo built from the Calgary Tower. Their other
            banner is a stock cafe interior. Both are recorded in
            source/observed-website.md.
          */}
                    <figure className={styles.heroFigure}>
                        {/* AI Image placeholder - delete later */}
                        <Image
                            className={styles.heroImage}
                            src="/hero.png"
                            alt="A real Calgary neighbourhood"
                            width={450}
                            height={340}
                        />
                        {/*
                            figcaption, not caption. caption is only valid as the
                            first child of a table, so the HTML parser discards it
                            here: the server sent it, the browser dropped it, React
                            found a tree that did not match and hydration failed for
                            the whole page. That took the intro page off server
                            rendering entirely.
                        */}
                        <figcaption className={styles.heroCaption}>
                            AI image placeholder - replace with a real Calgary
                            neighbourhood photo before launch
                        </figcaption>
                    </figure>
                </section>

                <section
                    className={`${styles.imagery} wrap`}
                    aria-label="Neighbourhood life"
                >
                    <ul className={styles.imageryGrid} role="list">
                        {INTRO_IMAGERY.map((item) => (
                            <li key={item.theme} className={styles.imageryTile}>
                                {item.src ? (
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        sizes="(max-width: 640px) 50vw, 25vw"
                                        className={styles.imageryImage}
                                    />
                                ) : (
                                    <div className={styles.imageryPlaceholder}>
                                        <span
                                            className={`icon ${styles.imageryIcon}`}
                                            aria-hidden="true"
                                        >
                                            {item.icon}
                                        </span>
                                        <span className={styles.imageryTheme}>
                                            {item.theme}
                                        </span>
                                        <span className={styles.imageryBrief}>
                                            Photo to come: {item.brief.toLowerCase()}
                                        </span>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <Reveal>
                    <section className={`${styles.section} wrap`}>
                        <h2>
                            <span
                                className="icon iconHeading"
                                aria-hidden="true"
                            >
                                checklist
                            </span>
                            Three things this assessment helps you understand
                        </h2>
                        <ol className={styles.cards} role="list">
                            {PILLARS.map((item, i) => (
                                <li className={styles.card} key={item.title}>
                                    <div className={styles.cardHeading}>
                                        <span
                                            className={styles.cardNumber}
                                            aria-hidden="true"
                                        >
                                            0{i + 1}
                                        </span>
                                        <span
                                            className={`icon ${styles.cardIcon}`}
                                            aria-hidden="true"
                                        >
                                            {item.icon}
                                        </span>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </Reveal>

                <Reveal>
                    <section className="wrap">
                        <div className={styles.stagesBand}>
                            <h2>
                                <span
                                    className="icon iconHeading"
                                    aria-hidden="true"
                                >
                                    timeline
                                </span>
                                The Five Stages of Neighbourhood Life
                            </h2>
                            <Spectrum animateMovement />
                            {/*
                              No list of the five factors here. Each one is introduced on
                              its own question, with a description card, so naming all
                              five up front only added reading before the first click.
                            */}
                            <StageList />
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className={`${styles.assessmentCta} wrap`}>
                        <div>
                            <p className={styles.assessmentCtaTitle}>
                                Five questions, takes about five minutes.
                            </p>
                            <p className={styles.assessmentCtaMeta}>
                                For residents. It&apos;s free. No expertise
                                needed.
                            </p>
                        </div>
                        <Link className={styles.cta} href="/assessment">
                            Start the assessment
                        </Link>
                    </section>
                </Reveal>
            </main>

            <footer className="wrap">
                <p className={styles.footerText}>
                    The Five Stages of Neighbourhood Life come from the Harwood
                    Institute&apos;s Stages of Community Life, part of their{" "}
                    <a
                        href="https://theharwoodinstitute.org/report-catalog/community-rhythms-the-five-stages-of-community-life"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Community Rhythms
                    </a>{" "}
                    research.
                </p>
            </footer>
        </>
    );
}
