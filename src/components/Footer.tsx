import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";

export default function Footer() {
  return (
    <footer className="px-8 pt-24">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="h-9 w-48 rounded-full bg-gray-200"></div>
          <p className="text-text-muted text-sm">
            © 2026 Cole Morgan. <br />
            All rights reserved.
          </p>
        </div>
        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-body">Social Media/Contact</p>
          <a href="" className="text-text-muted w-fit py-0.5">
            LinkedIn ↗
          </a>
          <a href="" className="text-text-muted w-fit py-0.5">
            GitHub ↗
          </a>
          <a href="" className="text-text-muted w-fit py-0.5">
            Email ↗
          </a>
        </div>
        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-body">Pages</p>
          <a href="" className="text-text-muted w-fit py-0.5">
            Home
          </a>
          <a href="" className="text-text-muted w-fit py-0.5">
            Work
          </a>
          <a href="" className="text-text-muted w-fit py-0.5">
            About
          </a>
        </div>
        <div className="col-span-3 flex flex-col gap-3 font-medium">
          <p className="text-text-body">Case Studies</p>
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/work/$projectSlug"
              params={{ projectSlug: project.slug }}
              className="text-text-muted hover:text-text-heading w-fit py-0.5 transition-colors"
            >
              {project.title} ↗
            </Link>
          ))}
        </div>
      </div>

      <div className="text-text-muted mt-48 mb-8 grid grid-cols-2 items-end gap-8">
        <p>
          Designed in Figma. <br /> Built with TanStack Start.
        </p>
        <p>
          Type set in <span className="underline">PP Neue Montreal</span>
        </p>
      </div>
      <div className="flex justify-between text-[9vw] leading-none font-medium tracking-[-0.04em] opacity-15">
        <p className="">Cole Morgan</p>
        <p>04</p>
      </div>
    </footer>
  );
}
