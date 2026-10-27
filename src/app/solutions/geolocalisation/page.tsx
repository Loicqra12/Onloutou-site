import Image from "next/image";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { GeolocationDeployment } from "@/components/geolocation/GeolocationDeployment";
import { GeolocationHero } from "@/components/geolocation/GeolocationHero";
import { GeolocationUseCases } from "@/components/geolocation/GeolocationUseCases";
import { FieldInstallationStory } from "@/components/geolocation/FieldInstallationStory";
import { HowGeolocationWorks } from "@/components/geolocation/HowGeolocationWorks";
import { PlatformShowcase } from "@/components/geolocation/PlatformShowcase";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import { Reveal } from "@/components/motion/Reveal";
import {
  geolocationBento,
  geolocationCapabilityBand,
  geolocationEditorialNotice,
  geolocationFaq,
  geolocationFieldIntro,
  geolocationFinalCta,
  geolocationMedia,
  geolocationSeo,
  geolocationBreadcrumbJsonLd,
  geolocationServiceJsonLd,
} from "@/content/geolocation-page";
import { SolutionCompanionLink } from "@/components/ui/SolutionCompanionLink";
import { SolutionCrossLinks } from "@/components/ui/SolutionCrossLinks";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({ ...geolocationSeo, path: "/solutions/geolocalisation" });

export default function GeolocationPage() {
  const berline = geolocationMedia.installBerline;

  return (
    <>
      <JsonLdFromSiteUrl id="geo-breadcrumb-jsonld" build={geolocationBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="geo-service-jsonld" build={geolocationServiceJsonLd} />

      <GeolocationHero />

      <section className="geo-cap-band" aria-label="Repères de la solution">
        <div className="container-content geo-cap-band__inner">
          <ul className="geo-cap-band__list">
            {geolocationCapabilityBand.map((label, index) => (
              <Reveal key={label} delay={index * 50} as="li" className="geo-cap-band__item">
                <span className="geo-cap-band__mark" aria-hidden />
                <span>{label}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="geo-field-intro section-spacing bg-brand-white" aria-labelledby="geo-field-intro-title">
        <div className="container-content geo-field-intro__layout">
          <figure className="geo-field-intro__figure">
            <div className="geo-field-intro__media">
              <Image
                src={berline.src}
                alt={berline.alt}
                width={berline.width}
                height={berline.height}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="geo-field-intro__img"
                priority={false}
              />
            </div>
          </figure>
          <div className="geo-field-intro__copy">
            <Reveal>
              <h2 id="geo-field-intro-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {geolocationFieldIntro.title}
              </h2>
              <p className="geo-field-intro__lead">{geolocationFieldIntro.lead}</p>
              <ul className="geo-field-intro__points">
                {geolocationFieldIntro.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <HowGeolocationWorks />
      <PlatformShowcase />

      <section
        id="alertes"
        className="geo-bento section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
        aria-labelledby="geo-bento-title"
      >
        <div className="container-content">
          <Reveal>
            <h2 id="geo-bento-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {geolocationBento.title}
            </h2>
          </Reveal>
          <ul className="geo-bento__grid">
            {geolocationBento.items.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 40}
                as="li"
                className={`geo-bento__cell geo-bento__cell--${item.size}`}
              >
                <span className="geo-bento__cell-mark" aria-hidden />
                <p className="geo-bento__cell-title">{item.title}</p>
              </Reveal>
            ))}
          </ul>
          <p className="geo-bento__note">{geolocationBento.note}</p>
        </div>
      </section>

      <FieldInstallationStory />
      <GeolocationUseCases />
      <GeolocationDeployment />

      <SolutionCompanionLink
        title="Au-delà du GPS"
        description="Pour organiser la supervision, les rôles et les tableaux de bord sur l’ensemble de vos opérations,"
        href="/solutions/gestion-de-flotte"
        linkLabel="voir la gestion de flotte"
      />

      <ServiceFaq items={geolocationFaq} openFirst />

      <section className="section-spacing bg-brand-white">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{geolocationEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="geo-final-cta" aria-labelledby="geo-final-cta-title">
        <div className="container-content geo-final-cta__inner">
          <div className="geo-final-cta__mark" aria-hidden />
          <h2 id="geo-final-cta-title" className="geo-final-cta__title font-display font-extrabold tracking-tight">
            {geolocationFinalCta.title}
            <HighlightedText surface="dark">{geolocationFinalCta.titleHighlight}</HighlightedText>
          </h2>
          <p className="geo-final-cta__lead">{geolocationFinalCta.lead}</p>
          <div className="geo-final-cta__actions">
            <Button href={geolocationFinalCta.primary.href} variant="primary">
              {geolocationFinalCta.primary.label}
            </Button>
            <a href={geolocationFinalCta.phoneTel} className="geo-final-cta__phone link-motion">
              {geolocationFinalCta.phoneLabel} — {geolocationFinalCta.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <SolutionCrossLinks currentHref="/solutions/geolocalisation" />
    </>
  );
}
