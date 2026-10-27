import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import {
  partnerPortalBreadcrumb,
  partnerPortalHero,
  partnerPortalRealUrl,
  partnerPortalStatus,
} from "@/content/partner-portal-page";

const statusHeadline: Record<string, string | null> = {
  planned: "Espace partenaire à venir",
  "in-development": "Espace partenaire en préparation",
  pilot: "Espace partenaire en phase pilote",
  available: null,
};

export function PartnerPortalHero() {
  const statusLine = statusHeadline[partnerPortalStatus];

  return (
    <section className="epp-hero bg-brand-charcoal text-brand-white" aria-labelledby="epp-hero-title">
      <div className="epp-hero__inner container-content">
        <Breadcrumb items={partnerPortalBreadcrumb} />
        <p className="partners-eyebrow">{partnerPortalHero.eyebrow}</p>
        <p className="epp-hero__badge">{partnerPortalHero.badge}</p>
        {statusLine ? <p className="epp-hero__status">{statusLine}</p> : null}
        <h1 id="epp-hero-title" className="epp-hero__title font-display font-extrabold tracking-tight text-balance">
          {partnerPortalHero.titleBefore}
          <HighlightedText surface="dark">{partnerPortalHero.titleHighlight}</HighlightedText>
        </h1>
        <p className="epp-hero__intro">{partnerPortalHero.intro}</p>
        <div className="epp-hero__actions">
          <Button href={partnerPortalHero.primaryCta.href} variant="primary">{partnerPortalHero.primaryCta.label}</Button>
          <a href={partnerPortalHero.secondaryCta.href} className="epp-hero__secondary link-motion">
            {partnerPortalHero.secondaryCta.label}
          </a>
          {partnerPortalRealUrl ? (
            <Button href={partnerPortalRealUrl} variant="outline">Accéder à mon espace</Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
