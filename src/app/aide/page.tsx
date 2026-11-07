import type { Metadata } from "next";
import { HlpCenter } from "@/components/help/redesign/HlpCenter";
import { HlpBand, HlpMedia } from "@/components/help/redesign/HlpSections";
import { JsonLd, JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { helpCenterBreadcrumbJsonLd, helpCenterFaqJsonLd, helpCenterSeo } from "@/content/help-center";
import { buildHlpTopics } from "@/content/help-hub";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/help-redesign.css";

export const metadata: Metadata = createPageMetadata({
  ...helpCenterSeo,
  path: "/aide",
});

export default function AidePage() {
  const topics = buildHlpTopics();
  return (
    <>
      <JsonLdFromSiteUrl id="help-breadcrumb-jsonld" build={helpCenterBreadcrumbJsonLd} />
      <JsonLd id="help-faq-jsonld" data={helpCenterFaqJsonLd()} />
      <div className="hlp-v2">
        <HlpCenter topics={topics} defaultTopicId="location-acquisition" />
        <HlpMedia />
        <HlpBand />
      </div>
    </>
  );
}