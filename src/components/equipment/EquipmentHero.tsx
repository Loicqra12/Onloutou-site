import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentBreadcrumb, equipmentHubHero, equipmentHubMedia } from "@/content/equipment-page";

export function EquipmentHero() {
  const photo = equipmentHubMedia.heroMenu;

  return (
    <section className="equip-hero bg-brand-charcoal text-brand-white" aria-labelledby="equip-hero-title">
      <span className="equip-hero__accent" aria-hidden />
      <div className="equip-hero__inner container-content">
        <div className="equip-hero__copy">
          <Breadcrumb items={equipmentBreadcrumb} />
          <p className="equip-eyebrow">{equipmentHubHero.eyebrow}</p>
          <h1 id="equip-hero-title" className="equip-hero__title font-display font-extrabold tracking-tight text-balance">
            {equipmentHubHero.titleBefore}
            <HighlightedText surface="dark">{equipmentHubHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="equip-hero__intro">{equipmentHubHero.intro}</p>
          <p className="equip-hero__caveat">{equipmentHubHero.caveat}</p>
          <div className="equip-hero__actions">
            <Button href={equipmentHubHero.primaryCta.href} variant="primary">
              {equipmentHubHero.primaryCta.label}
            </Button>
            <a href={equipmentHubHero.secondaryCta.href} className="equip-hero__secondary link-motion">
              {equipmentHubHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={80} className="equip-hero__visual">
          <figure className="equip-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="equip-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
