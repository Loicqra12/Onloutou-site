import type { Metadata } from "next";
import Image from "next/image";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CustomPlatformHero } from "@/components/platforms/CustomPlatformHero";
import { PlatformAdoption } from "@/components/platforms/PlatformAdoption";
import { PlatformDashboardDemo } from "@/components/platforms/PlatformDashboardDemo";
import { PlatformDesignMethod } from "@/components/platforms/PlatformDesignMethod";
import { PlatformFaq } from "@/components/platforms/PlatformFaq";
import { PlatformFoundationsBand } from "@/components/platforms/PlatformFoundationsBand";
import { PlatformProjectBrief } from "@/components/platforms/PlatformProjectBrief";
import { PlatformScopes } from "@/components/platforms/PlatformScopes";
import { PlatformTechnicalFrame } from "@/components/platforms/PlatformTechnicalFrame";
import { PlatformTypes } from "@/components/platforms/PlatformTypes";
import { ProductEcosystem } from "@/components/platforms/ProductEcosystem";
import { ProjectArchitecture } from "@/components/platforms/ProjectArchitecture";
import { RoleInterfaceExplorer } from "@/components/platforms/RoleInterfaceExplorer";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import {
  customPlatformsBreadcrumbJsonLd,
  customPlatformsEditorialNotice,
  customPlatformsFinalCta,
  customPlatformsMedia,
  customPlatformsSeo,
  customPlatformsServiceJsonLd,
} from "@/content/custom-platforms-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...customPlatformsSeo,
  path: "/solutions/plateformes-sur-mesure",
  openGraphImages: [{ url: customPlatformsMedia.workshop.src, alt: customPlatformsMedia.workshop.alt }],
});

export default function CustomPlatformsPage() {
  const photo = customPlatformsFinalCta.image;

  return (
    <>
      <JsonLdFromSiteUrl id="platforms-breadcrumb-jsonld" build={customPlatformsBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="platforms-service-jsonld" build={customPlatformsServiceJsonLd} />

      <CustomPlatformHero />
      <PlatformFoundationsBand />
      <PlatformTypes />
      <RoleInterfaceExplorer />
      <ProductEcosystem />
      <ProjectArchitecture />
      <PlatformDashboardDemo />
      <PlatformDesignMethod />
      <PlatformAdoption />
      <PlatformScopes />
      <PlatformTechnicalFrame />
      <PlatformProjectBrief />
      <PlatformFaq />

      <section className="section-spacing">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{customPlatformsEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="platform-final" aria-labelledby="platform-final-title">
        <div className="platform-final__media">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="platform-final__bg"
            style={{ objectFit: "cover", objectPosition: photo.objectPosition }}
          />
        </div>
        <div className="platform-final__veil" aria-hidden />
        <div className="container-content platform-final__inner">
          <TitleReveal as="h2" id="platform-final-title" className="platform-final__title font-display font-extrabold tracking-tight text-balance">
            {customPlatformsFinalCta.titleBefore}
            {customPlatformsFinalCta.titleHighlight}
          </TitleReveal>
          <p className="platform-final__lead">{customPlatformsFinalCta.lead}</p>
          <div className="platform-final__actions">
            <Button href={customPlatformsFinalCta.primary.href} variant="primary">
              {customPlatformsFinalCta.primary.label}
            </Button>
            <a href={`tel:${customPlatformsFinalCta.phoneTel}`} className="platform-final__phone link-motion">
              {customPlatformsFinalCta.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
