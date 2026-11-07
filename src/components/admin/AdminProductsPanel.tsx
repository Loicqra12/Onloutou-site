"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type ProductRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  partnerProfile: { organizationName: string };
};

export function AdminProductsPanel() {
  const router = useRouter();
  const [items, setItems] = useState<ProductRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const me = await apiFetch("/auth/me");
      if (!me.ok) {
        router.replace("/admin/login");
        return;
      }
      const list = await apiFetch<{ items: ProductRow[] }>("/admin/products/pending");
      if (!list.ok) {
        setError(list.error);
        return;
      }
      setItems(list.data.items);
    })();
  }, [router]);

  async function review(id: string, decision: "APPROVED" | "REJECTED") {
    const res = await apiFetch(`/admin/products/${id}/review`, {
      method: "PATCH",
      json: { decision, reason: decision === "REJECTED" ? "Fiche à compléter." : undefined },
    });
    if (!res.ok) setError(res.error);
    else setItems((rows) => rows.filter((r) => r.id !== id));
  }

  if (error) return <p className="adm-error" role="alert">{error}</p>;

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Partenaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <td data-label="Titre">{row.title}</td>
              <td data-label="Catégorie">{row.category}</td>
              <td data-label="Partenaire">{row.partnerProfile.organizationName}</td>
              <td className="adm-actions" data-label="Actions">
                <button type="button" onClick={() => review(row.id, "APPROVED")}>
                  Publier
                </button>
                <button type="button" onClick={() => review(row.id, "REJECTED")}>
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
