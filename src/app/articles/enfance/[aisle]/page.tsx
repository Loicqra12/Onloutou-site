import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnfAisleView } from "@/components/enfance/EnfAisle";
import {
  ENF_FAMILY_LABEL,
  enfAislePath,
  enfAisles,
  getEnfAisle,
} from "@/content/enfance";
import { createPageMetadata } from "@/lib/seo/metadata";

type Params = { aisle: string };

export function generateStaticParams() {
  return enfAisles.map((aisle) => ({ aisle: aisle.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { aisle: slug } = await params;
  const aisle = getEnfAisle(slug);
  if (!aisle) return {};
  return createPageMetadata({
    title: `${aisle.title} — ${ENF_FAMILY_LABEL}`,
    description: aisle.lead,
    path: enfAislePath(aisle.id),
  });
}

export default async function EnfAislePage({ params }: { params: Promise<Params> }) {
  const { aisle: slug } = await params;
  const aisle = getEnfAisle(slug);
  if (!aisle) notFound();
  return <EnfAisleView aisle={aisle} />;
}
