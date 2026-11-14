"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { PartnerArticleWizard } from "@/components/partners/PartnerArticleWizard";
import { PartnerArticleCorrect } from "@/components/partners/PartnerArticleCorrect";
import { PartnerArticleManage } from "@/components/partners/PartnerArticleManage";
import { paCopy } from "@/content/partner-articles";
import type { PartnerArticle } from "@/lib/partner-articles";

export function PartnerArticleScreen({ productId }: { productId: string }) {
  const etape = useSearchParams().get("etape");
  const [status, setStatus] = useState<PartnerArticle["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`);
      if (!res.ok) { setError(res.error); return; }
      setStatus(res.data.product.status);
    })();
  }, [productId]);

  if (error) return <p className="pa-error" role="alert">{error}</p>;
  if (!status) return <p>{paCopy.loading}</p>;
  if (status === "REJECTED") return <PartnerArticleCorrect productId={productId} />;
  if ((status === "APPROVED" || status === "DISABLED" || status === "ARCHIVED") && !etape) return <PartnerArticleManage productId={productId} />;
  return <PartnerArticleWizard productId={productId} />;
}
