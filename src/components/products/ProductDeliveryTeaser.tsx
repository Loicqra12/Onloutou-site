import Link from "next/link";
import { productsDeliveryTeaser } from "@/content/products-page";

export function ProductDeliveryTeaser() {
  const data = productsDeliveryTeaser;

  return (
    <section className="prd-delivery section-spacing bg-brand-white" aria-labelledby="prd-delivery-title">
      <div className="container-content prd-delivery__inner">
        <h2 id="prd-delivery-title" className="font-display text-2xl font-extrabold tracking-tight">
          {data.title}
        </h2>
        <p className="prd-delivery__lead">{data.lead}</p>
        <Link href={data.link.href} className="prd-delivery__link link-motion">{data.link.label}</Link>
      </div>
    </section>
  );
}
