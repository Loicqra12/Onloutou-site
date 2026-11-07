import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { TermsOfUseContent } from "@/components/legal/TermsOfUseContent";
import {
  termsOfUseBreadcrumb,
  termsOfUseBreadcrumbJsonLd,
  termsOfUseIsIndexable,
  termsOfUseLastUpdated,
  termsOfUseSeo,
  termsOfUseTocSections,
} from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...termsOfUseSeo,
  path: "/conditions-utilisation",
  robots: termsOfUseIsIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: true },
});

export default function ConditionsUtilisationPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="terms-of-use-breadcrumb-jsonld" build={termsOfUseBreadcrumbJsonLd} />
      <LegalDocument
        breadcrumb={termsOfUseBreadcrumb}
        title="Conditions d’utilisation"
        intro="Ces conditions décrivent les règles applicables à la consultation et à l’utilisation du site public ONLOUTOU. Elles ne remplacent pas un contrat commercial."
        updatedAt={termsOfUseLastUpdated}
        sections={termsOfUseTocSections}
        tocLabel="Sommaire des conditions d’utilisation"
      >
        <TermsOfUseContent />
      </LegalDocument>
    </>
  );
}
