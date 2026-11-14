import type { Metadata } from "next";
import { PartnerEntry } from "@/components/partners/PartnerEntry";
import { dpEntry } from "@/content/devenir-partenaire";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...dpEntry.seo,
  path: "/espace-partenaire",
});

export default function EspacePartenairePage() {
  return <PartnerEntry />;
}
