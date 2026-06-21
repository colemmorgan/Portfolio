export interface Project {
  slug: string;
  image: string;
  title: string;
  liveUrl?: string;
  description: string;
  techStack: string;
  hosting: string;
}

export const projects: Project[] = [
  {
    slug: "greatdient",
    image: "/project-mockups/wizlite.png",
    title: "RE Game Asset Viewer",
    liveUrl: "https://stitch101.com",
    description:
      "Platform for visualizing and managing reverse-engineered Wizard101 assets, supporting 1,000+ registered users",
    techStack: "React, Rust, TypeScript, PSQL, FastAPI",
    hosting: "AWS (S3, CloudFront, EC2, RDS, Route 53)",
  },
  {
    slug: "society-of-pc-building",
    image: "/project-mockups/spcb.png",
    title: "Society of PC Building",
    liveUrl: "https://www.spcbatuf.org/",
    description:
      "Website for the Society of PC Building, serving 1,000+ club members with Firebase integration and a custom admin panel for real-time content management",
    techStack: "Next.js, TypeScript, Firebase, Figma",
    hosting: "Firebase, Vercel",
  },
  {
    slug: "coaching-personal-website",
    image: "/project-mockups/fionn.png",
    title: "Coaching Personal Website",
    liveUrl: "https://www.fionn.pro/",
    description:
      "Freelance design/development project I created for a client to tell a story about his career and create a personal brand.",
    techStack: "React, Figma, TypeScript",
    hosting: "Vercel",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
