import Image from "next/image";
import Link from "next/link";
import { rentalCatalogOriginsBand } from "@/content/bazar-project";
import { rentalMedia } from "@/content/rental-page";

export function RentalCatalogOriginsBand() {
  const photo = rentalMedia.warehouse;

  return (
    <aside
      className="rental-origins-band"
      aria-labelledby="rental-origins-band-title"
      data-historical-archive
    >
      <div className="container-content rental-origins-band__grid">
        <div className="rental-origins-band__copy">
          <p className="rental-origins-band__eyebrow">{rentalCatalogOriginsBand.eyebrow}</p>
          <h2 id="rental-origins-band-title" className="rental-origins-band__title font-display font-extrabold tracking-tight">
            {rentalCatalogOriginsBand.title}
          </h2>
          <p className="rental-origins-band__text">{rentalCatalogOriginsBand.text}</p>
          <Link href={rentalCatalogOriginsBand.linkHref} className="rental-origins-band__link link-motion">
            {rentalCatalogOriginsBand.linkLabel}
            <span aria-hidden> →</span>
          </Link>
        </div>
        <figure className="rental-origins-band__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1023px) 150vw, 70vw"
            className="rental-origins-band__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </aside>
  );
}
