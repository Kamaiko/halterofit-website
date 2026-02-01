export interface Project {
  id: string;
  translationKey: string;
  github: string;
  demo?: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "halterofit",
    translationKey: "projects.halterofit",
    github: "https://github.com/Kamaiko/Halterofit",
    featured: true,
  },
  {
    id: "portfolio",
    translationKey: "projects.portfolio",
    github: "https://github.com/Kamaiko/halterofit-website",
    demo: "https://halterofit.ca",
  },
];
