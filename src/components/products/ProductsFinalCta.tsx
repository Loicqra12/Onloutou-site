import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { productsFinalCta } from "@/content/products-page";

export function ProductsFinalCta() {
  const data = productsFinalCta;

  return (
    <section className="prd-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="prd-final-title">
      <div className="container-content prd-final__inner">
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <h2 id="prd-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="prd-final__lead">{data.lead}</p>
        <div className="prd-final__actions">
          <Button href={data.primary.href} variant="primary">{data.primary.label}</Button>
          <Link href={data.secondary.href} className="prd-final__secondary link-motion">{data.secondary.label}</Link>
          <Link href={data.contact.href} className="prd-final__tertiary link-motion">{data.contact.label}</Link>
        </div>
      </div>
    </section>
  );
}
