import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalNoticeContent } from "@/components/legal/LegalNoticeContent";
import { LegalPageHero } from "@/components/legal/LegalPageHero";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import {
  legalDraftBanner,
  legalNoticeBreadcrumb,
  legalNoticeBreadcrumbJsonLd,
  legalNoticeIsIndexable,
  legalNoticeSeo,
  legalNoticeStatus,
  legalTocSections,
} from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...legalNoticeSeo,
  path: "/mentions-legales",
  robots: legalNoticeIsIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: true },
});

export default function MentionsLegalesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="legal-notice-breadcrumb-jsonld" build={legalNoticeBreadcrumbJsonLd} />
      <LegalPageHero
        breadcrumb={legalNoticeBreadcrumb}
        eyebrow="INFORMATIONS JURIDIQUES"
        title="Mentions légales"
        intro="Cette page rassemble les informations relatives à l’édition, à l’hébergement et à l’utilisation du site ONLOUTOU."
        status={legalNoticeStatus}
        statusBanner={legalDraftBanner}
      />
      <div className="leg-layout section-spacing bg-brand-paper">
        <div className="container-content leg-layout__grid">
          <LegalTableOfContents
            sections={legalTocSections}
            ariaLabel="Sommaire des mentions légales"
          />
          <LegalNoticeContent />
        </div>
      </div>
    </>
  );
}
