import { useRef, useEffect, useState } from "react";
import SplitFadeUp from "./SplitFadeUp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export interface Competency {
  id: string;
  title: string;
  description: string;
  tech: string;
}

const competencies: Competency[] = [
    {
    id: "3.001",
    title: "Frontend",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "TypeScript, React, Next.js, Angular, CSS, Tailwind",
  },
    {
    id: "3.002",
    title: "Backend",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "Python, FastAPI, Rust, SQL, AWS, Terraform, MongoDB, Redis",
  },
  {
    id: "3.003",
    title: "Design",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "Figma, Illustrator, Blender",
  },

];

interface CompetenciesProps {
  canAnimate?: boolean;
}

export default function Competencies({
  canAnimate = false,
}: CompetenciesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!canAnimate || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll(
      "[data-competency-item]",
    );
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
    }, containerRef);

    return () => ctx.revert();
  }, [canAnimate]);

  return (
    <div id="competencies" className="grid scroll-mt-14 px-6 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="border-border-default grid grid-cols-1 gap-4 border-b border-dashed pb-6 md:pb-12 md:grid-cols-12">
        <p className="text-text-muted md:col-span-3 tracking-normal">
          Competencies
        </p>
        <SplitFadeUp
          as="h3"
          className="max-w-full text-3xl font-medium md:col-span-6 md:max-w-152.5 md:text-4xl"
          trigger="inView"
          initialDelay={0.1}
        >
          Engineer with a background in fullstack dev capable of delivering
          projects from idea to finished product.
        </SplitFadeUp>
        <div className="hidden justify-end lg:col-span-3 lg:flex">
          <img src="/03.svg" alt="" className="h-20 lg:h-[100px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 pt-6 md:pt-12 md:grid-cols-12">
        <p className="text-text-body hidden max-w-96 text-lg leading-[1.375em] font-medium md:col-span-6 md:block">
          A breakdown of the languages, frameworks, and tools I reach for
          across the stack, from interface to infrastructure.
        </p>
        <div ref={containerRef} className="md:col-span-6">
          {competencies.map((item) => {
            const isOpen = openId === item.id;
            const tags = item.tech.split(",").map((t) => t.trim());

            return (
              <div
                key={item.id}
                data-competency-item
                className={canAnimate ? "opacity-0" : ""}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="border-border-default flex w-full items-center justify-between border-b py-4 text-left transition-[background-color,padding] duration-200 hover:bg-black/2 hover:px-2 md:py-5"
                >
                  <span className="text-2xl font-medium tracking-[-0.01em] md:text-3xl">
                    {item.title}
                  </span>
                  <span
                    className={`text-text-muted text-3xl font-light transition-transform duration-200 md:text-4xl ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="max-w-137.5 py-5 md:py-6">
                        <p className="text-text-body text-lg leading-[1.375em] font-medium md:text-xl">
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="border-border-default text-text-muted rounded-full border px-3 py-1 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
