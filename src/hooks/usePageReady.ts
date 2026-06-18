import { useState, useEffect } from "react";

export function usePageReady() {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.location.pathname !== "/";
  });

  useEffect(() => {
    if (ready) return;
    const handler = () => setReady(true);
    window.addEventListener("preloader-complete", handler);
    return () => window.removeEventListener("preloader-complete", handler);
  }, [ready]);

  return ready;
}
