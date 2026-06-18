import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  canAnimate?: boolean;
}

export default function Experience({ canAnimate = false }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canAnimate || !containerRef.current) return;

    const rows = containerRef.current.querySelectorAll<HTMLDivElement>("[data-exp-row]");

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll<HTMLElement>("[data-exp-cell]"));
        cells.forEach((cell, j) => {
          gsap.fromTo(
            cell,
            { y: "110%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.05 + j * 0.2,
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        const divider = row.nextElementSibling as HTMLElement | null;
        if (divider?.hasAttribute("data-exp-divider")) {
          gsap.fromTo(
            divider,
            { width: 0 },
            {
              width: "100%",
              duration: 0.55,
              ease: "power3.out",
              delay: cells.length * 0.05,
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [canAnimate]);

  return (
    <section className="border-border-default border-b">
      <div className="mx-auto px-8 py-18">
        <h2 className="text-text-heading mb-3 text-4xl font-medium">
          03 Experience
        </h2>

        <div ref={containerRef} className="mt-8">
          {/* Header row */}
          <div className="border-border-default grid grid-cols-12 gap-8 border-b py-3">
            <p className="text-text-muted col-span-5 text-xs font-medium tracking-widest uppercase">
              Role
            </p>
            <p className="text-text-muted col-span-5 text-xs font-medium tracking-widest uppercase">
              Company
            </p>
            <p className="text-text-muted col-span-2 text-right text-xs font-medium tracking-widest uppercase">
              Year
            </p>
          </div>

          {/* Entry rows */}
          {experiences.map((exp, i) => (
            <div key={i}>
              <div
                data-exp-row
                className="grid grid-cols-12 gap-8 py-3"
              >
                <div className="col-span-5 overflow-hidden">
                  <p data-exp-cell className={`text-text-heading text-lg font-medium${canAnimate ? " opacity-0" : ""}`}>
                    {exp.role}
                  </p>
                </div>
                <div className="col-span-5 overflow-hidden">
                  <p data-exp-cell className={`text-text-body text-lg${canAnimate ? " opacity-0" : ""}`}>
                    {exp.company}
                  </p>
                </div>
                <div className="col-span-2 overflow-hidden">
                  <p data-exp-cell className={`text-text-muted text-right text-lg${canAnimate ? " opacity-0" : ""}`}>
                    {exp.year}
                  </p>
                </div>
              </div>
              <div
                data-exp-divider
                className={`bg-border-default h-px ${canAnimate ? "w-0" : "w-full"}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
