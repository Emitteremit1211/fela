
import { motion, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Phone,
  MapPin,
  GraduationCap,
  Newspaper,
  MessageCircle,
  Clock3,
  CalendarDays,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const phoneNumber = "0913 689 6548";
const phoneLink = "tel:+2349136896548";

const instagramUrl =
  "https://www.instagram.com/fakretrospective?lqvp=MXgzaTFvYW5xZnYwcw%3D%3D&utm_source=qr";

const venue =
  "Institute of Contemporary African Art and Film, Ahmadu Bello Way, Ilorin, Kwara State, Nigeria";

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  venue
)}`;

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

function SectionLabel({ children }) {
  return (
    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#A77B45]">
      {children}
    </p>
  );
}

function PageHero() {
  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden bg-[#101010]">
      <div className="absolute inset-0">
        <img
          src="/fela-1.jpg"
          alt="Fela Anikulapo-Kuti retrospective"
          className="h-full w-full object-cover object-center opacity-40"
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
            Credits
            <span className="block text-[#D0A36B]">& Contact.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-sm leading-8 text-white/65 sm:text-base"
          >
            Get in touch with the exhibition team, plan a group visit,
            make a media enquiry or learn more about the people and
            institutions behind this retrospective.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#contact-details"
              className="inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
              style={{
                color: "#111111",
                backgroundColor: "#ffffff",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "inherit" }}>Contact the Team</span>
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
        Enquiries · Partnerships · Credits
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
          <SectionLabel>Get in Touch</SectionLabel>

          <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            We'd be glad
            <span className="block italic">to hear from you.</span>
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
            Whether you are interested in visiting the exhibition,
            organising a school or group visit, covering the
            retrospective or making a general enquiry, the exhibition
            team is available to assist.
          </p>

          <p className="mt-5 text-sm leading-8 text-neutral-500">
            You can reach the team by telephone or through our official
            Instagram page. For specific enquiries, please mention
            whether your message concerns a visit, school or group
            booking, or press and media.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const enquiryTypes = [
  {
    number: "01",
    title: "General Enquiries",
    description:
      "Questions about the exhibition, opening hours, admission, directions or anything else you would like to know before visiting.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Schools & Group Visits",
    description:
      "Enquiries from schools, educational institutions, organisations and groups interested in visiting the retrospective.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Press & Media",
    description:
      "Media enquiries, editorial coverage, interviews and requests for information about the exhibition.",
    icon: Newspaper,
  },
];

function EnquirySection() {
  return (
    <section
      id="contact-details"
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
          <SectionLabel>How Can We Help?</SectionLabel>

          <h2 className="font-serif text-4xl tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            Get in touch with us.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-neutral-500">
            Choose the type of enquiry that best describes what you
            need. Our contact details are provided below.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {enquiryTypes.map((item) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.number}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex min-h-[290px] flex-col border border-neutral-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-[#A77B45]">
                    {item.number}
                  </span>

                  <Icon
                    size={22}
                    strokeWidth={1.4}
                    className="text-[#A77B45]"
                  />
                </div>

                <h3 className="mt-10 font-serif text-2xl text-neutral-950">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-neutral-500">
                  {item.description}
                </p>

                <a
                  href={phoneLink}
                  className="mt-7 inline-flex items-center gap-3 border-b border-[#A77B45] pb-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    color: "#171717",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ color: "inherit" }}>Contact the Team</span>
                  <ArrowUpRight size={14} />
                </a>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-7 text-xs leading-6 text-neutral-400">
          For school, group and press enquiries, please mention the
          relevant enquiry type when contacting the exhibition team.
        </p>
      </div>
    </section>
  );
}

function ContactInformation() {
  return (
    <section className="bg-[#111111] py-24 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionLabel>Reach the Exhibition Team</SectionLabel>

          <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
            Let's start
            <span className="block italic text-[#D0A36B]">
              a conversation.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-white/55">
            Have a question or need more information? Contact the
            exhibition team directly using the details provided.
          </p>

          <div className="mt-10 space-y-8">
            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15">
                <Phone size={18} className="text-[#D0A36B]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                  Telephone
                </p>

                <a
                  href={phoneLink}
                  className="mt-2 inline-block text-xl tracking-wide transition-colors hover:text-[#D0A36B]"
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  {phoneNumber}
                </a>

                <p className="mt-2 text-xs leading-6 text-white/40">
                  Call the exhibition team for enquiries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15">
                <Camera size={18} className="text-[#D0A36B]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                  Instagram
                </p>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-base transition-colors hover:text-[#D0A36B]"
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  @fakretrospective
                  <ArrowUpRight size={14} />
                </a>

                <p className="mt-2 text-xs leading-6 text-white/40">
                  Follow the exhibition and send us a direct message.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
              style={{
                color: "#111111",
                backgroundColor: "#ffffff",
                textDecoration: "none",
              }}
            >
              <Camera size={15} />
              <span style={{ color: "inherit" }}>Visit Our Instagram</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border border-white/15 bg-white/[0.035] p-7 sm:p-10"
        >
          <SectionLabel>Find Us</SectionLabel>

          <h3 className="font-serif text-3xl text-white sm:text-4xl">
            Visit the exhibition.
          </h3>

          <p className="mt-5 text-sm leading-7 text-white/55">
            Institute of Contemporary African Art and Film, Ahmadu
            Bello Way, Ilorin, Kwara State, Nigeria.
          </p>

          <div className="mt-9 space-y-6 border-t border-white/10 pt-8">
            <div className="flex items-start gap-4">
              <MapPin size={18} className="mt-1 shrink-0 text-[#D0A36B]" />

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                  Address
                </p>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  {venue}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CalendarDays size={18} className="mt-1 shrink-0 text-[#D0A36B]" />

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                  Exhibition Dates
                </p>
                <p className="mt-2 text-sm text-white/80">
                  26 October – 31 December 2026
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock3 size={18} className="mt-1 shrink-0 text-[#D0A36B]" />

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                  Opening Hours
                </p>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  Tuesday – Sunday
                  <br />
                  12 PM – 6 PM
                </p>
              </div>
            </div>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-white/30 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-white"
            style={{
              color: "#ffffff",
              backgroundColor: "transparent",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "inherit" }}>Get Directions</span>
            <ArrowUpRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function CreditsSection() {
  const credits = [
    {
      label: "Presented by",
      name: "Kwara State Ministry of Communications",
    },
    {
      label: "Curated and produced by",
      name: "June Creative Art Advisory (JCAA)",
    },
    {
      label: "In partnership with",
      name: "The Kuti Family",
    },
    {
      label: "In collaboration with",
      name: "Felabration",
    },
    {
      label: "In collaboration with",
      name: "Kalakuta Museum",
    },
    {
      label: "In collaboration with",
      name: "Kuti Heritage Museum",
    },
  ];

  return (
    <section className="bg-[#F7F6F3] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionLabel>Behind the Retrospective</SectionLabel>

            <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-neutral-950 sm:text-5xl">
              A collective
              <span className="block italic">celebration.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-neutral-500">
              This retrospective brings together cultural
              institutions, creative partners and the Kuti family
              to honour the life, music and enduring influence
              of Fela Anikulapo-Kuti.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border-t border-neutral-300"
          >
            {credits.map((credit, index) => (
              <motion.div
                key={`${credit.label}-${index}`}
                variants={fadeUp}
                className="grid gap-3 border-b border-neutral-300 py-7 sm:grid-cols-[0.75fr_1.25fr] sm:gap-8"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A77B45]">
                  {credit.label}
                </p>

                <h3 className="font-serif text-xl leading-snug text-neutral-950 sm:text-2xl">
                  {credit.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 sm:py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-4xl text-center"
      >
        <SectionLabel>We Look Forward to Welcoming You</SectionLabel>

        <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-neutral-950 sm:text-6xl">
          Come experience
          <span className="block italic text-[#A77B45]">
            Fela's legacy.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-neutral-500">
          Discover the story, explore the exhibition and be part
          of a celebration of one of Africa's most influential
          cultural figures.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/visit"
            className="inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
            style={{
              color: "#111111",
              backgroundColor: "#ffffff",
              border: "1px solid #171717",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "inherit" }}>Plan Your Visit</span>
            <ArrowUpRight size={15} />
          </Link>

          <Link
            to="/exhibition"
            className="inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:!bg-[#D0A36B]"
            style={{
              color: "#ffffff",
              backgroundColor: "#171717",
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

export default function Contact() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden bg-white text-neutral-950">
        {/* <Navbar /> */}

        <PageHero />

        <Introduction />

        <EnquirySection />

        <ContactInformation />

        <CreditsSection />

        <FinalCTA />

        {/* <Footer /> */}
      </main>
    </MotionConfig>
  );
}
