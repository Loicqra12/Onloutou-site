import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { geolocationInstallationStory, geolocationMedia } from "@/content/geolocation-page";

export function FieldInstallationStory() {
  const traceur = geolocationMedia.installTraceur;
  const cablage = geolocationMedia.inspectCabling;
  const berline = geolocationMedia.installBerline;

  return (
    <section
      id="installation-terrain"
      className="geo-install-story section-spacing scroll-mt-20 bg-brand-charcoal text-brand-white"
      aria-labelledby="geo-install-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="geo-install-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {geolocationInstallationStory.title}
          </h2>
        </Reveal>
        <div className="geo-install-story__grid">
          <figure className="geo-install-story__primary">
            <div className="geo-install-story__media geo-install-story__media--hover">
              <Image
                src={traceur.src}
                alt={traceur.alt}
                width={traceur.width}
                height={traceur.height}
                sizes="(max-width: 768px) 100vw, 52vw"
                className="geo-install-story__img"
              />
            </div>
            <figcaption className="geo-install-story__caption">Installation du traceur</figcaption>
          </figure>
          <figure className="geo-install-story__secondary">
            <div className="geo-install-story__media geo-install-story__media--hover">
              <Image
                src={cablage.src}
                alt={cablage.alt}
                width={cablage.width}
                height={cablage.height}
                sizes="(max-width: 768px) 100vw, 42vw"
                className="geo-install-story__img"
              />
            </div>
            <figcaption className="geo-install-story__caption">Contrôle du câblage</figcaption>
          </figure>
          <figure className="geo-install-story__detail" aria-hidden={false}>
            <div className="geo-install-story__media geo-install-story__media--hover geo-install-story__media--detail">
              <Image
                src={berline.src}
                alt=""
                width={berline.width}
                height={berline.height}
                sizes="(max-width: 768px) 40vw, 220px"
                className="geo-install-story__img"
                style={{ objectPosition: "62% 38%" }}
              />
            </div>
            <figcaption className="geo-install-story__caption">Détail d’intervention</figcaption>
          </figure>
          <div className="geo-install-story__timeline">
            <ol className="geo-install-story__steps">
              {geolocationInstallationStory.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
