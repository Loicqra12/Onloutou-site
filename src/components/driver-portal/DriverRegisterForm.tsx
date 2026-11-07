"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";

export function DriverRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const res = await apiFetch("/auth/register/driver", {
      method: "POST",
      json: {
        email: String(form.get("email")),
        password: String(form.get("password")),
        fullName: String(form.get("fullName")),
        phone: String(form.get("phone") || "") || undefined,
        zone: String(form.get("zone") || "") || undefined,
        vehicleInfo: String(form.get("vehicleInfo") || "") || undefined,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/espace-livreur/dossier?candidature=recue");
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      <label htmlFor="fld-email">E-mail</label>
      <input className="adm-input" id="fld-email" name="email" type="email" required autoComplete="email" />
      <label htmlFor="fld-password">Mot de passe (10 caractères min.)</label>
      <input className="adm-input" id="fld-password" name="password" type="password" minLength={10} required autoComplete="new-password" />
      <label htmlFor="fld-fullName">Nom complet</label>
      <input className="adm-input" id="fld-fullName" name="fullName" required autoComplete="name" />
      <label htmlFor="fld-phone">Téléphone</label>
      <input className="adm-input" id="fld-phone" name="phone" type="tel" autoComplete="tel" />
      <label htmlFor="fld-zone">Zone d’activité</label>
      <input className="adm-input" id="fld-zone" name="zone" />
      <label htmlFor="fld-vehicleInfo">Moyen de transport (texte libre)</label>
      <textarea className="adm-input" id="fld-vehicleInfo" name="vehicleInfo" rows={2} />
      <p className="adm-note" role="note">
        Aucune pièce d’identité n’est transmise ici. ONLOUTOU vous indiquera le canal sécurisé après étude de votre dossier.
      </p>
      {error ? <p className="adm-error" role="alert">{error}</p> : null}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? "Création…" : "Créer mon dossier livreur"}
      </button>
      <p className="adm-note">
        Déjà inscrit ? <Link href="/espace-livreur/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
