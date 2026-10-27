import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  deliveryBreadcrumb,
  deliveryHero,
  deliveryPageMedia,
} from "@/content/delivery-page";

export function DeliveryHero() {
  const photo = deliveryPageMedia.hero;

  return (
    <section className="dlv-hero bg-brand-charcoal text-brand-white" aria-labelledby="dlv-hero-title">
      <div className="dlv-hero__route-line" aria-hidden />
      <div className="dlv-hero__inner container-content">
        <div className="dlv-hero__copy">
          <Breadcrumb items={deliveryBreadcrumb} />
          <p className="partners-eyebrow">{deliveryHero.eyebrow}</p>
          <h1 id="dlv-hero-title" className="dlv-hero__title font-display font-extrabold tracking-tight text-balance">
            {deliveryHero.titleBefore}
            <HighlightedText surface="dark">{deliveryHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="dlv-hero__intro">{deliveryHero.intro}</p>
          <div className="dlv-hero__actions">
            <Button href={deliveryHero.primaryCta.href} variant="primary">{deliveryHero.primaryCta.label}</Button>
            <a href={deliveryHero.secondaryCta.href} className="dlv-hero__secondary link-motion">
              {deliveryHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={60} className="dlv-hero__visual">
          <figure className="dlv-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="dlv-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <svg className="dlv-hero__path" viewBox="0 0 200 120" aria-hidden preserveAspectRatio="none">
              <circle className="dlv-hero__path-dot dlv-hero__path-dot--start" cx="24" cy="88" r="5" />
              <path className="dlv-hero__path-line" d="M 28 88 Q 80 40 120 52 T 176 32" fill="none" />
              <circle className="dlv-hero__path-dot dlv-hero__path-dot--end" cx="176" cy="32" r="5" />
            </svg>
            <div className="dlv-hero__panel" aria-label="Qualification illustrative">
              <ul className="dlv-hero__panel-list">
                {deliveryHero.cartouche.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="dlv-hero__panel-note">{deliveryHero.routeDisclaimer}</p>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
