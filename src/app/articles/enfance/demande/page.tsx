import type { Metadata } from "next";
import { EnfDemande } from "@/components/enfance/EnfDemande";
import { ENF_DEMANDE_PATH, ENF_FAMILY_LABEL } from "@/content/enfance";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: `Votre demande — ${ENF_FAMILY_LABEL}`,
  description: "Finalisez votre demande de location Bébé & enfance à Abidjan.",
  path: ENF_DEMANDE_PATH,
});

export default function EnfDemandePage() {
  return <EnfDemande />;
}
