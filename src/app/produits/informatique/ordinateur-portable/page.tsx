import type { Metadata } from "next";
import { PrdProductView } from "@/components/produits/PrdProductView";
import { catalogById } from "@/content/produits-hub";
import { prdSeo } from "@/content/produits-seo";

const product = catalogById("ordinateur-portable")!;

export const metadata: Metadata = prdSeo(product.title, product.lead, product.path);

export default function Page() {
  return <PrdProductView product={product} />;
}
