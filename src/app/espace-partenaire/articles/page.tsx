import type { Metadata } from "next";
import { Suspense } from "react";
import { PartnerArticlesList } from "@/components/partners/PartnerArticlesList";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Mes articles", robots: { index: false, follow: false } };

export default function PartnerArticlesPage() {
  return (
    <PartnerSpaceShell>
      <Suspense fallback={<p>Chargement…</p>}>
        <PartnerArticlesList />
      </Suspense>
    </PartnerSpaceShell>
  );
}
