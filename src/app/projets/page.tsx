import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PrjBrief } from "@/components/projects/redesign/PrjBrief";
import { PrjDigital } from "@/components/projects/redesign/PrjDigital";
import { PrjFaq } from "@/components/projects/redesign/PrjFaq";
import { PrjFeatured } from "@/components/projects/redesign/PrjFeatured";
import { PrjHero } from "@/components/projects/redesign/PrjHero";
import { PrjInnovations } from "@/components/projects/redesign/PrjInnovations";
import { PrjMissions } from "@/components/projects/redesign/PrjMissions";
import { projectsBreadcrumbJsonLd, projectsCollectionJsonLd, projectsMedia, projectsSeo } from "@/content/projects-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/projects-redesign.css";

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

      <div className="prj-page">
        {/* Écran 1 — présentation et projet existant */}
        <PrjHero />
        <PrjFeatured />
        {/* Écran 2 — réalisations numériques */}
        <PrjDigital />
        {/* Écran 3 — missions terrain */}
        <PrjMissions />
        {/* Écran 4 — innovations et MVP */}
        <PrjInnovations />
        {/* Écran 5 — formulaire, message et FAQ */}
        <PrjBrief />
        <PrjFaq />
      </div>
    </>
  );
}