import type { Metadata } from "next";
import { PrdSurMesureView } from "@/components/produits/PrdSurMesureView";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.surMesure;

export default function Page() {
  return <PrdSurMesureView />;
}
