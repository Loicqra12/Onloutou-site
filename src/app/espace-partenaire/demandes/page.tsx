import type { Metadata } from "next";
import { PartnerDemandList } from "@/components/partners/PartnerDemandList";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Demandes", robots: { index: false, follow: false } };

export default function PartnerDemandesPage() {
  return (
    <PartnerSpaceShell>
      <PartnerDemandList />
    </PartnerSpaceShell>
  );
}
