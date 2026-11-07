import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import {
  privacyPolicyBreadcrumb,
  privacyPolicyBreadcrumbJsonLd,
  privacyPolicyIsIndexable,
  privacyPolicyLastUpdated,
  privacyPolicySeo,
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
      <LegalDocument
        breadcrumb={privacyPolicyBreadcrumb}
        title="Politique de confidentialité"
        intro="Cette politique explique quelles informations peuvent être traitées lors de l’utilisation du site ONLOUTOU, pour quelles finalités et selon quelles modalités."
        updatedAt={privacyPolicyLastUpdated}
        sections={privacyTocSections}
        tocLabel="Sommaire de la politique de confidentialité"
      >
        <PrivacyPolicyContent />
      </LegalDocument>
    </>
  );
}
