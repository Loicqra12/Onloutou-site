import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime } from "../lib/format";

type ArticleRow = {
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
  nextAction: string;
  imageUrl: string | null;
  updatedAt: string;
};

function pubLabel(value: string) {
  if (value === "published") return "Publié";
  if (value === "pending") return "En attente de validation";
  if (value === "paused") return "En pause";
  if (value === "rejected") return "Refusé";
  if (value === "draft") return "Brouillon";
  return value;
}

function availLabel(value: string) {
  if (value === "available") return "Disponible";
  if (value === "rented") return "En location";
  if (value === "maintenance") return "Maintenance";
  if (value === "paused") return "En pause";
  if (value === "pending") return "À valider";
  return "Indisponible";
}

const VIEWS = [
  { id: "tous", label: "Tous" },
  { id: "disponibles", label: "Disponibles" },
  { id: "location", label: "En location" },
  { id: "maintenance", label: "Maintenance" },
  { id: "partenaires", label: "Partenaires à valider" },
] as const;

export function ArticlesPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const view = params.get("view") ?? "tous";
  const owner = params.get("owner") ?? "all";
  const family = params.get("family") ?? "all";
  const [search, setSearch] = useState(q);
  const [items, setItems] = useState<ArticleRow[]>([]);
  const [counts, setCounts] = useState({ actifs: 0, enLocation: 0, aControler: 0, enAttente: 0 });
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams({ take: "40" });
      if (q) query.set("q", q);
      if (view !== "tous") query.set("view", view);
      if (owner !== "all") query.set("owner", owner);
      if (family !== "all") query.set("family", family);
      const res = await apiFetch<{ items: ArticleRow[]; total: number; counts: typeof counts }>(
        `/admin/fleet/articles?${query}`,
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(res.error);
        return;
      }
      setItems(res.data.items);
      setTotal(res.data.total);
      setCounts(res.data.counts);
    })();
  }, [nav, q, view, owner, family]);

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    if (search.trim()) copy.set("q", search.trim());
    else copy.delete("q");
    setParams(copy, { replace: true });
  }

  function toggle(id: string) {
    setSelected((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]));
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Articles & parc / Tous les articles</span>
      </div>
      <h1 className="as-h1">Tous les articles</h1>
      <p className="as-lead">Inventaire unifié ONLOUTOU et partenaires.</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.actifs}</strong>
          <span>Articles actifs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.enLocation}</strong>
          <span>En location</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.aControler}</strong>
          <span>À contrôler</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.enAttente}</strong>
          <span>En attente de validation</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("Ajout d’un bien ONLOUTOU : à ouvrir après le flux d’acquisition.")}>
          Ajouter un article ONLOUTOU
        </button>
        <button type="button" className="as-btn" onClick={() => setNotice("Export inventaire : bientôt.")}>
          Exporter
        </button>
        <Link className="as-btn" to="/parametres?section=familles">
          Gérer familles et catégories
        </Link>
        <input className="as-field" placeholder="Recherche référence / nom…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          className="as-field"
          value={owner}
          onChange={(e) => {
            const copy = new URLSearchParams(params);
            if (e.target.value === "all") copy.delete("owner");
            else copy.set("owner", e.target.value);
            setParams(copy, { replace: true });
          }}
        >
          <option value="all">Propriétaire</option>
          <option value="onloutou">ONLOUTOU</option>
          <option value="partner">Partenaires</option>
        </select>
        <button type="submit" className="as-btn">
          Filtrer
        </button>
      </form>

      <div className="as-prop-pills" style={{ marginBottom: "0.75rem" }}>
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`as-badge ${view === item.id ? "as-badge--stage" : "as-badge--info"}`}
            onClick={() => {
              const copy = new URLSearchParams(params);
              if (item.id === "tous") copy.delete("view");
              else copy.set("view", item.id);
              setParams(copy, { replace: true });
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice ? <p className="as-note">{notice}</p> : null}
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}

      {selected.length ? (
        <p className="as-note">
          {selected.length} article{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""} · actions groupées bientôt
        </p>
      ) : null}

      <section className="as-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th />
                <th>Article</th>
                <th>Référence</th>
                <th>Famille</th>
                <th>Propriétaire</th>
                <th>Localisation</th>
                <th>Publication</th>
                <th>Disponibilité</th>
                <th>Prochaine action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <p className="as-empty">Aucun article trouvé.</p>
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} />
                    </td>
                    <td data-label="Article">
                      <Link to={`/articles/${row.id}`} className="as-person" style={{ textDecoration: "none", color: "inherit" }}>
                        {row.imageUrl ? <img src={row.imageUrl} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} /> : <b>··</b>}
                        <span>
                          <strong>{row.title}</strong>
                          <small>{row.description || "—"}</small>
                        </span>
                      </Link>
                    </td>
                    <td data-label="Référence">{row.reference}</td>
                    <td data-label="Famille">{row.familyLabel}</td>
                    <td data-label="Propriétaire">{row.ownerName}</td>
                    <td data-label="Localisation">{row.location}</td>
                    <td data-label="Publication">
                      <span className={`as-badge ${row.publication === "published" ? "as-badge--stage" : "as-badge--warn"}`}>
                        {pubLabel(row.publication)}
                      </span>
                    </td>
                    <td data-label="Disponibilité">
                      <span className={`as-badge ${row.availability === "available" ? "as-badge--stage" : "as-badge--info"}`}>
                        {availLabel(row.availability)}
                      </span>
                    </td>
                    <td data-label="Action">
                      <Link to={`/articles/${row.id}`}>{row.nextAction === "Aucune" ? "Voir la fiche" : row.nextAction}</Link>
                      <small style={{ display: "block" }}>{formatDateTime(row.updatedAt)}</small>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="as-empty" style={{ marginTop: "0.65rem" }}>
          1 – {items.length} sur {total} articles
        </p>
      </section>
    </div>
  );
}
