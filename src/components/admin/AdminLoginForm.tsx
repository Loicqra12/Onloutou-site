"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const res = await apiFetch<{ user: { role: string } }>("/auth/login", {
      method: "POST",
      json: { email, password },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (res.data.user.role !== "ADMIN" && res.data.user.role !== "STAFF") {
      setError("Ce compte n’a pas accès à l’administration.");
      return;
    }
    router.push("/admin/demandes");
    router.refresh();
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      <label htmlFor="adm-email">E-mail</label>
      <input id="adm-email" className="adm-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="adm-password">Mot de passe</label>
      <input id="adm-password" className="adm-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error ? <p className="adm-error" role="alert">{error}</p> : null}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
