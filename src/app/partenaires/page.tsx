import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnBanner, PtnHubHero, PtnProcess, PtnProfiles, PtnSpaces } from "@/components/partners/redesign/PtnHub";
import {
  partnersBreadcrumbJsonLd,
  partnersHubSeo,
  partnersMedia,
  partnersWebPageJsonLd,
} from "@/content/partners-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";

export const metadata: Metadata = createPageMetadata({
  ...partnersHubSeo,
  path: "/partenaires",
  openGraphImages: [{ url: partnersMedia.hero.src, alt: partnersMedia.hero.alt }],
});

export default function PartenairesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="partners-breadcrumb-jsonld" build={partnersBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="partners-webpage-jsonld" build={partnersWebPageJsonLd} />

      <div className="ptn-page">
        <PageReveal root=".ptn-page" targets=".ptn-tiles__grid > li, .ptn-cards > li, .ptn-steps > li, .ptn-sup-grid > li" />
        <PtnHubHero />
        <PtnProfiles />
        <PtnProcess />
        <PtnSpaces />
        <PtnBanner />
      </div>
    </>
  );
}