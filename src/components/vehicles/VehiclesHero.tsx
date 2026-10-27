import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { LcpPicture } from "@/components/ui/LcpPicture";
import { vehiclesBreadcrumb, vehiclesHero, vehiclesHeroCaption, vehiclesMedia } from "@/content/vehicles-page";

export function VehiclesHero() {
  const photo = vehiclesMedia.fleetHero;

  return (
    <section className="veh-hero bg-brand-charcoal text-brand-white" aria-labelledby="veh-hero-title">
      <span className="veh-hero__rule" aria-hidden />
      <div className="veh-hero__inner container-content">
        <div className="veh-hero__copy">
          <Breadcrumb items={vehiclesBreadcrumb} />
          <p className="partners-eyebrow">{vehiclesHero.eyebrow}</p>
          <h1 id="veh-hero-title" className="veh-hero__title font-display font-extrabold tracking-tight text-balance">
            {vehiclesHero.titleBefore}
            <HighlightedText surface="dark">{vehiclesHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="veh-hero__intro">{vehiclesHero.intro}</p>
          <p className="veh-hero__caveat">{vehiclesHero.caveat}</p>
          <div className="veh-hero__actions">
            <Button href={vehiclesHero.primaryCta.href} variant="primary">{vehiclesHero.primaryCta.label}</Button>
            <a href={vehiclesHero.secondaryCta.href} className="veh-hero__secondary link-motion">{vehiclesHero.secondaryCta.label}</a>
          </div>
        </div>
        <figure className="veh-hero__visual">
            <LcpPicture
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1023px) 100vw, 55vw"
              className="veh-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <figcaption className="veh-hero__caption">{vehiclesHeroCaption}</figcaption>
          </figure>
      </div>
    </section>
  );
}
