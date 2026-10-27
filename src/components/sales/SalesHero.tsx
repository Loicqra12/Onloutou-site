import Image from "next/image";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import {
  imageCategoryDisclaimer,
  salesBreadcrumb,
  salesHero,
  salesMedia,
  salesPositioning,
} from "@/content/sales-page";

export function SalesHero() {
  const photo = salesMedia.hero;

  return (
    <section className="sales-hero" aria-labelledby="sales-hero-title">
      <div className="sales-hero__shell container-content">
        <div className="sales-hero__copy">
          <Breadcrumb items={salesBreadcrumb} />
          <p className="sales-eyebrow">{salesHero.eyebrow}</p>
          <TitleReveal as="h1" id="sales-hero-title" className="sales-hero__title font-display font-extrabold tracking-tight text-balance">
            {salesHero.titleBefore}
            <HighlightedText variant="marker" className="sales-marker">
              {salesHero.titleHighlight}
            </HighlightedText>
          </TitleReveal>
          <p className="sales-hero__intro">{salesHero.intro}</p>
          <p className="sales-hero__positioning">{salesPositioning}</p>
          <p className="sales-hero__caveat">{salesHero.caveat}</p>
          <div className="sales-hero__actions">
            <Button href={salesHero.primaryCta.href} variant="primary">
              {salesHero.primaryCta.label}
            </Button>
            <a href={salesHero.secondaryCta.href} className="sales-hero__secondary link-motion">
              {salesHero.secondaryCta.label}
              <span aria-hidden> ↓</span>
            </a>
          </div>
        </div>
        <figure className="sales-hero__visual">
          <div className="sales-hero__frame">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="sales-hero__img"
              style={{ objectPosition: photo.objectPosition }}
            />
          </div>
          <figcaption className="sales-hero__caption">{imageCategoryDisclaimer}</figcaption>
        </figure>
      </div>
    </section>
  );
}
