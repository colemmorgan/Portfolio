import type { RefObject } from "react";

interface Props {
  textRef: RefObject<HTMLDivElement | null>;
  d0Ref: RefObject<HTMLSpanElement | null>;
  d1Ref: RefObject<HTMLSpanElement | null>;
  d2Ref: RefObject<HTMLSpanElement | null>;
}

export default function PreloaderContent({ textRef, d0Ref, d1Ref, d2Ref }: Props) {
  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-3 flex justify-between flex-col px-9 py-7 pointer-events-none gap-8 sm:gap-12 lg:gap-4"
    >
      <span className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium text-white leading-none tracking-[-0.01em]">
        Cole Morgan
      </span>

      <div className="flex flex-col items-start gap-4">
        <div className="flex text-[clamp(4rem,9vw,8rem)] leading-none tracking-[-0.03em]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
          <span ref={d0Ref} className="text-white/50">0</span>
          <span ref={d1Ref} className="text-white/50">0</span>
          <span ref={d2Ref} className="text-white/50">0</span>
        </div>

        <div className="flex w-full max-w-80 flex-col">
          <div className="grid grid-cols-2 gap-8 border-t border-white/20 py-2 font-medium">
            <p className="text-white/50">Title</p>
            <p className="text-white">Cole's Portfolio</p>
          </div>
          <div className="grid grid-cols-2 gap-8 border-y border-white/20 py-2 font-medium">
            <p className="text-white/50">Version</p>
            <p className="text-white">4.0.0</p>
          </div>

          <img
            src="/barcode.svg"
            alt=""
            className="w-full max-w-80 opacity-80 pointer-events-none py-[1em]"
          />
        </div>
      </div>
    </div>
  );
}
