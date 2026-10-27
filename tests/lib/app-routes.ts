import { discoverAppRoutes as discoverFromSrc } from "@/lib/app-routes";

/** Routes dérivées des fichiers page.tsx sous src/app (source unique pour les tests). */
export function discoverAppRoutes(): string[] {
  return discoverFromSrc();
}

export const NOT_FOUND_PROBE_PATH = "/__playwright-not-found-probe__";

export function routeToCaptureSlug(route: string): string {
  if (route === "/") return "home";
  return route.slice(1).replace(/\//g, "__");
}
