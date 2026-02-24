import { useState } from "react";
import { Copy } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";

const EMAIL = "colemmorgann@gmail.com";

export default function Nav() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav
      className="border-border-default bg-surface-page fixed top-0 right-0 left-0 z-50 border-b"
      style={{ viewTransitionName: "main-nav" }}
    >
      <div className="mx-auto flex items-center justify-between px-8 py-2.5 font-medium">
        <figure className="items-baseline gap-2">
          <Link to="/" className="leading-5 hover:opacity-80">
            Cole Morgan
          </Link>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="text-text-muted hover:text-text-heading mt-0.5 flex w-fit cursor-pointer items-center gap-1 text-xs leading-3.5 font-normal tracking-wide transition-colors"
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
              className="px-2 py-2 hover:text-text-heading"
              activeProps={{ className: "text-text-heading" }}
              inactiveProps={{ className: "text-text-muted" }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-text-muted px-2 py-2 hover:text-text-heading"
            >
              Work
            </Link>
          </li>
          <li className="text-text-muted cursor-pointer px-2 py-2">About</li>
          <li>
            <a className="cta bg-surface-action group relative block cursor-pointer overflow-hidden rounded-full px-4 py-2">
              <p className="relative z-10"> Contact Me &nbsp; →</p>
              <div className="bg-surface-action-hover absolute top-1/2 left-1/2 z-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-200 group-hover:size-36 group-hover:opacity-100"></div>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
