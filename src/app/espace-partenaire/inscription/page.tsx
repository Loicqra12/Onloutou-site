import type { Metadata } from "next";
import Link from "next/link";
import { PartnerRegisterForm } from "@/components/partner-portal/PartnerRegisterForm";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Inscription partenaire",
  robots: { index: false, follow: false },
};

export default function PartnerRegisterPage() {
  return (
    <main className="adm-page">
      <div className="adm-shell">
        <p className="adm-kicker">Espace partenaire</p>
        <h1 className="adm-h1">Créer un dossier partenaire</h1>
        <p>Avant validation, vous ne gérez que votre dossier d’inscription. Le catalogue s’ouvre après approbation.</p>
        <PartnerRegisterForm />
        <p className="adm-note">
          <Link href="/espace-partenaire">Retour à la présentation</Link>
        </p>
      </div>
    </main>
  );
}
