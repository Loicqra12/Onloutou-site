import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { DriverCompensationSection } from "@/components/delivery/DriverCompensationSection";
import { DriverCriteriaSection } from "@/components/delivery/DriverCriteriaSection";
import { DriverFutureSpaceSection } from "@/components/delivery/DriverFutureSpaceSection";
import { DriverInterestForm } from "@/components/delivery/DriverInterestForm";
import { DriverJourney } from "@/components/delivery/DriverJourney";
import { DriverMissionsSection } from "@/components/delivery/DriverMissionsSection";
import { DriverPartnerFinalCta } from "@/components/delivery/DriverPartnerFinalCta";
import { DriverPartnerHero } from "@/components/delivery/DriverPartnerHero";
import { DriverProfileTypes } from "@/components/delivery/DriverProfileTypes";
import { DriverQualitiesSection } from "@/components/delivery/DriverQualitiesSection";
import { DriverSafetySection } from "@/components/delivery/DriverSafetySection";
import { DriverTransparencyBand } from "@/components/delivery/DriverTransparencyBand";
import { VehicleTypeSelector } from "@/components/delivery/VehicleTypeSelector";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  driverPartnerBreadcrumbJsonLd,
  driverPartnerFaq,
  driverPartnerMedia,
  driverPartnerSeo,
} from "@/content/driver-partner-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...driverPartnerSeo,
  path: "/devenir-livreur",
  openGraphImages: [{ url: driverPartnerMedia.hero.src, alt: driverPartnerMedia.hero.alt }],
});

export default function DevenirLivreurPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="driver-partner-breadcrumb-jsonld" build={driverPartnerBreadcrumbJsonLd} />
      <DriverPartnerHero />
      <DriverTransparencyBand />
      <DriverProfileTypes />
      <VehicleTypeSelector />
      <DriverQualitiesSection />
      <DriverCriteriaSection />
      <DriverJourney />
      <DriverSafetySection />
      <DriverMissionsSection />
      <DriverCompensationSection />
      <DriverInterestForm />
      <DriverFutureSpaceSection />
      <ServiceFaq items={driverPartnerFaq} />
      <DriverPartnerFinalCta />
    </>
  );
}
