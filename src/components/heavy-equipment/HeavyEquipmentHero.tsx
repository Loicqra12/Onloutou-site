import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  trucksMachineryBreadcrumb,
  trucksMachineryHero,
  trucksMachineryHeroCaption,
  trucksMachineryMedia,
  trucksMachineryQualificationNotice,
} from "@/content/trucks-machinery-page";

export function HeavyEquipmentHero() {
  const photo = trucksMachineryMedia.fleetHero;

  return (
    <section className="heq-hero bg-brand-charcoal text-brand-white" aria-labelledby="heq-hero-title">
      <span className="heq-hero__rule" aria-hidden />
      <div className="heq-hero__inner container-content">
        <div className="heq-hero__copy">
          <Breadcrumb items={trucksMachineryBreadcrumb} />
          <p className="partners-eyebrow">{trucksMachineryHero.eyebrow}</p>
          <h1 id="heq-hero-title" className="heq-hero__title font-display font-extrabold tracking-tight text-balance">
            {trucksMachineryHero.titleBefore}
            <HighlightedText surface="dark">{trucksMachineryHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="heq-hero__intro">{trucksMachineryHero.intro}</p>
          <p className="heq-hero__caveat">{trucksMachineryHero.caveat}</p>
          <p className="heq-hero__qualification">{trucksMachineryQualificationNotice}</p>
          <div className="heq-hero__actions">
            <Button href={trucksMachineryHero.primaryCta.href} variant="primary">
              {trucksMachineryHero.primaryCta.label}
            </Button>
            <a href={trucksMachineryHero.secondaryCta.href} className="heq-hero__secondary link-motion">
              {trucksMachineryHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={70} className="heq-hero__visual">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="heq-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <figcaption className="heq-hero__caption">{trucksMachineryHeroCaption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
