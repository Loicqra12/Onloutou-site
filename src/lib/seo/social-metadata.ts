import type { Metadata } from "next";
import { absolutePublicAssetUrl } from "@/lib/seo/site-url";

type OgImageInput = NonNullable<Metadata["openGraph"]>["images"];

/**
 * Visuel social 1200×630 validé — non disponible dans le dépôt.
 * Lorsqu’il existera, définir le chemin public ici et activer `summary_large_image`.
 */
export const APPROVED_SOCIAL_OG_IMAGE_PATH: string | null = null;

/** Logo officiel (~1918×820) — ne pas utiliser comme bannière Open Graph / Twitter large. */
export const LOGO_ASSET_PATH = "/assets/images/logo/embleme-ovale-onloutou.png";

export function buildTwitterMetadata(title: string, description: string): Metadata["twitter"] {
  const card = APPROVED_SOCIAL_OG_IMAGE_PATH ? "summary_large_image" : "summary";
  const base = { card, title, description };

  if (APPROVED_SOCIAL_OG_IMAGE_PATH) {
    const imageUrl = absolutePublicAssetUrl(APPROVED_SOCIAL_OG_IMAGE_PATH);
    if (imageUrl) {
      return { ...base, images: [imageUrl] };
    }
  }

  return base;
}

/** Images OG uniquement si l’origine est configurée (chemins rendus absolus). */
export function resolveOpenGraphImages(
  explicit?: OgImageInput,
): OgImageInput | undefined {
  if (!explicit) {
    if (!APPROVED_SOCIAL_OG_IMAGE_PATH) return undefined;
    const approved = absolutePublicAssetUrl(APPROVED_SOCIAL_OG_IMAGE_PATH);
    return approved ? [{ url: approved, alt: "ONLOUTOU" }] : undefined;
  }

  const flat = [explicit].flat();
  const resolved = flat
    .map((img) => {
      if (typeof img === "string") {
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        const abs = absolutePublicAssetUrl(img);
        return abs ?? null;
      }
      if (img instanceof URL) {
        if (img.protocol === "http:" || img.protocol === "https:") return img.toString();
        return null;
      }
      const url = String(img.url);
      if (url.startsWith("http://") || url.startsWith("https://")) return img;
      const abs = absolutePublicAssetUrl(url);
      if (!abs) return null;
      return { ...img, url: abs };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return resolved.length > 0 ? resolved : undefined;
}
