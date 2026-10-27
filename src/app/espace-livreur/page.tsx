import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { DriverModuleMatrix } from "@/components/driver-portal/DriverModuleMatrix";
import { DriverPortalHero } from "@/components/driver-portal/DriverPortalHero";
import { DriverPortalPreview } from "@/components/driver-portal/DriverPortalPreview";
import {
  DriverDataProtectionBlock,
  DriverFieldSafetyBlock,
  DriverMissionFramingBlock,
  DriverOrientationBlock,
  DriverPaymentsBlock,
  DriverPortalFinalCtaBlock,
} from "@/components/driver-portal/DriverPortalSections";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  driverActivationJourney,
  driverActivationPhases,
  driverPortalBreadcrumbJsonLd,
  driverPortalFaq,
  driverPortalSeo,
} from "@/content/driver-portal-page";
import { createPageMetadata, ROBOTS_PREVIEW_PORTAL } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...driverPortalSeo,
  path: "/espace-livreur",
  robots: ROBOTS_PREVIEW_PORTAL,
});

export default function EspaceLivreurPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="driver-portal-breadcrumb-jsonld" build={driverPortalBreadcrumbJsonLd} />
      <DriverPortalHero />
      <DriverPortalPreview />
      <DriverModuleMatrix />
      <DriverMissionFramingBlock />
      <ProcessTimeline
        id="parcours-activation-livreur"
        title={driverActivationJourney.title}
        phases={driverActivationPhases}
      />
      <div className="container-content section-spacing pt-0">
        <p className="edl-journey-notice">{driverActivationJourney.notice}</p>
      </div>
      <DriverPaymentsBlock />
      <DriverFieldSafetyBlock />
      <DriverDataProtectionBlock />
      <DriverOrientationBlock />
      <ServiceFaq items={driverPortalFaq} />
      <DriverPortalFinalCtaBlock />
    </>
  );
}
