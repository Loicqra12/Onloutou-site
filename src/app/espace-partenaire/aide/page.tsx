import type { Metadata } from "next";
import { PartnerHelp } from "@/components/partners/PartnerHelp";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Aide", robots: { index: false, follow: false } };

export default function PartnerHelpPage() {
  return (
    <PartnerSpaceShell>
      <PartnerHelp />
    </PartnerSpaceShell>
  );
}
