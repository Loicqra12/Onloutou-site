import Image from "next/image";
import { toolsEquipmentMedia, toolsReadinessSection } from "@/content/tools-equipment-page";

export function EquipmentReadinessSection() {
  const data = toolsReadinessSection;
  const photo = toolsEquipmentMedia.readiness;

  return (
    <section className="tem-readiness section-spacing bg-brand-paper" aria-labelledby="tem-readiness-title">
      <div className="container-content tem-readiness__grid">
        <figure className="tem-readiness__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 50vw"
            className="tem-readiness__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
        <div>
          <h2 id="tem-readiness-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <ol className="tem-readiness__axes">
            {data.axes.map((axis, index) => (
              <li key={axis}>
                <span className="tem-readiness__axis-num">{index + 1}</span>
                {axis}
              </li>
            ))}
          </ol>
          <p className="tem-readiness__lead">{data.lead}</p>
          <ul className="tem-readiness__bullets">
            {data.bullets.map((b) => (
              <li key={b}>— {b}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
