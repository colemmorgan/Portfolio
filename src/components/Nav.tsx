import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { usePageReady } from "@/hooks/usePageReady";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "colemmorgann@gmail.com";
const RESUME_URL = "/ColeMorgan_Resume.pdf";

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
  { name: "Resume", href: RESUME_URL },
];

function isExternalLink(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf");
}

const MENU_TILE_TARGET_PX = 100;
const MENU_TILE_DURATION = 0.09;
const MENU_BASE_DELAY = 0.03;
// Total sweep time across all tiles — quicker than the page preloader's reveal.
const MENU_TOTAL_STAGGER_SPAN = 0.25;
// Content fades in only once the tile background has mostly formed.
const MENU_CONTENT_IN_DELAY = MENU_BASE_DELAY + MENU_TOTAL_STAGGER_SPAN * 0.7;
const MENU_CONTENT_IN_DURATION = 0.2;
const MENU_CONTENT_OUT_DURATION = 0.08;

export default function Nav() {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuCols, setMenuCols] = useState(8);
  const [menuRows, setMenuRows] = useState(14);
  const pageReady = usePageReady();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuTweensRef = useRef<gsap.core.Tween[]>([]);
  const menuContentTweenRef = useRef<gsap.core.Tween | null>(null);
  const menuMountedRef = useRef(false);

  useEffect(() => {
    if (!document.getElementById("hero-heading")) return;

    const trigger = ScrollTrigger.create({
      trigger: "#hero-heading",
      start: "top top",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    setMenuCols(
      Math.max(1, Math.round(window.innerWidth / MENU_TILE_TARGET_PX)),
    );
    setMenuRows(
      Math.max(1, Math.round(window.innerHeight / MENU_TILE_TARGET_PX)),
    );
  }, []);

  useEffect(() => {
    const overlay = menuOverlayRef.current;
    if (!overlay) return;

    if (!menuMountedRef.current) {
      menuMountedRef.current = true;
      return;
    }

    menuTweensRef.current.forEach((t) => t.kill());
    menuTweensRef.current = [];

    const tiles = Array.from(
      overlay.querySelectorAll<HTMLDivElement>(".nav-menu-tile"),
    );
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    const stagger =
      tiles.length > 1 ? MENU_TOTAL_STAGGER_SPAN / (tiles.length - 1) : 0;

    const content = menuContentRef.current;
    menuContentTweenRef.current?.kill();

    if (menuOpen) {
      overlay.style.visibility = "visible";
      overlay.style.pointerEvents = "auto";
      tiles.forEach((tile) => {
        tile.style.opacity = "0";
      });

      shuffled.forEach((tile, i) => {
        menuTweensRef.current.push(
          gsap.to(tile, {
            opacity: 1,
            duration: MENU_TILE_DURATION,
            ease: "power2.out",
            delay: MENU_BASE_DELAY + i * stagger,
          }),
        );
      });

      if (content) {
        content.style.opacity = "0";
        menuContentTweenRef.current = gsap.to(content, {
          opacity: 1,
          duration: MENU_CONTENT_IN_DURATION,
          ease: "power2.out",
          delay: MENU_CONTENT_IN_DELAY,
        });
      }
    } else {
      if (content) {
        menuContentTweenRef.current = gsap.to(content, {
          opacity: 0,
          duration: MENU_CONTENT_OUT_DURATION,
          ease: "power1.in",
        });
      }

      shuffled.forEach((tile, i) => {
        menuTweensRef.current.push(
          gsap.to(tile, {
            opacity: 0,
            duration: MENU_TILE_DURATION,
            ease: "power2.in",
            delay: MENU_BASE_DELAY + i * stagger,
          }),
        );
      });

      const totalMs =
        (MENU_BASE_DELAY +
          MENU_TOTAL_STAGGER_SPAN +
          MENU_TILE_DURATION +
          0.05) *
        1000;
      const hideTimeout = setTimeout(() => {
        overlay.style.visibility = "hidden";
        overlay.style.pointerEvents = "none";
      }, totalMs);
      return () => clearTimeout(hideTimeout);
    }
  }, [menuOpen]);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSectionLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    e.preventDefault();
    const id = href.slice(hashIndex + 1);

    if (id) {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: pageReady ? 0 : -32, opacity: pageReady ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      className={`pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-3.5 font-medium transition-[background-color,border-color] duration-200 sm:px-8 sm:py-3 ${scrolled ? "bg-surface-page border-border-default-dark border-b" : "border-b border-transparent"}`}
      style={{ viewTransitionName: "main-nav" }}
    >
      <figure className="pointer-events-auto flex flex-col">
        <Link
          to="/"
          className="text-text-dark-heading leading-5 transition-colors"
        >
          Cole Morgan
        </Link>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="text-text-dark-body hover:text-text-dark-heading mt-0.5 flex w-fit cursor-pointer items-center gap-1 text-xs font-normal tracking-wide transition-colors"
        >
          <HugeiconsIcon icon={Copy} size={12} className="shrink-0" />
          <span className="relative inline-block h-[1em] align-bottom">
            <span
              className={`absolute inset-0 transition-all duration-200 ${copied ? "-translate-y-0.5 opacity-0" : "translate-y-0 opacity-100"}`}
            >
              {EMAIL}
            </span>
            <span
              className={`absolute inset-0 transition-all duration-200 ${copied ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-0"}`}
            >
              Copied!
            </span>
            <span className="sr-only">{copied ? "Copied!" : EMAIL}</span>
          </span>
        </button>
      </figure>

      <ul className="pointer-events-auto hidden items-center gap-6 text-sm sm:flex">
        <li>
          <Link
            to="/"
            activeProps={{ className: "text-text-dark-heading" }}
            inactiveProps={{
              className:
                "text-text-dark-body hover:text-text-dark-heading transition-colors",
            }}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark-muted hover:text-text-dark-heading transition-colors"
          >
            Resume
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/cole-morgan-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark-muted hover:text-text-dark-heading transition-colors"
          >
            LinkedIn
          </a>
        </li>
      </ul>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="border-border-default-dark text-text-dark-heading pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border bg-black/20 transition-colors hover:bg-white/10 sm:hidden"
      >
        <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={18} />
      </button>

      <div
        ref={menuOverlayRef}
        className="pointer-events-none fixed inset-0 z-100 sm:hidden"
        style={{ visibility: "hidden" }}
      >
        <div ref={menuContentRef} className="relative z-10 h-full">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-text-dark-heading float-right mt-4 mr-6 cursor-pointer text-sm font-medium transition-colors"
          >
            Close
          </button>

          <div className="flex h-full flex-col justify-end gap-8 p-6 pb-10">
            <ul className="flex flex-col gap-3 text-4xl font-medium">
              {sectionLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSectionLinkClick(e, link.href)}
                    className="text-text-dark-heading block transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="border-border-default-dark flex w-fit flex-col gap-3 border-t pt-6 text-4xl font-medium">
              {contactLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={isExternalLink(link.href) ? "_blank" : undefined}
                    rel={
                      isExternalLink(link.href)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                    className="text-text-dark-heading transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0 grid"
          style={{
            gridTemplateColumns: `repeat(${menuCols}, 1fr)`,
            gridTemplateRows: `repeat(${menuRows}, 1fr)`,
          }}
        >
          {Array.from({ length: menuCols * menuRows }).map((_, i) => (
            <div
              key={i}
              className="nav-menu-tile"
              style={{ backgroundColor: "var(--color-surface-page)" }}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
