import type { Metadata } from "next";
import { PartnerRevenueDetail } from "@/components/partners/PartnerRevenueDetail";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Revenu", robots: { index: false, follow: false } };

export default async function PartnerRevenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PartnerSpaceShell>
      <PartnerRevenueDetail revenueId={id} />
    </PartnerSpaceShell>
  );
}
