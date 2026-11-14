import type { Metadata } from "next";
import { PrdConfirmationView } from "@/components/produits/PrdConfirmationView";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.confirmation;

export default function Page() {
  return <PrdConfirmationView />;
}
