import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { RecProductView } from "@/components/reception/RecProduct";
import {
  REC_FAMILY_LABEL,
  REC_ROOT,
  getRecAisle,
  getRecProduct,
  recAislePath,
  recBreadcrumbJsonLd,
  recProductPath,
  recProducts,
} from "@/content/reception";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string; product: string };

export function generateStaticParams(): Params[] {
  return recProducts.map((product) => ({ aisle: product.aisleId, product: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const product = getRecProduct(aisleSlug, productSlug);
  if (!product) return {};
  return createPageMetadata({
    title: `${product.title} — location réception`,
    description: product.excerpt,
    path: recProductPath(product.aisleId, product.slug),
  });
}

export default async function ReceptionProductPage({ params }: { params: Promise<Params> }) {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getRecAisle(aisleSlug);
  const product = getRecProduct(aisleSlug, productSlug);
  if (!aisle || !product) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-product-breadcrumb-jsonld"
        build={(base) =>
          recBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: REC_FAMILY_LABEL, path: REC_ROOT },
            { name: aisle.title, path: recAislePath(aisle.id) },
            { name: product.title, path: recProductPath(product.aisleId, product.slug) },
          ])
        }
      />
      <RecProductView aisle={aisle} product={product} />
    </>
  );
}
