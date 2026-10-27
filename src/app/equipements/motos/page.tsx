import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { MotorcycleContextCriteria } from "@/components/motorcycles/MotorcycleContextCriteria";
import { MotorcycleProcess } from "@/components/motorcycles/MotorcycleProcess";
import { MotorcycleProfiles } from "@/components/motorcycles/MotorcycleProfiles";
import { MotorcycleRequestBuilder } from "@/components/motorcycles/MotorcycleRequestBuilder";
import { MotorcycleSafetyCheck } from "@/components/motorcycles/MotorcycleSafetyCheck";
import { MotorcyclesConnectedSection } from "@/components/motorcycles/MotorcyclesConnectedSection";
import { MotorcyclesHero } from "@/components/motorcycles/MotorcyclesHero";
import { MotorcyclesPrioritiesBand } from "@/components/motorcycles/MotorcyclesPrioritiesBand";
import { MotorcyclesRentOrBuy } from "@/components/motorcycles/MotorcyclesRentOrBuy";
import { UrbanMobilityStory } from "@/components/motorcycles/UrbanMobilityStory";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  motorcyclesBreadcrumbJsonLd,
  motorcyclesEditorialNotice,
  motorcyclesFinalCta,
  motorcyclesFaq,
  motorcyclesMedia,
  motorcyclesPageSeo,
  motorcyclesPositioning,
  motorcyclesServiceJsonLd,
  motorcyclesTransparency,
} from "@/content/motorcycles-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...motorcyclesPageSeo,
  path: "/equipements/motos",
  openGraphImages: [{ url: motorcyclesMedia.fleetHero.src, alt: motorcyclesMedia.fleetHero.alt }],
});

export default function MotosPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="motorcycles-breadcrumb-jsonld" build={motorcyclesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="motorcycles-service-jsonld" build={motorcyclesServiceJsonLd} />

      <MotorcyclesHero />

      <section className="mot-positioning section-spacing bg-brand-white" aria-label="Positionnement">
        <div className="container-content max-w-3xl">
          <p className="mot-positioning__text">{motorcyclesPositioning}</p>
        </div>
      </section>

      <MotorcyclesPrioritiesBand />
      <MotorcycleProfiles />
      <UrbanMobilityStory />
      <MotorcycleSafetyCheck />
      <MotorcyclesRentOrBuy />
      <MotorcyclesConnectedSection />
      <MotorcycleContextCriteria />
      <MotorcycleProcess />
      <MotorcycleRequestBuilder />

      <section className="mot-transparency section-spacing bg-brand-paper" aria-labelledby="mot-transparency-title">
        <div className="container-content max-w-3xl">
          <h2 id="mot-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {motorcyclesTransparency.title}
          </h2>
          <ul className="mot-transparency__list">
            {motorcyclesTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mot-transparency__note">{motorcyclesTransparency.note}</p>
        </div>
      </section>

      <ServiceFaq items={motorcyclesFaq} />

      <section className="section-spacing bg-brand-white">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{motorcyclesEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="mot-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="mot-final-title">
        <div className="container-content mot-final__inner">
          <Reveal>
            <h2 id="mot-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {motorcyclesFinalCta.titleBefore}
              <HighlightedText surface="dark">{motorcyclesFinalCta.titleHighlight}</HighlightedText>
            </h2>
            <p className="mot-final__lead">{motorcyclesFinalCta.lead}</p>
            <div className="mot-final__actions">
              <Button href={motorcyclesFinalCta.primary.href} variant="primary">{motorcyclesFinalCta.primary.label}</Button>
              <a href={motorcyclesFinalCta.secondary.href} className="mot-final__secondary link-motion">
                {motorcyclesFinalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
