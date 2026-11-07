import { legalEntityInformation } from "@/content/legal";
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
  const legalName = legalEntityInformation.legalName;
  const office = legalEntityInformation.registeredOffice;
  const tax = legalEntityInformation.taxNumber;
  const registry = legalEntityInformation.registryNumber;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url,
    ...(logo ? { logo } : {}),
    ...(legalName.status === "verified" && legalName.value ? { legalName: legalName.value } : {}),
    ...(office.status === "verified" && office.value
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: office.value,
            addressCountry: "CI",
          },
        }
      : {}),
    ...(tax.status === "verified" && tax.value ? { taxID: tax.value } : {}),
    ...(registry.status === "verified" && registry.value
      ? { identifier: { "@type": "PropertyValue", name: "RCCM", value: registry.value } }
      : {}),
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
