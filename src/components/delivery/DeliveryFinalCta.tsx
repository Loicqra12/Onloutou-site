import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { deliveryFinalCta } from "@/content/delivery-page";

export function DeliveryFinalCta() {
  const data = deliveryFinalCta;

  return (
    <section className="dlv-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="dlv-final-title">
      <span className="dlv-final__route" aria-hidden />
      <div className="container-content dlv-final__inner">
        <h2 id="dlv-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="dlv-final__lead">{data.lead}</p>
        <div className="dlv-final__actions">
          <Button href={data.primary.href} variant="primary">{data.primary.label}</Button>
          <a href={data.secondary.href} className="dlv-final__secondary link-motion">{data.secondary.label}</a>
          <Link href={data.contact.href} className="dlv-final__tertiary link-motion">{data.contact.label}</Link>
        </div>
      </div>
    </section>
  );
}
