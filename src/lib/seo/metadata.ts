import type { Metadata } from "next";
import { site } from "@/content/site";
import { buildTwitterMetadata, resolveOpenGraphImages } from "@/lib/seo/social-metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

export type PageMetaInput = {
  title: string;
  description: string;
  /** Chemin applicatif (`/contact`, `/solutions/vente`, `/`). */
  path?: string;
  robots?: Metadata["robots"];
  openGraphImages?: NonNullable<Metadata["openGraph"]>["images"];
};

/** Métadonnées de page (titre court ; le layout applique `%s | ONLOUTOU`). */
export function createPageMetadata({
  title,
  description,
  path,
  robots,
  openGraphImages,
}: PageMetaInput): Metadata {
  const openGraphTitle = `${title} | ${site.name}`;
  const pageUrl = path ? absoluteUrl(path) : null;
  const ogImages = resolveOpenGraphImages(openGraphImages);

  const metadata: Metadata = {
    title,
    description,
    ...(robots ? { robots } : {}),
    openGraph: {
      title: openGraphTitle,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      ...(ogImages ? { images: ogImages } : {}),
      ...(pageUrl ? { url: pageUrl } : {}),
    },
    twitter: buildTwitterMetadata(openGraphTitle, description),
  };

  if (pageUrl) {
    metadata.alternates = { canonical: pageUrl };
  }

  return metadata;
}

export { ROBOTS_PREVIEW_PORTAL } from "@/lib/seo/routes";
