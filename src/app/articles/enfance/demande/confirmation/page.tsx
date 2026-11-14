import type { Metadata } from "next";
import { EnfConfirmation } from "@/components/enfance/EnfConfirmation";
import { ENF_CONFIRMATION_PATH, ENF_FAMILY_LABEL } from "@/content/enfance";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: `Demande enregistrée — ${ENF_FAMILY_LABEL}`,
  description: "Votre demande de location Bébé & enfance a été enregistrée.",
  path: ENF_CONFIRMATION_PATH,
});

export default function EnfConfirmationPage() {
  return <EnfConfirmation />;
}
