import type { Metadata } from "next";
import { PartnerDemandReply } from "@/components/partners/PartnerDemandReply";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Répondre à une demande", robots: { index: false, follow: false } };

export default async function PartnerDemandReplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PartnerSpaceShell>
      <PartnerDemandReply demandId={id} />
    </PartnerSpaceShell>
  );
}
