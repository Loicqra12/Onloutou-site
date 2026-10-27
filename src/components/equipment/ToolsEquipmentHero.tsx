import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import {
  toolsEquipmentBreadcrumb,
  toolsEquipmentHero,
  toolsEquipmentHeroCartouche,
  toolsEquipmentMedia,
} from "@/content/tools-equipment-page";

export function ToolsEquipmentHero() {
  const photo = toolsEquipmentMedia.hero;

  return (
    <section className="tem-hero bg-brand-charcoal text-brand-white" aria-labelledby="tem-hero-title">
      <div className="tem-hero__inner container-content">
        <div className="tem-hero__copy">
          <Breadcrumb items={toolsEquipmentBreadcrumb} />
          <p className="partners-eyebrow">{toolsEquipmentHero.eyebrow}</p>
          <h1 id="tem-hero-title" className="tem-hero__title font-display font-extrabold tracking-tight text-balance">
            {toolsEquipmentHero.titleBefore}
            <HighlightedText surface="dark">{toolsEquipmentHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="tem-hero__intro">{toolsEquipmentHero.intro}</p>
          <div className="tem-hero__actions">
            <Button href={toolsEquipmentHero.primaryCta.href} variant="primary">{toolsEquipmentHero.primaryCta.label}</Button>
            <a href={toolsEquipmentHero.secondaryCta.href} className="tem-hero__secondary link-motion">
              {toolsEquipmentHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={60} className="tem-hero__visual">
          <figure className="tem-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="tem-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <aside className="tem-hero__cartouche" aria-label="Repères de sélection">
              <p className="tem-hero__cartouche-title">{toolsEquipmentHeroCartouche.title}</p>
              <ul>
                {toolsEquipmentHeroCartouche.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
