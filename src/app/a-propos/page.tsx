import type { Metadata } from "next";
import { AbtArchives } from "@/components/about/redesign/AbtArchives";
import { AbtBcp } from "@/components/about/redesign/AbtBcp";
import { AbtCanal } from "@/components/about/redesign/AbtCanal";
import { AbtEcosystem } from "@/components/about/redesign/AbtEcosystem";
import { AbtFurther } from "@/components/about/redesign/AbtFurther";
import { AbtHero } from "@/components/about/redesign/AbtHero";
import { AbtHistory, AbtRecognition } from "@/components/about/redesign/AbtHistory";
import { AbtTeam } from "@/components/about/redesign/AbtTeam";
import { aboutSeo } from "@/content/about-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/about-redesign.css";

export const metadata: Metadata = createPageMetadata({ ...aboutSeo, path: "/a-propos" });

export default function AboutPage() {
  return (
    <div className="abt-page">
      {/* Écran 1 — présentation, sous-navigation et reportage Canal */}
      <AbtHero />
      <AbtCanal />
      {/* Écran 2 — histoire, reconnaissance, vidéo BCP et ressources */}
      <AbtHistory />
      <AbtRecognition />
      <AbtBcp />
      <AbtFurther />
      {/* Écran 3 — équipe */}
      <AbtTeam />
      {/* Écran 4 — collaborations et archives */}
      <AbtArchives />
      {/* Écran 5 — écosystème et bandeau final */}
      <AbtEcosystem />
    </div>
  );
}