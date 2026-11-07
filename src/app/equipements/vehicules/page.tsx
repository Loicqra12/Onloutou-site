import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { VhpBand } from "@/components/vehicles/redesign/VhpBand";
import { VhpProvider } from "@/components/vehicles/redesign/VhpContext";
import { VhpFaq } from "@/components/vehicles/redesign/VhpFaq";
import { VhpForm } from "@/components/vehicles/redesign/VhpForm";
import { VhpHero } from "@/components/vehicles/redesign/VhpHero";
import { VhpProfiles } from "@/components/vehicles/redesign/VhpProfiles";
import { VhpMission, VhpProposal } from "@/components/vehicles/redesign/VhpStatic";
import { vehiclesBreadcrumbJsonLd, vehiclesPageSeo, vehiclesServiceJsonLd } from "@/content/vehicles-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/vehicles-page.css";

export const metadata: Metadata = createPageMetadata({
  ...vehiclesPageSeo,
  path: "/equipements/vehicules",
});

export default function VehiculesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="vehicles-breadcrumb-jsonld" build={vehiclesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="vehicles-service-jsonld" build={vehiclesServiceJsonLd} />

      <div className="vhp-page">
        <VhpProvider>
          <VhpHero />
          <VhpProfiles />
          <VhpMission />
          <VhpForm />
          <VhpProposal />
          <VhpFaq />
          <VhpBand />
        </VhpProvider>
      </div>
    </>
  );
}
