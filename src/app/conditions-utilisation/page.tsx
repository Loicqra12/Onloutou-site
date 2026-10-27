import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { LegalPageHero } from "@/components/legal/LegalPageHero";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import { TermsOfUseContent } from "@/components/legal/TermsOfUseContent";
import {
  termsDraftBanner,
  termsOfUseBreadcrumb,
  termsOfUseBreadcrumbJsonLd,
  termsOfUseIsIndexable,
  termsOfUseSeo,
  termsOfUseStatus,
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
      <LegalPageHero
        breadcrumb={termsOfUseBreadcrumb}
        eyebrow="UTILISATION DU SITE"
        title="Conditions d’utilisation"
        intro="Ces conditions décrivent les règles applicables à la consultation et à l’utilisation du site public ONLOUTOU. Elles ne remplacent pas un contrat commercial."
        status={termsOfUseStatus}
        statusBanner={termsDraftBanner}
      />
      <div className="leg-layout section-spacing bg-brand-paper">
        <div className="container-content leg-layout__grid">
          <LegalTableOfContents
            sections={termsOfUseTocSections}
            ariaLabel="Sommaire des conditions d’utilisation"
          />
          <TermsOfUseContent />
        </div>
      </div>
    </>
  );
}
