import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnEslHero, PtnEslNoticeCta, PtnEslPreview } from "@/components/partners/redesign/PtnEsl";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { driverPortalBreadcrumbJsonLd, driverPortalSeo } from "@/content/driver-portal-page";
import { ptnEslFaq } from "@/content/partner-spaces-hub";
import { createPageMetadata, ROBOTS_PREVIEW_PORTAL } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";
import "@/styles/partner-spaces.css";

export const metadata: Metadata = createPageMetadata({
  ...driverPortalSeo,
  path: "/espace-livreur",
  robots: ROBOTS_PREVIEW_PORTAL,
});

export default function EspaceLivreurPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="driver-portal-breadcrumb-jsonld" build={driverPortalBreadcrumbJsonLd} />
      <div className="ptn-page">
        <PtnEslHero />
        <PtnEslPreview />
        <PtnEslNoticeCta />
        <PtnFaq content={ptnEslFaq} variant="cards" initialOpen={0} />
      </div>
    </>
  );
}