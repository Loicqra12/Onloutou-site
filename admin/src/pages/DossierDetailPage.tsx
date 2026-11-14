import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { ArticlesOfferPanel, type OfferRequest } from "../components/ArticlesOfferPanel";
import { ClosureFlow, type ClosureView } from "../components/ClosureFlow";
import { HandoverFlow, type HandoverView } from "../components/HandoverFlow";
import { LogisticsFlow, type LogisticsView } from "../components/LogisticsFlow";
import { ReturnFlow, type ReturnView } from "../components/ReturnFlow";
import { RequestDetail } from "../components/RequestDetail";
import type { AdminRequestDetail } from "../lib/requestDetailView";
import { formatDateTime, initials } from "../lib/format";

type DeliveryView = LogisticsView | HandoverView | ReturnView;
const HANDOVER_VIEWS = new Set<string>(["arrival", "proof", "active", "refusal"]);
const RETURN_VIEWS = new Set<string>(["return_plan", "return_pickup", "return_depot", "return_partner"]);
const LOGISTICS_VIEWS = new Set<string>(["plan", "prepare", "collect", "depart"]);
const CLOSURE_VIEWS = new Set<string>(["bilan", "deposit", "payout", "close"]);

function resolveClosureView(payload: Record<string, unknown>, requested?: string | null): ClosureView {
  if (requested === "bilan" || requested === "deposit" || requested === "payout" || requested === "close") {
    return requested;
  }
  const closure = payload.closure && typeof payload.closure === "object" ? (payload.closure as Record<string, unknown>) : {};
  if (closure.closed) return "close";
  const deposit =
    closure.depositDecision && typeof closure.depositDecision === "object"
      ? (closure.depositDecision as Record<string, unknown>)
      : {};
  const payout =
    closure.partnerPayout && typeof closure.partnerPayout === "object"
      ? (closure.partnerPayout as Record<string, unknown>)
      : {};
  const selection = payload.selection && typeof payload.selection === "object" ? (payload.selection as Record<string, unknown>) : {};
  const items = Array.isArray(selection.items) ? selection.items : [];
  const hasPartner = items.some((row) => row && typeof row === "object" && (row as Record<string, unknown>).ownerKind !== "onloutou");
  if (deposit.submitted && (!hasPartner || payout.submitted)) return "close";
  if (deposit.submitted) return "payout";
  return "bilan";
}

function returnReadyForClosure(payload: Record<string, unknown>) {
  const logistics = payload.logistics && typeof payload.logistics === "object" ? (payload.logistics as Record<string, unknown>) : {};
  const returnFlow = logistics.returnFlow && typeof logistics.returnFlow === "object" ? (logistics.returnFlow as Record<string, unknown>) : {};
  const depot = returnFlow.depot && typeof returnFlow.depot === "object" ? (returnFlow.depot as Record<string, unknown>) : {};
  const pickup = returnFlow.pickup && typeof returnFlow.pickup === "object" ? (returnFlow.pickup as Record<string, unknown>) : {};
  return Boolean(logistics.status === "return_closed" || (pickup.recorded && depot.allValidated));
}

const STEPS = ["Demande", "Proposition", "Confirmation", "Location", "Clôture"] as const;

function stepIndex(status: string, payload?: Record<string, unknown> | null): number {
  const rental = payload?.rental && typeof payload.rental === "object" ? (payload.rental as Record<string, unknown>) : null;
  const proposal = payload?.proposal && typeof payload.proposal === "object" ? (payload.proposal as Record<string, unknown>) : null;
  if (status === "CLOSED" || status === "CANCELLED") return 4;
  if (rental?.status === "confirmed" || rental?.reserved === true || payload?.reserved === true) return 3;
  if (proposal?.clientResponse === "accepted" || rental?.agreementReceived || status === "WAITING_CLIENT") return 2;
  if (status === "QUOTED") return 1;
  if (status === "IN_REVIEW") return 0;
  return 0;
}

type Article = { title: string; owner: string; quantity: string; availability: string };

type Detail = AdminRequestDetail &
  OfferRequest & {
    title?: string;
    stage?: string;
    nextAction?: string;
    needLine?: string;
    typeLabel?: string;
    origin?: { key: string; label: string };
    assignee?: { id: string; email: string; displayName: string | null } | null;
    period?: { period: string | null; place: string | null };
    articles?: Article[];
  };

type Tab = "resume" | "articles" | "livraison" | "finances" | "activite";

function resolveDeliveryView(payload: Record<string, unknown>, requested?: string | null): DeliveryView {
  if (
    requested === "plan" ||
    requested === "prepare" ||
    requested === "collect" ||
    requested === "depart" ||
    requested === "arrival" ||
    requested === "proof" ||
    requested === "active" ||
    requested === "refusal" ||
    requested === "return_plan" ||
    requested === "return_pickup" ||
    requested === "return_depot" ||
    requested === "return_partner"
  ) {
    return requested;
  }
  const logistics = payload.logistics && typeof payload.logistics === "object" ? (payload.logistics as Record<string, unknown>) : {};
  const plan = logistics.plan && typeof logistics.plan === "object" ? (logistics.plan as Record<string, unknown>) : {};
  const departure = logistics.departure && typeof logistics.departure === "object" ? (logistics.departure as Record<string, unknown>) : {};
  const handover = logistics.handover && typeof logistics.handover === "object" ? (logistics.handover as Record<string, unknown>) : {};
  const proof = handover.proof && typeof handover.proof === "object" ? (handover.proof as Record<string, unknown>) : {};
  const arrival = handover.arrival && typeof handover.arrival === "object" ? (handover.arrival as Record<string, unknown>) : {};
  const returnFlow = logistics.returnFlow && typeof logistics.returnFlow === "object" ? (logistics.returnFlow as Record<string, unknown>) : {};
  const returnPlan = returnFlow.plan && typeof returnFlow.plan === "object" ? (returnFlow.plan as Record<string, unknown>) : {};
  const returnPickup = returnFlow.pickup && typeof returnFlow.pickup === "object" ? (returnFlow.pickup as Record<string, unknown>) : {};
  const returnDepot = returnFlow.depot && typeof returnFlow.depot === "object" ? (returnFlow.depot as Record<string, unknown>) : {};
  const partnerRest =
    returnFlow.partnerRestitution && typeof returnFlow.partnerRestitution === "object"
      ? (returnFlow.partnerRestitution as Record<string, unknown>)
      : {};
  const partnerRestItems = Array.isArray(partnerRest.items) ? partnerRest.items : [];
  const selection = payload.selection && typeof payload.selection === "object" ? (payload.selection as Record<string, unknown>) : {};
  const items = Array.isArray(selection.items) ? selection.items : [];
  const hasPartner = items.some((row) => row && typeof row === "object" && (row as Record<string, unknown>).ownerKind !== "onloutou");

  if (logistics.status === "return_closed") return "return_partner";
  if (returnDepot.allValidated && hasPartner && !partnerRestItems.some((row) => row && typeof row === "object" && (row as Record<string, unknown>).recorded)) {
    return "return_partner";
  }
  if (returnDepot.allValidated) return "return_depot";
  if (returnPickup.recorded) return "return_depot";
  if (returnPlan.missionsCreated) return "return_pickup";
  if (proof.handedOver) return "active";
  if (arrival.readyForProof) return "proof";
  if (departure.authorized) return "arrival";
  if (plan.missionsCreated) {
    const collections = Array.isArray(logistics.collections) ? logistics.collections : [];
    if (hasPartner && collections.length === 0) return "collect";
    return "prepare";
  }
  return "plan";
}

export function DossierDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [request, setRequest] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "resume");
  const [deliveryView, setDeliveryView] = useState<DeliveryView>("plan");
  const [closureView, setClosureView] = useState<ClosureView>("bilan");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function load() {
    if (!id) return;
    const res = await apiFetch<{ request: Detail }>(`/admin/requests/${id}`);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        nav("/login", { replace: true });
        return;
      }
      setError(res.error);
      return;
    }
    setRequest(res.data.request);
  }

  useEffect(() => {
    void load();
  }, [id]);

  useEffect(() => {
    const next = params.get("tab");
    if (next === "resume" || next === "articles" || next === "livraison" || next === "finances" || next === "activite") {
      setTab(next);
    }
    if (next === "livraison" && request?.payload) {
      setDeliveryView(resolveDeliveryView(request.payload as Record<string, unknown>, params.get("view")));
    }
    if (next === "finances" && request?.payload) {
      setClosureView(resolveClosureView(request.payload as Record<string, unknown>, params.get("view")));
    }
  }, [params, request?.payload]);

  function openTab(next: Tab, view?: DeliveryView | ClosureView) {
    setTab(next);
    const copy = new URLSearchParams(params);
    if (next === "resume") copy.delete("tab");
    else copy.set("tab", next);
    if (next === "livraison") {
      const resolved =
        (view && RETURN_VIEWS.has(view)) || (view && HANDOVER_VIEWS.has(view)) || (view && LOGISTICS_VIEWS.has(view))
          ? (view as DeliveryView)
          : resolveDeliveryView((request?.payload as Record<string, unknown>) || {}, params.get("view"));
      setDeliveryView(resolved);
      copy.set("view", resolved);
    } else if (next === "finances") {
      const resolved =
        view && CLOSURE_VIEWS.has(view)
          ? (view as ClosureView)
          : resolveClosureView((request?.payload as Record<string, unknown>) || {}, params.get("view"));
      setClosureView(resolved);
      copy.set("view", resolved);
    } else if (
      LOGISTICS_VIEWS.has(String(copy.get("view"))) ||
      HANDOVER_VIEWS.has(String(copy.get("view"))) ||
      RETURN_VIEWS.has(String(copy.get("view"))) ||
      CLOSURE_VIEWS.has(String(copy.get("view")))
    ) {
      copy.delete("view");
    }
    setParams(copy, { replace: true });
  }

  function setDeliveryViewAndUrl(next: DeliveryView) {
    setDeliveryView(next);
    const copy = new URLSearchParams(params);
    copy.set("tab", "livraison");
    copy.set("view", next);
    setParams(copy, { replace: true });
  }

  function setClosureViewAndUrl(next: ClosureView) {
    setClosureView(next);
    const copy = new URLSearchParams(params);
    copy.set("tab", "finances");
    copy.set("view", next);
    setParams(copy, { replace: true });
  }

  async function patchStatus(status: string, noteText?: string) {
    if (!id) return;
    setPending(true);
    const res = await apiFetch(`/admin/requests/${id}/status`, {
      method: "PATCH",
      json: { status, note: noteText },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNote("");
    await load();
  }

  async function addNote(event: FormEvent) {
    event.preventDefault();
    if (!request || !note.trim()) return;
    await patchStatus(request.status, note.trim());
  }

  if (error && !request) {
    return (
      <div className="as-page">
        <p className="as-error" role="alert">
          {error}
        </p>
      </div>
    );
  }
  if (!request) return <div className="as-page">Chargement…</div>;

  const payload = (request.payload ?? {}) as Record<string, unknown>;
  const assigneeName = request.assignee?.displayName?.trim() || request.assignee?.email || null;
  const title = request.title ?? `${request.organization || request.contactName} · ${request.typeLabel ?? request.type}`;
  const articles = request.articles?.length
    ? request.articles
    : [{ title: request.needLine || request.typeLabel || "Article", owner: "À confirmer", quantity: "—", availability: "À confirmer" }];
  const canQualify = request.status === "RECEIVED";
  const metaBits = [
    request.period?.period,
    request.period?.place || request.zone,
    typeof payload.supportLabel === "string" ? payload.supportLabel : null,
    assigneeName ? `Responsable : ${assigneeName}` : null,
  ].filter(Boolean);

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>
          <Link to="/dossiers">Dossiers de location</Link> / {request.reference}
        </span>
      </div>
      <div className="as-head">
        <div>
          <h1 className="as-h1">{title}</h1>
          <p className="as-lead">{metaBits.join(" · ") || `${request.reference} · Source : ${request.origin?.label ?? "Site"}`}</p>
        </div>
        <div className="as-head__actions">
          <span className="as-status">{request.stage ?? request.status}</span>
          {canQualify ? (
            <button
              type="button"
              className="as-btn"
              disabled={pending}
              onClick={() => void patchStatus("IN_REVIEW", "Dossier passé en qualification.")}
            >
              Qualifier le dossier
            </button>
          ) : null}
          <button
            type="button"
            className="as-btn as-btn--yellow"
            onClick={() =>
              openTab(
                rentalConfirmed(payload) ? "livraison" : "articles",
                rentalConfirmed(payload)
                  ? resolveDeliveryView(payload as Record<string, unknown>)
                  : undefined,
              )
            }
          >
            {rentalConfirmed(payload)
              ? String(request.nextAction || "Organiser la livraison")
              : "Préparer la proposition"}
          </button>
        </div>
      </div>

      <nav className="as-stepper" aria-label="Étapes du dossier">
        {STEPS.map((step, index) => (
          <span key={step} className={`as-step${index <= stepIndex(request.status, payload) ? " is-on" : ""}`}>
            {step}
          </span>
        ))}
      </nav>

      <div className="as-tabs-line">
        <button type="button" className={tab === "resume" ? "is-on" : ""} onClick={() => openTab("resume")}>
          Résumé
        </button>
        <button type="button" className={tab === "articles" ? "is-on" : ""} onClick={() => openTab("articles")}>
          Articles & propositions
        </button>
        <button type="button" className={tab === "livraison" ? "is-on" : ""} onClick={() => openTab("livraison")}>
          Livraison & reprise
        </button>
        <button type="button" className={tab === "finances" ? "is-on" : ""} onClick={() => openTab("finances")}>
          Finances
        </button>
        <button type="button" className={tab === "activite" ? "is-on" : ""} onClick={() => openTab("activite")}>
          Activité
        </button>
      </div>

      {tab === "activite" ? (
        <section className="as-card">
          <RequestDetail request={request} />
        </section>
      ) : null}

      {tab === "articles" ? (
        <ArticlesOfferPanel
          request={request}
          initialView={params.get("view") === "proposal" ? "proposal" : "search"}
          onOrganizeDelivery={() => openTab("livraison", "plan")}
          onUpdated={(next) =>
            setRequest((current) => (current ? ({ ...current, ...next } as Detail) : current))
          }
        />
      ) : null}

      {tab === "livraison" ? (
        rentalConfirmed(payload) ? (
          RETURN_VIEWS.has(deliveryView) ? (
            <ReturnFlow
              request={request}
              view={deliveryView as ReturnView}
              onView={(next) => setDeliveryViewAndUrl(next)}
              onBackToDossier={() => openTab("resume")}
              onOpenClosure={() => openTab("finances", "bilan")}
              onUpdated={(next) =>
                setRequest((current) => (current ? ({ ...current, ...next } as Detail) : current))
              }
            />
          ) : HANDOVER_VIEWS.has(deliveryView) ? (
            <HandoverFlow
              request={request}
              view={deliveryView as HandoverView}
              onView={(next) => setDeliveryViewAndUrl(next as DeliveryView)}
              onBackToDossier={() => openTab("resume")}
              onUpdated={(next) =>
                setRequest((current) => (current ? ({ ...current, ...next } as Detail) : current))
              }
            />
          ) : (
            <LogisticsFlow
              request={request}
              view={deliveryView as LogisticsView}
              onView={(next) => setDeliveryViewAndUrl(next)}
              onBackToDossier={() => openTab("resume")}
              onUpdated={(next) =>
                setRequest((current) => (current ? ({ ...current, ...next } as Detail) : current))
              }
            />
          )
        ) : (
          <section className="as-card">
            <h2>Livraison & reprise</h2>
            <p className="as-empty">
              Confirmez d’abord la location pour organiser la livraison. La planification ne sera disponible qu’après réservation des articles.
            </p>
            <button type="button" className="as-btn as-btn--yellow" onClick={() => openTab("articles")}>
              Ouvrir Articles & propositions
            </button>
          </section>
        )
      ) : null}

      {tab === "finances" ? (
        returnReadyForClosure(payload) ? (
          <ClosureFlow
            request={request}
            view={closureView}
            onView={setClosureViewAndUrl}
            onBackToDossier={() => openTab("resume")}
            onUpdated={(next) =>
              setRequest((current) => (current ? ({ ...current, ...next } as Detail) : current))
            }
          />
        ) : (
          <div className="as-finance">
            <section className="as-card">
              <h2>Clôture financière</h2>
              <p className="as-empty">
                Disponible après validation du retour (reprise + contrôle dépôt). Aucun remboursement ni reversement n’est inventé ici.
              </p>
              <button type="button" className="as-btn as-btn--yellow" onClick={() => openTab("livraison")}>
                Ouvrir Livraison & reprise
              </button>
            </section>
            <section className="as-card">
              <h2>Règlements du client</h2>
              <p className="as-empty">Les montants suivis restent ceux déjà enregistrés sur le dossier. Aucun montant n’est inventé.</p>
            </section>
            <section className="as-card">
              <h2>Facturation et taxes</h2>
              <p className="as-empty">
                Le propriétaire affiché sur le résumé est indispensable, mais il ne détermine pas qui facture ni comment appliquer la TVA.
              </p>
            </section>
          </div>
        )
      ) : null}

      {tab === "resume" ? (
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <div className="as-card__head">
                <h2>Le besoin du client</h2>
              </div>
              <div className="as-need">
                <p>
                  <small>Articles</small>
                  {typeof payload.familyLabel === "string" ? payload.familyLabel : request.typeLabel ?? request.type}
                </p>
                <p>
                  <small>Période</small>
                  {request.period?.period ??
                    (typeof payload.timelineLabel === "string"
                      ? payload.timelineLabel
                      : typeof payload.deadline === "string"
                        ? payload.deadline
                        : "Non précisée")}
                </p>
                <p>
                  <small>Lieu</small>
                  {request.zone ?? "À confirmer"}
                </p>
                <p>
                  <small>Usage</small>
                  {typeof payload.usageLabel === "string" ? payload.usageLabel : "Non précisé"}
                </p>
                <p>
                  <small>Services</small>
                  {typeof payload.supportLabel === "string" ? payload.supportLabel : "—"}
                </p>
                <p>
                  <small>Source</small>
                  {request.origin?.label ?? "Site"}
                </p>
              </div>
              <p className="as-note">{request.message}</p>
            </section>

            <section className="as-card">
              <div className="as-card__head">
                <h2>Articles envisagés</h2>
                <button type="button" className="as-btn as-btn--ghost" onClick={() => openTab("articles")}>
                  Rechercher les articles
                </button>
              </div>
              <table className="as-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Propriétaire</th>
                    <th>Quantité</th>
                    <th>Disponibilité</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((row) => (
                    <tr key={`${row.title}-${row.owner}`}>
                      <td>{row.title}</td>
                      <td>
                        <strong>{row.owner}</strong>
                      </td>
                      <td>{row.quantity}</td>
                      <td>
                        <span className="as-badge as-badge--warn">{row.availability}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="as-empty" style={{ marginTop: "0.7rem" }}>
                Le propriétaire reste affiché. Il ne suffit pas à déterminer qui facture ni comment appliquer la TVA.
              </p>
            </section>

            <ConditionsBlock payload={payload} />
          </div>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <div className="as-card__head">
                <h2>Suivi du dossier</h2>
              </div>
              <p>
                <small style={{ color: "var(--as-muted)" }}>Responsable</small>
                <br />
                <span className="as-person">
                  {assigneeName ? <b>{initials(assigneeName)}</b> : null}
                  {assigneeName ?? "Non affecté"}
                </span>
              </p>
              <p>
                <small style={{ color: "var(--as-muted)" }}>Prochaine action</small>
                <br />
                <span className="as-badge as-badge--warn">{request.nextAction ?? "Ouvrir"}</span>
              </p>
              {returnReadyForClosure(payload) ? (
                <button
                  type="button"
                  className="as-btn as-btn--yellow"
                  style={{ marginTop: "0.65rem", width: "100%" }}
                  onClick={() => openTab("finances", resolveClosureView(payload))}
                >
                  {request.status === "CLOSED" ? "Voir la clôture" : "Ouvrir la clôture financière"}
                </button>
              ) : null}
            </section>
            <section className="as-card">
              <div className="as-card__head">
                <h2>Client</h2>
              </div>
              <p>
                <strong>{request.organization || request.contactName}</strong>
                <br />
                <span className="as-empty">{request.contactEmail || request.contactPhone || "Coordonnées à compléter"}</span>
              </p>
            </section>
            <section className="as-card">
              <div className="as-card__head">
                <h2>Notes internes</h2>
              </div>
              {request.events.filter((ev) => ev.note).length === 0 ? (
                <p className="as-empty">Aucune note pour l’équipe.</p>
              ) : (
                request.events
                  .filter((ev) => ev.note)
                  .map((ev) => (
                    <p key={`${ev.createdAt}-${ev.note}`} className="as-note">
                      {ev.note}
                      <br />
                      <small>{formatDateTime(ev.createdAt)}</small>
                    </p>
                  ))
              )}
              <form onSubmit={(e) => void addNote(e)} style={{ display: "grid", gap: "0.5rem", marginTop: "0.7rem" }}>
                <textarea
                  className="as-field"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajouter une note pour l’équipe…"
                />
                <button type="submit" className="as-btn as-btn--yellow" disabled={pending || !note.trim()}>
                  Enregistrer
                </button>
              </form>
            </section>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function rentalConfirmed(payload: Record<string, unknown>) {
  const rental = payload.rental && typeof payload.rental === "object" ? (payload.rental as Record<string, unknown>) : null;
  return rental?.status === "confirmed" || rental?.reserved === true || payload.reserved === true;
}

function ConditionsBlock({ payload }: { payload: Record<string, unknown> }) {
  const proposal = payload.proposal && typeof payload.proposal === "object" ? (payload.proposal as Record<string, unknown>) : {};
  const rental = payload.rental && typeof payload.rental === "object" ? (payload.rental as Record<string, unknown>) : {};
  const payment =
    payload.payment && typeof payload.payment === "object"
      ? ((payload.payment as Record<string, unknown>).initial as Record<string, unknown> | undefined)
      : undefined;
  const confirmed = rental.status === "confirmed" || rental.reserved === true || payload.reserved === true;
  const agreed = proposal.clientResponse === "accepted" || rental.agreementReceived === true;
  const paid = payment?.verified === true;
  const sent = proposal.status === "sent" || proposal.sentToClient === true;

  return (
    <section className="as-card">
      <div className="as-card__head">
        <h2>Conditions de confirmation</h2>
      </div>
      <ul className="as-conditions">
        <li>
          <span>Disponibilité des articles</span>
          <strong>{confirmed ? "Réservée" : "À confirmer"}</strong>
        </li>
        <li>
          <span>Proposition client</span>
          <strong>{agreed ? "Accord reçu" : sent ? "Transmise" : "Non envoyée"}</strong>
        </li>
        <li>
          <span>Paiement initial requis</span>
          <strong>{String(proposal.paymentInitial || "À définir dans la proposition")}</strong>
        </li>
        <li>
          <span>Paiement reçu</span>
          <strong>{paid ? "Vérifié" : "Aucun"}</strong>
        </li>
      </ul>
      <p className="as-empty" style={{ marginTop: "0.75rem" }}>
        {confirmed
          ? "Location confirmée. La remise reste bloquée tant que solde, dépôt et contrôles de départ ne sont pas remplis."
          : agreed
            ? "Accord reçu. Aucun article réservé tant que la location n’est pas confirmée."
            : "Le dossier reste en qualification. Préparer une proposition ne réserve rien."}
      </p>
    </section>
  );
}
