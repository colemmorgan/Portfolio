import { motion } from "motion/react";
import SplitFadeUp from "./SplitFadeUp";
import { usePageReady } from "@/hooks/usePageReady";

export default function Hero() {
  const pageReady = usePageReady();

  return (
    <section className="border-border-default relative mt-14 h-130 overflow-hidden border-b sm:h-140 lg:h-155">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/65"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex h-full flex-col justify-between px-6 pt-5 pb-6 font-medium sm:px-8 sm:pt-6 sm:pb-9">
        <div className="flex justify-end">
          <img src="/01.svg" alt="" className="h-16 opacity-15 sm:h-20 lg:h-25" />
        </div>
        <div className="relative z-20 flex flex-col-reverse gap-5 text-white lg:flex-row lg:items-end lg:justify-between">
          <SplitFadeUp
            as="h1"
            className="max-w-full text-balance text-[34px] leading-[1.1em] tracking-[-0.01em] sm:max-w-[1030px] sm:text-[44px] sm:leading-[1.05em] lg:text-[56px] xl:text-[60px]"
            trigger="inView"
          >
            Software Engineer building geospatial tools and ML platforms at
            Satlantis. Graduating from UFlorida spring 2027.
          </SplitFadeUp>
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: pageReady ? "0%" : "110%" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
              className="flex gap-3"
            >
              <a
                href="https://www.linkedin.com/in/cole-morgan-/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group hover:bg-surface-action-hover-subtle border-border-default flex size-9 items-center justify-center rounded-full border bg-white shadow-md transition-colors duration-200"
              >
                <img
                  src="/icons/linkedin.png"
                  alt=""
                  className="size-5 transition-all ease-out group-hover:scale-105"
                />
              </a>
              <a
                href="https://github.com/colemmorgan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:bg-surface-action-hover-subtle group border-border-default flex size-9 items-center justify-center rounded-full border bg-white shadow-md transition-colors duration-200"
              >
                <img
                  src="/icons/github.png"
                  alt=""
                  className="size-5 transition-all ease-out group-hover:scale-105"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
