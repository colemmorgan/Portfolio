export interface Experience {
  role: string;
  company: string;
  year: string;
  description: string;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    role: "Junior Software Engineer",
    company: "Satlantis US",
    year: "Present",
    description:
      "Since December 2025, I've been building a STAC-compliant geospatial imagery platform for dataset management, image search, and AI-assisted annotation using React and FastAPI, cutting annotation time by 60%. I've also automated infrastructure provisioning with Terraform on AWS, set up GitLab CI/CD pipelines for streamlined deployments, and interviewed engineers across the U.S. and Europe to help design a cross-team satellite imagery platform in Figma.",
    tags: ["React", "FastAPI", "Terraform", "AWS", "GitLab CI/CD", "Figma"],
  },
  {
    role: "Software Engineer Intern",
    company: "Satlantis US",
    year: "2025",
    description:
      "Led end-to-end development of a full-stack satellite imagery quality analysis platform using React, PostgreSQL, and FastAPI, integrating Auto-QC AI models that cut image QA time by 90%. I also built a high-performance, web-based spectral imagery viewer and editor with React and WebGL on top of Cloud Optimized GeoTIFFs served via range requests from AWS S3, bringing page load times down by 10x.",
    tags: ["React", "PostgreSQL", "FastAPI", "AWS"],
  },
  {
    role: "Computer Science Tutor",
    company: "University of Florida",
    year: "2025",
    description:
      "As a tutor for the CISE department at the University of Florida, I provided one-on-one and group support in discrete mathematics, data structures, programming fundamentals, and software engineering. I taught practical skills such as unit testing and debugging while collaborating with faculty and refining instructional materials based on student feedback.",
    tags: ["Discrete Mathematics", "Data Structures & Algorithms", "C++", "Python"],
  },
  {
    role: "Software Engineer Intern",
    company: "CapTech Partnership Program",
    year: "2024",
    description:
      "Developed a Next.js, React, and TypeScript website for the Society of PC Building, serving 1,000+ club members with Firebase integration and a custom admin panel for real-time content management. As part of CapTech's Agile Scrum development program, I worked under senior engineer mentorship, presented deliverables to company leadership, and earned a published feature story on CapTech's official website.",
    tags: ["Next.js", "React", "TypeScript", "Firebase"],
  },
];
