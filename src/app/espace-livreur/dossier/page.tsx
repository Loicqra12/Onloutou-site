import type { Metadata } from "next";
import { DriverDossierPanel } from "@/components/driver-portal/DriverDossierPanel";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Mon dossier livreur",
  robots: { index: false, follow: false },
};

export default function DriverDossierPage() {
  return (
    <main className="adm-page">
      <DriverDossierPanel />
    </main>
  );
}
