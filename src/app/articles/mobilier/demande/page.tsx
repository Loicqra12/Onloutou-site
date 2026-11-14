import type { Metadata } from "next";
import { MobDemande } from "@/components/mobilier/MobDemande";
import { MOB_DEMANDE_PATH, MOB_FAMILY_LABEL, MOB_ROOT, mobBreadcrumbJsonLd } from "@/content/mobilier";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ma demande de location mobilier",
  description: "Vérifiez vos articles, votre commune, vos dates et envoyez votre demande de location ONLOUTOU.",
  path: MOB_DEMANDE_PATH,
});

export default function MobilierDemandePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-demande-breadcrumb-jsonld"
        build={(base) =>
          mobBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: MOB_FAMILY_LABEL, path: MOB_ROOT },
            { name: "Ma demande de location", path: MOB_DEMANDE_PATH },
          ])
        }
      />
      <MobDemande />
    </>
  );
}