import { useEffect, useId, useState } from "react";
// import { Link } from "@tanstack/react-router";
// import { projects } from "@/data/projects";

export default function Footer() {
  // React 18 useId includes ":" which breaks url(#id)
  const baseId = useId().replace(/:/g, "");
  const cutoutMaskId = `${baseId}-cutout`;

  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) {
      setFontsReady(true);
      return;
    }
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  return (
    <footer
      data-home-footer="true"
      className="relative z-10 px-6 pt-12 pb-5 text-sm sm:p-8 sm:pt-20 sm:text-base border-t border-border-default"
    >
      <div className="relative z-20 mb-8 flex flex-col gap-3 sm:mb-20 sm:gap-4">
        <figure>
          <img src="/signature.svg" alt="Signature" className="h-4 sm:h-5" />
        </figure>
        <p className="text-text-muted text-xs sm:text-sm">
          © 2026 Cole Morgan. All rights reserved.
        </p>
      </div>

      <div className="relative z-20 grid grid-cols-1 gap-8 sm:grid-cols-12">
        <div className="flex flex-col gap-3 font-medium sm:col-span-3">
          <p className="text-text-heading">Social Media/Contact</p>
          <a
            href="https://www.linkedin.com/in/cole-morgan-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/colemmorgan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="mailto:colemmorgann@gmail.com"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            Email ↗
          </a>
        </div>

        <div className="flex flex-col gap-3 font-medium sm:col-span-3">
          <p className="text-text-heading">Sections</p>
          <a
            href="/#"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            Home
          </a>
          <a
            href="/#work"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            Work
          </a>
          <a
            href="/#experience"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            Experience
          </a>
          <a
            href="/#competencies"
            className="text-text-body hover:text-text-heading w-fit py-0.5 transition-colors"
          >
            Competencies
          </a>
        </div>
      </div>

      <div className="text-text-muted relative z-20 mt-12 mb-8 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-4 sm:items-end sm:gap-8">
        <p>
          Designed in Figma. <br /> Built with TanStack Start.
        </p>
        <p>
          Type set in <span className="underline">PP Neue Montreal</span>
        </p>
      </div>

      <div className="h-[clamp(48px,11vw,180px)]" aria-hidden />

      {/* White fill with a "Cole Morgan"-shaped cutout revealing the canvas behind */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
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
            fill="white"
            mask={`url(#${cutoutMaskId})`}
          />
        </svg>
      </div>
    </footer>
  );
}
