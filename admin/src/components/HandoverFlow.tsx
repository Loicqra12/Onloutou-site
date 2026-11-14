import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth, formatFcfa } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type HandoverView = "arrival" | "proof" | "active" | "refusal";

type ArrivalItem = {
  productId: string;
  presentedQty: number;
  acceptedQty: number;
  status: "accepted" | "refused" | "reserve";
  observation: string;
};

type Props = {
  request: OfferRequest;
  view: HandoverView;
  onView: (view: HandoverView | "depart" | "plan" | "return_plan") => void;
  onUpdated: (request: OfferRequest) => void;
  onBackToDossier?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function HandoverFlow({ request, view, onView, onUpdated, onBackToDossier }: Props) {
  const payload = asRecord(request.payload);
  const rental = asRecord(payload.rental);
  const logistics = asRecord(payload.logistics);
  const plan = asRecord(logistics.plan);
  const handover = asRecord(logistics.handover);
  const arrivalSaved = asRecord(handover.arrival);
  const proofSaved = asRecord(handover.proof);
  const refusals = Array.isArray(handover.refusals) ? handover.refusals.map((row) => asRecord(row)) : [];
  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : Array.isArray(rental.items)
      ? (rental.items as unknown[]).map((row) => asRecord(row))
      : [];

  const clientName = request.organization || request.contactName || "Client";
  const startDate = typeof payload.startDate === "string" ? payload.startDate : String(rental.periodStart ?? "");
  const endDate = typeof payload.endDate === "string" ? payload.endDate : String(rental.periodEnd ?? "");
  const place = [payload.commune, payload.city].filter(Boolean).join(", ") || request.zone || "—";
  const deliveryStep = Array.isArray(plan.steps)
    ? asRecord((plan.steps as unknown[]).find((row) => asRecord(row).kind === "client_delivery"))
    : {};
  const includeDepot = Boolean(plan.includeDepot);
  const missionId = `LIV-${String(request.reference).slice(-3)}`;
  const handedOver = Boolean(proofSaved.handedOver) || rental.status === "active";

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const defaultItems: ArrivalItem[] = useMemo(() => {
    const saved = Array.isArray(arrivalSaved.items) ? arrivalSaved.items.map((row) => asRecord(row)) : [];
    return selection.map((row) => {
      const existing = saved.find((item) => item.productId === row.productId);
      const qty = Number(row.quantity ?? 1) || 1;
      return {
        productId: String(row.productId),
        presentedQty: Number(existing?.presentedQty ?? qty),
        acceptedQty: Number(existing?.acceptedQty ?? qty),
        status: (existing?.status as ArrivalItem["status"]) || "accepted",
        observation: String(existing?.observation ?? ""),
      };
    });
  }, [selection, arrivalSaved.items]);

  const [arrivedTime, setArrivedTime] = useState(String(arrivalSaved.arrivedTime ?? "11:35"));
  const [items, setItems] = useState<ArrivalItem[]>(defaultItems);
  const [identityChecked, setIdentityChecked] = useState(Boolean(asRecord(arrivalSaved.checks).identity));
  const [quantitiesChecked, setQuantitiesChecked] = useState(Boolean(asRecord(arrivalSaved.checks).quantities));
  const [accessoriesChecked, setAccessoriesChecked] = useState(Boolean(asRecord(arrivalSaved.checks).accessories));
  const [stateCompared, setStateCompared] = useState(Boolean(asRecord(arrivalSaved.checks).stateCompared));
  const [instructionsGiven, setInstructionsGiven] = useState(Boolean(asRecord(arrivalSaved.checks).instructions));
  const [functioning, setFunctioning] = useState<"not_tested" | "ok" | "fail">(
    (arrivalSaved.functioning as "not_tested" | "ok" | "fail") || "not_tested",
  );
  const [arrivalNote, setArrivalNote] = useState(
    String(arrivalSaved.note ?? "Mise en service selon les consignes du fabricant."),
  );
  const [recipientName, setRecipientName] = useState(
    String(arrivalSaved.recipientName || proofSaved.recipientName || `Contact habilité — ${clientName}`),
  );
  const [recipientRole, setRecipientRole] = useState(
    String(arrivalSaved.recipientRole || proofSaved.recipientRole || "Représentant du client"),
  );
  const [recipientContact, setRecipientContact] = useState(String(arrivalSaved.recipientContact || request.contactPhone || ""));

  const [confirmMode, setConfirmMode] = useState<"device" | "link">(proofSaved.confirmMode === "link" ? "link" : "device");
  const [recipientConfirmed, setRecipientConfirmed] = useState(Boolean(proofSaved.recipientConfirmed));
  const [recipientSigned, setRecipientSigned] = useState(Boolean(proofSaved.recipientSigned));

  const partnerCandidates = selection.filter((row) => row.ownerKind !== "onloutou");
  const [refusalProductId, setRefusalProductId] = useState(
    String(refusals[0]?.productId || partnerCandidates[0]?.productId || selection[0]?.productId || ""),
  );
  const refusalSaved = refusals.find((row) => row.productId === refusalProductId) ?? {};
  const [refusalType, setRefusalType] = useState<"damage" | "missing" | "refusal" | "other">(
    (refusalSaved.type as "damage" | "missing" | "refusal" | "other") || "damage",
  );
  const [refusalDescription, setRefusalDescription] = useState(
    String(refusalSaved.description || "Porte endommagée constatée à l’arrivée. Article refusé par le client."),
  );
  const [responsibility, setResponsibility] = useState<"to_determine" | "transport" | "partner" | "client" | "onloutou">(
    (refusalSaved.responsibility as "to_determine" | "transport" | "partner" | "client" | "onloutou") || "to_determine",
  );
  const [nextDecision, setNextDecision] = useState<"replace" | "redeliver" | "adjust_proposal">(
    (refusalSaved.nextDecision as "replace" | "redeliver" | "adjust_proposal") || "replace",
  );

  const acceptedCount = items.filter((row) => row.status === "accepted" && row.acceptedQty > 0).length;
  const refusedCount = items.filter((row) => row.status === "refused" || row.status === "reserve").length;
  const checksReady = identityChecked && quantitiesChecked && accessoriesChecked && stateCompared && instructionsGiven;
  const proofReady = recipientConfirmed && recipientSigned && acceptedCount > 0;

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
        <small>Destination</small>
        {place}
      </p>
      <p>
        <small>Période contractuelle</small>
        {formatDateRange(startDate, endDate)}
      </p>
      <p>
        <small>Date opérationnelle</small>
        {formatDayMonth(startDate)}
      </p>
      <p>
        <small>Articles</small>
        {selection.length} article{selection.length > 1 ? "s" : ""}
      </p>
    </div>
  );

  function patchItem(productId: string, patch: Partial<ArrivalItem>) {
    setItems((rows) => rows.map((row) => (row.productId === productId ? { ...row, ...patch } : row)));
  }

  async function saveArrival(readyForProof: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/arrival`, {
      method: "PATCH",
      json: {
        arrivedTime,
        recipientName,
        recipientRole,
        recipientContact,
        identityChecked,
        quantitiesChecked,
        accessoriesChecked,
        stateCompared,
        instructionsGiven,
        functioning,
        note: arrivalNote,
        items,
        readyForProof,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(readyForProof ? "Contrôle prêt. Passez à la preuve de réception." : "Contrôle à l’arrivée enregistré.");
    if (readyForProof) onView("proof");
  }

  async function saveProof(opts: { draft?: boolean; recordHandover?: boolean }) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/handover`, {
      method: "PATCH",
      json: {
        confirmMode,
        recipientName,
        recipientRole,
        recipientConfirmed,
        recipientSigned,
        draft: Boolean(opts.draft),
        recordHandover: Boolean(opts.recordHandover),
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    if (opts.recordHandover) {
      setNotice("Remise enregistrée. Aucun reversement ni restitution du dépôt n’est déclenché ici.");
      onView("active");
    } else {
      setNotice("Brouillon de preuve enregistré.");
    }
  }

  async function saveRefusal(preparePartialProof: boolean) {
    if (!refusalProductId) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/refusal`, {
      method: "PATCH",
      json: {
        productId: refusalProductId,
        type: refusalType,
        description: refusalDescription,
        responsibility,
        nextDecision,
        assigneeLabel: "Responsable dossier",
        preparePartialProof,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setItems((rows) =>
      rows.map((row) =>
        row.productId === refusalProductId
          ? { ...row, status: "refused", acceptedQty: 0, observation: refusalDescription }
          : row,
      ),
    );
    setNotice(
      preparePartialProof
        ? "Signalement enregistré. Préparez la preuve de remise partielle."
        : "Signalement enregistré. Article bloqué pour contrôle — aucun remboursement automatique.",
    );
    if (preparePartialProof) onView("proof");
  }

  const routeLine = (
    <p className="as-empty" style={{ marginBottom: "0.75rem" }}>
      {includeDepot ? "Dépôt ONLOUTOU · Marcory" : "Point de départ"} → {clientName} · {place}
      <br />
      Adresse : {String(deliveryStep.address || place)} · Plage prévue : {String(deliveryStep.slotStart || "—")}–
      {String(deliveryStep.slotEnd || "—")} · Arrivée effective : {arrivedTime}
    </p>
  );

  if (view === "active") {
    const arrivalItems = Array.isArray(arrivalSaved.items) ? arrivalSaved.items.map((row) => asRecord(row)) : [];
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Location en cours
            </h2>
            <p className="as-lead">Consultez les preuves de remise et préparez la reprise.</p>
          </div>
          <span className="as-badge as-badge--stage">Remise enregistrée</span>
        </div>
        {contextBar}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <section className="as-card">
            <h2>Preuves de remise</h2>
            <p>
              <small>Bon de livraison</small>
              {String(proofSaved.deliveryNoteId || `BL-${String(request.reference).slice(-3)}`)}
            </p>
            <p>
              <small>Remise</small>
              {proofSaved.handedOverAt ? formatDayMonth(String(proofSaved.handedOverAt).slice(0, 10)) : formatDayMonth(startDate)} ·{" "}
              {arrivedTime}
            </p>
            <p>
              <small>Destinataire</small>
              {String(proofSaved.recipientName || recipientName)} · {String(proofSaved.recipientRole || recipientRole)}
            </p>
            <ul className="as-todo as-todo--done" style={{ marginTop: "0.75rem" }}>
              {arrivalItems
                .filter((row) => row.status === "accepted")
                .map((row) => (
                  <li className="is-done" key={String(row.productId)}>
                    {String(row.reference || row.title)} accepté ({Number(row.acceptedQty || 0)})
                  </li>
                ))}
              {arrivalItems
                .filter((row) => row.status === "refused" || row.status === "reserve")
                .map((row) => (
                  <li key={String(row.productId)}>
                    {String(row.reference || row.title)} non remis — suivi réserve/refus
                  </li>
                ))}
            </ul>
            <p className="as-banner as-banner--warn" style={{ marginTop: "0.85rem" }}>
              Aucun reversement partenaire ni restitution de dépôt n’a été déclenché par cette remise.
            </p>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Reprise à préparer</h2>
              <p>
                <small>Date prévue</small>
                {formatDayMonth(String(plan.returnDate || endDate))}
              </p>
              <p>
                <small>Créneau</small>
                {String(plan.returnSlot || "À convenir")}
              </p>
              <p className="as-empty">La mission de reprise reste à planifier séparément.</p>
              <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("return_plan")}>
                Organiser la reprise
              </button>
            </section>
            <section className="as-card as-side">
              <h2>Finances</h2>
              <p className="as-empty">
                Paiement initial suivi · {formatFcfa(asRecord(asRecord(payload.payment).initial).amount as string)}. Soldes et dépôt :
                onglet Finances.
              </p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("proof")}>
            ← Preuve de réception
          </button>
          {onBackToDossier ? (
            <button type="button" className="as-btn as-btn--yellow" onClick={onBackToDossier}>
              Retour au dossier
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "refusal") {
    const activeRefusal = selection.find((row) => row.productId === refusalProductId) ?? selection[0];
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Réserve ou refus à la livraison
            </h2>
            <p className="as-lead">
              Mission {missionId} · {formatDayMonth(startDate)} · {String(deliveryStep.slotStart || "—")}–
              {String(deliveryStep.slotEnd || "—")}
            </p>
          </div>
          <span className="as-badge as-badge--warn">Remise partielle à enregistrer</span>
        </div>
        {contextBar}
        {routeLine}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <p className="as-banner as-banner--warn">Seuls les articles effectivement acceptés peuvent être enregistrés comme remis.</p>
        <div className="as-sel-list" style={{ marginBottom: "0.85rem" }}>
          {selection.map((row) => {
            const local = items.find((item) => item.productId === row.productId);
            const refused = local?.status === "refused" || local?.status === "reserve" || refusals.some((r) => r.productId === row.productId);
            return (
              <button
                type="button"
                key={String(row.productId)}
                className={`as-sel-item${refusalProductId === row.productId ? " is-on" : ""}`}
                onClick={() => setRefusalProductId(String(row.productId))}
                style={{ textAlign: "left", width: "100%" }}
              >
                {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                <div>
                  <strong>{String(row.reference || row.title)}</strong>
                  <small>{String(row.ownerName)}</small>
                  <span className={`as-badge ${refused ? "as-badge--cancelled" : "as-badge--stage"}`}>
                    {refused ? "Refusé" : "Accepté"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="as-grid">
          <section className="as-card">
            <div className="as-art as-art--offer">
              {typeof activeRefusal?.imageUrl === "string" ? <img src={activeRefusal.imageUrl} alt="" /> : <i className="as-art__ph" />}
              <div>
                <strong>{String(activeRefusal?.title ?? "Article")}</strong>
                <small>
                  {String(activeRefusal?.ownerName)} · {String(activeRefusal?.reference ?? "—")}
                </small>
              </div>
            </div>
            <label>
              Type
              <select className="as-field" value={refusalType} onChange={(e) => setRefusalType(e.target.value as typeof refusalType)}>
                <option value="damage">Dommage constaté</option>
                <option value="missing">Manquant / incomplet</option>
                <option value="refusal">Refus client</option>
                <option value="other">Autre</option>
              </select>
            </label>
            <label>
              Description
              <textarea className="as-field" rows={4} value={refusalDescription} onChange={(e) => setRefusalDescription(e.target.value)} />
            </label>
            <label>
              Responsabilité
              <select
                className="as-field"
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value as typeof responsibility)}
              >
                <option value="to_determine">À déterminer après analyse</option>
                <option value="transport">Transport</option>
                <option value="partner">Partenaire</option>
                <option value="client">Client</option>
                <option value="onloutou">ONLOUTOU</option>
              </select>
            </label>
            <p className="as-empty">Comparaison départ / arrivée : pièces jointes à joindre lors de l’analyse.</p>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Prise en charge de l’article refusé</h2>
              <p>
                <small>Détenteur actuel</small>
                Équipe transport ONLOUTOU
              </p>
              <p>
                <small>Destination</small>
                Retour au dépôt ONLOUTOU · Marcory
              </p>
              <p>
                <small>Retour</small>
                À organiser
              </p>
              <span className="as-badge as-badge--warn">Bloqué pour contrôle</span>
              <p className="as-note" style={{ marginTop: "0.75rem" }}>
                Un refus ne rend pas automatiquement l’article disponible.
              </p>
            </section>
            <section className="as-card as-side">
              <h2>Décision à préparer</h2>
              {(
                [
                  ["replace", "Proposer un article de remplacement"],
                  ["redeliver", "Planifier une nouvelle livraison"],
                  ["adjust_proposal", "Ajuster la proposition (à revoir)"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="as-check">
                  <input type="radio" checked={nextDecision === value} onChange={() => setNextDecision(value)} />
                  {label}
                </label>
              ))}
              <p className="as-note" style={{ marginTop: "0.75rem" }}>
                Aucun remboursement ni frais n’est appliqué automatiquement — conséquences financières traitées à part.
              </p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("arrival")}>
            ← Contrôle à l’arrivée
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled={pending} onClick={() => void saveRefusal(false)}>
              Enregistrer le signalement
            </button>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={pending || acceptedCount === 0}
              onClick={() => void saveRefusal(true)}
            >
              Préparer la preuve de remise partielle
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "proof") {
    const arrivalItems: Record<string, unknown>[] = Array.isArray(arrivalSaved.items)
      ? arrivalSaved.items.map((row) => asRecord(row))
      : items.map((row) => {
          const sel = selection.find((s) => s.productId === row.productId) ?? {};
          return { ...sel, ...row };
        });
    const noteId = String(proofSaved.deliveryNoteId || `BL-${String(request.reference).slice(-3)}`);
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Preuve de réception
            </h2>
            <p className="as-lead">Présentez le bon de livraison et recueillez la confirmation du client.</p>
          </div>
          <div className="as-head__actions">
            <span className={`as-badge ${handedOver ? "as-badge--stage" : "as-badge--warn"}`}>
              {handedOver ? "Remise enregistrée" : "À confirmer"}
            </span>
            <span className="as-badge as-badge--info">Mission {missionId}</span>
          </div>
        </div>
        {contextBar}
        {routeLine}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <section className="as-card">
            <div className="as-head" style={{ marginBottom: "0.5rem" }}>
              <h2>Bon de livraison {noteId}</h2>
              <div className="as-head__actions">
                <button type="button" className="as-btn" disabled>
                  Imprimer
                </button>
                <button type="button" className="as-btn" disabled>
                  Télécharger (PDF)
                </button>
              </div>
            </div>
            <div className="as-need">
              <p>
                <small>Client</small>
                {clientName}
              </p>
              <p>
                <small>Mission</small>
                {missionId}
              </p>
              <p>
                <small>Arrivée effective</small>
                {formatDayMonth(startDate)} à {arrivedTime}
              </p>
              <p>
                <small>Destination</small>
                {place}
              </p>
              <p>
                <small>Période</small>
                {formatDateRange(startDate, endDate)}
              </p>
              <p>
                <small>Départ</small>
                {includeDepot ? "Dépôt ONLOUTOU · Marcory" : "Point de départ"}
              </p>
            </div>
            <div className="as-sel-list" style={{ marginTop: "0.85rem" }}>
              {arrivalItems.map((row) => (
                <div className="as-sel-item" key={String(row.productId)}>
                  {typeof row.imageUrl === "string" ? <img src={String(row.imageUrl)} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{String(row.reference || row.title)}</strong>
                    <small>
                      {String(row.ownerName || "—")} · Qté {Number(row.expectedQty ?? row.presentedQty ?? 1)} · Acceptée{" "}
                      {Number(row.acceptedQty ?? 0)}
                    </small>
                    <span className={`as-badge ${row.status === "accepted" ? "as-badge--stage" : "as-badge--cancelled"}`}>
                      {row.status === "accepted" ? "Accepté" : "Non remis"}
                    </span>
                    {row.observation ? <p className="as-empty">{String(row.observation)}</p> : null}
                  </div>
                </div>
              ))}
            </div>
            <p className="as-note" style={{ marginTop: "0.75rem" }}>
              {functioning === "not_tested"
                ? "Fonctionnement non testé après transport — consignes de mise en service remises."
                : arrivalNote}
            </p>
            <p className="as-empty" style={{ marginTop: "0.5rem" }}>
              Aucun reversement ni restitution du dépôt n’est déclenché ici.
            </p>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Confirmation du destinataire</h2>
              <div className="as-prop-pills" style={{ marginBottom: "0.65rem" }}>
                <button
                  type="button"
                  className={`as-badge${confirmMode === "device" ? " as-badge--warn" : ""}`}
                  onClick={() => setConfirmMode("device")}
                >
                  Sur cet appareil
                </button>
                <button
                  type="button"
                  className={`as-badge${confirmMode === "link" ? " as-badge--warn" : ""}`}
                  onClick={() => setConfirmMode("link")}
                >
                  Lien sécurisé
                </button>
              </div>
              <label>
                Nom
                <input className="as-field" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </label>
              <label>
                Rôle
                <input className="as-field" value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} />
              </label>
              <label className="as-check">
                <input type="checkbox" checked={recipientConfirmed} onChange={(e) => setRecipientConfirmed(e.target.checked)} />
                Je confirme la réception des articles et les observations ci-contre.
              </label>
              <button
                type="button"
                className={`as-btn${recipientSigned ? " as-btn--yellow" : ""}`}
                style={{ marginTop: "0.65rem", width: "100%", borderStyle: "dashed" }}
                onClick={() => setRecipientSigned(true)}
              >
                {recipientSigned ? "Signature recueillie" : "Signer ici"}
              </button>
            </section>
            <section className="as-card as-side">
              <h2>Confirmation du livreur</h2>
              <p>
                <small>Équipe</small>
                {String(plan.driverLabel || "Équipe transport ONLOUTOU")}
              </p>
              <p className="as-empty">Heure de remise : renseignée lors de la validation.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("arrival")}>
            ← Contrôle à l’arrivée
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled={pending || handedOver} onClick={() => void saveProof({ draft: true })}>
              Enregistrer le brouillon
            </button>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={pending || handedOver || !proofReady}
              title={!proofReady ? "Indisponible tant que la preuve de réception du client est en attente." : undefined}
              onClick={() => void saveProof({ recordHandover: true })}
            >
              {handedOver ? "Remise déjà enregistrée" : pending ? "Enregistrement…" : "Enregistrer la remise"}
            </button>
          </div>
        </div>
        {!proofReady && !handedOver ? (
          <p className="as-empty" style={{ marginTop: "0.5rem" }}>
            Indisponible tant que la preuve de réception du client est en attente.
          </p>
        ) : null}
      </div>
    );
  }

  // arrival (G09A)
  return (
    <div className="as-offer">
      <div className="as-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
            Contrôler à l’arrivée
          </h2>
          <p className="as-lead">Vérifiez les quantités, accessoires et états avec le destinataire.</p>
        </div>
        <div className="as-head__actions">
          <span className="as-badge as-badge--info">Mission {missionId}</span>
          <span className="as-badge">{formatDayMonth(startDate)}</span>
          <span className="as-badge as-badge--warn">Sur place — Remise à enregistrer</span>
        </div>
      </div>
      {contextBar}
      {routeLine}
      <p className="as-banner as-banner--warn">L’arrivée sur place ne confirme pas la remise des articles.</p>
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="as-note">{notice}</p> : null}

      <section className="as-card" style={{ marginBottom: "0.85rem" }}>
        <h2>Articles présentés au client</h2>
        <div className="as-sel-list">
          {selection.map((row) => {
            const local = items.find((item) => item.productId === row.productId) ?? {
              productId: String(row.productId),
              presentedQty: 1,
              acceptedQty: 1,
              status: "accepted" as const,
              observation: "",
            };
            return (
              <div className="as-sel-item" key={String(row.productId)}>
                {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                <div style={{ flex: 1 }}>
                  <strong>{String(row.title)}</strong>
                  <small>
                    {String(row.ownerName)} · {String(row.reference ?? "—")} · Prévu {Number(row.quantity ?? 1)}
                  </small>
                  <div className="as-inline-fields" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                    <label>
                      Présenté
                      <input
                        className="as-field"
                        type="number"
                        min={0}
                        max={99}
                        value={local.presentedQty}
                        onChange={(e) => patchItem(local.productId, { presentedQty: Number(e.target.value) || 0 })}
                      />
                    </label>
                    <label>
                      Accepté
                      <input
                        className="as-field"
                        type="number"
                        min={0}
                        max={99}
                        value={local.acceptedQty}
                        onChange={(e) =>
                          patchItem(local.productId, {
                            acceptedQty: Number(e.target.value) || 0,
                            status: Number(e.target.value) > 0 ? "accepted" : "refused",
                          })
                        }
                      />
                    </label>
                    <label>
                      État
                      <select
                        className="as-field"
                        value={local.status}
                        onChange={(e) =>
                          patchItem(local.productId, {
                            status: e.target.value as ArrivalItem["status"],
                            acceptedQty: e.target.value === "accepted" ? Math.max(local.acceptedQty, 1) : 0,
                          })
                        }
                      >
                        <option value="accepted">Accepté</option>
                        <option value="reserve">Réserve</option>
                        <option value="refused">Refusé</option>
                      </select>
                    </label>
                  </div>
                  <label style={{ marginTop: "0.35rem", display: "block" }}>
                    Observation
                    <input
                      className="as-field"
                      value={local.observation}
                      onChange={(e) => patchItem(local.productId, { observation: e.target.value })}
                      placeholder="État conforme au départ"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="as-grid as-grid--3">
        <section className="as-card">
          <h2>Contrôle avec le destinataire</h2>
          <ul className="as-checks-list">
            {(
              [
                ["Identité de l’article", identityChecked, setIdentityChecked],
                ["Quantités", quantitiesChecked, setQuantitiesChecked],
                ["Accessoires", accessoriesChecked, setAccessoriesChecked],
                ["État comparé", stateCompared, setStateCompared],
                ["Consignes remises", instructionsGiven, setInstructionsGiven],
              ] as const
            ).map(([label, value, setter]) => (
              <li key={label} className={value ? "is-ok" : ""}>
                <label className="as-check" style={{ flex: 1 }}>
                  <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} />
                  {label}
                </label>
                {value ? <span className="as-badge as-badge--stage">Vérifié</span> : null}
              </li>
            ))}
          </ul>
          <label style={{ marginTop: "0.65rem" }}>
            Fonctionnement
            <select className="as-field" value={functioning} onChange={(e) => setFunctioning(e.target.value as typeof functioning)}>
              <option value="not_tested">Non testé après transport</option>
              <option value="ok">Testé — conforme</option>
              <option value="fail">Écart constaté</option>
            </select>
          </label>
          <label>
            Note
            <textarea className="as-field" rows={3} value={arrivalNote} onChange={(e) => setArrivalNote(e.target.value)} />
          </label>
        </section>
        <section className="as-card">
          <h2>Destinataire</h2>
          <label>
            Nom du réceptionnaire
            <input className="as-field" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
          </label>
          <label>
            Qualité
            <input className="as-field" value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} />
          </label>
          <label>
            Contact
            <input className="as-field" value={recipientContact} onChange={(e) => setRecipientContact(e.target.value)} />
          </label>
          <label>
            Arrivée effective
            <input className="as-field" value={arrivedTime} onChange={(e) => setArrivedTime(e.target.value)} />
          </label>
        </section>
        <section className="as-card as-side">
          <h2>Synthèse du contrôle</h2>
          <ul className="as-checks-list">
            <li className={acceptedCount > 0 ? "is-ok" : ""}>
              <IconCheck /> {acceptedCount} article{acceptedCount > 1 ? "s" : ""} accepté{acceptedCount > 1 ? "s" : ""}
            </li>
            <li className={refusedCount === 0 ? "is-ok" : ""}>
              <IconCheck /> {refusedCount === 0 ? "Aucun nouvel écart déclaré" : `${refusedCount} réserve(s) / refus`}
            </li>
            <li>
              <IconCheck /> Preuve de réception à recueillir
            </li>
          </ul>
          <button
            type="button"
            className="as-btn as-btn--yellow"
            style={{ width: "100%", marginTop: "0.75rem" }}
            disabled={pending || !checksReady || acceptedCount === 0}
            onClick={() => void saveArrival(true)}
          >
            Préparer la preuve de réception
          </button>
          <button type="button" className="as-btn" style={{ width: "100%", marginTop: "0.45rem" }} onClick={() => onView("refusal")}>
            Signaler une réserve ou un refus
          </button>
        </section>
      </div>

      <div className="as-wiz-foot">
        <button type="button" className="as-btn" onClick={() => onView("depart")}>
          ← Contrôle avant départ
        </button>
        <div className="as-head__actions">
          <button type="button" className="as-btn" disabled={pending} onClick={() => void saveArrival(false)}>
            Enregistrer le contrôle
          </button>
        </div>
      </div>
      <p className="as-empty" style={{ marginTop: "0.5rem" }}>
        Le prochain écran permet au client de vérifier le récapitulatif avant confirmation.
      </p>
    </div>
  );
}
