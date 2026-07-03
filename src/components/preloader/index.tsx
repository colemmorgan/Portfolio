import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import PreloaderContent from "./PreloaderContent";

const COLS = 14;
const ROWS = 10;
const TILE_DURATION = 0.18;
const TILE_STAGGER = 0.005;
const BASE_DELAY = 0.15;

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const d0Ref = useRef<HTMLSpanElement>(null);
  const d1Ref = useRef<HTMLSpanElement>(null);
  const d2Ref = useRef<HTMLSpanElement>(null);
  const counterDoneRef = useRef(false);
  const exitStartedRef = useRef(false);
  const sceneReadyRef = useRef(false);
  const startExitRef = useRef<(() => void) | null>(null);

  const preventScrollRef = useRef<((e: Event) => void) | null>(null);
  const preventKeysRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useLayoutEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (keys.includes(e.key)) e.preventDefault();
    };

    preventScrollRef.current = preventScroll;
    preventKeysRef.current = preventKeys;

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const tweens: gsap.core.Tween[] = [];

    const runExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;

      if (preventScrollRef.current) {
        window.removeEventListener("wheel", preventScrollRef.current);
        window.removeEventListener("touchmove", preventScrollRef.current);
        preventScrollRef.current = null;
      }
      if (preventKeysRef.current) {
        window.removeEventListener("keydown", preventKeysRef.current);
        preventKeysRef.current = null;
      }

      window.dispatchEvent(new Event("preloader-complete"));
      tweens.push(gsap.to(textEl, { opacity: 0, duration: 0.25, ease: "power2.in" }));

      const tiles = Array.from(container.querySelectorAll<HTMLDivElement>(".preloader-tile"));
      const shuffled = [...tiles].sort(() => Math.random() - 0.5);

      shuffled.forEach((tile, i) => {
        tweens.push(
          gsap.to(tile, {
            opacity: 0,
            duration: TILE_DURATION,
            ease: "power2.in",
            delay: BASE_DELAY + i * TILE_STAGGER,
          })
        );
      });

      const totalMs = (BASE_DELAY + (tiles.length - 1) * TILE_STAGGER + TILE_DURATION + 0.1) * 1000;
      setTimeout(() => {
        container.style.visibility = "hidden";
        container.style.pointerEvents = "none";
        document.body.style.backgroundColor = "";
      }, totalMs);
    };

    startExitRef.current = runExit;

    const digitRefs = [d0Ref, d1Ref, d2Ref];
    const counter = { value: 0 };

    const updateDigits = (val: number) => {
      const str = String(val).padStart(3, "0");
      const firstSig = str.split("").findIndex((c) => c !== "0");
      digitRefs.forEach((ref, i) => {
        if (!ref.current) return;
        ref.current.textContent = str[i];
        ref.current.style.color =
          val === 0 || firstSig === -1 || i < firstSig ? "rgba(255,255,255,0.5)" : "#ffffff";
      });
    };

    const counterTween = gsap.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => updateDigits(Math.floor(counter.value)),
      onComplete: () => {
        updateDigits(100);
        counterDoneRef.current = true;
        if (sceneReadyRef.current) runExit();
      },
    });
    tweens.push(counterTween);

    return () => { tweens.forEach((t) => t.kill()); };
  }, []);

  useEffect(() => {
    const handler = () => {
      sceneReadyRef.current = true;
      if (counterDoneRef.current && startExitRef.current) {
        startExitRef.current();
      }
    };
    window.addEventListener("scene-ready", handler);
    return () => window.removeEventListener("scene-ready", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: "all" }}
    >
      <PreloaderContent
        textRef={textRef}
        d0Ref={d0Ref}
        d1Ref={d1Ref}
        d2Ref={d2Ref}
      />

      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return (
          <div
            key={i}
            className="preloader-tile"
            style={{
              position: "absolute",
              left: `${(col / COLS) * 100}%`,
              top: `${(row / ROWS) * 100}%`,
              width: `calc(${100 / COLS}% + 1px)`,
              height: `calc(${100 / ROWS}% + 1px)`,
              backgroundColor: "#080d0a",
              zIndex: 2,
            }}
          />
        );
      })}
    </div>
  );
}
