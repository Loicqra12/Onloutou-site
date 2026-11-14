import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

type ProductRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  partnerProfile: { organizationName: string };
};

export function ProduitsPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<ProductRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const list = await apiFetch<{ items: ProductRow[] }>("/admin/products/pending");
      if (!list.ok) {
        if (list.status === 401 || list.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(list.error);
        return;
      }
      setItems(list.data.items);
    })();
  }, [nav]);

  async function review(id: string, decision: "APPROVED" | "REJECTED") {
    const res = await apiFetch(`/admin/products/${id}/review`, {
      method: "PATCH",
      json: { decision, reason: decision === "REJECTED" ? "Fiche à compléter." : undefined },
    });
    if (!res.ok) setError(res.error);
    else setItems((rows) => rows.filter((r) => r.id !== id));
  }

  if (error) return <p className="as-error" role="alert">{error}</p>;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Articles & parc / Tous les articles</span>
      </div>
      <h1 className="as-h1">Fiches en attente de validation</h1>
      <p className="as-lead">Uniquement les articles transmis par les partenaires, en attente de contrôle.</p>
      <section className="as-card">
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
                  <button type="button" onClick={() => void review(row.id, "APPROVED")}>
                    Publier
                  </button>
                  <button type="button" onClick={() => void review(row.id, "REJECTED")}>
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
    </div>
  );
}
