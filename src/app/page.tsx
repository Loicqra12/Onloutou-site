import { homeMetadata } from "@/app/home-metadata";
import { AboutPreviewSection } from "@/components/sections/AboutPreviewSection";
import { ContactCtaSection } from "@/components/sections/ContactCtaSection";
import { FleetPreviewSection } from "@/components/sections/FleetPreviewSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InstitutionalLogoBand } from "@/components/sections/InstitutionalLogoBand";
import { HomeEquipmentMosaic } from "@/components/sections/HomeEquipmentMosaic";
import { HomeInstallationSection } from "@/components/sections/HomeInstallationSection";
import { RecognitionHomePreview } from "@/components/recognitions/RecognitionHomePreview";
import { HomeProjectsSection } from "@/components/sections/HomeProjectsSection";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { HomeUniverses } from "@/components/sections/HomeUniverses";

export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InstitutionalLogoBand />
      <HomeUniverses />
      <HomeEquipmentMosaic />
      <FleetPreviewSection />
      <HomeInstallationSection />
      <PlatformSection />
      <HomeProjectsSection />
      <RecognitionHomePreview />
      <AboutPreviewSection />
      <ContactCtaSection />
    </>
  );
}
