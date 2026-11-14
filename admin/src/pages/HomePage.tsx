import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { apiFetch } from "../api";
import type { AdminOutlet } from "../components/AdminShell";
import { IconBox, IconCard, IconCheck, IconFolder, IconPark, IconPhone, IconPlus, IconTruck, IconWeb, IconWhatsApp } from "../components/NavIcons";
import { formatLongDate, formatTime, initials } from "../lib/format";

type Priority = {
  id: string;
  kind: string;
  severity: "alert" | "warn" | "info";
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  assignee: string | null;
  assigneeId: string | null;
  actionLabel: string;
};

type RecentDossier = {
  id: string;
  reference: string;
  title: string;
  need: string;
  source: string;
  sourceKey: "web" | "phone" | "whatsapp" | "other";
  stage: string;
  assignee: string | null;
  createdAt: string;
  href: string;
};

type Overview = {
  counts: {
    dossiersToHandle: number;
    deliveriesToAssign: number;
    articlesToReview: number;
    paymentsToReview: number;
  };
  priorities: Priority[];
  recentDossiers: RecentDossier[];
  tasks: { id: string; title: string; subtitle: string; href: string }[];
  teamActivity: { id: string; at: string; actor: string; text: string }[];
};

export function HomePage() {
  const nav = useNavigate();
  const { user } = useOutletContext<AdminOutlet>();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "mine" | "team">("all");

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<Overview>("/admin/overview");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(res.error);
        return;
      }
      setData(res.data);
    })();
  }, [nav]);

  const priorities = useMemo(() => {
    if (!data) return [];
    if (tab === "mine") return data.priorities.filter((row) => row.assigneeId === user.id);
    if (tab === "team") return data.priorities.filter((row) => row.assigneeId && row.assigneeId !== user.id);
    return data.priorities;
  }, [data, tab, user.id]);

  if (error) {
    return (
      <div className="as-page">
        <p className="as-error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!data) return <div className="as-page">Chargement…</div>;

  const { counts } = data;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / Vue d’ensemble</span>
      </div>
      <div className="as-head">
        <div>
          <h1 className="as-h1">Votre activité, vos priorités.</h1>
          <p className="as-lead">
            {formatLongDate()} · Équipe ONLOUTOU
          </p>
        </div>
        <div className="as-head__actions">
          <Link className="as-btn" to="/travail">
            <IconCheck />
            Mon travail
          </Link>
          <Link className="as-btn as-btn--yellow" to="/dossiers/nouveau">
            <IconPlus />
            Créer un dossier
          </Link>
        </div>
      </div>

      <section className="as-kpis" aria-label="Priorités du jour">
        <Link className="as-kpi" to="/dossiers?open=1">
          <span className="as-kpi__icon as-kpi__icon--folder">
            <IconFolder />
          </span>
          <strong>{counts.dossiersToHandle}</strong>
          <span>Dossiers à traiter</span>
          <small>{counts.dossiersToHandle ? "Voir les dossiers en attente →" : "Aucun dossier ouvert"}</small>
        </Link>
        <Link className="as-kpi" to="/livraisons">
          <span className="as-kpi__icon as-kpi__icon--truck">
            <IconTruck />
          </span>
          <strong>{counts.deliveriesToAssign}</strong>
          <span>Livraisons à affecter</span>
          <small>{counts.deliveriesToAssign ? "Affecter un livreur →" : "Rien à affecter"}</small>
        </Link>
        <Link className="as-kpi" to="/articles">
          <span className="as-kpi__icon as-kpi__icon--box">
            <IconBox />
          </span>
          <strong>{counts.articlesToReview}</strong>
          <span>Articles à vérifier</span>
          <small>{counts.articlesToReview ? "Contrôler les fiches →" : "Aucune fiche en attente"}</small>
        </Link>
        <Link className="as-kpi" to="/paiements">
          <span className="as-kpi__icon as-kpi__icon--card">
            <IconCard />
          </span>
          <strong>{counts.paymentsToReview}</strong>
          <span>Paiements à vérifier</span>
          <small>{counts.paymentsToReview ? "Examiner les justificatifs →" : "Aucun paiement en attente"}</small>
        </Link>
      </section>

      <div className="as-grid">
        <section className="as-card">
          <div className="as-card__head">
            <h2>À traiter en priorité</h2>
            <div className="as-tabs">
              <button type="button" className={tab === "all" ? "is-on" : ""} onClick={() => setTab("all")}>
                Tout
              </button>
              <button type="button" className={tab === "mine" ? "is-on" : ""} onClick={() => setTab("mine")}>
                Mes dossiers
              </button>
              <button type="button" className={tab === "team" ? "is-on" : ""} onClick={() => setTab("team")}>
                Équipe
              </button>
            </div>
          </div>
          {priorities.length === 0 ? (
            <p className="as-empty">Rien n’attend une action immédiate.</p>
          ) : (
            priorities.map((row) => (
              <div className="as-prio" key={`${row.kind}-${row.id}`}>
                <span className={`as-sev as-sev--${row.severity}`}>{row.severity === "alert" ? "!" : row.severity === "warn" ? "▲" : "i"}</span>
                <div className="as-prio__copy">
                  <strong>{row.title}</strong>
                  <span>{row.subtitle}</span>
                </div>
                <span className="as-badge as-badge--warn">{row.badge}</span>
                <span className="as-person">
                  {row.assignee ? <b>{initials(row.assignee)}</b> : null}
                  {row.assignee ?? "Non affecté"}
                </span>
                <Link className="as-btn as-btn--yellow" to={row.href}>
                  {row.actionLabel}
                </Link>
              </div>
            ))
          )}
        </section>

        <section className="as-card">
          <div className="as-card__head">
            <h2>Mon travail aujourd’hui</h2>
          </div>
          {data.tasks.length === 0 ? (
            <p className="as-empty">Aucun dossier ne vous est affecté pour le moment.</p>
          ) : (
            data.tasks.map((task) => (
              <Link className="as-task" key={task.id} to={task.href}>
                <i aria-hidden="true" />
                <span>
                  <strong>{task.title}</strong>
                  <span className="as-empty">{task.subtitle}</span>
                </span>
              </Link>
            ))
          )}
          <div className="as-card__head" style={{ marginTop: "0.8rem", marginBottom: 0 }}>
            <span />
            <Link to="/travail">Voir mes tâches →</Link>
          </div>
        </section>
      </div>

      <div className="as-grid">
        <section className="as-card">
          <div className="as-card__head">
            <h2>
              <IconFolder /> Dossiers récents
            </h2>
            <Link to="/dossiers">Voir tous les dossiers →</Link>
          </div>
          {data.recentDossiers.length === 0 ? (
            <p className="as-empty">Aucun dossier ouvert.</p>
          ) : (
            <table className="as-table">
              <thead>
                <tr>
                  <th>Dossier</th>
                  <th>Client & besoin</th>
                  <th>Source</th>
                  <th>Étape</th>
                  <th>Responsable</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDossiers.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.reference}</strong>
                      <small>Créé le {formatLongDate(row.createdAt)}</small>
                    </td>
                    <td>
                      <strong>{row.title}</strong>
                      <small>{row.need || "—"}</small>
                    </td>
                    <td>
                      <span className="as-source">
                        {row.sourceKey === "whatsapp" ? (
                          <IconWhatsApp />
                        ) : row.sourceKey === "phone" ? (
                          <IconPhone />
                        ) : (
                          <IconWeb />
                        )}
                        {row.source}
                      </span>
                    </td>
                    <td>
                      <span className="as-badge as-badge--stage">{row.stage}</span>
                    </td>
                    <td>
                      <span className="as-person">
                        {row.assignee ? <b>{initials(row.assignee)}</b> : null}
                        {row.assignee ?? "—"}
                      </span>
                    </td>
                    <td>
                      <Link className="as-btn as-btn--yellow" to={row.href}>
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="as-card">
          <div className="as-card__head">
            <h2>Activité de l’équipe</h2>
          </div>
          {data.teamActivity.length === 0 ? (
            <p className="as-empty">Aucune action récente.</p>
          ) : (
            <ol className="as-feed">
              {data.teamActivity.map((row) => (
                <li key={row.id}>
                  <time dateTime={row.at}>{formatTime(row.at)}</time>
                  <p>
                    <strong>{row.actor}</strong> {row.text}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="as-split">
        <section className="as-card">
          <div className="as-card__head">
            <h2>
              <IconPark /> Parc ONLOUTOU
            </h2>
          </div>
          <p className="as-empty">Aucun équipement immobilisé pour entretien n’est enregistré.</p>
          <div className="as-card__head" style={{ marginBottom: 0 }}>
            <span />
            <Link className="as-btn" to="/parc">
              Voir le parc →
            </Link>
          </div>
        </section>
        <section className="as-card">
          <div className="as-card__head">
            <h2>Documents à renouveler</h2>
          </div>
          <p className="as-empty">Aucune échéance documentaire n’est suivie pour le moment.</p>
          <div className="as-card__head" style={{ marginBottom: 0 }}>
            <span />
            <Link className="as-btn" to="/protection">
              Consulter →
            </Link>
          </div>
        </section>
      </div>

    </div>
  );
}
