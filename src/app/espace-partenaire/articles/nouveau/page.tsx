"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { paPaths } from "@/content/partner-articles";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const res = await apiFetch<{ product: { id: string } }>("/partner/products", {
        method: "POST",
        json: { title: "Nouvelle fiche", category: "OTHER" },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace(paPaths.article(res.data.product.id, "article"));
    })();
  }, [router]);

  return (
    <PartnerSpaceShell>
      {error ? <p className="pa-error" role="alert">{error}</p> : <p>Création du brouillon…</p>}
    </PartnerSpaceShell>
  );
}
