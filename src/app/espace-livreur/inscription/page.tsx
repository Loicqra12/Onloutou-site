import type { Metadata } from "next";
import Link from "next/link";
import { DriverRegisterForm } from "@/components/driver-portal/DriverRegisterForm";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Inscription livreur",
  robots: { index: false, follow: false },
};

export default function DriverRegisterPage() {
  return (
    <main className="adm-page">
      <div className="adm-shell">
        <p className="adm-kicker">Espace livreur</p>
        <h1 className="adm-h1">Créer un dossier candidat livreur</h1>
        <p>
          Distinct du formulaire d’intérêt sur <Link href="/devenir-livreur">devenir livreur</Link> : ici vous créez un compte et déposez une
          candidature consultable par l’administration.
        </p>
        <DriverRegisterForm />
      </div>
    </main>
  );
}
