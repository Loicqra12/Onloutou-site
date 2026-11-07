import type { Metadata } from "next";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import { PtnSupBand, PtnSupFamilies, PtnSupHero, PtnSupOffer } from "@/components/partners/redesign/PtnSupplier";
import { supplierPage } from "@/content/partners-page";
import { ptnSupFaq } from "@/content/partners-subpages";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";

export const metadata: Metadata = createPageMetadata({ ...supplierPage.seo, path: "/partenaires/fournisseurs" });

export default function PartenairesFournisseursPage() {
  return (
    <div className="ptn-page">
      <PtnSupHero />
      <PtnSupFamilies />
      <PtnSupOffer />
      <PtnSupBand />
      <PtnFaq content={ptnSupFaq} variant="cards" initialOpen={null} />
    </div>
  );
}