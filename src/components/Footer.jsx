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
  { label: "Presented by", value: "Kwara State Ministry of Communications" },
  { label: "Curated & Produced by", value: "June Creative Art Advisory (JCAA)" },
  { label: "In partnership with", value: "The Kuti Family" },
];

const container = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-10";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-200 text-neutral-900 border-t border-neutral-400/60">
      {/* Main Footer */}
      <div className={`${container} pt-14 sm:pt-20 pb-12`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Exhibition Identity */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="inline-flex flex-col leading-none">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
                Fela Anikulapo-Kuti
              </span>
              <span className="display-font text-[40px] sm:text-5xl mt-3 text-neutral-900">
                The Retrospective
              </span>
            </Link>

            <span className="block mt-6 h-px w-12 bg-amber-700" />

            <p className="mt-6 text-sm text-neutral-700 leading-7 max-w-md">
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
          <div className="lg:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.22em] font-semibold text-neutral-500 mb-6">
              Explore
            </h3>

            <nav className="flex flex-col gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center gap-3 w-fit text-sm text-neutral-700 hover:text-black transition-colors"
                >
                  <span className="h-px w-0 bg-amber-700 transition-all duration-300 group-hover:w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Visit Information */}
          <div className="lg:col-span-4">
            <h3 className="text-[10px] uppercase tracking-[0.22em] font-semibold text-neutral-500 mb-6">
              Visit the Exhibition
            </h3>

            <address className="not-italic text-sm text-neutral-700 leading-7">
              Institute of Contemporary African Art and Film,
              <br />
              Ahmadu Bello Way,
              <br />
              Ilorin, Kwara State, Nigeria.
            </address>

            <div className="mt-5 text-sm text-neutral-600 leading-7">
              <p>Tuesday – Sunday</p>
              <p>12:00 PM – 6:00 PM</p>
              <p className="mt-2 font-semibold text-neutral-900">
                Free Admission
              </p>
            </div>

            {/* Plan Your Visit button: text turns white, bg turns black on hover */}
            <Link
              to="/visit"
              className="group inline-flex items-center gap-2 mt-7 border border-neutral-900 bg-transparent px-5 py-3 transition-colors duration-300 hover:bg-neutral-900"
            >
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-white">
                Plan Your Visit
              </span>
              <ArrowUpRight
                size={14}
                className="text-neutral-900 transition-colors duration-300 group-hover:text-white"
              />
            </Link>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-neutral-400/60">
          <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-6">
            Exhibition Credits
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0">
            {credits.map((item) => (
              <div
                key={item.label}
                className="sm:border-l sm:border-neutral-400/60 sm:pl-6 sm:pr-4 sm:first:border-l-0 sm:first:pl-0"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold mt-2 text-neutral-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-900">
        <div
          className={`${container} py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
        >
          <p className="text-[11px] text-neutral-400 tracking-wide">
            © 2026 Fela Anikulapo-Kuti: The Retrospective. All rights reserved.
          </p>

          {/* Developer credit */}
          <p className="text-[11px] text-neutral-400 tracking-wide">
            Developed by{" "}
            <a
              href="https://personal-portfolio-rho-three-54.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-200 border-b border-amber-600 pb-0.5 transition-colors duration-300 hover:text-amber-500"
            >
              Temitope
            </a>
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300 hover:text-white transition-colors"
          >
            Back to top
            <span className="w-8 h-8 border border-neutral-600 flex items-center justify-center group-hover:border-amber-600 group-hover:text-amber-500 transition-colors">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}