import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime } from "../lib/format";

type AuditRow = {
  id: string;
  actionLabel: string;
  module: string;
  level: string;
  result: string;
  createdAt: string;
  actorName: string;
  actorRole: string;
  targetType: string | null;
  targetId: string | null;
  ipMasked: string | null;
  fingerprint: string;
  sensitive: boolean;
};

type AuditEvent = AuditRow & {
  actor: { id: string; name: string; emailMasked: string | null; role: string } | null;
  metadata: unknown;
  integrity: string;
  retention: string;
  chain: { id: string; actionLabel: string; createdAt: string }[];
};

function levelLabel(level: string) {
  if (level === "critique") return "Critique";
  if (level === "attention") return "Attention";
  return "Information";
}

export function JournalPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const level = params.get("level") ?? "all";
  const [search, setSearch] = useState(q);
  const [items, setItems] = useState<AuditRow[]>([]);
  const [counts, setCounts] = useState({ today: 0, sensitiveToday: 0, loginFails: 0, exports: 0 });
  const [banner, setBanner] = useState("");
  const [detail, setDetail] = useState<AuditEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams({ take: "80" });
      if (q) query.set("q", q);
      if (level !== "all") query.set("level", level);
      const res = await apiFetch<{ items: AuditRow[]; counts: typeof counts; banner: string }>(
        `/admin/ops/audit-desk?${query}`,
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
      setCounts(res.data.counts);
      setBanner(res.data.banner);
      if (!selectedId && res.data.items[0]) {
        const copy = new URLSearchParams(params);
        copy.set("id", res.data.items[0].id);
        setParams(copy, { replace: true });
      }
    })();
  }, [nav, q, level]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ event: AuditEvent }>(`/admin/ops/audit-desk/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.event);
    })();
  }, [selectedId]);

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    if (search.trim()) copy.set("q", search.trim());
    else copy.delete("q");
    if (level !== "all") copy.set("level", level);
    setParams(copy, { replace: true });
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / Journal d’activité</span>
      </div>
      <h1 className="as-h1">Journal d’activité</h1>
      {banner ? <p className="as-banner as-banner--warn">{banner}</p> : null}

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.today}</strong>
          <span>Événements aujourd’hui</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.sensitiveToday}</strong>
          <span>Actions sensibles</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.loginFails}</strong>
          <span>Alertes auth (reset)</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.exports}</strong>
          <span>Exports réalisés</span>
          <small>Non journalisés encore</small>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <input className="as-field" placeholder="Action, acteur, objet…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          className="as-field"
          value={level}
          onChange={(e) => {
            const copy = new URLSearchParams(params);
            if (e.target.value === "all") copy.delete("level");
            else copy.set("level", e.target.value);
            setParams(copy, { replace: true });
          }}
        >
          <option value="all">Niveau</option>
          <option value="info">Information</option>
          <option value="attention">Attention</option>
          <option value="critique">Critique</option>
        </select>
        <button type="submit" className="as-btn">
          Filtrer
        </button>
      </form>

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}

      <section className="as-card" style={{ marginBottom: "0.85rem" }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Module</th>
                <th>Action</th>
                <th>Objet</th>
                <th>Résultat</th>
                <th>Niveau</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <p className="as-empty">Aucune action journalisée.</p>
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={row.id === selectedId ? "as-row--on" : undefined}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const copy = new URLSearchParams(params);
                      copy.set("id", row.id);
                      setParams(copy, { replace: true });
                    }}
                  >
                    <td data-label="Date">{formatDateTime(row.createdAt)}</td>
                    <td data-label="Utilisateur">{row.actorName}</td>
                    <td data-label="Rôle">{row.actorRole}</td>
                    <td data-label="Module">{row.module}</td>
                    <td data-label="Action">{row.actionLabel}</td>
                    <td data-label="Objet">{row.targetType ? `${row.targetType} ${row.targetId || ""}` : "—"}</td>
                    <td data-label="Résultat">{row.result}</td>
                    <td data-label="Niveau">
                      <span className={`as-badge ${row.level === "info" ? "as-badge--info" : "as-badge--warn"}`}>
                        {levelLabel(row.level)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detail ? (
        <section className="as-card as-people-detail">
          <div className="as-card__head">
            <div>
              <h2>Événement : {detail.actionLabel}</h2>
              {detail.sensitive ? <span className="as-badge as-badge--warn">Action sensible</span> : null}
            </div>
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Acteur</h3>
              <p>{detail.actor?.name || "Système"}</p>
              <p>
                <small>Rôle</small>
                {detail.actor?.role || "SYSTEM"}
              </p>
              <p>
                <small>E-mail</small>
                {detail.actor?.emailMasked || "—"}
              </p>
              <h3 style={{ marginTop: "1rem" }}>Objet lié</h3>
              <p>
                {detail.targetType || "—"} {detail.targetId || ""}
              </p>
              <p>
                <small>IP / session</small>
                {detail.ipMasked || "—"}
              </p>
            </div>
            <div>
              <h3>Métadonnées</h3>
              <pre className="as-empty" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {JSON.stringify(detail.metadata ?? {}, null, 2)}
              </pre>
              <h3 style={{ marginTop: "1rem" }}>Chaîne corrélée</h3>
              <ul className="as-todo as-todo--done">
                {detail.chain.map((c) => (
                  <li key={c.id} className="is-done">
                    {c.actionLabel} · {formatDateTime(c.createdAt)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Vérification d’intégrité</h3>
              <p>
                <small>Identifiant</small>
                {detail.id}
              </p>
              <p>
                <small>Empreinte</small>
                {detail.fingerprint}
              </p>
              <p className="as-note">{detail.integrity}</p>
              <p className="as-empty">{detail.retention}</p>
              <p className="as-banner as-banner--ok">Journal en lecture seule — aucune modification possible ici.</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
