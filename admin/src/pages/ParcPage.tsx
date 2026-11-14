import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

type ParcItem = {
  id: string;
  title: string;
  reference: string;
  familyLabel: string;
  location: string;
  availability: string;
  publication: string;
  nextAction: string;
  imageUrl: string | null;
  ownerName: string;
};

type ParcPayload = {
  lead: string;
  items: ParcItem[];
  total: number;
  counts: { articles: number; disponibles: number; loues: number; maintenance: number; aControler: number };
  alerts: { controlesEnRetard: number; documentsExpirant: number; retoursAControler: number };
  tasks: { label: string; level: string }[];
  byFamily: { label: string; count: number }[];
  bySite: { label: string; count: number }[];
  emptyNote: string | null;
};

function availLabel(value: string) {
  if (value === "available") return "Disponible";
  if (value === "rented") return "Loué";
  if (value === "maintenance") return "Maintenance";
  return value;
}

export function ParcPage() {
  const nav = useNavigate();
  const [data, setData] = useState<ParcPayload | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load(search = q) {
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    const res = await apiFetch<ParcPayload>(`/admin/fleet/parc?${query}`);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        nav("/login", { replace: true });
        return;
      }
      setError(res.error);
      return;
    }
    setData(res.data);
  }

  useEffect(() => {
    void load("");
  }, [nav]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    void load(q);
  }

  if (error) return <p className="as-error" role="alert">{error}</p>;
  if (!data) return <p className="as-empty">Chargement…</p>;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Articles & parc / Parc ONLOUTOU</span>
      </div>
      <h1 className="as-h1">Parc ONLOUTOU</h1>
      <p className="as-lead">{data.lead}</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{data.counts.articles}</strong>
          <span>Articles ONLOUTOU</span>
        </div>
        <div className="as-kpi">
          <strong>{data.counts.disponibles}</strong>
          <span>Disponibles</span>
        </div>
        <div className="as-kpi">
          <strong>{data.counts.loues}</strong>
          <span>Loués</span>
        </div>
        <div className="as-kpi">
          <strong>{data.counts.maintenance}</strong>
          <span>Maintenance</span>
        </div>
        <div className="as-kpi">
          <strong>{data.counts.aControler}</strong>
          <span>À contrôler</span>
        </div>
      </div>

      <div className="as-split">
        <section className="as-card">
          <h2 className="as-h2">Alertes parc</h2>
          <ul className="as-list">
            <li>Contrôles en retard : {data.alerts.controlesEnRetard}</li>
            <li>Documents expirant : {data.alerts.documentsExpirant}</li>
            <li>Retours à contrôler : {data.alerts.retoursAControler}</li>
          </ul>
        </section>
        <section className="as-card">
          <h2 className="as-h2">Tâches parc</h2>
          {data.tasks.length === 0 ? (
            <p className="as-empty">Rien à traiter pour l’instant.</p>
          ) : (
            <ul className="as-list">
              {data.tasks.map((task) => (
                <li key={task.label}>
                  <span className={`as-badge ${task.level === "priority" ? "as-badge--warn" : "as-badge--info"}`}>{task.level}</span>{" "}
                  {task.label}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="as-split" style={{ marginTop: "0.85rem" }}>
        <section className="as-card">
          <h2 className="as-h2">Répartition par famille</h2>
          {data.byFamily.length === 0 ? (
            <p className="as-empty">—</p>
          ) : (
            <ul className="as-list">
              {data.byFamily.map((row) => (
                <li key={row.label}>
                  {row.label} · {row.count}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="as-card">
          <h2 className="as-h2">Répartition par site</h2>
          {data.bySite.length === 0 ? (
            <p className="as-empty">—</p>
          ) : (
            <ul className="as-list">
              {data.bySite.map((row) => (
                <li key={row.label}>
                  {row.label} · {row.count}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <form className="as-toolbar" onSubmit={onSearch} style={{ marginTop: "0.85rem" }}>
        <input className="as-field" placeholder="Recherche parc…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit" className="as-btn">
          Filtrer
        </button>
        <Link className="as-btn as-btn--yellow" to="/articles">
          Voir l’inventaire unifié
        </Link>
      </form>

      {data.emptyNote ? <p className="as-note">{data.emptyNote}</p> : null}

      <section className="as-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Référence</th>
                <th>Famille</th>
                <th>Site</th>
                <th>Disponibilité</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="as-empty">Aucun bien ONLOUTOU pour l’instant.</p>
                  </td>
                </tr>
              ) : (
                data.items.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Article">
                      <Link to={`/articles/${row.id}`}>{row.title}</Link>
                    </td>
                    <td data-label="Référence">{row.reference}</td>
                    <td data-label="Famille">{row.familyLabel}</td>
                    <td data-label="Site">{row.location}</td>
                    <td data-label="Dispo">
                      <span className="as-badge as-badge--info">{availLabel(row.availability)}</span>
                    </td>
                    <td data-label="Action">
                      <Link to={`/articles/${row.id}`}>{row.nextAction === "Aucune" ? "Voir" : row.nextAction}</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
