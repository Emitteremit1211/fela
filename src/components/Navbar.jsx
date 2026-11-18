import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "The Exhibition", path: "/exhibition" },
  { name: "Gallery", path: "/gallery" },
  { name: "Plan Your Visit", path: "/visit" },
  { name: "What's On", path: "/whats-on" },
  { name: "Credits & Contact", path: "/credits" },
];

const leftLinks = navLinks.slice(0, 3);
const rightLinks = navLinks.slice(3);

const desktopLink = ({ isActive }) =>
  `relative py-2 text-[11px] font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-300
   after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-amber-700 after:transition-all after:duration-500
   ${
     isActive
       ? "text-neutral-900 after:w-full"
       : "text-neutral-600 hover:text-neutral-900 after:w-0 hover:after:w-full"
   }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-neutral-200/95 backdrop-blur-md border-b border-neutral-400/60 transition-shadow duration-300 ${
        scrolled || menuOpen ? "shadow-[0_8px_30px_-14px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-10">
        <div
          className={`h-[72px] flex items-center justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-8 transition-all duration-300 ${
            scrolled ? "xl:h-[72px]" : "xl:h-[96px]"
          }`}
        >
          {/* Left links (xl+) */}
          <nav className="hidden xl:flex items-center gap-8 justify-self-start">
            {leftLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={desktopLink}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col items-start xl:items-center leading-none min-w-0"
          >
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.24em] sm:tracking-[0.3em] text-neutral-600 truncate max-w-full">
              Fela Anikulapo-Kuti
            </span>
            <span
              className={`display-font mt-1.5 xl:mt-2 text-neutral-900 whitespace-nowrap transition-all duration-300 text-[20px] sm:text-[24px] ${
                scrolled ? "xl:text-[24px]" : "xl:text-[30px]"
              }`}
            >
              The Retrospective
            </span>
            <span className="hidden xl:block mt-2.5 h-px w-10 bg-amber-700" />
          </Link>

          {/* Right links + CTA (xl+) */}
          <div className="hidden xl:flex items-center justify-self-end gap-6 2xl:gap-8">
            {rightLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={desktopLink}>
                {link.name}
              </NavLink>
            ))}

            {/* Visit button: text turns white, bg turns black on hover */}
            <Link
              to="/visit"
              className="group inline-flex items-center gap-2 border border-neutral-900 bg-transparent px-5 py-2.5 whitespace-nowrap transition-colors duration-300 hover:bg-neutral-900"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900 transition-colors duration-300 group-hover:text-white">
                Visit
              </span>
              <ArrowUpRight
                size={13}
                className="text-neutral-900 transition-colors duration-300 group-hover:text-white"
              />
            </Link>
          </div>

          {/* Hamburger (below xl) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="xl:hidden shrink-0 -mr-2 p-2 text-neutral-900"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? (
              <X size={26} strokeWidth={1.5} />
            ) : (
              <Menu size={26} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Full-screen panel (below xl) */}
      <div
        id="mobile-nav"
        className={`xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-72px)] bg-neutral-200 overflow-y-auto transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <nav className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 min-h-full py-8 flex flex-col">
          <div className="flex flex-col">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `group flex items-baseline gap-5 py-5 border-b border-neutral-400/60 transition-colors ${
                    isActive
                      ? "text-amber-800"
                      : "text-neutral-900 hover:text-amber-800"
                  }`
                }
              >
                <span className="text-[11px] font-medium tracking-[0.2em] text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="display-font text-[26px] sm:text-[30px] leading-none flex-1">
                  {link.name}
                </span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
              </NavLink>
            ))}
          </div>

          <Link
            to="/visit"
            className="group mt-auto flex items-center justify-center gap-2 bg-neutral-900 py-4 transition-colors hover:bg-neutral-700"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
              Visit Exhibition
            </span>
            <ArrowUpRight size={15} className="text-white" />
          </Link>
        </nav>
      </div>
    </header>
  );
}