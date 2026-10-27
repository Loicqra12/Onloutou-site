/** Variantes WebP pré-générées (`npm run optimize:lcp-images`) — PNG sources inchangés. */

const LCP_WEBP_BY_SOURCE: Record<string, { mobile: string; desktop: string }> = {
  "/assets/images/solutions/installation-traceur-gps-onloutou.png": {
    mobile: "/assets/images/lcp/installation-traceur-gps-onloutou.w828.webp",
    desktop: "/assets/images/lcp/installation-traceur-gps-onloutou.w1080.webp",
  },
  "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png": {
    mobile: "/assets/images/lcp/mobilite-professionnelle-cour-logistique.w828.webp",
    desktop: "/assets/images/lcp/mobilite-professionnelle-cour-logistique.w1080.webp",
  },
  "/assets/images/equipment/vehicles/Flotte professionnelle inspectée à Abidjan-2.png": {
    mobile: "/assets/images/lcp/Flotte-professionnelle-inspect-e-Abidjan-2.w828.webp",
    desktop: "/assets/images/lcp/Flotte-professionnelle-inspect-e-Abidjan-2.w1080.webp",
  },
};

export function getLcpWebpSources(pngSrc: string) {
  return LCP_WEBP_BY_SOURCE[pngSrc] ?? null;
}
