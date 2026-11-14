import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import {
  IconCal,
  IconPhone,
  IconPin,
  IconPlus,
  IconReset,
  IconSearch,
  IconWeb,
  IconWhatsApp,
} from "../components/NavIcons";
import { formatDateTime, initials } from "../lib/format";

type DossierRow = {
  id: string;
  reference: string;
  status: string;
  stage: string;
  nextAction: string;
  title: string;
  need: string;
  period: string | null;
  place: string | null;
  source: string;
  sourceKey: "web" | "phone" | "whatsapp" | "other";
  assignee: string | null;
  createdAt: string;
};

type Counts = {
  all: number;
  qualify: number;
  proposition: number;
  confirmed: number;
  running: number;
  closed: number;
};

const PAGE_SIZE = 8;

const BUCKETS: { id: string; label: string; key: keyof Counts }[] = [
  { id: "all", label: "Tous", key: "all" },
  { id: "qualify", label: "À qualifier", key: "qualify" },
  { id: "proposition", label: "Proposition", key: "proposition" },
  { id: "confirmed", label: "Confirmés", key: "confirmed" },
  { id: "running", label: "En cours", key: "running" },
  { id: "closed", label: "Clôturés", key: "closed" },
];

function SourceMark({ sourceKey, label }: { sourceKey: DossierRow["sourceKey"]; label: string }) {
  const Icon = sourceKey === "whatsapp" ? IconWhatsApp : sourceKey === "phone" ? IconPhone : IconWeb;
  return (
    <span className={`as-source as-source--${sourceKey}`}>
      <Icon />
      {label}
    </span>
  );
}

export function DossiersPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const bucket = params.get("bucket") ?? "all";
  const origin = params.get("origin") ?? "all";
  const assignee = params.get("assignee") ?? "all";
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const [items, setItems] = useState<DossierRow[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Counts>({
    all: 0,
    qualify: 0,
    proposition: 0,
    confirmed: 0,
    running: 0,
    closed: 0,
  });
  const [assignees, setAssignees] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams({ take: String(PAGE_SIZE), skip: String((page - 1) * PAGE_SIZE) });
      if (q) query.set("q", q);
      if (bucket !== "all") query.set("bucket", bucket);
      if (origin !== "all") query.set("origin", origin);
      if (assignee !== "all") query.set("assignee", assignee);
      const res = await apiFetch<{
        items: DossierRow[];
        total: number;
        counts: Counts;
        assignees: { id: string; name: string }[];
      }>(`/admin/requests?${query}`);
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
      setAssignees(res.data.assignees ?? []);
    })();
  }, [nav, q, bucket, origin, assignee, page]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value === "all" || !value) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setParams(next);
  }

  function resetFilters() {
    setParams(new URLSearchParams());
    setSearch("");
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, page * PAGE_SIZE);

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / Dossiers de location</span>
      </div>
      <div className="as-head">
        <div>
          <h1 className="as-h1">Dossiers de location</h1>
          <p className="as-lead">Un dossier unique, du premier contact à la clôture.</p>
        </div>
        <div className="as-head__actions">
          <Link className="as-btn as-btn--yellow" to="/dossiers/nouveau">
            <IconPlus />
            Créer un dossier
          </Link>
        </div>
      </div>

      <div className="as-filters">
        {BUCKETS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`as-chip${bucket === chip.id ? " is-on" : ""}`}
            onClick={() => setFilter("bucket", chip.id)}
          >
            {chip.label} ({counts[chip.key]})
          </button>
        ))}
      </div>

      <section className="as-card as-toolbar-card">
        <form
          className="as-search as-search--inset"
          onSubmit={(e) => {
            e.preventDefault();
            const typed = String(new FormData(e.currentTarget).get("q") ?? "").trim();
            setFilter("q", typed || search.trim());
          }}
        >
          <IconSearch />
          <input
            name="q"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Client, référence ou article"
            aria-label="Rechercher un dossier"
          />
        </form>
        <label className="as-select">
          <span>Source</span>
          <select value={origin} onChange={(e) => setFilter("origin", e.target.value)}>
            <option value="all">Toutes les sources</option>
            <option value="web">Site</option>
            <option value="phone">Téléphone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="other">Autre</option>
          </select>
        </label>
        <label className="as-select">
          <span>Responsable</span>
          <select value={assignee} onChange={(e) => setFilter("assignee", e.target.value)}>
            <option value="all">Toute l’équipe</option>
            <option value="none">Non affecté</option>
            {assignees.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="as-btn" onClick={resetFilters}>
          <IconReset />
          Réinitialiser
        </button>
      </section>

      <section className="as-card">
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {items.length === 0 && !error ? (
          <p className="as-empty">
            {bucket === "confirmed" || bucket === "running"
              ? "Aucun dossier n’est encore à cette étape. La confirmation et le suivi de location s’ouvriront ici sans inventer de statut."
              : "Aucun dossier ne correspond à cette recherche."}
          </p>
        ) : (
          <table className="as-table as-table--dossiers">
            <thead>
              <tr>
                <th>Dossier</th>
                <th>Client & articles</th>
                <th>Source</th>
                <th>Période & lieu</th>
                <th>Étape</th>
                <th>Responsable</th>
                <th>Prochaine action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link className="as-ref" to={`/dossiers/${row.id}`}>
                      {row.reference}
                    </Link>
                    <small>Créé le {formatDateTime(row.createdAt)}</small>
                  </td>
                  <td>
                    <strong>{row.title}</strong>
                    <small>{row.need || "Articles à préciser"}</small>
                  </td>
                  <td>
                    <SourceMark sourceKey={row.sourceKey} label={row.source} />
                  </td>
                  <td>
                    <span className="as-meta">
                      <IconCal />
                      {row.period ?? "Période à confirmer"}
                    </span>
                    <span className="as-meta">
                      <IconPin />
                      {row.place ?? "Lieu à confirmer"}
                    </span>
                  </td>
                  <td>
                    <span className={`as-badge as-badge--${row.status.toLowerCase()}`}>{row.stage}</span>
                  </td>
                  <td>
                    <span className="as-person">
                      {row.assignee ? <b>{initials(row.assignee)}</b> : null}
                      {row.assignee ?? "—"}
                    </span>
                  </td>
                  <td>
                    <Link className="as-btn as-btn--yellow as-btn--next" to={`/dossiers/${row.id}`} aria-label={`Ouvrir ${row.reference}`}>
                      {row.nextAction} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="as-pager">
          <p className="as-count">
            {total === 0 ? "0 dossier" : `${from}–${to} sur ${total} dossier${total > 1 ? "s" : ""}`}
          </p>
          <div className="as-pager__btns">
            <button type="button" className="as-chip" disabled={page <= 1} onClick={() => setFilter("page", String(page - 1))}>
              ‹
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
              .map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`as-chip${n === page ? " is-on" : ""}`}
                  onClick={() => setFilter("page", String(n))}
                >
                  {n}
                </button>
              ))}
            <button
              type="button"
              className="as-chip"
              disabled={page >= pages}
              onClick={() => setFilter("page", String(page + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <aside className="as-banner">
        <p>Un appel ou un message WhatsApp ? Créez le dossier ici et retrouvez tout le suivi au même endroit.</p>
        <Link className="as-btn as-btn--yellow" to="/dossiers/nouveau">
          Créer un dossier
        </Link>
      </aside>
    </div>
  );
}
