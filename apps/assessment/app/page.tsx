import Link from "next/link";
import Image from "next/image";
import { Spectrum, StageList } from "@/components/Spectrum";
import { Reveal } from "@/components/Reveal";
import styles from "./page.module.css";
import { Navbar } from "@/components/Navbar";

const PARTNERS = [
    {
        src: "/partners/hillhurst.png",
        alt: "Hillhurst Sunnyside Community Association",
    },
    { src: "/partners/sunalta.png", alt: "Sunalta Community Association" },
    { src: "/partners/kitsilano.png", alt: "Kitsilano Neighbourhood House" },
    { src: "/partners/marpole.png", alt: "Marpole Neighbourhood House" },
];

const WHAT_YOU_GET = [
    {
        title: "Where your neighbourhood stands",
        body: "Which of five stages best matches what you described, explained without jargon.",
    },
    {
        title: "Why it is there",
        body: "What shaped the result, and what that usually means for a neighbourhood like yours.",
    },
    {
        title: "What to do next",
        body: "Practical steps suited to where your neighbourhood actually is, not generic advice.",
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
                        <p className={styles.lede}>
                            Five questions, about five minutes. You get an
                            understanding of where your neighbourhood stands
                            today, and what to do about it.
                        </p>
                        <Link className={styles.cta} href="/assessment">
                            Start the assessment
                        </Link>
                        <p className={styles.meta}>
                            Free. No expertise needed. Your stage is shown
                            without signing up.
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

                <Reveal>
                    <section className="wrap">
                        {/* Each of these relationships still needs written confirmation before this ships. */}
                        <div className={styles.partners}>
                            <p>
                                Built with community associations in Calgary and
                                Vancouver
                            </p>
                            <ul role="list">
                                {PARTNERS.map((p) => (
                                    <li key={p.src}>
                                        <Image
                                            src={p.src}
                                            alt={p.alt}
                                            width={120}
                                            height={40}
                                            className={styles.partnerLogo}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className="wrap">
                        <div className={styles.why}>
                            <h2>
                                <span
                                    className="icon iconHeading"
                                    aria-hidden="true"
                                >
                                    lightbulb
                                </span>
                                Why This Matters
                            </h2>
                            {/*
                Not a blockquote. An earlier version put a paraphrase in quotation marks
                under a Harwood citation; the report's wording is "flounder or fail". With
                Harwood permission unresolved, this is plainly the page's own sentence
                reporting their finding.
              */}
                            <p className={styles.claim}>
                                The Harwood Institute found that most people act
                                as though their community is already growing,
                                and then wonder why so many initiatives flounder
                                or fail.
                            </p>
                            <p className={styles.source}>
                                Community Rhythms, 1999, from fieldwork in five
                                American cities.
                            </p>
                            <p className={styles.after}>
                                Strategies that work for a neighbourhood with
                                momentum tend to fail in one that is still
                                rebuilding trust. Knowing where yours actually
                                sits is what makes the difference between effort
                                that compounds and effort that disappears.
                            </p>
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className={`${styles.section} wrap`}>
                        <h2>
                            <span
                                className="icon iconHeading"
                                aria-hidden="true"
                            >
                                checklist
                            </span>
                            What You Get
                        </h2>
                        <ol className={styles.steps} role="list">
                            {WHAT_YOU_GET.map((item, i) => (
                                <li key={item.title}>
                                    <div
                                        className={styles.stepNumber}
                                        aria-hidden="true"
                                    >
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.body}</p>
                                    </div>
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
                                The Five Stages
                            </h2>
                            <p className={styles.framing}>
                                The assessment asks about{" "}
                                <strong>five factors</strong>: hope and
                                optimism, collaboration, leadership, progress,
                                and resilience. Your answers place your
                                neighbourhood in one of{" "}
                                <strong>five stages</strong>.
                            </p>
                            <Spectrum annotation={{ kind: "assumption" }} />
                            <StageList />
                            <p className={styles.note}>
                                This is not a score or a ranking. Neighbourhoods
                                move along this spectrum in both directions, and
                                a stage can be temporary. Reaching Impasse is a
                                step forward from the Waiting Place, because the
                                problem has become clear enough to act on.
                            </p>
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className="wrap">
                        <div className={styles.closing}>
                            <h2>
                                <span
                                    className="icon iconHeading"
                                    aria-hidden="true"
                                >
                                    location_city
                                </span>
                                See Where Your Neighbourhood Stands
                            </h2>
                            {/* 24px, not 20px: Serene White on Deep Azure is 6.30:1, which the deck
                  permits only at 18pt regular or 14pt bold. 18pt is 24px. */}
                            <p className={styles.closingLede}>
                                Five questions, about five minutes. You will get
                                something concrete to bring to your next
                                conversation, and a result that is a reflection
                                rather than a verdict.
                            </p>
                            <Link
                                className={`${styles.cta} ${styles.ctaOnAzure}`}
                                href="/assessment"
                            >
                                Start the assessment
                            </Link>
                        </div>
                    </section>
                </Reveal>
            </main>

            <footer className="wrap">
                <p className={styles.footerText}>
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
