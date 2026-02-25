import { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  // React 18 useId includes ":" which breaks url(#id)
  const baseId = useId().replace(/:/g, "");
  const cutoutMaskId = `${baseId}-cutout`;

  const [fontsReady, setFontsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "start start"],
  });

  const footerMargin = useTransform(scrollYProgress, [0, 1], ["0px", "32px"]);

  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) {
      setFontsReady(true);
      return;
    }
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  return (
    <motion.footer
      ref={footerRef}
      data-home-footer="true"
      className="relative z-10 overflow-hidden rounded-2xl p-8 pt-20"
      style={{ margin: footerMargin }}
    >
      {/* Subtle dark backdrop over global scene */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-white/15" />

      <div className="relative z-20 mb-20 flex flex-col gap-4">
        <figure>
          <img src="/signature.svg" alt="Signature" className="h-5" />
        </figure>
        <p className="text-text-dark-muted text-sm">
          © 2026 Cole Morgan. All rights reserved.
        </p>
      </div>

      <div className="relative z-20 grid grid-cols-12 gap-8">
        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-dark-heading">Social Media/Contact</p>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            LinkedIn ↗
          </a>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            GitHub ↗
          </a>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            Email ↗
          </a>
        </div>

        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-dark-heading">Pages</p>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            Home
          </a>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            Work
          </a>
          <a
            href=""
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5"
          >
            About
          </a>
        </div>

        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-dark-heading">Case Studies</p>
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/work/$projectSlug"
              params={{ projectSlug: project.slug }}
              className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
            >
              {project.title} ↗
            </Link>
          ))}
        </div>
      </div>

      <div className="text-text-dark-muted relative z-20 mt-24 mb-8 grid grid-cols-4 items-end gap-8">
        <p>
          Designed in Figma. <br /> Built with TanStack Start.
        </p>
        <p>
          Type set in <span className="underline">PP Neue Montreal</span>
        </p>
      </div>

      <div className="h-[clamp(88px,9.2vw,180px)]" aria-hidden />

      {/* <p
        className="text-text-dark-heading pointer-events-none absolute right-8 bottom-0 z-30 text-[clamp(88px,9.2vw,180px)] leading-none font-medium tracking-[-0.04em] opacity-15"
        aria-hidden
      >
        04
      </p> */}

      {/* Cutout mask */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id={cutoutMaskId}>
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {fontsReady && (
                <>
                  <text
                    x="32"
                    y="99%"
                    fill="black"
                    className="footer-mask-text"
                    textAnchor="start"
                  >
                    Cole Morgan
                  </text>
                </>
              )}
            </mask>
          </defs>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="#131415"
            mask={`url(#${cutoutMaskId})`}
          />
        </svg>
      </div>
    </motion.footer>
  );
}
