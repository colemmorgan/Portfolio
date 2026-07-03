import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { g as gsapWithCSS, S as ScrollTrigger } from "../_libs/gsap.mjs";
import { usePageReady } from "./router-CJiwAxAu.mjs";
import { S as SplitType } from "../_libs/split-type.mjs";
import { u as useInView, m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/hugeicons__core-free-icons.mjs";
import "../_libs/react-three__fiber.mjs";
import "../_libs/three.mjs";
import "../_libs/zustand.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/scheduler.mjs";
import "../_libs/its-fine.mjs";
import "../_libs/react-use-measure.mjs";
import "../_libs/hugeicons__react.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const projects = [
  {
    slug: "greatdient",
    image: "/project-mockups/wizlite.png",
    title: "RE Game Asset Viewer",
    liveUrl: "https://stitch101.com",
    description: "Platform for visualizing and managing reverse-engineered Wizard101 assets, supporting 1,000+ registered users",
    techStack: "React, Rust, TypeScript, PSQL, FastAPI",
    hosting: "AWS (S3, CloudFront, EC2, RDS, Route 53)"
  },
  {
    slug: "society-of-pc-building",
    image: "/project-mockups/spcb.png",
    title: "Society of PC Building",
    liveUrl: "https://www.spcbatuf.org/",
    description: "Website for the Society of PC Building, serving 1,000+ club members with Firebase integration and a custom admin panel for real-time content management",
    techStack: "Next.js, TypeScript, Firebase, Figma",
    hosting: "Firebase, Vercel"
  },
  {
    slug: "coaching-personal-website",
    image: "/project-mockups/fionn.png",
    title: "Coaching Personal Website",
    liveUrl: "https://www.fionn.pro/",
    description: "Freelance design/development project I created for a client to tell a story about his career and create a personal brand.",
    techStack: "React, Figma, TypeScript",
    hosting: "Vercel"
  }
];
gsapWithCSS.registerPlugin(ScrollTrigger);
function Work({ canAnimate = false }) {
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!canAnimate || !containerRef.current) return;
    const projectElements = containerRef.current.querySelectorAll(
      "[data-project-item]"
    );
    const ctx = gsapWithCSS.context(() => {
      projectElements.forEach((element) => {
        gsapWithCSS.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [canAnimate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "work", className: "border-border-default-dark border-b scroll-mt-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-1 sm:mb-3 text-3xl sm:text-4xl font-medium text-text-dark-heading", children: "02 Work" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, children: projects.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        id: project.slug,
        "data-project-item": true,
        className: `border-border-default-dark grid grid-cols-1 gap-6 xl:gap-8 border-b border-dashed py-6 last:border-b-0 scroll-mt-14 xl:grid-cols-12 ${canAnimate ? "opacity-0" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "figure",
            {
              className: "border-border-default-dark aspect-3/2 overflow-hidden border xl:col-span-6",
              style: { viewTransitionName: `project-${project.slug}` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: project.image,
                  alt: "",
                  className: "block h-full w-full object-cover"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between xl:col-span-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: project.liveUrl ?? "#",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "group relative inline-block w-fit mb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative z-10 flex cursor-pointer items-center gap-1.5 text-xl font-medium text-text-dark-heading", children: [
                    project.title,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pr-1.5", children: "↗" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bottom-0 -left-1.5 flex flex-col justify-between border border-transparent transition-all duration-200 group-hover:border-white/10 group-hover:bg-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-px w-0 -translate-px transition-all duration-200 group-hover:w-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-0 w-px -translate-px transition-all duration-200 group-hover:h-[7px]" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-px w-0 translate-x-px -translate-y-px transition-all duration-200 group-hover:w-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-0 w-px translate-x-px -translate-y-px transition-all duration-200 group-hover:h-[7px]" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-0 w-px -translate-x-px translate-y-px transition-all duration-200 group-hover:h-[7px]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-px w-0 -translate-x-px translate-y-px transition-all duration-200 group-hover:w-2" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-0 w-px translate-px transition-all duration-200 group-hover:h-[7px]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-text-dark-heading block h-px w-0 translate-px transition-all duration-200 group-hover:w-2" })
                      ] })
                    ] })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-text-dark-body col-span-6 lg:col-span-4 font-medium", children: project.description }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-border-default-dark mt-4 grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-8 border-t py-2 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-text-dark-muted col-span-3", children: "Tech Stack" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-text-dark-body col-span-3", children: project.techStack })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-border-default-dark grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-8 border-y py-2 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-text-dark-muted col-span-3", children: "Hosting" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-text-dark-body col-span-3", children: project.hosting })
              ] })
            ] })
          ] })
        ]
      },
      project.slug
    )) })
  ] }) });
}
function SplitFadeUp({
  children,
  className = "",
  as: Component = "div",
  trigger = "mount",
  initialDelay = 0.5,
  onAnimationComplete
}) {
  const containerRef = reactExports.useRef(null);
  const measureRef = reactExports.useRef(null);
  const isInView = useInView(containerRef, { amount: 0.2, once: true });
  const [lines, setLines] = reactExports.useState([]);
  const pageReady = usePageReady();
  const shouldAnimate = pageReady && (trigger === "mount" || trigger === "inView" && isInView);
  reactExports.useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    let split = null;
    let rafId = null;
    let visibilityTimeout = null;
    const runSplit = () => {
      if (split) split.revert();
      split = new SplitType(el, { types: "lines" });
      if (split.lines) {
        setLines(split.lines.map((line) => line.textContent ?? ""));
      }
    };
    const runSplitAfterLayout = () => {
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (document.visibilityState === "hidden") return;
          runSplit();
        });
      });
    };
    const onResize = () => {
      if (document.visibilityState === "hidden") return;
      runSplitAfterLayout();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      visibilityTimeout = setTimeout(() => {
        visibilityTimeout = null;
        runSplitAfterLayout();
      }, 150);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    runSplitAfterLayout();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (visibilityTimeout !== null) clearTimeout(visibilityTimeout);
      split?.revert();
    };
  }, [children]);
  const handleComplete = () => {
    onAnimationComplete?.();
  };
  const lineContent = lines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.span,
    {
      className: "inline-block",
      initial: { y: "100%" },
      animate: shouldAnimate ? { y: "0%" } : { y: "100%" },
      transition: {
        duration: 0.7,
        ease: [0.33, 1, 0.68, 1],
        delay: initialDelay + i * 0.09
      },
      onAnimationComplete: i === lines.length - 1 ? handleComplete : void 0,
      children: line
    }
  ) }, i));
  const Comp = Component;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: `relative w-full ${className}`.trim(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        ref: measureRef,
        className: `pointer-events-none absolute top-0 left-0 w-full opacity-0 ${className}`.trim(),
        "aria-hidden": true,
        children
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className, children: lines.length > 0 ? lineContent : children })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen flex items-end p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitFadeUp, { as: "h1", className: "text-white text-[34px] leading-[1.1em] tracking-[-0.01em] font-medium max-w-[1030px] sm:text-[44px] sm:leading-[1.05em] lg:text-[56px] xl:text-[60px]", trigger: "mount", initialDelay: 0.7, children: "Software Engineer building geospatial tools and ML platforms at Satlantis. Graduating from UFlorida spring 2027." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface-page", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Work, { canAnimate: true }) })
  ] });
}
export {
  App as component
};
