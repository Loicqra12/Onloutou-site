import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { driverQualitiesSection } from "@/content/driver-partner-page";

export function DriverQualitiesSection() {
  const data = driverQualitiesSection;
  const photo = data.image;

  return (
    <section className="drv-qualities section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="drv-qualities-title">
      <div className="container-content drv-qualities__layout">
        <Reveal className="drv-qualities__media editorial-media">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="drv-qualities__img editorial-media__img"
              style={{ objectPosition: photo.objectPosition }}
            />
          </figure>
        </Reveal>
        <div>
          <Reveal>
            <h2 id="drv-qualities-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {data.title}
            </h2>
          </Reveal>
          <ol className="drv-qualities__list">
            {data.principles.map((item, index) => (
              <li key={item}>
                <span className="drv-qualities__num" aria-hidden>{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <p className="drv-qualities__notice">{data.notice}</p>
        </div>
      </div>
    </section>
  );
}
