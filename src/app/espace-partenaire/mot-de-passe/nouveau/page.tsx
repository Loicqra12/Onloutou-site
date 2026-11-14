import type { Metadata } from "next";
import { PartnerAuthChrome } from "@/components/partner-portal/PartnerAuthChrome";
import { PartnerPasswordNew } from "@/components/partner-portal/PartnerPasswordNew";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false, follow: false } };

export default function PasswordNewPage() {
  return (
    <PartnerAuthChrome>
      <PartnerPasswordNew />
    </PartnerAuthChrome>
  );
}
