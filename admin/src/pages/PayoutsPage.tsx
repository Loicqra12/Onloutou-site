import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatFcfa } from "../lib/format";

type PayoutRow = {
  id: string;
  reference: string;
  dossier: string;
  partner: string;
  article: string;
  returnConfirmed: boolean;
  amount: number | null;
  adjustments: string;
  status: string;
  blockReason: string | null;
};

type PayoutDetail = PayoutRow & {
  note: string;
  steps: { label: string; done: boolean }[];
  openPath: string | null;
  source?: string;
  grossAmount?: number;
  commissionAmount?: number;
  commissionBps?: number;
  channel?: string | null;
};

function statusLabel(status: string) {
  if (status === "eligible") return "Éligible";
  if (status === "pending_validation") return "En attente de validation";
  if (status === "scheduled") return "Programmé";
  if (status === "paid") return "Payé";
  if (status === "blocked") return "Bloqué";
  if (status === "to_check") return "À vérifier";
  return status;
}

export function PayoutsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<PayoutRow[]>([]);
  const [counts, setCounts] = useState({ eligible: 0, pendingValidation: 0, scheduled: 0, blocked: 0 });
  const [note, setNote] = useState("");
  const [detail, setDetail] = useState<PayoutDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  async function loadList() {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (status !== "all") query.set("status", status);
    const res = await apiFetch<{ items: PayoutRow[]; counts: typeof counts; note: string }>(
      `/admin/finances/payouts?${query}`,
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
    setNote(res.data.note);
    if (!selectedId && res.data.items[0]) {
      const copy = new URLSearchParams(params);
      copy.set("id", res.data.items[0].id);
      setParams(copy, { replace: true });
    }
  }

  useEffect(() => {
    void loadList();
  }, [nav, q, status]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ payout: PayoutDetail }>(`/admin/finances/payouts/${encodeURIComponent(selectedId)}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.payout);
    })();
  }, [selectedId]);

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    if (search.trim()) copy.set("q", search.trim());
    else copy.delete("q");
    if (status !== "all") copy.set("status", status);
    else copy.delete("status");
    setParams(copy, { replace: true });
  }

  async function schedule() {
    if (!selectedId) return;
    setPending(true);
    const res = await apiFetch<{ ok: true; payout: PayoutDetail }>(
      `/admin/finances/payouts/${encodeURIComponent(selectedId)}/schedule`,
      { method: "POST", json: {} },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.payout);
    setNotice("Reversement programmé. Aucune exécution bancaire automatique.");
    await loadList();
  }

  async function block() {
    if (!selectedId || !blockReason.trim()) {
      setError("Indiquez un motif de blocage.");
      return;
    }
    setPending(true);
    const res = await apiFetch<{ ok: true; payout: PayoutDetail }>(
      `/admin/finances/payouts/${encodeURIComponent(selectedId)}/block`,
      { method: "POST", json: { reason: blockReason.trim() } },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.payout);
    setNotice("Reversement bloqué.");
    await loadList();
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Finances / Reversements partenaires</span>
      </div>
      <h1 className="as-h1">Reversements partenaires</h1>
      {note ? <p className="as-banner as-banner--warn">{note}</p> : null}

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.eligible}</strong>
          <span>Éligibles</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.pendingValidation}</strong>
          <span>En attente de validation</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.scheduled}</strong>
          <span>Programmés</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.blocked}</strong>
          <span>Bloqués</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("Les lots de reversement seront préparés après validation des commissions.")}>
          + Préparer un lot
        </button>
        <input className="as-field" placeholder="Partenaire, dossier…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="eligible">Éligible</option>
          <option value="pending_validation">À valider</option>
          <option value="scheduled">Programmé</option>
          <option value="blocked">Bloqué</option>
        </select>
        <button type="submit" className="as-btn">
          Filtrer
        </button>
      </form>

      {notice ? <p className="as-note">{notice}</p> : null}
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
                <th>Partenaire</th>
                <th>Dossier</th>
                <th>Article</th>
                <th>Retour</th>
                <th>Montant</th>
                <th>Ajustements</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="as-empty">Aucun reversement à afficher.</p>
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
                    <td data-label="Partenaire">{row.partner}</td>
                    <td data-label="Dossier">{row.dossier}</td>
                    <td data-label="Article">{row.article}</td>
                    <td data-label="Retour">{row.returnConfirmed ? "Confirmé" : "—"}</td>
                    <td data-label="Montant">{row.amount != null ? formatFcfa(row.amount) : "—"}</td>
                    <td data-label="Ajustements">{row.adjustments}</td>
                    <td data-label="Statut">
                      <span className={`as-badge ${row.status === "paid" || row.status === "scheduled" ? "as-badge--stage" : "as-badge--warn"}`}>
                        {statusLabel(row.status)}
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
              <h2>
                {detail.partner} · {detail.reference}
              </h2>
              <span className="as-badge as-badge--warn">{statusLabel(detail.status)}</span>
            </div>
            <div className="as-head__actions">
              {detail.openPath ? (
                <Link className="as-btn" to={detail.openPath}>
                  Ouvrir sur le dossier
                </Link>
              ) : null}
              {detail.status === "pending_validation" || detail.status === "eligible" ? (
                <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void schedule()}>
                  Approuver et programmer
                </button>
              ) : null}
            </div>
          </div>
          <p className="as-note">{detail.note}</p>
          <div className="as-people-grid">
            <div>
              <h3>Opération</h3>
              <p>
                <small>Dossier</small>
                {detail.dossier}
              </p>
              <p>
                <small>Article</small>
                {detail.article}
              </p>
              <p>
                <small>Montant proposé</small>
                {detail.amount != null ? formatFcfa(detail.amount) : "—"}
              </p>
              {detail.commissionAmount != null ? (
                <p>
                  <small>Commission (à valider)</small>
                  {formatFcfa(detail.commissionAmount)} ({(detail.commissionBps || 0) / 100} %)
                </p>
              ) : null}
            </div>
            <div>
              <h3>Workflow</h3>
              <ul className="as-todo as-todo--done">
                {detail.steps.map((step) => (
                  <li key={step.label} className={step.done ? "is-done" : undefined}>
                    {step.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Blocage</h3>
              {detail.status === "blocked" ? (
                <p className="as-note">Motif : {detail.blockReason || "—"}</p>
              ) : (
                <>
                  <label>
                    Motif
                    <textarea className="as-field" rows={3} value={blockReason} onChange={(e) => setBlockReason(e.target.value)} />
                  </label>
                  <button type="button" className="as-btn" style={{ marginTop: "0.55rem" }} disabled={pending} onClick={() => void block()}>
                    Bloquer avec motif
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
