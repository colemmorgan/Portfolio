import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

gsap.registerPlugin(ScrollTrigger);

const PHOTO_NUMBERS = [3, 1, 2, 4, 5, 6, 7, 8];
const WIDTHS = [400, 600, 800, 1000, 1200];

function srcSetFor(n: number) {
  return WIDTHS.map((w) => `/photos/${n}-${w}.webp ${w}w`).join(", ");
}

interface PhotoGalleryProps {
  canAnimate?: boolean;
}

export default function PhotoGallery({ canAnimate = false }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + PHOTO_NUMBERS.length) % PHOTO_NUMBERS.length));
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % PHOTO_NUMBERS.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  useEffect(() => {
    if (!canAnimate || !gridRef.current) return;

    const items = gridRef.current.querySelectorAll("[data-gallery-item]");
    const ctx = gsap.context(() => {
      items.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [canAnimate]);

  return (
    <section
      id="gallery"
      className="border-border-default scroll-mt-14 w-full border-t bg-white py-12 sm:py-16 lg:py-20"
    >
      <h2 className="mb-4 px-6 text-3xl font-medium sm:mb-6 sm:px-8 sm:text-4xl">
        05 Photo Gallery
      </h2>

      <div ref={gridRef} className="grid w-full grid-cols-3 gap-3 px-6 sm:grid-cols-4 sm:gap-4 sm:px-8">
        {PHOTO_NUMBERS.map((n, i) => (
          <button
            key={n}
            type="button"
            data-gallery-item
            onClick={() => setActiveIndex(i)}
            className={`aspect-3/4 w-full cursor-pointer overflow-hidden${canAnimate ? " opacity-0" : ""}`}
          >
            <img
              src={`/photos/${n}-800.webp`}
              srcSet={srcSetFor(n)}
              sizes="(min-width: 640px) 25vw, 33vw"
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/90 p-4 sm:p-8"
                onClick={close}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-4 right-4 cursor-pointer text-white/70 transition-colors hover:text-white sm:top-6 sm:right-6"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={28} />
                </button>

                <div
                  className="relative flex w-full max-w-5xl flex-1 items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Previous image"
                    className="absolute left-0 cursor-pointer text-white/70 transition-colors hover:text-white sm:-left-12"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={32} />
                  </button>

                  <img
                    src={`/photos/${PHOTO_NUMBERS[activeIndex]}-1200.webp`}
                    srcSet={srcSetFor(PHOTO_NUMBERS[activeIndex])}
                    sizes="90vw"
                    alt=""
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next image"
                    className="absolute right-0 cursor-pointer text-white/70 transition-colors hover:text-white sm:-right-12"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={32} />
                  </button>
                </div>

                <div
                  className="mt-6 flex w-full max-w-5xl justify-center gap-2 overflow-x-auto px-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {PHOTO_NUMBERS.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`aspect-3/4 h-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-colors sm:h-20 ${
                        i === activeIndex
                          ? "border-white"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={`/photos/${n}-400.webp`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
