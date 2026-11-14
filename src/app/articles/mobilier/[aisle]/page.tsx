import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { MobAisle as MobAisleView } from "@/components/mobilier/MobAisle";
import {
  MOB_FAMILY_LABEL,
  MOB_ROOT,
  mobAislePath,
  mobAisles,
  mobBreadcrumbJsonLd,
  getMobAisle,
} from "@/content/mobilier";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string };

export function generateStaticParams(): Params[] {
  return mobAisles.map((aisle) => ({ aisle: aisle.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: slug } = await params;
  const aisle = getMobAisle(slug);
  if (!aisle) return {};
  return createPageMetadata({
    title: `${aisle.title} à louer — Mobilier & décoration`,
    description: aisle.lead,
    path: mobAislePath(aisle.id),
  });
}

export default async function MobilierAislePage({ params }: { params: Promise<Params> }) {
  const { aisle: slug } = await params;
  const aisle = getMobAisle(slug);
  if (!aisle) notFound();

  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-aisle-breadcrumb-jsonld"
        build={(base) =>
          mobBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: MOB_FAMILY_LABEL, path: MOB_ROOT },
            { name: aisle.title, path: mobAislePath(aisle.id) },
          ])
        }
      />
      <MobAisleView aisle={aisle} />
    </>
  );
}
