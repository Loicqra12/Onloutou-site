import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { ContactCtaBand } from "@/components/ui/ContactCtaBand";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { SectorCard } from "@/components/ui/SectorCard";
import {
  expertiseContact,
  expertiseHero,
  expertiseSeo,
  historicalReferences,
  interventionSectors,
  prestationTypes,
  projectApproachPhases,
  tenderSection,
} from "@/content/expertise-page";

export const metadata: Metadata = createPageMetadata({ ...expertiseSeo, path: "/expertise" });

export default function ExpertisePage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Expertise" },
        ]}
        title={
          <>
            Une expertise adaptée aux{" "}
            <HighlightedText tone="on-dark">opérations critiques</HighlightedText>
          </>
        }
        description={expertiseHero.description}
        primaryCta={{ label: "Parler à un expert", href: "/contact" }}
        secondaryCta={{ label: "Découvrir nos solutions", href: "/solutions" }}
      />

      <section className="section-spacing">
        <div className="container-content">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
            Domaines d’intervention
          </h2>
          <p className="mt-3 max-w-2xl text-brand-muted">
            Des contextes exigeants, des contraintes terrain et des exigences de traçabilité.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {interventionSectors.map((sector) => (
              <SectorCard
                key={sector.id}
                tag={sector.tag}
                title={sector.title}
                points={sector.points}
                highlight={sector.highlight}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="installation" className="section-spacing scroll-mt-28 bg-brand-paper">
        <div className="container-content">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Types de prestations
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prestationTypes.map((item) => (
              <li
                key={item}
                className="rounded-[var(--radius-card)] border border-brand-border bg-brand-white px-4 py-3 text-sm font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessTimeline
        id="approche"
        title="Approche projet"
        description="Une conduite de projet orientée validation, recette et transfert aux équipes client."
        phases={projectApproachPhases}
      />

      <section className="section-spacing">
        <div className="container-content">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            {historicalReferences.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-brand-muted">
            {historicalReferences.disclaimer}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {historicalReferences.names.map((name) => (
              <strong
                key={name}
                className="font-display text-sm tracking-wide text-brand-ink"
              >
                {name}
              </strong>
            ))}
          </div>
          <p className="mt-5 max-w-2xl text-sm text-brand-muted">
            {historicalReferences.comoeNote}
          </p>
        </div>
      </section>

      <section id="formation" className="section-spacing scroll-mt-28 bg-brand-charcoal text-white">
        <div className="container-content">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            {tenderSection.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[#cccccc]">{tenderSection.description}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {tenderSection.points.map((point) => (
              <li
                key={point}
                className="rounded-[var(--radius-card)] border border-[#333333] bg-[#171717] px-4 py-3 text-sm"
              >
                ↗ {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-4 pt-8">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Périmètre">
            Les fonctionnalités et niveaux de service sont définis dans chaque contrat selon le
            besoin retenu.
          </EditorialNotice>
        </div>
      </section>

      <ContactCtaBand
        id={expertiseContact.id}
        title={expertiseContact.title}
        description={expertiseContact.description}
        secondaryLink={{ label: "Parcourir nos solutions", href: "/solutions" }}
      />
    </>
  );
}
