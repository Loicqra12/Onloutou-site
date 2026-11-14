import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { MobProductView } from "@/components/mobilier/MobProduct";
import {
  MOB_FAMILY_LABEL,
  MOB_ROOT,
  getMobAisle,
  getMobProduct,
  mobAislePath,
  mobBreadcrumbJsonLd,
  mobProductPath,
  mobProducts,
} from "@/content/mobilier";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string; product: string };

export function generateStaticParams(): Params[] {
  return mobProducts.map((product) => ({ aisle: product.aisleId, product: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const product = getMobProduct(aisleSlug, productSlug);
  if (!product) return {};
  return createPageMetadata({
    title: `${product.title} — location mobilier`,
    description: product.excerpt,
    path: mobProductPath(product.aisleId, product.slug),
  });
}

export default async function MobilierProductPage({ params }: { params: Promise<Params> }) {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getMobAisle(aisleSlug);
  const product = getMobProduct(aisleSlug, productSlug);
  if (!aisle || !product) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-product-breadcrumb-jsonld"
        build={(base) =>
          mobBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: MOB_FAMILY_LABEL, path: MOB_ROOT },
            { name: aisle.title, path: mobAislePath(aisle.id) },
            { name: product.title, path: mobProductPath(product.aisleId, product.slug) },
          ])
        }
      />
      <MobProductView aisle={aisle} product={product} />
    </>
  );
}
