import Image from "next/image";
import { equipmentHubMedia, equipmentProcess } from "@/content/equipment-page";

export function EquipmentProcess() {
  const photo = equipmentHubMedia.generator;

  return (
    <section className="equip-process section-spacing bg-brand-white" aria-labelledby="equip-process-title">
      <div className="container-content">
        <h2 id="equip-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {equipmentProcess.title}
        </h2>

        <ol className="equip-process__timeline">
          {equipmentProcess.steps.map((step, index) => (
            <li key={step.title} className={`equip-process__step${index % 2 === 1 ? " equip-process__step--alt" : ""}`}>
              <div className="equip-process__marker" aria-hidden />
              <div className="equip-process__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index === 2 && (
                <figure className="equip-process__figure">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="equip-process__img"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                </figure>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
