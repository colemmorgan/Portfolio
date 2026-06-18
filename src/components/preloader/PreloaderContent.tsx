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
      className="absolute inset-0 z-3 flex flex-col justify-between px-9 py-7 pointer-events-none"
    >
      <span className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium text-white leading-none tracking-[-0.01em]">
        Cole Morgan
      </span>

      <img
        src="/loader.png"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[82vh] object-contain mix-blend-screen pointer-events-none drop-shadow-[0_0_40px_rgba(255,255,255,0.75)]"
      />

      <div className="flex items-end justify-between ">
        <img
          src="/barcode.svg"
          alt=""
          className="hidden sm:block w-96 opacity-80 pointer-events-none pb-[1em]"
        />

        <div className="flex text-[clamp(4rem,9vw,8rem)] leading-none tracking-[-0.03em]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
          <span ref={d0Ref} className="text-white/50">0</span>
          <span ref={d1Ref} className="text-white/50">0</span>
          <span ref={d2Ref} className="text-white/50">0</span>
        </div>
      </div>
    </div>
  );
}
