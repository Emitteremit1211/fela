
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Megaphone,
  Image as ImageIcon,
  CalendarCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/*
  FRONTEND CONTENT

  These arrays will later be replaced with information retrieved
  from the admin panel.

  EVENTS:
  - Upcoming events appear under Upcoming Events.
  - Events move to Past Events when their dates have passed.
  - Only published events appear publicly.

  ANNOUNCEMENTS:
  - Announcements are managed separately from events.
  - Only published announcements appear publicly.

  Example event:
  {
    id: "event-1",
    title: "An Evening of Fela",
    description: "An evening celebrating Fela's music and legacy.",
    image: "/event-image.jpg",
    date: "2026-12-05",
    time: "3:00 PM",
    venue: "Institute of Contemporary African Art and Film",
    published: true,
    gallery: ["/photo-1.jpg", "/photo-2.jpg"]
  }

  Example announcement:
  {
    id: "announcement-1",
    title: "Special Exhibition Notice",
    description: "An important update for exhibition visitors.",
    date: "2026-11-20",
    image: "/announcement.jpg",
    published: true
  }
*/

const events = [];

const announcements = [];

const venue =
  "Institute of Contemporary African Art and Film, Ahmadu Bello Way, Ilorin, Kwara State, Nigeria";

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  venue
)}`;

const tabs = [
  {
    id: "upcoming",
    label: "Upcoming Events",
    description:
      "Discover events and programmes scheduled to take place during the exhibition.",
    icon: CalendarDays,
  },
  {
    id: "past",
    label: "Past Events",
    description:
      "Explore previous events and revisit moments from the exhibition.",
    icon: CalendarCheck,
  },
  {
    id: "announcements",
    label: "Announcements",
    description:
      "Stay informed with the latest exhibition news, notices and important updates.",
    icon: Megaphone,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
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

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SectionLabel({ children }) {
  return (
    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#A77B45]">
      {children}
    </p>
  );
}

function PageHero() {
  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden bg-[#101010] sm:min-h-[650px]">
      <div className="absolute inset-0">
        <img
          src="/fela-3.jpg"
          alt="Fela Anikulapo-Kuti retrospective"
          className="h-full w-full object-cover object-center opacity-45"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 sm:px-8 sm:pb-24 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.27em] text-[#D0A36B]"
          >
            <span className="h-px w-9 bg-[#D0A36B]" />
            Fela Anikulapo-Kuti: A Retrospective
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-6xl leading-[0.98] tracking-[-0.045em] text-white sm:text-7xl lg:text-[100px]"
          >
            What's
            <span className="block text-[#D0A36B]">On.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-sm leading-8 text-white/65 sm:text-base"
          >
            Find out what's happening throughout the retrospective.
            Discover upcoming events, revisit past experiences and
            stay up to date with important exhibition announcements.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#whats-on-content"
              className="inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
              style={{
                color: "#111111",
                backgroundColor: "#ffffff",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "inherit" }}>Explore What's On</span>
              <ArrowRight size={15} />
            </a>

            <Link
              to="/visit"
              className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/40 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!border-white hover:!bg-white"
              style={{
                color: "#ffffff",
                backgroundColor: "transparent",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "inherit" }}>Plan Your Visit</span>
              <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 hidden text-[9px] uppercase tracking-[0.25em] text-white/40 lg:block">
        Events · Experiences · Updates
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="bg-[#F7F6F3] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionLabel>Discover the Programme</SectionLabel>

          <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            Every moment
            <span className="block italic">has a story.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:pt-8"
        >
          <p className="text-base leading-8 text-neutral-600">
            The What's On page brings together the events, activities
            and important updates surrounding Fela Anikulapo-Kuti:
            A Retrospective.
          </p>

          <p className="mt-5 text-sm leading-8 text-neutral-500">
            Whether you are planning to attend an upcoming programme,
            looking back at an event you enjoyed or checking for the
            latest exhibition news, this is where you will find the
            information you need.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function EventCard({ event, past = false }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.07)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              past ? "grayscale-[15%]" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#171717]">
            <CalendarDays size={36} className="text-[#D0A36B]" />
          </div>
        )}

        <div className="absolute left-5 top-5">
          <span
            className="inline-flex px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{
              color: "#171717",
              backgroundColor: "#ffffff",
            }}
          >
            {past ? "Past Event" : "Upcoming Event"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {event.date && (
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.1em] text-neutral-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={13} />
              {formatDate(event.date)}
            </span>

            {event.time && (
              <span className="flex items-center gap-2">
                <Clock3 size={13} />
                {event.time}
              </span>
            )}
          </div>
        )}

        <h3 className="font-serif text-2xl leading-tight text-neutral-950 sm:text-3xl">
          {event.title}
        </h3>

        <p className="mt-4 flex-1 text-sm leading-7 text-neutral-500">
          {event.description}
        </p>

        {event.venue && (
          <p className="mt-6 flex items-start gap-2 border-t border-neutral-100 pt-5 text-xs leading-6 text-neutral-500">
            <MapPin size={14} className="mt-1 shrink-0" />
            <span>{event.venue}</span>
          </p>
        )}

        {past && event.gallery?.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A77B45]">
            <ImageIcon size={14} />
            {event.gallery.length} event photographs
          </div>
        )}
      </div>
    </motion.article>
  );
}

function AnnouncementCard({ announcement }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.07)]"
    >
      {announcement.image ? (
        <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
          <img
            src={announcement.image}
            alt={announcement.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-[#171717]">
          <Megaphone size={35} className="text-[#D0A36B]" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A77B45]">
          <Megaphone size={13} />
          Exhibition Announcement
        </div>

        <h3 className="font-serif text-2xl leading-tight text-neutral-950 sm:text-3xl">
          {announcement.title}
        </h3>

        <p className="mt-4 flex-1 text-sm leading-7 text-neutral-500">
          {announcement.description}
        </p>

        {announcement.date && (
          <p className="mt-6 border-t border-neutral-100 pt-5 text-[10px] uppercase tracking-[0.12em] text-neutral-400">
            Posted {formatDate(announcement.date)}
          </p>
        )}
      </div>
    </motion.article>
  );
}

function EmptyState({ type }) {
  const emptyContent = {
    upcoming: {
      title: "New experiences are on the way.",
      description:
        "There are no upcoming events to display at the moment. New programmes and activities will be announced here as they are confirmed. Please check back for updates.",
      icon: CalendarDays,
    },
    past: {
      title: "Our event archive is growing.",
      description:
        "Once events have taken place, they will be preserved here. You will be able to revisit previous programmes, read about what happened and explore photographs from those experiences.",
      icon: ImageIcon,
    },
    announcements: {
      title: "No announcements just yet.",
      description:
        "Important exhibition notices, programme updates and other announcements from the organisers will appear here.",
      icon: Megaphone,
    },
  };

  const content = emptyContent[type];
  const Icon = content.icon;

  return (
    <div className="border border-dashed border-neutral-300 px-6 py-16 text-center sm:px-12 sm:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <Icon size={24} className="text-[#A77B45]" />
      </div>

      <h3 className="mt-7 font-serif text-2xl text-neutral-950 sm:text-3xl">
        {content.title}
      </h3>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-neutral-500">
        {content.description}
      </p>
    </div>
  );
}

function WhatsOnContent({ upcomingEvents, pastEvents, announcements }) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab);

  const activeItems = {
    upcoming: upcomingEvents,
    past: pastEvents,
    announcements,
  }[activeTab];

  return (
    <section
      id="whats-on-content"
      className="scroll-mt-20 bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <SectionLabel>Stay Informed</SectionLabel>

          <h2 className="font-serif text-4xl tracking-[-0.035em] text-neutral-950 sm:text-5xl lg:text-6xl">
            Explore What's On.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-neutral-500">
            Everything happening around the retrospective, in one place.
            Select a section below to explore upcoming events, look back
            at past experiences or read the latest announcements.
          </p>
        </motion.div>

        {/* THE ONLY THREE TABS */}
        <div className="mt-12 border-b border-neutral-200">
          <div
            className="flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label="What's On sections"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex shrink-0 items-center gap-2 px-4 py-5 text-[10px] font-semibold uppercase tracking-[0.13em] transition-colors sm:px-6 sm:text-[11px]"
                  style={{
                    color: active ? "#171717" : "#888888",
                    backgroundColor: "transparent",
                  }}
                >
                  <Icon
                    size={15}
                    color={active ? "#A77B45" : "#999999"}
                  />

                  <span style={{ color: "inherit" }}>{tab.label}</span>

                  {active && (
                    <motion.span
                      layoutId="active-whats-on-tab"
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-[#A77B45]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE TAB EXPLANATION */}
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="pt-9"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h3 className="font-serif text-3xl text-neutral-950 sm:text-4xl">
                {activeTabInfo.label}
              </h3>

              <p className="mt-3 text-sm leading-7 text-neutral-500">
                {activeTabInfo.description}
              </p>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {activeItems.length}{" "}
              {activeItems.length === 1 ? "Item" : "Items"}
            </p>
          </div>

          {activeItems.length > 0 ? (
            <motion.div
              key={activeTab}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {activeTab === "announcements"
                ? activeItems.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))
                : activeItems.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      past={activeTab === "past"}
                    />
                  ))}
            </motion.div>
          ) : (
            <div className="mt-10">
              <EmptyState type={activeTab} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ExhibitionInformation() {
  return (
    <section className="bg-[#F7F6F3] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionLabel>Visit the Retrospective</SectionLabel>

          <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            Experience the story
            <span className="block italic">beyond the page.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:pt-5"
        >
          <p className="text-sm leading-8 text-neutral-600">
            Explore the life, music, activism and cultural influence of
            Fela Anikulapo-Kuti through an exhibition that brings his
            story and legacy into focus.
          </p>

          <div className="mt-7 grid gap-5 border-y border-neutral-200 py-6 sm:grid-cols-2">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
                Exhibition dates
              </p>
              <p className="mt-2 text-sm text-neutral-900">
                26 October – 31 December 2026
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
                Opening hours
              </p>
              <p className="mt-2 text-sm text-neutral-900">
                Tuesday – Sunday, 12 PM – 6 PM
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
                Admission
              </p>
              <p className="mt-2 text-sm text-neutral-900">
                Free entry
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
                Location
              </p>
              <p className="mt-2 text-sm text-neutral-900">
                Ilorin, Kwara State
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-6">
            <Link
              to="/visit"
              className="inline-flex items-center gap-3 border-b border-[#A77B45] pb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{
                color: "#171717",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "inherit" }}>Plan Your Visit</span>
              <ArrowUpRight size={15} />
            </Link>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border-b border-neutral-300 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{
                color: "#171717",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "inherit" }}>Get Directions</span>
              <MapPin size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[#111111] px-5 py-24 sm:px-8 sm:py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-4xl text-center"
      >
        <SectionLabel>Discover Fela's Legacy</SectionLabel>

        <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-white sm:text-6xl">
          Be part of the
          <span className="block italic text-[#D0A36B]">
            experience.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/55">
          Join us in celebrating the life, music and enduring influence
          of Fela Anikulapo-Kuti.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/visit"
            className="inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
            style={{
              color: "#111111",
              backgroundColor: "#ffffff",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "inherit" }}>Book Your Visit</span>
            <ArrowUpRight size={15} />
          </Link>

          <Link
            to="/exhibition"
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-white"
            style={{
              color: "#ffffff",
              backgroundColor: "transparent",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "inherit" }}>Explore the Exhibition</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function WhatsOn() {
  const { upcomingEvents, pastEvents, publishedAnnouncements } =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const publishedEvents = events.filter(
        (event) => event.published === true && event.date
      );

      const upcoming = publishedEvents
        .filter((event) => {
          const date = new Date(`${event.date}T12:00:00`);
          return date >= today;
        })
        .sort(
          (a, b) =>
            new Date(`${a.date}T12:00:00`) -
            new Date(`${b.date}T12:00:00`)
        );

      const past = publishedEvents
        .filter((event) => {
          const date = new Date(`${event.date}T12:00:00`);
          return date < today;
        })
        .sort(
          (a, b) =>
            new Date(`${b.date}T12:00:00`) -
            new Date(`${a.date}T12:00:00`)
        );

      const publishedNotices = announcements
        .filter((item) => item.published === true)
        .sort((a, b) => {
          return (
            new Date(`${b.date || "2000-01-01"}T12:00:00`) -
            new Date(`${a.date || "2000-01-01"}T12:00:00`)
          );
        });

      return {
        upcomingEvents: upcoming,
        pastEvents: past,
        publishedAnnouncements: publishedNotices,
      };
    }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden bg-white text-neutral-950">
        {/* <Navbar /> */}

        <PageHero />

        <Introduction />

        <WhatsOnContent
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          announcements={publishedAnnouncements}
        />

        <ExhibitionInformation />

        <FinalCTA />

        {/* <Footer /> */}
      </main>
    </MotionConfig>
  );
}
