"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, Suspense } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpPassword, dpPaths } from "@/content/devenir-partenaire";

function Inner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(!token);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const res = await apiFetch<{ expired?: boolean }>("/auth/password/confirm", {
      method: "POST",
      json: { token, password: String(form.get("password")) },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      setExpired(true);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="pa-card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1>{dpPassword.doneTitle}</h1>
        <p className="pa-lead">{dpPassword.doneLead}</p>
        <Link href={dpPaths.login} className="pa-submit" style={{ textDecoration: "none" }}>{dpAuthLabel()}</Link>
      </div>
    );
  }

  if (expired && !token) {
    return (
      <div className="pa-card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1>{dpPassword.expiredTitle}</h1>
        <p className="pa-lead">{dpPassword.expiredLead}</p>
        {error ? <p className="pa-error" role="alert">{error}</p> : null}
        <Link href={dpPaths.password} className="pa-submit" style={{ textDecoration: "none" }}>{dpPassword.resend}</Link>
      </div>
    );
  }

  return (
    <div className="pa-card" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>{dpPassword.newTitle}</h1>
      <p className="pa-lead">{dpPassword.newLead}</p>
      {error ? (
        <>
          <p className="pa-error" role="alert">{error}</p>
          <p><Link href={dpPaths.password} className="pa-link">{dpPassword.resend}</Link></p>
        </>
      ) : null}
      <form className="pa-form" onSubmit={onSubmit}>
        <div className="pa-field">
          <label htmlFor="fld-password">Nouveau mot de passe</label>
          <div className="pa-field__control">
            <input id="fld-password" name="password" type="password" required minLength={10} autoComplete="new-password" />
          </div>
        </div>
        <button type="submit" className="pa-submit" disabled={pending}>
          {pending ? "Enregistrement…" : dpPassword.newSubmit}
        </button>
      </form>
    </div>
  );
}

function dpAuthLabel() {
  return "Me connecter";
}

export function PartnerPasswordNew() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <Inner />
    </Suspense>
  );
}
