import type { ReactNode } from "react";

interface NotchBoxProps {
  children: ReactNode;
  /** Padding, width, pointer-events — anything layout related. */
  className?: string;
  /**
   * Frame visibility. The 1px border is always in the box model, so flipping
   * this only changes colour, fill and blur — it can never shift the height of
   * whatever the frame is wrapping.
   */
  active?: boolean;
}

/**
 * The bordered container with corner notches, matching the project-title hover
 * state but held permanently open.
 */
export default function NotchBox({
  children,
  className = "",
  active = true,
}: NotchBoxProps) {
  return (
    <div
      className={`relative border transition-colors duration-300 ${
        active
          ? "border-white/10 bg-[rgba(0,0,0,0.14)] backdrop-blur-[20px]"
          : "border-transparent"
      } ${className}`}
    >
      {children}

      <div
        className={`pointer-events-none absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="flex justify-between">
          <div>
            <span className="bg-text-dark-heading block h-px w-2 -translate-px"></span>
            <span className="bg-text-dark-heading block h-[7px] w-px -translate-px"></span>
          </div>
          <div className="flex">
            <span className="bg-text-dark-heading block h-px w-2 translate-x-px -translate-y-px"></span>
            <span className="bg-text-dark-heading block h-[7px] w-px translate-x-px -translate-y-px"></span>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="bg-text-dark-heading block h-[7px] w-px -translate-x-px translate-y-px"></span>
            <span className="bg-text-dark-heading block h-px w-2 -translate-x-px translate-y-px"></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-text-dark-heading block h-[7px] w-px translate-px"></span>
            <span className="bg-text-dark-heading block h-px w-2 translate-px"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
