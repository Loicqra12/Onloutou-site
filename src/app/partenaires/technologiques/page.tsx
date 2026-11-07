import type { Metadata } from "next";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { PtnTechBanner, PtnTechDomains, PtnTechHero, PtnTechProcess, PtnTechProposal } from "@/components/partners/redesign/PtnTech";
import { techPage } from "@/content/partners-page";
import { ptnTechFaq } from "@/content/partners-subpages";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";

export const metadata: Metadata = createPageMetadata({ ...techPage.seo, path: "/partenaires/technologiques" });

export default function PartenairesTechnologiquesPage() {
  return (
    <div className="ptn-page">
      <PtnTechHero />
      <PtnTechDomains />
      <PtnTechProcess />
      <PtnTechProposal />
      <PtnTechBanner />
      <PtnFaq content={ptnTechFaq} variant="cards" initialOpen={null} />
    </div>
  );
}