import type { Metadata } from "next";
import { PrdVaisselleView } from "@/components/produits/PrdVaisselleView";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.vaisselle;

export default function Page() {
  return <PrdVaisselleView />;
}
