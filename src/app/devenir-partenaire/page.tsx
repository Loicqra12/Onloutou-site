import type { Metadata } from "next";
import Image from "next/image";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { BecomePartnerAudiences } from "@/components/partners/BecomePartnerAudiences";
import { BecomePartnerHero } from "@/components/partners/BecomePartnerHero";
import { PartnerApplicationBuilder } from "@/components/partners/PartnerApplicationBuilder";
import { PartnerReadinessCheck } from "@/components/partners/PartnerReadinessCheck";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  becomePartnerAfterContact,
  becomePartnerBreadcrumbJsonLd,
  becomePartnerCriteria,
  becomePartnerEditorialNotice,
  becomePartnerFaq,
  becomePartnerFinalCta,
  becomePartnerLegalNotice,
  becomePartnerMedia,
  becomePartnerSeo,
  becomePartnerSensitiveData,
  partnersPositioning,
} from "@/content/become-partner-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...becomePartnerSeo,
  path: "/devenir-partenaire",
  openGraphImages: [{ url: becomePartnerMedia.hero.src, alt: becomePartnerMedia.hero.alt }],
});

export default function DevenirPartenairePage() {
  const stand = becomePartnerMedia.stand;

  return (
    <>
      <JsonLdFromSiteUrl id="become-partner-breadcrumb-jsonld" build={becomePartnerBreadcrumbJsonLd} />

      <BecomePartnerHero />

      <section className="become-partner-legal section-spacing bg-brand-white" aria-label="Positionnement">
        <div className="container-content max-w-3xl">
          <p className="become-partner-legal__text">{partnersPositioning}</p>
          <p className="become-partner-legal__text become-partner-legal__text--strong">{becomePartnerLegalNotice}</p>
        </div>
      </section>

      <BecomePartnerAudiences />
      <PartnerReadinessCheck />

      <section className="become-partner-sensitive section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="become-partner-sensitive-title">
        <div className="container-content max-w-3xl">
          <h2 id="become-partner-sensitive-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {becomePartnerSensitiveData.title}
          </h2>
          <p className="become-partner-sensitive__lead">{becomePartnerSensitiveData.lead}</p>
          <ul className="become-partner-sensitive__list">
            {becomePartnerSensitiveData.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="become-partner-sensitive__note">{becomePartnerSensitiveData.note}</p>
        </div>
      </section>

      <PartnerApplicationBuilder />

      <section className="become-partner-after section-spacing bg-brand-white" aria-labelledby="become-partner-after-title">
        <div className="container-content max-w-3xl">
          <h2 id="become-partner-after-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {becomePartnerAfterContact.title}
          </h2>
          <ol className="become-partner-after__steps">
            {becomePartnerAfterContact.steps.map((step, index) => (
              <li key={step.title}>
                <span className="become-partner-after__num">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="become-partner-after__disclaimer">{becomePartnerAfterContact.disclaimer}</p>
        </div>
      </section>

      <section className="become-partner-criteria section-spacing bg-brand-paper" aria-labelledby="become-partner-criteria-title">
        <div className="container-content become-partner-criteria__grid">
          <div>
            <h2 id="become-partner-criteria-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {becomePartnerCriteria.title}
            </h2>
            <ul className="become-partner-criteria__list">
              {becomePartnerCriteria.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="become-partner-criteria__note">{becomePartnerCriteria.note}</p>
          </div>
          <figure className="become-partner-criteria__figure">
            <Image
              src={stand.src}
              alt={stand.alt}
              width={stand.width}
              height={stand.height}
              sizes="(max-width: 767px) 100vw, 480px"
              className="become-partner-criteria__img"
              style={{ objectPosition: stand.objectPosition }}
            />
            <figcaption>{stand.caption}</figcaption>
          </figure>
        </div>
      </section>

      <ServiceFaq items={becomePartnerFaq} />

      <section className="section-spacing bg-brand-white">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice">{becomePartnerEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="become-partner-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="become-partner-final-title">
        <div className="container-content become-partner-final__inner">
          <Reveal>
            <h2 id="become-partner-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {becomePartnerFinalCta.titleBefore}
              <HighlightedText surface="dark">{becomePartnerFinalCta.titleHighlight}</HighlightedText>
            </h2>
            <p className="become-partner-final__lead">{becomePartnerFinalCta.lead}</p>
            <div className="become-partner-final__actions">
              <Button href={becomePartnerFinalCta.primary.href} variant="primary">{becomePartnerFinalCta.primary.label}</Button>
              <a href={becomePartnerFinalCta.secondary.href} className="become-partner-final__secondary link-motion">
                {becomePartnerFinalCta.secondary.label}
              </a>
            </div>
            <a href={becomePartnerFinalCta.portalLink.href} className="become-partner-final__tertiary link-motion">
              {becomePartnerFinalCta.portalLink.label}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
