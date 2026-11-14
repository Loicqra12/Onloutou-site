import type { Metadata } from "next";
import { RecDemande } from "@/components/reception/RecDemande";
import { REC_DEMANDE_PATH, REC_FAMILY_LABEL, REC_ROOT, recBreadcrumbJsonLd } from "@/content/reception";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ma demande de location réception",
  description: "Vérifiez vos articles, votre commune, vos dates et envoyez votre demande de location ONLOUTOU.",
  path: REC_DEMANDE_PATH,
});

export default function ReceptionDemandePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-demande-breadcrumb-jsonld"
        build={(base) =>
          recBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: REC_FAMILY_LABEL, path: REC_ROOT },
            { name: "Ma demande de location", path: REC_DEMANDE_PATH },
          ])
        }
      />
      <RecDemande />
    </>
  );
}