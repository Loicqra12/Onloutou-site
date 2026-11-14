import type { Metadata } from "next";
import { Suspense } from "react";
import { PartnerArticleScreen } from "@/components/partners/PartnerArticleScreen";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Proposer un article", robots: { index: false, follow: false } };

export default function PartnerArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <PartnerSpaceShell>
      <Suspense fallback={<p>Chargement…</p>}>
        <ArticleLoader params={params} />
      </Suspense>
    </PartnerSpaceShell>
  );
}

async function ArticleLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await Promise.resolve(params);
  return <PartnerArticleScreen productId={id} />;
}
