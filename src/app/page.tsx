import { homeMetadata } from "@/app/home-metadata";
import { HomBuild } from "@/components/home/redesign/HomBuild";
import { HomCompany } from "@/components/home/redesign/HomCompany";
import { HomCta } from "@/components/home/redesign/HomCta";
import { HomEquipment } from "@/components/home/redesign/HomEquipment";
import { HomGeo } from "@/components/home/redesign/HomGeo";
import { HomGestures } from "@/components/home/redesign/HomGestures";
import { HomHero } from "@/components/home/redesign/HomHero";
import { HomMethod } from "@/components/home/redesign/HomMethod";
import { HomMotion } from "@/components/home/redesign/HomMotion";
import { HomPartners } from "@/components/home/redesign/HomPartners";
import { HomProjects } from "@/components/home/redesign/HomProjects";
import { HomRecognition } from "@/components/home/redesign/HomRecognition";
import { HomUniverses } from "@/components/home/redesign/HomUniverses";
import "@/styles/home-redesign.css";

export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <div className="hom-page">
      <HomMotion />
      <HomHero />
      <HomPartners />
      <HomUniverses />
      <HomEquipment />
      <HomGeo />
      <HomGestures />
      <HomMethod />
      <HomBuild />
      <HomProjects />
      <HomRecognition />
      <HomCompany />
      <HomCta />
    </div>
  );
}