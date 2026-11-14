import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, formatFcfa } from "../lib/format";

type PaymentRow = {
  id: string;
  reference: string;
  requestId: string;
  dossier: string;
  client: string;
  type: string;
  channel: string;
  amount: number | null;
  date: string | null;
  status: string;
  assignee: string | null;
};

type PaymentDetail = PaymentRow & {
  note: string;
  dossierId: string;
  timeline: { label: string; at: string | null; done: boolean }[];
  allocation: { totalDue: number | null; paid: number; remaining: number | null };
  receipt: string | null;
  events: { at: string; label: string }[];
};

function typeLabel(type: string) {
  if (type === "acompte") return "Acompte";
  if (type === "solde") return "Solde";
  if (type === "remboursement") return "Remboursement";
  return type;
}

function statusLabel(status: string) {
  if (status === "confirmed") return "Confirmé";
  if (status === "to_reconcile") return "À rapprocher";
  if (status === "to_refund") return "À rembourser";
  if (status === "refunded") return "Remboursé";
  if (status === "failed") return "Échoué";
  return status;
}

export function PaymentsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [type, setType] = useState(params.get("type") ?? "all");
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<PaymentRow[]>([]);
  const [counts, setCounts] = useState({ toReconcile: 0, confirmedToday: 0, refundsToValidate: 0, failures: 0 });
  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (type !== "all") query.set("type", type);
      if (status !== "all") query.set("status", status);
      const res = await apiFetch<{ items: PaymentRow[]; counts: typeof counts }>(`/admin/finances/payments?${query}`);
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
      if (!selectedId && res.data.items[0]) {
        const copy = new URLSearchParams(params);
        copy.set("id", res.data.items[0].id);
        setParams(copy, { replace: true });
      }
    })();
  }, [nav, q, type, status]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ payment: PaymentDetail }>(`/admin/finances/payments/${encodeURIComponent(selectedId)}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.payment);
    })();
  }, [selectedId]);

  function selectRow(id: string) {
    const copy = new URLSearchParams(params);
    copy.set("id", id);
    setParams(copy, { replace: true });
  }

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    if (search.trim()) copy.set("q", search.trim());
    else copy.delete("q");
    if (type !== "all") copy.set("type", type);
    else copy.delete("type");
    if (status !== "all") copy.set("status", status);
    else copy.delete("status");
    setParams(copy, { replace: true });
  }

  async function reconcile() {
    if (!selectedId) return;
    setPending(true);
    const res = await apiFetch<{ ok: true; payment: PaymentDetail }>(
      `/admin/finances/payments/${encodeURIComponent(selectedId)}/reconcile`,
      { method: "POST", json: {} },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.payment);
    setNotice("Rapprochement enregistré.");
    setItems((rows) => rows.map((r) => (r.id === selectedId ? { ...r, status: "confirmed" } : r)));
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Finances / Paiements & remboursements</span>
      </div>
      <h1 className="as-h1">Paiements & remboursements</h1>
      <p className="as-banner as-banner--warn">
        ONLOUTOU encaisse le client. Le reversement partenaire est une opération distincte.
      </p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.toReconcile}</strong>
          <span>À rapprocher</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.confirmedToday}</strong>
          <span>Confirmés aujourd’hui</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.refundsToValidate}</strong>
          <span>Remboursements à valider</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.failures}</strong>
          <span>Échecs à traiter</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <input className="as-field" placeholder="Réf., dossier, client…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Type</option>
          <option value="acompte">Acompte</option>
          <option value="solde">Solde</option>
          <option value="remboursement">Remboursement</option>
        </select>
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="to_reconcile">À rapprocher</option>
          <option value="confirmed">Confirmé</option>
          <option value="to_refund">À rembourser</option>
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
                <th>Référence</th>
                <th>Dossier</th>
                <th>Client</th>
                <th>Type</th>
                <th>Canal</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <p className="as-empty">Aucun paiement enregistré sur les dossiers.</p>
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={row.id === selectedId ? "as-row--on" : undefined}
                    style={{ cursor: "pointer" }}
                    onClick={() => selectRow(row.id)}
                  >
                    <td data-label="Référence">{row.reference}</td>
                    <td data-label="Dossier">{row.dossier}</td>
                    <td data-label="Client">{row.client}</td>
                    <td data-label="Type">{typeLabel(row.type)}</td>
                    <td data-label="Canal">{row.channel}</td>
                    <td data-label="Montant">{row.amount != null ? formatFcfa(row.amount) : "—"}</td>
                    <td data-label="Date">{row.date ? formatDateTime(row.date) : "—"}</td>
                    <td data-label="Statut">
                      <span className={`as-badge ${row.status === "confirmed" || row.status === "refunded" ? "as-badge--stage" : "as-badge--warn"}`}>
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
              <h2>{detail.reference}</h2>
              <span className={`as-badge ${detail.status === "confirmed" ? "as-badge--stage" : "as-badge--warn"}`}>
                {statusLabel(detail.status)}
              </span>
            </div>
            <div className="as-head__actions">
              <Link className="as-btn" to={`/dossiers/${detail.dossierId}`}>
                Ouvrir le dossier
              </Link>
              {detail.status === "to_reconcile" ? (
                <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void reconcile()}>
                  Rapprocher maintenant
                </button>
              ) : null}
            </div>
          </div>
          <p className="as-note">{detail.note}</p>
          <div className="as-people-grid">
            <div>
              <h3>Détails</h3>
              <p>
                <small>Dossier</small>
                {detail.dossier}
              </p>
              <p>
                <small>Client</small>
                {detail.client}
              </p>
              <p>
                <small>Type / canal</small>
                {typeLabel(detail.type)} · {detail.channel}
              </p>
              <p>
                <small>Montant</small>
                {detail.amount != null ? formatFcfa(detail.amount) : "Non renseigné"}
              </p>
              <p>
                <small>Responsable</small>
                {detail.assignee || "Non affecté"}
              </p>
            </div>
            <div>
              <h3>Chronologie</h3>
              <ul className="as-todo as-todo--done">
                {detail.timeline.map((step) => (
                  <li key={step.label} className={step.done ? "is-done" : undefined}>
                    {step.label}
                    {step.at ? ` · ${formatDateTime(step.at)}` : ""}
                  </li>
                ))}
              </ul>
              <h3 style={{ marginTop: "1rem" }}>Répartition dossier</h3>
              <p>
                Total dû : {detail.allocation.totalDue != null ? formatFcfa(detail.allocation.totalDue) : "Non calculé"}
              </p>
              <p>Encaissé : {formatFcfa(detail.allocation.paid)}</p>
              <p>
                Reste :{" "}
                {detail.allocation.remaining != null ? formatFcfa(detail.allocation.remaining) : "—"}
              </p>
            </div>
            <div>
              <h3>Remboursement</h3>
              <p className="as-empty">
                Les remboursements de dépôt se préparent sur le dossier (Finances → dépôt). Aucune exécution automatique ici.
              </p>
              {detail.type === "remboursement" ? (
                <Link className="as-btn as-btn--yellow" to={`/depots-garantie?id=${detail.dossierId}`}>
                  Voir le dépôt
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
