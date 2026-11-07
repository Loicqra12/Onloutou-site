import type { Metadata } from "next";
import { absolutePublicAssetUrl } from "@/lib/seo/site-url";

type OgImageInput = NonNullable<Metadata["openGraph"]>["images"];

/**
 * Visuel de partage par défaut 1200×630 (façade + véhicules, logo, accroche).
 * Utilisé uniquement par les pages sans image Open Graph propre.
 */
export const APPROVED_SOCIAL_OG_IMAGE_PATH: string | null =
  "/assets/images/social/onloutou-og-1200x630.jpg";

/** Logo officiel (~1918×820) — ne pas utiliser comme bannière Open Graph / Twitter large. */
export const LOGO_ASSET_PATH = "/assets/images/logo/embleme-ovale-onloutou.png";

export function buildTwitterMetadata(title: string, description: string): Metadata["twitter"] {
  const imageUrl = APPROVED_SOCIAL_OG_IMAGE_PATH
    ? absolutePublicAssetUrl(APPROVED_SOCIAL_OG_IMAGE_PATH)
    : null;

  // Grande carte uniquement si l’URL absolue de l’image est disponible.
  if (imageUrl) {
    return { card: "summary_large_image", title, description, images: [imageUrl] };
  }
  return { card: "summary", title, description };
}

/** Images OG uniquement si l’origine est configurée (chemins rendus absolus). */
export function resolveOpenGraphImages(
  explicit?: OgImageInput,
): OgImageInput | undefined {
  if (!explicit) {
    if (!APPROVED_SOCIAL_OG_IMAGE_PATH) return undefined;
    const approved = absolutePublicAssetUrl(APPROVED_SOCIAL_OG_IMAGE_PATH);
    return approved ? [
          {
            url: approved,
            width: 1200,
            height: 630,
            alt: "Local ONLOUTOU à Abidjan : location d’équipements et suivi GPS",
          },
        ] : undefined;
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
