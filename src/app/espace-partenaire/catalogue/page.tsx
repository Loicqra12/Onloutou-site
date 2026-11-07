import type { Metadata } from "next";
import { PartnerCatalogPanel } from "@/components/partner-portal/PartnerCatalogPanel";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Catalogue partenaire",
  robots: { index: false, follow: false },
};

export default function PartnerCatalogPage() {
  return (
    <main className="adm-page">
      <PartnerCatalogPanel />
    </main>
  );
}
