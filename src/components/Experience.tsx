import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { experiences } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  canAnimate?: boolean;
}

export default function Experience({ canAnimate = false }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleRow = (i: number) => {
    setOpenIndex((current) => (current === i ? null : i));
  };

  useEffect(() => {
    if (!canAnimate || !containerRef.current) return;

    const rows = containerRef.current.querySelectorAll<HTMLDivElement>("[data-exp-row]");

    const ctx = gsap.context(() => {
      const mobileRows = containerRef.current!.querySelectorAll<HTMLElement>("[data-exp-mobile-row]");
      mobileRows.forEach((mobileRow) => {
        gsap.fromTo(
          mobileRow,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileRow,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll<HTMLElement>("[data-exp-cell]"));
        cells.forEach((cell, j) => {
          gsap.fromTo(
            cell,
            { y: "110%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 0.65,
              ease: "power3.out",
              delay: 0.1 + j * 0.25,
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
              duration: 0.65,
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
    <section id="experience" className="border-border-default border-b border-dashed scroll-mt-14">
      <div className="mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20">
        <h2 className="text-text-heading mb-1 sm:mb-3 text-3xl sm:text-4xl font-medium">
          03 Experience
        </h2>

        <div ref={containerRef} className=" mt-6 sm:mt-8">
          {/* Header row */}
          <div className="border-border-default hidden grid-cols-12 gap-8 border-b py-3 sm:grid">
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
          {experiences.map((exp, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <div data-exp-row>
                  {/* Desktop row */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggleRow(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRow(i);
                      }
                    }}
                    className="hidden grid-cols-12 gap-8 py-3 transition-[background-color,padding] duration-200 hover:bg-black/2 hover:px-3 cursor-pointer sm:grid"
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

                  {/* Mobile row */}
                  <div
                    data-exp-mobile-row
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggleRow(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRow(i);
                      }
                    }}
                    className={`cursor-pointer py-3 sm:hidden${canAnimate ? " opacity-0" : ""}`}
                  >
                    <p className="flex items-center justify-between gap-3">
                      <span className="text-text-heading text-lg font-medium">{exp.role}</span>
                      <HugeiconsIcon
                        icon={ChevronDown}
                        size={16}
                        className={`text-text-muted shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </p>
                    <p className="text-text-body mt-2 flex items-center justify-between gap-3 text-sm">
                      <span>{exp.company}</span>
                      <span className="text-text-muted text-sm">{exp.year}</span>
                    </p>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-border-default max-w-250 border-t pt-4 pb-4 sm:border-t-0 sm:pt-0">
                        <p className="text-text-body text-xl sm:text-2xl lg:text-3xl font-medium mt-2">{exp.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border-border-default text-text-muted rounded-full border px-3 py-1 text-sm tracking-normal"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  data-exp-divider
                  className={`bg-border-default h-px ${canAnimate ? "w-0" : "w-full"}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
