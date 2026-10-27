import { projectsMedia, type ProjectMedia } from "@/content/projects-page";

export function projectImage(key: keyof typeof projectsMedia): ProjectMedia {
  return projectsMedia[key];
}
