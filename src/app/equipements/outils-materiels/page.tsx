import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { EquipmentFamilyExplorer } from "@/components/equipment/EquipmentFamilyExplorer";
import { EquipmentInspectionSection } from "@/components/equipment/EquipmentInspectionSection";
import { EquipmentReadinessSection } from "@/components/equipment/EquipmentReadinessSection";
import { EquipmentSelectionMatrix } from "@/components/equipment/EquipmentSelectionMatrix";
import { ToolsConnectedSection } from "@/components/equipment/ToolsConnectedSection";
import { ToolsEquipmentHero } from "@/components/equipment/ToolsEquipmentHero";
import { ToolsEquipmentProcess } from "@/components/equipment/ToolsEquipmentProcess";
import { ToolsEquipmentRequestBuilder } from "@/components/equipment/ToolsEquipmentRequestBuilder";
import { ToolsQualificationBand } from "@/components/equipment/ToolsQualificationBand";
import { ToolsRentAcquireCompare } from "@/components/equipment/ToolsRentAcquireCompare";
import { Button } from "@/components/ui/Button";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import { site } from "@/content/site";
import {
  toolsEquipmentBreadcrumbJsonLd,
  toolsEquipmentFaq,
  toolsEquipmentMedia,
  toolsEquipmentPageSeo,
  toolsEquipmentServiceJsonLd,
  toolsFinalCta,
  toolsTransparency,
} from "@/content/tools-equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...toolsEquipmentPageSeo,
  path: "/equipements/outils-materiels",
  openGraphImages: [{ url: toolsEquipmentMedia.hero.src, alt: toolsEquipmentMedia.hero.alt }],
});

export default function OutilsMaterielsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="tools-equipment-breadcrumb-jsonld" build={toolsEquipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="tools-equipment-service-jsonld" build={toolsEquipmentServiceJsonLd} />

      <ToolsEquipmentHero />
      <ToolsQualificationBand />
      <EquipmentFamilyExplorer />
      <EquipmentReadinessSection />
      <EquipmentInspectionSection />
      <ToolsRentAcquireCompare />
      <ToolsConnectedSection />
      <EquipmentSelectionMatrix />
      <ToolsEquipmentProcess />
      <ToolsEquipmentRequestBuilder />

      <section className="tem-transparency section-spacing bg-brand-paper" aria-labelledby="tem-transparency-title">
        <div className="container-content max-w-3xl">
          <h2 id="tem-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {toolsTransparency.title}
          </h2>
          <ul className="tem-transparency__list">
            {toolsTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="tem-transparency__note">{toolsTransparency.note}</p>
        </div>
      </section>

      <ServiceFaq items={toolsEquipmentFaq} />

      <section className="tem-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="tem-final-title">
        <div className="container-content tem-final__inner">
          <h2 id="tem-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            {toolsFinalCta.title}
          </h2>
          <p className="tem-final__lead">{toolsFinalCta.lead}</p>
          <div className="tem-final__actions">
            <Button href={toolsFinalCta.primary.href} variant="primary">{toolsFinalCta.primary.label}</Button>
            <a href={`tel:${site.phoneTel}`} className="tem-final__phone link-motion">{toolsFinalCta.secondaryPhoneLabel}</a>
            <Link href={toolsFinalCta.tertiary.href} className="tem-final__tertiary link-motion">{toolsFinalCta.tertiary.label}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
