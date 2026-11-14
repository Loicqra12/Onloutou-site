import type { Metadata } from "next";
import { RecConfirmation } from "@/components/reception/RecConfirmation";
import { REC_CONFIRMATION_PATH, REC_FAMILY_LABEL, REC_ROOT, recBreadcrumbJsonLd } from "@/content/reception";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Demande enregistrée — Réception",
  description: "Votre demande de location reception a été enregistrée.",
  path: REC_CONFIRMATION_PATH,
});

export default function ReceptionConfirmationPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-confirm-breadcrumb-jsonld"
        build={(base) =>
          recBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: REC_FAMILY_LABEL, path: REC_ROOT },
            { name: "Demande enregistrée", path: REC_CONFIRMATION_PATH },
          ])
        }
      />
      <RecConfirmation />
    </>
  );
}