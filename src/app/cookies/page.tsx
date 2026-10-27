import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CookiesPolicyContent } from "@/components/legal/CookiesPolicyContent";
import { LegalPageHero } from "@/components/legal/LegalPageHero";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import {
  cookiesAuditStatusLabel,
  cookiesDraftBanner,
  cookiesPolicyBreadcrumb,
  cookiesPolicyBreadcrumbJsonLd,
  cookiesPolicyIsIndexable,
  cookiesPolicySeo,
  cookiesPolicyStatus,
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
      <LegalPageHero
        breadcrumb={cookiesPolicyBreadcrumb}
        eyebrow="COOKIES ET STOCKAGES"
        title="Politique relative aux cookies"
        intro="Cette page explique les technologies susceptibles d’enregistrer ou de lire des informations dans votre navigateur lors de l’utilisation du site ONLOUTOU."
        status={cookiesPolicyStatus}
        statusBanner={cookiesDraftBanner}
      />
      <p className="leg-cookies-hero-status container-content" role="status">
        {cookiesAuditStatusLabel[trackingStatus]}
      </p>
      <div className="leg-layout section-spacing bg-brand-paper">
        <div className="container-content leg-layout__grid">
          <LegalTableOfContents
            sections={cookiesTocSections}
            ariaLabel="Sommaire de la politique cookies"
          />
          <CookiesPolicyContent />
        </div>
      </div>
    </>
  );
}
