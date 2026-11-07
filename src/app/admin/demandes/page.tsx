import type { Metadata } from "next";
import Link from "next/link";
import { AdminRequestsPanel } from "@/components/admin/AdminRequestsPanel";

export const metadata: Metadata = {
  title: "Administration — demandes",
  robots: { index: false, follow: false },
};

export default function AdminRequestsPage() {
  return (
    <div className="adm-shell">
      <nav className="adm-nav" aria-label="Administration">
        <Link href="/admin/demandes" aria-current="page">
          Demandes
        </Link>
        <Link href="/admin/candidatures">Candidatures</Link>
        <Link href="/admin/produits">Produits</Link>
      </nav>
      <h1 className="adm-h1">Demandes enregistrées</h1>
      <AdminRequestsPanel />
    </div>
  );
}
