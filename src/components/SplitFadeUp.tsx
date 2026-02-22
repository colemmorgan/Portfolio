import { motion, useInView } from "motion/react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import SplitType from "split-type";

// AI slop animation but it works :)

type ElementType = "h1" | "h2" | "h3" | "p" | "div";

interface SplitFadeUpProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  trigger?: "mount" | "inView";
  onAnimationComplete?: () => void;
}

export default function SplitFadeUp({
  children,
  className = "",
  as: Component = "div",
  trigger = "mount",
  onAnimationComplete,
}: SplitFadeUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2, once: true });
  const [lines, setLines] = useState<string[]>([]);

  const shouldAnimate =
    trigger === "mount" || (trigger === "inView" && isInView);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    let split: SplitType | null = null;
    let rafId: number | null = null;
    let visibilityTimeout: ReturnType<typeof setTimeout> | null = null;

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

  const lineContent = lines.map((line, i) => (
    <span key={i} className="block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={shouldAnimate ? { y: "0%" } : { y: "100%" }}
        transition={{
          duration: 0.7,
          ease: [0.33, 1, 0.68, 1],
          delay: i * 0.09,
        }}
        onAnimationComplete={
          i === lines.length - 1 ? handleComplete : undefined
        }
      >
        {line}
      </motion.span>
    </span>
  ));

  const Comp = Component;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <Comp
        ref={measureRef as React.RefObject<HTMLHeadingElement & HTMLDivElement>}
        className={`pointer-events-none absolute top-0 left-0 w-full opacity-0 ${className}`.trim()}
        aria-hidden
      >
        {children}
      </Comp>
      <Comp className={className}>
        {lines.length > 0 ? lineContent : children}
      </Comp>
    </div>
  );
}
