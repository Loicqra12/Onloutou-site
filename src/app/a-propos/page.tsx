import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { WestAfricaMap } from "@/components/sections/WestAfricaMap";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { AboutTeamSection } from "@/components/about/AboutTeamSection";
import { WorkPrincipleCard } from "@/components/ui/WorkPrincipleCard";
import { CompanyJourney } from "@/components/company-history/CompanyJourney";
import { HistoricalSupportSection } from "@/components/company-history/HistoricalSupportSection";
import { MediaMentions } from "@/components/company-history/MediaMentions";
import { RecognitionSection } from "@/components/recognitions/RecognitionSection";
import {
  AboutImplantationPhotos,
  AboutInstitutionalIntro,
  AboutStandArchive,
} from "@/components/sections/AboutMediaSections";
import {
  aboutClosingCta,
  aboutHero,
  aboutSeo,
  historicalCountries,
  historicalReferences,
  implantationDisclaimer,
  workPrinciples,
} from "@/content/about-page";

export const metadata: Metadata = createPageMetadata({ ...aboutSeo, path: "/a-propos" });

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "À propos" },
        ]}
        title={
          <>
            Une entreprise ivoirienne à la croisée du{" "}
            <HighlightedText tone="on-dark">terrain et de la technologie</HighlightedText>
          </>
        }
        description={aboutHero.description}
        primaryCta={{ label: "Parler à un expert", href: "/contact" }}
        secondaryCta={{ label: "Explorer notre expertise", href: "/expertise" }}
      />

      <AboutInstitutionalIntro />

      <CompanyJourney />

      <RecognitionSection />

      <HistoricalSupportSection />

      <MediaMentions />

      <AboutStandArchive />

      <section className="section-spacing bg-brand-paper" aria-labelledby="about-principles">
        <div className="container-content">
          <h2 id="about-principles" className="font-display text-3xl font-extrabold tracking-tight">
            Positionnement
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
            Trois axes qui structurent notre manière d’intervenir — présentés ici comme principes de
            travail, et non comme des « valeurs officielles » déclarées par l’entreprise.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workPrinciples.map((principle) => (
              <WorkPrincipleCard
                key={principle.id}
                title={principle.title}
                description={principle.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing" aria-labelledby="about-implantation">
        <div className="container-content grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2
              id="about-implantation"
              className="font-display text-3xl font-extrabold tracking-tight"
            >
              Implantation historique
            </h2>
            <p className="mt-3 text-sm text-brand-muted">
              Quatre pays historiquement déclarés dans le parcours d’ONLOUTOU :
            </p>
            <ul className="mt-4 space-y-2 text-sm font-semibold text-brand-ink">
              {historicalCountries.map((country) => (
                <li key={country}>{country}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-brand-muted">{implantationDisclaimer}</p>
            <AboutImplantationPhotos
              caption="Archives ONLOUTOU — développement de la présence physique et proximité avec les opérations. Ne constitue pas une adresse actuelle publiée."
            />
          </div>
          <div className="rounded-[var(--radius-card)] border border-brand-border bg-brand-charcoal p-6">
            <WestAfricaMap />
          </div>
        </div>
      </section>

      <AboutTeamSection />

      <section className="section-spacing" aria-labelledby="about-references">
        <div className="container-content max-w-2xl">
          <h2
            id="about-references"
            className="font-display text-2xl font-extrabold tracking-tight text-brand-ink"
          >
            {historicalReferences.title}
          </h2>
          <ul className="mt-4 space-y-1 text-sm font-semibold text-brand-ink">
            {historicalReferences.names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            {historicalReferences.disclaimer}
          </p>
        </div>
      </section>

      <section className="section-spacing bg-brand-charcoal text-brand-white">
        <div className="container-content text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Construisons une solution adaptée à votre réalité
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {aboutClosingCta.links.map((link) => (
              <Button key={link.href} href={link.href} variant="primary">
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
