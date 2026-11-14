import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { RecAisle as RecAisleView } from "@/components/reception/RecAisle";
import {
  REC_FAMILY_LABEL,
  REC_ROOT,
  recAislePath,
  recAisles,
  recBreadcrumbJsonLd,
  getRecAisle,
} from "@/content/reception";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string };

export function generateStaticParams(): Params[] {
  return recAisles.map((aisle) => ({ aisle: aisle.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: slug } = await params;
  const aisle = getRecAisle(slug);
  if (!aisle) return {};
  return createPageMetadata({
    title: `${aisle.title} à louer — Réception & événementiel`,
    description: aisle.lead,
    path: recAislePath(aisle.id),
  });
}

export default async function ReceptionAislePage({ params }: { params: Promise<Params> }) {
  const { aisle: slug } = await params;
  const aisle = getRecAisle(slug);
  if (!aisle) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-aisle-breadcrumb-jsonld"
        build={(base) =>
          recBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: REC_FAMILY_LABEL, path: REC_ROOT },
            { name: aisle.title, path: recAislePath(aisle.id) },
          ])
        }
      />
      <RecAisleView aisle={aisle} />
    </>
  );
}
