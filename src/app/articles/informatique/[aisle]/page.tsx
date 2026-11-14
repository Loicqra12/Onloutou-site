import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { InfAisleView } from "@/components/informatique/InfAisle";
import {
  INF_FAMILY_LABEL,
  INF_ROOT,
  infAislePath,
  infAisles,
  infBreadcrumbJsonLd,
  getInfAisle,
} from "@/content/informatique";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string };

export function generateStaticParams(): Params[] {
  return infAisles.map((aisle) => ({ aisle: aisle.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: slug } = await params;
  const aisle = getInfAisle(slug);
  if (!aisle) return {};
  return createPageMetadata({
    title: `${aisle.title} à louer — Informatique & téléphonie`,
    description: aisle.lead,
    path: infAislePath(aisle.id),
  });
}

export default async function InformatiqueAislePage({ params }: { params: Promise<Params> }) {
  const { aisle: slug } = await params;
  const aisle = getInfAisle(slug);
  if (!aisle) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="inf-aisle-breadcrumb-jsonld"
        build={(base) =>
          infBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: INF_FAMILY_LABEL, path: INF_ROOT },
            { name: aisle.title, path: infAislePath(aisle.id) },
          ])
        }
      />
      <InfAisleView aisle={aisle} />
    </>
  );
}
