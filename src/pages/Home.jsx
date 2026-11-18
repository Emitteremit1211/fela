import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Play,
  Ticket,
} from "lucide-react";

// Only use images whose Wikimedia Commons records identify them as public domain.
// Family photograph: public domain in Nigeria. Shrine photographs: released worldwide.
const archiveImages = {
  family:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Family_Ransome_Kuti_c1940.jpg",

  shrine:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fela_New_Shrine,_Lagos.jpg",

  shrineView:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fela_New_Shrine,_Lagos_02.jpg",

  legacy:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Front_View_of_Fela_Shrine.jpg",
};

// Use the family photograph for the hero; /public/fela-3.jpg is deliberately not used
// because its reuse rights have not been established.
const heroImage = "/fela-3.jpg";

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */
const container = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-10";
const sectionPad = "py-20 sm:py-28 lg:py-32";

// Move this to keep Fela's face in frame (x% y%)
const HERO_POSITION = "50% 22%";

/* ------------------------------------------------------------------ */
/* Exhibition status (updates itself from the dates)                   */
/* ------------------------------------------------------------------ */
const START = new Date("2026-10-26T00:00:00");
const END = new Date("2026-12-31T23:59:59");

function getStatus() {
  const now = new Date();
  if (now < START) return "Opens 26 October 2026";
  if (now <= END) return "Now showing · Until 31 December";
  return "Exhibition has closed";
}

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
const exhibitionDetails = [
  {
    icon: CalendarDays,
    label: "Exhibition dates",
    value: "26 October – 31 December 2026",
  },
  {
    icon: Clock3,
    label: "Opening hours",
    value: "Tuesday – Sunday, 12 PM – 6 PM",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ilorin, Kwara State, Nigeria",
  },
  {
    icon: Ticket,
    label: "Admission",
    value: "Free admission",
  },
];

const marqueeItems = [
  "Afrobeat",
  "Kalakuta Republic",
  "The Afrika Shrine",
  "Photography",
  "Archival Film",
  "Music & Sound",
  "Legacy",
];

const exhibitionThemes = [
  {
    number: "01",
    title: "The Family & The Making",
    image: archiveImages.family,
    imageAlt: "The Ransome-Kuti family in an early 1940s photograph",
    description:
      "Explore the family history, formative experiences and influences that helped shape Fela's life and artistic vision.",
  },
  {
    number: "02",
    title: "The Sound of Afrobeat",
    image: archiveImages.shrine,
    imageAlt: "The New Afrika Shrine in Lagos",
    description:
      "Discover the development of Afrobeat, the musicians and collaborators behind its sound, and its influence across generations.",
  },
  {
    number: "03",
    title: "Kalakuta & The Shrine",
    image: archiveImages.shrineView,
    imageAlt: "Another exterior view of the New Afrika Shrine in Lagos",
    description:
      "Step into the cultural and political world of Kalakuta Republic and the Afrika Shrine, central spaces in Fela's life and work.",
  },
  {
    number: "04",
    title: "The Image & The Legacy",
    image: archiveImages.legacy,
    imageAlt: "Front view of the Afrika Shrine in Lagos",
    description:
      "Encounter the photography, artwork, performances and visual language that helped make Fela an enduring cultural figure.",
  },
];

// Please verify these against the curators' research before publishing.
const timeline = [
  {
    year: "1938",
    title: "Born in Abeokuta",
    text: "Fela Ransome-Kuti is born into a family of educators, activists and public figures.",
  },
  {
    year: "1958",
    title: "Music studies in London",
    text: "He travels to London to study music, laying the foundation for his work as a composer and bandleader.",
  },
  {
    year: "1969",
    title: "A turning point in the United States",
    text: "Encounters with the Black Power movement deepen his politics and sharpen the voice of his music.",
  },
  {
    year: "1971",
    title: "Performing in Ilorin",
    text: "On 30 August, Fela performs at Niger Hotel in Ilorin, a chapter that connects his story to this city.",
  },
  {
    year: "1970s",
    title: "Kalakuta & The Shrine",
    text: "His Lagos compound and the Afrika Shrine become centres of music, community and defiance.",
  },
  {
    year: "1977",
    title: "The Kalakuta raid",
    text: "The compound is attacked, a defining moment that shaped both his life and his later work.",
  },
  {
    year: "1997",
    title: "A legacy that endures",
    text: "Fela passes away on 2 August, leaving behind a body of work that continues to inspire new generations.",
  },
];

const galleryTiles = [
  {
    src: archiveImages.family,
    alt: "The Ransome-Kuti family, including Fela as a child",
    caption: "Family & Early Life",
    position: "50% 22%",
    span: "col-span-2 row-span-2",
  },
  {
    src: archiveImages.shrine,
    alt: "Exterior of the New Afrika Shrine in Lagos",
    caption: "The Shrine",
    position: "50% 50%",
    span: "",
  },
  {
    src: archiveImages.legacy,
    alt: "Front view of the New Afrika Shrine in Lagos",
    caption: "The Shrine & Its Legacy",
    position: "50% 40%",
    span: "",
  },
  {
    src: archiveImages.family,
    alt: "The Ransome-Kuti family in an early 1940s photograph",
    caption: "Family & History",
    position: "50% 42%",
    span: "col-span-2",
  },
];

/* ------------------------------------------------------------------ */
/* Animation                                                            */
/* ------------------------------------------------------------------ */
const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const inView = {
  variants: reveal,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
};

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                                */
/* (colours sit on the inner text so global `a:hover` rules can't win) */
/* ------------------------------------------------------------------ */
function Cta({ to, children, variant = "light", icon: Icon = ArrowUpRight }) {
  const styles = {
    light: {
      wrap: "bg-white hover:bg-neutral-900",
      text: "text-neutral-950 group-hover:text-white",
    },
    outlineLight: {
      wrap: "border border-white/60 hover:bg-white",
      text: "text-white group-hover:text-neutral-950",
    },
    dark: {
      wrap: "bg-neutral-900 hover:bg-amber-700",
      text: "text-white",
    },
    outlineDark: {
      wrap: "border border-neutral-900 hover:bg-neutral-900",
      text: "text-neutral-900 group-hover:text-white",
    },
  }[variant];

  return (
    <Link
      to={to}
      className={`group inline-flex items-center justify-center gap-4 px-7 py-4 transition-colors duration-300 ${styles.wrap}`}
    >
      <span
        className={`text-[10px] sm:text-xs uppercase tracking-[0.17em] font-semibold transition-colors duration-300 ${styles.text}`}
      >
        {children}
      </span>
      <Icon
        size={16}
        className={`transition-colors duration-300 ${styles.text}`}
      />
    </Link>
  );
}

function TextLink({ to, children, tone = "dark", icon: Icon = ArrowRight }) {
  const tones = {
    dark: "border-neutral-900 text-neutral-900",
    light: "border-white/60 text-white",
  }[tone];

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-4 pb-2.5 border-b hover:gap-6 transition-all duration-300 ${tones}`}
    >
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.17em] font-semibold">
        {children}
      </span>
      <Icon size={15} />
    </Link>
  );
}

function Eyebrow({ children, tone = "dark" }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="h-px w-8 bg-amber-700" />
      <p
        className={`text-[10px] uppercase tracking-[0.26em] ${tone === "dark" ? "text-neutral-500" : "text-neutral-400"
          }`}
      >
        {children}
      </p>
    </div>
  );
}

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="overflow-hidden bg-neutral-900 border-y border-neutral-800 py-5">
      <motion.div
        className="flex w-max items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-10 pr-10">
            <span className="display-font text-2xl sm:text-3xl text-neutral-300">
              {item}
            </span>
            <span className="text-[10px] text-amber-600">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="bg-white text-neutral-900 overflow-hidden">
      {/* HERO */}

      <section
        className="relative isolate left-1/2 flex min-h-[680px] h-[calc(100svh-72px)] xl:h-[calc(100svh-96px)] max-h-[980px] w-[100vw] max-w-[100vw] -translate-x-1/2 items-end overflow-hidden bg-neutral-950 text-white"
        style={{
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          width: "100vw",
          maxWidth: "100vw",
        }}
      >
        {/* Full-width hero image */}
        <img
          src={heroImage}
          alt="Fela Anikulapo-Kuti"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 z-0 block h-full w-full object-cover"
          style={{ objectPosition: HERO_POSITION }}
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/30 to-black/5 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/20 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-14 sm:pb-20 lg:pb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="max-w-5xl"
          >
            {/* Status badge */}
            <div className="inline-flex items-center gap-3 border border-white/25 bg-black/30 backdrop-blur-sm px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>

              <span className="text-[10px] uppercase tracking-[0.22em] text-white/90">
                {getStatus()}
              </span>
            </div>

            {/* Heading */}
            <h1 className="display-font text-[40px] min-[420px]:text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.9] tracking-[-0.04em] font-medium">
              Fela
              <br />
              Anikulapo-Kuti
            </h1>

            <div className="flex items-center gap-4 mt-6">
              <span className="h-px w-12 bg-amber-600" />

              <p className="display-font text-2xl sm:text-4xl md:text-5xl italic text-white/90">
                A Retrospective
              </p>
            </div>

            <p className="max-w-xl mt-7 text-sm sm:text-base text-white/75 leading-7">
              A celebration of the life, music, cultural influence and
              enduring legacy of one of Africa's most influential musicians
              and cultural figures.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <Cta to="/visit" variant="light">
                Plan Your Visit
              </Cta>

              <Cta to="/exhibition" variant="outlineLight">
                Explore the Exhibition
              </Cta>
            </div>
          </motion.div>

          {/* Location panel */}
          <div className="hidden xl:block absolute bottom-24 right-10 border-l border-white/30 pl-6 text-white/80">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">
              Institute of Contemporary
              <br />
              African Art and Film
            </p>

            <p className="display-font text-3xl mt-3 text-white">
              Ilorin
            </p>

            <p className="text-xs mt-2 tracking-wide">
              26 Oct – 31 Dec 2026 · Free
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-white/20" />
      </section>

      {/* KEYWORD TICKER */}
      <Marquee />

      {/* EXHIBITION DETAILS */}
      <section className="bg-neutral-200 border-b border-neutral-400/60">
        <div className={`${container} py-10 lg:py-12`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {exhibitionDetails.map((detail, index) => {
              const Icon = detail.icon;

              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex items-start gap-4 lg:px-6 lg:first:pl-0 lg:border-l lg:border-neutral-400/60 lg:first:border-l-0"
                >
                  <div className="w-10 h-10 shrink-0 border border-neutral-500/60 flex items-center justify-center text-neutral-800">
                    <Icon size={17} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      {detail.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-neutral-900">
                      {detail.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={sectionPad}>
        <div className={container}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <motion.div {...inView} className="lg:col-span-5">
              <Eyebrow>About the exhibition</Eyebrow>

              <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-[0.98] font-medium tracking-tight">
                More than
                <br />
                <span className="italic">music.</span>
                <br />
                A movement.
              </h2>
            </motion.div>

            <motion.div {...inView} className="lg:col-span-7 lg:pt-12">
              <p className="text-lg sm:text-xl leading-9 text-neutral-800">
                Fela Anikulapo-Kuti was a musician, composer, bandleader and
                outspoken cultural figure whose work transformed music and
                challenged the world around him.
              </p>

              <p className="mt-6 text-sm sm:text-base leading-8 text-neutral-600">
                Fela Anikulapo-Kuti: A Retrospective brings together the
                stories, sounds, images and objects that illuminate his
                extraordinary life. From his family history and the
                development of Afrobeat to his collaborators, performances
                and cultural spaces, the exhibition traces the many
                dimensions of his artistic and social legacy.
              </p>

              <p className="mt-5 text-sm sm:text-base leading-8 text-neutral-600">
                Through photography, archival documents, music, film,
                artworks and personal objects, visitors are invited to
                encounter the man behind the music and explore the legacy
                that continues to resonate across generations.
              </p>

              <div className="mt-9">
                <TextLink to="/exhibition">Discover the exhibition</TextLink>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT TO DISCOVER */}
      <section className={`bg-neutral-950 text-white ${sectionPad}`}>
        <div className={container}>
          <motion.div
            {...inView}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <Eyebrow tone="light">Inside the exhibition</Eyebrow>
              <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-none">
                A life in many chapters.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-neutral-400">
              Explore the people, places, sounds and ideas that shaped Fela's
              remarkable journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-neutral-700">
            {exhibitionThemes.map((theme, index) => (
              <motion.div
                key={theme.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`group relative py-9 sm:py-11 border-b border-neutral-700 ${index % 2 === 0 ? "md:pr-12 md:border-r" : "md:pl-12"
                  }`}
              >
                <div className="relative mb-7 h-48 sm:h-56 overflow-hidden bg-neutral-800">
                  <img
                    src={theme.image}
                    alt={theme.imageAlt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover grayscale-[0.25] transition-transform duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = archiveImages.shrine;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>

                <span className="absolute top-0 left-0 h-px w-0 bg-amber-600 transition-all duration-500 group-hover:w-full" />

                <p className="text-xs tracking-[0.18em] text-amber-600">
                  {theme.number}
                </p>

                <h3 className="display-font text-3xl sm:text-4xl mt-5">
                  {theme.title}
                </h3>

                <p className="text-sm leading-7 text-neutral-400 mt-4 max-w-lg">
                  {theme.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <TextLink to="/exhibition" tone="light" icon={ArrowUpRight}>
              Explore the full story
            </TextLink>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className={`bg-neutral-100 ${sectionPad}`}>
        <div className={container}>
          <motion.div {...inView} className="max-w-2xl mb-16 lg:mb-20">
            <Eyebrow>A life in moments</Eyebrow>
            <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
              The story,
              <br />
              <span className="italic">in time.</span>
            </h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Centre line */}
            <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-400/70" />

            {timeline.map((item, i) => {
              const left = i % 2 === 0;

              return (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative pl-10 md:pl-0 pb-12 last:pb-0 md:w-1/2 ${left ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                    }`}
                >
                  <span
                    className={`absolute top-2 left-0 h-[15px] w-[15px] rounded-full border-2 border-amber-700 bg-neutral-100 ${left ? "md:left-auto md:-right-[8px]" : "md:-left-[8px]"
                      }`}
                  />

                  <p className="display-font text-4xl sm:text-5xl text-amber-700 leading-none">
                    {item.year}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-7 text-neutral-600 ${left ? "md:ml-auto" : ""
                      } max-w-md`}
                  >
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className={sectionPad}>
        <div className={container}>
          <motion.div
            {...inView}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
          >
            <div>
              <Eyebrow>From the gallery</Eyebrow>
              <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
                Images that
                <br />
                <span className="italic">tell the story.</span>
              </h2>
            </div>

            <TextLink to="/gallery">View the gallery</TextLink>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[190px] sm:auto-rows-[250px] lg:auto-rows-[280px] gap-3">
            {galleryTiles.map((tile, i) => (
              <motion.div
                key={tile.caption}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`group relative overflow-hidden bg-neutral-300 ${tile.span}`}
              >
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.3] transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: tile.position }}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = archiveImages.shrine;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white">
                  {tile.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FELA AND ILORIN */}
      <section className={`${sectionPad} bg-neutral-200`}>
        <div className={container}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              {...inView}
              className="relative min-h-[340px] sm:min-h-[480px] bg-neutral-300 overflow-hidden"
            >
              <img
                src={archiveImages.shrineView}
                alt="Exterior of the New Afrika Shrine in Lagos"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover grayscale"
                style={{ objectPosition: "50% 20%" }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = archiveImages.shrine;
                }}
              />
              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                  The New Afrika Shrine
                </p>
                <p className="display-font text-4xl sm:text-5xl mt-2">
                  A place of music and culture
                </p>
              </div>
            </motion.div>

            <motion.div {...inView}>
              <Eyebrow>Fela & Ilorin</Eyebrow>

              <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
                A story that
                <br />
                <span className="italic">comes home.</span>
              </h2>

              <p className="text-sm sm:text-base leading-8 text-neutral-700 mt-7">
                Fela's story has a meaningful connection to Ilorin. On
                30 August 1971, he performed at Niger Hotel in the city, a
                moment that forms part of the wider history of his
                performances across Nigeria and beyond.
              </p>

              <p className="text-sm sm:text-base leading-8 text-neutral-700 mt-5">
                This retrospective offers an opportunity to revisit that
                connection and encounter an important chapter in the
                relationship between Fela, his music and the people and
                places that experienced it.
              </p>

              <div className="mt-8 flex items-center gap-5 border-t border-neutral-400/60 pt-6">
                <p className="display-font text-4xl text-amber-700">1971</p>
                <p className="text-[10px] uppercase tracking-[0.18em] leading-5 text-neutral-600">
                  30 August
                  <br />
                  Niger Hotel, Ilorin
                </p>
              </div>

              <div className="mt-8">
                <TextLink to="/exhibition">Read the exhibition story</TextLink>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT'S ON */}
      <section className={sectionPad}>
        <div className={container}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...inView} className="lg:col-span-7">
              <Eyebrow>Beyond the exhibition</Eyebrow>

              <h2 className="display-font text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
                Experience the
                <br />
                <span className="italic">story in motion.</span>
              </h2>

              <p className="max-w-xl text-sm sm:text-base text-neutral-600 leading-8 mt-7">
                The exhibition programme brings Fela's world to life through
                film screenings, conversations and special events.
              </p>
            </motion.div>

            <motion.div
              {...inView}
              className="lg:col-span-5 bg-neutral-100 border border-neutral-300 p-8 sm:p-10"
            >
              <div className="flex items-center gap-3 text-neutral-500">
                <Play size={16} />
                <p className="text-[10px] uppercase tracking-[0.2em]">
                  Regular programme
                </p>
              </div>

              <h3 className="display-font text-4xl sm:text-5xl mt-7">
                Saturday Film Screenings
              </h3>

              <p className="text-sm text-neutral-600 leading-7 mt-5">
                Join us every Saturday for a film screening exploring Fela's
                life, music and cultural legacy.
              </p>

              <div className="mt-7 pt-6 border-t border-neutral-300 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    Every Saturday
                  </p>
                  <p className="text-sm font-semibold mt-2">3:00 PM</p>
                </div>

                <Link
                  to="/whats-on"
                  className="group w-11 h-11 border border-neutral-400 flex items-center justify-center hover:bg-neutral-900 hover:border-neutral-900 transition-colors"
                  aria-label="Explore What's On"
                >
                  <ArrowUpRight
                    size={18}
                    className="text-neutral-900 transition-colors group-hover:text-white"
                  />
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="mt-14 pt-7 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <p className="text-sm text-neutral-500">
              Discover screenings, talks and upcoming exhibition events.
            </p>

            <Link
              to="/whats-on"
              className="inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.17em] font-semibold text-neutral-900 hover:gap-5 transition-all"
            >
              View the programme
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* VISIT CTA */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28">
        <div className={container}>
          <motion.div {...inView} className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-400 mb-7">
              26 October – 31 December 2026
            </p>

            <h2 className="display-font text-5xl sm:text-6xl md:text-7xl leading-[0.98]">
              Encounter the legacy.
              <br />
              <span className="italic text-neutral-400">
                Experience the story.
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-400 leading-8 mt-7">
              Visit Fela Anikulapo-Kuti: A Retrospective at the Institute of
              Contemporary African Art and Film, Ilorin. Admission is free.
            </p>

            <div className="mt-9">
              <Cta to="/visit" variant="light">
                Plan Your Visit
              </Cta>
            </div>
          </motion.div>

          {/* Visit info */}
          <div className="mt-16 sm:mt-20 pt-10 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 text-center">
            <div className="sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Address
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Ahmadu Bello Way,
                <br />
                Ilorin, Kwara State
              </p>
            </div>
            <div className="sm:px-6 sm:border-l sm:border-neutral-800">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Opening hours
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Tuesday – Sunday
                <br />
                12:00 PM – 6:00 PM
              </p>
            </div>
            <div className="sm:px-6 sm:border-l sm:border-neutral-800">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Admission
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Free for everyone
                <br />
                Saturday screenings at 3 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE CREDITS */}
      <section className="bg-neutral-100 border-t border-neutral-300 py-10">
        <div className={container}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-4">
            Public-domain image credits
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-[11px] leading-6 text-neutral-600">
            <p>
              Family Ransome-Kuti, c. 1940 — unknown photographer; public domain in Nigeria.
              <a className="underline underline-offset-2 ml-1" href="https://commons.wikimedia.org/wiki/File:Family_Ransome_Kuti_c1940.jpg" target="_blank" rel="noreferrer">Source</a>
            </p>

            <p>
              Fela New Shrine, Lagos — Kaizenify; released into the public domain worldwide.
              <a className="underline underline-offset-2 ml-1" href="https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos.jpg" target="_blank" rel="noreferrer">Source</a>
            </p>

            <p>
              Fela New Shrine, Lagos 02 — Kaizenify; released into the public domain worldwide.
              <a className="underline underline-offset-2 ml-1" href="https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos_02.jpg" target="_blank" rel="noreferrer">Source</a>
            </p>

            <p>
              Front View of Fela Shrine — Kaizenify; released into the public domain worldwide.
              <a className="underline underline-offset-2 ml-1" href="https://commons.wikimedia.org/wiki/File:Front_View_of_Fela_Shrine.jpg" target="_blank" rel="noreferrer">Source</a>
            </p>
          </div>

          <p className="mt-5 text-[10px] leading-5 text-neutral-500">
            The family photograph is listed as public domain in Nigeria. The Shrine photographs were released into the public domain by their photographer. The organisers should retain these source records as part of their image-rights documentation.
          </p>
        </div>
      </section>
    </div>
  );
}