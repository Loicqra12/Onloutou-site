import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalPageHero } from "@/components/legal/LegalPageHero";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import {
  privacyDraftBanner,
  privacyPolicyBreadcrumb,
  privacyPolicyBreadcrumbJsonLd,
  privacyPolicyIsIndexable,
  privacyPolicySeo,
  privacyPolicyStatus,
  privacyTocSections,
} from "@/content/privacy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...privacyPolicySeo,
  path: "/confidentialite",
  robots: privacyPolicyIsIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: true },
});

export default function ConfidentialitePage() {
  return (
    <>
      <JsonLdFromSiteUrl id="privacy-policy-breadcrumb-jsonld" build={privacyPolicyBreadcrumbJsonLd} />
      <LegalPageHero
        breadcrumb={privacyPolicyBreadcrumb}
        eyebrow="PROTECTION DES DONNÉES"
        title="Politique de confidentialité"
        intro="Cette politique explique quelles informations peuvent être traitées lors de l’utilisation du site ONLOUTOU, pour quelles finalités et selon quelles modalités."
        status={privacyPolicyStatus}
        statusBanner={privacyDraftBanner}
      />
      <div className="leg-layout section-spacing bg-brand-paper">
        <div className="container-content leg-layout__grid">
          <LegalTableOfContents
            sections={privacyTocSections}
            ariaLabel="Sommaire de la politique de confidentialité"
          />
          <PrivacyPolicyContent />
        </div>
      </div>
    </>
  );
}
