import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { productsAccessSection } from "@/content/products-page";

export function ProductAccessComparison() {
  const data = productsAccessSection;

  return (
    <section
      id={data.id}
      className="prd-access section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="prd-access-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="prd-access-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <div className="prd-access__grid">
          {data.modes.map((mode, index) => (
            <Reveal
              key={mode.title}
              delay={index * 60}
              as="article"
              className={`prd-access__card prd-access__card--${index + 1}`}
            >
              <h3 className="font-display text-xl font-extrabold">{mode.title}</h3>
              <p className="prd-access__text">{mode.description}</p>
              <Link href={mode.href} className="prd-access__link link-motion">{mode.label}</Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
