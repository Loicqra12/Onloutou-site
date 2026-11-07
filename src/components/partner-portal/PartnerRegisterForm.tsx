"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";

export function PartnerRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const res = await apiFetch("/auth/register/partner", {
      method: "POST",
      json: {
        email: String(form.get("email")),
        password: String(form.get("password")),
        displayName: String(form.get("displayName")),
        organizationName: String(form.get("organizationName")),
        partnerType: String(form.get("partnerType")),
        zone: String(form.get("zone") || "") || undefined,
        description: String(form.get("description") || "") || undefined,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/espace-partenaire/catalogue?candidature=recue");
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      <label htmlFor="fld-email">E-mail</label>
      <input className="adm-input" id="fld-email" name="email" type="email" required />
      <label htmlFor="fld-password">Mot de passe (10 caractères min.)</label>
      <input className="adm-input" id="fld-password" name="password" type="password" minLength={10} required />
      <label htmlFor="fld-displayName">Votre nom</label>
      <input className="adm-input" id="fld-displayName" name="displayName" required />
      <label htmlFor="fld-organizationName">Organisation</label>
      <input className="adm-input" id="fld-organizationName" name="organizationName" required />
      <label htmlFor="fld-partnerType">Type</label>
      <select className="adm-input" id="fld-partnerType" name="partnerType" required defaultValue="SUPPLIER">
        <option value="SUPPLIER">Fournisseur d’équipements</option>
        <option value="DELIVERY">Livraison</option>
        <option value="TECH">Technologique</option>
      </select>
      <label htmlFor="fld-zone">Zone</label>
      <input className="adm-input" id="fld-zone" name="zone" />
      <label htmlFor="fld-description">Description</label>
      <textarea className="adm-input" id="fld-description" name="description" rows={3} />
      {error ? <p className="adm-error" role="alert">{error}</p> : null}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? "Création…" : "Créer mon dossier"}
      </button>
      <p className="adm-note">
        Déjà inscrit ? <Link href="/espace-partenaire/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
