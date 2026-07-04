import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const DEFAULT_COLS = 14;
const DEFAULT_ROWS = 10;
const TARGET_TILE_SIZE_PX = 100;
const TILE_DURATION = 0.18;
const BASE_DELAY = 0.15;
// Total time the staggered sweep across all tiles takes, regardless of how
// many tiles there are (tuned against the default 14x10 grid).
const TOTAL_STAGGER_SPAN = (DEFAULT_COLS * DEFAULT_ROWS - 1) * 0.005;

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const introDoneRef = useRef(false);
  const exitStartedRef = useRef(false);
  const sceneReadyRef = useRef(false);
  const startExitRef = useRef<(() => void) | null>(null);
  const replayRef = useRef<(() => void) | null>(null);

  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);

  useLayoutEffect(() => {
    setCols(Math.max(1, Math.round(window.innerWidth / TARGET_TILE_SIZE_PX)));
    setRows(Math.max(1, Math.round(window.innerHeight / TARGET_TILE_SIZE_PX)));
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const centerEl = centerRef.current;
    if (!container || !centerEl) return;

    const tweens: gsap.core.Tween[] = [];
    let cancelled = false;

    const lockScroll = () => {
      document.documentElement.style.overflow = "hidden";
    };

    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
    };

    const runExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      unlockScroll();

      window.dispatchEvent(new Event("preloader-complete"));

      const tiles = Array.from(
        container.querySelectorAll<HTMLDivElement>(".preloader-tile"),
      );
      const shuffled = [...tiles].sort(() => Math.random() - 0.5);
      const tileStagger =
        tiles.length > 1 ? TOTAL_STAGGER_SPAN / (tiles.length - 1) : 0;

      shuffled.forEach((tile, i) => {
        tweens.push(
          gsap.to(tile, {
            opacity: 0,
            duration: TILE_DURATION,
            ease: "power2.in",
            delay: BASE_DELAY + i * tileStagger,
          }),
        );
      });

      const totalMs =
        (BASE_DELAY + TOTAL_STAGGER_SPAN + TILE_DURATION + 0.1) * 1000;
      setTimeout(() => {
        container.style.visibility = "hidden";
        container.style.pointerEvents = "none";
      }, totalMs);
    };

    startExitRef.current = runExit;

    const markIntroDone = () => {
      if (cancelled) return;
      introDoneRef.current = true;
      if (sceneReadyRef.current) runExit();
    };

    const armIntroWatcher = () => {
      const introAnimation = centerEl.getAnimations()[0];
      if (introAnimation) {
        introAnimation.finished.then(markIntroDone).catch(() => {});
      } else {
        markIntroDone();
      }
    };

    const replay = () => {
      gsap.killTweensOf(container.querySelectorAll(".preloader-tile"));
      tweens.forEach((t) => t.kill());
      tweens.length = 0;

      container.style.visibility = "visible";
      container.style.pointerEvents = "all";
      container
        .querySelectorAll<HTMLDivElement>(".preloader-tile")
        .forEach((tile) => {
          tile.style.opacity = "1";
        });

      introDoneRef.current = false;
      exitStartedRef.current = false;
      lockScroll();

      centerEl.style.animation = "none";
      void centerEl.offsetHeight;
      centerEl.style.animation = "";
      armIntroWatcher();
    };
    replayRef.current = replay;

    lockScroll();
    armIntroWatcher();

    // Safety net: scroll must never stay locked indefinitely, even if the
    // intro-animation/scene-ready handshake above never resolves.
    const hardUnlock = setTimeout(unlockScroll, 8000);

    return () => {
      cancelled = true;
      clearTimeout(hardUnlock);
      unlockScroll();
      tweens.forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      sceneReadyRef.current = true;
      if (introDoneRef.current && startExitRef.current) {
        startExitRef.current();
      }
    };
    window.addEventListener("scene-ready", handler);
    return () => window.removeEventListener("scene-ready", handler);
  }, []);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    const handlePrerenderActivate = () => {
      replayRef.current?.();
    };
    if (
      "prerendering" in document &&
      (document as Document & { prerendering: boolean }).prerendering
    ) {
      document.addEventListener("prerenderingchange", handlePrerenderActivate, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("prerenderingchange", handlePrerenderActivate);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        zIndex: 99999,
        pointerEvents: "all",
      }}
    >
      <div
        ref={centerRef}
        className="preloader-intro"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          opacity: 0,
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "9999px",
            backgroundColor: "var(--color-surface-action)",
          }}
        />
        <span
          style={{
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          Cole Morgan
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          zIndex: 2,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            className="preloader-tile"
            style={{ backgroundColor: "var(--color-surface-page)" }}
          />
        ))}
      </div>
    </div>
  );
}
