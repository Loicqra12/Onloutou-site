import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Administration — connexion",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="adm-shell">
      <p className="adm-kicker">Administration interne</p>
      <h1 className="adm-h1">Connexion</h1>
      <AdminLoginForm />
      <p className="adm-note">
        <Link href="/">Retour au site public</Link>
      </p>
    </div>
  );
}
