import type { Metadata } from "next";
import { Suspense } from "react";
import { PartnerProfileWizard } from "@/components/partners/PartnerProfileWizard";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";
import { ppCopy } from "@/content/partner-profile-wizard";

export const metadata: Metadata = { title: "Profil partenaire", robots: { index: false, follow: false } };

export default function PartnerComptePage() {
  return (
    <PartnerSpaceShell>
      <Suspense fallback={<p>{ppCopy.loading}</p>}>
        <PartnerProfileWizard />
      </Suspense>
    </PartnerSpaceShell>
  );
}
