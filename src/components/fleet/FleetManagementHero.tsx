import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import {
  fleetBreadcrumb,
  fleetHero,
  fleetManagementMedia,
} from "@/content/fleet-management-page";

export function FleetManagementHero() {
  const photo = fleetManagementMedia.heroPhoto;

  return (
    <section className="fleet-hero bg-brand-charcoal text-brand-white" aria-labelledby="fleet-hero-title">
      <div className="fleet-hero__shell">
        <div className="fleet-hero__copy container-content">
          <Breadcrumb items={fleetBreadcrumb} />
          <p className="fleet-eyebrow">{fleetHero.eyebrow}</p>
          <h1 id="fleet-hero-title" className="fleet-hero__title font-display font-extrabold tracking-tight text-balance">
            {fleetHero.titleBefore}
            <HighlightedText surface="dark">{fleetHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="fleet-hero__intro">{fleetHero.intro}</p>
          <p className="fleet-hero__caveat">{fleetHero.caveat}</p>
          <div className="fleet-hero__actions">
            <Button href={fleetHero.primaryCta.href} variant="primary">
              {fleetHero.primaryCta.label}
            </Button>
            <a href={fleetHero.secondaryCta.href} className="fleet-hero__secondary link-motion">
              {fleetHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <div className="fleet-hero__divider" aria-hidden />
        <figure className="fleet-hero__photo">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="fleet-hero__photo-img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
      <div className="fleet-hero__ledge" aria-hidden>
        <span className="fleet-hero__ledge-line" />
      </div>
    </section>
  );
}
