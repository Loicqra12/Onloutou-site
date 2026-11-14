import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnfProductView } from "@/components/enfance/EnfProduct";
import {
  ENF_FAMILY_LABEL,
  enfProductPath,
  enfProducts,
  getEnfAisle,
  getEnfProduct,
} from "@/content/enfance";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string; product: string };

export function generateStaticParams() {
  return enfProducts.map((product) => ({
    aisle: product.aisleId,
    product: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getEnfAisle(aisleSlug);
  const product = aisle ? getEnfProduct(aisle.id, productSlug) : undefined;
  if (!aisle || !product) return {};
  return createPageMetadata({
    title: `${product.title} — ${ENF_FAMILY_LABEL}`,
    description: product.excerpt,
    path: enfProductPath(aisle.id, product.slug),
  });
}

export default async function EnfProductPage({ params }: { params: Promise<Params> }) {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getEnfAisle(aisleSlug);
  const product = aisle ? getEnfProduct(aisle.id, productSlug) : undefined;
  if (!aisle || !product) notFound();
  return <EnfProductView aisle={aisle} product={product} />;
}
