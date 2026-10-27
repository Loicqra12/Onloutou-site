import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { productsSourcingSection } from "@/content/products-page";

export function ProductSourcingSection() {
  const data = productsSourcingSection;

  return (
    <section className="prd-sourcing section-spacing bg-brand-paper" aria-labelledby="prd-sourcing-title">
      <div className="container-content">
        <Reveal>
          <h2 id="prd-sourcing-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="prd-sourcing__lead">{data.lead}</p>
        </Reveal>
        <ul className="prd-sourcing__principles">
          {data.principles.map((p, i) => (
            <Reveal key={p} delay={i * 40} as="li">{p}</Reveal>
          ))}
        </ul>
        <div className="prd-sourcing__actions">
          <Link href={data.partnersLink.href} className="prd-sourcing__link link-motion">{data.partnersLink.label}</Link>
          <Link href={data.proposeLink.href} className="prd-sourcing__secondary link-motion">{data.proposeLink.label}</Link>
        </div>
      </div>
    </section>
  );
}
