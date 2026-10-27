import Image from "next/image";
import {
  connectedEquipmentMedia,
  connectedInstallationStory,
} from "@/content/connected-equipment-page";

const imageByKey = {
  installBerline: connectedEquipmentMedia.installBerline,
  installTraceur: connectedEquipmentMedia.installTraceur,
  inspectCabling: connectedEquipmentMedia.inspectCabling,
};

export function InstallationStory() {
  const data = connectedInstallationStory;

  return (
    <section className="cec-install section-spacing bg-brand-paper" aria-labelledby="cec-install-title">
      <div className="container-content">
        <h2 id="cec-install-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="cec-install__sequence">
          {data.phases.map((phase) => {
            const media = phase.imageKey ? imageByKey[phase.imageKey] : null;
            const showImage = phase.key !== "handover" && media;
            return (
              <li key={phase.key} className="cec-install__phase">
                <div className="cec-install__copy">
                  <h3>{phase.title}</h3>
                  <ul>
                    {phase.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
                {showImage && (
                  <figure className="cec-install__figure">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="(max-width: 767px) 100vw, 360px"
                      className="cec-install__img"
                      style={{ objectPosition: "objectPosition" in media ? media.objectPosition : undefined }}
                    />
                  </figure>
                )}
              </li>
            );
          })}
        </ol>
        <p className="cec-install__notice">{data.notice}</p>
      </div>
    </section>
  );
}
