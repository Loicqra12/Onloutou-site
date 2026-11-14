import type { Metadata } from "next";
import { PartnerLocationDetail } from "@/components/partners/PartnerLocationDetail";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Location", robots: { index: false, follow: false } };

export default async function PartnerLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PartnerSpaceShell>
      <PartnerLocationDetail locationId={id} />
    </PartnerSpaceShell>
  );
}
