import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { InfProductView } from "@/components/informatique/InfProduct";
import {
  INF_FAMILY_LABEL,
  INF_ROOT,
  getInfAisle,
  getInfProduct,
  infAislePath,
  infBreadcrumbJsonLd,
  infProductPath,
  infProducts,
} from "@/content/informatique";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string; product: string };

export function generateStaticParams(): Params[] {
  return infProducts.map((product) => ({ aisle: product.aisleId, product: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const product = getInfProduct(aisleSlug, productSlug);
  if (!product) return {};
  return createPageMetadata({
    title: `${product.title} — location informatique`,
    description: product.excerpt,
    path: infProductPath(product.aisleId, product.slug),
  });
}

export default async function InformatiqueProductPage({ params }: { params: Promise<Params> }) {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getInfAisle(aisleSlug);
  const product = getInfProduct(aisleSlug, productSlug);
  if (!aisle || !product) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="inf-product-breadcrumb-jsonld"
        build={(base) =>
          infBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: INF_FAMILY_LABEL, path: INF_ROOT },
            { name: aisle.title, path: infAislePath(aisle.id) },
            { name: product.title, path: infProductPath(product.aisleId, product.slug) },
          ])
        }
      />
      <InfProductView aisle={aisle} product={product} />
    </>
  );
}
