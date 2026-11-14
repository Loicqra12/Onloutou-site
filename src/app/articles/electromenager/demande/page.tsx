import type { Metadata } from "next";
import { ElmDemande } from "@/components/electromenager/ElmDemande";
import { ELM_DEMANDE_PATH, ELM_FAMILY_LABEL, ELM_ROOT, elmBreadcrumbJsonLd } from "@/content/electromenager";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ma demande de location d'électroménager",
  description: "Vérifiez vos appareils, votre commune, vos dates et envoyez votre demande de location ONLOUTOU.",
  path: ELM_DEMANDE_PATH,
});

export default function ElectromenagerDemandePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="elm-demande-breadcrumb-jsonld"
        build={(base) =>
          elmBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: ELM_FAMILY_LABEL, path: ELM_ROOT },
            { name: "Ma demande de location", path: ELM_DEMANDE_PATH },
          ])
        }
      />
      <ElmDemande />
    </>
  );
}