import type { Metadata } from "next";
import { PartnerAuthChrome } from "@/components/partner-portal/PartnerAuthChrome";
import { PartnerLoginForm } from "@/components/partner-portal/PartnerLoginForm";
import { dpAuth } from "@/content/devenir-partenaire";

export const metadata: Metadata = {
  title: "Connexion partenaire",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  const legal = dpAuth.login.legal;
  return (
    <PartnerAuthChrome>
      <PartnerLoginForm />
      <p className="pa-legal">
        <a href={legal.privacy.href}>{legal.privacy.label}</a>
        {" · "}
        <a href={legal.terms.href}>{legal.terms.label}</a>
      </p>
    </PartnerAuthChrome>
  );
}
