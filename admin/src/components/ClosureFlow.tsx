import { useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth, formatFcfa } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type ClosureView = "bilan" | "deposit" | "payout" | "close";

type Props = {
  request: OfferRequest;
  view: ClosureView;
  onView: (view: ClosureView) => void;
  onUpdated: (request: OfferRequest) => void;
  onBackToDossier?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function ClosureFlow({ request, view, onView, onUpdated, onBackToDossier }: Props) {
  const payload = asRecord(request.payload);
  const rental = asRecord(payload.rental);
  const payment = asRecord(payload.payment);
  const logistics = asRecord(payload.logistics);
  const returnFlow = asRecord(logistics.returnFlow);
  const pickup = asRecord(returnFlow.pickup);
  const depot = asRecord(returnFlow.depot);
  const partnerRest = asRecord(returnFlow.partnerRestitution);
  const closure = asRecord(payload.closure);
  const depositDecision = asRecord(closure.depositDecision);
  const partnerPayout = asRecord(closure.partnerPayout);

  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : [];
  const depotItems = Array.isArray(depot.items) ? depot.items.map((row) => asRecord(row)) : [];
  const partnerItems = selection.filter((row) => row.ownerKind !== "onloutou");
  const hasPartner = partnerItems.length > 0;

  const clientName = request.organization || request.contactName || "Client";
  const startDate = typeof payload.startDate === "string" ? payload.startDate : String(rental.periodStart ?? "");
  const endDate = typeof payload.endDate === "string" ? payload.endDate : String(rental.periodEnd ?? "");
  const depositHeld =
    String(depositDecision.heldAmount || asRecord(payment.deposit).amount || "").trim() ||
    String(asRecord(payload.proposal).depositAmount || "");
  const partnerDue =
    String(partnerPayout.amount || "").trim() ||
    (() => {
      let total = 0;
      for (const row of partnerItems) {
        const n = Number(String(row.partnerAmount ?? row.amountPartner ?? "").replace(/\s/g, "").replace(",", "."));
        if (!Number.isNaN(n)) total += n;
      }
      return total > 0 ? String(Math.round(total)) : "";
    })();

  const closed = Boolean(closure.closed) || request.status === "CLOSED";
  const depositSubmitted = Boolean(depositDecision.submitted);
  const payoutSubmitted = Boolean(partnerPayout.submitted);
  const canClose = depositSubmitted && (!hasPartner || payoutSubmitted) && !closed;

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [kind, setKind] = useState<"full" | "partial" | "retain">(
    (depositDecision.kind as "full" | "partial" | "retain") || "full",
  );
  const [explanation, setExplanation] = useState(
    String(depositDecision.explanation || "Aucune retenue proposée : retour conforme."),
  );
  const [refundAmount, setRefundAmount] = useState(String(depositDecision.refundAmount || depositHeld));
  const [retainAmount, setRetainAmount] = useState(String(depositDecision.retainAmount || ""));
  const [approverLabel, setApproverLabel] = useState(String(depositDecision.approverLabel || ""));

  const [payoutAmount, setPayoutAmount] = useState(partnerDue);
  const [validatorLabel, setValidatorLabel] = useState(String(partnerPayout.validatorLabel || ""));
  const [beneficiary, setBeneficiary] = useState(
    String(partnerPayout.beneficiary || partnerItems[0]?.ownerName || "Partenaire"),
  );

  const [closeDate, setCloseDate] = useState(String(closure.closeDate || new Date().toISOString().slice(0, 10)));
  const [closeReason, setCloseReason] = useState(String(closure.closeReason || "Location terminée sans incident"));
  const [closeNote, setCloseNote] = useState(String(closure.closeNote || ""));

  const contextBar = (
    <div className="as-need" style={{ marginBottom: "0.85rem" }}>
      <p>
        <small>Dossier</small>
        {request.reference}
      </p>
      <p>
        <small>Client</small>
        {clientName}
      </p>
      <p>
        <small>Location</small>
        {formatDateRange(startDate, endDate)}
      </p>
      <p>
        <small>Retour</small>
        {depot.allValidated ? "Conforme" : "En cours"}
      </p>
      <p>
        <small>Dépôt</small>
        {depositHeld ? formatFcfa(depositHeld) : "Non renseigné"}
      </p>
      <p>
        <small>Articles</small>
        {selection.length}
      </p>
    </div>
  );

  async function saveDeposit(submit: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/closure/deposit`, {
      method: "PATCH",
      json: {
        kind,
        explanation,
        refundAmount: kind === "full" ? depositHeld : refundAmount,
        retainAmount: kind === "full" ? "" : retainAmount,
        approverLabel,
        submit,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(submit ? "Décision soumise. Aucun remboursement exécuté automatiquement." : "Brouillon enregistré.");
    if (submit) onView(hasPartner ? "payout" : "close");
  }

  async function savePayout(submit: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/closure/payout`, {
      method: "PATCH",
      json: {
        amount: payoutAmount,
        beneficiary,
        validatorLabel,
        preparedBy: "Responsable dossier",
        submit,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(submit ? "Reversement soumis à validation. Aucun paiement exécuté automatiquement." : "Brouillon enregistré.");
    if (submit) onView("close");
  }

  async function closeNow() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/closure/close`, {
      method: "POST",
      json: { closeDate, closeReason, closeNote },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice("Dossier clôturé et archivé.");
  }

  if (view === "close") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Clôturer le dossier
            </h2>
            <p className="as-lead">Vérifiez toutes les conditions puis fermez et archivez le dossier.</p>
          </div>
          <span className={`as-badge ${closed ? "as-badge--stage" : canClose ? "as-badge--stage" : "as-badge--warn"}`}>
            {closed ? "Fermé" : canClose ? "Prêt à clôturer" : "Conditions incomplètes"}
          </span>
        </div>
        {contextBar}
        {canClose || closed ? (
          <p className="as-banner as-banner--ok">Toutes les conditions de clôture sont remplies — ou le dossier est déjà fermé.</p>
        ) : (
          <p className="as-banner as-banner--warn">Soumettez le dépôt et, si besoin, le reversement partenaire avant clôture.</p>
        )}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Conditions</h2>
              <ul className="as-checks-list">
                <li className="is-ok">
                  <IconCheck /> Paiement client suivi
                </li>
                <li className={depot.allValidated ? "is-ok" : ""}>
                  <IconCheck /> Articles retournés et contrôlés
                </li>
                <li className={!hasPartner || Array.isArray(partnerRest.items) ? "is-ok" : ""}>
                  <IconCheck /> Restitution partenaire {hasPartner ? "traitée" : "non concernée"}
                </li>
                <li className={depositSubmitted ? "is-ok" : ""}>
                  <IconCheck /> Décision de dépôt soumise {depositSubmitted ? `(${String(depositDecision.reference)})` : ""}
                </li>
                <li className={!hasPartner || payoutSubmitted ? "is-ok" : ""}>
                  <IconCheck /> Reversement {hasPartner ? (payoutSubmitted ? `soumis (${String(partnerPayout.reference)})` : "à soumettre") : "non concerné"}
                </li>
                <li className="is-ok">
                  <IconCheck /> Documents de retour disponibles au dossier
                </li>
              </ul>
            </section>
            <section className="as-card">
              <h2>Situation finale des articles</h2>
              <div className="as-sel-list">
                {selection.map((row) => {
                  const d = depotItems.find((item) => item.productId === row.productId);
                  const partnerOwned = row.ownerKind !== "onloutou";
                  return (
                    <div className="as-sel-item" key={String(row.productId)}>
                      {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                      <div>
                        <strong>{String(row.reference || row.title)}</strong>
                        <small>{String(row.ownerName)}</small>
                        <span className="as-badge as-badge--stage">{d?.validated ? "Conforme" : "À contrôler"}</span>
                        <p className="as-empty">
                          {partnerOwned ? "Restitué au partenaire / disponibilité à confirmer" : "Au dépôt Marcory — disponible après clôture stock"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Clôture</h2>
              <label>
                Date
                <input className="as-field" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} disabled={closed} />
              </label>
              <label>
                Motif
                <input className="as-field" value={closeReason} onChange={(e) => setCloseReason(e.target.value)} disabled={closed} />
              </label>
              <label>
                Note interne
                <textarea className="as-field" rows={3} value={closeNote} onChange={(e) => setCloseNote(e.target.value)} disabled={closed} />
              </label>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                style={{ width: "100%", marginTop: "0.65rem" }}
                disabled={pending || closed || !canClose}
                onClick={() => void closeNow()}
              >
                {closed ? "Dossier déjà clôturé" : pending ? "Clôture…" : "Clôturer définitivement le dossier"}
              </button>
            </section>
            <section className="as-card as-side">
              <h2>Après clôture</h2>
              <p className="as-empty">Statut Fermé · conservation des preuves · exécutions financières traitées à part si besoin.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView(hasPartner ? "payout" : "deposit")}>
            ← Étape précédente
          </button>
          {onBackToDossier ? (
            <button type="button" className="as-btn" onClick={onBackToDossier}>
              Retour au dossier
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "payout") {
    if (!hasPartner) {
      return (
        <div className="as-offer">
          <p className="as-note">Aucun article partenaire : passez directement à la clôture.</p>
          <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("close")}>
            Clôturer le dossier
          </button>
        </div>
      );
    }
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Préparer le reversement partenaire
            </h2>
            <p className="as-lead">Contrôlez les justificatifs et soumettez le paiement à validation.</p>
          </div>
          <span className={`as-badge ${payoutSubmitted ? "as-badge--stage" : "as-badge--warn"}`}>
            {payoutSubmitted ? "Soumis à validation" : "À contrôler"}
          </span>
        </div>
        {contextBar}
        <p className="as-banner as-banner--ok">
          Dossier conforme côté retour : le reversement peut être préparé sous réserve des validations. Aucun paiement automatique.
        </p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Partenaire et opération</h2>
              <p>
                <small>Partenaire</small>
                {String(partnerItems[0]?.ownerName || "—")}
              </p>
              <p>
                <small>Article</small>
                {String(partnerItems[0]?.title || "—")} · {String(partnerItems[0]?.reference || "—")}
              </p>
              <p className="as-empty">Restitution partenaire enregistrée au retour — hors matériel ONLOUTOU.</p>
            </section>
            <section className="as-card">
              <h2>Base du reversement</h2>
              <label>
                Montant proposé
                <input className="as-field" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} disabled={payoutSubmitted} />
              </label>
              <p className="as-empty">
                Affiché : {payoutAmount ? formatFcfa(payoutAmount) : "à renseigner"} · Ajustements : Aucun · Déductions : Aucune
              </p>
            </section>
            <section className="as-card">
              <h2>Contrôles préalables</h2>
              <ul className="as-todo as-todo--done">
                <li className="is-done">Identité partenaire</li>
                <li className="is-done">Coordonnées de paiement à confirmer</li>
                <li className="is-done">Prestation exécutée / article restitué</li>
                <li className="is-done">Aucun litige actif bloquant</li>
                <li>Traitement comptable — à valider</li>
              </ul>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Paiement à préparer</h2>
              <label>
                Bénéficiaire
                <input className="as-field" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} disabled={payoutSubmitted} />
              </label>
              <label>
                Validation financière
                <input
                  className="as-field"
                  value={validatorLabel}
                  onChange={(e) => setValidatorLabel(e.target.value)}
                  placeholder="À affecter"
                  disabled={payoutSubmitted}
                />
              </label>
              <span className={`as-badge ${payoutSubmitted ? "as-badge--stage" : "as-badge--warn"}`}>
                {payoutSubmitted ? String(partnerPayout.reference) : "Non autorisé"}
              </span>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                style={{ width: "100%", marginTop: "0.65rem" }}
                disabled={pending || payoutSubmitted || !payoutAmount.trim()}
                onClick={() => void savePayout(true)}
              >
                {payoutSubmitted ? "Déjà soumis" : "Soumettre le reversement à validation"}
              </button>
            </section>
            <section className="as-card as-side">
              <h2>Circuit</h2>
              <ul className="as-checks-list">
                <li className="is-ok">
                  <IconCheck /> Éligibilité
                </li>
                <li className={payoutSubmitted ? "is-ok" : ""}>
                  <IconCheck /> Autorisation (2 étapes)
                </li>
                <li>
                  <IconCheck /> Exécution — non exécutée ici
                </li>
              </ul>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("deposit")}>
            ← Dépôt de garantie
          </button>
          <button type="button" className="as-btn as-btn--yellow" disabled={!payoutSubmitted} onClick={() => onView("close")}>
            Continuer vers la clôture
          </button>
        </div>
      </div>
    );
  }

  if (view === "deposit") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Décider du dépôt de garantie
            </h2>
            <p className="as-lead">Préparez la restitution intégrale, partielle ou une retenue justifiée.</p>
          </div>
          <span className={`as-badge ${depositSubmitted ? "as-badge--stage" : "as-badge--warn"}`}>
            {depositSubmitted ? "Décision soumise" : "Décision à valider"}
          </span>
        </div>
        {contextBar}
        <p className="as-banner as-banner--ok">
          Retour conforme : articles restitués / contrôlés sans nouveau défaut bloquant. Aucun incident non résolu déclaré.
        </p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Éléments examinés</h2>
              <ul className="as-todo as-todo--done">
                <li className="is-done">Articles retournés</li>
                <li className="is-done">Quantités</li>
                <li className="is-done">Accessoires</li>
                <li className="is-done">État après contrôle</li>
                <li className="is-done">Litiges / réserves</li>
                <li className="is-done">Rapports de retour</li>
              </ul>
            </section>
            <section className="as-card">
              <h2>Dépôt détenu</h2>
              <p>
                <strong>{depositHeld ? formatFcfa(depositHeld) : "Montant non renseigné sur le dossier"}</strong>
              </p>
              <span className="as-badge as-badge--warn">Détenu</span>
            </section>
            <section className="as-card">
              <h2>Décision proposée</h2>
              {(
                [
                  ["full", "Restitution intégrale"],
                  ["partial", "Restitution partielle"],
                  ["retain", "Retenue"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="as-check">
                  <input
                    type="radio"
                    checked={kind === value}
                    disabled={depositSubmitted}
                    onChange={() => setKind(value)}
                  />
                  {label}
                </label>
              ))}
              <label style={{ marginTop: "0.65rem" }}>
                Explication
                <textarea
                  className="as-field"
                  rows={3}
                  value={explanation}
                  disabled={depositSubmitted}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </label>
              {kind !== "full" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginTop: "0.55rem" }}>
                  <label>
                    Montant à restituer
                    <input className="as-field" value={refundAmount} disabled={depositSubmitted} onChange={(e) => setRefundAmount(e.target.value)} />
                  </label>
                  <label>
                    Montant retenu
                    <input className="as-field" value={retainAmount} disabled={depositSubmitted} onChange={(e) => setRetainAmount(e.target.value)} />
                  </label>
                </div>
              ) : null}
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Remboursement à préparer</h2>
              <p>
                <small>Bénéficiaire</small>
                {clientName}
              </p>
              <p>
                <small>Canal</small>
                Canal validé manuellement
              </p>
              <label>
                Approbateur interne
                <input
                  className="as-field"
                  value={approverLabel}
                  placeholder="À affecter"
                  disabled={depositSubmitted}
                  onChange={(e) => setApproverLabel(e.target.value)}
                />
              </label>
              <ul className="as-checks-list" style={{ marginTop: "0.65rem" }}>
                <li className="is-ok">
                  <IconCheck /> Éligibilité
                </li>
                <li className={depositSubmitted ? "is-ok" : ""}>
                  <IconCheck /> Autorisation
                </li>
                <li>
                  <IconCheck /> Exécution — en attente hors de cet écran
                </li>
              </ul>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                style={{ width: "100%", marginTop: "0.65rem" }}
                disabled={pending || depositSubmitted}
                onClick={() => void saveDeposit(true)}
              >
                {depositSubmitted ? "Déjà soumis" : "Soumettre la restitution à validation"}
              </button>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("bilan")}>
            ← Bilan de retour
          </button>
          <button
            type="button"
            className="as-btn as-btn--yellow"
            disabled={!depositSubmitted}
            onClick={() => onView(hasPartner ? "payout" : "close")}
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // bilan G11A
  return (
    <div className="as-offer">
      <div className="as-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
            Bilan de retour
          </h2>
          <p className="as-lead">Centralisez articles, preuves et opérations restantes.</p>
        </div>
        <div className="as-head__actions">
          <span className="as-badge as-badge--stage">Retour validé</span>
          <span className={`as-badge ${closed ? "as-badge--stage" : "as-badge--warn"}`}>
            {closed ? "Dossier fermé" : "Clôture financière à traiter"}
          </span>
        </div>
      </div>
      {contextBar}
      {notice ? <p className="as-note">{notice}</p> : null}
      <div className="as-grid">
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card">
            <h2>Fil de retour</h2>
            <ul className="as-todo as-todo--done">
              <li className={pickup.recorded ? "is-done" : ""}>
                Reprise client {pickup.recordedAt ? `· ${formatDayMonth(String(pickup.recordedAt).slice(0, 10))}` : ""}
              </li>
              <li className={depot.receivedAt ? "is-done" : ""}>
                Réception dépôt {depot.receivedAt ? `· ${formatDayMonth(String(depot.receivedAt).slice(0, 10))}` : ""}
              </li>
              <li className={depot.allValidated ? "is-done" : ""}>Contrôles validés</li>
              <li className={!hasPartner || Array.isArray(partnerRest.items) ? "is-done" : ""}>
                Restitution partenaire {hasPartner ? "" : "(non concernée)"}
              </li>
            </ul>
          </section>
          <section className="as-card">
            <h2>Bilan des articles</h2>
            <div className="as-sel-list">
              {selection.map((row) => {
                const d = depotItems.find((item) => item.productId === row.productId);
                const partnerOwned = row.ownerKind !== "onloutou";
                return (
                  <div className="as-sel-item" key={String(row.productId)}>
                    {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                    <div>
                      <strong>{String(row.reference || row.title)}</strong>
                      <small>{String(row.ownerName)}</small>
                      <span className={`as-badge ${d?.validated ? "as-badge--stage" : "as-badge--warn"}`}>
                        {d?.validated ? "Conforme" : "À contrôler"}
                      </span>
                      <p className="as-empty">
                        {partnerOwned
                          ? "Chez le partenaire · disponibilité à confirmer par le partenaire"
                          : "Au dépôt Marcory · disponible après validation stock"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="as-card">
            <h2>Documents de retour</h2>
            <ul className="as-todo as-todo--done">
              <li className="is-done">Bon de reprise {String(pickup.receiptId || "BR")}</li>
              <li className="is-done">Rapport de contrôle dépôt</li>
              <li className={hasPartner ? "is-done" : ""}>Bon de restitution partenaire {hasPartner ? "" : "— N/A"}</li>
              <li className="is-done">Photos / états</li>
            </ul>
          </section>
        </div>
        <aside style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card as-side">
            <h2>Bilan financier à traiter</h2>
            <p>
              Location <span className="as-badge as-badge--stage">Entièrement payé</span>
            </p>
            <p>
              Dépôt de garantie{" "}
              <span className={`as-badge ${depositSubmitted ? "as-badge--stage" : "as-badge--warn"}`}>
                {depositSubmitted ? "Décision soumise" : "Décision en attente"}
              </span>
            </p>
            <p>
              Reversement partenaire{" "}
              <span className={`as-badge ${!hasPartner || payoutSubmitted ? "as-badge--stage" : "as-badge--warn"}`}>
                {!hasPartner ? "Non concerné" : payoutSubmitted ? "Soumis" : "À préparer"}
              </span>
            </p>
            <p>
              Facture / docs{" "}
              <span className="as-badge as-badge--warn">À vérifier</span>
            </p>
          </section>
          <section className="as-card as-side">
            <h2>Avant clôture</h2>
            <ul className="as-checks-list">
              <li className="is-ok">
                <IconCheck /> Retour des articles
              </li>
              <li className={!hasPartner || Array.isArray(partnerRest.items) ? "is-ok" : ""}>
                <IconCheck /> Restitution partenaire
              </li>
              <li className={depositSubmitted ? "is-ok" : ""}>
                <IconCheck /> Décision dépôt
              </li>
              <li className={!hasPartner || payoutSubmitted ? "is-ok" : ""}>
                <IconCheck /> Reversement
              </li>
              <li className={closed ? "is-ok" : ""}>
                <IconCheck /> Clôture
              </li>
            </ul>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              style={{ width: "100%", marginTop: "0.75rem" }}
              onClick={() => onView(closed ? "close" : depositSubmitted ? (hasPartner && !payoutSubmitted ? "payout" : "close") : "deposit")}
            >
              {closed
                ? "Voir la clôture"
                : depositSubmitted
                  ? hasPartner && !payoutSubmitted
                    ? "Préparer le reversement"
                    : "Clôturer le dossier"
                  : "Traiter le dépôt de garantie"}
            </button>
          </section>
        </aside>
      </div>
      <div className="as-wiz-foot">
        {onBackToDossier ? (
          <button type="button" className="as-btn" onClick={onBackToDossier}>
            Retour au dossier
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
