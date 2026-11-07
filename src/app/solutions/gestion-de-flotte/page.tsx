import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { FlxFaq } from "@/components/fleet/redesign/FlxFaq";
import { FlxHero } from "@/components/fleet/redesign/FlxHero";
import {
  FlxCta,
  FlxCycle,
  FlxDeploy,
  FlxExplore,
  FlxFeatures,
  FlxPilotage,
  FlxReporting,
  FlxUsages,
} from "@/components/fleet/redesign/FlxSections";
import { FlxTeams } from "@/components/fleet/redesign/FlxTeams";
import {
  fleetBreadcrumbJsonLd,
  fleetManagementSeo,
  fleetServiceJsonLd,
} from "@/content/fleet-management-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/fleet-page.css";

export const metadata = createPageMetadata({ ...fleetManagementSeo, path: "/solutions/gestion-de-flotte" });

export default function FleetManagementPage() {
  return (
    <div className="flx-page">
      <JsonLdFromSiteUrl id="fleet-breadcrumb-jsonld" build={fleetBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="fleet-service-jsonld" build={fleetServiceJsonLd} />

      <FlxHero />
      <FlxPilotage />
      <FlxTeams />
      <FlxCycle />
      <FlxFeatures />
      <FlxUsages />
      <FlxReporting />
      <FlxDeploy />
      <FlxFaq />
      <FlxCta />
      <FlxExplore />
    </div>
  );
}
