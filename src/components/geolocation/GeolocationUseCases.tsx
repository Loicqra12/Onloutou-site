import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { geolocationMedia, geolocationUseCases } from "@/content/geolocation-page";

export function GeolocationUseCases() {
  const photo = geolocationMedia.contextMobility;

  return (
    <section className="geo-usecases section-spacing bg-brand-white" aria-labelledby="geo-usecases-title">
      <div className="container-content geo-usecases__layout">
        <div className="geo-usecases__copy">
          <Reveal>
            <h2 id="geo-usecases-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {geolocationUseCases.title}
            </h2>
            <ul className="geo-usecases__list">
              {geolocationUseCases.cases.map((item) => (
                <li key={item.title}>
                  <h3 className="geo-usecases__item-title">{item.title}</h3>
                  <p className="geo-usecases__item-text">{item.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <figure className="geo-usecases__figure">
            <div className="geo-usecases__media geo-install-story__media--hover">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 100vw, 46vw"
                className="geo-usecases__img"
                style={{ objectPosition: photo.objectPosition }}
              />
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
