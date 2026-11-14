import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { formatDateRange, formatDayMonth, formatFcfa } from "../lib/format";
import { IconCheck } from "./NavIcons";
import type { OfferRequest } from "./ArticlesOfferPanel";

export type LogisticsView = "plan" | "prepare" | "collect" | "depart" | "arrival" | "proof" | "active" | "refusal";

type Step = {
  id: string;
  kind: "partner_collect" | "depot" | "client_delivery";
  label: string;
  place: string;
  address: string;
  contact: string;
  date: string;
  slotStart: string;
  slotEnd: string;
};

type Props = {
  request: OfferRequest;
  view: LogisticsView;
  onView: (view: LogisticsView) => void;
  onUpdated: (request: OfferRequest) => void;
  onBackToDossier?: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function defaultSteps(input: {
  includeDepot: boolean;
  hasPartner: boolean;
  partnerName: string;
  clientName: string;
  place: string;
  startDate: string;
}): Step[] {
  const steps: Step[] = [];
  if (input.hasPartner) {
    steps.push({
      id: "collect",
      kind: "partner_collect",
      label: `Collecte partenaire — ${input.partnerName}`,
      place: input.place || "Chez le partenaire",
      address: "",
      contact: "",
      date: input.startDate,
      slotStart: "08:00",
      slotEnd: "09:00",
    });
  }
  if (input.includeDepot) {
    steps.push({
      id: "depot",
      kind: "depot",
      label: "Regroupement au dépôt — ONLOUTOU (Marcory)",
      place: "Dépôt Marcory",
      address: "Dépôt ONLOUTOU · Marcory",
      contact: "Équipe parc",
      date: input.startDate,
      slotStart: "09:30",
      slotEnd: "10:30",
    });
  }
  steps.push({
    id: "delivery",
    kind: "client_delivery",
    label: `Livraison client — ${input.clientName}`,
    place: input.place || "Chez le client",
    address: "",
    contact: "",
    date: input.startDate,
    slotStart: "11:00",
    slotEnd: "13:00",
  });
  return steps;
}

export function LogisticsFlow({ request, view, onView, onUpdated, onBackToDossier }: Props) {
  const payload = asRecord(request.payload);
  const rental = asRecord(payload.rental);
  const logistics = asRecord(payload.logistics);
  const planSaved = asRecord(logistics.plan);
  const payment = asRecord(payload.payment);
  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : Array.isArray(rental.items)
      ? (rental.items as unknown[]).map((row) => asRecord(row))
      : [];
  const clientName = request.organization || request.contactName || "Client";
  const startDate = typeof payload.startDate === "string" ? payload.startDate : String(rental.periodStart ?? "");
  const endDate = typeof payload.endDate === "string" ? payload.endDate : String(rental.periodEnd ?? "");
  const place = [payload.commune, payload.city].filter(Boolean).join(", ") || request.zone || "—";
  const partnerItems = selection.filter((row) => row.ownerKind !== "onloutou");
  const onlItems = selection.filter((row) => row.ownerKind === "onloutou");
  const partnerName = String(partnerItems[0]?.ownerName ?? "Partenaire");
  const hasPartner = partnerItems.length > 0;

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [includeDepot, setIncludeDepot] = useState(() =>
    typeof planSaved.includeDepot === "boolean" ? Boolean(planSaved.includeDepot) : hasPartner,
  );
  const [steps, setSteps] = useState<Step[]>(() => {
    if (Array.isArray(planSaved.steps) && planSaved.steps.length) {
      return planSaved.steps.map((row) => {
        const step = asRecord(row);
        return {
          id: String(step.id),
          kind: step.kind as Step["kind"],
          label: String(step.label ?? ""),
          place: String(step.place ?? ""),
          address: String(step.address ?? ""),
          contact: String(step.contact ?? ""),
          date: String(step.date ?? ""),
          slotStart: String(step.slotStart ?? ""),
          slotEnd: String(step.slotEnd ?? ""),
        };
      });
    }
    return defaultSteps({ includeDepot: hasPartner, hasPartner, partnerName, clientName, place, startDate });
  });
  const [transportMode, setTransportMode] = useState<"internal" | "partner">(
    planSaved.transportMode === "partner" ? "partner" : "internal",
  );
  const [driverLabel, setDriverLabel] = useState(String(planSaved.driverLabel ?? ""));
  const [vehicleLabel, setVehicleLabel] = useState(String(planSaved.vehicleLabel ?? ""));
  const [handling, setHandling] = useState(String(planSaved.handling ?? ""));
  const [returnDate, setReturnDate] = useState(String(planSaved.returnDate ?? endDate));
  const [returnSlot, setReturnSlot] = useState(String(planSaved.returnSlot ?? "À convenir"));
  const [planNote, setPlanNote] = useState(String(planSaved.note ?? ""));

  const prepItems = Array.isArray(asRecord(logistics.preparation).items)
    ? (asRecord(logistics.preparation).items as unknown[]).map((row) => asRecord(row))
    : [];
  const [activeProductId, setActiveProductId] = useState(() => String(onlItems[0]?.productId ?? selection[0]?.productId ?? ""));
  const activePrep = prepItems.find((row) => row.productId === activeProductId) ?? {};
  const [identity, setIdentity] = useState(String(activePrep.identity ?? "unchecked"));
  const [cleaning, setCleaning] = useState(String(activePrep.cleaning ?? "unchecked"));
  const [functionTest, setFunctionTest] = useState(String(activePrep.functionTest ?? "unchecked"));
  const [accessories, setAccessories] = useState(String(activePrep.accessories ?? "unchecked"));
  const [protection, setProtection] = useState(String(activePrep.protection ?? "unchecked"));
  const [observation, setObservation] = useState(String(activePrep.observation ?? ""));

  const collections = Array.isArray(logistics.collections)
    ? logistics.collections.map((row) => asRecord(row))
    : [];
  const collectTarget = partnerItems[0];
  const existingCollect = collections.find((row) => row.productId === collectTarget?.productId) ?? {};
  const [partnerConfirm, setPartnerConfirm] = useState(String(existingCollect.partnerConfirmName ?? ""));
  const [collectorConfirm, setCollectorConfirm] = useState(String(existingCollect.collectorConfirmName ?? ""));
  const [collectObservation, setCollectObservation] = useState(String(existingCollect.observation ?? "Aucun écart constaté"));

  const [balanceVerified, setBalanceVerified] = useState(Boolean(asRecord(payment.balance).verified));
  const [depositVerified, setDepositVerified] = useState(Boolean(asRecord(payment.deposit).verified));

  const missionsCreated = Boolean(planSaved.missionsCreated);
  const planReady = useMemo(() => {
    const stepsOk = steps.every((step) => {
      if (step.kind === "depot") return Boolean(step.date);
      return Boolean(step.address.trim() && step.contact.trim() && step.date);
    });
    return stepsOk && Boolean(driverLabel.trim() && vehicleLabel.trim());
  }, [steps, driverLabel, vehicleLabel]);

  const onlReady = onlItems.every((row) => prepItems.some((item) => item.productId === row.productId && item.ready));
  const partnerCollected = partnerItems.every((row) => collections.some((c) => c.productId === row.productId && c.recorded));
  const departed = asRecord(logistics.departure).authorized === true;

  function rebuildSteps(nextIncludeDepot: boolean) {
    setIncludeDepot(nextIncludeDepot);
    setSteps(defaultSteps({ includeDepot: nextIncludeDepot, hasPartner, partnerName, clientName, place, startDate }));
  }

  function patchStep(id: string, patch: Partial<Step>) {
    setSteps((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function savePlan(createMissions: boolean) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/plan`, {
      method: "PATCH",
      json: {
        includeDepot,
        steps,
        transportMode,
        driverLabel,
        vehicleLabel,
        handling,
        returnDate,
        returnSlot,
        note: planNote,
        createMissions,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(createMissions ? "Missions créées. Passez à la préparation des articles." : "Brouillon enregistré.");
    if (createMissions) onView("prepare");
  }

  async function savePrep(declareReady: boolean) {
    if (!activeProductId) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/preparation`, {
      method: "PATCH",
      json: {
        productId: activeProductId,
        identity,
        cleaning,
        functionTest,
        accessories,
        protection,
        observation,
        accessoryList: [
          { label: "Clayettes et bacs", present: true },
          { label: "Câble d’alimentation", present: true },
        ],
        declareReady,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice(declareReady ? "Article déclaré prêt." : "Contrôle enregistré.");
  }

  async function saveCollect() {
    if (!collectTarget?.productId) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/collect`, {
      method: "POST",
      json: {
        productId: String(collectTarget.productId),
        functioning: "ok",
        exterior: "ok",
        accessories: "ok",
        observation: collectObservation,
        partnerConfirmName: partnerConfirm,
        collectorConfirmName: collectorConfirm,
        collectedAt: startDate,
        collectedTime: "08:35",
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice("Collecte enregistrée. Aucun reversement déclenché.");
    onView("depart");
  }

  async function authorize() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/logistics/depart`, {
      method: "POST",
      json: { balanceVerified, depositVerified },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setNotice("Départ autorisé. La livraison chez le client reste à enregistrer.");
    onView("arrival");
  }

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
        <small>Location</small>
        {formatDateRange(startDate, endDate)}
      </p>
      <p>
        <small>Articles</small>
        {selection.length} article{selection.length > 1 ? "s" : ""}
      </p>
    </div>
  );

  if (view === "prepare") {
    const prepTargets = onlItems.length ? onlItems : selection;
    const active =
      prepTargets.find((row) => row.productId === activeProductId) ??
      onlItems[0] ??
      selection[0];
    const activeIsPartner = active?.ownerKind !== "onloutou";
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Préparer les articles
            </h2>
            <p className="as-lead">Contrôlez chaque article ONLOUTOU, ses accessoires et son état.</p>
          </div>
          <span className="as-badge as-badge--stage">{missionsCreated ? "Missions planifiées" : "Préparation"}</span>
        </div>
        {contextBar}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        {!onlItems.length && hasPartner ? (
          <p className="as-note">
            Aucun article ONLOUTOU à préparer ici. Le contrôle des articles partenaires se fait à la collecte.
          </p>
        ) : null}
        <div className="as-prop-pills" style={{ marginBottom: "0.75rem" }}>
          {prepTargets.map((row) => (
            <button
              key={String(row.productId)}
              type="button"
              className={`as-badge${activeProductId === row.productId ? " as-badge--warn" : ""}`}
              onClick={() => {
                setActiveProductId(String(row.productId));
                const prep = prepItems.find((item) => item.productId === row.productId) ?? {};
                setIdentity(String(prep.identity ?? "unchecked"));
                setCleaning(String(prep.cleaning ?? "unchecked"));
                setFunctionTest(String(prep.functionTest ?? "unchecked"));
                setAccessories(String(prep.accessories ?? "unchecked"));
                setProtection(String(prep.protection ?? "unchecked"));
                setObservation(String(prep.observation ?? ""));
              }}
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
                <strong>{String(active?.title ?? "Article")}</strong>
                <small>
                  {String(active?.ownerName ?? "—")} · {String(active?.reference ?? "—")}
                </small>
              </div>
            </div>
            {activeIsPartner ? (
              <p className="as-empty" style={{ marginTop: "0.85rem" }}>
                Contrôle et photos à enregistrer lors de la collecte chez le partenaire.
              </p>
            ) : (
              <>
                <h2 style={{ marginTop: "0.85rem" }}>Contrôle avant transport</h2>
                {(
                  [
                    ["Identité", identity, setIdentity],
                    ["Nettoyage", cleaning, setCleaning],
                    ["Test de fonctionnement", functionTest, setFunctionTest],
                    ["Accessoires", accessories, setAccessories],
                    ["Protection et arrimage", protection, setProtection],
                  ] as const
                ).map(([label, value, setter]) => (
                  <div key={label} className="as-checks" style={{ marginTop: "0.45rem" }}>
                    <span style={{ minWidth: "11rem", fontWeight: 700 }}>{label}</span>
                    {(["ok", "fix", "unchecked"] as const).map((opt) => (
                      <label key={opt} className="as-check">
                        <input type="radio" checked={value === opt} onChange={() => setter(opt)} />
                        {opt === "ok" ? "Conforme" : opt === "fix" ? "À corriger" : "Non vérifié"}
                      </label>
                    ))}
                  </div>
                ))}
                <label style={{ marginTop: "0.75rem" }}>
                  État constaté
                  <textarea className="as-field" rows={3} value={observation} onChange={(e) => setObservation(e.target.value)} />
                </label>
              </>
            )}
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Préparation du dossier</h2>
              {selection.map((row) => {
                const ready = prepItems.some((item) => item.productId === row.productId && item.ready);
                const collected = collections.some((c) => c.productId === row.productId && c.recorded);
                return (
                  <p key={String(row.productId)}>
                    <strong>{String(row.reference || row.title)}</strong>
                    <br />
                    <span className={`as-badge ${ready || collected ? "as-badge--stage" : "as-badge--warn"}`}>
                      {row.ownerKind === "onloutou"
                        ? ready
                          ? "Prêt"
                          : "En préparation"
                        : collected
                          ? "Collecté"
                          : "Collecte prévue"}
                    </span>
                  </p>
                );
              })}
              <p className="as-banner as-banner--warn">La préparation des articles ne donne pas autorisation à la remise au client.</p>
              {hasPartner ? (
                <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("collect")}>
                  Ouvrir la collecte partenaire
                </button>
              ) : (
                <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("depart")}>
                  Contrôle avant départ
                </button>
              )}
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("plan")}>
            ← Planification
          </button>
          <div className="as-head__actions">
            {activeIsPartner ? (
              <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("collect")}>
                Continuer vers la collecte
              </button>
            ) : (
              <>
                <button type="button" className="as-btn" disabled={pending} onClick={() => void savePrep(false)}>
                  Enregistrer le contrôle
                </button>
                <button
                  type="button"
                  className="as-btn as-btn--yellow"
                  disabled={pending || identity !== "ok" || cleaning !== "ok" || functionTest !== "ok" || accessories !== "ok"}
                  onClick={() => void savePrep(true)}
                >
                  Déclarer prêt
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === "collect") {
    if (!collectTarget) {
      return (
        <div className="as-offer">
          <p className="as-note">Aucun article partenaire à collecter pour ce dossier.</p>
          <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("depart")}>
            Contrôle avant départ
          </button>
        </div>
      );
    }
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Collecter chez le partenaire
            </h2>
            <p className="as-lead">
              {String(collectTarget.ownerName)} → {includeDepot || planSaved.includeDepot ? "Dépôt ONLOUTOU" : "Livraison client"}
            </p>
          </div>
          <span className="as-badge as-badge--warn">{existingCollect.recorded ? "Collecte enregistrée" : "Collecte à enregistrer"}</span>
        </div>
        {contextBar}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <section className="as-card">
            <div className="as-art as-art--offer">
              {typeof collectTarget.imageUrl === "string" ? <img src={collectTarget.imageUrl} alt="" /> : <i className="as-art__ph" />}
              <div>
                <strong>{String(collectTarget.title)}</strong>
                <small>
                  {String(collectTarget.ownerName)} · {String(collectTarget.reference ?? "—")}
                </small>
                <span className="as-badge as-badge--stage">Le propriétaire reste {String(collectTarget.ownerName)}</span>
              </div>
            </div>
            <h2 style={{ marginTop: "0.85rem" }}>Contrôle à la collecte</h2>
            <ul className="as-todo as-todo--done">
              <li className="is-done">Fonctionnement constaté</li>
              <li className="is-done">État extérieur</li>
              <li className="is-done">Accessoires complets</li>
            </ul>
            <label>
              Observations
              <textarea className="as-field" rows={3} value={collectObservation} onChange={(e) => setCollectObservation(e.target.value)} />
            </label>
          </section>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Prise en charge</h2>
              <p>
                <small>Livreur</small>
                {driverLabel || "Équipe transport ONLOUTOU"}
              </p>
              <p>
                <small>Date</small>
                {formatDayMonth(startDate)}
              </p>
              <label>
                Confirmation partenaire
                <input value={partnerConfirm} onChange={(e) => setPartnerConfirm(e.target.value)} placeholder="Nom du représentant" />
              </label>
              <label>
                Confirmation collecteur
                <input value={collectorConfirm} onChange={(e) => setCollectorConfirm(e.target.value)} placeholder="Nom du chauffeur" />
              </label>
              <p className="as-banner as-banner--warn">En cas d’écart, suspendre la collecte et prévenir le responsable.</p>
              <p className="as-note">La collecte ne déclenche aucun reversement.</p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView("prepare")}>
            ← Préparation
          </button>
          <button
            type="button"
            className="as-btn as-btn--yellow"
            disabled={pending || !partnerConfirm.trim() || !collectorConfirm.trim() || Boolean(existingCollect.recorded)}
            onClick={() => void saveCollect()}
          >
            {existingCollect.recorded ? "Collecte déjà enregistrée" : pending ? "Enregistrement…" : "Enregistrer la collecte"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "depart") {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Contrôle avant départ
            </h2>
            <p className="as-lead">Vérifiez articles, documents et paiements avant d’autoriser le départ.</p>
          </div>
          <span className={`as-badge ${departed ? "as-badge--stage" : "as-badge--warn"}`}>
            {departed ? "Départ autorisé" : "Prête à autoriser"}
          </span>
        </div>
        {contextBar}
        <p className="as-banner as-banner--warn">
          L’autorisation de départ ne confirme pas la livraison. La réception sera enregistrée chez le client.
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
              <h2>Mission de livraison</h2>
              <p>
                {includeDepot || planSaved.includeDepot ? "Dépôt Marcory" : "Point de départ"} → {clientName}, {place}
              </p>
              <p className="as-empty">
                {formatDayMonth(startDate)} · Livraison {steps.find((s) => s.kind === "client_delivery")?.slotStart || "—"}–
                {steps.find((s) => s.kind === "client_delivery")?.slotEnd || "—"}
              </p>
              <div className="as-sel-list" style={{ marginTop: "0.75rem" }}>
                {selection.map((row) => {
                  const ready = prepItems.some((item) => item.productId === row.productId && item.ready);
                  const collected = collections.some((c) => c.productId === row.productId && c.recorded);
                  return (
                    <div className="as-sel-item" key={String(row.productId)}>
                      {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                      <div>
                        <strong>{String(row.title)}</strong>
                        <small>
                          {String(row.ownerName)} · {String(row.reference ?? "—")}
                        </small>
                        <span className={`as-badge ${ready || collected ? "as-badge--stage" : "as-badge--warn"}`}>
                          {row.ownerKind === "onloutou"
                            ? ready
                              ? "Préparation validée"
                              : "Préparation à faire"
                            : collected
                              ? "Réception / collecte contrôlée"
                              : "Collecte à enregistrer"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="as-card">
              <h2>Vérifications de départ</h2>
              <ul className="as-checks-list">
                <li className={onlReady || onlItems.length === 0 ? "is-ok" : ""}>
                  <IconCheck /> Identités et états <span>{onlReady || onlItems.length === 0 ? "OK" : "À faire"}</span>
                </li>
                <li className={partnerCollected || partnerItems.length === 0 ? "is-ok" : ""}>
                  <IconCheck /> Collecte partenaire <span>{partnerCollected || partnerItems.length === 0 ? "OK" : "À faire"}</span>
                </li>
                <li className={missionsCreated ? "is-ok" : ""}>
                  <IconCheck /> Adresse / contact / équipe <span>{missionsCreated ? "OK" : "À faire"}</span>
                </li>
              </ul>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Finances de la location</h2>
              <p>
                <small>Paiement initial</small>
                <span className="as-badge as-badge--stage">Vérifié</span>
              </p>
              <label className="as-check">
                <input type="checkbox" checked={balanceVerified} onChange={(e) => setBalanceVerified(e.target.checked)} />
                Solde de location reçu et vérifié
              </label>
              <label className="as-check">
                <input type="checkbox" checked={depositVerified} onChange={(e) => setDepositVerified(e.target.checked)} />
                Dépôt de garantie reçu
              </label>
              <p className="as-empty">Montants suivis sur l’onglet Finances · {formatFcfa(asRecord(payment.initial).amount as string)}</p>
            </section>
            <section className="as-card as-side">
              <h2>Trajet et transport</h2>
              <p>
                <small>Mode</small>
                {transportMode === "internal" ? "Transport interne" : "Transporteur partenaire"}
              </p>
              <p>
                <small>Livreur</small>
                {driverLabel || "—"}
              </p>
              <p>
                <small>Véhicule</small>
                {vehicleLabel || "—"}
              </p>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => onView(hasPartner ? "collect" : "prepare")}>
            ← Étape précédente
          </button>
          <div className="as-head__actions">
            {departed ? (
              <button type="button" className="as-btn as-btn--yellow" onClick={() => onView("arrival")}>
                Contrôler à l’arrivée
              </button>
            ) : (
              <button
                type="button"
                className="as-btn as-btn--yellow"
                disabled={
                  pending ||
                  !missionsCreated ||
                  (!onlReady && onlItems.length > 0) ||
                  (!partnerCollected && partnerItems.length > 0) ||
                  !balanceVerified ||
                  !depositVerified
                }
                onClick={() => void authorize()}
              >
                {pending ? "Autorisation…" : "Autoriser le départ"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // plan (G08A)
  const missing = [
    ...steps
      .filter((step) => step.kind !== "depot")
      .flatMap((step) => [
        !step.address.trim() ? `Adresse — ${step.label}` : null,
        !step.contact.trim() ? `Contact — ${step.label}` : null,
      ]),
    !driverLabel.trim() ? "Livreur à affecter" : null,
    !vehicleLabel.trim() ? "Véhicule à affecter" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="as-offer">
      <div className="as-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
            Organiser la livraison
          </h2>
          <p className="as-lead">Définissez les étapes, adresses, créneaux, livreur et véhicule.</p>
        </div>
        <span className="as-badge as-badge--stage">Location confirmée</span>
      </div>
      {contextBar}
      <p className="as-banner as-banner--warn">La planification ne vaut pas autorisation de remise.</p>
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
              <h2>Trajet prévu</h2>
              <label className="as-check">
                <input type="checkbox" checked={includeDepot} onChange={(e) => rebuildSteps(e.target.checked)} />
                Passer par le dépôt ONLOUTOU
              </label>
            </div>
            <p className="as-empty">Le passage au dépôt est optionnel : utile pour ce scénario de regroupement, pas obligatoire pour toutes les livraisons.</p>
            {steps.map((step, index) => (
              <div key={step.id} className="as-prop-line">
                <strong>
                  {index + 1}. {step.label}
                </strong>
                <span className="as-badge as-badge--warn">
                  {step.kind === "depot" || (step.address && step.contact) ? "À confirmer" : "Planification incomplète"}
                </span>
                <div className="as-form-grid" style={{ marginTop: "0.55rem" }}>
                  {step.kind !== "depot" ? (
                    <>
                      <label>
                        Adresse précise
                        <input value={step.address} onChange={(e) => patchStep(step.id, { address: e.target.value })} />
                      </label>
                      <label>
                        Contact sur place
                        <input value={step.contact} onChange={(e) => patchStep(step.id, { contact: e.target.value })} />
                      </label>
                    </>
                  ) : (
                    <p className="as-empty">Étape fixe au dépôt · pas d’adresse client à saisir</p>
                  )}
                  <label>
                    Date
                    <input type="date" value={step.date} onChange={(e) => patchStep(step.id, { date: e.target.value })} />
                  </label>
                  <label>
                    Début
                    <input type="time" value={step.slotStart} onChange={(e) => patchStep(step.id, { slotStart: e.target.value })} />
                  </label>
                  <label>
                    Fin
                    <input type="time" value={step.slotEnd} onChange={(e) => patchStep(step.id, { slotEnd: e.target.value })} />
                  </label>
                </div>
              </div>
            ))}
          </section>
          <section className="as-card">
            <h2>Équipe et transport</h2>
            <div className="as-mode">
              <button type="button" className={`as-mode__btn${transportMode === "internal" ? " is-on" : ""}`} onClick={() => setTransportMode("internal")}>
                <strong>Transport interne</strong>
                <span>Équipe et véhicule ONLOUTOU</span>
              </button>
              <button type="button" className={`as-mode__btn${transportMode === "partner" ? " is-on" : ""}`} onClick={() => setTransportMode("partner")}>
                <strong>Transporteur partenaire</strong>
                <span>Prestataire externe</span>
              </button>
            </div>
            <div className="as-form-grid">
              <label>
                Livreur
                <input value={driverLabel} onChange={(e) => setDriverLabel(e.target.value)} placeholder="À affecter" />
              </label>
              <label>
                Véhicule
                <input value={vehicleLabel} onChange={(e) => setVehicleLabel(e.target.value)} placeholder="À affecter" />
              </label>
              <label>
                Manutention
                <input value={handling} onChange={(e) => setHandling(e.target.value)} placeholder="À préciser" />
              </label>
            </div>
            <p className="as-note">Volume utile et charge utile à vérifier.</p>
          </section>
          <section className="as-card">
            <h2>Reprise chez le client</h2>
            <div className="as-form-grid">
              <label>
                Date
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </label>
              <label>
                Créneau
                <input value={returnSlot} onChange={(e) => setReturnSlot(e.target.value)} />
              </label>
            </div>
            <p className="as-note">Mission de reprise séparée à planifier.</p>
          </section>
        </div>
        <aside style={{ display: "grid", gap: "0.85rem" }}>
          <section className="as-card as-side">
            <h2>Synthèse opérationnelle</h2>
            <div className="as-sel-list">
              {selection.map((row) => (
                <div className="as-sel-item" key={String(row.productId)}>
                  {typeof row.imageUrl === "string" ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{String(row.title)}</strong>
                    <small>
                      {String(row.ownerName)} · {row.ownerKind === "onloutou" ? "Dépôt / parc" : "Chez le partenaire"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <ul className="as-todo as-todo--done" style={{ marginTop: "0.75rem" }}>
              {hasPartner ? <li className="is-done">Collecte partenaire</li> : null}
              {includeDepot ? <li className="is-done">Regroupement dépôt</li> : <li>Livraison directe (sans dépôt)</li>}
              <li className="is-done">Livraison client</li>
            </ul>
            <label>
              Note interne (logistique)
              <textarea className="as-field" rows={4} value={planNote} onChange={(e) => setPlanNote(e.target.value)} />
            </label>
          </section>
          <section className="as-card as-side">
            <h2>Éléments restant à compléter</h2>
            {missing.length === 0 ? (
              <p className="as-note">Planification complète. Vous pouvez créer les missions.</p>
            ) : (
              <ul className="as-todo">
                {missing.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
      <div className="as-wiz-foot">
        <button type="button" className="as-btn" onClick={onBackToDossier}>
          Retour au dossier
        </button>
        <div className="as-head__actions">
          <button type="button" className="as-btn" disabled={pending} onClick={() => void savePlan(false)}>
            Enregistrer le brouillon
          </button>
          <button
            type="button"
            className="as-btn as-btn--yellow"
            disabled={pending || (!missionsCreated && !planReady)}
            onClick={() => (missionsCreated ? onView("prepare") : void savePlan(true))}
          >
            {missionsCreated ? "Continuer vers la préparation" : "Créer les missions"}
          </button>
        </div>
      </div>
    </div>
  );
}
