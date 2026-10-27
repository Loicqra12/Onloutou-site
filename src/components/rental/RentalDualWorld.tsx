import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { rentalDualWorld, rentalMedia } from "@/content/rental-page";

export function RentalDualWorld() {
  const mobility = rentalMedia.mobilityWorld;
  const warehouse = rentalMedia.warehouse;

  return (
    <section className="rental-dual section-spacing bg-brand-paper" aria-label="Mobilité et matériels">
      <div className="container-content rental-dual__stack">
        <article className="rental-dual__block rental-dual__block--mobility">
          <Reveal>
            <figure>
              <div className="rental-dual__media rental-dual__media--tall">
                <Image
                  src={mobility.src}
                  alt={mobility.alt}
                  width={mobility.width}
                  height={mobility.height}
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="rental-dual__img"
                  style={{ objectPosition: mobility.objectPosition }}
                />
              </div>
              <figcaption className="rental-dual__caption">{rentalDualWorld.mobility.caption}</figcaption>
            </figure>
          </Reveal>
          <div className="rental-dual__text">
            <h2 className="rental-dual__title">{rentalDualWorld.mobility.title}</h2>
            <p>{rentalDualWorld.mobility.text}</p>
          </div>
        </article>
        <article className="rental-dual__block rental-dual__block--materials">
          <div className="rental-dual__text">
            <h2 className="rental-dual__title">{rentalDualWorld.materials.title}</h2>
            <p>{rentalDualWorld.materials.text}</p>
          </div>
          <Reveal delay={80}>
            <figure>
              <div className="rental-dual__media rental-dual__media--wide">
                <Image
                  src={warehouse.src}
                  alt={warehouse.alt}
                  width={warehouse.width}
                  height={warehouse.height}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="rental-dual__img"
                  style={{ objectPosition: warehouse.objectPosition }}
                />
              </div>
              <figcaption className="rental-dual__caption">{rentalDualWorld.materials.caption}</figcaption>
            </figure>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
