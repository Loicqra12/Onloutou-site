import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentHubMedia, equipmentTerrain } from "@/content/equipment-page";

export function EquipmentTerrain() {
  const photo = equipmentHubMedia.warehouse;

  return (
    <section className="equip-terrain section-spacing bg-brand-paper" aria-labelledby="equip-terrain-title">
      <div className="container-content equip-terrain__grid">
        <figure className="equip-terrain__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="equip-terrain__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
        <Reveal className="equip-terrain__copy">
          <h2 id="equip-terrain-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {equipmentTerrain.title}
          </h2>
          <ol className="equip-terrain__groups">
            {equipmentTerrain.groups.map((group, groupIndex) => (
              <li key={group.title}>
                <span className="equip-terrain__group-num" aria-hidden>{groupIndex + 1}</span>
                <div>
                  <h3 className="equip-terrain__group-title">{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <p className="equip-terrain__note">{equipmentTerrain.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
