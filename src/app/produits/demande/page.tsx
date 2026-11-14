import type { Metadata } from "next";
import { PrdDemandeView } from "@/components/produits/PrdDemandeView";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.demande;

export default function Page() {
  return <PrdDemandeView />;
}
