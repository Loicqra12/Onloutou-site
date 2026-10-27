import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { rentalDualWorld, rentalUseCases } from "@/content/rental-page";

export function RentalUseCases() {
  const featured = rentalUseCases.cases.filter((item) => item.image);
  const extra = rentalUseCases.cases.filter((item) => !item.image);

  return (
    <section className="rental-usecases section-spacing" aria-labelledby="rental-usecases-title">
      <div className="container-content">
        <Reveal className="rental-usecases__intro">
          <h2 id="rental-usecases-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {rentalUseCases.title}
          </h2>
          <p className="rental-usecases__lead">
            {rentalDualWorld.mobility.text}
          </p>
        </Reveal>

        <div className="rental-usecases__mosaic">
          {featured.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className={`rental-usecases__card rental-usecases__card--${index + 1}`}>
              <figure>
                {item.image ? (
                  <div className="rental-usecases__media">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes={index === 0 ? "(max-width: 1023px) 100vw, 48vw" : "(max-width: 1023px) 100vw, 36vw"}
                      className="rental-usecases__img"
                      style={{ objectPosition: item.image.objectPosition }}
                    />
                  </div>
                ) : null}
                <figcaption className="rental-usecases__caption">
                  <span className="rental-usecases__num" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <h3 className="rental-usecases__item-title">{item.title}</h3>
                    <span className="rental-usecases__item-text">{item.description}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {extra.length > 0 ? (
          <ul className="rental-usecases__extra">
            {extra.map((item) => (
              <li key={item.title}>
                <h3 className="rental-usecases__item-title">{item.title}</h3>
                <p className="rental-usecases__item-text">{item.description}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
