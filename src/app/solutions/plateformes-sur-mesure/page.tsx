import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PsmBrief } from "@/components/platforms/psm/PsmBrief";
import { PsmFaq } from "@/components/platforms/psm/PsmFaq";
import { PsmHero } from "@/components/platforms/psm/PsmHero";
import { PsmRoles } from "@/components/platforms/psm/PsmRoles";
import {
  PsmAdoption,
  PsmConnect,
  PsmFinalCta,
  PsmInfo,
  PsmMethod,
  PsmModules,
  PsmOversight,
  PsmResponsibilities,
} from "@/components/platforms/psm/PsmSections";
import {
  customPlatformsBreadcrumbJsonLd,
  customPlatformsMedia,
  customPlatformsSeo,
  customPlatformsServiceJsonLd,
} from "@/content/custom-platforms-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/platform-page.css";

export const metadata: Metadata = createPageMetadata({
  ...customPlatformsSeo,
  path: "/solutions/plateformes-sur-mesure",
  openGraphImages: [{ url: customPlatformsMedia.workshop.src, alt: customPlatformsMedia.workshop.alt }],
});

export default function CustomPlatformsPage() {
  return (
    <div className="psm-page">
      <PageReveal root=".psm-page" targets=".psm-info-grid > li, .psm-adoption-list > li" />
      <JsonLdFromSiteUrl id="platforms-breadcrumb-jsonld" build={customPlatformsBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="platforms-service-jsonld" build={customPlatformsServiceJsonLd} />

      <PsmHero />
      <PsmRoles />
      <PsmConnect />
      <PsmInfo />
      <PsmOversight />
      <PsmMethod />
      <PsmAdoption />
      <PsmModules />
      <PsmResponsibilities />
      <PsmBrief />
      <PsmFaq />
      <PsmFinalCta />
    </div>
  );
}
