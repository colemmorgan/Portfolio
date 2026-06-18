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
    slug: "greatdient",
    image: "/project-mockups/wizlite.png",
    title: "RE Game Asset Viewer",
    liveUrl: "https://stitch101.com",
    description:
      "Greatdient is tool to design professional and beautiful gradients through a simple and intuitive interface. Built on WebGL shaders to create natural and realistic gradients.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
  // {
  //   slug: "satlantis-llc",
  //   image: "/project-mockups/satlantis.png",
  //   title: "Satlantis LLC",
  //   liveUrl: "#",
  //   description:
  //     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
  //   techStack: "React, Figma, OpenGL, PSQL, FastAPI",
  //   users: "100,000",
  // },
  {
    slug: "society-of-pc-building",
    image: "/project-mockups/spcb.png",
    title: "Society of PC Building",
    liveUrl: "https://www.spcbatuf.org/",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
  {
    slug: "coaching-personal-website",
    image: "/project-mockups/fionn.png",
    title: "Coaching Personal Website",
    liveUrl: "https://www.fionn.pro/",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, repellat et cum necessitatibus esse saepe. Perspiciatis labore consectetur recusandae iusto cumque corporis a magnam.",
    techStack: "React, Figma, OpenGL, PSQL, FastAPI",
    users: "100,000",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
