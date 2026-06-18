import { useEffect, useState } from "react";
import { Copy } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useRouterState } from "@tanstack/react-router";

const EMAIL = "colemmorgann@gmail.com";

export default function Nav() {
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="mx-auto flex items-center justify-between px-8 py-2.5 font-medium">
        <figure className="flex h-9 flex-col">
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
          <li>
            <Link
              to="/"
              className={`px-2 py-2 ${isDarkMode ? "hover:text-text-dark-heading" : "hover:text-text-heading"}`}
              activeProps={{ className: isDarkMode ? "text-text-dark-heading" : "text-text-heading" }}
              inactiveProps={{ className: isDarkMode ? "text-text-dark-muted" : "text-text-muted" }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={`${textMuted} px-2 py-2 ${isDarkMode ? "hover:text-text-dark-heading" : "hover:text-text-heading"}`}
            >
              Work
            </Link>
          </li>
          <li className={`${textMuted} cursor-pointer px-2 py-2`}>About</li>
          <li>
            <a className="cta bg-surface-action group relative block cursor-pointer overflow-hidden rounded-full px-4 py-2">
              <p className="text-text-on-action relative z-10"> Contact Me &nbsp; →</p>
              <div className="bg-surface-action-hover absolute top-1/2 left-1/2 z-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-200 group-hover:size-36 group-hover:opacity-100"></div>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
