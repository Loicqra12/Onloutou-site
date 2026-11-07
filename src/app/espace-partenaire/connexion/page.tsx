import type { Metadata } from "next";
import Link from "next/link";
import { PartnerLoginForm } from "@/components/partner-portal/PartnerLoginForm";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Connexion partenaire",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return (
    <main className="adm-page">
      <div className="adm-shell">
        <h1 className="adm-h1">Connexion partenaire</h1>
        <PartnerLoginForm />
        <p className="adm-note">
          <Link href="/espace-partenaire">Présentation de l’espace</Link>
        </p>
      </div>
    </main>
  );
}
