import type { Metadata } from "next";
import { JsonLd, JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { HelpArticleList } from "@/components/help/HelpArticleList";
import { HelpCategoryNavigation } from "@/components/help/HelpCategoryNavigation";
import { HelpCenterHero } from "@/components/help/HelpCenterHero";
import { HelpCenterProvider } from "@/components/help/HelpCenterProvider";
import { HelpContactBand } from "@/components/help/HelpContactBand";
import { HelpPopularQuestions } from "@/components/help/HelpPopularQuestions";
import {
  helpCenterBreadcrumbJsonLd,
  helpCenterFaqJsonLd,
  helpCenterSeo,
} from "@/content/help-center";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...helpCenterSeo,
  path: "/aide",
});

export default function AidePage() {
  return (
    <>
      <JsonLdFromSiteUrl id="help-breadcrumb-jsonld" build={helpCenterBreadcrumbJsonLd} />
      <JsonLd id="help-faq-jsonld" data={helpCenterFaqJsonLd()} />
      <HelpCenterProvider>
        <div className="hlp-page">
        <HelpCenterHero />
        <HelpPopularQuestions />
        <div className="hlp-layout section-spacing bg-brand-paper">
          <div className="container-content hlp-layout__grid">
            <HelpCategoryNavigation />
            <HelpArticleList />
          </div>
        </div>
        <HelpContactBand />
        </div>
      </HelpCenterProvider>
    </>
  );
}
