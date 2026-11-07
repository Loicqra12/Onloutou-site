import type { Metadata } from "next";
import Link from "next/link";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";

export const metadata: Metadata = {
  title: "Administration — produits",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return (
    <div className="adm-shell">
      <nav className="adm-nav" aria-label="Administration">
        <Link href="/admin/demandes">Demandes</Link>
        <Link href="/admin/candidatures">Candidatures</Link>
        <Link href="/admin/produits" aria-current="page">
          Produits
        </Link>
      </nav>
      <h1 className="adm-h1">Fiches en attente de validation</h1>
      <AdminProductsPanel />
    </div>
  );
}
