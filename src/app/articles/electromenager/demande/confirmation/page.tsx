import type { Metadata } from "next";
import { ElmConfirmation } from "@/components/electromenager/ElmConfirmation";
import {
  ELM_CONFIRMATION_PATH,
  ELM_DEMANDE_PATH,
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmBreadcrumbJsonLd,
} from "@/content/electromenager";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Demande de location enregistrée",
  description: "Votre demande de location d'électroménager est enregistrée. Conservez la référence et poursuivez sur WhatsApp si besoin.",
  path: ELM_CONFIRMATION_PATH,
});

export default function ElectromenagerConfirmationPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="elm-confirm-breadcrumb-jsonld"
        build={(base) =>
          elmBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: ELM_FAMILY_LABEL, path: ELM_ROOT },
            { name: "Ma demande de location", path: ELM_DEMANDE_PATH },
            { name: "Demande enregistrée", path: ELM_CONFIRMATION_PATH },
          ])
        }
      />
      <ElmConfirmation />
    </>
  );
}