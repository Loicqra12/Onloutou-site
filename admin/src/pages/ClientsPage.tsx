import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, initials } from "../lib/format";

type ClientRow = {
  id: string;
  displayName: string;
  emailMasked: string | null;
  phoneMasked: string | null;
  roles: string[];
  status: string;
  verified: boolean;
  commune: string | null;
  dossierCount: number;
  lastActivityAt: string;
};

type ClientDetail = {
  id: string;
  displayName: string;
  emailMasked: string | null;
  phoneMasked: string | null;
  roles: string[];
  status: string;
  verified: boolean;
  commune: string | null;
  personKind: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  dossiers: { id: string; reference: string; status: string; assignee: string | null }[];
  activity: { id: string; action: string; createdAt: string }[];
  consents: { email: boolean; phone: boolean; whatsapp: boolean; retention: string };
  partnerProfile: { id: string; organizationName: string; status: string } | null;
  driverProfile: { id: string; fullName: string; status: string } | null;
};

function roleLabel(role: string) {
  if (role === "CLIENT") return "Client";
  if (role === "PARTNER") return "Partenaire";
  if (role === "DRIVER") return "Livreur";
  return role;
}

function statusLabel(row: Pick<ClientRow, "status" | "verified">) {
  if (row.status === "SUSPENDED") return "Suspendu";
  if (row.status === "PENDING_EMAIL" || !row.verified) return "En vérification";
  return "Vérifié";
}

function dossierStatusLabel(status: string) {
  if (status === "CLOSED") return "Clôturé";
  if (status === "CANCELLED") return "Annulé";
  if (status === "QUOTED" || status === "WAITING_CLIENT") return "En cours";
  return "Actif";
}

function actionLabel(action: string) {
  const map: Record<string, string> = {
    USER_CREATED: "Compte créé",
    USER_LOGIN: "Connexion",
    APPLICATION_SUBMITTED: "Candidature envoyée",
    APPLICATION_APPROVED: "Profil approuvé",
    APPLICATION_REJECTED: "Profil refusé",
    REQUEST_CREATED: "Dossier créé",
    REQUEST_STATUS_CHANGED: "Statut de dossier mis à jour",
  };
  return map[action] || action;
}

export function ClientsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [role, setRole] = useState(params.get("role") ?? "all");
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [items, setItems] = useState<ClientRow[]>([]);
  const [counts, setCounts] = useState({ users: 0, newThisMonth: 0, activeDossiers: 0, toVerify: 0 });
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const query = new URLSearchParams({ take: "40" });
      if (q) query.set("q", q);
      if (role !== "all") query.set("role", role);
      if (status !== "all") query.set("status", status);
      const res = await apiFetch<{ items: ClientRow[]; counts: typeof counts }>(`/admin/people/clients?${query}`);
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
  }, [nav, q, role, status]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ user: ClientDetail }>(`/admin/people/clients/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.user);
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
    if (role !== "all") copy.set("role", role);
    else copy.delete("role");
    if (status !== "all") copy.set("status", status);
    else copy.delete("status");
    setParams(copy, { replace: true });
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Personnes / Clients & utilisateurs</span>
      </div>
      <h1 className="as-h1">Clients & utilisateurs</h1>
      <p className="as-lead">Rôles multiples, dossiers, activité, consentements et données — sans inventer de fiches.</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.users}</strong>
          <span>Utilisateurs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.newThisMonth}</strong>
          <span>Nouveaux ce mois</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.activeDossiers}</strong>
          <span>Dossiers actifs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.toVerify}</strong>
          <span>Profils à vérifier</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <button
          type="button"
          className="as-btn as-btn--yellow"
          onClick={() => {
            setNotice("Les comptes clients naissent à l’inscription ou via un dossier. Création manuelle non ouverte ici.");
          }}
        >
          + Créer un client
        </button>
        <input
          className="as-field"
          placeholder="Rechercher un nom, e-mail, téléphone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="as-field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">Rôle</option>
          <option value="CLIENT">Client</option>
          <option value="PARTNER">Partenaire</option>
          <option value="DRIVER">Livreur</option>
        </select>
        <select className="as-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Statut</option>
          <option value="ACTIVE">Actif</option>
          <option value="PENDING_EMAIL">E-mail à confirmer</option>
          <option value="SUSPENDED">Suspendu</option>
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
                <th>Client</th>
                <th>Coordonnées</th>
                <th>Rôles</th>
                <th>Dossiers</th>
                <th>Dernière activité</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="as-empty">Aucun utilisateur correspondant.</p>
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={row.id === selectedId ? "as-row--on" : undefined}
                    onClick={() => selectRow(row.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="Client">
                      <span className="as-person">
                        <b>{initials(row.displayName)}</b>
                        {row.displayName}
                      </span>
                    </td>
                    <td data-label="Coordonnées">
                      <div>{row.phoneMasked || "—"}</div>
                      <small>{row.emailMasked || "—"}</small>
                    </td>
                    <td data-label="Rôles">
                      {row.roles.map((r) => (
                        <span key={r} className="as-badge as-badge--info" style={{ marginRight: "0.25rem" }}>
                          {roleLabel(r)}
                        </span>
                      ))}
                    </td>
                    <td data-label="Dossiers">{row.dossierCount}</td>
                    <td data-label="Activité">{formatDateTime(row.lastActivityAt)}</td>
                    <td data-label="Statut">
                      <span className={`as-badge ${row.verified && row.status === "ACTIVE" ? "as-badge--stage" : "as-badge--warn"}`}>
                        {statusLabel(row)}
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
              <h2>{detail.displayName}</h2>
              <span className={`as-badge ${detail.verified ? "as-badge--stage" : "as-badge--warn"}`}>
                {statusLabel(detail)}
              </span>
              {detail.roles.map((r) => (
                <span key={r} className="as-badge as-badge--info" style={{ marginLeft: "0.25rem" }}>
                  {roleLabel(r)}
                </span>
              ))}
            </div>
            <div className="as-head__actions">
              <Link className="as-btn as-btn--yellow" to="/dossiers/nouveau">
                + Créer un dossier
              </Link>
              {detail.partnerProfile ? (
                <Link className="as-btn" to={`/partenaires?id=${detail.partnerProfile.id}`}>
                  Voir partenaire
                </Link>
              ) : null}
              {detail.driverProfile ? (
                <Link className="as-btn" to={`/livreurs?id=${detail.driverProfile.id}`}>
                  Voir livreur
                </Link>
              ) : null}
            </div>
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Identité & contact</h3>
              <p>
                <small>Type</small>
                {detail.personKind === "PROFESSIONAL" ? "Professionnel" : "Personne physique"}
              </p>
              <p>
                <small>Téléphone</small>
                {detail.phoneMasked || "Non renseigné"}
              </p>
              <p>
                <small>E-mail</small>
                {detail.emailMasked || "Non renseigné"}
              </p>
              <p>
                <small>Commune / zone</small>
                {detail.commune || "Non renseignée"}
              </p>
              <p>
                <small>Créé le</small>
                {formatDateTime(detail.createdAt)}
              </p>
              <h3 style={{ marginTop: "1rem" }}>Rôles</h3>
              <ul className="as-todo as-todo--done">
                {detail.roles.includes("CLIENT") ? <li className="is-done">Client — peut louer des articles</li> : null}
                {detail.roles.includes("PARTNER") ? (
                  <li className="is-done">Partenaire — {detail.partnerProfile?.organizationName || "profil lié"}</li>
                ) : null}
                {detail.roles.includes("DRIVER") ? (
                  <li className="is-done">Livreur — {detail.driverProfile?.fullName || "profil lié"}</li>
                ) : null}
              </ul>
            </div>
            <div>
              <h3>Dossiers de location</h3>
              {detail.dossiers.length === 0 ? (
                <p className="as-empty">Aucun dossier lié à cet e-mail.</p>
              ) : (
                <ul className="as-todo">
                  {detail.dossiers.map((d) => (
                    <li key={d.id}>
                      <Link to={`/dossiers/${d.id}`}>{d.reference}</Link>{" "}
                      <span className="as-badge as-badge--info">{dossierStatusLabel(d.status)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <h3 style={{ marginTop: "1rem" }}>Activité récente</h3>
              {detail.activity.length === 0 ? (
                <p className="as-empty">Aucune activité journalisée pour ce profil.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.activity.map((a) => (
                    <li key={a.id} className="is-done">
                      {actionLabel(a.action)} · {formatDateTime(a.createdAt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Consentements & données</h3>
              <label className="as-check">
                <input type="checkbox" checked={detail.consents.email} readOnly /> E-mail
              </label>
              <label className="as-check">
                <input type="checkbox" checked={detail.consents.phone} readOnly /> Téléphone
              </label>
              <label className="as-check">
                <input type="checkbox" checked={detail.consents.whatsapp} readOnly /> WhatsApp
              </label>
              <p className="as-empty" style={{ marginTop: "0.65rem" }}>
                Rétention : {detail.consents.retention}
              </p>
              <p className="as-note">Export ou suppression : à traiter via Protection des données (non automatisé ici).</p>
              <p>
                <small>Dernière connexion</small>
                {detail.lastLoginAt ? formatDateTime(detail.lastLoginAt) : "Jamais connecté"}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
