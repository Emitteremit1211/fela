
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp } from "lucide-react";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "The Exhibition", path: "/exhibition" },
  { name: "Gallery", path: "/gallery" },
  { name: "Plan Your Visit", path: "/visit" },
  { name: "What's On", path: "/whats-on" },
  { name: "Credits & Contact", path: "/credits" },
];

const credits = [
  {
    label: "Presented by",
    value: "Kwara State Ministry of Communications",
  },
  {
    label: "Curated & Produced by",
    value: "June Creative Art Advisory (JCAA)",
  },
  {
    label: "In partnership with",
    value: "The Kuti Family",
  },
  {
    label: "In collaboration with",
    value: "Felabration",
  },
  {
    label: "In collaboration with",
    value: "Kalakuta Museum",
  },
  {
    label: "In collaboration with",
    value: "Kuti Heritage Museum",
  },
];

const partnerLogos = [
  {
    name: "Kwara State Government",
    image: "/Kwara-State-Government-logo.jpg",
    type: "image",
  },
  {
    name: "June Creative Art Advisory",
    image: "/JCAA_BANK.jpg",
    type: "image",
  },
  {
    name: "Kuti Heritage Museum",
    image: "/Kuti-Heritage-Logo.jpg",
    type: "image",
  },
  {
    name: "Craneburg",
    image: "/craneburg-Logo-CMYK.pdf",
    type: "pdf",
  },
];

const container = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-10";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-neutral-400/60 bg-neutral-200 text-neutral-900">
      <div className={`${container} pb-12 pt-10 sm:pt-14`}>
        {/* Partners & Collaborators - Top of Footer */}
        <section className="border-b border-neutral-400/60 pb-12 sm:pb-16">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                The People Behind the Exhibition
              </p>

              <h3 className="mt-3 font-serif text-3xl text-neutral-900 sm:text-4xl">
                Partners & Collaborators
              </h3>
            </div>

            <p className="max-w-sm text-xs leading-6 text-neutral-500">
              Organisations and creative partners connected with this
              retrospective.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {partnerLogos.map((partner) => (
              <div
                key={partner.name}
                className="flex min-h-[125px] min-w-0 flex-col items-center justify-center gap-3 border border-neutral-300 bg-white p-4 transition-all duration-300 hover:border-neutral-500 hover:shadow-sm sm:min-h-[155px] sm:gap-4 sm:p-6"
              >
                {partner.type === "image" ? (
                  <img
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    className="h-14 w-full object-contain sm:h-20"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <object
                    data={partner.image}
                    type="application/pdf"
                    aria-label={`${partner.name} logo`}
                    className="h-14 w-full sm:h-20"
                  >
                    <span className="flex h-full items-center justify-center font-serif text-lg font-semibold text-neutral-800">
                      CRANEBURG
                    </span>
                  </object>
                )}

                <p className="text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-neutral-600 sm:text-[10px] sm:tracking-[0.13em]">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 pt-12 sm:grid-cols-2 sm:gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Exhibition Identity */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-5">
            <Link to="/" className="inline-flex max-w-full flex-col leading-none">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
                Fela Anikulapo-Kuti
              </span>

              <span className="display-font mt-3 text-4xl text-neutral-900 sm:text-5xl">
                The Retrospective
              </span>
            </Link>

            <span className="mt-6 block h-px w-12 bg-amber-700" />

            <p className="mt-6 max-w-md text-sm leading-7 text-neutral-700">
              Celebrating the life, music, cultural influence and enduring
              legacy of one of Africa's most influential musicians and
              cultural figures.
            </p>

            <div className="mt-8">
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Exhibition dates
              </span>

              <p className="mt-2 text-sm font-semibold">
                26 October – 31 December 2026
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="min-w-0 lg:col-span-3">
            <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Explore
            </h3>

            <nav className="flex flex-col items-start gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex w-fit max-w-full items-center gap-3 text-sm text-neutral-700 transition-colors hover:text-black"
                >
                  <span className="h-px w-0 shrink-0 bg-amber-700 transition-all duration-300 group-hover:w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Visit Information */}
          <div className="min-w-0 lg:col-span-4">
            <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Visit the Exhibition
            </h3>

            <address className="break-words text-sm leading-7 text-neutral-700 not-italic">
              Institute of Contemporary African Art and Film,
              <br />
              Ahmadu Bello Way,
              <br />
              Ilorin, Kwara State, Nigeria.
            </address>

            <div className="mt-5 text-sm leading-7 text-neutral-600">
              <p>Tuesday – Sunday</p>
              <p>12:00 PM – 6:00 PM</p>

              <p className="mt-2 font-semibold text-neutral-900">
                Free Admission
              </p>
            </div>

            <Link
              to="/visit"
              className="group mt-7 inline-flex max-w-full items-center gap-2 border border-neutral-900 bg-transparent px-5 py-3 transition-colors duration-300 hover:bg-neutral-900"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900 transition-colors duration-300 group-hover:text-white">
                Plan Your Visit
              </span>

              <ArrowUpRight
                size={14}
                className="shrink-0 text-neutral-900 transition-colors duration-300 group-hover:text-white"
              />
            </Link>
          </div>
        </div>

        {/* Exhibition Credits */}
        <section className="mt-14 border-t border-neutral-400/60 pt-8 sm:mt-20">
          <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Exhibition Credits
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {credits.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="min-w-0 sm:border-l sm:border-neutral-400/60 sm:pl-6 sm:pr-4 sm:first:border-l-0 sm:first:pl-0"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  {item.label}
                </p>

                <p className="mt-2 break-words text-sm font-semibold text-neutral-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-900">
        <div
          className={`${container} flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className="text-[11px] tracking-wide text-neutral-400">
            © 2026 Fela Anikulapo-Kuti: The Retrospective. All rights reserved.
          </p>

          {/* Developer Credit */}
          <p className="text-[11px] tracking-wide text-neutral-400">
            Developed by{" "}
            <a
              href="https://personal-portfolio-rho-three-54.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-amber-600 pb-0.5 font-semibold text-neutral-200 transition-colors duration-300 hover:text-amber-500"
            >
              Temitope
            </a>
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex w-fit items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300 transition-colors hover:text-white"
          >
            Back to top

            <span className="flex h-8 w-8 items-center justify-center border border-neutral-600 transition-colors group-hover:border-amber-600 group-hover:text-amber-500">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
