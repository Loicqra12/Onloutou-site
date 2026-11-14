import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime } from "../lib/format";

type ArticleDetail = {
  id: string;
  title: string;
  description: string | null;
  reference: string;
  familyLabel: string;
  ownerName: string;
  ownerKind: string;
  location: string;
  publication: string;
  availability: string;
  condition: string | null;
  quantityHint: number | null;
  specs: Record<string, string>;
  terms: Record<string, unknown>;
  publishedAt: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewer: string | null;
  rejectionReason: string | null;
  images: { id: string; url: string }[];
  unavailabilities: { id: string; startDate: string; endDate: string; quantity: number; reason: string | null }[];
  locations: { id: string; reference: string; status: string; commune: string }[];
  dossiers: { id: string; reference: string; status: string; updatedAt: string }[];
  interventions: { id: string; reference: string; stage: string; problem: string; priority: string }[];
  ownershipNote: string;
  acquisitionNote: string;
};

function pubLabel(value: string) {
  if (value === "published") return "Publié";
  if (value === "pending") return "En attente";
  if (value === "paused") return "En pause";
  if (value === "rejected") return "Refusé";
  if (value === "draft") return "Brouillon";
  return value;
}

function availLabel(value: string) {
  if (value === "available") return "Disponible";
  if (value === "rented") return "En location";
  if (value === "maintenance") return "Maintenance";
  return value;
}

export function ArticleDetailPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await apiFetch<{ article: ArticleDetail }>(`/admin/fleet/articles/${id}`);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        nav("/login", { replace: true });
        return;
      }
      setError(res.error);
      return;
    }
    setArticle(res.data.article);
  }

  useEffect(() => {
    void load();
  }, [id, nav]);

  async function publication(action: "pause" | "resume" | "approve" | "reject") {
    setBusy(true);
    setError(null);
    const reason = action === "reject" ? window.prompt("Motif du refus") || "" : undefined;
    if (action === "reject" && !reason) {
      setBusy(false);
      return;
    }
    const res = await apiFetch<{ article: ArticleDetail }>(`/admin/fleet/articles/${id}/publication`, {
      method: "PATCH",
      json: { action, reason },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setArticle(res.data.article);
  }

  if (error && !article) return <p className="as-error" role="alert">{error}</p>;
  if (!article) return <p className="as-empty">Chargement…</p>;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <Link to="/articles">Tous les articles</Link>
        <span> / {article.reference}</span>
      </div>
      <div className="as-toolbar" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h1 className="as-h1">{article.title}</h1>
          <p className="as-lead">
            {article.reference} · {article.familyLabel} · {article.ownerName}
          </p>
        </div>
        <span className="as-badge as-badge--stage">{pubLabel(article.publication)}</span>
        <span className="as-badge as-badge--info">{availLabel(article.availability)}</span>
      </div>

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="as-toolbar">
        {article.publication === "pending" ? (
          <>
            <button type="button" className="as-btn as-btn--yellow" disabled={busy} onClick={() => void publication("approve")}>
              Publier
            </button>
            <button type="button" className="as-btn" disabled={busy} onClick={() => void publication("reject")}>
              Refuser
            </button>
          </>
        ) : null}
        {article.publication === "published" ? (
          <button type="button" className="as-btn" disabled={busy} onClick={() => void publication("pause")}>
            Mettre en pause
          </button>
        ) : null}
        {article.publication === "paused" ? (
          <button type="button" className="as-btn as-btn--yellow" disabled={busy} onClick={() => void publication("resume")}>
            Reprendre la publication
          </button>
        ) : null}
        <Link className="as-btn" to={`/entretien?product=${article.id}`}>
          Ouvrir une immobilisation
        </Link>
      </div>

      <div className="as-split">
        <section className="as-card">
          {article.images[0] ? (
            <img
              src={article.images[0].url}
              alt=""
              style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10, marginBottom: "0.75rem" }}
            />
          ) : (
            <p className="as-empty">Pas d’image.</p>
          )}
          <h2 className="as-h2">Description</h2>
          <p>{article.description || "—"}</p>
          <h2 className="as-h2" style={{ marginTop: "1rem" }}>
            Caractéristiques
          </h2>
          <dl className="as-dl">
            <div>
              <dt>État</dt>
              <dd>{article.condition || "—"}</dd>
            </div>
            <div>
              <dt>Quantité indicative</dt>
              <dd>{article.quantityHint ?? "—"}</dd>
            </div>
            {Object.entries(article.specs)
              .filter(([key]) => key !== "ownerKind")
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
          </dl>
        </section>

        <section className="as-card">
          <h2 className="as-h2">Propriété & publication</h2>
          <dl className="as-dl">
            <div>
              <dt>Propriétaire</dt>
              <dd>
                {article.ownerName} ({article.ownerKind === "onloutou" ? "ONLOUTOU" : "Partenaire"})
              </dd>
            </div>
            <div>
              <dt>Localisation</dt>
              <dd>{article.location}</dd>
            </div>
            <div>
              <dt>Publié le</dt>
              <dd>{article.publishedAt ? formatDateTime(article.publishedAt) : "—"}</dd>
            </div>
            <div>
              <dt>Créé le</dt>
              <dd>{formatDateTime(article.createdAt)}</dd>
            </div>
            <div>
              <dt>Revue</dt>
              <dd>
                {article.reviewedAt ? `${formatDateTime(article.reviewedAt)} · ${article.reviewer || "—"}` : "—"}
              </dd>
            </div>
            {article.rejectionReason ? (
              <div>
                <dt>Motif de refus</dt>
                <dd>{article.rejectionReason}</dd>
              </div>
            ) : null}
          </dl>
          <p className="as-note">{article.ownershipNote}</p>
          <p className="as-note">{article.acquisitionNote}</p>
        </section>
      </div>

      <div className="as-split" style={{ marginTop: "0.85rem" }}>
        <section className="as-card">
          <h2 className="as-h2">Indisponibilités</h2>
          {article.unavailabilities.length === 0 ? (
            <p className="as-empty">Aucune période bloquée.</p>
          ) : (
            <ul className="as-list">
              {article.unavailabilities.map((u) => (
                <li key={u.id}>
                  {u.startDate} → {u.endDate} · qté {u.quantity}
                  {u.reason ? ` · ${u.reason}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="as-card">
          <h2 className="as-h2">Dossiers liés</h2>
          {article.dossiers.length === 0 ? (
            <p className="as-empty">Aucun dossier de location lié.</p>
          ) : (
            <ul className="as-list">
              {article.dossiers.map((d) => (
                <li key={d.id}>
                  <Link to={`/dossiers/${d.id}`}>{d.reference}</Link> · {d.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="as-card" style={{ marginTop: "0.85rem" }}>
        <h2 className="as-h2">Maintenance ouverte</h2>
        {article.interventions.length === 0 ? (
          <p className="as-empty">Pas d’immobilisation en cours.</p>
        ) : (
          <ul className="as-list">
            {article.interventions.map((i) => (
              <li key={i.id}>
                {i.reference} · {i.priority} · {i.stage} — {i.problem}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
