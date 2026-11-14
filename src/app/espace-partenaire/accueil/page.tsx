import type { Metadata } from "next";
import { PartnerHome } from "@/components/partners/PartnerHome";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Espace partenaire", robots: { index: false, follow: false } };

export default function PartnerAccueilPage() {
  return (
    <PartnerSpaceShell>
      <PartnerHome />
    </PartnerSpaceShell>
  );
}
