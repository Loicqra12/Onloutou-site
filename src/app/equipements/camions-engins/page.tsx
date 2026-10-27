import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { HeavyEquipmentConnectedSection } from "@/components/heavy-equipment/HeavyEquipmentConnectedSection";
import { HeavyEquipmentHero } from "@/components/heavy-equipment/HeavyEquipmentHero";
import { HeavyEquipmentProcess } from "@/components/heavy-equipment/HeavyEquipmentProcess";
import { HeavyEquipmentProfiles } from "@/components/heavy-equipment/HeavyEquipmentProfiles";
import { HeavyEquipmentQualificationBand } from "@/components/heavy-equipment/HeavyEquipmentQualificationBand";
import { HeavyEquipmentQualificationMatrix } from "@/components/heavy-equipment/HeavyEquipmentQualificationMatrix";
import { HeavyEquipmentRentOrBuy } from "@/components/heavy-equipment/HeavyEquipmentRentOrBuy";
import { HeavyEquipmentRequestBuilder } from "@/components/heavy-equipment/HeavyEquipmentRequestBuilder";
import { OperationsStory } from "@/components/heavy-equipment/OperationsStory";
import { SafetyInspection } from "@/components/heavy-equipment/SafetyInspection";
import { SiteTerrainSection } from "@/components/heavy-equipment/SiteTerrainSection";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  trucksMachineryBreadcrumbJsonLd,
  trucksMachineryEditorialNotice,
  trucksMachineryFinalCta,
  trucksMachineryFaq,
  trucksMachineryMedia,
  trucksMachineryPageSeo,
  trucksMachineryPositioning,
  trucksMachineryServiceJsonLd,
  trucksMachineryTransparency,
} from "@/content/trucks-machinery-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...trucksMachineryPageSeo,
  path: "/equipements/camions-engins",
  openGraphImages: [{ url: trucksMachineryMedia.fleetHero.src, alt: trucksMachineryMedia.fleetHero.alt }],
});

export default function CamionsEnginsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="trucks-machinery-breadcrumb-jsonld" build={trucksMachineryBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="trucks-machinery-service-jsonld" build={trucksMachineryServiceJsonLd} />

      <HeavyEquipmentHero />

      <section className="heq-positioning section-spacing bg-brand-white" aria-label="Positionnement">
        <div className="container-content max-w-3xl">
          <p className="heq-positioning__text">{trucksMachineryPositioning}</p>
        </div>
      </section>

      <HeavyEquipmentQualificationBand />
      <HeavyEquipmentProfiles />
      <OperationsStory />
      <SiteTerrainSection />
      <SafetyInspection />
      <HeavyEquipmentRentOrBuy />
      <HeavyEquipmentConnectedSection />
      <HeavyEquipmentQualificationMatrix />
      <HeavyEquipmentProcess />
      <HeavyEquipmentRequestBuilder />

      <section className="heq-transparency section-spacing bg-brand-paper" aria-labelledby="heq-transparency-title">
        <div className="container-content max-w-3xl">
          <h2 id="heq-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {trucksMachineryTransparency.title}
          </h2>
          <ul className="heq-transparency__list">
            {trucksMachineryTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="heq-transparency__note">{trucksMachineryTransparency.note}</p>
        </div>
      </section>

      <ServiceFaq items={trucksMachineryFaq} />

      <section className="section-spacing bg-brand-white">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{trucksMachineryEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="heq-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="heq-final-title">
        <div className="container-content heq-final__inner">
          <Reveal>
            <h2 id="heq-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {trucksMachineryFinalCta.titleBefore}
              <HighlightedText surface="dark">{trucksMachineryFinalCta.titleHighlight}</HighlightedText>
            </h2>
            <p className="heq-final__lead">{trucksMachineryFinalCta.lead}</p>
            <div className="heq-final__actions">
              <Button href={trucksMachineryFinalCta.primary.href} variant="primary">
                {trucksMachineryFinalCta.primary.label}
              </Button>
              <a href={trucksMachineryFinalCta.secondary.href} className="heq-final__secondary link-motion">
                {trucksMachineryFinalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
