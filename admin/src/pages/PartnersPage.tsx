import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, initials } from "../lib/format";

type PartnerRow = {
  id: string;
  organizationName: string;
  partnerType: string;
  personKind: string | null;
  commune: string | null;
  status: string;
  emailMasked: string | null;
  phoneMasked: string | null;
  articlesPublished: number;
  articlesTotal: number;
  documentsCount: number;
  updatedAt: string;
};

type PartnerDetail = {
  id: string;
  organizationName: string;
  commercialName: string | null;
  legalName: string | null;
  partnerType: string;
  personKind: string | null;
  commune: string | null;
  zone: string | null;
  status: string;
  rejectionReason: string | null;
  emailMasked: string | null;
  phoneMasked: string | null;
  createdAt: string;
  activeDossiers: number;
  note: string;
  steps: { key: string; label: string; done: boolean }[];
  products: { id: string; title: string; status: string; reference: string | null; paused: boolean }[];
  documents: { id: string; kind: string; scanStatus: string; createdAt: string; retainUntil: string | null }[];
  history: { id: string; action: string; createdAt: string }[];
};

function statusLabel(status: string) {
  if (status === "APPROVED") return "Actif";
  if (status === "REJECTED") return "Refusé";
  if (status === "UNDER_REVIEW") return "En revue";
  if (status === "SUBMITTED") return "À vérifier";
  return status;
}

function typeLabel(type: string) {
  if (type === "SUPPLIER") return "Fournisseur";
  if (type === "DELIVERY") return "Livraison";
  if (type === "TECH") return "Technique";
  return type;
}

function productStatus(p: PartnerDetail["products"][0]) {
  if (p.status === "PENDING_REVIEW") return "En vérification";
  if (p.status === "APPROVED" && p.paused) return "En pause";
  if (p.status === "APPROVED") return "Publié";
  if (p.status === "REJECTED") return "Refusé";
  return p.status;
}

export function PartnersPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<PartnerRow[]>([]);
  const [counts, setCounts] = useState({ active: 0, toVerify: 0, documentsExpiring: 0, articlesPublished: 0 });
  const [detail, setDetail] = useState<PartnerDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  async function loadList() {
    const query = new URLSearchParams({ take: "40" });
    if (q) query.set("q", q);
    if (status !== "all") query.set("status", status);
    const res = await apiFetch<{ items: PartnerRow[]; counts: typeof counts }>(`/admin/people/partners?${query}`);
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
      const res = await apiFetch<{ partner: PartnerDetail }>(`/admin/people/partners/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.partner);
      setRejectReason("");
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
    if (status !== "all") copy.set("status", status);
    else copy.delete("status");
    setParams(copy, { replace: true });
  }

  async function decide(decision: "APPROVED" | "REJECTED") {
    if (!selectedId) return;
    if (decision === "REJECTED" && !rejectReason.trim()) {
      setError("Indiquez un motif de refus.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; partner: PartnerDetail }>(`/admin/people/partners/${selectedId}/review`, {
      method: "PATCH",
      json: { decision, reason: rejectReason.trim() || undefined },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.partner);
    setNotice(decision === "APPROVED" ? "Profil approuvé. Les articles restent à publier séparément." : "Profil refusé.");
    await loadList();
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Personnes / Partenaires</span>
      </div>
      <h1 className="as-h1">Partenaires</h1>
      <p className="as-lead">Validation du profil, documents, articles proposés et décision.</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.active}</strong>
          <span>Partenaires actifs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.toVerify}</strong>
          <span>Profils à vérifier</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.documentsExpiring}</strong>
          <span>Docs expirant bientôt</span>
          <small>Non calculé sans dates d’échéance</small>
        </div>
        <div className="as-kpi">
          <strong>{counts.articlesPublished}</strong>
          <span>Articles publiés</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("L’ajout partenaire se fait via candidature. Pas de création manuelle ici.")}>
          + Ajouter un partenaire
        </button>
        <input className="as-field" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="SUBMITTED">À vérifier</option>
          <option value="UNDER_REVIEW">En revue</option>
          <option value="APPROVED">Actif</option>
          <option value="REJECTED">Refusé</option>
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
                <th>Type</th>
                <th>Contact</th>
                <th>Articles</th>
                <th>Documents</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="as-empty">Aucun partenaire à afficher.</p>
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
                    <td data-label="Partenaire">
                      <span className="as-person">
                        <b>{initials(row.organizationName)}</b>
                        {row.organizationName}
                      </span>
                      <small>{row.commune || "—"}</small>
                    </td>
                    <td data-label="Type">{typeLabel(row.partnerType)}</td>
                    <td data-label="Contact">
                      <div>{row.phoneMasked || "—"}</div>
                      <small>{row.emailMasked || "—"}</small>
                    </td>
                    <td data-label="Articles">
                      {row.articlesPublished} / {row.articlesTotal}
                    </td>
                    <td data-label="Documents">{row.documentsCount}</td>
                    <td data-label="Statut">
                      <span className={`as-badge ${row.status === "APPROVED" ? "as-badge--stage" : "as-badge--warn"}`}>
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
              <h2>{detail.organizationName}</h2>
              <span className={`as-badge ${detail.status === "APPROVED" ? "as-badge--stage" : "as-badge--warn"}`}>
                {statusLabel(detail.status)}
              </span>
            </div>
          </div>
          <p className="as-banner as-banner--warn">{detail.note}</p>
          <div className="as-prop-pills" style={{ marginBottom: "0.85rem" }}>
            {detail.steps.map((step) => (
              <span key={step.key} className={`as-badge ${step.done ? "as-badge--stage" : "as-badge--warn"}`}>
                {step.label}
              </span>
            ))}
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Identité</h3>
              <p>
                <small>Raison commerciale</small>
                {detail.commercialName || detail.organizationName}
              </p>
              <p>
                <small>Raison légale</small>
                {detail.legalName || "Non renseignée"}
              </p>
              <p>
                <small>Type</small>
                {detail.personKind === "PROFESSIONAL" ? "Entreprise" : detail.personKind === "INDIVIDUAL" ? "Particulier" : "—"} ·{" "}
                {typeLabel(detail.partnerType)}
              </p>
              <p>
                <small>Localisation</small>
                {[detail.commune, detail.zone].filter(Boolean).join(" · ") || "Non renseignée"}
              </p>
              <p>
                <small>Contact</small>
                {detail.phoneMasked || "—"} · {detail.emailMasked || "—"}
              </p>
              <p>
                <small>Dossiers actifs liés</small>
                {detail.activeDossiers}
              </p>
            </div>
            <div>
              <h3>Documents ({detail.documents.length})</h3>
              {detail.documents.length === 0 ? (
                <p className="as-empty">Aucun document déposé.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.documents.map((d) => (
                    <li key={d.id} className="is-done">
                      {d.kind} · {d.scanStatus} · {formatDateTime(d.createdAt)}
                      {d.retainUntil ? ` · conservation jusqu’au ${formatDateTime(d.retainUntil)}` : ""}
                    </li>
                  ))}
                </ul>
              )}
              <h3 style={{ marginTop: "1rem" }}>Articles proposés ({detail.products.length})</h3>
              {detail.products.length === 0 ? (
                <p className="as-empty">Aucun article transmis.</p>
              ) : (
                <ul className="as-todo">
                  {detail.products.map((p) => (
                    <li key={p.id}>
                      {p.title} {p.reference ? `· ${p.reference}` : ""}{" "}
                      <span className="as-badge as-badge--info">{productStatus(p)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Historique</h3>
              {detail.history.length === 0 ? (
                <p className="as-empty">Pas encore d’événements journalisés.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.history.map((h) => (
                    <li key={h.id} className="is-done">
                      {h.action} · {formatDateTime(h.createdAt)}
                    </li>
                  ))}
                </ul>
              )}
              <h3 style={{ marginTop: "1rem" }}>Décision de validation</h3>
              {detail.status === "APPROVED" || detail.status === "REJECTED" ? (
                <p className="as-note">
                  Décision déjà enregistrée ({statusLabel(detail.status)}).
                  {detail.rejectionReason ? ` Motif : ${detail.rejectionReason}` : ""}
                </p>
              ) : (
                <>
                  <label>
                    Motif (si refus)
                    <textarea className="as-field" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                  </label>
                  <div className="as-head__actions" style={{ marginTop: "0.65rem" }}>
                    <button type="button" className="as-btn" disabled={pending} onClick={() => setNotice("Demande de correction : à formaliser avec le partenaire hors workflow auto.")}>
                      Demander une correction
                    </button>
                    <button type="button" className="as-btn" disabled={pending} onClick={() => void decide("REJECTED")}>
                      Refuser avec motif
                    </button>
                    <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void decide("APPROVED")}>
                      Approuver le profil
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
