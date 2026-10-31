import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { BazarArchiveSection } from "@/components/projects/BazarArchiveSection";
import { FieldMethodStory } from "@/components/projects/FieldMethodStory";
import { ProjectBriefBuilder } from "@/components/projects/ProjectBriefBuilder";
import { ProjectDeliverables } from "@/components/projects/ProjectDeliverables";
import { ProjectDomainsShowcase } from "@/components/projects/ProjectDomainsShowcase";
import { ProjectFramingSection } from "@/components/projects/ProjectFramingSection";
import { ProjectMethodHub } from "@/components/projects/ProjectMethodHub";
import { ProjectScope } from "@/components/projects/ProjectScope";
import { ProjectsDimensionsBand } from "@/components/projects/ProjectsDimensionsBand";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  projectsBreadcrumbJsonLd,
  projectsCollectionJsonLd,
  projectsConfidentiality,
  projectsEditorialNotice,
  projectsFinalCta,
  projectsFaq,
  projectsMedia,
  projectsSeo,
} from "@/content/projects-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...projectsSeo,
  path: "/projets",
  openGraphImages: [{ url: projectsMedia.reunion.src, alt: projectsMedia.reunion.alt }],
});

export default function ProjetsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="projects-breadcrumb-jsonld" build={projectsBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="projects-collection-jsonld" build={projectsCollectionJsonLd} />

      <ProjectsHero />
      <ProjectsDimensionsBand />
      {/* Ancres de domaine : data-anchor-target = cible visible à aligner (carte empilée en mobile, sinon la section). */}
      <div id="plateformes" data-anchor-target="[data-domain=platforms]|#domaines-projets" aria-hidden />
      <div id="mobilite" data-anchor-target="[data-domain=mobility]|#domaines-projets" aria-hidden />
      <div id="supervision" data-anchor-target="[data-domain=fleet]|#domaines-projets" aria-hidden />
      <ProjectDomainsShowcase />
      <ProjectFramingSection />
      <BazarArchiveSection />
      <FieldMethodStory />
      <ProjectScope />
      <ProjectDeliverables />

      <section className="proj-confidential section-spacing bg-brand-white" aria-labelledby="proj-confidential-title">
        <div className="container-content max-w-3xl">
          <h2 id="proj-confidential-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {projectsConfidentiality.title}
          </h2>
          <p className="proj-confidential__lead">{projectsConfidentiality.lead}</p>
          <ul className="proj-confidential__list">
            {projectsConfidentiality.exclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <ProjectMethodHub />
      <ProjectBriefBuilder />

      <ServiceFaq items={projectsFaq} />

      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice title="Notice éditoriale">{projectsEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <section className="proj-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="proj-final-title">
        <div className="container-content proj-final__inner">
          <Reveal>
            <h2 id="proj-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              {projectsFinalCta.titleBefore}
              <HighlightedText surface="dark">{projectsFinalCta.titleHighlight}</HighlightedText>
              {projectsFinalCta.titleAfter}
            </h2>
            <p className="proj-final__lead">{projectsFinalCta.lead}</p>
            <div className="proj-final__actions">
              <Button href={projectsFinalCta.primary.href} variant="primary">
                {projectsFinalCta.primary.label}
              </Button>
              <a href={projectsFinalCta.secondary.href} className="proj-final__secondary link-motion">
                {projectsFinalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
