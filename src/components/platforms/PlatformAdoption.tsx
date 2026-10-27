import Image from "next/image";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformIcon } from "@/components/platforms/PlatformIcons";
import { customPlatformsAdoption, customPlatformsMedia } from "@/content/custom-platforms-page";

const adoptionIcons = ["map", "users", "docs", "ops", "support", "gear"];

export function PlatformAdoption() {
  const photo = customPlatformsMedia.fieldTraining;

  return (
    <section className="platform-adoption section-spacing" aria-labelledby="platform-adoption-title">
      <div className="container-content platform-adoption__grid">
        <div className="platform-adoption__copy">
          <p className="platform-kicker">Une adoption réussie</p>
          <TitleReveal as="h2" id="platform-adoption-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {customPlatformsAdoption.title}
          </TitleReveal>
          <p className="platform-adoption__lead">{customPlatformsAdoption.lead}</p>
          <ul className="platform-adoption__list">
            {customPlatformsAdoption.points.map((point, index) => (
              <li key={point}>
                <PlatformIcon name={adoptionIcons[index] ?? "ops"} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="platform-adoption__note">{customPlatformsAdoption.trainingNote}</p>
        </div>
        <figure className="platform-adoption__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 100vw, 480px"
            className="platform-adoption__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </section>
  );
}
