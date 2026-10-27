/**
 * URL publique du site (origine, sans slash final).
 * Définir `NEXT_PUBLIC_SITE_URL` au déploiement — aucun domaine fictif en fallback.
 */
export function getSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

export function isSiteUrlConfigured(): boolean {
  return getSiteUrl() !== null;
}

export function absoluteUrl(path: string): string | null {
  const base = getSiteUrl();
  if (!base) return null;
  if (path === "/" || path === "") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Chemin public (`/assets/...`) → URL absolue si l’origine est configurée. */
export function absolutePublicAssetUrl(assetPath: string): string | null {
  const base = getSiteUrl();
  if (!base) return null;
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${base}${normalized}`;
}
