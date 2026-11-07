import type { Metadata } from "next";
import { PageReveal } from "@/components/motion/PageReveal";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CmeBand } from "@/components/trucks/redesign/CmeBand";
import { CmeCatalog } from "@/components/trucks/redesign/CmeCatalog";
import { CmeCategories } from "@/components/trucks/redesign/CmeCategories";
import { CmeProvider } from "@/components/trucks/redesign/CmeContext";
import { CmeFaq } from "@/components/trucks/redesign/CmeFaq";
import { CmeForm } from "@/components/trucks/redesign/CmeForm";
import { CmeHero } from "@/components/trucks/redesign/CmeHero";
import { CmeConditions, CmeSteps } from "@/components/trucks/redesign/CmeStatic";
import { trucksMachineryBreadcrumbJsonLd, trucksMachineryPageSeo, trucksMachineryServiceJsonLd } from "@/content/trucks-machinery-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/trucks-page.css";

export const metadata: Metadata = createPageMetadata({
  ...trucksMachineryPageSeo,
  path: "/equipements/camions-engins",
});

export default function CamionsEnginsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="trucks-machinery-breadcrumb-jsonld" build={trucksMachineryBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="trucks-machinery-service-jsonld" build={trucksMachineryServiceJsonLd} />

      <div className="cme-page">
        <PageReveal root=".cme-page" targets=".cme-categories__grid > li, .cme-cond__card, .cme-steps__list > li" />
        <CmeProvider>
          <CmeHero />
          <CmeCategories />
          <CmeCatalog />
          <CmeForm />
          <CmeConditions />
          <CmeSteps />
          <CmeFaq />
          <CmeBand />
        </CmeProvider>
      </div>
    </>
  );
}
