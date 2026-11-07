import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnEspContact, PtnEspDashboard, PtnEspFeatures, PtnEspHero } from "@/components/partners/redesign/PtnEsp";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { partnerPortalBreadcrumbJsonLd, partnerPortalSeo } from "@/content/partner-portal-page";
import { ptnEspFaq } from "@/content/partner-spaces-hub";
import { createPageMetadata, ROBOTS_PREVIEW_PORTAL } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";
import "@/styles/partner-spaces.css";

export const metadata: Metadata = createPageMetadata({
  ...partnerPortalSeo,
  path: "/espace-partenaire",
  robots: ROBOTS_PREVIEW_PORTAL,
});

export default function EspacePartenairePage() {
  return (
    <>
      <JsonLdFromSiteUrl id="partner-portal-breadcrumb-jsonld" build={partnerPortalBreadcrumbJsonLd} />
      <div className="ptn-page">
        <PtnEspHero />
        <PtnEspDashboard />
        <PtnEspFeatures />
        <PtnEspContact />
        <PtnFaq content={ptnEspFaq} variant="cards" initialOpen={0} />
      </div>
    </>
  );
}