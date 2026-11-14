"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpAuth, dpPassword, dpPaths } from "@/content/devenir-partenaire";

export function PartnerPasswordRequest() {
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const res = await apiFetch<{ sent: boolean; message: string; mailConfigured?: boolean }>("/auth/password/request", {
      method: "POST",
      json: { email: String(form.get("email")) },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      setSent(false);
      return;
    }
    setSent(res.data.sent);
    setMessage(res.data.message);
  }

  return (
    <div className="pa-card" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>{dpPassword.requestTitle}</h1>
      <p className="pa-lead">{dpPassword.requestLead}</p>
      {sent === true ? (
        <p role="status">{message}</p>
      ) : (
        <form className="pa-form" onSubmit={onSubmit}>
          <div className="pa-field">
            <label htmlFor="fld-email">{dpAuth.login.email}</label>
            <div className="pa-field__control">
              <input id="fld-email" name="email" type="email" required autoComplete="email" placeholder={dpAuth.login.emailPlaceholder} />
            </div>
          </div>
          {error ? <p className="pa-error" role="alert">{error}</p> : null}
          {sent === false && message ? <p className="pa-error" role="status">{message}</p> : null}
          <button type="submit" className="pa-submit" disabled={pending}>
            {pending ? "Envoi…" : dpPassword.submit}
          </button>
        </form>
      )}
      <p className="pa-help">
        <Link href={dpPaths.login} className="pa-link">{dpPassword.back}</Link>
      </p>
    </div>
  );
}
