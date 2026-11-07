import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnDlAfter, PtnDlBand, PtnDlHero } from "@/components/partners/redesign/PtnDriverApply";
import { PtnDriverInterest } from "@/components/partners/redesign/PtnDriverInterest";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { driverPartnerBreadcrumbJsonLd, driverPartnerMedia, driverPartnerSeo } from "@/content/driver-partner-page";
import { ptnDlFaq } from "@/content/partner-spaces-hub";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";
import "@/styles/partner-spaces.css";

export const metadata: Metadata = createPageMetadata({
  ...driverPartnerSeo,
  path: "/devenir-livreur",
  openGraphImages: [{ url: driverPartnerMedia.hero.src, alt: driverPartnerMedia.hero.alt }],
});

export default function DevenirLivreurPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="driver-partner-breadcrumb-jsonld" build={driverPartnerBreadcrumbJsonLd} />
      <div className="ptn-page">
        <PageReveal root=".ptn-page" targets=".ptn-tiles__grid > li, .ptn-cards > li, .ptn-steps > li, .ptn-sup-grid > li" />
        <PtnDlHero />
        <PtnDriverInterest />
        <PtnDlAfter />
        <PtnFaq content={ptnDlFaq} variant="cards" initialOpen={null} />
        <PtnDlBand />
      </div>
    </>
  );
}