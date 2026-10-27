import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import {
  type DriverPortalStatus,
  driverPortalBreadcrumb,
  driverPortalHero,
  driverPortalRealUrl,
  driverPortalStatus,
} from "@/content/driver-portal-page";

const statusHeadline: Record<DriverPortalStatus, string | null> = {
  planned: "Espace livreur en préparation",
  "in-development": "Espace livreur en préparation",
  pilot: "Espace livreur en phase pilote",
  available: null,
};

export function DriverPortalHero() {
  const statusLine = statusHeadline[driverPortalStatus];
  const data = driverPortalHero;
  const primaryHref = driverPortalRealUrl ?? data.primaryCta.href;
  const primaryLabel = driverPortalRealUrl ? "Accéder à mon espace" : data.primaryCta.label;

  return (
    <section className="edl-hero bg-brand-charcoal text-brand-white" aria-labelledby="edl-hero-title">
      <div className="edl-hero__inner container-content">
        <Breadcrumb items={driverPortalBreadcrumb} />
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <p className="edl-hero__badge">{data.badge}</p>
        {statusLine ? <p className="edl-hero__status">{statusLine}</p> : null}
        <h1 id="edl-hero-title" className="edl-hero__title font-display font-extrabold tracking-tight text-balance">
          {data.titleBefore}
          <HighlightedText surface="dark">{data.titleHighlight}</HighlightedText>
        </h1>
        <p className="edl-hero__intro">{data.intro}</p>
        <div className="edl-hero__actions">
          <Button href={primaryHref} variant="primary">{primaryLabel}</Button>
          <a href={data.secondaryCta.href} className="edl-hero__secondary link-motion">{data.secondaryCta.label}</a>
        </div>
        <p className="edl-hero__alt">
          <Link href={data.deliveryLink.href} className="link-motion">{data.deliveryLink.label}</Link>
        </p>
      </div>
    </section>
  );
}
