import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { PtnAfter, PtnProposalHero } from "@/components/partners/redesign/PtnProposal";
import { PtnProposalForm } from "@/components/partners/redesign/PtnProposalForm";
import { becomePartnerBreadcrumbJsonLd, becomePartnerMedia, becomePartnerSeo } from "@/content/become-partner-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";

export const metadata: Metadata = createPageMetadata({
  ...becomePartnerSeo,
  path: "/devenir-partenaire",
  openGraphImages: [{ url: becomePartnerMedia.hero.src, alt: becomePartnerMedia.hero.alt }],
});

/** Page « Proposer une collaboration » (route historique /devenir-partenaire). */
export default function DevenirPartenairePage() {
  return (
    <>
      <JsonLdFromSiteUrl id="become-partner-breadcrumb-jsonld" build={becomePartnerBreadcrumbJsonLd} />

      <div className="ptn-page">
        <PageReveal root=".ptn-page" targets=".ptn-tiles__grid > li, .ptn-cards > li, .ptn-steps > li, .ptn-sup-grid > li" />
        <PtnProposalHero />
        <PtnProposalForm />
        <PtnAfter />
        <PtnFaq />
      </div>
    </>
  );
}