import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CookiesPolicyContent } from "@/components/legal/CookiesPolicyContent";
import { LegalDocument } from "@/components/legal/LegalDocument";
import {
  cookiesAuditStatusLabel,
  cookiesPolicyBreadcrumb,
  cookiesPolicyBreadcrumbJsonLd,
  cookiesPolicyIsIndexable,
  cookiesPolicySeo,
  cookiesLastUpdatedAt,
  cookiesTocSections,
  trackingStatus,
} from "@/content/cookies";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...cookiesPolicySeo,
  path: "/cookies",
  robots: cookiesPolicyIsIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: true },
});

export default function CookiesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="cookies-policy-breadcrumb-jsonld" build={cookiesPolicyBreadcrumbJsonLd} />
      <LegalDocument
        breadcrumb={cookiesPolicyBreadcrumb}
        title="Politique relative aux cookies"
        intro="Cette page explique les technologies susceptibles d’enregistrer ou de lire des informations dans votre navigateur lors de l’utilisation du site ONLOUTOU."
        updatedAt={cookiesLastUpdatedAt}
        sections={cookiesTocSections}
        tocLabel="Sommaire de la politique cookies"
        statusLine={cookiesAuditStatusLabel[trackingStatus]}
        statusClassName="leg-cookies-hero-status"
      >
        <CookiesPolicyContent />
      </LegalDocument>
    </>
  );
}
