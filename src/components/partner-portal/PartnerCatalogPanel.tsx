"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

const dossierStatusLabel: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Candidature reçue, en attente d’examen",
  UNDER_REVIEW: "En cours d’examen",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};
const subscribeNever = () => () => {};
const candidatureRecueFromUrl = () => new URLSearchParams(window.location.search).get("candidature") === "recue";

type Product = { id: string; title: string; status: string; category: string; rejectionReason?: string | null };

const productStatusLabel: Record<string, string> = {
  DRAFT: "Brouillon (non transmis)",
  PENDING_REVIEW: "Transmis, en attente de validation",
  APPROVED: "Validé et publié",
  REJECTED: "Refusé",
  DISABLED: "Désactivé",
  ARCHIVED: "Archivé",
};

export function PartnerCatalogPanel() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const candidatureRecue = useSyncExternalStore(subscribeNever, candidatureRecueFromUrl, () => false);

  useEffect(() => {
    void (async () => {
      const me = await apiFetch("/auth/me");
      if (!me.ok) {
        router.replace("/espace-partenaire/connexion");
        return;
      }
      const profile = await apiFetch<{ profile: { status: string } }>("/partner/me");
      if (profile.ok) setProfileStatus(profile.data.profile.status);
      const list = await apiFetch<{ products: Product[] }>("/partner/products");
      if (list.ok) setProducts(list.data.products);
    })();
  }, [router]);

  async function submitForReview(id: string) {
    setError(null);
    const res = await apiFetch<{ product: Product }>(`/partner/products/${id}/submit`, { method: "POST" });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProducts((rows) => rows.map((row) => (row.id === id ? { ...row, ...res.data.product } : row)));
  }

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await apiFetch<{ product: Product }>("/partner/products", {
      method: "POST",
      json: {
        category: String(form.get("category")),
        title: String(form.get("title")),
        description: String(form.get("description") || "") || undefined,
        pricingMode: "ON_QUOTE",
      },
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProducts((rows) => [res.data.product, ...rows]);
    event.currentTarget.reset();
  }

  return (
    <div className="adm-shell">
      {candidatureRecue ? (
        <p className="adm-note" role="status">
          Candidature enregistrée. Votre accès reste limité tant que l’équipe ONLOUTOU n’a pas validé votre dossier partenaire.
        </p>
      ) : null}
      <h1>Mon catalogue partenaire</h1>
      <p>Statut du dossier : {profileStatus ? (dossierStatusLabel[profileStatus] ?? profileStatus) : "…"}</p>
      {profileStatus !== "APPROVED" ? (
        <p>Le catalogue éditable est disponible après validation de votre candidature par l’équipe ONLOUTOU.</p>
      ) : null}
      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}
      <h2>Mes fiches</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id} data-product-title={p.title}>
            {p.title} — {productStatusLabel[p.status] ?? p.status} ({p.category})
            {p.status === "REJECTED" && p.rejectionReason ? <> — motif : {p.rejectionReason}</> : null}
            {p.status === "DRAFT" || p.status === "REJECTED" ? (
              <>
                {" "}
                <button type="button" className="adm-btn" onClick={() => submitForReview(p.id)}>
                  Soumettre pour validation
                </button>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <h2>Nouvelle fiche brouillon</h2>
      {profileStatus === "APPROVED" ? (
      <form className="adm-form" onSubmit={createDraft}>
        <label htmlFor="fld-title">Titre</label>
        <input className="adm-input" id="fld-title" name="title" required />
        <label htmlFor="fld-category">Catégorie</label>
        <select className="adm-input" id="fld-category" name="category" defaultValue="VEHICLES">
          <option value="VEHICLES">Véhicules</option>
          <option value="MOTORCYCLES">Motos</option>
          <option value="TRUCKS_MACHINERY">Camions & engins</option>
          <option value="TOOLS">Outils & matériel</option>
          <option value="CONNECTED">Connectés</option>
          <option value="OTHER">Autre</option>
        </select>
        <label htmlFor="fld-description">Description</label>
        <textarea className="adm-input" id="fld-description" name="description" rows={3} />
        <button type="submit" className="adm-btn">
          Enregistrer le brouillon
        </button>
      </form>
      ) : (
        <p className="adm-note">Soumettez et faites valider votre dossier partenaire avant d’ajouter des fiches produit.</p>
      )}
      <p className="adm-note">
        <Link href="/espace-partenaire">Retour</Link>
      </p>
    </div>
  );
}
