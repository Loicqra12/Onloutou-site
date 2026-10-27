import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleProfiles } from "@/components/vehicles/VehicleProfiles";
import { VehicleRequestBuilder } from "@/components/vehicles/VehicleRequestBuilder";
import { VehicleSelectionCriteria } from "@/components/vehicles/VehicleSelectionCriteria";
import { VehicleSelectionProcess } from "@/components/vehicles/VehicleSelectionProcess";
import { VehicleUsageMatrix } from "@/components/vehicles/VehicleUsageMatrix";
import { VehiclesConnectedSection } from "@/components/vehicles/VehiclesConnectedSection";
import { VehiclesCriteriaBand } from "@/components/vehicles/VehiclesCriteriaBand";
import { VehiclesHero } from "@/components/vehicles/VehiclesHero";
import { VehiclesRentOrBuy } from "@/components/vehicles/VehiclesRentOrBuy";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  vehiclesBreadcrumbJsonLd,
  vehiclesEditorialNotice,
  vehiclesFinalCta,
  vehiclesFaq,
  vehiclesMedia,
  vehiclesPageSeo,
  vehiclesPositioning,
  vehiclesServiceJsonLd,
  vehiclesTransparency,
} from "@/content/vehicles-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...vehiclesPageSeo,
  path: "/equipements/vehicules",
  openGraphImages: [{ url: vehiclesMedia.fleetHero.src, alt: vehiclesMedia.fleetHero.alt }],
});

export default function VehiculesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="vehicles-breadcrumb-jsonld" build={vehiclesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="vehicles-service-jsonld" build={vehiclesServiceJsonLd} />

      <VehiclesHero />

      <section className="veh-positioning section-spacing bg-brand-white" aria-label="Positionnement">
        <div className="container-content max-w-3xl">
          <p className="veh-positioning__text">{vehiclesPositioning}</p>
        </div>
      </section>

      <VehiclesCriteriaBand />
      <VehicleProfiles />
      <VehicleUsageMatrix />
      <VehiclesRentOrBuy />
      <VehiclesConnectedSection />
      <VehicleSelectionCriteria />
      <VehicleSelectionProcess />
      <VehicleRequestBuilder />

      <section className="veh-transparency section-spacing bg-brand-paper" aria-labelledby="veh-transparency-title">
        <div className="container-content max-w-3xl">
          <h2 id="veh-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {vehiclesTransparency.title}
          </h2>
          <ul className="veh-transparency__list">
            {vehiclesTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="veh-transparency__note">{vehiclesTransparency.note}</p>
        </div>
      </section>

      <ServiceFaq items={vehiclesFaq} />

      <section className="section-spacing bg-brand-white">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{vehiclesEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="veh-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="veh-final-title">
        <div className="container-content veh-final__inner">
          <Reveal>
            <h2 id="veh-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {vehiclesFinalCta.titleBefore}
              <HighlightedText surface="dark">{vehiclesFinalCta.titleHighlight}</HighlightedText>
            </h2>
            <p className="veh-final__lead">{vehiclesFinalCta.lead}</p>
            <div className="veh-final__actions">
              <Button href={vehiclesFinalCta.primary.href} variant="primary">{vehiclesFinalCta.primary.label}</Button>
              <a href={vehiclesFinalCta.secondary.href} className="veh-final__secondary link-motion">{vehiclesFinalCta.secondary.label}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
