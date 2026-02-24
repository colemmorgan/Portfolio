import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";

export type { Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

interface WorkProps {
  canAnimate?: boolean;
}

export default function Work({ canAnimate = false }: WorkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canAnimate || !containerRef.current) return;

    const projectElements = containerRef.current.querySelectorAll(
      "[data-project-item]",
    );
    const ctx = gsap.context(() => {
      projectElements.forEach((element) => {
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
    <section className="border-border-default border-b">
      <div className="mx-auto px-8 pt-18 pb-12">
        <h2 className="mb-3 text-4xl font-medium">02 Work</h2>
        <div ref={containerRef}>
          {projects.map((project) => (
            <div
              key={project.slug}
              id={project.slug}
              data-project-item
              className={`border-border-default grid grid-cols-12 gap-8 border-b border-dashed py-6 last:border-b-0 scroll-mt-14 ${canAnimate ? "opacity-0" : ""}`}
            >
              <figure
                className="border-border-default col-span-6 aspect-3/2 overflow-hidden border"
                style={{ viewTransitionName: `project-${project.slug}` }}
              >
                <img
                  src={project.image}
                  alt=""
                  className="block h-full w-full object-cover"
                />
              </figure>
              <div className="col-span-6 flex flex-col justify-between">
                <div className="">
                  <Link
                    to="/work/$projectSlug"
                    params={{ projectSlug: project.slug }}
                    className="group relative inline-block w-fit"
                  >
                    <p className="relative z-10 flex cursor-pointer items-center gap-1.5 text-xl font-medium">
                      {project.title} <span className="pr-1.5">↗</span>
                    </p>
                    <div className="absolute top-0 right-0 bottom-0 -left-1.5 flex flex-col justify-between border border-transparent transition-all duration-200 group-hover:border-black/7 group-hover:bg-black/3">
                      <div className="flex justify-between">
                        <div className="">
                          <span className="bg-text-heading block h-px w-0 -translate-px transition-all duration-200 group-hover:w-2"></span>
                          <span className="bg-text-heading block h-0 w-px -translate-px transition-all duration-200 group-hover:h-[7px]"></span>
                        </div>
                        <div className="flex">
                          <span className="bg-text-heading block h-px w-0 translate-x-px -translate-y-px transition-all duration-200 group-hover:w-2"></span>
                          <span className="bg-text-heading block h-0 w-px translate-x-px -translate-y-px transition-all duration-200 group-hover:h-[7px]"></span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="">
                          <span className="bg-text-heading block h-0 w-px -translate-x-px translate-y-px transition-all duration-200 group-hover:h-[7px]"></span>
                          <span className="bg-text-heading block h-px w-0 -translate-x-px translate-y-px transition-all duration-200 group-hover:w-2"></span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-text-heading block h-0 w-px translate-px transition-all duration-200 group-hover:h-[7px]"></span>
                          <span className="bg-text-heading block h-px w-0 translate-px transition-all duration-200 group-hover:w-2"></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/work/$projectSlug"
                    params={{ projectSlug: project.slug }}
                    className="text-text-muted mt-1 inline-block text-sm underline hover:text-text-heading transition-colors"
                  >
                    View Case Study
                  </Link>
                </div>
                <div>
                  <div className="grid grid-cols-6 gap-8">
                    <p className="text-text-body col-span-4 font-medium">
                      {project.description}
                    </p>
                  </div>
                  <div className="border-border-default mt-4 grid grid-cols-6 gap-8 border-t py-2 font-medium">
                    <p className="text-text-muted col-span-3">Tech Stack</p>
                    <p className="text-text-body col-span-3">
                      {project.techStack}
                    </p>
                  </div>
                  <div className="border-border-default grid grid-cols-6 gap-8 border-y py-2 font-medium">
                    <p className="text-text-muted col-span-3">Users</p>
                    <p className="text-text-body col-span-3">{project.users}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
