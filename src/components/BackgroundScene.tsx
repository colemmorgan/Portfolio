import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SceneCanvas } from "./hero-scene/scene/SceneCanvas";

export default function FixedWebGLBackground() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setIsFlipped(false);
      return;
    }

    const updateFlipState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setIsFlipped(false);
        return;
      }

      const progress = window.scrollY / maxScroll;
      const footerElement = document.querySelector<HTMLElement>(
        '[data-home-footer="true"]',
      );
      const footerNearViewport = footerElement
        ? footerElement.getBoundingClientRect().top <= window.innerHeight * 0.9
        : false;

      // Flip through mid-page and keep it flipped when footer is reached.
      setIsFlipped((progress >= 0.42 && progress <= 0.72) || footerNearViewport);
    };

    updateFlipState();
    window.addEventListener("scroll", updateFlipState, { passive: true });
    window.addEventListener("resize", updateFlipState);

    return () => {
      window.removeEventListener("scroll", updateFlipState);
      window.removeEventListener("resize", updateFlipState);
    };
  }, [pathname]);

  if (pathname !== "/") {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        transform: isFlipped ? "scaleX(-1)" : "scaleX(1)",
        transformOrigin: "center center",
      }}
      aria-hidden="true"
    >
      <SceneCanvas />
    </div>
  );
}
