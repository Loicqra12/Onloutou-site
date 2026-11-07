import type { Metadata } from "next";
import { CommercialDraftsContent } from "@/components/legal/CommercialDraftsContent";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/seo/metadata";

const updatedAt = "2026-11-05";

const sections = [
  { id: "location", title: "Location" },
  { id: "vente", title: "Vente" },
  { id: "livraison", title: "Livraison" },
  { id: "gps", title: "GPS et technique" },
  { id: "partenaires", title: "Partenaires et livreurs" },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Projets de conditions commerciales",
  description:
    "Projets de clauses commerciales ONLOUTOU, non en vigueur, en attente des décisions de l’entreprise.",
  path: "/conditions-commerciales",
  robots: { index: false, follow: true },
});

export default function ConditionsCommercialesPage() {
  return (
    <LegalDocument
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Conditions d’utilisation", href: "/conditions-utilisation" },
        { label: "Projets commerciaux" },
      ]}
      title="Projets de conditions commerciales"
      intro="Ces textes préparent des clauses pour la location, la vente, la livraison, le GPS et les collaborations. Ils ne sont pas en vigueur et ne créent ni prix, ni caution, ni pénalité."
      updatedAt={updatedAt}
      sections={sections}
      tocLabel="Sommaire des projets commerciaux"
    >
      <CommercialDraftsContent />
    </LegalDocument>
  );
}
