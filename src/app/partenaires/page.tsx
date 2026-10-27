import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CollaborationPath } from "@/components/partners/CollaborationPath";
import { FuturePartnerSpaces } from "@/components/partners/FuturePartnerSpaces";
import { PartnerInterestBuilder } from "@/components/partners/PartnerInterestBuilder";
import { PartnerProfiles } from "@/components/partners/PartnerProfiles";
import { PartnerRoleSplit } from "@/components/partners/PartnerRoleSplit";
import { PartnersContributionBand } from "@/components/partners/PartnersContributionBand";
import { PartnersHero } from "@/components/partners/PartnersHero";
import { PartnersPrinciples } from "@/components/partners/PartnersPrinciples";
import { PartnersVerification } from "@/components/partners/PartnersVerification";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  partnersBreadcrumbJsonLd,
  partnersEditorialNotice,
  partnersFinalCta,
  partnersFaq,
  partnersHubSeo,
  partnersMedia,
  partnersWebPageJsonLd,
} from "@/content/partners-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...partnersHubSeo,
  path: "/partenaires",
  openGraphImages: [{ url: partnersMedia.hero.src, alt: partnersMedia.hero.alt }],
});

export default function PartenairesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="partners-breadcrumb-jsonld" build={partnersBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="partners-webpage-jsonld" build={partnersWebPageJsonLd} />

      <PartnersHero />
      <PartnersContributionBand />
      <PartnerProfiles />
      <PartnerRoleSplit />
      <CollaborationPath />
      <PartnersVerification />
      <FuturePartnerSpaces />
      <PartnersPrinciples />
      <PartnerInterestBuilder />

      <ServiceFaq items={partnersFaq} />

      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{partnersEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="partners-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="partners-final-title">
        <div className="container-content partners-final__inner">
          <Reveal>
            <h2 id="partners-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {partnersFinalCta.titleBefore}
              <HighlightedText surface="dark">{partnersFinalCta.titleHighlight}</HighlightedText>
            </h2>
            <p className="partners-final__lead">{partnersFinalCta.lead}</p>
            <div className="partners-final__actions">
              <Button href={partnersFinalCta.primary.href} variant="primary">{partnersFinalCta.primary.label}</Button>
              <a href={partnersFinalCta.secondary.href} className="partners-final__secondary link-motion">
                {partnersFinalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
