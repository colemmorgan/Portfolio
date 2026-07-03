import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Copy } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { usePageReady } from "@/hooks/usePageReady";

const EMAIL = "colemmorgann@gmail.com";
const RESUME_URL = "/ColeMorgan_Resume.pdf";

export default function Nav() {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pageReady = usePageReady();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: pageReady ? 0 : -32, opacity: pageReady ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      className={`pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 sm:px-8 font-medium transition-[background-color,border-color,padding] duration-300 ${scrolled ? "bg-surface-page border-b border-border-default-dark py-3" : "pt-5"}`}
      style={{ viewTransitionName: "main-nav" }}
    >
      <figure className="pointer-events-auto flex flex-col">
        <Link to="/" className="text-white transition-colors leading-5">
          Cole Morgan
        </Link>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="mt-0.5 flex w-fit cursor-pointer items-center gap-1 text-xs font-normal tracking-wide text-white/75 hover:text-white transition-colors"
        >
          <HugeiconsIcon icon={Copy} size={12} className="shrink-0" />
          <span className="relative inline-block h-[1em] align-bottom">
            <span className={`absolute inset-0 transition-all duration-200 ${copied ? "-translate-y-0.5 opacity-0" : "translate-y-0 opacity-100"}`}>
              {EMAIL}
            </span>
            <span className={`absolute inset-0 transition-all duration-200 ${copied ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-0"}`}>
              Copied!
            </span>
            <span className="sr-only">{copied ? "Copied!" : EMAIL}</span>
          </span>
        </button>
      </figure>

      <ul className="pointer-events-auto flex items-center gap-6 text-sm">
        <li>
          <Link
            to="/"
            activeProps={{ className: "text-white" }}
            inactiveProps={{ className: "text-white/75 hover:text-white transition-colors" }}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            Resume
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/cole-morgan-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </motion.nav>
  );
}
