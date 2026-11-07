import { cookiesPolicyIsIndexable } from "@/content/cookies";
import {
  legalNoticeIsIndexable,
  termsOfUseIsIndexable,
} from "@/content/legal";
import { privacyPolicyIsIndexable } from "@/content/privacy";
import { discoverAppRoutes } from "@/lib/app-routes";

/** Prévisualisations conceptuelles — public mais hors index. */
export const PORTAL_PREVIEW_PATHS = new Set(["/espace-partenaire", "/espace-livreur"]);

/** Administration et espaces connectés — hors index. */
export const BACKOFFICE_PATH_PREFIXES = [
  "/admin",
  "/espace-partenaire/connexion",
  "/espace-partenaire/inscription",
  "/espace-partenaire/catalogue",
  "/espace-livreur/connexion",
  "/espace-livreur/inscription",
  "/espace-livreur/dossier",
];

export const ROBOTS_PREVIEW_PORTAL = { index: false, follow: true } satisfies {
  index: boolean;
  follow: boolean;
};

export type RouteIndexation = {
  path: string;
  index: boolean;
  follow: boolean;
  includeInSitemap: boolean;
  category: "public-indexable" | "public-noindex" | "technical";
};

function robotsForPath(path: string): { index: boolean; follow: boolean } {
  switch (path) {
    case "/mentions-legales":
      return legalNoticeIsIndexable()
        ? { index: true, follow: true }
        : { index: false, follow: true };
    case "/confidentialite":
      return privacyPolicyIsIndexable()
        ? { index: true, follow: true }
        : { index: false, follow: true };
    case "/cookies":
      return cookiesPolicyIsIndexable()
        ? { index: true, follow: true }
        : { index: false, follow: true };
    case "/conditions-utilisation":
      return termsOfUseIsIndexable()
        ? { index: true, follow: true }
        : { index: false, follow: true };
    case "/conditions-commerciales":
      return { index: false, follow: true };
    default:
      if (PORTAL_PREVIEW_PATHS.has(path)) {
        return ROBOTS_PREVIEW_PORTAL;
      }
      if (BACKOFFICE_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
        return { index: false, follow: false };
      }
      return { index: true, follow: true };
  }
}

export function getRouteIndexation(path: string): RouteIndexation {
  const robots = robotsForPath(path);
  const includeInSitemap = robots.index && !PORTAL_PREVIEW_PATHS.has(path);
  const category = robots.index ? "public-indexable" : "public-noindex";

  return {
    path,
    index: robots.index,
    follow: robots.follow,
    includeInSitemap,
    category,
  };
}

export function getAllRouteIndexations(): RouteIndexation[] {
  return discoverAppRoutes().map((path) => getRouteIndexation(path));
}

export function getSitemapPaths(): string[] {
  return getAllRouteIndexations()
    .filter((r) => r.includeInSitemap)
    .map((r) => r.path);
}
