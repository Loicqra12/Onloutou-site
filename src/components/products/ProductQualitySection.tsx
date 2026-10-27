import Image from "next/image";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { productIllustrativeCaption, productsPageMedia, productsQualitySection } from "@/content/products-page";

export function ProductQualitySection() {
  const data = productsQualitySection;
  const photo = productsPageMedia.qualityWarehouse;

  return (
    <section className="prd-quality section-spacing bg-brand-white" aria-labelledby="prd-quality-title">
      <div className="container-content prd-quality__layout">
        <Reveal className="prd-quality__media editorial-media">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="prd-quality__img editorial-media__img"
              style={{ objectPosition: photo.objectPosition }}
            />
            <figcaption className="prd-quality__caption">{productIllustrativeCaption}</figcaption>
          </figure>
        </Reveal>
        <div>
          <Reveal>
            <h2 id="prd-quality-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {data.title}
            </h2>
          </Reveal>
          <ul className="prd-quality__list">
            {data.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <EditorialNotice>{data.note}</EditorialNotice>
        </div>
      </div>
    </section>
  );
}
