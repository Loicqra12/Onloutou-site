import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  connectedEquipmentBreadcrumb,
  connectedEquipmentHero,
  connectedEquipmentMedia,
} from "@/content/connected-equipment-page";

export function ConnectedEquipmentHero() {
  const photo = connectedEquipmentMedia.heroInstall;

  return (
    <section className="cec-hero bg-brand-charcoal text-brand-white" aria-labelledby="cec-hero-title">
      <div className="cec-hero__inner container-content">
        <div className="cec-hero__copy">
          <Breadcrumb items={connectedEquipmentBreadcrumb} />
          <p className="partners-eyebrow">{connectedEquipmentHero.eyebrow}</p>
          <h1 id="cec-hero-title" className="cec-hero__title font-display font-extrabold tracking-tight text-balance">
            {connectedEquipmentHero.titleBefore}
            <HighlightedText surface="dark">{connectedEquipmentHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="cec-hero__intro">{connectedEquipmentHero.intro}</p>
          <div className="cec-hero__actions">
            <Button href={connectedEquipmentHero.primaryCta.href} variant="primary">
              {connectedEquipmentHero.primaryCta.label}
            </Button>
            <a href={connectedEquipmentHero.secondaryCta.href} className="cec-hero__secondary link-motion">
              {connectedEquipmentHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={60} className="cec-hero__visual">
          <figure className="cec-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="cec-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <div className="cec-hero__panel" aria-label="Chaîne illustrative">
              <ol className="cec-hero__chain">
                {connectedEquipmentHero.chain.map((node, index) => (
                  <li key={node}>
                    <span>{node}</span>
                    {index < connectedEquipmentHero.chain.length - 1 && (
                      <span className="cec-hero__wire" aria-hidden />
                    )}
                  </li>
                ))}
              </ol>
              <p className="cec-hero__chain-note">{connectedEquipmentHero.chainDisclaimer}</p>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
