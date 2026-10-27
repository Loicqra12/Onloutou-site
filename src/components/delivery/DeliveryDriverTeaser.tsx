import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { deliveryDriverTeaser, deliveryPageMedia } from "@/content/delivery-page";

export function DeliveryDriverTeaser() {
  const data = deliveryDriverTeaser;
  const photo = deliveryPageMedia.urbanCoordination;

  return (
    <section
      id={data.id}
      className="dlv-driver-teaser section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="dlv-driver-teaser-title"
    >
      <div className="container-content dlv-driver-teaser__layout">
        <div>
          <p className="partners-eyebrow">{data.eyebrow}</p>
          <h2 id="dlv-driver-teaser-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="dlv-driver-teaser__lead">{data.lead}</p>
          <ul className="dlv-driver-teaser__disclaimers">
            {data.disclaimers.map((item) => (
              <li key={item}>pas de garantie de {item}</li>
            ))}
          </ul>
          <div className="dlv-driver-teaser__actions">
            <Button href={data.primaryCta.href} variant="primary">{data.primaryCta.label}</Button>
            <Link href={data.secondaryCta.href} className="dlv-driver-teaser__link link-motion">
              {data.secondaryCta.label}
            </Link>
            <Link href={data.portalLink.href} className="dlv-driver-teaser__link dlv-driver-teaser__link--muted link-motion">
              {data.portalLink.label}
            </Link>
          </div>
          <p className="dlv-driver-teaser__legal">{data.legalNotice}</p>
        </div>
        <figure className="dlv-driver-teaser__figure editorial-media">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1023px) 100vw, 40vw"
            className="dlv-driver-teaser__img editorial-media__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </section>
  );
}
