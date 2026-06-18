import SplitFadeUp from "./SplitFadeUp";

export default function Hero() {
  return (
    <section className="border-border-default relative mt-14 h-[620px] overflow-hidden border-b">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/65"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex h-full flex-col justify-between px-8 pt-6 pb-9 font-medium">
        <div className="flex justify-end">
          <img src="/01.svg" alt="" className="h-[100px] opacity-15" />
        </div>
        <div className="relative z-20 flex items-end justify-between text-white">
          <SplitFadeUp
            as="h1"
            className="max-w-[1030px] text-[60px] leading-[1.05em] tracking-[-0.01em]"
            trigger="inView"
          >
            Software Engineer building geospatial tools and ML platforms at
            Satlantis. Graduating from UFlorida spring 27’.
          </SplitFadeUp>
          <div className="flex gap-3">
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
          </div>
        </div>
      </div>
    </section>
  );
}
