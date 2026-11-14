"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpSpace } from "@/content/devenir-partenaire";
import type { PartnerPersonKind, PartnerProfile } from "@/lib/partner-profile";
import "@/styles/partner-auth.css";

export function PartnerAccountForm() {
  const c = dpSpace.account;
  const formRef = useRef<HTMLFormElement>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [personKind, setPersonKind] = useState<PartnerPersonKind>("INDIVIDUAL");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<"save" | "submit" | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await apiFetch<{ profile: PartnerProfile }>("/partner/me");
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setProfile(res.data.profile);
      if (res.data.profile.personKind) setPersonKind(res.data.profile.personKind);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function payload(form: FormData) {
    return {
      personKind,
      phone: String(form.get("phone") ?? ""),
      commune: String(form.get("commune") ?? ""),
      commercialName: personKind === "PROFESSIONAL" ? String(form.get("commercialName") ?? "") : null,
    };
  }

  async function run(intent: "save" | "submit") {
    const form = formRef.current;
    if (!form) return;
    if (intent === "submit" && !form.reportValidity()) return;
    setPending(intent);
    setError(null);
    setMessage(null);
    const data = payload(new FormData(form));
    const res = intent === "save"
      ? await apiFetch<{ profile: PartnerProfile }>("/partner/profile", { method: "PATCH", json: data })
      : await apiFetch<{ profile: PartnerProfile }>("/partner/profile/submit", { method: "POST", json: data });
    setPending(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProfile(res.data.profile);
    setMessage(intent === "save" ? "Brouillon enregistré." : c.submitted);
  }

  if (!profile && !error) return <p>Chargement du profil…</p>;
  if (!profile) return <p className="ps-error" role="alert">{error}</p>;

  const locked = profile.status === "APPROVED";
  const reviewing = profile.status === "SUBMITTED";

  return (
    <div className="ps-account">
      <h1>{c.title}</h1>
      <p>{c.lead}</p>
      {reviewing ? <p className="ps-banner ps-banner--info" role="status">{c.submitted}</p> : null}
      {locked ? <p className="ps-banner ps-banner--ok" role="status">{dpSpace.approvedText}</p> : null}
      <form
        ref={formRef}
        className="pa-form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <fieldset className="pa-field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend>{c.personKind}</legend>
          <div className="ps-kind">
            <label>
              <input type="radio" name="personKind" value="INDIVIDUAL" checked={personKind === "INDIVIDUAL"} onChange={() => setPersonKind("INDIVIDUAL")} disabled={locked} />
              {c.individual}
            </label>
            <label>
              <input type="radio" name="personKind" value="PROFESSIONAL" checked={personKind === "PROFESSIONAL"} onChange={() => setPersonKind("PROFESSIONAL")} disabled={locked} />
              {c.professional}
            </label>
          </div>
        </fieldset>
        <div className="pa-field">
          <label htmlFor="fld-phone">{c.phone}</label>
          <div className="pa-field__control">
            <input id="fld-phone" name="phone" type="tel" required defaultValue={profile.user.phone ?? ""} autoComplete="tel" disabled={locked} />
          </div>
        </div>
        <div className="pa-field">
          <label htmlFor="fld-commune">{c.commune}</label>
          <div className="pa-field__control">
            <input id="fld-commune" name="commune" required defaultValue={profile.commune ?? ""} autoComplete="address-level2" disabled={locked} />
          </div>
        </div>
        {personKind === "PROFESSIONAL" ? (
          <div className="pa-field">
            <label htmlFor="fld-commercialName">{c.commercialName}</label>
            <div className="pa-field__control">
              <input id="fld-commercialName" name="commercialName" required defaultValue={profile.commercialName ?? ""} disabled={locked} />
            </div>
            <p className="pa-hint">{c.commercialHint}</p>
          </div>
        ) : null}
        {error ? <p className="ps-error" role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        {locked ? null : (
          <div className="ps-actions">
            <button type="button" className="ps-btn" disabled={pending !== null} onClick={() => void run("save")}>
              {pending === "save" ? "Enregistrement…" : c.save}
            </button>
            <button type="button" className="ps-btn ps-btn--yellow" disabled={pending !== null} onClick={() => void run("submit")}>
              {pending === "submit" ? "Transmission…" : c.submit}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
