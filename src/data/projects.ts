export interface Project {
  slug: string;
  image: string;
  title: string;
  liveUrl?: string;
  description: string;
  techStack: string;
  users: string;
}

export const projects: Project[] = [
  {
    slug: "fragments",
    image: "/project-mockups/frag3.png",
    title: "Fragments",
    liveUrl: "#",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
  {
    slug: "satlantis-llc",
    image: "/project-mockups/satlantis.png",
    title: "Satlantis LLC",
    liveUrl: "#",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
  {
    slug: "society-of-pc-building",
    image: "/project-mockups/spcb.png",
    title: "Society of PC Building",
    liveUrl: "#",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
  {
    slug: "coaching-personal-website",
    image: "/project-mockups/fionn.png",
    title: "Coaching Personal Website",
    liveUrl: "#",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
