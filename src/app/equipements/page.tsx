import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { EqpBrief } from "@/components/equipment/hub/EqpBrief";
import { EqpFamilies } from "@/components/equipment/hub/EqpFamilies";
import { EqpFaq } from "@/components/equipment/hub/EqpFaq";
import { EqpHero } from "@/components/equipment/hub/EqpHero";
import { EqpFinalCta, EqpRentBuy } from "@/components/equipment/hub/EqpSections";
import {
  equipmentBreadcrumbJsonLd,
  equipmentCollectionJsonLd,
  equipmentHubMedia,
  equipmentHubSeo,
} from "@/content/equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/equipment-hub.css";

export const metadata: Metadata = createPageMetadata({
  ...equipmentHubSeo,
  path: "/equipements",
  openGraphImages: [{ url: equipmentHubMedia.heroMenu.src, alt: equipmentHubMedia.heroMenu.alt }],
});

export default function EquipementsPage() {
  return (
    <div className="eqp-page">
      <JsonLdFromSiteUrl id="equipment-breadcrumb-jsonld" build={equipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="equipment-collection-jsonld" build={equipmentCollectionJsonLd} />

      <EqpHero />
      <EqpFamilies />
      <EqpRentBuy />
      <EqpBrief />
      <EqpFaq />
      <EqpFinalCta />
    </div>
  );
}
