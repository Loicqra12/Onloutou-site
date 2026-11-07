"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";

export function PartnerLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await apiFetch("/auth/login", {
      method: "POST",
      json: { email: String(form.get("email")), password: String(form.get("password")) },
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/espace-partenaire/catalogue");
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      <label htmlFor="fld-email">E-mail</label>
      <input className="adm-input" id="fld-email" name="email" type="email" required />
      <label htmlFor="fld-password">Mot de passe</label>
      <input className="adm-input" id="fld-password" name="password" type="password" required />
      {error ? <p className="adm-error" role="alert">{error}</p> : null}
      <button type="submit" className="adm-btn">
        Se connecter
      </button>
      <p className="adm-note">
        <Link href="/espace-partenaire/inscription">Créer un dossier</Link>
      </p>
    </form>
  );
}
