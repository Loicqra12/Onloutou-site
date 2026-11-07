import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LegalNoticeContent } from "@/components/legal/LegalNoticeContent";
import {
  legalNoticeBreadcrumb,
  legalNoticeBreadcrumbJsonLd,
  legalNoticeIsIndexable,
  legalNoticeLastUpdated,
  legalNoticeSeo,
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
      <LegalDocument
        breadcrumb={legalNoticeBreadcrumb}
        title="Mentions légales"
        intro="Cette page rassemble les informations relatives à l’édition, à l’hébergement et à l’utilisation du site ONLOUTOU."
        updatedAt={legalNoticeLastUpdated}
        sections={legalTocSections}
        tocLabel="Sommaire des mentions légales"
      >
        <LegalNoticeContent />
      </LegalDocument>
    </>
  );
}
