import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, formatFcfa } from "../lib/format";

type DepositRow = {
  id: string;
  reference: string;
  dossier: string;
  client: string;
  article: string;
  amount: number | null;
  collection: string;
  returnStatus: string;
  incident: boolean;
  decision: string | null;
  decisionSubmitted: boolean;
  status: string;
};

type DepositDetail = DepositRow & {
  period: string | null;
  collectionProof: { channel: string | null; reference: string | null; at: string | null };
  decisionDetail: {
    kind: string | null;
    explanation: string | null;
    refundAmount: number | null;
    retainAmount: number | null;
    heldAmount: number | null;
    submitted: boolean;
    channel: string | null;
    reference: string | null;
  };
  returnNote: string;
  openDecisionPath: string;
  banner: string;
};

function statusLabel(status: string) {
  if (status === "to_collect") return "À encaisser";
  if (status === "held") return "Détenu";
  if (status === "decision_pending") return "Restitution à valider";
  if (status === "retain_pending") return "Retenue à valider";
  if (status === "restored") return "Restitué";
  return status;
}

function decisionLabel(kind: string | null) {
  if (kind === "full") return "Restitution totale";
  if (kind === "partial") return "Retenue partielle";
  if (kind === "retain") return "Retenue totale";
  return "Décision en attente";
}

export function DepositsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<DepositRow[]>([]);
  const [counts, setCounts] = useState({
    toCollect: 0,
    toCollectAmount: 0,
    held: 0,
    heldAmount: 0,
    decisionsPending: 0,
    decisionsAmount: 0,
    lateRestitutions: 0,
    lateAmount: 0,
  });
  const [banner, setBanner] = useState("");
  const [detail, setDetail] = useState<DepositDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (status !== "all") query.set("status", status);
      const res = await apiFetch<{ items: DepositRow[]; counts: typeof counts; banner: string }>(
        `/admin/finances/deposits?${query}`,
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
      const res = await apiFetch<{ deposit: DepositDetail }>(`/admin/finances/deposits/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.deposit);
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
        <span>Finances / Dépôts de garantie</span>
      </div>
      <h1 className="as-h1">Dépôts de garantie</h1>
      {banner ? <p className="as-banner as-banner--warn">{banner}</p> : null}

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.toCollect}</strong>
          <span>À encaisser</span>
          <small>{formatFcfa(counts.toCollectAmount)}</small>
        </div>
        <div className="as-kpi">
          <strong>{counts.held}</strong>
          <span>Détenus</span>
          <small>{formatFcfa(counts.heldAmount)}</small>
        </div>
        <div className="as-kpi">
          <strong>{counts.decisionsPending}</strong>
          <span>Décisions en attente</span>
          <small>{formatFcfa(counts.decisionsAmount)}</small>
        </div>
        <div className="as-kpi">
          <strong>{counts.lateRestitutions}</strong>
          <span>Restitutions en retard</span>
          <small>Délais non contractualisés</small>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <input className="as-field" placeholder="Dépôt, dossier, client…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="to_collect">À encaisser</option>
          <option value="held">Détenu</option>
          <option value="decision_pending">Décision en attente</option>
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
                <th>Nº dépôt</th>
                <th>Dossier</th>
                <th>Client</th>
                <th>Article</th>
                <th>Montant</th>
                <th>Encaissement</th>
                <th>Retour</th>
                <th>Décision</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <p className="as-empty">Aucun dépôt suivi pour l’instant.</p>
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
                    <td data-label="Nº">{row.reference}</td>
                    <td data-label="Dossier">{row.dossier}</td>
                    <td data-label="Client">{row.client}</td>
                    <td data-label="Article">{row.article}</td>
                    <td data-label="Montant">{row.amount != null ? formatFcfa(row.amount) : "—"}</td>
                    <td data-label="Encaissement">{row.collection === "collected" ? "Encaissé" : "Attendu"}</td>
                    <td data-label="Retour">{row.returnStatus === "controlled" ? "Contrôlé" : "Ouvert"}</td>
                    <td data-label="Décision">{decisionLabel(row.decision)}</td>
                    <td data-label="Statut">
                      <span className="as-badge as-badge--warn">{statusLabel(row.status)}</span>
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
            <Link className="as-btn as-btn--yellow" to={detail.openDecisionPath}>
              Traiter la décision sur le dossier
            </Link>
          </div>
          <p className="as-note">{detail.banner}</p>
          <div className="as-people-grid">
            <div>
              <h3>Identité</h3>
              <p>
                <small>Dossier</small>
                <Link to={`/dossiers/${detail.id}`}>{detail.dossier}</Link>
              </p>
              <p>
                <small>Client</small>
                {detail.client}
              </p>
              <p>
                <small>Période</small>
                {detail.period || "—"}
              </p>
              <p>
                <small>Montant détenu</small>
                {detail.amount != null ? formatFcfa(detail.amount) : "Non renseigné"}
              </p>
              <h3 style={{ marginTop: "1rem" }}>Preuve d’encaissement</h3>
              <p>
                {detail.collectionProof.channel || "Canal non précisé"}
                {detail.collectionProof.reference ? ` · ${detail.collectionProof.reference}` : ""}
              </p>
              <p>{detail.collectionProof.at ? formatDateTime(detail.collectionProof.at) : "Non encaissé / non daté"}</p>
            </div>
            <div>
              <h3>Retour</h3>
              <p className="as-empty">{detail.returnNote}</p>
              <p>
                <small>Incident lié</small>
                {detail.incident ? "Oui" : "Aucun incident ouvert déclaré"}
              </p>
            </div>
            <div>
              <h3>Décision de restitution</h3>
              <p>{decisionLabel(detail.decisionDetail.kind)}</p>
              <p>
                <small>Explication</small>
                {detail.decisionDetail.explanation || "—"}
              </p>
              <p>
                À restituer :{" "}
                {detail.decisionDetail.refundAmount != null
                  ? formatFcfa(detail.decisionDetail.refundAmount)
                  : detail.decisionDetail.kind === "full" && detail.decisionDetail.heldAmount != null
                    ? formatFcfa(detail.decisionDetail.heldAmount)
                    : "—"}
              </p>
              <p>
                Retenue :{" "}
                {detail.decisionDetail.retainAmount != null ? formatFcfa(detail.decisionDetail.retainAmount) : "—"}
              </p>
              <p className="as-note">
                {detail.decisionDetail.submitted
                  ? "Décision soumise — exécution de remboursement hors de cet écran."
                  : "Aucune décision soumise. Utilisez le parcours dossier."}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
