import type { Metadata } from "next";
import { PartnerRevenueList } from "@/components/partners/PartnerRevenueList";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Revenus", robots: { index: false, follow: false } };

export default function PartnerRevenuesPage() {
  return (
    <PartnerSpaceShell>
      <PartnerRevenueList />
    </PartnerSpaceShell>
  );
}
