import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import { geolocationBreadcrumb, geolocationHero, geolocationMedia } from "@/content/geolocation-page";

export function GeolocationHero() {
  const svg = geolocationMedia.illustration;

  return (
    <section className="geo-hero bg-brand-charcoal text-brand-white" aria-labelledby="geo-hero-title">
      <div className="geo-hero__inner container-content">
        <div className="geo-hero__copy">
          <Breadcrumb items={geolocationBreadcrumb} />
          <p className="geo-eyebrow">{geolocationHero.eyebrow}</p>
          <h1 id="geo-hero-title" className="geo-hero__title font-display font-extrabold tracking-tight text-balance">
            {geolocationHero.titleBefore}
            <HighlightedText surface="dark">{geolocationHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="geo-hero__intro">{geolocationHero.intro}</p>
          <p className="geo-hero__caveat">{geolocationHero.caveat}</p>
          <div className="geo-hero__actions">
            <Button href={geolocationHero.primaryCta.href} variant="primary">
              {geolocationHero.primaryCta.label}
            </Button>
            <a href={geolocationHero.secondaryCta.href} className="geo-hero__secondary link-motion">
              {geolocationHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <div className="geo-hero__visual">
          <Reveal delay={100}>
            <figure className="geo-hero__figure">
              {/* img natif pour préserver les animations SMIL/CSS du SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={svg.src}
                alt={svg.alt}
                width={svg.width}
                height={svg.height}
                className="geo-hero__svg"
                fetchPriority="high"
                decoding="async"
              />
              <figcaption className="geo-hero__svg-caption">{geolocationHero.svgCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
