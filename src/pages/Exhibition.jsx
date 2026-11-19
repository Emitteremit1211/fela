
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Accessibility,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  IMAGE SOURCES                                                             */
/* -------------------------------------------------------------------------- */

const images = {
  // Your local images inside the public folder
  felaOne: "/fela-1.jpg",
  felabrationFlyer: "/fela-2.png",
  felaFour: "/fela-4.jpg",
  felaFive: "/fela-5.jpg",

  // Wikimedia Commons images
  felaPortrait:
    "https://commons.wikimedia.org/wiki/Special:FilePath/A_portrait_of_Fela_Kuti.jpg",

  family:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Family_Ransome_Kuti_c1940.jpg",

  shrine:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fela_New_Shrine,_Lagos.jpg",

  shrineTwo:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fela_New_Shrine,_Lagos_02.jpg",

  shrineFront:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Front_View_of_Fela_Shrine.jpg",
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER DATA                                                              */
/* -------------------------------------------------------------------------- */

const chapters = [
  {
    number: "01",
    title: "Early Years",
    subtitle: "Before the music, there was a beginning.",
    story:
      "Discover the early life of Fela Anikulapo-Kuti, from his childhood and family background to the experiences that helped shape the man and musician the world would come to know.",
    themes: [
      "Family and upbringing",
      "Early schooling and influences",
      "First steps into music",
    ],
    image: images.family,
    imageAlt: "The Ransome-Kuti family",
    imageCredit: "Ransome-Kuti family photograph",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Family_Ransome_Kuti_c1940.jpg",
    dark: false,
  },
  {
    number: "02",
    title: "Funmilayo Ransome-Kuti",
    subtitle: "The woman whose courage left a mark.",
    story:
      "Meet Funmilayo Ransome-Kuti, educator, activist and fearless campaigner. Explore the life of the woman whose convictions and courage formed an important part of Fela's story.",
    themes: [
      "Education and activism",
      "Leadership among women",
      "A lasting influence on her son",
    ],
    image: images.family,
    imageAlt: "The Ransome-Kuti family",
    imageCredit: "Ransome-Kuti family photograph",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Family_Ransome_Kuti_c1940.jpg",
    dark: true,
  },
  {
    number: "03",
    title: "Lagos Baby",
    subtitle: "A city. A sound. A way of life.",
    story:
      "Step into Lagos, the city that shaped Fela's world. Explore its restless energy, its people, its streets and the cultural atmosphere that became inseparable from his music.",
    themes: [
      "Streets, clubs and crowds",
      "The sound of the city",
      "The Shrine as a meeting place",
    ],
    image: images.shrine,
    imageAlt: "The New Afrika Shrine in Lagos",
    imageCredit: "New Afrika Shrine, Lagos",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos.jpg",
    dark: false,
  },
  {
    number: "04",
    title: "State Within A State",
    subtitle: "A world of his own.",
    story:
      "Enter the story of Kalakuta Republic, Fela's home and self-declared independent community. Discover the people, ideas and events that made it a powerful symbol of freedom and resistance.",
    themes: [
      "Life inside Kalakuta",
      "The people who lived there",
      "A symbol of independence",
    ],
    image: images.shrineTwo,
    imageAlt: "The New Afrika Shrine in Lagos",
    imageCredit: "New Afrika Shrine, Lagos",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos_02.jpg",
    dark: true,
  },
  {
    number: "05",
    title: "Fela by Design",
    subtitle: "The art behind the icon.",
    story:
      "Explore the striking visual identity surrounding Fela. From album covers and photography to clothing and creative collaborations, discover how art helped communicate the spirit of his music.",
    themes: [
      "Album cover art",
      "Photography and fashion",
      "Artists who shaped his image",
    ],
    image: images.felaFour,
    imageAlt: "Photograph of Fela Anikulapo-Kuti",
    imageCredit: "Photograph supplied for the exhibition",
    dark: false,
  },
  {
    number: "06",
    title: "State V. Fela",
    subtitle: "When music became an act of defiance.",
    story:
      "Follow Fela's turbulent relationship with the state. Through confrontation, arrests and resistance, discover the story of an artist who refused to remain silent in the face of injustice.",
    themes: [
      "Songs as protest",
      "Confrontations and arrests",
      "Speaking out against injustice",
    ],
    image: null,
    imageAlt: "",
    dark: true,
  },
  {
    number: "07",
    title: "Fela on Tour",
    subtitle: "Taking Afrobeat to the world.",
    story:
      "Travel through Fela's performances and international journeys. Experience how his music crossed borders, reached new audiences and carried the sound and message of Afrobeat across the world.",
    themes: [
      "Stages around the world",
      "Life on the road with the band",
      "New audiences for Afrobeat",
    ],
    image: images.shrineFront,
    imageAlt: "Front view of the Afrika Shrine",
    imageCredit: "Front view of Fela Shrine",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Front_View_of_Fela_Shrine.jpg",
    dark: false,
  },
  {
    number: "08",
    title: "Fela Lives",
    subtitle: "The music never stopped.",
    story:
      "Fela's influence continues to move through music, art, culture and activism. Discover how his ideas and sound continue to inspire new generations around the world.",
    themes: [
      "A new generation of artists",
      "Afrobeats and Afrobeat",
      "Legacy in art and activism",
    ],
    image: images.felaFive,
    imageAlt: "Photograph of Fela Anikulapo-Kuti",
    imageCredit: "Photograph supplied for the exhibition",
    dark: true,
  },
  {
    number: "09",
    title: "Merch",
    subtitle: "Take a piece of the experience home.",
    story:
      "Explore exhibition merchandise inspired by Fela's life, music and enduring legacy. A final opportunity to carry a reminder of the experience beyond the exhibition.",
    themes: [
      "Prints and posters",
      "Clothing and accessories",
      "Books and music",
    ],
    image: null,
    imageAlt: "",
    dark: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  TIMELINE                                                                  */
/* -------------------------------------------------------------------------- */

const timeline = [
  {
    year: "1938",
    text: "Born in Abeokuta into the Ransome-Kuti family.",
  },
  {
    year: "1958",
    text: "Travels to London to study music.",
  },
  {
    year: "1960s",
    text: "Returns to Nigeria and develops the sound that becomes Afrobeat.",
  },
  {
    year: "1970s",
    text: "Kalakuta Republic and the Shrine become the centre of his world.",
  },
  {
    year: "1977",
    text: "Kalakuta is attacked, a turning point in his confrontation with the state.",
  },
  {
    year: "1997",
    text: "Fela passes away in Lagos. His music and message live on.",
  },
];

/* -------------------------------------------------------------------------- */
/*  VISIT INFORMATION                                                         */
/* -------------------------------------------------------------------------- */

const visitInfo = [
  {
    icon: CalendarDays,
    label: "Exhibition dates",
    value: "26 October – 31 December 2026",
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "Institute of Contemporary African Art and Film, Ilorin",
  },
  {
    icon: Ticket,
    label: "Admission",
    value: "Free admission",
  },
];

const goodToKnow = [
  {
    icon: Clock,
    title: "How long to allow",
    text: "Plan for about two hours to move through all nine chapters at an easy pace.",
  },
  {
    icon: Users,
    title: "Visiting in a group",
    text: "Schools, families and community groups are welcome. Get in touch before you come so we can prepare.",
  },
  {
    icon: Accessibility,
    title: "Access",
    text: "Tell us what you need before your visit and we will help make it comfortable.",
  },
];

/* -------------------------------------------------------------------------- */
/*  MOTION                                                                    */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER VISUAL                                                            */
/* -------------------------------------------------------------------------- */

function ChapterVisual({ chapter }) {
  const [failed, setFailed] = useState(false);

  if (chapter.image && !failed) {
    return (
      <div className="group relative aspect-[5/4] overflow-hidden bg-neutral-300">
        <img
          src={chapter.image}
          alt={chapter.imageAlt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <span className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.25em] text-white">
          Chapter {chapter.number}
        </span>

        {chapter.imageCredit && (
          <span className="absolute bottom-5 right-5 max-w-[55%] text-right text-[10px] text-white/80">
            {chapter.imageCredit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[5/4] items-end overflow-hidden p-8 md:p-12 ${chapter.dark ? "bg-neutral-800" : "bg-[#e9e6df]"
        }`}
    >
      <span
        aria-hidden="true"
        className={`absolute -right-4 -top-16 select-none font-serif text-[15rem] leading-none opacity-[0.07] md:text-[19rem] ${chapter.dark ? "!text-white" : "!text-black"
          }`}
      >
        {chapter.number}
      </span>

      <div className="relative z-10">
        <span
          className={`text-xs uppercase tracking-[0.3em] ${chapter.dark ? "!text-[#d5ad73]" : "!text-neutral-500"
            }`}
        >
          Inside the exhibition
        </span>

        <p
          className={`mt-4 max-w-sm font-serif text-4xl leading-tight md:text-5xl ${chapter.dark ? "!text-white" : "!text-neutral-800"
            }`}
        >
          {chapter.title}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CHAPTER                                                                    */
/* -------------------------------------------------------------------------- */

function Chapter({ chapter, index }) {
  const reverse = index % 2 !== 0;
  const { dark } = chapter;

  return (
    <section
      id={`chapter-${chapter.number}`}
      className={`scroll-mt-20 px-6 md:px-12 ${dark
          ? "bg-[#151515] text-white"
          : "bg-[#faf9f6] text-neutral-900"
        }`}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto grid max-w-7xl items-center gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28"
      >
        <div className={reverse ? "md:order-2" : ""}>
          <ChapterVisual chapter={chapter} />
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          <span
            className={`text-sm tracking-[0.25em] ${dark ? "text-[#d5ad73]" : "text-[#a47b43]"
              }`}
          >
            CHAPTER {chapter.number}
          </span>

          <h2 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {chapter.title}
          </h2>

          <p
            className={`mt-6 font-serif text-2xl italic ${dark ? "text-neutral-300" : "text-neutral-500"
              }`}
          >
            {chapter.subtitle}
          </p>

          <p
            className={`mt-6 max-w-lg text-base leading-8 ${dark ? "text-neutral-300" : "text-neutral-600"
              }`}
          >
            {chapter.story}
          </p>

          <div
            className={`mt-9 max-w-lg border-t pt-6 ${dark ? "border-white/15" : "border-neutral-200"
              }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.25em] ${dark ? "text-neutral-500" : "text-neutral-400"
                }`}
            >
              In this chapter
            </p>

            <ul className="mt-4 space-y-3">
              {chapter.themes.map((theme) => (
                <li
                  key={theme}
                  className={`flex items-start gap-3 text-sm leading-6 ${dark ? "text-neutral-300" : "text-neutral-600"
                    }`}
                >
                  <span
                    className={`mt-2.5 h-px w-5 shrink-0 ${dark ? "bg-[#d5ad73]" : "bg-[#a47b43]"
                      }`}
                  />
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {!dark && index !== chapters.length - 1 && (
        <div className="mx-auto h-px max-w-7xl bg-neutral-200" />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FELABRATION FEATURE                                                       */
/* -------------------------------------------------------------------------- */

function FelabrationFeature() {
  const [failed, setFailed] = useState(false);

  return (
    <section className="overflow-hidden bg-[#f0eee8] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1fr_0.9fr] md:gap-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#a47b43]">
            A celebration of Fela's legacy
          </span>

          <h2 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Felabration
            <br />
            <span className="italic text-[#a47b43]">2026.</span>
          </h2>

          <p className="mt-7 font-serif text-3xl italic text-neutral-600">
            Who Are You?
          </p>

          <p className="mt-6 max-w-lg text-base leading-8 text-neutral-600">
            The spirit of Fela continues to inspire music, creativity,
            identity and cultural expression. Discover the celebration
            surrounding his legacy through Felabration 2026.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-neutral-400">
            Felabration 2026 · Who Are You?
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {!failed ? (
            <img
              src={images.felabrationFlyer}
              alt="Felabration 2026 — Who Are You? event flyer"
              loading="lazy"
              onError={() => setFailed(true)}
              className="mx-auto max-h-[680px] w-full max-w-[520px] object-contain shadow-2xl"
            />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-neutral-900 p-10 text-center text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#d5ad73]">
                  Felabration 2026
                </p>
                <p className="mt-6 font-serif text-5xl italic">
                  Who Are You?
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  IMAGE CREDITS                                                             */
/* -------------------------------------------------------------------------- */

function ImageCredits() {
  return (
    <section className="bg-[#111] px-6 py-12 text-white/60 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[#d5ad73]">
          Image acknowledgements
        </p>

        <p className="mt-4 max-w-3xl text-xs leading-7 text-white/50">
          Selected archival images on this page are sourced from Wikimedia
          Commons. Please consult each original file page for its licence
          and attribution information. Locally supplied images and the
          Felabration flyer should be credited according to their original
          source and permission.
        </p>

        <div className="mt-6 grid gap-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://commons.wikimedia.org/wiki/File:A_portrait_of_Fela_Kuti.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            Fela portrait artwork — AndeyWiki, CC0 1.0
          </a>

          <a
            href="https://commons.wikimedia.org/wiki/File:Family_Ransome_Kuti_c1940.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            Ransome-Kuti family photograph — public domain in Nigeria
          </a>

          <a
            href="https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            New Afrika Shrine — Kaizenify, public domain
          </a>

          <a
            href="https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos_02.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            New Afrika Shrine photograph 2 — Kaizenify, public domain
          </a>

          <a
            href="https://commons.wikimedia.org/wiki/File:Front_View_of_Fela_Shrine.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            Front View of Fela Shrine — Kaizenify, public domain
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function Exhibition() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden bg-[#faf9f6] text-neutral-900">
        {/* HERO */}
        <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-[#111]">
          <img
            src={images.felaOne}
            alt="Fela Anikulapo-Kuti"
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.src = images.felaPortrait;
            }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-12 md:pb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#e0bd8b]">
                Fela Anikulapo-Kuti · A Retrospective
              </p>

              <h1 className="max-w-5xl font-serif text-6xl leading-[0.95] text-white md:text-8xl lg:text-[112px]">
                Inside the
                <br />
                Exhibition<span className="text-[#d5ad73]">.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/75 md:text-lg">
                Nine chapters. One extraordinary life. Explore the story,
                music, struggles and legacy of one of Africa's most
                influential cultural icons.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#chapters"
                  className="group inline-flex items-center gap-4 border border-white/50 px-6 py-4 text-xs uppercase tracking-[0.2em] !text-white transition hover:border-[#d5ad73] hover:bg-[#d5ad73] hover:!text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5ad73]"
                >
                  <span className="!text-white group-hover:!text-black">
                    Explore the chapters
                  </span>

                  <ArrowDown
                    size={16}
                    className="!text-white group-hover:!text-black"
                  />
                </a>

                <span className="text-sm text-white/60">
                  26 October – 31 December 2026 · Ilorin · Free admission
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-[#f0eee8] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#a47b43]">
                The journey
              </span>

              <h2 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">
                A life beyond the music.
              </h2>
            </div>

            <div className="space-y-6 md:pt-10">
              <p className="max-w-2xl text-lg leading-9 text-neutral-600">
                Fela's story cannot be told through music alone. It is a
                story of family, identity, creativity, courage, resistance
                and influence. Through nine chapters, this retrospective
                invites visitors to encounter the many dimensions of his
                remarkable life and the world he helped shape.
              </p>

              <p className="max-w-2xl text-base leading-8 text-neutral-500">
                The chapters can be followed in order, from his earliest
                years to his lasting legacy, or explored in any order you
                like. Each one stands on its own and adds to the larger
                picture.
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="bg-[#faf9f6] px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <span className="text-xs uppercase tracking-[0.3em] text-[#a47b43]">
              A life in brief
            </span>

            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Key moments.
            </h2>

            <ol className="mt-12 grid gap-x-8 gap-y-10 border-t border-neutral-300 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {timeline.map((item) => (
                <li key={item.year}>
                  <p className="font-serif text-4xl text-[#a47b43]">
                    {item.year}
                  </p>

                  <p className="mt-3 max-w-xs leading-7 text-neutral-600">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CHAPTER INDEX */}
        <section
          id="chapters"
          className="scroll-mt-20 bg-[#f0eee8] px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl py-16 md:py-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#a47b43]">
              The exhibition journey
            </span>

            <h2 className="mt-4 font-serif text-5xl md:text-7xl">
              Nine chapters.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-neutral-500">
              Move through the moments, people and places that tell the
              story of Fela Anikulapo-Kuti. Select a chapter to jump
              straight to it.
            </p>

            <nav
              aria-label="Exhibition chapters"
              className="mt-12 grid gap-px border border-neutral-300 bg-neutral-300 sm:grid-cols-2 lg:grid-cols-3"
            >
              {chapters.map((chapter) => (
                <a
                  key={chapter.number}
                  href={`#chapter-${chapter.number}`}
                  className="group flex items-baseline justify-between gap-4 bg-[#f0eee8] p-6 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a47b43]"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-sm tracking-[0.2em] text-[#a47b43]">
                      {chapter.number}
                    </span>

                    <span className="font-serif text-xl text-neutral-800">
                      {chapter.title}
                    </span>
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-neutral-400 transition group-hover:text-[#a47b43]"
                  />
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* ALL NINE CHAPTERS */}
        {chapters.map((chapter, index) => (
          <Chapter
            key={chapter.number}
            chapter={chapter}
            index={index}
          />
        ))}

        {/* FELABRATION 2026 FLYER FEATURE */}
        <FelabrationFeature />

        {/* GOOD TO KNOW */}
        <section className="bg-[#f0eee8] px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <span className="text-xs uppercase tracking-[0.3em] text-[#a47b43]">
              Before you come
            </span>

            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Good to know.
            </h2>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {goodToKnow.map(({ icon: Icon, title, text }) => (
                <div key={title}>
                  <Icon className="mb-4 text-[#a47b43]" size={22} />

                  <h3 className="font-serif text-2xl text-neutral-800">
                    {title}
                  </h3>

                  <p className="mt-3 max-w-xs leading-7 text-neutral-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISIT CTA */}
        <section className="relative overflow-hidden bg-[#151515] px-6 py-24 text-white md:px-12 md:py-32">
          <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-14 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-7xl">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d5ad73]">
              Your journey starts here
            </span>

            <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
              Experience the story for yourself.
            </h2>

            <p className="mt-7 max-w-xl leading-8 text-neutral-400">
              Step into the world of Fela Anikulapo-Kuti and discover the
              extraordinary life behind the music.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/visit"
                className="inline-flex items-center gap-3 bg-[#d5ad73] px-7 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-white"
              >
                Plan your visit
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/gallery"
                className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                Explore the gallery
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-20 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3">
              {visitInfo.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <Icon className="mb-4 text-[#d5ad73]" size={20} />

                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    {label}
                  </p>

                  <p className="mt-2 font-serif text-xl">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE CREDITS */}
        <ImageCredits />
      </main>
    </MotionConfig>
  );
}
