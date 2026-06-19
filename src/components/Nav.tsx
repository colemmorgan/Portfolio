import { useEffect, useState } from "react";
import { Copy, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

const EMAIL = "colemmorgann@gmail.com";

const sectionLinks = [
  { name: "Home", href: "/#" },
  { name: "Work", href: "/#work" },
  { name: "Experience", href: "/#experience" },
  { name: "Competencies", href: "/#competencies" },
];

const contactLinks = [
  { name: "Email", href: `mailto:${EMAIL}` },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/cole-morgan-/" },
  { name: "GitHub", href: "https://github.com/colemmorgan" },
];

export default function Nav() {
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsDarkMode(false);
      return;
    }

    const updateNavTheme = () => {
      const trigger = document.querySelector<HTMLElement>(
        '[data-nav-dark-trigger="true"]',
      );
      if (!trigger) {
        setIsDarkMode(false);
        return;
      }

      setIsDarkMode(trigger.getBoundingClientRect().top <= 0);
    };

    updateNavTheme();
    window.addEventListener("scroll", updateNavTheme, { passive: true });
    window.addEventListener("resize", updateNavTheme);

    return () => {
      window.removeEventListener("scroll", updateNavTheme);
      window.removeEventListener("resize", updateNavTheme);
    };
  }, [pathname]);

  const navSurface = isDarkMode ? "bg-surface-dark" : "bg-surface-page";
  const navBorder = isDarkMode ? "border-border-default-dark" : "border-border-default";
  const textHeading = isDarkMode ? "text-text-dark-heading" : "text-text-heading";
  const textMuted = isDarkMode ? "text-text-dark-muted" : "text-text-muted";

  return (
    <nav
      className={`${navBorder} ${navSurface} fixed top-0 right-0 left-0 z-50 border-b transition-colors`}
      style={{ viewTransitionName: "main-nav" }}
    >
      <div className="mx-auto flex items-center justify-between px-6 sm:px-8 py-2.5 font-medium">
        <Link to="/" className="sm:hidden" aria-label="Cole Morgan">
          <img src="/icons/circle.svg" alt="" className="size-9" />
        </Link>

        <figure className="hidden h-9 flex-col sm:flex">
          <Link to="/" className={`h-5 leading-5 hover:opacity-80 ${textHeading}`}>
            Cole Morgan
          </Link>
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`${textMuted} ${isDarkMode ? "hover:text-text-dark-heading" : "hover:text-text-heading"} mt-0.5 flex h-3.5 w-fit cursor-pointer items-center gap-1 text-xs leading-3.5 font-normal tracking-wide transition-colors`}
          >
            <HugeiconsIcon icon={Copy} size={14} className="shrink-0" />
            <span className="relative inline-block h-[1em] align-bottom">
              {/* EMAIL */}
              <span
                aria-hidden={copied}
                className={`absolute inset-0 transition-all duration-200 ${
                  copied
                    ? "-translate-y-0.5 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {EMAIL}
              </span>

              {/* COPIED */}
              <span
                aria-hidden={!copied}
                className={`absolute inset-0 transition-all duration-200 ${
                  copied
                    ? "translate-y-0 opacity-100"
                    : "translate-y-0.5 opacity-0"
                }`}
              >
                Copied!
              </span>

              {/* screenreader only (optional, but nice) */}
              <span className="sr-only">{copied ? "Copied!" : EMAIL}</span>
            </span>
          </button>
        </figure>

        <ul className="flex items-center gap-3 leading-5">
          <li className="hidden sm:block">
            <Link
              to="/"
              className={`px-2 py-2 ${isDarkMode ? "hover:text-text-dark-heading" : "hover:text-text-heading"}`}
              activeProps={{ className: isDarkMode ? "text-text-dark-heading" : "text-text-heading" }}
              inactiveProps={{ className: isDarkMode ? "text-text-dark-muted" : "text-text-muted" }}
            >
              Home
            </Link>
          </li>
          <li className="hidden sm:block">
            <a
              href="https://www.linkedin.com/in/cole-morgan-/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta bg-surface-action group relative block cursor-pointer overflow-hidden rounded-full px-4 py-2"
            >
              <p className="text-text-on-action relative z-10"> Contact Me &nbsp; →</p>
              <div className="bg-surface-action-hover absolute top-1/2 left-1/2 z-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-200 group-hover:size-36 group-hover:opacity-100"></div>
            </a>
          </li>
          <li className="sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`${textHeading} ${navBorder} flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border p-2 transition-colors hover:bg-black/4`}
            >
              <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={18} />
            </button>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="bg-[#009DD6] fixed inset-0 z-100 sm:hidden"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-text-heading absolute top-4 right-6 cursor-pointer text-sm font-medium transition-colors"
            >
              Close
            </button>

            <div className="flex h-full flex-col justify-end gap-8 p-6 pb-10">
              <ul className="flex flex-col gap-3 text-4xl font-medium">
                {sectionLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-white  block transition-colors up"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="border-border-default flex w-fit flex-col gap-3 border-t pt-6 text-4xl font-medium">
                {contactLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
