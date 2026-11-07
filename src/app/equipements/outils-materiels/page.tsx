import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { TemBand } from "@/components/tools/redesign/TemBand";
import { TemBar } from "@/components/tools/redesign/TemBar";
import { TemCatalog } from "@/components/tools/redesign/TemCatalog";
import { TemCategories } from "@/components/tools/redesign/TemCategories";
import { TemProvider } from "@/components/tools/redesign/TemContext";
import { TemFaq } from "@/components/tools/redesign/TemFaq";
import { TemForm } from "@/components/tools/redesign/TemForm";
import { TemHero } from "@/components/tools/redesign/TemHero";
import { TemFlow, TemProposal, TemShowroom, TemSteps } from "@/components/tools/redesign/TemStatic";
import {
  toolsEquipmentBreadcrumbJsonLd,
  toolsEquipmentMedia,
  toolsEquipmentPageSeo,
  toolsEquipmentServiceJsonLd,
} from "@/content/tools-equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/tools-page.css";

export const metadata: Metadata = createPageMetadata({
  ...toolsEquipmentPageSeo,
  path: "/equipements/outils-materiels",
  openGraphImages: [{ url: toolsEquipmentMedia.hero.src, alt: toolsEquipmentMedia.hero.alt }],
});

export default function OutilsMaterielsPage() {
  return (
    <div className="tem-page">
      <PageReveal root=".tem-page" targets=".tem-categories__grid > li, .tem-proposal__grid > li, .tem-process__steps > li, .tem-inspection__list > li" />
      <JsonLdFromSiteUrl id="tools-equipment-breadcrumb-jsonld" build={toolsEquipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="tools-equipment-service-jsonld" build={toolsEquipmentServiceJsonLd} />
      <TemProvider>
        <TemHero />
        <TemCategories />
        <div className="tem-flow-zone">
          <TemCatalog />
          <TemShowroom />
          <TemSteps />
          <TemBar />
        </div>
        <TemForm />
        <TemFlow />
        <TemProposal />
        <TemFaq />
        <TemBand />
      </TemProvider>
    </div>
  );
}
