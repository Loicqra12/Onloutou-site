import type { Metadata } from "next";
import { PartnerAuthChrome } from "@/components/partner-portal/PartnerAuthChrome";
import { PartnerPasswordRequest } from "@/components/partner-portal/PartnerPasswordRequest";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false, follow: false } };

export default function PasswordRequestPage() {
  return (
    <PartnerAuthChrome>
      <PartnerPasswordRequest />
    </PartnerAuthChrome>
  );
}
