"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent, Suspense } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpAuth, dpPaths } from "@/content/devenir-partenaire";
import { DpIcon } from "@/components/partners/DpIcon";
import { DpPicture } from "@/components/partners/DpPicture";

function PartnerLoginFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const c = dpAuth.login;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const res = await apiFetch("/auth/login", {
      method: "POST",
      json: { email: String(form.get("email")), password: String(form.get("password")) },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const next = params.get("next");
    router.push(next && next.startsWith("/espace-partenaire") ? next : dpPaths.home);
    router.refresh();
  }

  const form = (
    <form className="pa-form" onSubmit={onSubmit} noValidate>
      <div className="pa-field">
        <label htmlFor="fld-email">{c.email}</label>
        <div className="pa-field__control">
          <DpIcon name="mail" />
          <input id="fld-email" name="email" type="email" autoComplete="email" required placeholder={c.emailPlaceholder} />
        </div>
      </div>
      <div className="pa-field">
        <label htmlFor="fld-password">{c.password}</label>
        <div className="pa-field__control">
          <DpIcon name="lock" />
          <input id="fld-password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required />
          <button type="button" className="pa-field__toggle" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            <DpIcon name="eye" />
          </button>
        </div>
      </div>
      <p>
        <Link className="pa-link" href={dpPaths.password}>{c.forgot}</Link>
      </p>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}
      <button type="submit" className="pa-submit" disabled={pending}>
        {pending ? "Connexion…" : `${c.submit} →`}
      </button>
      <hr className="pa-divider" />
      <p className="pa-alt">{c.newbie}</p>
      <Link href={dpPaths.register} className="pa-alt-btn">{c.create}</Link>
      <p className="pa-help">
        {c.help} <Link href={c.helpHref} className="pa-link">{c.helpLink}</Link>
      </p>
    </form>
  );

  return (
    <div className="pa-grid">
      <div className="pa-visual">
        <DpPicture image={c.image} sizes="(max-width: 900px) 100vw, 55vw" priority />
        <p className="pa-visual__caption">{c.caption}</p>
      </div>
      <div className="pa-card">
        <p className="pa-kicker">{c.kicker}</p>
        <h1>{c.title}</h1>
        <p className="pa-lead">{c.lead}</p>
        {form}
      </div>
    </div>
  );
}

export function PartnerLoginForm() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <PartnerLoginFormInner />
    </Suspense>
  );
}
