import { LOGO_ASSET_PATH } from "@/lib/seo/social-metadata";
import { siteMedia } from "@/content/media";

/**
 * Dimensions réelles du logo (`embleme-ovale-onloutou.png`) — ratio large, pas 1200×630.
 * Ne pas utiliser comme visuel social tant qu’un fichier dédié n’est pas validé.
 */
export const logoAssetDimensions = {
  path: LOGO_ASSET_PATH,
  width: siteMedia.logo.width,
  height: siteMedia.logo.height,
  alt: siteMedia.logo.alt,
};
