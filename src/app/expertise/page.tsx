import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { ExpFaq } from "@/components/expertise/redesign/ExpFaq";
import { ExpFinal } from "@/components/expertise/redesign/ExpFinal";
import { ExpHero } from "@/components/expertise/redesign/ExpHero";
import { ExpMethod } from "@/components/expertise/redesign/ExpMethod";
import { ExpSectors } from "@/components/expertise/redesign/ExpSectors";
import { ExpServices } from "@/components/expertise/redesign/ExpServices";
import { expertiseSeo } from "@/content/expertise-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/expertise-page.css";

export const metadata: Metadata = createPageMetadata({ ...expertiseSeo, path: "/expertise" });

export default function ExpertisePage() {
  return (
    <div className="exp-page">
      <PageReveal root=".exp-page" targets=".exp-cards > li, .exp-sectors__grid > li, .exp-steps > li" />
      {/* Écran 1 — Introduction */}
      <ExpHero />
      <ExpSectors />
      {/* Écran 2 — Prestations */}
      <ExpServices />
      {/* Écran 3 — Méthode et contact */}
      <ExpMethod />
      <ExpFaq />
      <ExpFinal />
    </div>
  );
}