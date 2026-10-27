import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { driverPartnerFinalCta } from "@/content/driver-partner-page";

export function DriverPartnerFinalCta() {
  const data = driverPartnerFinalCta;

  return (
    <section className="drv-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="drv-final-title">
      <div className="container-content drv-final__inner">
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <h2 id="drv-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="drv-final__lead">{data.lead}</p>
        <div className="drv-final__actions">
          <Button href={data.primary.href} variant="primary">{data.primary.label}</Button>
          <Link href={data.secondary.href} className="drv-final__secondary link-motion">{data.secondary.label}</Link>
          <Link href={data.partnerLink.href} className="drv-final__tertiary link-motion">{data.partnerLink.label}</Link>
        </div>
        <Link href={data.portalLink.href} className="drv-final__tertiary link-motion">{data.portalLink.label}</Link>
      </div>
    </section>
  );
}
