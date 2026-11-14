import type { Metadata } from "next";
import { InfDemande } from "@/components/informatique/InfDemande";
import { INF_DEMANDE_PATH, INF_FAMILY_LABEL, INF_ROOT, infBreadcrumbJsonLd } from "@/content/informatique";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ma demande de location informatique",
  description: "Vérifiez vos articles, votre commune, vos dates et envoyez votre demande de location ONLOUTOU.",
  path: INF_DEMANDE_PATH,
});

export default function InformatiqueDemandePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="inf-demande-breadcrumb-jsonld"
        build={(base) =>
          infBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: INF_FAMILY_LABEL, path: INF_ROOT },
            { name: "Ma demande de location", path: INF_DEMANDE_PATH },
          ])
        }
      />
      <InfDemande />
    </>
  );
}