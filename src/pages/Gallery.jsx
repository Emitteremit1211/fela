
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Images,
  Users,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| GALLERY DATA
|--------------------------------------------------------------------------
| Add genuine exhibition photographs here.
|
| Example:
| {
|   id: "visit-001",
|   image: "/gallery/visitor-group-01.jpg",
|   title: "A day at the retrospective",
|   caption: "Visitors exploring the exhibition.",
|   date: "15 November 2026",
|   category: "Group Visits",
| }
|
| Categories:
| - Recent Visits
| - Group Visits
| - Visitor Moments
|
| This structure can later be replaced with data from your backend.
|--------------------------------------------------------------------------
*/

const galleryItems = [
  // Add genuine visitor photographs here.
];

const filters = [
  "All Moments",
  "Recent Visits",
  "Group Visits",
  "Visitor Moments",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function SectionLabel({ children, light = false }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className={`h-px w-8 ${light ? "bg-[#D0A36B]" : "bg-[#A77B45]"
          }`}
      />

      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${light ? "text-[#D0A36B]" : "text-[#A77B45]"
          }`}
      >
        {children}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
   PHOTO CARD
--------------------------------------------------------------------------- */

function PhotoCard({ item, onClick }) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onClick}
      aria-label={`View ${item.title}`}
      className="group block w-full cursor-pointer bg-white text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </div>

      <div className="border-b border-neutral-200 py-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A77B45]">
            {item.category}
          </span>

          {item.date && (
            <span className="text-[10px] text-neutral-500">
              {item.date}
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl text-neutral-900 transition-colors group-hover:text-[#A77B45]">
          {item.title}
        </h3>

        {item.caption && (
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {item.caption}
          </p>
        )}
      </div>
    </motion.button>
  );
}

/* --------------------------------------------------------------------------
   PHOTO LIGHTBOX
--------------------------------------------------------------------------- */

function PhotoLightbox({
  items,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}) {
  const item = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, onPrevious, onNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-950 transition-colors hover:bg-[#A77B45] hover:text-white"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrevious();
        }}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 transition-colors hover:bg-[#A77B45] hover:text-white md:left-8"
      >
        <ChevronLeft size={22} />
      </button>

      <div
        className="flex max-h-full w-full max-w-6xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[72vh] max-w-full object-contain"
          />
        </div>

        <div className="w-full max-w-3xl py-5 text-center text-white">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D0A36B]">
            {item.category}
          </p>

          <h3 className="font-serif text-2xl md:text-3xl">
            {item.title}
          </h3>

          {item.caption && (
            <p className="mt-2 text-sm text-white/65">
              {item.caption}
            </p>
          )}

          <p className="mt-3 text-xs text-white/40">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 transition-colors hover:bg-[#A77B45] hover:text-white md:right-8"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   EMPTY GALLERY STATE
--------------------------------------------------------------------------- */

function EmptyGallery({ filter }) {
  const isGroup = filter === "Group Visits";

  return (
    <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-neutral-300 bg-[#F8F7F5] px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#A77B45]">
        {isGroup ? <Users size={25} /> : <Images size={25} />}
      </div>

      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A77B45]">
        {isGroup ? "Shared experiences" : "The gallery"}
      </p>

      <h3 className="max-w-lg font-serif text-3xl text-neutral-900 md:text-4xl">
        {isGroup
          ? "Group visits will be featured here."
          : "Moments from the exhibition will appear here."}
      </h3>

      <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
        {isGroup
          ? "Photographs of schools, organisations, friends and other visiting groups will be added as the exhibition welcomes more visitors."
          : "This space is reserved for genuine photographs of visitors, exhibition experiences and memorable moments from the retrospective."}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------------------
   GALLERY COLLECTION
--------------------------------------------------------------------------- */

function GalleryCollection() {
  const [activeFilter, setActiveFilter] = useState("All Moments");
  const [activeIndex, setActiveIndex] = useState(null);

  const filteredItems =
    activeFilter === "All Moments"
      ? galleryItems
      : galleryItems.filter(
        (item) => item.category === activeFilter
      );

  const closeLightbox = () => setActiveIndex(null);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + 1) % filteredItems.length
    );
  };

  return (
    <section
      id="gallery-collection"
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel>Explore the photographs</SectionLabel>

            <h2 className="font-serif text-4xl leading-tight text-neutral-950 md:text-5xl">
              Moments worth
              <br />
              <span className="italic text-[#A77B45]">
                remembering.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-neutral-500">
            Browse photographs and experiences from the retrospective.
            Select a collection to explore different moments from the
            exhibition.
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setActiveIndex(null);
                }}
                className={`rounded-full border px-5 py-3 text-xs font-semibold transition-all duration-300 ${isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-950 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeFilter}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <PhotoCard
                key={item.id}
                item={item}
                onClick={() => setActiveIndex(index)}
              />
            ))
          ) : (
            <EmptyGallery filter={activeFilter} />
          )}
        </motion.div>

        <PhotoLightbox
          items={filteredItems}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   GROUP VISITS
--------------------------------------------------------------------------- */

function GroupVisits() {
  const visitorGroups = [
    "Schools and educational institutions",
    "Friends and family groups",
    "Cultural and creative communities",
    "Organisations and institutions",
  ];

  return (
    <section className="bg-[#F5F4F1] py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionLabel>Experience it together</SectionLabel>

          <h2 className="font-serif text-4xl leading-tight text-neutral-950 md:text-6xl">
            The exhibition is
            <br />
            <span className="italic text-[#A77B45]">
              better shared.
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-sm leading-8 text-neutral-600">
            The retrospective welcomes groups interested in exploring
            Fela's life, music, cultural influence and enduring legacy
            together.
          </p>

          <p className="mt-4 max-w-lg text-sm leading-8 text-neutral-600">
            Whether you are visiting with a school, an organisation,
            friends or family, the exhibition offers an opportunity to
            learn, reflect and experience the story together.
          </p>

          <Link
            to="/visit"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-neutral-950 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-white transition-colors hover:bg-[#A77B45] hover:!text-white"
          >
            <span className="!text-white">Book a group visit</span>
            <ArrowUpRight size={16} className="!text-white" />
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border border-neutral-200 bg-white p-7 md:p-10"
        >
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F4F1] text-[#A77B45]">
            <Users size={25} />
          </div>

          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A77B45]">
            Who can visit together?
          </p>

          <div className="space-y-5">
            {visitorGroups.map((group, index) => (
              <div
                key={group}
                className="flex items-center gap-4 border-b border-neutral-100 pb-5 last:border-0 last:pb-0"
              >
                <span className="font-serif text-lg text-[#A77B45]">
                  0{index + 1}
                </span>

                <p className="text-sm text-neutral-700">
                  {group}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex items-start gap-3 border-t border-neutral-200 pt-6">
            <CalendarDays
              size={18}
              className="mt-0.5 shrink-0 text-[#A77B45]"
            />

            <p className="text-xs leading-6 text-neutral-500">
              Advance booking is available for both individual visitors
              and groups. Please use the visit page to make your booking.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   CLOSING SECTION
--------------------------------------------------------------------------- */

function GalleryClosing() {
  return (
    <section className="relative overflow-hidden bg-[#111111] py-20 text-white md:py-28">
      <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/5" />
      <div className="pointer-events-none absolute -right-8 -top-20 h-72 w-72 rounded-full border border-white/5" />

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        <SectionLabel light>Continue exploring</SectionLabel>

        <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
          There is more to
          <br />
          <span className="italic text-[#D0A36B]">
            discover.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/60">
          Explore the story behind the photographs and discover the life,
          music, ideas and legacy of Fela Anikulapo-Kuti.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/exhibition"
            className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-black transition-colors hover:bg-[#D0A36B] hover:!text-neutral-950"
          >
            <span className="!text-black">Explore the exhibition</span>
            <ArrowUpRight size={16} className="!text-black" />
          </Link>

          <Link
            to="/visit"
            className="group inline-flex min-h-12 items-center justify-center gap-3 border border-white/40 bg-transparent px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-white transition-colors hover:border-white hover:bg-white hover:!text-neutral-950"
          >
            <span className="!text-white group-hover:!text-neutral-950">
              Book your visit
            </span>
            <ArrowRight
              size={16}
              className="!text-white group-hover:!text-neutral-950"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   MAIN GALLERY PAGE
--------------------------------------------------------------------------- */

export default function Gallery() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white text-neutral-950">
        {/* EDITORIAL INTRODUCTION — NO HERO IMAGE */}
        <section className="relative overflow-hidden border-b border-neutral-200 bg-[#F8F7F5]">
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>
                  The exhibition in pictures
                </SectionLabel>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight text-neutral-950 md:text-7xl lg:text-8xl">
                  A gathering of
                  <br />
                  <span className="italic text-[#A77B45]">
                    moments and memories.
                  </span>
                </h1>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 grid gap-8 border-t border-neutral-300 pt-8 md:grid-cols-2 md:gap-16"
              >
                <p className="max-w-xl text-base leading-8 text-neutral-700">
                  Every exhibition creates moments that deserve to be
                  remembered. This gallery brings together photographs
                  from the Fela Anikulapo-Kuti retrospective, capturing
                  the people, experiences and shared discoveries that
                  make the exhibition special.
                </p>

                <div className="flex flex-col justify-between gap-6">
                  <p className="max-w-lg text-sm leading-7 text-neutral-500">
                    From individual visitors to school trips and group
                    experiences, this is a growing collection of moments
                    from an exhibition celebrating the life and legacy
                    of one of Africa's most influential musical voices.
                  </p>

                  <a
                    href="#gallery-collection"
                    className="inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.17em] text-neutral-950 transition-colors hover:text-[#A77B45]"
                  >
                    Explore the gallery
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <GalleryCollection />

        <GroupVisits />

        <GalleryClosing />
      </main>
    </MotionConfig>
  );
}
