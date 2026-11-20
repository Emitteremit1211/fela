
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  ChevronDown,
  Clock3,
  Film,
  MapPin,
  Navigation,
  Ticket,
  Users,
  Accessibility,
  User,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

const venue =
  "Institute of Contemporary African Art and Film, Ahmadu Bello Way, Ilorin, Kwara State, Nigeria";

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  venue
)}`;

const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  venue
)}&output=embed`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
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

const visitorFAQs = [
  {
    question: "Is admission to the exhibition free?",
    answer:
      "Yes. Admission to Fela Anikulapo-Kuti: A Retrospective is completely free. Everyone is welcome to experience the exhibition.",
  },
  {
    question: "When can I visit the exhibition?",
    answer:
      "The exhibition runs from 26 October to 31 December 2026. Visiting hours are Tuesday to Sunday, from 12 PM to 6 PM.",
  },
  {
    question: "Where is the exhibition taking place?",
    answer:
      "The exhibition takes place at the Institute of Contemporary African Art and Film, Ahmadu Bello Way, Ilorin, Kwara State, Nigeria.",
  },
  {
    question: "Can I book an individual visit?",
    answer:
      "Yes. Individual visitors can submit a booking request through the visit booking form on this page.",
  },
  {
    question: "Can I visit with a group?",
    answer:
      "Absolutely! Group visits are welcome. Group visitors can submit a booking request with their organisation details and expected number of visitors.",
  },
  {
    question: "Are there film screenings?",
    answer:
      "Yes. Film screenings take place every Saturday at 3 PM during the exhibition period.",
  },
  {
    question: "Can I take photographs inside the exhibition?",
    answer:
      "Yes, visitors are welcome to take photographs inside the exhibition. However, eating and drinking are not permitted within the exhibition spaces.",
  },
  {
    question: "Is the venue accessible?",
    answer:
      "Yes. The exhibition venue is accessible. If you require any specific assistance during your visit, please contact the exhibition organisers ahead of time.",
  },
];

const essentials = [
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
    icon: Ticket,
    label: "Admission",
    value: "Free entry",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ilorin, Kwara State, Nigeria",
  },
];

const chapters = [
  "Early Years",
  "Funmilayo Ransome-Kuti",
  "Lagos Baby",
  "State Within A State",
  "Fela by Design",
  "State V. Fela",
  "Fela on Tour",
  "Fela Lives",
  "Merch",
];

const today = new Date();

const minimumDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

const maximumDate = "2026-12-31";

function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`max-w-2xl ${light ? "text-white" : "text-neutral-950"}`}
    >
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A87942]">
        {eyebrow}
      </p>

      <h2 className="display-font text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 max-w-xl text-sm leading-8 sm:text-base ${
            light ? "text-white/65" : "text-neutral-500"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

function ImageWithFallback({ src, fallback, alt, className = "" }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        if (fallback && imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
    />
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[680px] items-end overflow-hidden bg-neutral-950 text-white sm:min-h-[760px]">
      <ImageWithFallback
        src="https://commons.wikimedia.org/wiki/File:Fela_New_Shrine,_Lagos.jpg"
        fallback="https://commons.wikimedia.org/wiki/Special:FilePath/A_portrait_of_Fela_Kuti.jpg"
        alt="Archival portrait of Fela Anikulapo-Kuti"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 sm:px-10 md:pb-28 lg:px-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] !text-white/75"
          >
            <span className="h-px w-9 bg-[#C49A65]" />
            Your visit begins here
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="display-font max-w-4xl text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[108px]"
          >
            Plan Your
            <br />
            <span className="italic !text-[#D9B78D]">Visit.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-sm leading-8 !text-white/75 sm:text-base"
          >
            Step into the world of Fela Anikulapo-Kuti. Discover the music,
            the movement, the stories and the enduring legacy of one of
            Africa&apos;s most influential cultural figures.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#visit-details"
              style={{ color: "#111111" }}
              className="!inline-flex !items-center !gap-3 !bg-white !px-6 !py-4 !text-[10px] !font-semibold !uppercase !tracking-[0.18em] !opacity-100 !no-underline transition hover:!bg-[#D9B78D]"
            >
              <span style={{ color: "#111111" }}>Visit information</span>
              <ArrowRight size={15} style={{ color: "#111111" }} />
            </a>

            <a
              href="#booking"
              style={{ color: "#ffffff" }}
              className="!inline-flex !items-center !gap-2 !border !border-white/50 !bg-black/20 !px-6 !py-4 !text-[10px] !font-semibold !uppercase !tracking-[0.18em] !opacity-100 !no-underline transition hover:!border-white hover:!bg-white/15"
            >
              <span style={{ color: "#ffffff" }}>Book your visit</span>
              <ArrowUpRight size={15} style={{ color: "#ffffff" }} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 hidden items-center gap-4 text-[9px] uppercase tracking-[0.22em] !text-white/55 md:flex">
        <span>Fela Anikulapo-Kuti</span>
        <span className="h-px w-10 bg-white/40" />
        <span>2026</span>
      </div>
    </section>
  );
}

function VisitDetails() {
  return (
    <section
      id="visit-details"
      className="scroll-mt-24 bg-[#F5F4F1] px-6 py-24 sm:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            eyebrow="The essential details"
            title="Everything you need to know."
            description="Make the most of your time with us. Here are the important details to help you plan your visit to the retrospective."
          />

          <div className="mt-16 grid gap-px bg-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
            {essentials.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  variants={fadeUp}
                  key={item.label}
                  className="min-h-[220px] bg-[#F5F4F1] p-7 sm:p-8"
                >
                  <div className="mb-12 flex items-center justify-between">
                    <Icon size={21} strokeWidth={1.4} />
                    <span className="text-[10px] tracking-widest text-neutral-400">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    {item.label}
                  </p>

                  <p className="display-font text-2xl leading-snug text-neutral-900">
                    {item.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 border border-[#D8D1C6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F3F0EA] text-[#A87942]">
                <Ticket size={19} />
              </div>

              <div>
                <h3 className="display-font text-2xl text-neutral-950">
                  Free admission for everyone.
                </h3>
                <p className="mt-2 text-sm leading-7 text-neutral-500">
                  Both individual visitors and groups are welcome to submit
                  a booking request. There is no admission fee.
                </p>
              </div>
            </div>

            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A87942]">
              Free admission
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   BOOKING FORM — CONNECTED TO SUPABASE
--------------------------------------------------------------------------- */

function BookingSection() {
  const [visitorType, setVisitorType] = useState("Individual");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    visitDate: "",
    visitorCount: "1",
    organisation: "",
    contactRole: "",
    notes: "",
  });

  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const changeVisitorType = (type) => {
    setVisitorType(type);

    setFormData((previous) => ({
      ...previous,
      visitorCount: type === "Individual" ? "1" : previous.visitorCount,
      organisation: "",
      contactRole: "",
    }));

    setStatus("idle");
    setFeedback("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.visitDate ||
      formData.visitDate < minimumDate ||
      formData.visitDate > maximumDate
    ) {
      setStatus("error");
      setFeedback("Please select a valid date within the exhibition period.");
      return;
    }

    if (new Date(`${formData.visitDate}T12:00:00`).getDay() === 1) {
      setStatus("error");
      setFeedback(
        "The exhibition is closed on Mondays. Please select another date."
      );
      return;
    }

    const visitorCount = Number(formData.visitorCount);

    if (
      !Number.isInteger(visitorCount) ||
      visitorCount < (visitorType === "Group" ? 2 : 1) ||
      visitorCount > 500
    ) {
      setStatus("error");
      setFeedback(
        visitorType === "Group"
          ? "Please enter between 2 and 500 visitors for a group booking."
          : "Please enter a valid number of visitors."
      );
      return;
    }

    if (visitorType === "Group" && !formData.organisation.trim()) {
      setStatus("error");
      setFeedback("Please enter your organisation or group name.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    // These names and values match the existing visit_bookings table.
    // Status is intentionally omitted so Supabase uses its Pending default.
    const bookingPayload = {
      visitor_type: visitorType,
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      preferred_date: formData.visitDate,
      visitor_count: visitorCount,
      organisation:
        visitorType === "Group" ? formData.organisation.trim() || null : null,
      contact_role:
        visitorType === "Group" ? formData.contactRole.trim() || null : null,
      notes: formData.notes.trim() || null,
    };

    try {
      const { error } = await supabase
        .from("visit_bookings")
        .insert(bookingPayload);

      if (error) {
        throw error;
      }

      setStatus("success");
      setFeedback(
        "Your booking request has been submitted successfully. The exhibition team will review your request and get in touch using the contact details you provided."
      );

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        visitDate: "",
        visitorCount: visitorType === "Individual" ? "1" : "",
        organisation: "",
        contactRole: "",
        notes: "",
      });
    } catch (error) {
      console.error("Visit booking submission error:", error);

      setStatus("error");
      setFeedback(
        error.message ||
          "Something went wrong while submitting your booking. Please try again or contact the exhibition team."
      );
    }
  };

  const inputClass =
    "mt-2 w-full border border-neutral-300 bg-white px-4 py-4 text-sm !text-neutral-900 outline-none transition placeholder:!text-neutral-400 focus:border-[#A87942] focus:ring-1 focus:ring-[#A87942]";

  const labelClass =
    "text-[10px] font-semibold uppercase tracking-[0.16em] !text-neutral-600";

  return (
    <section
      id="booking"
      className="scroll-mt-20 bg-[#F5F4F1] px-6 py-24 sm:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <SectionHeading
            eyebrow="Reserve your place"
            title="Book your visit."
            description="Whether you are visiting on your own or coming with a group, use the form to send your preferred visit details to the exhibition team."
          />

          <motion.div
            variants={fadeUp}
            className="mt-10 border-t border-neutral-300 pt-7"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center bg-white text-[#A87942]">
                <Ticket size={20} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Admission
                </p>
                <p className="display-font text-2xl text-neutral-950">
                  Completely free
                </p>
              </div>
            </div>

            <p className="mt-7 text-xs leading-7 text-neutral-500">
              Submitting a booking request allows the exhibition team to
              review your preferred date and visitor details. Your request
              is not confirmed until the team responds.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-start gap-3 border border-neutral-200 bg-white p-5"
          >
            <Clock3 size={18} className="mt-0.5 shrink-0 text-[#A87942]" />
            <p className="text-xs leading-6 text-neutral-600">
              Visiting hours are Tuesday to Sunday, 12 PM – 6 PM. The
              exhibition is closed on Mondays.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="border border-neutral-200 bg-white p-6 sm:p-9 md:p-11"
        >
          <div className="mb-9 border-b border-neutral-200 pb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87942]">
              Visitor booking form
            </p>

            <h3 className="display-font mt-3 text-3xl text-neutral-950 sm:text-4xl">
              Tell us about your visit.
            </h3>

            <p className="mt-3 text-xs leading-7 text-neutral-500">
              Fields marked with an asterisk are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* VISITOR TYPE */}
            <div>
              <label className={labelClass}>01. Type of visit *</label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {["Individual", "Group"].map((type) => {
                  const selected = visitorType === type;
                  const Icon = type === "Individual" ? User : Users;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => changeVisitorType(type)}
                      aria-pressed={selected}
                      className={`flex min-h-[76px] items-center gap-4 border px-5 py-4 text-left transition ${
                        selected
                          ? "border-neutral-950 bg-neutral-950"
                          : "border-neutral-300 bg-white hover:border-neutral-950"
                      }`}
                    >
                      <Icon
                        size={21}
                        className={
                          selected ? "!text-white" : "!text-neutral-600"
                        }
                      />

                      <span
                        className={`text-sm font-semibold ${
                          selected ? "!text-white" : "!text-neutral-800"
                        }`}
                      >
                        {type} visit
                      </span>

                      {selected && (
                        <CheckCircle2
                          size={17}
                          className="ml-auto !text-white"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <div>
              <p className={labelClass}>02. Your details</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="booking-name" className={labelClass}>
                    Full name *
                  </label>
                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-[30px] !text-neutral-400"
                    />
                    <input
                      id="booking-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      value={formData.fullName}
                      onChange={updateField}
                      placeholder="Enter your full name"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-email" className={labelClass}>
                    Email address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-[30px] !text-neutral-400"
                    />
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={updateField}
                      placeholder="you@example.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-phone" className={labelClass}>
                    Phone number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-4 top-[30px] !text-neutral-400"
                    />
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={updateField}
                      placeholder="+234..."
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP DETAILS */}
            {visitorType === "Group" && (
              <div className="border-t border-neutral-200 pt-7">
                <p className={labelClass}>03. Group information</p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-organisation"
                      className={labelClass}
                    >
                      Organisation / group name *
                    </label>
                    <input
                      id="booking-organisation"
                      name="organisation"
                      type="text"
                      required
                      value={formData.organisation}
                      onChange={updateField}
                      placeholder="School, organisation or group"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-role" className={labelClass}>
                      Your role in the group
                    </label>
                    <input
                      id="booking-role"
                      name="contactRole"
                      type="text"
                      value={formData.contactRole}
                      onChange={updateField}
                      placeholder="e.g. Teacher, coordinator"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VISIT DETAILS */}
            <div className="border-t border-neutral-200 pt-7">
              <p className={labelClass}>
                {visitorType === "Group" ? "04." : "03."} Visit details
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className={labelClass}>
                    Preferred visit date *
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-4 top-[30px] !text-neutral-400"
                    />
                    <input
                      id="booking-date"
                      name="visitDate"
                      type="date"
                      required
                      min={minimumDate}
                      max={maximumDate}
                      value={formData.visitDate}
                      onChange={updateField}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-count" className={labelClass}>
                    Number of visitors *
                  </label>
                  <div className="relative">
                    <Users
                      size={17}
                      className="absolute left-4 top-[30px] !text-neutral-400"
                    />
                    <input
                      id="booking-count"
                      name="visitorCount"
                      type="number"
                      required
                      min={visitorType === "Group" ? "2" : "1"}
                      max="500"
                      value={formData.visitorCount}
                      onChange={updateField}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-6 text-neutral-400">
                Visiting hours: Tuesday – Sunday, 12 PM – 6 PM. Please
                select a date within the exhibition period.
              </p>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <div className="border-t border-neutral-200 pt-7">
              <label htmlFor="booking-notes" className={labelClass}>
                Additional information
              </label>

              <textarea
                id="booking-notes"
                name="notes"
                rows={4}
                maxLength={1000}
                value={formData.notes}
                onChange={updateField}
                placeholder="Tell us anything else we should know about your visit..."
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* FREE ADMISSION */}
            <div className="flex items-center justify-between gap-4 border border-[#D8D1C6] bg-[#F8F7F5] p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-neutral-500">
                  Admission fee
                </p>
                <p className="display-font mt-1 text-2xl text-neutral-950">
                  Free
                </p>
              </div>

              <Ticket size={25} className="text-[#A87942]" />
            </div>

            {/* FEEDBACK */}
            {status === "success" && (
              <div
                role="status"
                className="flex items-start gap-3 border border-green-200 bg-green-50 p-4"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                <p className="text-sm leading-6 text-green-800">{feedback}</p>
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="flex items-start gap-3 border border-red-200 bg-red-50 p-4"
              >
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-700"
                />
                <p className="text-sm leading-6 text-red-800">{feedback}</p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex min-h-14 w-full items-center justify-center gap-3 bg-neutral-950 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] !text-white transition hover:bg-[#A87942] hover:!text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="!text-white">
                {status === "submitting"
                  ? "Submitting request..."
                  : "Submit booking request"}
              </span>

              {status === "submitting" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send size={16} className="!text-white" />
              )}
            </button>

            <p className="text-center text-[10px] leading-6 text-neutral-400">
              Submitting this form does not automatically confirm your
              visit. The exhibition team will review your request and
              respond using the contact details you provide.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionHeading
            eyebrow="Find your way"
            title="Meet us in Ilorin."
            description="Join us at the Institute of Contemporary African Art and Film for an experience that brings together Fela's music, history, cultural influence and legacy."
          />

          <motion.div
            variants={fadeUp}
            className="mt-10 border-t border-neutral-200 pt-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F3F0EA] text-[#A87942]">
                <MapPin size={20} strokeWidth={1.5} />
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Exhibition venue
                </p>
                <p className="max-w-sm text-sm leading-7 text-neutral-800">
                  Institute of Contemporary African Art and Film,
                  <br />
                  Ahmadu Bello Way,
                  <br />
                  Ilorin, Kwara State, Nigeria.
                </p>
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-3 border-b border-neutral-900 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] !text-neutral-900 transition hover:border-[#A87942] hover:!text-[#A87942]"
            >
              <span className="!text-neutral-900 hover:!text-[#A87942]">
                Open directions
              </span>
              <Navigation size={14} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
            <iframe
              title="Map showing the exhibition venue in Ilorin"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="absolute -bottom-5 left-5 bg-white px-5 py-4 shadow-xl sm:left-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A87942]">
              The exhibition
            </p>
            <p className="display-font mt-1 text-xl text-neutral-900">
              Ilorin, Nigeria
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="overflow-hidden bg-[#111111] px-6 py-24 text-white sm:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            light
            eyebrow="Inside the retrospective"
            title="More than an exhibition."
            description="Explore the life, ideas and cultural impact of Fela through nine chapters. Each chapter offers a different perspective on the man, the musician and the movement he helped shape."
          />

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter, index) => (
              <motion.div
                variants={fadeUp}
                key={chapter}
                className="group flex min-h-[112px] items-center justify-between border border-white/10 px-6 py-5 transition duration-300 hover:border-[#B88A55]/70 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-5">
                  <span className="text-[10px] tracking-widest text-[#B88A55]">
                    0{index + 1}
                  </span>
                  <h3 className="display-font text-2xl !text-white/90 transition group-hover:!text-[#D9B78D]">
                    {chapter}
                  </h3>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 !text-white/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:!text-[#D9B78D]"
                />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-12">
            <Link
              to="/exhibition"
              className="inline-flex items-center gap-3 border-b border-[#B88A55] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] !text-white transition hover:!text-[#D9B78D]"
            >
              <span className="!text-white">Explore the exhibition</span>
              <ArrowRight size={15} className="!text-white" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ScreeningSection() {
  return (
    <section className="bg-[#EAE6DF] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[380px] overflow-hidden bg-neutral-950 sm:min-h-[480px]"
        >
          <ImageWithFallback
            src="/fela-5.jpg"
            fallback="https://commons.wikimedia.org/wiki/Special:FilePath/Fela_New_Shrine,_Lagos.jpg"
            alt="Archival image connected to Fela's musical legacy"
            className="absolute inset-0 h-full w-full object-cover opacity-65"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D9B78D]">
              Saturday screenings
            </p>
            <h3 className="display-font text-4xl text-white sm:text-5xl">
              The story continues on screen.
            </h3>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            eyebrow="Film programme"
            title="Experience Fela on screen."
            description="Go beyond the exhibition displays with our scheduled film screenings, offering another way to engage with Fela's life, music and legacy."
          />

          <motion.div
            variants={fadeUp}
            className="mt-10 border-y border-neutral-300 py-7"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#171717] text-[#D9B78D]">
                <Film size={24} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Every Saturday
                </p>
                <p className="display-font mt-1 text-3xl text-neutral-950">
                  3:00 PM
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-7 text-xs leading-7 text-neutral-600"
          >
            Film screenings take place every Saturday at 3 PM during the
            exhibition period.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function BeforeYouArrive() {
  const tips = [
    {
      icon: Clock3,
      title: "Give yourself time",
      description:
        "Allow time to move through the exhibition and experience its different chapters at your own pace.",
    },
    {
      icon: Users,
      title: "Coming as a group?",
      description:
        "Groups are welcome! Please submit a booking request with your group details before your visit.",
    },
    {
      icon: Camera,
      title: "Photography",
      description:
        "Please check with the exhibition team at the venue for guidance on photography within the exhibition spaces.",
    },
    {
      icon: Accessibility,
      title: "Accessible venue",
      description:
        "The venue is accessible. If you require specific assistance during your visit, please contact the organisers ahead of time.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24 sm:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            eyebrow="A little preparation"
            title="Before you arrive."
            description="A few things to keep in mind as you prepare for your visit."
          />

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip) => {
              const Icon = tip.icon;

              return (
                <motion.div
                  variants={fadeUp}
                  key={tip.title}
                  className="border-t border-neutral-200 pt-7"
                >
                  <div className="mb-8 flex h-11 w-11 items-center justify-center bg-[#F3F0EA] text-[#A87942]">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  <h3 className="display-font text-2xl text-neutral-950">
                    {tip.title}
                  </h3>

                  <p className="mt-4 text-xs leading-7 text-neutral-500">
                    {tip.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#F5F4F1] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A87942]">
            Need to know
          </p>

          <h2 className="display-font text-5xl leading-[1.05] text-neutral-950 sm:text-6xl">
            Frequently
            <br />
            asked
            <br />
            <span className="italic">questions.</span>
          </h2>

          <p className="mt-7 max-w-sm text-sm leading-8 text-neutral-500">
            Find answers to some of the questions you may have before
            visiting the exhibition.
          </p>
        </div>

        <div className="border-t border-neutral-300">
          {visitorFAQs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left !text-neutral-900"
                >
                  <span className="flex items-start gap-4">
                    <span className="mt-1 text-[10px] tracking-widest text-[#A87942]">
                      0{index + 1}
                    </span>

                    <span className="display-font text-xl !text-neutral-900 sm:text-2xl">
                      {faq.question}
                    </span>
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 !text-neutral-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-9 text-sm leading-8 text-neutral-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#111111] px-6 py-28 text-white sm:px-10 md:py-36 lg:px-16">
      <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/[0.06]" />
      <div className="absolute -right-8 -top-20 h-72 w-72 rounded-full border border-white/[0.06]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-[1280px] text-center"
      >
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9B78D]">
          26 October – 31 December 2026
        </p>

        <h2 className="display-font mx-auto max-w-4xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
          Fela&apos;s story is waiting
          <br />
          <span className="italic text-[#D9B78D]">
            to be experienced.
          </span>
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-white/55">
          Discover the music, the ideas, the resistance and the legacy.
          We look forward to welcoming you.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/exhibition"
            className="inline-flex items-center gap-3 bg-white px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] !text-neutral-950 transition hover:bg-[#D9B78D] hover:!text-neutral-950"
          >
            <span className="!text-neutral-950">
              Explore the exhibition
            </span>
            <ArrowRight size={15} className="!text-neutral-950" />
          </Link>

          <a
            href="#booking"
            className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] !text-white transition hover:border-white hover:bg-white/10 hover:!text-white"
          >
            <span className="!text-white">Book your visit</span>
            <CalendarDays size={15} className="!text-white" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default function Visit() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden bg-white text-neutral-900">
        <Hero />
        <VisitDetails />
        <BookingSection />
        <LocationSection />
        <ExperienceSection />
        <ScreeningSection />
        <BeforeYouArrive />
        <FAQSection />
        <FinalCTA />
      </main>
    </MotionConfig>
  );
}
