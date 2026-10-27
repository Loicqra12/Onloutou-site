import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import { partnersBreadcrumb, partnersHero, partnersMedia } from "@/content/partners-page";

export function PartnersHero() {
  const photo = partnersMedia.hero;

  return (
    <section className="partners-hero bg-brand-charcoal text-brand-white" aria-labelledby="partners-hero-title">
      <span className="partners-hero__network" aria-hidden />
      <div className="partners-hero__inner container-content">
        <div className="partners-hero__copy">
          <Breadcrumb items={partnersBreadcrumb} />
          <p className="partners-eyebrow">{partnersHero.eyebrow}</p>
          <h1 id="partners-hero-title" className="partners-hero__title font-display font-extrabold tracking-tight text-balance">
            {partnersHero.titleBefore}
            <HighlightedText surface="dark">{partnersHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="partners-hero__intro">{partnersHero.intro}</p>
          <p className="partners-hero__caveat">{partnersHero.caveat}</p>
          <div className="partners-hero__actions">
            <Button href={partnersHero.primaryCta.href} variant="primary">{partnersHero.primaryCta.label}</Button>
            <a href={partnersHero.secondaryCta.href} className="partners-hero__secondary link-motion">
              {partnersHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={80} className="partners-hero__visual">
          <figure className="partners-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="partners-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
