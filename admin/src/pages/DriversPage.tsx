import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, initials } from "../lib/format";

type DriverRow = {
  id: string;
  fullName: string;
  zone: string | null;
  vehicleInfo: string | null;
  status: string;
  accountStatus: string;
  availability: string;
  emailMasked: string | null;
  phoneMasked: string | null;
  documentsCount: number;
  lastLoginAt: string | null;
};

type DriverDetail = {
  id: string;
  fullName: string;
  zone: string | null;
  zones: string[];
  vehicleInfo: string | null;
  status: string;
  rejectionReason: string | null;
  accountStatus: string;
  availability: string;
  emailMasked: string | null;
  phoneMasked: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  userId: string;
  missionsNote: string;
  missions: { id: string; label: string; status: string }[];
  incidents: { id: string; label: string; status: string }[];
  documents: { id: string; kind: string; scanStatus: string; createdAt: string; retainUntil: string | null }[];
  history: { id: string; action: string; createdAt: string }[];
  access: { method: string; canReset: boolean; canSuspend: boolean };
};

function appStatusLabel(status: string) {
  if (status === "APPROVED") return "Actif";
  if (status === "REJECTED") return "Refusé";
  if (status === "SUBMITTED" || status === "UNDER_REVIEW") return "À vérifier";
  return status;
}

function availabilityLabel(value: string) {
  if (value === "available") return "Disponible";
  if (value === "unavailable") return "Indisponible";
  return "En attente";
}

export function DriversPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<DriverRow[]>([]);
  const [counts, setCounts] = useState({ active: 0, availableNow: 0, missionsToday: 0, documentsToRenew: 0 });
  const [detail, setDetail] = useState<DriverDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  async function loadList() {
    const query = new URLSearchParams({ take: "40" });
    if (q) query.set("q", q);
    if (status !== "all") query.set("status", status);
    const res = await apiFetch<{ items: DriverRow[]; counts: typeof counts }>(`/admin/people/drivers?${query}`);
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
      const res = await apiFetch<{ driver: DriverDetail }>(`/admin/people/drivers/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.driver);
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
    const res = await apiFetch<{ ok: true; driver: DriverDetail }>(`/admin/people/drivers/${selectedId}/review`, {
      method: "PATCH",
      json: { decision, reason: rejectReason.trim() || undefined },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.driver);
    setNotice(decision === "APPROVED" ? "Profil livreur approuvé." : "Profil livreur refusé.");
    await loadList();
  }

  async function setAccount(next: "ACTIVE" | "SUSPENDED") {
    if (!detail) return;
    setPending(true);
    const res = await apiFetch<{ ok: true; status: string }>(`/admin/people/users/${detail.userId}/status`, {
      method: "PATCH",
      json: { status: next },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNotice(next === "SUSPENDED" ? "Accès suspendu." : "Accès réactivé.");
    const refreshed = await apiFetch<{ driver: DriverDetail }>(`/admin/people/drivers/${detail.id}`);
    if (refreshed.ok) setDetail(refreshed.data.driver);
    await loadList();
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Personnes / Livreurs</span>
      </div>
      <h1 className="as-h1">Livreurs</h1>
      <p className="as-lead">Missions, zones, disponibilité, documents et sécurité du compte.</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.active}</strong>
          <span>Livreurs actifs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.availableNow}</strong>
          <span>Disponibles maintenant</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.missionsToday}</strong>
          <span>Missions aujourd’hui</span>
          <small>Pas encore liées au planning</small>
        </div>
        <div className="as-kpi">
          <strong>{counts.documentsToRenew}</strong>
          <span>Sans document</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("Les livreurs s’inscrivent via candidature. Pas de création manuelle ici.")}>
          + Ajouter un livreur
        </button>
        <input className="as-field" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="SUBMITTED">À vérifier</option>
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
                <th>Livreur</th>
                <th>Contact</th>
                <th>Zones</th>
                <th>Véhicule</th>
                <th>Disponibilité</th>
                <th>Documents</th>
                <th>Compte</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="as-empty">Aucun livreur à afficher.</p>
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
                    <td data-label="Livreur">
                      <span className="as-person">
                        <b>{initials(row.fullName)}</b>
                        {row.fullName}
                      </span>
                    </td>
                    <td data-label="Contact">
                      <div>{row.phoneMasked || "—"}</div>
                      <small>{row.emailMasked || "—"}</small>
                    </td>
                    <td data-label="Zones">{row.zone || "—"}</td>
                    <td data-label="Véhicule">{row.vehicleInfo || "—"}</td>
                    <td data-label="Disponibilité">
                      <span className={`as-badge ${row.availability === "available" ? "as-badge--stage" : "as-badge--warn"}`}>
                        {availabilityLabel(row.availability)}
                      </span>
                    </td>
                    <td data-label="Documents">{row.documentsCount}</td>
                    <td data-label="Compte">
                      <span className={`as-badge ${row.accountStatus === "ACTIVE" ? "as-badge--stage" : "as-badge--warn"}`}>
                        {row.accountStatus === "ACTIVE" ? "Actif" : row.accountStatus === "SUSPENDED" ? "Suspendu" : row.accountStatus}
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
              <h2>{detail.fullName}</h2>
              <span className={`as-badge ${detail.availability === "available" ? "as-badge--stage" : "as-badge--warn"}`}>
                {availabilityLabel(detail.availability)}
              </span>
              <span className="as-badge as-badge--info" style={{ marginLeft: "0.25rem" }}>
                {appStatusLabel(detail.status)}
              </span>
            </div>
            <div className="as-head__actions">
              <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("L’affectation de mission sera branchée sur Livraisons & reprises.")}>
                Affecter une mission
              </button>
              {detail.accountStatus === "SUSPENDED" ? (
                <button type="button" className="as-btn" disabled={pending} onClick={() => void setAccount("ACTIVE")}>
                  Réactiver l’accès
                </button>
              ) : (
                <button type="button" className="as-btn" disabled={pending || !detail.access.canSuspend} onClick={() => void setAccount("SUSPENDED")}>
                  Suspendre l’accès
                </button>
              )}
            </div>
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Identité & rôle</h3>
              <p>
                <small>Contact</small>
                {detail.phoneMasked || "—"} · {detail.emailMasked || "—"}
              </p>
              <p>
                <small>Zones</small>
                {detail.zones.length ? detail.zones.join(", ") : detail.zone || "Non renseignées"}
              </p>
              <p>
                <small>Véhicule</small>
                {detail.vehicleInfo || "Non renseigné"}
              </p>
              <p>
                <small>Créé le</small>
                {formatDateTime(detail.createdAt)}
              </p>
              {detail.status === "SUBMITTED" || detail.status === "UNDER_REVIEW" ? (
                <>
                  <label style={{ marginTop: "0.75rem" }}>
                    Motif (si refus)
                    <textarea className="as-field" rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                  </label>
                  <div className="as-head__actions" style={{ marginTop: "0.55rem" }}>
                    <button type="button" className="as-btn" disabled={pending} onClick={() => void decide("REJECTED")}>
                      Refuser
                    </button>
                    <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void decide("APPROVED")}>
                      Approuver
                    </button>
                  </div>
                </>
              ) : detail.rejectionReason ? (
                <p className="as-note">Motif de refus : {detail.rejectionReason}</p>
              ) : null}
            </div>
            <div>
              <h3>Missions du jour</h3>
              <p className="as-empty">{detail.missionsNote}</p>
              <h3 style={{ marginTop: "1rem" }}>Incidents signalés</h3>
              {detail.incidents.length === 0 ? (
                <p className="as-empty">Aucun incident lié à ce livreur.</p>
              ) : (
                <ul className="as-todo">
                  {detail.incidents.map((i) => (
                    <li key={i.id}>
                      {i.label} · {i.status}
                    </li>
                  ))}
                </ul>
              )}
              <h3 style={{ marginTop: "1rem" }}>Documents</h3>
              {detail.documents.length === 0 ? (
                <p className="as-empty">Aucun document déposé.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.documents.map((d) => (
                    <li key={d.id} className="is-done">
                      {d.kind} · {d.scanStatus} · {formatDateTime(d.createdAt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Accès & sécurité</h3>
              <p>
                <small>Dernière connexion</small>
                {detail.lastLoginAt ? formatDateTime(detail.lastLoginAt) : "Jamais connecté"}
              </p>
              <p>
                <small>Méthode</small>
                {detail.access.method}
              </p>
              <p className="as-note">Réinitialisation du mot de passe : via le flux « mot de passe oublié » du compte, non déclenchée depuis cet écran.</p>
              <h3 style={{ marginTop: "1rem" }}>Historique</h3>
              {detail.history.length === 0 ? (
                <p className="as-empty">Aucun événement.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.history.map((h) => (
                    <li key={h.id} className="is-done">
                      {h.action} · {formatDateTime(h.createdAt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
