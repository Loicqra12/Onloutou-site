import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { ElmAisleView } from "@/components/electromenager/ElmAisle";
import {
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmAislePath,
  elmAisles,
  elmBreadcrumbJsonLd,
  getElmAisle,
} from "@/content/electromenager";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string };

export function generateStaticParams(): Params[] {
  return elmAisles.map((aisle) => ({ aisle: aisle.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: slug } = await params;
  const aisle = getElmAisle(slug);
  if (!aisle) return {};
  return createPageMetadata({
    title: `${aisle.title} — électroménager à louer`,
    description: aisle.lead,
    path: elmAislePath(aisle.id),
  });
}

export default async function ElectromenagerAislePage({ params }: { params: Promise<Params> }) {
  const { aisle: slug } = await params;
  const aisle = getElmAisle(slug);
  if (!aisle) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="elm-aisle-breadcrumb-jsonld"
        build={(base) =>
          elmBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: ELM_FAMILY_LABEL, path: ELM_ROOT },
            { name: aisle.title, path: elmAislePath(aisle.id) },
          ])
        }
      />
      <ElmAisleView aisle={aisle} />
    </>
  );
}
