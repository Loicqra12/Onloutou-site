import type { Metadata } from "next";
import { PartnerDemandDetail } from "@/components/partners/PartnerDemandDetail";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Demande", robots: { index: false, follow: false } };

export default async function PartnerDemandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PartnerSpaceShell>
      <PartnerDemandDetail demandId={id} />
    </PartnerSpaceShell>
  );
}
