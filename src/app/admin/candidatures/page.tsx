import type { Metadata } from "next";
import Link from "next/link";
import { AdminApplicationsPanel } from "@/components/admin/AdminApplicationsPanel";

export const metadata: Metadata = {
  title: "Administration — candidatures",
  robots: { index: false, follow: false },
};

export default function AdminApplicationsPage() {
  return (
    <div className="adm-shell">
      <nav className="adm-nav" aria-label="Administration">
        <Link href="/admin/demandes">Demandes</Link>
        <Link href="/admin/candidatures" aria-current="page">
          Candidatures
        </Link>
        <Link href="/admin/produits">Produits</Link>
      </nav>
      <h1 className="adm-h1">Candidatures partenaires et livreurs</h1>
      <AdminApplicationsPanel />
    </div>
  );
}
