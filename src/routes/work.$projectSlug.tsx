/// <reference path="../routeTree.gen.ts" />
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { getProjectBySlug } from "@/data/projects";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/work/$projectSlug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.projectSlug);
    if (!project) throw new Error("Project not found");
    return { project };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { project } = Route.useLoaderData();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentEl,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.15 },
      );
    });

    return () => ctx.revert();
  }, [project.slug]);

  return (
    <article className="mt-14 min-h-screen">
      <div className="mx-auto max-w-5xl px-8 pt-12 pb-24">
        {/* Top center image - shared element: animates from work list position */}
        <div className="mx-auto mb-12 flex justify-center">
          <figure
            className="border-border-default aspect-3/2 w-full max-w-4xl overflow-hidden border"
            style={{ viewTransitionName: `project-${project.slug}` }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="block h-full w-full object-cover"
            />
          </figure>
        </div>

        <div ref={contentRef} className="mx-auto max-w-3xl">
          <Link
            to="/"
            hash={project.slug}
            className="text-text-muted hover:text-text-heading mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            ← Back to Work
          </Link>

          <h1 className="mb-2 text-4xl font-medium">{project.title}</h1>
          <p className="text-text-body mb-8 leading-relaxed font-medium">
            {project.description}
          </p>

          <div className="border-border-default grid gap-4 border-t py-6">
            <div className="flex justify-between font-medium">
              <span className="text-text-muted">Tech Stack</span>
              <span className="text-text-body">{project.techStack}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-text-muted">Users</span>
              <span className="text-text-body">{project.users}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
