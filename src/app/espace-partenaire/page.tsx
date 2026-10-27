import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PartnerModuleMatrix } from "@/components/partner-portal/PartnerModuleMatrix";
import { PartnerPortalHero } from "@/components/partner-portal/PartnerPortalHero";
import { PartnerPortalPreview } from "@/components/partner-portal/PartnerPortalPreview";
import {
  PartnerOrientationSectionBlock,
  PartnerPortalFinalCtaBlock,
  PartnerSecuritySectionBlock,
  PartnerSponsoringSectionBlock,
  PartnerSubscriptionSectionBlock,
  partnerJourneyNotice,
  partnerJourneySection,
} from "@/components/partner-portal/PartnerPortalSections";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  partnerPortalBreadcrumbJsonLd,
  partnerPortalFaq,
  partnerPortalJourneyPhases,
  partnerPortalSeo,
} from "@/content/partner-portal-page";
import { createPageMetadata, ROBOTS_PREVIEW_PORTAL } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...partnerPortalSeo,
  path: "/espace-partenaire",
  robots: ROBOTS_PREVIEW_PORTAL,
});

export default function EspacePartenairePage() {
  return (
    <>
      <JsonLdFromSiteUrl id="partner-portal-breadcrumb-jsonld" build={partnerPortalBreadcrumbJsonLd} />
      <PartnerPortalHero />
      <PartnerPortalPreview />
      <PartnerSubscriptionSectionBlock />
      <PartnerSponsoringSectionBlock />
      <PartnerModuleMatrix />
      <ProcessTimeline
        id="parcours-partenaire"
        title={partnerJourneySection.title}
        phases={partnerPortalJourneyPhases}
      />
      <div className="container-content section-spacing pt-0">
        <p className="epp-journey-notice">{partnerJourneyNotice}</p>
      </div>
      <PartnerSecuritySectionBlock />
      <PartnerOrientationSectionBlock />
      <ServiceFaq items={partnerPortalFaq} />
      <PartnerPortalFinalCtaBlock />
    </>
  );
}
