import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatDateTime, initials } from "../lib/format";

type MemberRow = {
  id: string;
  displayName: string;
  emailMasked: string | null;
  role: string;
  status: string;
  totpEnabled: boolean;
  lastLoginAt: string | null;
  functionLabel: string;
  teamLabel: string;
};

type MemberDetail = MemberRow & {
  phoneMasked: string | null;
  totpEnabledAt: string | null;
  roles: string[];
  permissions: { domain: string; create: boolean; read: boolean; update: boolean; close: boolean; configure: boolean }[];
  prohibitions: string[];
  separationNote: string;
  sessionsNote: string;
  history: { id: string; action: string; createdAt: string; ipMasked: string | null; result: string }[];
};

export function TeamPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [items, setItems] = useState<MemberRow[]>([]);
  const [counts, setCounts] = useState({ active: 0, invitationsPending: 0, without2fa: 0, sessionsToReview: 0 });
  const [banner, setBanner] = useState("");
  const [detail, setDetail] = useState<MemberDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function loadList() {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    const res = await apiFetch<{ items: MemberRow[]; counts: typeof counts; banner: string }>(`/admin/ops/team?${query}`);
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
  }

  useEffect(() => {
    void loadList();
  }, [nav, q]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await apiFetch<{ member: MemberDetail }>(`/admin/ops/team/${selectedId}`);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDetail(res.data.member);
    })();
  }, [selectedId]);

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    if (search.trim()) copy.set("q", search.trim());
    else copy.delete("q");
    setParams(copy, { replace: true });
  }

  async function setStatus(status: "ACTIVE" | "SUSPENDED") {
    if (!selectedId) return;
    setPending(true);
    const res = await apiFetch<{ ok: true; member: MemberDetail }>(`/admin/ops/team/${selectedId}/status`, {
      method: "PATCH",
      json: { status },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data.member);
    setNotice(status === "SUSPENDED" ? "Accès suspendu." : "Accès réactivé.");
    await loadList();
  }

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / Équipe & accès</span>
      </div>
      <h1 className="as-h1">Équipe & accès</h1>
      {banner ? <p className="as-banner as-banner--warn">{banner}</p> : null}

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{counts.active}</strong>
          <span>Membres actifs</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.invitationsPending}</strong>
          <span>Invitations en attente</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.without2fa}</strong>
          <span>Comptes sans 2FA</span>
        </div>
        <div className="as-kpi">
          <strong>{counts.sessionsToReview}</strong>
          <span>Sessions à examiner</span>
          <small>Non exposées encore</small>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={applyFilters}>
        <input className="as-field" placeholder="Nom ou e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <th>Membre</th>
                <th>Fonction</th>
                <th>Équipe</th>
                <th>Rôle</th>
                <th>Dernière connexion</th>
                <th>2FA</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
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
                  <td data-label="Membre">
                    <span className="as-person">
                      <b>{initials(row.displayName)}</b>
                      {row.displayName}
                    </span>
                    <small>{row.emailMasked}</small>
                  </td>
                  <td data-label="Fonction">{row.functionLabel}</td>
                  <td data-label="Équipe">{row.teamLabel}</td>
                  <td data-label="Rôle">{row.role}</td>
                  <td data-label="Connexion">{row.lastLoginAt ? formatDateTime(row.lastLoginAt) : "—"}</td>
                  <td data-label="2FA">
                    <span className={`as-badge ${row.totpEnabled ? "as-badge--stage" : "as-badge--warn"}`}>
                      {row.totpEnabled ? "Activé" : "Non activé"}
                    </span>
                  </td>
                  <td data-label="Statut">
                    <span className={`as-badge ${row.status === "ACTIVE" ? "as-badge--stage" : "as-badge--warn"}`}>
                      {row.status === "ACTIVE" ? "Actif" : row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detail ? (
        <section className="as-card as-people-detail">
          <div className="as-card__head">
            <div>
              <h2>{detail.displayName}</h2>
              <span className={`as-badge ${detail.status === "ACTIVE" ? "as-badge--stage" : "as-badge--warn"}`}>
                {detail.status === "ACTIVE" ? "Actif" : detail.status}
              </span>
            </div>
            <div className="as-head__actions">
              <button type="button" className="as-btn" onClick={() => setNotice("Réinitialisation : le membre utilise « mot de passe oublié ».")}>
                Réinitialiser le mot de passe
              </button>
              {detail.status === "SUSPENDED" ? (
                <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void setStatus("ACTIVE")}>
                  Réactiver l’accès
                </button>
              ) : (
                <button type="button" className="as-btn" disabled={pending} onClick={() => void setStatus("SUSPENDED")}>
                  Suspendre l’accès
                </button>
              )}
            </div>
          </div>
          <div className="as-people-grid">
            <div>
              <h3>Identité & contact</h3>
              <p>
                <small>E-mail</small>
                {detail.emailMasked}
              </p>
              <p>
                <small>Téléphone</small>
                {detail.phoneMasked || "—"}
              </p>
              <p>
                <small>Fonction / équipe</small>
                {detail.functionLabel} · {detail.teamLabel}
              </p>
              <h3 style={{ marginTop: "1rem" }}>Authentification (2FA)</h3>
              <p>{detail.totpEnabled ? `Activée${detail.totpEnabledAt ? ` · ${formatDateTime(detail.totpEnabledAt)}` : ""}` : "Non activée"}</p>
              <p className="as-empty">{detail.sessionsNote}</p>
            </div>
            <div>
              <h3>Rôles & permissions</h3>
              <p>{detail.roles.join(" · ")}</p>
              <div className="adm-table-wrap" style={{ marginTop: "0.55rem" }}>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Domaine</th>
                      <th>Créer</th>
                      <th>Lire</th>
                      <th>Modifier</th>
                      <th>Clôturer</th>
                      <th>Paramétrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.permissions.map((p) => (
                      <tr key={p.domain}>
                        <td>{p.domain}</td>
                        <td>{p.create ? "Oui" : "Non"}</td>
                        <td>{p.read ? "Oui" : "Non"}</td>
                        <td>{p.update ? "Oui" : "Non"}</td>
                        <td>{p.close ? "Oui" : "Non"}</td>
                        <td>{p.configure ? "Oui" : "Non"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="as-banner as-banner--warn" style={{ marginTop: "0.75rem" }}>
                {detail.separationNote}
              </p>
              <ul className="as-todo">
                {detail.prohibitions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Historique des accès sensibles</h3>
              {detail.history.length === 0 ? (
                <p className="as-empty">Aucune action journalisée pour ce membre.</p>
              ) : (
                <ul className="as-todo as-todo--done">
                  {detail.history.map((h) => (
                    <li key={h.id} className="is-done">
                      {h.action} · {formatDateTime(h.createdAt)} · {h.ipMasked || "IP —"}
                    </li>
                  ))}
                </ul>
              )}
              <p className="as-note">Les permissions granulaires ne sont pas encore éditables ici (matrice dérivée du rôle).</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
