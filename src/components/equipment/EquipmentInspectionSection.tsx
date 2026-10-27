import Image from "next/image";
import { toolsEquipmentMedia, toolsInspectionSection } from "@/content/tools-equipment-page";

export function EquipmentInspectionSection() {
  const data = toolsInspectionSection;
  const photo = toolsEquipmentMedia.inspection;

  return (
    <section className="tem-inspection section-spacing bg-brand-white" aria-labelledby="tem-inspection-title">
      <div className="container-content tem-inspection__grid">
        <div>
          <h2 id="tem-inspection-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="tem-inspection__intro">
            L’adéquation d’un matériel dépend notamment de :
          </p>
          <ul className="tem-inspection__list">
            {data.factors.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <aside className="tem-inspection__prudence" role="note">
            <p>{data.prudence}</p>
          </aside>
        </div>
        <figure className="tem-inspection__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 50vw"
            className="tem-inspection__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </section>
  );
}
