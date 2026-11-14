import type { Metadata } from "next";
import { PartnerLocationList } from "@/components/partners/PartnerLocationList";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Locations", robots: { index: false, follow: false } };

export default function PartnerLocationsPage() {
  return (
    <PartnerSpaceShell>
      <PartnerLocationList />
    </PartnerSpaceShell>
  );
}
