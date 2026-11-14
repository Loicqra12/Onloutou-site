"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpPaths, dpVerify } from "@/content/devenir-partenaire";

function Inner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"pending" | "verified" | "expired" | "failure">("pending");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      const res = await apiFetch("/auth/email/confirm", { method: "POST", json: { token } });
      if (res.ok) setState("verified");
      else setState("expired");
    })();
  }, [token]);

  async function resend() {
    setBusy(true);
    setMessage(null);
    const res = await apiFetch<{ sent?: boolean; message?: string; alreadyVerified?: boolean; mailConfigured?: boolean }>("/auth/email/request", { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      setState("failure");
      setMessage(res.error);
      return;
    }
    if (res.data.alreadyVerified) {
      setState("verified");
      return;
    }
    if (res.data.sent) {
      setMessage(res.data.message ?? "Un e-mail a été envoyé à cette adresse.");
    } else {
      setState("failure");
      setMessage(res.data.message ?? "Aucun e-mail n’a été envoyé.");
    }
  }

  const title = state === "verified" ? dpVerify.verifiedTitle : state === "expired" ? dpVerify.expiredTitle : dpVerify.pendingTitle;
  const lead = state === "verified" ? dpVerify.verifiedLead : state === "expired" ? dpVerify.expiredLead : dpVerify.pendingLead;

  return (
    <div className="pa-card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>{title}</h1>
      <p className="pa-lead">{lead}</p>
      {message ? <p role="status" className={state === "failure" ? "pa-error" : undefined}>{message}</p> : null}
      {state !== "verified" ? (
        <button type="button" className="pa-submit" onClick={() => void resend()} disabled={busy}>
          {busy ? "Envoi…" : dpVerify.resend}
        </button>
      ) : null}
      <p className="pa-help">
        <Link href={dpPaths.home} className="pa-link">{dpVerify.continue}</Link>
      </p>
    </div>
  );
}

export function PartnerVerify() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <Inner />
    </Suspense>
  );
}
