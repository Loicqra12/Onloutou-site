import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, formatFcfa } from "../lib/format";

type InvoiceRow = {
  id: string;
  reference: string;
  provisional: boolean;
  type: string;
  dossier: string;
  client: string;
  date: string;
  dueDate: string | null;
  total: number | null;
  paymentStatus: string;
  status: string;
  assignee: string | null;
};

type InvoiceDetail = InvoiceRow & {
  issuer: string;
  clientDetail: { name: string; email: string | null; phone: string | null; zone: string | null };
  lines: { id: string; label: string; qty: number; unitPrice: number | null; total: number | null }[];
  payments: { reference: string; amount: number | null; channel: string; at: string }[];
  journalNote: string;
  controls: { numbering: string; lockAfterIssue: boolean; accountingValidation: string };
  openPath: string;
};

function statusLabel(status: string) {
  if (status === "draft") return "Brouillon";
  if (status === "issued") return "Émise";
  if (status === "paid") return "Payée";
  return status;
}

function payStatusLabel(status: string) {
  if (status === "paid") return "Payé";
  if (status === "partial") return "Partiel";
  return "Non payé";
}

export function InvoicesPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<InvoiceRow[]>([]);
  const [counts, setCounts] = useState({ toIssue: 0, issuedThisMonth: 0, creditNotes: 0, exportsPending: 0 });
  const [banner, setBanner] = useState("");
  const [detail, setDetail] = useState<InvoiceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (status !== "all") query.set("status", status);
      const res = await apiFetch<{ items: InvoiceRow[]; counts: typeof counts; banner: string }>(
        `/admin/finances/invoices?${query}`,
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
  }, [nav, q, status]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ invoice: InvoiceDetail }>(`/admin/finances/invoices/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.invoice);
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

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Finances / Facturation & comptabilité</span>
      </div>
      <h1 className="as-h1">Facturation & comptabilité</h1>
      {banner ? <p className="as-banner as-banner--warn">{banner}</p> : null}

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.toIssue}</strong>
          <span>Factures à émettre</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.issuedThisMonth}</strong>
          <span>Émises ce mois</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.creditNotes}</strong>
          <span>Avoirs à valider</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.exportsPending}</strong>
          <span>Écritures à exporter</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button
          type="button"
          className="as-btn as-btn--yellow"
          onClick={() => setNotice("Émission définitive bloquée tant que TVA et numérotation ne sont pas validées.")}
        >
          + Créer une facture
        </button>
        <button type="button" className="as-btn" onClick={() => setNotice("Export comptable disponible après validation du plan comptable.")}>
          Export comptable
        </button>
        <input className="as-field" placeholder="Document, dossier, client…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="draft">Brouillon</option>
          <option value="issued">Émise</option>
          <option value="paid">Payée</option>
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
                <th>Document</th>
                <th>Type</th>
                <th>Dossier</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paiement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <p className="as-empty">Aucun document de facturation amorcé.</p>
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
                    <td data-label="Document">
                      {row.reference}
                      {row.provisional ? <small> provisoire</small> : null}
                    </td>
                    <td data-label="Type">{row.type}</td>
                    <td data-label="Dossier">{row.dossier}</td>
                    <td data-label="Client">{row.client}</td>
                    <td data-label="Date">{formatDateTime(row.date)}</td>
                    <td data-label="Total">{row.total != null ? formatFcfa(row.total) : "—"}</td>
                    <td data-label="Paiement">{payStatusLabel(row.paymentStatus)}</td>
                    <td data-label="Statut">
                      <span className={`as-badge ${row.status === "paid" ? "as-badge--stage" : "as-badge--warn"}`}>
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
              <span className="as-badge as-badge--warn">{statusLabel(detail.status)}</span>
            </div>
            <div className="as-head__actions">
              <Link className="as-btn" to={detail.openPath}>
                Voir le dossier
              </Link>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                onClick={() => setNotice("Émission définitive impossible tant que TVA / numérotation ne sont pas validées.")}
              >
                Émettre la facture
              </button>
            </div>
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Émetteur / client</h3>
              <p>
                <small>Émetteur</small>
                {detail.issuer}
              </p>
              <p>
                <small>Client</small>
                {detail.clientDetail.name}
              </p>
              <p>
                {detail.clientDetail.phone || "—"} · {detail.clientDetail.email || "—"}
              </p>
              <p>{detail.clientDetail.zone || "Zone non précisée"}</p>
              <h3 style={{ marginTop: "1rem" }}>Lignes</h3>
              <ul className="as-todo">
                {detail.lines.map((line) => (
                  <li key={line.id}>
                    {line.label} · qté {line.qty} · {line.total != null ? formatFcfa(line.total) : "À renseigner"}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Paiements associés</h3>
              {detail.payments.length === 0 ? (
                <p className="as-empty">Aucun paiement lié.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.payments.map((p) => (
                    <li key={p.reference} className="is-done">
                      {p.reference} · {p.amount != null ? formatFcfa(p.amount) : "—"} · {p.channel}
                    </li>
                  ))}
                </ul>
              )}
              <h3 style={{ marginTop: "1rem" }}>Journal comptable</h3>
              <p className="as-empty">{detail.journalNote}</p>
            </div>
            <div>
              <h3>Contrôles</h3>
              <p>
                <small>Numérotation</small>
                {detail.controls.numbering}
              </p>
              <p>
                <small>Verrouillage après émission</small>
                {detail.controls.lockAfterIssue ? "Activé" : "Non activé"}
              </p>
              <p>
                <small>Validation comptable</small>
                {detail.controls.accountingValidation}
              </p>
              <p className="as-note">Commissions, TVA et séquence définitive restent hors scope jusqu’à validation métier.</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
