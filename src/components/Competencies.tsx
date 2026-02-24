import { useRef, useEffect } from "react";
import SplitFadeUp from "./SplitFadeUp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    title: "Design",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "Figma, Illustrator, Blender",
  },
  {
    id: "3.002",
    title: "Frontend",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "Tech",
  },
  {
    id: "3.003",
    title: "Backend",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum cum eos sit dolore pariatur omnis quisquam vero distinctio debitis tenetur, ratione temporibus alias.",
    tech: "Tech",
  },
];

interface CompetenciesProps {
  canAnimate?: boolean;
}

export default function Competencies({
  canAnimate = false,
}: CompetenciesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
            duration: 1,
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
    <div className="border-border-default grid border-b px-8">
      <div className="border-border-default grid grid-cols-12 gap-8 border-b border-dashed py-18">
        <p className="text-text-muted col-span-3 tracking-normal">
          Competencies
        </p>
        <SplitFadeUp
          as="h3"
          className="col-span-6 max-w-[610px] text-4xl font-medium"
          trigger="inView"
        >
          Designer with a background in fullstack dev capable of delivering
          projects from idea to finished product.
        </SplitFadeUp>
        <div className="col-span-3 flex justify-end">
          <img src="/03.svg" alt="" className="h-[100px]" />
        </div>
      </div>
      <div
        ref={containerRef}
        className="divide-border-default divide-y divide-dashed"
      >
        {competencies.map((item) => (
          <div
            key={item.id}
            data-competency-item
            className={`grid grid-cols-12 gap-8 py-9 ${canAnimate ? "opacity-0" : ""}`}
          >
            <p className="text-text-muted col-span-3 tracking-normal">
              {item.id}
            </p>
            <div className="col-span-6">
              <p className="text-3xl font-medium tracking-[-0.01em]">
                {item.title}
              </p>
              <p className="text-text-body mt-9 max-w-[550px] text-lg leading-[1.375em] font-medium">
                {item.description}
              </p>
              <p className="text-text-body pt-4">Tech: {item.tech}</p>
            </div>
            <div className="bg-border-default col-span-3 h-[420px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
