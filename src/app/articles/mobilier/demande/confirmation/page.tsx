import type { Metadata } from "next";
import { MobConfirmation } from "@/components/mobilier/MobConfirmation";
import { MOB_CONFIRMATION_PATH, MOB_FAMILY_LABEL, MOB_ROOT, mobBreadcrumbJsonLd } from "@/content/mobilier";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Demande enregistrée — Mobilier",
  description: "Votre demande de location mobilier a été enregistrée.",
  path: MOB_CONFIRMATION_PATH,
});

export default function MobilierConfirmationPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-confirm-breadcrumb-jsonld"
        build={(base) =>
          mobBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: MOB_FAMILY_LABEL, path: MOB_ROOT },
            { name: "Demande enregistrée", path: MOB_CONFIRMATION_PATH },
          ])
        }
      />
      <MobConfirmation />
    </>
  );
}