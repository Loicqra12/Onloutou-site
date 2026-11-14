import type { Metadata } from "next";
import { PartnerAuthChrome } from "@/components/partner-portal/PartnerAuthChrome";
import { PartnerVerify } from "@/components/partner-portal/PartnerVerify";

export const metadata: Metadata = { title: "Vérification de l’e-mail", robots: { index: false, follow: false } };

export default function VerifyPage() {
  return (
    <PartnerAuthChrome>
      <PartnerVerify />
    </PartnerAuthChrome>
  );
}
