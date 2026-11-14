import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth, formatFcfa, parseAmount } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type LifecycleView = "verify" | "transmit" | "follow";

type SelectionItem = {
  productId: string;
  title: string;
  reference: string | null;
  quantity: number;
  imageUrl: string | null;
  ownerName: string;
};

type Props = {
  request: OfferRequest & {
    reference?: string;
    contactName?: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    organization?: string | null;
    stage?: string;
    events?: { createdAt: string; note: string | null }[];
  };
  view: LifecycleView;
  onView: (view: LifecycleView) => void;
  onBackToDraft: () => void;
  onUpdated: (request: OfferRequest) => void;
  onOpenConfirmation?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readSelection(payload: Record<string, unknown> | null | undefined): SelectionItem[] {
  const items = Array.isArray(asRecord(payload?.selection).items) ? (asRecord(payload?.selection).items as unknown[]) : [];
  return items
    .map((raw) => {
      const row = asRecord(raw);
      if (typeof row.productId !== "string") return null;
      return {
        productId: row.productId,
        title: String(row.title ?? "Article"),
        reference: typeof row.reference === "string" ? row.reference : null,
        quantity: Number(row.quantity) || 1,
        imageUrl: typeof row.imageUrl === "string" ? row.imageUrl : null,
        ownerName: String(row.ownerName ?? "—"),
      };
    })
    .filter((row): row is SelectionItem => Boolean(row));
}

function maskEmail(email: string | null | undefined) {
  if (!email) return "E-mail à renseigner";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return `${user[0]}•••@${domain}`;
}

function paymentLabel(value: string) {
  if (value === "acompte_30") return "Acompte 30 %";
  if (value === "acompte_50") return "Acompte 50 %";
  if (value === "total") return "Total avant livraison";
  return "À définir";
}

function balanceLabel(value: string) {
  if (value === "before_delivery") return "Avant livraison";
  if (value === "on_delivery") return "À la livraison";
  if (value === "after_return") return "Après reprise";
  return "À définir";
}

export function ProposalLifecycle({ request, view, onView, onBackToDraft, onUpdated, onOpenConfirmation }: Props) {
  const payload = asRecord(request.payload);
  const proposal = asRecord(payload.proposal);
  const selection = readSelection(request.payload);
  const lines = Array.isArray(proposal.lines) ? proposal.lines.map((row) => asRecord(row)) : [];
  const clientName = request.organization || request.contactName || "Client";
  const reference = String(proposal.reference ?? "PROP —");
  const version = Number(proposal.version) || 1;
  const validUntil = typeof proposal.validUntil === "string" ? proposal.validUntil : "";
  const startDate = typeof payload.startDate === "string" ? payload.startDate : "";
  const endDate = typeof payload.endDate === "string" ? payload.endDate : "";
  const place = [payload.commune, payload.city].filter(Boolean).join(", ") || request.zone || "—";

  const lineTotals = lines.map((line) => {
    const item = selection.find((row) => row.productId === line.productId);
    const unit = parseAmount(String(line.clientPrice ?? "")) ?? 0;
    const qty = item?.quantity ?? 1;
    return { item, line, unit, qty, total: unit * qty };
  });
  const articlesTotal = lineTotals.reduce((sum, row) => sum + row.total, 0);
  const delivery = proposal.deliveryIncluded ? 0 : parseAmount(String(proposal.deliveryFee ?? "")) ?? 0;
  const pickup = proposal.pickupIncluded ? 0 : parseAmount(String(proposal.pickupFee ?? "")) ?? 0;
  const grandTotal = articlesTotal + delivery + pickup;

  const pricesOk = lines.length > 0 && lines.every((line) => String(line.clientPrice ?? "").trim());
  const conditionsOk =
    Boolean(proposal.paymentInitial) && Boolean(proposal.balanceDue) && proposal.deposit !== "todo";
  const billingOk = Boolean(proposal.billingValidated);
  const contactsOk = Boolean(request.contactEmail || request.contactPhone);
  const ready = pricesOk && conditionsOk && billingOk && contactsOk;

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"email" | "link">("email");
  const [email, setEmail] = useState(request.contactEmail ?? "");
  const [subject, setSubject] = useState(`Votre proposition de location ONLOUTOU · ${reference}`);
  const [message, setMessage] = useState(
    `Bonjour,\n\nVoici notre proposition pour la location demandée (${formatDateRange(startDate, endDate)} · ${place}).\n\nVous pouvez consulter le détail via le lien sécurisé.\n\nCette proposition ne réserve aucun article et ne confirme pas la location.\n\nCordialement,\nÉquipe ONLOUTOU`,
  );
  const [followDue, setFollowDue] = useState(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 2);
    return d.toISOString().slice(0, 10);
  });

  const activity = useMemo(() => {
    const fromProposal = Array.isArray(proposal.activity) ? proposal.activity : [];
    if (fromProposal.length) {
      return fromProposal.map((row) => {
        const item = asRecord(row);
        return {
          at: String(item.at ?? ""),
          label: String(item.label ?? "Activité"),
        };
      });
    }
    return (request.events ?? [])
      .filter((ev) => ev.note)
      .slice()
      .reverse()
      .slice(0, 8)
      .map((ev) => ({ at: ev.createdAt, label: ev.note || "" }));
  }, [proposal.activity, request.events]);

  async function goTransmit() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/proposal/ready`, {
      method: "POST",
      json: {},
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    onView("transmit");
  }

  async function transmit() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{
      ok: true;
      emailSent: boolean;
      emailNote: string;
      shareUrl: string;
      request: OfferRequest;
    }>(`/admin/requests/${request.id}/proposal/transmit`, {
      method: "POST",
      json: {
        mode,
        email: mode === "email" ? email : undefined,
        subject,
        message,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(
      res.data.emailSent
        ? res.data.emailNote
        : `${res.data.emailNote} Lien prêt : ${res.data.shareUrl}`,
    );
    onView("follow");
  }

  async function scheduleFollowUp() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/proposal/follow-up`, {
      method: "POST",
      json: { dueDate: followDue, note: "Suivre la réponse du client" },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(`Relance planifiée pour le ${formatDayMonth(followDue)}.`);
  }

  async function newVersion() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/proposal/new-version`, {
      method: "POST",
      json: {},
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    onBackToDraft();
  }

  async function copyLink() {
    const url = String(proposal.shareUrl ?? "");
    if (!url) {
      setError("Aucun lien sécurisé n’est encore disponible.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Lien sécurisé copié.");
    } catch {
      setNotice(url);
    }
  }

  async function recordAgreement() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/proposal/agreement`, {
      method: "POST",
      json: { channel: "link", note: "Accord client enregistré sur la version transmise." },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    onOpenConfirmation?.();
  }

  const preview = (
    <section className="as-card as-offer-doc">
      <div className="as-offer-doc__head">
        <strong>ONLOUTOU</strong>
        <div>
          <span>Proposition de location</span>
          <small>Destinataire : {clientName}</small>
        </div>
      </div>
      <div className="as-offer-doc__rows">
        {lineTotals.map(({ item, line, qty, unit, total }) => (
          <div className="as-offer-doc__row" key={String(line.productId)}>
            {item?.imageUrl ? <img src={item.imageUrl} alt="" /> : <i className="as-art__ph" />}
            <div>
              <strong>
                {item?.title ?? "Article"} {item?.reference ? `(Réf. ${item.reference})` : ""}
              </strong>
              <small>
                Qté {qty} · {String(line.priceUnit ?? "Par période")}
              </small>
            </div>
            <span>{formatFcfa(unit)}</span>
            <strong>{formatFcfa(total)}</strong>
          </div>
        ))}
        <div className="as-offer-doc__row as-offer-doc__row--plain">
          <span>Livraison</span>
          <strong>{proposal.deliveryIncluded ? "Inclus" : formatFcfa(proposal.deliveryFee as string)}</strong>
        </div>
        <div className="as-offer-doc__row as-offer-doc__row--plain">
          <span>Reprise</span>
          <strong>{proposal.pickupIncluded ? "Inclus" : formatFcfa(proposal.pickupFee as string)}</strong>
        </div>
      </div>
      <p className="as-total">Total location et prestations : {formatFcfa(grandTotal)}</p>
      <details className="as-offer-doc__details">
        <summary>Détail de facturation</summary>
        <p>
          <small>Dépôt de garantie</small>
          {proposal.deposit === "required" ? "Requis" : proposal.deposit === "not_required" ? "Non requis" : "À définir"}
        </p>
        <p>
          <small>Paiement initial</small>
          {paymentLabel(String(proposal.paymentInitial ?? ""))}
        </p>
        <p>
          <small>Échéance du solde</small>
          {balanceLabel(String(proposal.balanceDue ?? ""))}
        </p>
      </details>
      <p className="as-empty">
        La location sera confirmée après validation des disponibilités et du paiement requis.
      </p>
    </section>
  );

  if (view === "verify") {
    return (
      <div className="as-offer">
        <p className="as-banner as-banner--ok">
          Disponibilités à confirmer côté dossier · Aucun article réservé
        </p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Vérifier avant transmission
            </h2>
            <p className="as-lead">
              Proposition : {reference} · Version {version}
              {validUntil ? ` · Valable jusqu’au ${formatDayMonth(validUntil)}` : ""}
            </p>
          </div>
          <span className={`as-badge ${ready ? "as-badge--stage" : "as-badge--warn"}`}>
            {ready ? "Prête à transmettre" : "À compléter"}
          </span>
        </div>
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <h3 className="as-h1" style={{ fontSize: "1.05rem", margin: 0 }}>
              Aperçu de l’offre client
            </h3>
            {preview}
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Contrôles avant transmission</h2>
              <ul className="as-checks-list">
                <li className={pricesOk ? "is-ok" : ""}>
                  <IconCheck /> Tarifs renseignés <span>{pricesOk ? "Validé" : "À faire"}</span>
                </li>
                <li className={conditionsOk ? "is-ok" : ""}>
                  <IconCheck /> Conditions complétées <span>{conditionsOk ? "Validé" : "À faire"}</span>
                </li>
                <li className={billingOk ? "is-ok" : ""}>
                  <IconCheck /> Facturation validée <span>{billingOk ? "Validé" : "À faire"}</span>
                </li>
                <li className={contactsOk ? "is-ok" : ""}>
                  <IconCheck /> Coordonnées client vérifiées <span>{contactsOk ? "Validé" : "À faire"}</span>
                </li>
              </ul>
            </section>
            <section className="as-card as-side">
              <h2>Documents joints</h2>
              <div className="as-doc-chip">
                <span>Proposition {reference}.pdf</span>
                <button type="button" className="as-btn as-btn--ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  Aperçu
                </button>
              </div>
              <div className="as-doc-chip">
                <span>Conditions de location.pdf</span>
                <button type="button" className="as-btn as-btn--ghost" disabled title="Modèle standard à brancher">
                  Aperçu
                </button>
              </div>
              <p className="as-note">Les notes internes et les montants partenaires sont exclus de l’offre client.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={onBackToDraft}>
            Revenir au brouillon
          </button>
          <button type="button" className="as-btn as-btn--yellow" disabled={!ready || pending} onClick={() => void goTransmit()}>
            {pending ? "Préparation…" : "Choisir le mode de transmission →"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "transmit") {
    return (
      <div className="as-offer">
        <p className="as-banner as-banner--ok">Tous les champs de la proposition sont complétés et validés.</p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Transmettre l’offre au client
            </h2>
            <p className="as-lead">
              {reference} · Version {version} · Aucun article ne sera réservé par cet envoi.
            </p>
          </div>
        </div>
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Mode de transmission</h2>
              <div className="as-mode">
                <button type="button" className={`as-mode__btn${mode === "email" ? " is-on" : ""}`} onClick={() => setMode("email")}>
                  <strong>E-mail</strong>
                  <span>Envoyer la proposition par e-mail au client.</span>
                </button>
                <button type="button" className={`as-mode__btn${mode === "link" ? " is-on" : ""}`} onClick={() => setMode("link")}>
                  <strong>Partager un lien</strong>
                  <span>Obtenir un lien sécurisé à partager (WhatsApp, etc.).</span>
                </button>
              </div>
              {mode === "email" ? (
                <label>
                  Destinataire
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@exemple.ci" />
                </label>
              ) : (
                <p className="as-note">Le lien sera généré à la validation. Aucun e-mail ne sera envoyé automatiquement.</p>
              )}
              <label>
                Objet
                <input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </label>
              <label>
                Message
                <textarea className="as-field" rows={7} value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
              <div className="as-doc-chip">
                <span>Proposition {reference}.pdf</span>
              </div>
              <div className="as-doc-chip">
                <span>Conditions de location.pdf</span>
              </div>
              <p className="as-note">Aucun montant partenaire ni note interne dans ce message.</p>
            </section>
          </div>
          <aside className="as-card as-side">
            <h2>Proposition à transmettre</h2>
            <p>
              <small>Référence</small>
              {reference} · Version {version}
            </p>
            <p>
              <small>Client</small>
              {clientName}
            </p>
            <p>
              <small>Articles</small>
              {selection.map((row) => row.title).join(" · ") || "—"}
            </p>
            <p>
              <small>Période</small>
              {formatDateRange(startDate, endDate)}
            </p>
            <p>
              <small>Lieu</small>
              {place}
            </p>
            <p className="as-total">Total de la proposition : {formatFcfa(grandTotal)}</p>
            <p>
              <small>Valable jusqu’au</small>
              {validUntil ? formatDayMonth(validUntil) : "—"}
            </p>
            <p className="as-empty">Après transmission : en attente de réponse. Aucun article ne sera réservé.</p>
            <div className="as-head__actions" style={{ flexDirection: "column", marginTop: "0.85rem" }}>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                disabled={pending || (mode === "email" && !email.trim())}
                onClick={() => void transmit()}
              >
                {pending ? "Transmission…" : mode === "email" ? "Envoyer la proposition par e-mail" : "Préparer le lien sécurisé"}
              </button>
              <button type="button" className="as-btn" onClick={() => onView("verify")}>
                Retour à l’aperçu
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const shareUrl = String(proposal.shareUrl ?? "");
  const sentAt = typeof proposal.sentAt === "string" ? proposal.sentAt : "";
  const emailSent = Boolean(proposal.emailSent);

  return (
    <div className="as-offer">
      {emailSent && sentAt ? (
        <p className="as-banner as-banner--ok">
          E-mail envoyé au destinataire renseigné · {formatDayMonth(sentAt.slice(0, 10))}
          {sentAt.length > 10 ? ` à ${sentAt.slice(11, 16)}` : ""}
        </p>
      ) : (
        <p className="as-banner as-banner--ok">
          {proposal.sentChannel === "link"
            ? "Lien sécurisé prêt à partager · Aucun e-mail automatique"
            : String(notice ?? "Transmission enregistrée · Vérifiez si un e-mail a bien été envoyé")}
        </p>
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
            <div className="as-card__head">
              <h2>Proposition transmise au client</h2>
              <span className="as-badge as-badge--warn">En attente de réponse</span>
            </div>
            <p className="as-lead">
              Référence : {reference} · Version {version}
              {validUntil ? ` · Valide jusqu’au ${formatDayMonth(validUntil)}` : ""}
            </p>
            <div className="as-status-grid">
              <div>
                <IconCheck />
                <strong>Proposition</strong>
                <span>Envoyée</span>
              </div>
              <div>
                <strong>Réponse client</strong>
                <span className="as-badge as-badge--warn">En attente</span>
              </div>
              <div>
                <strong>Location</strong>
                <span>Non confirmée</span>
              </div>
            </div>
          </section>
          <section className="as-card">
            <h2>Proposition active</h2>
            <div className="as-sel-list">
              {selection.map((row) => (
                <div className="as-sel-item" key={row.productId}>
                  {row.imageUrl ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{row.title}</strong>
                    <small>
                      Qté {row.quantity} · {row.reference || "sans réf."}
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
                <small>Lieu</small>
                {place}
              </p>
              <p>
                <small>Total</small>
                {formatFcfa(grandTotal)}
              </p>
            </div>
            <button type="button" className="as-btn as-btn--yellow" style={{ marginTop: "0.85rem" }} onClick={() => onView("verify")}>
              Voir la proposition
            </button>
          </section>
          <section className="as-card">
            <h2>Activité de la proposition</h2>
            {activity.length === 0 ? (
              <p className="as-empty">Aucune activité pour l’instant.</p>
            ) : (
              <ul className="as-activity">
                {activity.map((row) => (
                  <li key={`${row.at}-${row.label}`}>
                    <strong>{row.at ? formatDayMonth(row.at.slice(0, 10)) : "—"}</strong>
                    <span>{row.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <aside style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card as-side">
            <h2>Prochaine action</h2>
            <p>
              <strong>Suivre la réponse du client</strong>
            </p>
            <label>
              Échéance de relance
              <input type="date" value={followDue} onChange={(e) => setFollowDue(e.target.value)} />
            </label>
            <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void scheduleFollowUp()}>
              Planifier une relance
            </button>
          </section>
          <section className="as-card as-side">
            <h2>Actions secondaires</h2>
            <div className="as-head__actions" style={{ flexDirection: "column" }}>
              <button type="button" className="as-btn" onClick={() => void copyLink()} disabled={!shareUrl}>
                Copier le lien sécurisé
              </button>
              <button type="button" className="as-btn" disabled={pending} onClick={() => void newVersion()}>
                Créer une nouvelle version
              </button>
            </div>
            {shareUrl ? <p className="as-empty">{shareUrl}</p> : null}
            {request.contactEmail ? <p className="as-empty">Destinataire : {maskEmail(request.contactEmail)}</p> : null}
          </section>
          <section className="as-card as-side">
            <h2>Conditions de confirmation</h2>
            <ul className="as-todo as-todo--done">
              <li className="is-done">Disponibilité contrôlée (dossier)</li>
              <li>Acceptation de cette version</li>
              <li>Paiement initial vérifié ou dérogation approuvée</li>
            </ul>
            <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void recordAgreement()}>
              {pending ? "Enregistrement…" : "Enregistrer l’accord client"}
            </button>
            <button type="button" className="as-btn" disabled style={{ marginTop: "0.45rem" }}>
              Confirmer la location
            </button>
            <p className="as-note">L’envoi ou l’acceptation de la proposition ne suffit pas à confirmer la location.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
