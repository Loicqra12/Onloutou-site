import Image from "next/image";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { FleetCapabilities } from "@/components/fleet/FleetCapabilities";
import { FleetDashboardViews } from "@/components/fleet/FleetDashboardViews";
import { FleetDeployment } from "@/components/fleet/FleetDeployment";
import { FleetManagementHero } from "@/components/fleet/FleetManagementHero";
import { OperationsCommandCenter } from "@/components/fleet/OperationsCommandCenter";
import { OperationalDay } from "@/components/fleet/OperationalDay";
import { TeamViews } from "@/components/fleet/TeamViews";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  fleetBreadcrumbJsonLd,
  fleetEditorialNotice,
  fleetFaq,
  fleetFinalCta,
  fleetManagementMedia,
  fleetManagementSeo,
  fleetOperationalBand,
  fleetReporting,
  fleetServiceJsonLd,
  fleetTerrain,
} from "@/content/fleet-management-page";
import { SolutionCompanionLink } from "@/components/ui/SolutionCompanionLink";
import { SolutionCrossLinks } from "@/components/ui/SolutionCrossLinks";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({ ...fleetManagementSeo, path: "/solutions/gestion-de-flotte" });

export default function FleetManagementPage() {
  const driver = fleetManagementMedia.driverPhoto;
  const logistics = fleetManagementMedia.logisticsPhoto;

  return (
    <>
      <JsonLdFromSiteUrl id="fleet-breadcrumb-jsonld" build={fleetBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="fleet-service-jsonld" build={fleetServiceJsonLd} />

      <FleetManagementHero />

      <section className="fleet-band" aria-label="Enjeux opérationnels">
        <div className="container-content fleet-band__inner">
          <ol className="fleet-band__list">
            {fleetOperationalBand.map((label, index) => (
              <Reveal key={label} delay={index * 45} as="li" className="fleet-band__item">
                <span className="fleet-band__num" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                <span>{label}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <OperationsCommandCenter />
      <FleetDashboardViews />
      <OperationalDay />
      <FleetCapabilities />
      <TeamViews />

      <section className="fleet-terrain section-spacing bg-brand-paper" aria-labelledby="fleet-terrain-title">
        <div className="container-content">
          <Reveal>
            <h2 id="fleet-terrain-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {fleetTerrain.title}
            </h2>
          </Reveal>
          <div className="fleet-terrain__layout">
            <figure className="fleet-terrain__primary">
              <div className="fleet-terrain__media">
                <Image
                  src={driver.src}
                  alt={driver.alt}
                  width={driver.width}
                  height={driver.height}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="fleet-terrain__img"
                  style={{ objectPosition: driver.objectPosition }}
                />
              </div>
              <figcaption className="fleet-terrain__caption">Conduite et mobilité professionnelle</figcaption>
            </figure>
            <figure className="fleet-terrain__secondary">
              <div className="fleet-terrain__media">
                <Image
                  src={logistics.src}
                  alt={logistics.alt}
                  width={logistics.width}
                  height={logistics.height}
                  sizes="(max-width: 768px) 100vw, 32vw"
                  className="fleet-terrain__img"
                  style={{ objectPosition: logistics.objectPosition }}
                />
              </div>
              <figcaption className="fleet-terrain__caption">Cour logistique</figcaption>
            </figure>
            <div className="fleet-terrain__copy">
              <p className="fleet-terrain__lead">{fleetTerrain.lead}</p>
              <ul className="fleet-terrain__contexts">
                {fleetTerrain.contexts.map((ctx) => (
                  <li key={ctx}>{ctx}</li>
                ))}
              </ul>
              <p className="fleet-terrain__note">{fleetTerrain.contextNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fleet-report section-spacing bg-brand-white" aria-labelledby="fleet-report-title">
        <div className="container-content fleet-report__layout">
          <div className="fleet-report__copy">
            <h2 id="fleet-report-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {fleetReporting.title}
            </h2>
            <p className="fleet-report__lead">{fleetReporting.lead}</p>
            <ul className="fleet-report__axes">
              {fleetReporting.axes.map((axis) => (
                <li key={axis}>{axis}</li>
              ))}
            </ul>
          </div>
          <div className="fleet-report__viz" role="img" aria-label="Schéma abstrait de catégories de reporting — illustration">
            <p className="fleet-report__viz-label">{fleetReporting.illustrationLabel}</p>
            <div className="fleet-report__viz-bars" aria-hidden>
              <span /><span /><span /><span />
            </div>
            <table className="fleet-report__viz-table">
              <caption className="sr-only">Exemple de structure de rapport, sans données réelles</caption>
              <tbody>
                {fleetReporting.illustrationRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FleetDeployment />

      <SolutionCompanionLink
        title="Données terrain"
        description="Pour l’installation des traceurs, les alertes et le suivi des positions sur vos véhicules et actifs,"
        href="/solutions/geolocalisation"
        linkLabel="voir la géolocalisation"
      />

      <ServiceFaq items={fleetFaq} openFirst />

      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{fleetEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="fleet-final-cta" aria-labelledby="fleet-final-cta-title">
        <div className="container-content fleet-final-cta__inner">
          <h2 id="fleet-final-cta-title" className="fleet-final-cta__title font-display font-extrabold tracking-tight">
            {fleetFinalCta.titleBefore}
            <HighlightedText surface="dark">{fleetFinalCta.titleHighlight}</HighlightedText>
          </h2>
          <p className="fleet-final-cta__lead">{fleetFinalCta.lead}</p>
          <div className="fleet-final-cta__actions">
            <Button href={fleetFinalCta.primary.href} variant="primary">
              {fleetFinalCta.primary.label}
            </Button>
            <a href={fleetFinalCta.secondary.href} className="fleet-final-cta__link link-motion">
              {fleetFinalCta.secondary.label}
            </a>
            <a href={fleetFinalCta.phoneTel} className="fleet-final-cta__phone link-motion">
              {fleetFinalCta.phoneLabel} — {fleetFinalCta.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <SolutionCrossLinks currentHref="/solutions/gestion-de-flotte" />
    </>
  );
}
