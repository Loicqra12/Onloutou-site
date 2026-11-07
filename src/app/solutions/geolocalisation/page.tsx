import { PageReveal } from "@/components/motion/PageReveal";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { GlxFaq } from "@/components/geolocation/redesign/GlxFaq";
import { GlxHero } from "@/components/geolocation/redesign/GlxHero";
import { GlxPlatform } from "@/components/geolocation/redesign/GlxPlatform";
import { GlxReferences } from "@/components/geolocation/redesign/GlxReferences";
import {
  GlxCta,
  GlxExplore,
  GlxFeatures,
  GlxField,
  GlxInstall,
  GlxPilotage,
  GlxProcess,
  GlxUsages,
} from "@/components/geolocation/redesign/GlxSections";
import {
  geolocationBreadcrumbJsonLd,
  geolocationSeo,
  geolocationServiceJsonLd,
} from "@/content/geolocation-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/geolocation-page.css";

export const metadata = createPageMetadata({ ...geolocationSeo, path: "/solutions/geolocalisation" });

export default function GeolocationPage() {
  return (
    <div className="glx-page">
      <JsonLdFromSiteUrl id="geo-breadcrumb-jsonld" build={geolocationBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="geo-service-jsonld" build={geolocationServiceJsonLd} />

      <PageReveal root=".glx-page" targets=".glx-process__grid > li, .glx-features__grid > li, .glx-usages__grid > li, .glx-references__item, .glx-install__steps > li, .glx-pilotage__box" />
      <GlxHero />
      <GlxField />
      <GlxProcess />
      <GlxPlatform />
      <GlxFeatures />
      <GlxUsages />
      <GlxReferences />
      <GlxInstall />
      <GlxPilotage />
      <GlxFaq />
      <GlxCta />
      <GlxExplore />
    </div>
  );
}
