import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  driverPartnerBreadcrumb,
  driverPartnerHero,
  driverPartnerMedia,
} from "@/content/driver-partner-page";

export function DriverPartnerHero() {
  const photo = driverPartnerMedia.hero;
  const data = driverPartnerHero;

  return (
    <section className="drv-hero bg-brand-charcoal text-brand-white" aria-labelledby="drv-hero-title">
      <div className="drv-hero__inner container-content">
        <div className="drv-hero__copy">
          <Breadcrumb items={driverPartnerBreadcrumb} />
          <p className="partners-eyebrow">{data.eyebrow}</p>
          <h1 id="drv-hero-title" className="drv-hero__title font-display font-extrabold tracking-tight text-balance">
            {data.titleBefore}
            <HighlightedText surface="dark">{data.titleHighlight}</HighlightedText>
          </h1>
          <p className="drv-hero__intro">{data.intro}</p>
          <div className="drv-hero__actions">
            <Button href={data.primaryCta.href} variant="primary">{data.primaryCta.label}</Button>
            <a href={data.secondaryCta.href} className="drv-hero__secondary link-motion">{data.secondaryCta.label}</a>
          </div>
          <p className="drv-hero__alt">
            <Link href={data.deliveryNeedLink.href} className="link-motion">{data.deliveryNeedLink.label}</Link>
          </p>
        </div>
        <Reveal delay={70} className="drv-hero__visual">
          <figure className="drv-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="drv-hero__img editorial-media__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <div className="drv-hero__panel" aria-label="Votre profil — informations générales">
              <p className="drv-hero__panel-title">Votre profil</p>
              <ul>
                {data.panelFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
