import Image from "next/image";
import { partnersMedia, partnersVerification } from "@/content/partners-page";

export function PartnersVerification() {
  const photo = partnersMedia.stand;

  return (
    <section className="partners-verify section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="partners-verify-title">
      <div className="container-content partners-verify__grid">
        <figure className="partners-verify__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 100vw, 480px"
            className="partners-verify__img"
            style={{ objectPosition: photo.objectPosition }}
          />
          <figcaption>{photo.caption}</figcaption>
        </figure>
        <div className="partners-verify__copy">
          <h2 id="partners-verify-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {partnersVerification.title}
          </h2>
          <ul className="partners-verify__list">
            {partnersVerification.items.map((item, index) => (
              <li key={item}>
                <span className="partners-verify__index" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="partners-verify__note">{partnersVerification.note}</p>
        </div>
      </div>
    </section>
  );
}
