import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth, formatFcfa, parseAmount } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type ConfirmView = "agreement" | "payment" | "confirm" | "confirmed";

type Props = {
  request: OfferRequest;
  view: ConfirmView;
  onView: (view: ConfirmView) => void;
  onUpdated: (request: OfferRequest) => void;
  onOrganizeDelivery?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function paymentLabel(value: string) {
  if (value === "acompte_30") return "Acompte 30 %";
  if (value === "acompte_50") return "Acompte 50 %";
  if (value === "total") return "Total avant livraison";
  return "À définir";
}

function channelLabel(value: string) {
  if (value === "link") return "Lien sécurisé";
  if (value === "email") return "E-mail";
  if (value === "phone") return "Téléphone";
  if (value === "bank_transfer") return "Virement bancaire";
  if (value === "mobile_money") return "Mobile money";
  if (value === "cash") return "Espèces";
  if (value === "card") return "Carte";
  return "Autre";
}

export function ConfirmationFlow({ request, view, onView, onUpdated, onOrganizeDelivery }: Props) {
  const payload = asRecord(request.payload);
  const proposal = asRecord(payload.proposal);
  const rental = asRecord(payload.rental);
  const payment = asRecord(asRecord(payload.payment).initial);
  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : [];
  const lines = Array.isArray(proposal.lines) ? proposal.lines.map((row) => asRecord(row)) : [];
  const clientName = request.organization || request.contactName || "Client";
  const reference = String(proposal.reference ?? "PROP —");
  const version = Number(proposal.version) || 1;
  const startDate = typeof payload.startDate === "string" ? payload.startDate : "";
  const endDate = typeof payload.endDate === "string" ? payload.endDate : "";
  const place = [payload.commune, payload.city].filter(Boolean).join(", ") || request.zone || "—";
  const delivery = Boolean(payload.delivery);
  const pickup = Boolean(payload.pickup);

  const articlesTotal = lines.reduce((sum, line) => {
    const qty = Number(selection.find((row) => row.productId === line.productId)?.quantity) || 1;
    return sum + (parseAmount(String(line.clientPrice ?? "")) ?? 0) * qty;
  }, 0);
  const deliveryFee = proposal.deliveryIncluded ? 0 : parseAmount(String(proposal.deliveryFee ?? "")) ?? 0;
  const pickupFee = proposal.pickupIncluded ? 0 : parseAmount(String(proposal.pickupFee ?? "")) ?? 0;
  const grandTotal = articlesTotal + deliveryFee + pickupFee;
  const paymentInitial = String(proposal.paymentInitial ?? "");
  const initialDue =
    paymentInitial === "acompte_30"
      ? Math.round(grandTotal * 0.3)
      : paymentInitial === "acompte_50"
        ? Math.round(grandTotal * 0.5)
        : paymentInitial === "total"
          ? grandTotal
          : 0;
  const balanceDue = Math.max(0, grandTotal - (payment.verified ? Number(payment.amount) || initialDue : initialDue));
  const depositRequired = proposal.deposit === "required";

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [payAmount, setPayAmount] = useState(String(initialDue || ""));
  const [payChannel, setPayChannel] = useState("bank_transfer");
  const [bankRef, setBankRef] = useState("");
  const [docLabel, setDocLabel] = useState("justificatif.pdf");
  const [internalNote, setInternalNote] = useState(
    "Accord reçu. Prochaine étape : vérifier le paiement initial et recontrôler les disponibilités.",
  );
  const [confirmNote, setConfirmNote] = useState(
    `Responsable ${request.contactName || "équipe"}, livraison ${place}, livraison et reprise à organiser.`,
  );

  const activity = useMemo(() => {
    const fromProposal = Array.isArray(proposal.activity) ? proposal.activity : [];
    return fromProposal.map((row) => {
      const item = asRecord(row);
      return { at: String(item.at ?? ""), label: String(item.label ?? "Activité") };
    });
  }, [proposal.activity]);

  async function verifyPayment() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/payment/verify`, {
      method: "POST",
      json: {
        amount: payAmount,
        channel: payChannel,
        bankReference: bankRef || undefined,
        documentLabel: docLabel || undefined,
        note: "Paiement initial contrôlé et affecté au dossier.",
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice("Paiement initial vérifié et affecté. La location n’est pas encore confirmée.");
    onView("confirm");
  }

  async function confirmRental() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/rental/confirm`, {
      method: "POST",
      json: { note: confirmNote, recheckAvailability: true },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    onView("confirmed");
  }

  if (view === "payment") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Contrôler le paiement initial
            </h2>
            <p className="as-lead">Vérifiez la réception des fonds avant de les affecter au dossier.</p>
          </div>
          <span className="as-badge as-badge--warn">Justificatif reçu · À vérifier</span>
        </div>
        <p className="as-banner as-banner--warn">Un justificatif ne prouve pas à lui seul que les fonds ont été reçus.</p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Justificatif client</h2>
              <div className="as-doc-chip">
                <span>{docLabel || "justificatif.pdf"}</span>
                <button type="button" className="as-btn as-btn--ghost" disabled title="Aperçu document à brancher">
                  Voir le document
                </button>
              </div>
              <div className="as-need" style={{ marginTop: "0.75rem" }}>
                <p>
                  <small>Montant déclaré</small>
                  {formatFcfa(payAmount || initialDue)}
                </p>
                <p>
                  <small>Canal</small>
                  {channelLabel(payChannel)}
                </p>
                <p>
                  <small>Affectation</small>
                  Paiement initial de location
                </p>
              </div>
              <label style={{ marginTop: "0.75rem" }}>
                Libellé du justificatif
                <input value={docLabel} onChange={(e) => setDocLabel(e.target.value)} />
              </label>
            </section>
            <section className="as-card">
              <h2>Rapprochement de la transaction</h2>
              <div className="as-form-grid">
                <label>
                  Montant reçu
                  <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="FCFA" />
                </label>
                <label>
                  Canal
                  <select value={payChannel} onChange={(e) => setPayChannel(e.target.value)}>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="mobile_money">Mobile money</option>
                    <option value="cash">Espèces</option>
                    <option value="card">Carte</option>
                    <option value="other">Autre</option>
                  </select>
                </label>
                <label>
                  Référence bancaire
                  <input value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="TX-…" />
                </label>
              </div>
              <ul className="as-todo as-todo--done" style={{ marginTop: "0.85rem" }}>
                <li className="is-done">Transaction trouvée sur le compte</li>
                <li className={parseAmount(payAmount) ? "is-done" : ""}>Montant cohérent avec l’échéance</li>
                <li className="is-done">Aucune affectation précédente détectée</li>
              </ul>
            </section>
            <section className="as-card">
              <h2>Affectation prévue</h2>
              <div className="as-need">
                <p>
                  <small>Dossier</small>
                  {request.reference}
                </p>
                <p>
                  <small>Nature</small>
                  Paiement initial
                </p>
                <p>
                  <small>Montant</small>
                  {formatFcfa(payAmount || initialDue)}
                </p>
              </div>
              <p className="as-note">Le dépôt de garantie reste suivi séparément.</p>
            </section>
          </div>
          <aside className="as-card as-side">
            <h2>Contexte du dossier</h2>
            <p>
              <small>Client</small>
              {clientName}
            </p>
            <p>
              <small>Proposition</small>
              {reference} V{version}{" "}
              <span className="as-badge as-badge--stage">Accord reçu</span>
            </p>
            <p>
              <small>Location</small>
              <span className="as-badge as-badge--warn">Location non confirmée</span>
            </p>
            <p>
              <small>Période</small>
              {formatDateRange(startDate, endDate)}
            </p>
            <p>
              <small>Attendu</small>
              {formatFcfa(initialDue)} · {paymentLabel(paymentInitial)}
            </p>
            <p className="as-empty" style={{ marginTop: "0.75rem" }}>
              Solde restant estimé : {formatFcfa(balanceDue)}
              <br />
              Dépôt : {depositRequired ? "Requis · Non reçu" : "Non requis"}
            </p>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("agreement")}>
            Retour à l’accord
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled title="Signalement d’écart à brancher">
              Signaler un écart
            </button>
            <button type="button" className="as-btn as-btn--yellow" disabled={pending || !payAmount.trim()} onClick={() => void verifyPayment()}>
              {pending ? "Validation…" : "Valider et affecter le paiement"}
            </button>
          </div>
        </div>
        <p className="as-note">Cette action vérifie le paiement ; elle ne confirme pas encore la location.</p>
      </div>
    );
  }

  if (view === "confirm") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Confirmer la location
            </h2>
            <p className="as-lead">Vérifiez les conditions avant de réserver les articles.</p>
          </div>
          <span className="as-badge as-badge--stage">Prête à confirmer</span>
        </div>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-status-grid">
          <div>
            <IconCheck />
            <strong>Proposition V{version} acceptée</strong>
            <span>{rental.agreementAt ? formatDayMonth(String(rental.agreementAt).slice(0, 10)) : "—"}</span>
          </div>
          <div>
            <IconCheck />
            <strong>Paiement initial vérifié</strong>
            <span>{payment.verifiedAt ? formatDayMonth(String(payment.verifiedAt).slice(0, 10)) : "—"}</span>
          </div>
          <div>
            <IconCheck />
            <strong>Disponibilités à recontrôler</strong>
            <span>Contrôle au moment de la confirmation</span>
          </div>
        </div>
        <div className="as-grid" style={{ marginTop: "0.85rem" }}>
          <section className="as-card">
            <h2>Articles à réserver</h2>
            <div className="as-sel-list">
              {selection.map((row) => (
                <div className="as-sel-item" key={String(row.productId)}>
                  {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{String(row.title ?? "Article")}</strong>
                    <small>
                      {String(row.ownerName ?? "—")} · Réf. {String(row.reference ?? "—")} · Qté {Number(row.quantity) || 1}
                    </small>
                    <span className="as-badge as-badge--stage">Disponible à recontrôler</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="as-note">Le stock sera contrôlé à nouveau au moment de la confirmation.</p>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Conditions avant remise</h2>
              <p>
                <small>Solde de location</small>
                {formatFcfa(balanceDue)} · À recevoir
              </p>
              <p>
                <small>Dépôt de garantie</small>
                {depositRequired ? "Requis · À recevoir" : "Non requis"}
              </p>
              <p className="as-banner as-banner--warn">La confirmation n’autorise pas encore la remise des articles.</p>
            </section>
            <section className="as-card as-side">
              <h2>Ce que cette action déclenche</h2>
              <ul className="as-todo as-todo--done">
                <li className="is-done">Réserver les articles sur la période</li>
                <li className="is-done">Passer le dossier en location confirmée</li>
                <li className="is-done">Créer les tâches de préparation logistique</li>
              </ul>
              <p className="as-note">Aucun remboursement ni reversement partenaire n’est déclenché.</p>
              <label>
                Note interne
                <textarea className="as-field" rows={4} value={confirmNote} onChange={(e) => setConfirmNote(e.target.value)} />
              </label>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("payment")}>
            Retour au paiement
          </button>
          <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void confirmRental()}>
            {pending ? "Confirmation…" : "Confirmer et réserver les articles"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "confirmed") {
    const items = Array.isArray(rental.items) ? rental.items.map((row) => asRecord(row)) : selection;
    const tasks = Array.isArray(rental.tasks) ? rental.tasks.map((row) => asRecord(row)) : [];
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Location confirmée
            </h2>
            <p className="as-lead">
              {request.reference} · {clientName} · {place}
            </p>
          </div>
          <div className="as-head__actions">
            <button type="button" className="as-btn" onClick={() => onOrganizeDelivery?.()}>
              Voir la livraison
            </button>
            <button type="button" className="as-btn as-btn--yellow" onClick={() => onOrganizeDelivery?.()}>
              Organiser la livraison
            </button>
          </div>
        </div>
        <p className="as-banner as-banner--ok">
          {items.length} article{items.length > 1 ? "s" : ""} réservé{items.length > 1 ? "s" : ""} du {formatDayMonth(startDate)} au{" "}
          {formatDayMonth(endDate)}.
        </p>
        <div className="as-status-grid">
          <div>
            <strong>Réservation</strong>
            <span className="as-badge as-badge--stage">Confirmée</span>
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          <div>
            <strong>Paiement initial</strong>
            <span className="as-badge as-badge--stage">Vérifié</span>
            <span>Acompte de location reçu et validé</span>
          </div>
          <div>
            <strong>Remise des articles</strong>
            <span className="as-badge as-badge--warn">À préparer</span>
            <span>Conditions à finaliser avant remise</span>
          </div>
        </div>
        <div className="as-grid" style={{ marginTop: "0.85rem" }}>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Articles réservés</h2>
              <div className="as-sel-list">
                {items.map((row) => (
                  <div className="as-sel-item" key={String(row.productId)}>
                    {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                    <div>
                      <strong>{String(row.title ?? "Article")}</strong>
                      <small>
                        Propriétaire : {String(row.ownerName ?? "—")} · Réf. {String(row.reference ?? "—")} · Qté {Number(row.quantity) || 1}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="as-need" style={{ marginTop: "0.75rem" }}>
                <p>
                  <small>Période</small>
                  {formatDateRange(startDate, endDate)}
                </p>
                <p>
                  <small>Services</small>
                  {delivery || pickup ? [delivery ? "Livraison" : null, pickup ? "Reprise" : null].filter(Boolean).join(" et ") : "—"}
                </p>
                <p>
                  <small>Destination</small>
                  {place}
                </p>
              </div>
            </section>
            <section className="as-card">
              <h2>Prochaines actions</h2>
              <ul className="as-todo">
                {(tasks.length ? tasks : [{ label: "Organiser la livraison" }, { label: "Préparer les articles" }]).map((task) => (
                  <li key={String(task.id ?? task.label)}>{String(task.label)}</li>
                ))}
              </ul>
              <button type="button" className="as-btn as-btn--yellow" style={{ marginTop: "0.75rem" }} disabled title="Message client à brancher">
                Préparer le message
              </button>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Avant la remise</h2>
              <ul className="as-todo">
                <li>Solde de location à recevoir · {formatFcfa(balanceDue)}</li>
                <li>Dépôt de garantie {depositRequired ? "à recevoir" : "non requis"}</li>
                <li>Livraison à planifier</li>
                <li>État de départ à établir</li>
              </ul>
              <p className="as-banner as-banner--warn">Remise non autorisée tant que les conditions requises ne sont pas remplies.</p>
            </section>
            <section className="as-card as-side">
              <h2>Activité du dossier</h2>
              {activity.length === 0 ? (
                <p className="as-empty">Aucune activité.</p>
              ) : (
                <ul className="as-activity">
                  {activity.slice(0, 8).map((row) => (
                    <li key={`${row.at}-${row.label}`}>
                      <strong>{row.at ? formatDayMonth(row.at.slice(0, 10)) : "—"}</strong>
                      <span>{row.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    );
  }

  // agreement (G07A)
  return (
    <div className="as-offer">
      <div className="as-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
            Accord client reçu
          </h2>
          <p className="as-lead">
            {request.reference} · {clientName}
          </p>
        </div>
        <span className="as-badge as-badge--warn">Location non confirmée</span>
      </div>
      <p className="as-banner as-banner--ok">
        Accord reçu sur la version {version}. Le paiement et les disponibilités restent à vérifier.
      </p>
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="as-grid">
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card">
            <h2>Preuve de l’accord</h2>
            <div className="as-need">
              <p>
                <small>Canal</small>
                {channelLabel(String(rental.agreementChannel ?? proposal.acceptedChannel ?? "link"))}
              </p>
              <p>
                <small>Date</small>
                {rental.agreementAt ? formatDayMonth(String(rental.agreementAt).slice(0, 10)) : "—"}
              </p>
              <p>
                <small>Signataire</small>
                Contact autorisé — {clientName}
              </p>
              <p>
                <small>Version</small>
                {reference} · V{version}
              </p>
            </div>
            <div className="as-doc-chip">
              <span>Proposition-V{version}.pdf</span>
              <button type="button" className="as-btn as-btn--ghost" onClick={() => onView("agreement")}>
                Voir
              </button>
            </div>
          </section>
          <section className="as-card">
            <h2>Historique de la proposition</h2>
            <ul className="as-activity">
              {activity.slice(0, 6).map((row) => (
                <li key={`${row.at}-${row.label}`}>
                  <strong>{row.at ? formatDayMonth(row.at.slice(0, 10)) : "—"}</strong>
                  <span>{row.label}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="as-card">
            <h2>Note interne</h2>
            <textarea className="as-field" rows={4} value={internalNote} onChange={(e) => setInternalNote(e.target.value)} />
          </section>
        </div>
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card">
            <h2>Conditions acceptées</h2>
            <div className="as-sel-list">
              {selection.map((row) => (
                <div className="as-sel-item" key={String(row.productId)}>
                  {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{String(row.title ?? "Article")}</strong>
                    <small>
                      {String(row.ownerName ?? "—")} · {String(row.reference ?? "—")} · Qté {Number(row.quantity) || 1}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="as-need" style={{ marginTop: "0.75rem" }}>
              <p>
                <small>Total location</small>
                {formatFcfa(grandTotal)}
              </p>
              <p>
                <small>Dépôt de garantie</small>
                {depositRequired ? "Requis" : "Non requis"}
              </p>
              <p>
                <small>Paiement initial requis</small>
                {formatFcfa(initialDue)} · {paymentLabel(paymentInitial)}
              </p>
              <p>
                <small>Solde à régler</small>
                {formatFcfa(balanceDue)}
              </p>
            </div>
            <p className="as-note">Aucune réservation de stock pour le moment. L’accord client seul ne réserve aucun article.</p>
          </section>
          <aside className="as-card as-side">
            <h2>Avant de confirmer</h2>
            <ul className="as-checks-list">
              <li className="is-ok">
                <IconCheck /> Accord sur la proposition <span>Validé</span>
              </li>
              <li>
                <IconCheck /> Paiement initial non vérifié <span>À faire</span>
              </li>
              <li>
                <IconCheck /> Disponibilités à recontrôler <span>À faire</span>
              </li>
            </ul>
            <div className="as-head__actions" style={{ flexDirection: "column", marginTop: "0.85rem" }}>
              <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("payment")}>
                Vérifier le paiement initial →
              </button>
              <button type="button" className="as-btn" disabled title="Aperçu proposition">
                Consulter la proposition
              </button>
              <button type="button" className="as-btn" disabled>
                Confirmer la location
              </button>
            </div>
            <p className="as-note">L’accord client seul ne réserve aucun article.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
