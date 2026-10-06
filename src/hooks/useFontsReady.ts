import { useEffect, useState } from "react";

/**
 * True once webfonts have settled and the browser has laid out one frame with
 * them. Anything that traces the box of some text — a border, a frame — has to
 * wait for this, because faces load with `font-display: swap` and the first
 * layout uses fallback metrics that reflow when the real face arrives.
 */
export function useFontsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const reveal = () => {
      raf = requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(reveal);
    } else {
      reveal();
    }

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ready;
}
