import Image from "next/image";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { customPlatformsEcosystem } from "@/content/custom-platforms-page";

export function ProductEcosystem() {
  return (
    <section
      id="ecosysteme-produit"
      className="platform-ecosystem section-spacing"
      aria-labelledby="platform-ecosystem-title"
    >
      <div className="container-content">
        <p className="platform-kicker platform-kicker--on-dark">Du terrain au numérique</p>
        <TitleReveal as="h2" id="platform-ecosystem-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformsEcosystem.title}
        </TitleReveal>
        <p className="platform-ecosystem__lead">{customPlatformsEcosystem.lead}</p>

        <ol className="platform-ecosystem__photos">
          {customPlatformsEcosystem.dimensions.map((dim) => (
            <li key={dim.title}>
              <figure className="platform-ecosystem__card">
                <div className="platform-ecosystem__media">
                  <Image
                    src={dim.image.src}
                    alt={dim.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="platform-ecosystem__img"
                    style={{ objectFit: "cover", objectPosition: dim.image.objectPosition }}
                  />
                </div>
                <figcaption>
                  <h3 className="platform-ecosystem__dim-title">{dim.title}</h3>
                  <p>{dim.text}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <p className="platform-ecosystem__caption">{customPlatformsEcosystem.caption}</p>
      </div>
    </section>
  );
}
