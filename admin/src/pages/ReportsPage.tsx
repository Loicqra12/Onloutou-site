import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

type ReportsData = {
  banner: string;
  period: { label: string; from: string; to: string };
  kpis: {
    demandesRecues: number;
    demandesTotal: number;
    tauxTransformation: number | null;
    locationsEnService: number;
    delaiMoyenJours: number | null;
  };
  sources: Record<string, { count: number; pct: number }>;
  topFamilies: { slug: string; label: string; demandes: number }[];
  watch: { level: string; label: string; href: string }[];
  parc: { articles: number; note: string };
  partenaires: { actifs: number; aVerifier: number };
  livraisons: { note: string };
  finances: { revenusEnAttente: number };
  qualite: { evenementsAujourdhui: number; note: string };
  scheduledNote: string;
};

const TABS = [
  { id: "activite", label: "Activité" },
  { id: "parc", label: "Parc" },
  { id: "partenaires", label: "Partenaires" },
  { id: "livraisons", label: "Livraisons" },
  { id: "finances", label: "Finances" },
  { id: "qualite", label: "Qualité" },
] as const;

export function ReportsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "activite";
  const [data, setData] = useState<ReportsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<ReportsData>("/admin/ops/reports");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(res.error);
        return;
      }
      setData(res.data);
    })();
  }, [nav]);

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Pilotage / Rapports</span>
      </div>
      <h1 className="as-h1">Rapports & pilotage</h1>
      {data?.banner ? <p className="as-banner as-banner--warn">{data.banner}</p> : null}
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="as-note">{notice}</p> : null}

      <div className="as-toolbar">
        <span className="as-badge as-badge--info">Période : {data?.period.label || "Ce mois"}</span>
        <button type="button" className="as-btn" onClick={() => setNotice("Enregistrement de vues : à brancher plus tard.")}>
          Enregistrer la vue
        </button>
        <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("Export : disponible après validation des indicateurs métier.")}>
          Exporter
        </button>
      </div>

      <div className="as-tabs-line" style={{ marginBottom: "0.85rem" }}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "is-on" : ""}
            onClick={() => {
              const copy = new URLSearchParams(params);
              copy.set("tab", item.id);
              setParams(copy, { replace: true });
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!data ? (
        <p>Chargement…</p>
      ) : tab === "activite" ? (
        <>
          <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
            <div className="as-kpi">
              <strong>{data.kpis.demandesRecues}</strong>
              <span>Demandes reçues (mois)</span>
              <small>Total historique : {data.kpis.demandesTotal}</small>
            </div>
            <div className="as-kpi">
              <strong>{data.kpis.tauxTransformation != null ? `${data.kpis.tauxTransformation} %` : "—"}</strong>
              <span>Taux de clôture / demandes du mois</span>
            </div>
            <div className="as-kpi">
              <strong>{data.kpis.locationsEnService}</strong>
              <span>Dossiers ouverts</span>
            </div>
            <div className="as-kpi">
              <strong>{data.kpis.delaiMoyenJours ?? "—"}</strong>
              <span>Délai moyen</span>
              <small>Non calculé sans horodatage bout-en-bout</small>
            </div>
          </div>

          <div className="as-grid">
            <section className="as-card">
              <h2>Répartition des demandes (échantillon récent)</h2>
              <ul className="as-todo as-todo--done">
                <li className="is-done">Site · {data.sources.site.count} ({data.sources.site.pct} %)</li>
                <li className="is-done">Téléphone · {data.sources.phone.count} ({data.sources.phone.pct} %)</li>
                <li className="is-done">WhatsApp · {data.sources.whatsapp.count} ({data.sources.whatsapp.pct} %)</li>
                <li className="is-done">Autre · {data.sources.other.count} ({data.sources.other.pct} %)</li>
              </ul>
            </section>
            <section className="as-card">
              <h2>Familles les plus demandées</h2>
              {data.topFamilies.length === 0 ? (
                <p className="as-empty">Pas assez de données famille sur les dossiers récents.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {data.topFamilies.map((f) => (
                    <li key={f.slug} className="is-done">
                      {f.label} · {f.demandes}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="as-card">
              <h2>À surveiller</h2>
              <ul className="as-todo">
                {data.watch.map((item) => (
                  <li key={item.label}>
                    <span className={`as-badge ${item.level === "high" ? "as-badge--warn" : "as-badge--info"}`}>{item.level}</span>{" "}
                    {item.label} · <Link to={item.href}>Voir</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      ) : tab === "parc" ? (
        <section className="as-card">
          <h2>Parc</h2>
          <p>
            <strong>{data.parc.articles}</strong> articles en base
          </p>
          <p className="as-empty">{data.parc.note}</p>
        </section>
      ) : tab === "partenaires" ? (
        <section className="as-card">
          <h2>Partenaires</h2>
          <p>Actifs : {data.partenaires.actifs}</p>
          <p>À vérifier : {data.partenaires.aVerifier}</p>
          <Link className="as-btn as-btn--yellow" to="/partenaires">
            Ouvrir Partenaires
          </Link>
        </section>
      ) : tab === "livraisons" ? (
        <section className="as-card">
          <h2>Livraisons</h2>
          <p className="as-empty">{data.livraisons.note}</p>
          <Link className="as-btn" to="/dossiers">
            Voir les dossiers
          </Link>
        </section>
      ) : tab === "finances" ? (
        <section className="as-card">
          <h2>Finances</h2>
          <p>Revenus partenaires en attente : {data.finances.revenusEnAttente}</p>
          <Link className="as-btn as-btn--yellow" to="/reversements">
            Ouvrir reversements
          </Link>
        </section>
      ) : (
        <section className="as-card">
          <h2>Qualité</h2>
          <p>Événements journalisés aujourd’hui : {data.qualite.evenementsAujourdhui}</p>
          <p className="as-empty">{data.qualite.note}</p>
          <Link className="as-btn" to="/journal">
            Ouvrir le journal
          </Link>
        </section>
      )}

      <section className="as-card" style={{ marginTop: "0.85rem" }}>
        <h2>Rapports programmés</h2>
        <p className="as-empty">{data?.scheduledNote}</p>
      </section>
    </div>
  );
}
