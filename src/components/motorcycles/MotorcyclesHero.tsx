import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  motorcyclesBreadcrumb,
  motorcyclesHero,
  motorcyclesHeroCaption,
  motorcyclesMedia,
  motorcyclesQualificationNotice,
} from "@/content/motorcycles-page";

export function MotorcyclesHero() {
  const photo = motorcyclesMedia.fleetHero;

  return (
    <section className="mot-hero bg-brand-charcoal text-brand-white" aria-labelledby="mot-hero-title">
      <span className="mot-hero__route" aria-hidden />
      <div className="mot-hero__inner container-content">
        <div className="mot-hero__copy">
          <Breadcrumb items={motorcyclesBreadcrumb} />
          <p className="partners-eyebrow">{motorcyclesHero.eyebrow}</p>
          <h1 id="mot-hero-title" className="mot-hero__title font-display font-extrabold tracking-tight text-balance">
            {motorcyclesHero.titleBefore}
            <HighlightedText surface="dark">{motorcyclesHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="mot-hero__intro">{motorcyclesHero.intro}</p>
          <p className="mot-hero__caveat">{motorcyclesHero.caveat}</p>
          <p className="mot-hero__qualification">{motorcyclesQualificationNotice}</p>
          <div className="mot-hero__actions">
            <Button href={motorcyclesHero.primaryCta.href} variant="primary">{motorcyclesHero.primaryCta.label}</Button>
            <a href={motorcyclesHero.secondaryCta.href} className="mot-hero__secondary link-motion">
              {motorcyclesHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={70} className="mot-hero__visual">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="mot-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <figcaption className="mot-hero__caption">{motorcyclesHeroCaption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
