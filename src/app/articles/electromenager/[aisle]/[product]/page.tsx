import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { ElmProductView } from "@/components/electromenager/ElmProduct";
import {
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmAislePath,
  elmBreadcrumbJsonLd,
  elmProductPath,
  elmProducts,
  getElmAisle,
  getElmProduct,
} from "@/content/electromenager";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string; product: string };

export function generateStaticParams(): Params[] {
  return elmProducts.map((product) => ({ aisle: product.aisleId, product: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle, product: slug } = await params;
  const found = getElmProduct(aisle, slug);
  if (!found) return {};
  return createPageMetadata({
    title: `${found.title} en location à Abidjan`,
    description: found.excerpt,
    path: elmProductPath(found.aisleId, found.slug),
    openGraphImages: [{ url: found.image.src, alt: found.image.alt }],
  });
}

export default async function ElectromenagerProductPage({ params }: { params: Promise<Params> }) {
  const { aisle: aisleSlug, product: productSlug } = await params;
  const aisle = getElmAisle(aisleSlug);
  const product = getElmProduct(aisleSlug, productSlug);
  if (!aisle || !product) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="elm-product-breadcrumb-jsonld"
        build={(base) =>
          elmBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: ELM_FAMILY_LABEL, path: ELM_ROOT },
            { name: aisle.title, path: elmAislePath(aisle.id) },
            { name: product.title, path: elmProductPath(aisle.id, product.slug) },
          ])
        }
      />
      <ElmProductView aisle={aisle} product={product} />
    </>
  );
}
