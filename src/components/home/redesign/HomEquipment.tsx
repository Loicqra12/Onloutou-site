import Image from "next/image";
import Link from "next/link";
import { homEquipment, homIds } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomEquipment() {
  return (
    <section id={homIds.equipment} data-section="equipment" className="hom-equip" aria-labelledby="hom-equip-title">
      <div className="hom-wrap">
        <header className="hom-head hom-head--center">
          <div>
            <p className="hom-eyebrow">{homEquipment.eyebrow}</p>
            <h2 id="hom-equip-title" className="hom-h2 hom-h2--xl">
              {homEquipment.title}
            </h2>
          </div>
          <Link href={homEquipment.link.href} className="hom-link">
            {homEquipment.link.label}
            <HomIcon name="arrowUpRight" className="hom-link__icon" />
          </Link>
        </header>

        <div className="hom-equip__grid">
          {homEquipment.tiles.map((tile) => (
            <figure key={tile.id} className={`hom-equip__tile hom-equip__tile--${tile.id}`}>
              <Image
                src={tile.src}
                alt={tile.alt}
                width={tile.width}
                height={tile.height}
                sizes="(max-width: 700px) 100vw, 50vw"
                className="hom-equip__img"
                style={{ objectPosition: tile.position }}
              />
              <figcaption className="hom-equip__caption">{tile.title}</figcaption>
            </figure>
          ))}
        </div>

        <ul className="hom-equip__links" aria-label="Familles d’équipements">
          {homEquipment.quickLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <Link href={homEquipment.request.href} className="hom-equip__request">
          <span>{homEquipment.request.prefix}</span>
          <span className="hom-equip__request-link">
            {homEquipment.request.label}
            <HomIcon name="arrowUpRight" className="hom-link__icon" />
          </span>
        </Link>
      </div>
    </section>
  );
}