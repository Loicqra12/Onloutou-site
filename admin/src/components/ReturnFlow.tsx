import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type ReturnView = "return_plan" | "return_pickup" | "return_depot" | "return_partner";

type Props = {
  request: OfferRequest;
  view: ReturnView;
  onView: (view: ReturnView | "active") => void;
  onUpdated: (request: OfferRequest) => void;
  onBackToDossier?: () => void;
  onOpenClosure?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function ReturnFlow({ request, view, onView, onUpdated, onBackToDossier, onOpenClosure }: Props) {
  const payload = asRecord(request.payload);
  const rental = asRecord(payload.rental);
  const logistics = asRecord(payload.logistics);
  const planDelivery = asRecord(logistics.plan);
  const returnFlow = asRecord(logistics.returnFlow);
  const returnPlan = asRecord(returnFlow.plan);
  const pickup = asRecord(returnFlow.pickup);
  const depot = asRecord(returnFlow.depot);
  const partnerRest = asRecord(returnFlow.partnerRestitution);

  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : Array.isArray(rental.items)
      ? (rental.items as unknown[]).map((row) => asRecord(row))
      : [];
  const partnerItems = selection.filter((row) => row.ownerKind !== "onloutou");
  const onlItems = selection.filter((row) => row.ownerKind === "onloutou");

  const clientName = request.organization || request.contactName || "Client";
  const startDate = typeof payload.startDate === "string" ? payload.startDate : String(rental.periodStart ?? "");
  const endDate = typeof payload.endDate === "string" ? payload.endDate : String(rental.periodEnd ?? "");
  const place = [payload.commune, payload.city].filter(Boolean).join(", ") || request.zone || "—";
  const deliveryStep = Array.isArray(planDelivery.steps)
    ? asRecord((planDelivery.steps as unknown[]).find((row) => asRecord(row).kind === "client_delivery"))
    : {};

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [date, setDate] = useState(String(returnPlan.date || planDelivery.returnDate || endDate));
  const [slotStart, setSlotStart] = useState(String(returnPlan.slotStart || "09:00"));
  const [slotEnd, setSlotEnd] = useState(String(returnPlan.slotEnd || "11:00"));
  const [address, setAddress] = useState(String(returnPlan.address || deliveryStep.address || place));
  const [contact, setContact] = useState(String(returnPlan.contact || request.contactName || clientName));
  const [driverLabel, setDriverLabel] = useState(String(returnPlan.driverLabel || planDelivery.driverLabel || ""));
  const [vehicleLabel, setVehicleLabel] = useState(String(returnPlan.vehicleLabel || planDelivery.vehicleLabel || ""));
  const [planNote, setPlanNote] = useState(String(returnPlan.note || ""));

  const defaultPickupItems = useMemo(
    () =>
      selection.map((row) => {
        const existing = Array.isArray(pickup.items)
          ? asRecord((pickup.items as unknown[]).find((item) => asRecord(item).productId === row.productId))
          : {};
        return {
          productId: String(row.productId),
          qty: Number(existing.qty ?? row.quantity ?? 1) || 1,
          accessoriesOk: existing.accessoriesOk !== false,
          status: (existing.status as "ok" | "reserve" | "missing") || "ok",
          observation: String(existing.observation ?? ""),
        };
      }),
    [selection, pickup.items],
  );
  const [pickupItems, setPickupItems] = useState(defaultPickupItems);
  const [arrivedTime, setArrivedTime] = useState(String(pickup.arrivedTime || "10:20"));
  const [clientConfirm, setClientConfirm] = useState(String(pickup.clientConfirmName || ""));
  const [collectorConfirm, setCollectorConfirm] = useState(String(pickup.collectorConfirmName || driverLabel || ""));

  const depotItems = Array.isArray(depot.items) ? depot.items.map((row) => asRecord(row)) : [];
  const [activeProductId, setActiveProductId] = useState(String(selection[0]?.productId || ""));
  const activeDepot = depotItems.find((row) => row.productId === activeProductId) ?? {};
  const [identity, setIdentity] = useState(String(activeDepot.identity ?? "ok"));
  const [accessories, setAccessories] = useState(String(activeDepot.accessories ?? "ok"));
  const [exterior, setExterior] = useState(String(activeDepot.exterior ?? "ok"));
  const [cleaning, setCleaning] = useState(String(activeDepot.cleaning ?? "ok"));
  const [functionTest, setFunctionTest] = useState(String(activeDepot.functionTest ?? "unchecked"));
  const [depotObservation, setDepotObservation] = useState(
    String(activeDepot.observation || "Rayure côté droit déjà présente avant location."),
  );

  const partnerTarget = partnerItems[0];
  const restitutionItems = Array.isArray(partnerRest.items) ? partnerRest.items.map((row) => asRecord(row)) : [];
  const existingRest = restitutionItems.find((row) => row.productId === partnerTarget?.productId) ?? {};
  const [partnerConfirm, setPartnerConfirm] = useState(
    String(existingRest.partnerConfirmName || `Contact habilité — ${String(partnerTarget?.ownerName || "Partenaire")}`),
  );
  const [transportConfirm, setTransportConfirm] = useState(
    String(existingRest.transportConfirmName || driverLabel || "Équipe transport ONLOUTOU"),
  );
  const [restitutionTime, setRestitutionTime] = useState(String(existingRest.restitutedTime || "10:15"));
  const [restitutionNote, setRestitutionNote] = useState(String(existingRest.note || "Aucun écart signalé."));

  const missionCreated = Boolean(returnPlan.missionsCreated);
  const pickupRecorded = Boolean(pickup.recorded);
  const planReady = Boolean(date && address.trim() && contact.trim() && driverLabel.trim() && vehicleLabel.trim());
  const depotReady =
    identity === "ok" && accessories === "ok" && exterior === "ok" && cleaning === "ok" && functionTest === "ok";
  const allDepotValidated = Boolean(depot.allValidated);
  const partnerValidated = depotItems.some((row) => row.ownerKind !== "onloutou" && row.validated);
  const partnerReturned = restitutionItems.some((row) => row.productId === partnerTarget?.productId && row.recorded);

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
        {formatDayMonth(date || endDate)}
      </p>
      <p>
        <small>Articles</small>
        {selection.length} article{selection.length > 1 ? "s" : ""}
      </p>
    </div>
  );

  function loadDepotItem(productId: string) {
    setActiveProductId(productId);
    const row = depotItems.find((item) => item.productId === productId) ?? {};
    setIdentity(String(row.identity ?? "ok"));
    setAccessories(String(row.accessories ?? "ok"));
    setExterior(String(row.exterior ?? "ok"));
    setCleaning(String(row.cleaning ?? "ok"));
    setFunctionTest(String(row.functionTest ?? "unchecked"));
    setDepotObservation(String(row.observation || "Rayure côté droit déjà présente avant location."));
  }

  async function savePlan(createMission: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/return/plan`, {
      method: "PATCH",
      json: { date, slotStart, slotEnd, address, contact, driverLabel, vehicleLabel, note: planNote, createMission },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(createMission ? "Mission de reprise créée." : "Brouillon enregistré.");
    if (createMission) onView("return_pickup");
  }

  async function savePickup(recordPickup: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/return/pickup`, {
      method: "PATCH",
      json: {
        arrivedTime,
        clientConfirmName: clientConfirm,
        collectorConfirmName: collectorConfirm,
        items: pickupItems,
        recordPickup,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(recordPickup ? "Reprise constatée. Passez au contrôle dépôt." : "Constat enregistré.");
    if (recordPickup) onView("return_depot");
  }

  async function saveDepot(validateCompliant: boolean) {
    if (!activeProductId) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/return/depot`, {
      method: "PATCH",
      json: {
        productId: activeProductId,
        identity,
        accessories,
        exterior,
        cleaning,
        functionTest,
        observation: depotObservation,
        validateCompliant,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    const nextDepot = asRecord(asRecord(asRecord(res.data.request.payload).logistics).returnFlow).depot;
    const nextRaw = asRecord(nextDepot).items;
    const nextItems = Array.isArray(nextRaw) ? nextRaw.map((row: unknown) => asRecord(row)) : [];
    const hasPartnerLeft = nextItems.some(
      (row: Record<string, unknown>) =>
        row.ownerKind !== "onloutou" && row.validated && row.stockDecision === "awaiting_partner_return",
    );
    setNotice(
      validateCompliant
        ? hasPartnerLeft
          ? "Contrôle validé. Restituez les articles partenaires."
          : "Contrôle validé. Matériel ONLOUTOU reste au dépôt."
        : "Contrôle enregistré.",
    );
    if (validateCompliant && asRecord(nextDepot).allValidated) {
      if (hasPartnerLeft) onView("return_partner");
    }
  }

  async function savePartner(recordRestitution: boolean) {
    if (!partnerTarget?.productId) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(
      `/admin/requests/${request.id}/logistics/return/partner`,
      {
        method: "PATCH",
        json: {
          productId: String(partnerTarget.productId),
          restitutedTime: restitutionTime,
          partnerConfirmName: partnerConfirm,
          transportConfirmName: transportConfirm,
          note: restitutionNote,
          recordRestitution,
        },
      },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(
      recordRestitution
        ? "Restitution enregistrée. Aucun reversement automatique. Disponibilité à confirmer par le partenaire."
        : "Brouillon de restitution enregistré.",
    );
  }

  if (view === "return_partner") {
    if (!partnerItems.length) {
      return (
        <div className="as-offer">
          <p className="as-note">Aucun article partenaire à restituer. Le matériel ONLOUTOU reste au dépôt.</p>
          <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("return_depot")}>
            ← Contrôle dépôt
          </button>
        </div>
      );
    }
    const active = partnerTarget;
    const depotPartner = depotItems.find((row) => row.productId === active?.productId) ?? {};
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Restituer au partenaire
            </h2>
            <p className="as-lead">Documentez la réception de son article par le partenaire.</p>
          </div>
          <div className="as-head__actions">
            <span className="as-badge as-badge--info">Mission {String(partnerRest.missionId || `RES-${String(request.reference).slice(-3)}`)}</span>
            <span className={`as-badge ${partnerReturned ? "as-badge--stage" : "as-badge--warn"}`}>
              {partnerReturned ? "Restitution enregistrée" : "Restitution à enregistrer"}
            </span>
          </div>
        </div>
        {contextBar}
        <p className="as-empty" style={{ marginBottom: "0.75rem" }}>
          Restitution · {formatDayMonth(endDate)} à {restitutionTime} · Dépôt ONLOUTOU · Marcory →{" "}
          {String(active?.ownerName || "Partenaire")}
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
              <h2>Article du partenaire à restituer</h2>
              <div className="as-art as-art--offer">
                {typeof active?.imageUrl === "string" ? <img src={active.imageUrl} alt="" /> : <i className="as-art__ph" />}
                <div>
                  <strong>{String(active?.reference || active?.title)}</strong>
                  <small>
                    {String(active?.ownerName)} · {String(active?.title)}
                  </small>
                  <span className="as-badge as-badge--info">Article partenaire</span>
                </div>
              </div>
              <p style={{ marginTop: "0.65rem" }}>
                Qté restituée : 1 · Contrôles :{" "}
                <span className="as-badge as-badge--stage">{depotPartner.validated ? "Validés" : "À valider"}</span> · Accessoires :{" "}
                <span className="as-badge as-badge--stage">Complets</span>
              </p>
            </section>
            <section className="as-card">
              <h2>Contrôles de restitution</h2>
              <ul className="as-todo as-todo--done">
                <li className="is-done">Contrôles effectués au dépôt</li>
                <li className="is-done">Selon les instructions du fabricant</li>
                <li className="is-done">Aucun nouveau défaut constaté</li>
                <li className="is-done">Accessoires : Complets</li>
              </ul>
              <p className="as-banner as-banner--ok" style={{ marginTop: "0.75rem" }}>
                Aucun nouveau défaut constaté. L’article est restitué dans un état conforme à la collecte initiale.
              </p>
            </section>
            {onlItems.length ? (
              <section className="as-card">
                <h2>Autre article du dossier (non concerné)</h2>
                {onlItems.map((row) => (
                  <p key={String(row.productId)}>
                    <strong>{String(row.reference || row.title)}</strong> · ONLOUTOU{" "}
                    <span className="as-badge as-badge--stage">Disponible au dépôt</span>
                  </p>
                ))}
                <p className="as-note">Le matériel ONLOUTOU reste au dépôt et n’est pas inclus dans cette restitution.</p>
              </section>
            ) : null}
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Réception par le partenaire</h2>
              <label>
                Heure
                <input className="as-field" value={restitutionTime} onChange={(e) => setRestitutionTime(e.target.value)} />
              </label>
              <label>
                Représentant partenaire
                <input className="as-field" value={partnerConfirm} onChange={(e) => setPartnerConfirm(e.target.value)} />
              </label>
              <label>
                Confirmation transport
                <input className="as-field" value={transportConfirm} onChange={(e) => setTransportConfirm(e.target.value)} />
              </label>
              <label>
                Note
                <textarea className="as-field" rows={3} value={restitutionNote} onChange={(e) => setRestitutionNote(e.target.value)} />
              </label>
              <button
                type="button"
                className="as-btn as-btn--yellow"
                style={{ width: "100%", marginTop: "0.65rem" }}
                disabled={pending || partnerReturned || !partnerValidated}
                onClick={() => void savePartner(true)}
              >
                {partnerReturned ? "Restitution déjà enregistrée" : pending ? "Enregistrement…" : "Enregistrer la restitution"}
              </button>
            </section>
            <section className="as-card as-side">
              <h2>Après enregistrement</h2>
              <p>
                <small>Garde de l’article</small>
                Chez le partenaire
              </p>
              <p>
                <small>Disponibilité</small>
                À confirmer par le partenaire
              </p>
              <p>
                <small>Dossier</small>
                Clôture financière à traiter
              </p>
              <p className="as-note">La restitution ne déclenche pas automatiquement le reversement partenaire.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("return_depot")}>
            ← Contrôle dépôt
          </button>
          {partnerReturned && onOpenClosure ? (
            <button type="button" className="as-btn as-btn--yellow" onClick={onOpenClosure}>
              Ouvrir le bilan de retour
            </button>
          ) : onBackToDossier ? (
            <button type="button" className="as-btn" onClick={onBackToDossier}>
              Retour au dossier
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "return_depot") {
    const active = selection.find((row) => row.productId === activeProductId) ?? selection[0];
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Contrôler le retour au dépôt
            </h2>
            <p className="as-lead">Enregistrez les tests et décidez si chaque article peut redevenir disponible.</p>
          </div>
          <div className="as-head__actions">
            <span className="as-badge as-badge--info">Mission {String(returnPlan.missionId || `REP-${String(request.reference).slice(-3)}`)}</span>
            <span className={`as-badge ${allDepotValidated ? "as-badge--stage" : "as-badge--warn"}`}>
              {allDepotValidated ? "Contrôle validé" : "Contrôle en cours"}
            </span>
          </div>
        </div>
        {contextBar}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <section className="as-card" style={{ marginBottom: "0.85rem" }}>
          <h2>Réception physique</h2>
          <p className="as-empty">
            {selection.length} article{selection.length > 1 ? "s" : ""} reçu
            {selection.length > 1 ? "s" : ""} · {formatDayMonth(date || endDate)} à {String(depot.receivedTime || arrivedTime)} ·{" "}
            {String(depot.receiverLabel || "Équipe parc ONLOUTOU")} · Bon {String(depot.receiptId || pickup.receiptId || "BR-001")}
          </p>
        </section>
        <div className="as-prop-pills" style={{ marginBottom: "0.75rem" }}>
          {selection.map((row) => (
            <button
              key={String(row.productId)}
              type="button"
              className={`as-badge${activeProductId === row.productId ? " as-badge--warn" : ""}`}
              onClick={() => loadDepotItem(String(row.productId))}
            >
              {String(row.reference || row.title)}
            </button>
          ))}
        </div>
        <div className="as-grid">
          <section className="as-card">
            <div className="as-art as-art--offer">
              {typeof active?.imageUrl === "string" ? <img src={active.imageUrl} alt="" /> : <i className="as-art__ph" />}
              <div>
                <strong>{String(active?.reference || active?.title)}</strong>
                <small>
                  {String(active?.ownerName)} · {String(active?.title)}
                </small>
              </div>
            </div>
            <p className="as-note" style={{ marginTop: "0.65rem" }}>
              Rayure existante éventuelle déjà constatée avant location (cf. état de départ). Ce n’est pas un nouveau dommage par défaut.
            </p>
            <h2 style={{ marginTop: "0.85rem" }}>Contrôle de l’article</h2>
            {(
              [
                ["Identité", identity, setIdentity, "Conforme"],
                ["Accessoires", accessories, setAccessories, "Complets"],
                ["État extérieur", exterior, setExterior, "Conforme au départ"],
                ["Nettoyage", cleaning, setCleaning, "Terminé"],
              ] as const
            ).map(([label, value, setter]) => (
              <div key={label} className="as-checks" style={{ marginTop: "0.45rem" }}>
                <span style={{ minWidth: "10rem", fontWeight: 700 }}>{label}</span>
                {(["ok", "fail", "unchecked"] as const).map((opt) => (
                  <label key={opt} className="as-check">
                    <input type="radio" checked={value === opt} onChange={() => setter(opt)} />
                    {opt === "ok" ? "Conforme" : opt === "fail" ? "Anomalie" : "Non vérifié"}
                  </label>
                ))}
              </div>
            ))}
            <div className="as-checks" style={{ marginTop: "0.45rem" }}>
              <span style={{ minWidth: "10rem", fontWeight: 700 }}>Test de fonctionnement</span>
              {(["ok", "fail", "unchecked"] as const).map((opt) => (
                <label key={opt} className="as-check">
                  <input type="radio" checked={functionTest === opt} onChange={() => setFunctionTest(opt)} />
                  {opt === "ok" ? "Conforme" : opt === "fail" ? "Anomalie" : "Non vérifié"}
                </label>
              ))}
            </div>
            <p className="as-empty">Effectuer le test au moment approprié selon les consignes du fabricant.</p>
            <label style={{ marginTop: "0.75rem" }}>
              Observation du contrôle
              <textarea className="as-field" rows={3} value={depotObservation} onChange={(e) => setDepotObservation(e.target.value)} />
            </label>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Situation des articles</h2>
              {selection.map((row) => {
                const rowDepot = depotItems.find((item) => item.productId === row.productId);
                return (
                  <p key={String(row.productId)}>
                    <strong>{String(row.reference || row.title)}</strong>
                    <br />
                    <span className={`as-badge ${rowDepot?.validated ? "as-badge--stage" : "as-badge--warn"}`}>
                      {rowDepot?.validated ? "Validé conforme" : "Reçu — Contrôle incomplet"}
                    </span>
                  </p>
                );
              })}
            </section>
            <section className="as-card as-side">
              <h2>Décision de stock</h2>
              <p className="as-banner as-banner--warn">Non disponible pendant le contrôle.</p>
              {onlItems.length ? (
                <p className="as-empty">ONLOUTOU : éligible après contrôle et entretien validés (reste au dépôt / remise en parc).</p>
              ) : null}
              {partnerItems.length ? (
                <p className="as-empty">Partenaire : éligible après contrôle puis restitution coordonnée.</p>
              ) : null}
            </section>
            <section className="as-card as-side">
              <h2>Suivi financier</h2>
              <p>
                <span className="as-badge as-badge--warn">Dépôt de garantie — décision en attente</span>
              </p>
              <p>
                <span className="as-badge as-badge--warn">Reversement partenaire — à examiner après retour validé</span>
              </p>
              <p className="as-note">Aucun mouvement d’argent automatique ; suites financières après validation.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("return_pickup")}>
            ← Constat de reprise
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled={pending} onClick={() => void saveDepot(false)}>
              Enregistrer le contrôle
            </button>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={pending || !depotReady}
              title={!depotReady ? "Disponible après réalisation du test restant" : undefined}
              onClick={() => void saveDepot(true)}
            >
              Valider conforme
            </button>
            {allDepotValidated && partnerValidated ? (
              <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("return_partner")}>
                Restituer au partenaire
              </button>
            ) : null}
            {allDepotValidated && !partnerItems.length && onOpenClosure ? (
              <button type="button" className="as-btn as-btn--yellow" onClick={onOpenClosure}>
                Ouvrir le bilan de retour
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (view === "return_pickup") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Constater la reprise
            </h2>
            <p className="as-lead">Vérifiez les quantités, accessoires et états avec le client.</p>
          </div>
          <span className={`as-badge ${pickupRecorded ? "as-badge--stage" : "as-badge--warn"}`}>
            {pickupRecorded ? "Reprise constatée" : "Reprise à constater"}
          </span>
        </div>
        {contextBar}
        <p className="as-banner as-banner--warn">Le constat chez le client ne clôture pas le dossier ni le dépôt de garantie.</p>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <section className="as-card">
            <h2>Articles repris chez le client</h2>
            <div className="as-sel-list">
              {selection.map((row) => {
                const local = pickupItems.find((item) => item.productId === row.productId)!;
                return (
                  <div className="as-sel-item" key={String(row.productId)}>
                    {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                    <div style={{ flex: 1 }}>
                      <strong>{String(row.title)}</strong>
                      <small>
                        {String(row.ownerName)} · {String(row.reference ?? "—")}
                      </small>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                        <label>
                          Qté
                          <input
                            className="as-field"
                            type="number"
                            min={0}
                            max={99}
                            value={local.qty}
                            onChange={(e) =>
                              setPickupItems((rows) =>
                                rows.map((item) =>
                                  item.productId === local.productId ? { ...item, qty: Number(e.target.value) || 0 } : item,
                                ),
                              )
                            }
                          />
                        </label>
                        <label>
                          État
                          <select
                            className="as-field"
                            value={local.status}
                            onChange={(e) =>
                              setPickupItems((rows) =>
                                rows.map((item) =>
                                  item.productId === local.productId
                                    ? { ...item, status: e.target.value as "ok" | "reserve" | "missing" }
                                    : item,
                                ),
                              )
                            }
                          >
                            <option value="ok">Conforme</option>
                            <option value="reserve">Réserve</option>
                            <option value="missing">Manquant</option>
                          </select>
                        </label>
                        <label className="as-check" style={{ alignSelf: "end" }}>
                          <input
                            type="checkbox"
                            checked={local.accessoriesOk}
                            onChange={(e) =>
                              setPickupItems((rows) =>
                                rows.map((item) =>
                                  item.productId === local.productId ? { ...item, accessoriesOk: e.target.checked } : item,
                                ),
                              )
                            }
                          />
                          Accessoires OK
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Confirmations</h2>
              <label>
                Heure sur place
                <input className="as-field" value={arrivedTime} onChange={(e) => setArrivedTime(e.target.value)} />
              </label>
              <label>
                Confirmation client
                <input className="as-field" value={clientConfirm} onChange={(e) => setClientConfirm(e.target.value)} />
              </label>
              <label>
                Confirmation collecteur
                <input className="as-field" value={collectorConfirm} onChange={(e) => setCollectorConfirm(e.target.value)} />
              </label>
              <p className="as-empty">Prochaine étape : réception et contrôle au dépôt.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("return_plan")}>
            ← Organisation
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled={pending} onClick={() => void savePickup(false)}>
              Enregistrer le brouillon
            </button>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={pending || pickupRecorded || !clientConfirm.trim() || !collectorConfirm.trim()}
              onClick={() => void savePickup(true)}
            >
              {pickupRecorded ? "Reprise déjà constatée" : "Enregistrer la reprise"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // return_plan G10A
  return (
    <div className="as-offer">
      <div className="as-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
            Organiser la reprise
          </h2>
          <p className="as-lead">Confirmez le créneau, le lieu, le livreur et le véhicule.</p>
        </div>
        <span className={`as-badge ${missionCreated ? "as-badge--stage" : "as-badge--warn"}`}>
          {missionCreated ? "Mission créée" : "Reprise à organiser"}
        </span>
      </div>
      {contextBar}
      <p className="as-banner as-banner--warn">La planification de reprise ne clôture pas la location ni le dépôt de garantie.</p>
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="as-note">{notice}</p> : null}
      <div className="as-grid">
        <section className="as-card">
          <h2>Créneau et lieu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.55rem" }}>
            <label>
              Date
              <input className="as-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Début
              <input className="as-field" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
            </label>
            <label>
              Fin
              <input className="as-field" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
            </label>
          </div>
          <label>
            Adresse de reprise
            <input className="as-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label>
            Contact sur place
            <input className="as-field" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
          <p className="as-empty">
            Trajet prévu : {clientName} · {place} → Dépôt ONLOUTOU · Marcory
          </p>
        </section>
        <aside style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card as-side">
            <h2>Équipe et transport</h2>
            <label>
              Livreur
              <input className="as-field" value={driverLabel} onChange={(e) => setDriverLabel(e.target.value)} placeholder="À affecter" />
            </label>
            <label>
              Véhicule
              <input className="as-field" value={vehicleLabel} onChange={(e) => setVehicleLabel(e.target.value)} placeholder="À affecter" />
            </label>
            <label>
              Note
              <textarea className="as-field" rows={3} value={planNote} onChange={(e) => setPlanNote(e.target.value)} />
            </label>
          </section>
          <section className="as-card as-side">
            <h2>Parcours après reprise</h2>
            <ul className="as-checks-list">
              <li>
                <IconCheck /> Constater chez le client
              </li>
              <li>
                <IconCheck /> Contrôler au dépôt
              </li>
              <li>
                <IconCheck /> Restituer uniquement le matériel partenaire
              </li>
            </ul>
            <p className="as-note">Le matériel ONLOUTOU reste au dépôt après contrôle.</p>
          </section>
        </aside>
      </div>
      <div className="as-wiz-foot">
        <button type="button" className="as-btn" onClick={() => onView("active")}>
          ← Location en cours
        </button>
        <div className="as-head__actions">
          <button type="button" className="as-btn" disabled={pending} onClick={() => void savePlan(false)}>
            Enregistrer le brouillon
          </button>
          <button
            type="button"
            className="as-btn as-btn--yellow"
            disabled={pending || (!missionCreated && !planReady)}
            onClick={() => (missionCreated ? onView("return_pickup") : void savePlan(true))}
          >
            {missionCreated ? "Continuer vers le constat" : "Créer la mission de reprise"}
          </button>
        </div>
      </div>
    </div>
  );
}
