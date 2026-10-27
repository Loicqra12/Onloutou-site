import { site } from "@/content/site";
import { siteMedia } from "@/content/media";
import { absoluteUrl } from "@/lib/seo/site-url";

/** Sérialisation sûre pour `application/ld+json` (évite la fermeture de balise script). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  const url = absoluteUrl("/");
  if (!url) return null;

  const logo = absoluteUrl(siteMedia.logo.src);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url,
    ...(logo ? { logo } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneTel,
      contactType: "customer service",
      areaServed: "CI",
      availableLanguage: ["fr"],
    },
  };
}

export function websiteJsonLd() {
  const url = absoluteUrl("/");
  if (!url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url,
    inLanguage: "fr-FR",
  };
}
