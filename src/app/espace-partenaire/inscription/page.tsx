import type { Metadata } from "next";
import { PartnerAuthChrome } from "@/components/partner-portal/PartnerAuthChrome";
import { PartnerRegisterForm } from "@/components/partner-portal/PartnerRegisterForm";

export const metadata: Metadata = {
  title: "Créer un compte partenaire",
  robots: { index: false, follow: false },
};

export default function PartnerRegisterPage() {
  return (
    <PartnerAuthChrome>
      <PartnerRegisterForm />
    </PartnerAuthChrome>
  );
}
