import type { Metadata } from "next";
import { PrdRemiseView } from "@/components/produits/PrdRemiseView";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.remise;

export default function Page() {
  return <PrdRemiseView />;
}
