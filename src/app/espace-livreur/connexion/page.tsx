import type { Metadata } from "next";
import { DriverLoginForm } from "@/components/driver-portal/DriverLoginForm";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Connexion livreur",
  robots: { index: false, follow: false },
};

export default function DriverLoginPage() {
  return (
    <main className="adm-page">
      <div className="adm-shell">
        <h1 className="adm-h1">Connexion espace livreur</h1>
        <DriverLoginForm />
      </div>
    </main>
  );
}
