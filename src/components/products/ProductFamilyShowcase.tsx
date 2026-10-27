import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { productIllustrativeCaption, productsFamiliesSection } from "@/content/products-page";

export function ProductFamilyShowcase() {
  const data = productsFamiliesSection;

  return (
    <section
      id={data.id}
      className="prd-families section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="prd-families-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="prd-families-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <ol className="prd-families__list">
          {data.families.map((family, index) => (
            <Reveal
              key={family.number}
              delay={index * 50}
              as="li"
              className={`prd-families__item${index % 2 === 1 ? " prd-families__item--reverse" : ""}`}
            >
              {family.image && (
                <figure className="prd-families__media editorial-media">
                  <Image
                    src={family.image.src}
                    alt={family.image.alt}
                    width={family.image.width}
                    height={family.image.height}
                    sizes="(max-width: 1023px) 100vw, 46vw"
                    className="prd-families__img editorial-media__img"
                    style={{ objectPosition: family.image.objectPosition }}
                  />
                  <figcaption className="prd-families__caption">{productIllustrativeCaption}</figcaption>
                </figure>
              )}
              <div className="prd-families__copy">
                <span className="prd-families__num" aria-hidden>{family.number}</span>
                <h3 className="font-display text-2xl font-extrabold">{family.title}</h3>
                {family.subfamilies.length > 0 && (
                  <ul className="prd-families__sub">
                    {family.subfamilies.map((sub) => (
                      <li key={sub}>{sub}</li>
                    ))}
                  </ul>
                )}
                <p className="prd-families__usage-label">Usages typiques</p>
                <ul className="prd-families__usages">
                  {family.usages.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
                {family.notice && <p className="prd-families__notice">{family.notice}</p>}
                <div className="prd-families__links">
                  <Link href={family.href} className="prd-families__detail link-motion">
                    Voir la famille détaillée
                  </Link>
                  {family.extraLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="prd-families__extra link-motion">
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href={`#demande-produit`}
                    className="prd-families__request link-motion"
                    data-family={family.requestFamily}
                  >
                    Demander une proposition
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
