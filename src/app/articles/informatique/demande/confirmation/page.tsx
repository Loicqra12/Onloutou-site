import type { Metadata } from "next";
import { InfConfirmation } from "@/components/informatique/InfConfirmation";
import { INF_CONFIRMATION_PATH, INF_FAMILY_LABEL, INF_ROOT, infBreadcrumbJsonLd } from "@/content/informatique";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Demande enregistrée — Informatique",
  description: "Votre demande de location informatique a été enregistrée.",
  path: INF_CONFIRMATION_PATH,
});

export default function InformatiqueConfirmationPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="inf-confirm-breadcrumb-jsonld"
        build={(base) =>
          infBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: INF_FAMILY_LABEL, path: INF_ROOT },
            { name: "Demande enregistrée", path: INF_CONFIRMATION_PATH },
          ])
        }
      />
      <InfConfirmation />
    </>
  );
}