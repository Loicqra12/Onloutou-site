"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

const dossierStatusLabel: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Candidature reçue, en attente d’examen",
  UNDER_REVIEW: "En cours d’examen",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
  UNKNOWN: "Indisponible pour le moment",
};
const subscribeNever = () => () => {};
const candidatureRecueFromUrl = () => new URLSearchParams(window.location.search).get("candidature") === "recue";

export function DriverDossierPanel() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const candidatureRecue = useSyncExternalStore(subscribeNever, candidatureRecueFromUrl, () => false);

  useEffect(() => {
    void (async () => {
      const me = await apiFetch("/auth/me");
      if (!me.ok) {
        router.replace("/espace-livreur/connexion");
        return;
      }
      const profile = await apiFetch<{ profile: { status: string; fullName: string } }>("/driver/me");
      if (!profile.ok) {
        setStatus("UNKNOWN");
        return;
      }
      setStatus(profile.data.profile.status);
      setFullName(profile.data.profile.fullName);
    })();
  }, [router]);

  const approved = status === "APPROVED";

  return (
    <div className="adm-shell">
      {candidatureRecue ? (
        <p className="adm-note" role="status">
          Candidature enregistrée. Votre accès aux missions reste limité tant que l’équipe ONLOUTOU n’a pas validé votre dossier.
        </p>
      ) : null}
      <h1>Mon dossier livreur</h1>
      <p>Bonjour {fullName ?? "…"}</p>
      <p>Statut du dossier : {status ? (dossierStatusLabel[status] ?? status) : "…"}</p>
      {!approved ? (
        <p>
          Vous pouvez consulter l’état de votre candidature ici. Les fonctionnalités opérationnelles (missions, disponibilités) s’ouvrent après
          approbation.
        </p>
      ) : (
        <p>Votre dossier est approuvé. Les outils métier livreur seront activés progressivement sur cet espace.</p>
      )}
      <p className="adm-note">
        <Link href="/espace-livreur">Retour à la présentation</Link>
      </p>
    </div>
  );
}
