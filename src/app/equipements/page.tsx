import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { ConnectedEquipmentSection } from "@/components/equipment/ConnectedEquipmentSection";
import { EquipmentHero } from "@/components/equipment/EquipmentHero";
import { EquipmentOrientationBand } from "@/components/equipment/EquipmentOrientationBand";
import { EquipmentOrientationTool } from "@/components/equipment/EquipmentOrientationTool";
import { EquipmentProcess } from "@/components/equipment/EquipmentProcess";
import { EquipmentTerrain } from "@/components/equipment/EquipmentTerrain";
import { EquipmentUniverse } from "@/components/equipment/EquipmentUniverse";
import { RentOrBuy } from "@/components/equipment/RentOrBuy";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  equipmentBreadcrumbJsonLd,
  equipmentCollectionJsonLd,
  equipmentEditorialNotice,
  equipmentFinalCta,
  equipmentHubMedia,
  equipmentHubFaq,
  equipmentHubSeo,
  equipmentTransparency,
} from "@/content/equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...equipmentHubSeo,
  path: "/equipements",
  openGraphImages: [{ url: equipmentHubMedia.heroMenu.src, alt: equipmentHubMedia.heroMenu.alt }],
});

export default function EquipementsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="equipment-breadcrumb-jsonld" build={equipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="equipment-collection-jsonld" build={equipmentCollectionJsonLd} />

      <EquipmentHero />
      <EquipmentOrientationBand />
      <EquipmentUniverse />
      <RentOrBuy />
      <EquipmentTerrain />
      <ConnectedEquipmentSection />
      <EquipmentProcess />
      <EquipmentOrientationTool />

      <section className="equip-transparency section-spacing bg-brand-white" aria-labelledby="equip-transparency-title">
        <div className="container-content">
          <h2 id="equip-transparency-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {equipmentTransparency.title}
          </h2>
          <ul className="equip-transparency__list">
            {equipmentTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="equip-transparency__note">{equipmentTransparency.note}</p>
        </div>
      </section>

      <ServiceFaq items={equipmentHubFaq} />

      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{equipmentEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="equip-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="equip-final-title">
        <div className="container-content equip-final__inner">
          <Reveal>
            <h2 id="equip-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {equipmentFinalCta.titleBefore}
              <HighlightedText surface="dark">{equipmentFinalCta.titleHighlight}</HighlightedText>
              {equipmentFinalCta.titleAfter}
            </h2>
            <p className="equip-final__lead">{equipmentFinalCta.lead}</p>
            <div className="equip-final__actions">
              <Button href={equipmentFinalCta.primary.href} variant="primary">
                {equipmentFinalCta.primary.label}
              </Button>
              <a href={equipmentFinalCta.secondary.href} className="equip-final__secondary link-motion">
                {equipmentFinalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
