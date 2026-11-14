import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import type {
  AuthorizeDepartureInput,
  RecordPartnerCollectInput,
  SaveArticlePrepInput,
  SaveArrivalControlInput,
  SaveLogisticsPlanInput,
  SavePartnerRestitutionInput,
  SaveReceiptProofInput,
  SaveRefusalInput,
  SaveReturnDepotInput,
  SaveReturnPickupInput,
  SaveReturnPlanInput,
} from "./schemas.js";
import { getRequestDetail } from "./service.js";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

async function loadRequest(id: string) {
  return prisma.serviceRequest.findUnique({ where: { id } });
}

function requireConfirmed(payload: Record<string, unknown>) {
  const rental = asRecord(payload.rental);
  return rental.status === "confirmed" || rental.reserved === true || payload.reserved === true;
}

function selectionItems(payload: Record<string, unknown>) {
  const items = Array.isArray(asRecord(payload.selection).items) ? (asRecord(payload.selection).items as unknown[]) : [];
  return items.map((row) => asRecord(row)).filter((row) => typeof row.productId === "string");
}

function pushLogisticsActivity(logistics: Record<string, unknown>, label: string, actorId: string) {
  const previous = Array.isArray(logistics.activity) ? [...logistics.activity] : [];
  previous.unshift({ at: new Date().toISOString(), label, actorId });
  return previous.slice(0, 40);
}

function planComplete(plan: Record<string, unknown>) {
  const steps = Array.isArray(plan.steps) ? plan.steps.map((row) => asRecord(row)) : [];
  const stepsOk = steps.every((step) => {
    if (step.kind === "depot") return Boolean(step.date);
    return Boolean(String(step.address ?? "").trim() && String(step.contact ?? "").trim() && step.date);
  });
  const teamOk = Boolean(String(plan.driverLabel ?? "").trim() && String(plan.vehicleLabel ?? "").trim());
  return stepsOk && teamOk;
}

export async function saveLogisticsPlan(
  requestId: string,
  input: SaveLogisticsPlanInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireConfirmed(payload)) {
    return { ok: false as const, error: "Confirmez d’abord la location avant d’organiser la livraison." };
  }

  const previous = asRecord(payload.logistics);
  const createMissions = Boolean(input.createMissions);
  const draftPlan = {
    includeDepot: input.includeDepot ?? Boolean(asRecord(previous.plan).includeDepot),
    steps: input.steps,
    transportMode: input.transportMode ?? "internal",
    driverLabel: input.driverLabel?.trim() || "",
    vehicleLabel: input.vehicleLabel?.trim() || "",
    handling: input.handling?.trim() || "",
    returnDate: input.returnDate || "",
    returnSlot: input.returnSlot?.trim() || "À convenir",
    note: input.note?.trim() || "",
    savedAt: new Date().toISOString(),
  };

  if (createMissions && !planComplete(draftPlan)) {
    return {
      ok: false as const,
      error: "Complétez adresses, contacts, créneaux, livreur et véhicule avant de créer les missions.",
    };
  }

  const plan = {
    ...draftPlan,
    missionsCreated: createMissions || Boolean(asRecord(previous.plan).missionsCreated),
    missionsCreatedAt: createMissions ? new Date().toISOString() : asRecord(previous.plan).missionsCreatedAt ?? null,
  };

  const logistics = {
    ...previous,
    status: plan.missionsCreated ? "planned" : "planning",
    plan,
    activity: pushLogisticsActivity(
      previous,
      createMissions ? "Missions de livraison créées" : "Brouillon de planification enregistré",
      actorId,
    ),
  };

  const rental = asRecord(payload.rental);
  const tasks = Array.isArray(rental.tasks)
    ? rental.tasks.map((row) => {
        const task = asRecord(row);
        if (task.id === "delivery" && plan.missionsCreated) return { ...task, status: "done" };
        return task;
      })
    : rental.tasks;

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        logistics,
        rental: { ...rental, tasks },
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: createMissions
            ? "Missions de livraison créées. La planification ne vaut pas autorisation de remise."
            : "Brouillon de planification livraison enregistré. La planification ne vaut pas autorisation de remise.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: createMissions ? "LOGISTICS_MISSIONS_CREATED" : "LOGISTICS_PLAN_SAVED", includeDepot: plan.includeDepot },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveArticlePreparation(
  requestId: string,
  input: SaveArticlePrepInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireConfirmed(payload)) {
    return { ok: false as const, error: "Confirmez d’abord la location." };
  }
  const previous = asRecord(payload.logistics);
  const prep = asRecord(previous.preparation);
  const items = Array.isArray(prep.items) ? prep.items.map((row) => asRecord(row)) : [];
  const existing = items.find((row) => row.productId === input.productId) ?? { productId: input.productId };
  const nextItem = {
    ...existing,
    productId: input.productId,
    identity: input.identity ?? existing.identity ?? "unchecked",
    cleaning: input.cleaning ?? existing.cleaning ?? "unchecked",
    functionTest: input.functionTest ?? existing.functionTest ?? "unchecked",
    accessories: input.accessories ?? existing.accessories ?? "unchecked",
    protection: input.protection ?? existing.protection ?? "unchecked",
    observation: input.observation ?? existing.observation ?? "",
    accessoryList: input.accessoryList ?? existing.accessoryList ?? [],
    ready: Boolean(input.declareReady) || Boolean(existing.ready),
    updatedAt: new Date().toISOString(),
  };
  const nextItems = [...items.filter((row) => row.productId !== input.productId), nextItem];
  const logistics = {
    ...previous,
    status: previous.status === "planning" ? "preparing" : previous.status || "preparing",
    preparation: { items: nextItems, updatedAt: new Date().toISOString() },
    activity: pushLogisticsActivity(
      previous,
      input.declareReady ? `Article prêt · ${input.productId}` : `Contrôle article enregistré · ${input.productId}`,
      actorId,
    ),
  };

  const rental = asRecord(payload.rental);
  const allReady = selectionItems(payload)
    .filter((row) => row.ownerKind === "onloutou")
    .every((row) => nextItems.some((item) => item.productId === row.productId && item.ready));
  const tasks = Array.isArray(rental.tasks)
    ? rental.tasks.map((row) => {
        const task = asRecord(row);
        if (task.id === "park" && allReady) return { ...task, status: "done" };
        return task;
      })
    : rental.tasks;

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics, rental: { ...rental, tasks } } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: input.declareReady
            ? "Préparation article déclarée prête. Cela n’autorise pas la remise au client."
            : "Contrôle de préparation article enregistré. Cela n’autorise pas la remise au client.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "ARTICLE_PREP_SAVED", productId: input.productId, ready: nextItem.ready },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function recordPartnerCollection(
  requestId: string,
  input: RecordPartnerCollectInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireConfirmed(payload)) {
    return { ok: false as const, error: "Confirmez d’abord la location." };
  }
  const item = selectionItems(payload).find((row) => row.productId === input.productId);
  if (!item) return { ok: false as const, error: "Article introuvable dans la sélection." };
  if (item.ownerKind === "onloutou") {
    return { ok: false as const, error: "La collecte partenaire concerne un article partenaire." };
  }
  if (!input.partnerConfirmName?.trim() || !input.collectorConfirmName?.trim()) {
    return { ok: false as const, error: "Recueillez la confirmation du partenaire et du collecteur." };
  }

  const previous = asRecord(payload.logistics);
  const collections = Array.isArray(previous.collections) ? previous.collections.map((row) => asRecord(row)) : [];
  const entry = {
    productId: input.productId,
    title: item.title,
    reference: item.reference ?? null,
    ownerName: item.ownerName,
    functioning: input.functioning ?? "ok",
    exterior: input.exterior ?? "ok",
    accessories: input.accessories ?? "ok",
    observation: input.observation?.trim() || "Aucun écart constaté",
    partnerConfirmName: input.partnerConfirmName.trim(),
    collectorConfirmName: input.collectorConfirmName.trim(),
    collectedAt: input.collectedAt || new Date().toISOString().slice(0, 10),
    collectedTime: input.collectedTime || new Date().toISOString().slice(11, 16),
    recorded: true,
    recordedAt: new Date().toISOString(),
  };
  const nextCollections = [...collections.filter((row) => row.productId !== input.productId), entry];
  const logistics = {
    ...previous,
    status: "collecting",
    collections: nextCollections,
    activity: pushLogisticsActivity(previous, `Collecte enregistrée · ${String(item.reference || item.title)}`, actorId),
  };

  const rental = asRecord(payload.rental);
  const partnerItems = selectionItems(payload).filter((row) => row.ownerKind !== "onloutou");
  const allCollected = partnerItems.every((row) => nextCollections.some((c) => c.productId === row.productId && c.recorded));
  const tasks = Array.isArray(rental.tasks)
    ? rental.tasks.map((row) => {
        const task = asRecord(row);
        if (task.id === "partner" && allCollected) return { ...task, status: "done" };
        return task;
      })
    : rental.tasks;

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics, rental: { ...rental, tasks } } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Collecte partenaire enregistrée pour ${String(item.title)}. Article pris en charge par ONLOUTOU. Aucun reversement déclenché.`,
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "PARTNER_COLLECT_RECORDED", productId: input.productId, payoutTriggered: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function authorizeDeparture(
  requestId: string,
  input: AuthorizeDepartureInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireConfirmed(payload)) {
    return { ok: false as const, error: "Confirmez d’abord la location." };
  }
  const logisticsPrev = asRecord(payload.logistics);
  const plan = asRecord(logisticsPrev.plan);
  if (!plan.missionsCreated) {
    return { ok: false as const, error: "Créez d’abord les missions de livraison." };
  }

  const items = selectionItems(payload);
  const prepItems = Array.isArray(asRecord(logisticsPrev.preparation).items)
    ? (asRecord(logisticsPrev.preparation).items as unknown[]).map((row) => asRecord(row))
    : [];
  const onlItems = items.filter((row) => row.ownerKind === "onloutou");
  const partnerItems = items.filter((row) => row.ownerKind !== "onloutou");
  const prepOk = onlItems.every((row) => prepItems.some((item) => item.productId === row.productId && item.ready));
  const collections = Array.isArray(logisticsPrev.collections)
    ? logisticsPrev.collections.map((row) => asRecord(row))
    : [];
  const collectOk = partnerItems.every((row) => collections.some((c) => c.productId === row.productId && c.recorded));

  if (onlItems.length && !prepOk) {
    return { ok: false as const, error: "Déclarez prêts les articles ONLOUTOU avant le départ." };
  }
  if (partnerItems.length && !collectOk) {
    return { ok: false as const, error: "Enregistrez la collecte partenaire avant le départ." };
  }

  const payment = asRecord(payload.payment);
  const initial = asRecord(payment.initial);
  const balance = asRecord(payment.balance);
  const deposit = asRecord(payment.deposit);
  const balanceVerified = input.balanceVerified ?? Boolean(balance.verified);
  const depositVerified = input.depositVerified ?? Boolean(deposit.verified);
  if (!initial.verified) {
    return { ok: false as const, error: "Le paiement initial doit être vérifié." };
  }
  if (!balanceVerified || !depositVerified) {
    return { ok: false as const, error: "Vérifiez le solde et le dépôt de garantie avant d’autoriser le départ." };
  }

  const logistics = {
    ...logisticsPrev,
    status: "departed",
    departure: {
      authorized: true,
      authorizedAt: new Date().toISOString(),
      note: input.note?.trim() || null,
      checks: {
        identities: true,
        photos: true,
        protection: true,
        addressContact: true,
        teamVehicle: true,
      },
    },
    activity: pushLogisticsActivity(logisticsPrev, "Départ autorisé", actorId),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        logistics,
        payment: {
          ...payment,
          balance: { ...balance, verified: true, verifiedAt: new Date().toISOString() },
          deposit: { ...deposit, verified: true, verifiedAt: new Date().toISOString() },
        },
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: "Départ autorisé. Cela ne confirme pas la livraison ni la réception chez le client.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "DEPARTURE_AUTHORIZED", deliveryConfirmed: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

function requireDeparted(logistics: Record<string, unknown>) {
  return asRecord(logistics.departure).authorized === true;
}

export async function saveArrivalControl(
  requestId: string,
  input: SaveArrivalControlInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireConfirmed(payload)) {
    return { ok: false as const, error: "Confirmez d’abord la location." };
  }
  const logisticsPrev = asRecord(payload.logistics);
  if (!requireDeparted(logisticsPrev)) {
    return { ok: false as const, error: "Autorisez d’abord le départ avant le contrôle à l’arrivée." };
  }

  const selection = selectionItems(payload);
  const items = input.items.map((row) => {
    const selected = selection.find((item) => item.productId === row.productId);
    return {
      productId: row.productId,
      title: String(selected?.title ?? ""),
      reference: String(selected?.reference ?? ""),
      ownerName: String(selected?.ownerName ?? ""),
      ownerKind: String(selected?.ownerKind ?? ""),
      expectedQty: Number(selected?.quantity ?? 1) || 1,
      presentedQty: row.presentedQty,
      acceptedQty: row.acceptedQty,
      status: row.status,
      observation: row.observation?.trim() || "",
    };
  });

  const acceptedCount = items.filter((row) => row.status === "accepted" && row.acceptedQty > 0).length;
  const refusedCount = items.filter((row) => row.status === "refused" || row.status === "reserve").length;
  const readyForProof = Boolean(input.readyForProof) && acceptedCount > 0;

  const arrival = {
    ...asRecord(asRecord(logisticsPrev.handover).arrival),
    arrivedAt: new Date().toISOString(),
    arrivedTime: input.arrivedTime?.trim() || "11:35",
    recipientName: input.recipientName?.trim() || "",
    recipientRole: input.recipientRole?.trim() || "Représentant du client",
    recipientContact: input.recipientContact?.trim() || "",
    checks: {
      identity: Boolean(input.identityChecked),
      quantities: Boolean(input.quantitiesChecked),
      accessories: Boolean(input.accessoriesChecked),
      stateCompared: Boolean(input.stateCompared),
      instructions: Boolean(input.instructionsGiven),
    },
    functioning: input.functioning ?? "not_tested",
    note: input.note?.trim() || "",
    items,
    acceptedCount,
    refusedCount,
    readyForProof,
    savedAt: new Date().toISOString(),
  };

  const handoverPrev = asRecord(logisticsPrev.handover);
  const logistics = {
    ...logisticsPrev,
    status: readyForProof ? "arrival_checked" : "on_site",
    handover: {
      ...handoverPrev,
      arrival,
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      readyForProof ? "Contrôle à l’arrivée prêt pour preuve de réception" : "Contrôle à l’arrivée enregistré",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: "Contrôle à l’arrivée enregistré. L’arrivée sur place ne confirme pas la remise des articles.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "ARRIVAL_CONTROL_SAVED", acceptedCount, refusedCount, handoverConfirmed: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveReceiptProof(
  requestId: string,
  input: SaveReceiptProofInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const logisticsPrev = asRecord(payload.logistics);
  if (!requireDeparted(logisticsPrev)) {
    return { ok: false as const, error: "Autorisez d’abord le départ." };
  }
  const handoverPrev = asRecord(logisticsPrev.handover);
  const arrival = asRecord(handoverPrev.arrival);
  const arrivalItems = Array.isArray(arrival.items) ? arrival.items.map((row) => asRecord(row)) : [];
  const acceptedItems = arrivalItems.filter((row) => row.status === "accepted" && Number(row.acceptedQty ?? 0) > 0);
  if (!acceptedItems.length) {
    return { ok: false as const, error: "Aucun article accepté : enregistrez d’abord le contrôle à l’arrivée." };
  }

  const recordHandover = Boolean(input.recordHandover);
  const recipientConfirmed = Boolean(input.recipientConfirmed);
  const recipientSigned = Boolean(input.recipientSigned);
  if (recordHandover && !(recipientConfirmed && recipientSigned)) {
    return {
      ok: false as const,
      error: "La preuve de réception du client est requise avant d’enregistrer la remise.",
    };
  }

  const proof = {
    ...asRecord(handoverPrev.proof),
    deliveryNoteId: String(asRecord(handoverPrev.proof).deliveryNoteId || `BL-${String(request.reference).slice(-3)}`),
    confirmMode: input.confirmMode ?? "device",
    recipientName: input.recipientName?.trim() || String(arrival.recipientName ?? ""),
    recipientRole: input.recipientRole?.trim() || String(arrival.recipientRole ?? "Représentant du client"),
    recipientConfirmed,
    recipientSigned,
    note: input.note?.trim() || "",
    draft: Boolean(input.draft) && !recordHandover,
    savedAt: new Date().toISOString(),
  };

  const handedOverAt = recordHandover ? new Date().toISOString() : asRecord(handoverPrev.proof).handedOverAt ?? null;
  const logistics = {
    ...logisticsPrev,
    status: recordHandover ? "handed_over" : "proof_pending",
    handover: {
      ...handoverPrev,
      proof: {
        ...proof,
        handedOver: recordHandover || Boolean(asRecord(handoverPrev.proof).handedOver),
        handedOverAt,
      },
      active:
        recordHandover || asRecord(handoverPrev.active).started
          ? {
              started: true,
              startedAt: String(asRecord(handoverPrev.active).startedAt || handedOverAt || new Date().toISOString()),
              returnPrepared: false,
            }
          : handoverPrev.active ?? null,
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      recordHandover
        ? "Remise enregistrée — location en cours"
        : input.draft
          ? "Brouillon de preuve de réception enregistré"
          : "Preuve de réception mise à jour",
      actorId,
    ),
  };

  const rental = asRecord(payload.rental);
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        logistics,
        rental: recordHandover
          ? {
              ...rental,
              status: "active",
              handedOverAt,
              tasks: Array.isArray(rental.tasks)
                ? rental.tasks.map((row) => {
                    const task = asRecord(row);
                    if (String(task.id) === "handover" || String(task.label).toLowerCase().includes("remise")) {
                      return { ...task, done: true, doneAt: handedOverAt };
                    }
                    return task;
                  })
                : rental.tasks,
            }
          : rental,
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: recordHandover
            ? "Remise enregistrée. Aucun reversement ni restitution du dépôt n’est déclenché ici. Location en cours."
            : "Preuve de réception enregistrée (brouillon ou confirmation partielle).",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: {
      event: recordHandover ? "HANDOVER_RECORDED" : "RECEIPT_PROOF_SAVED",
      payoutTriggered: false,
      depositRefundTriggered: false,
    },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveRefusalReport(
  requestId: string,
  input: SaveRefusalInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const logisticsPrev = asRecord(payload.logistics);
  if (!requireDeparted(logisticsPrev)) {
    return { ok: false as const, error: "Autorisez d’abord le départ." };
  }

  const selection = selectionItems(payload);
  const selected = selection.find((row) => row.productId === input.productId);
  if (!selected) return { ok: false as const, error: "Article introuvable dans la sélection." };

  const handoverPrev = asRecord(logisticsPrev.handover);
  const arrivalPrev = asRecord(handoverPrev.arrival);
  const arrivalItems = Array.isArray(arrivalPrev.items)
    ? arrivalPrev.items.map((row) => asRecord(row))
    : selection.map((row) => ({
        productId: row.productId,
        title: row.title,
        reference: row.reference,
        ownerName: row.ownerName,
        ownerKind: row.ownerKind,
        expectedQty: Number(row.quantity ?? 1) || 1,
        presentedQty: Number(row.quantity ?? 1) || 1,
        acceptedQty: Number(row.quantity ?? 1) || 1,
        status: "accepted",
        observation: "",
      }));

  const nextArrivalItems = arrivalItems.map((row) =>
    row.productId === input.productId
      ? {
          ...row,
          status: "refused",
          acceptedQty: 0,
          observation: input.description?.trim() || String(row.observation ?? ""),
        }
      : row,
  );

  const refusalRow = {
    productId: input.productId,
    title: String(selected.title ?? ""),
    reference: String(selected.reference ?? ""),
    ownerName: String(selected.ownerName ?? ""),
    type: input.type ?? "damage",
    description: input.description?.trim() || "",
    responsibility: input.responsibility ?? "to_determine",
    nextDecision: input.nextDecision ?? "replace",
    assigneeLabel: input.assigneeLabel?.trim() || "Responsable dossier",
    holder: "Équipe transport ONLOUTOU",
    destination: "Retour au dépôt ONLOUTOU · Marcory",
    stockBlocked: true,
    savedAt: new Date().toISOString(),
  };

  const previousRefusals = Array.isArray(handoverPrev.refusals)
    ? handoverPrev.refusals.map((row) => asRecord(row)).filter((row) => row.productId !== input.productId)
    : [];

  const acceptedCount = nextArrivalItems.filter((row) => row.status === "accepted" && Number(row.acceptedQty ?? 0) > 0)
    .length;
  const preparePartialProof = Boolean(input.preparePartialProof) && acceptedCount > 0;

  const logistics = {
    ...logisticsPrev,
    status: preparePartialProof ? "arrival_checked" : "partial_issue",
    handover: {
      ...handoverPrev,
      arrival: {
        ...arrivalPrev,
        items: nextArrivalItems,
        acceptedCount,
        refusedCount: nextArrivalItems.filter((row) => row.status === "refused" || row.status === "reserve").length,
        readyForProof: preparePartialProof || Boolean(arrivalPrev.readyForProof),
        savedAt: new Date().toISOString(),
      },
      refusals: [...previousRefusals, refusalRow],
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      preparePartialProof
        ? `Réserve/refus enregistré — preuve partielle à préparer (${String(selected.reference || selected.title)})`
        : `Réserve ou refus signalé (${String(selected.reference || selected.title)})`,
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Réserve ou refus consignés pour ${String(selected.title)}. Article bloqué pour contrôle. Aucun remboursement automatique.`,
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: {
      event: "REFUSAL_REPORTED",
      productId: input.productId,
      stockAutoReleased: false,
      refundTriggered: false,
    },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

function requireHandedOver(payload: Record<string, unknown>) {
  const logistics = asRecord(payload.logistics);
  const proof = asRecord(asRecord(logistics.handover).proof);
  const rental = asRecord(payload.rental);
  return proof.handedOver === true || rental.status === "active";
}

export async function saveReturnPlan(
  requestId: string,
  input: SaveReturnPlanInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!requireHandedOver(payload)) {
    return { ok: false as const, error: "Enregistrez d’abord la remise avant d’organiser la reprise." };
  }

  const logisticsPrev = asRecord(payload.logistics);
  const returnPrev = asRecord(logisticsPrev.returnFlow);
  const planPrev = asRecord(returnPrev.plan);
  const createMission = Boolean(input.createMission);
  const draft = {
    date: input.date || String(asRecord(logisticsPrev.plan).returnDate || ""),
    slotStart: input.slotStart?.trim() || "09:00",
    slotEnd: input.slotEnd?.trim() || "11:00",
    address: input.address?.trim() || "",
    contact: input.contact?.trim() || "",
    driverLabel: input.driverLabel?.trim() || "",
    vehicleLabel: input.vehicleLabel?.trim() || "",
    note: input.note?.trim() || "",
    savedAt: new Date().toISOString(),
  };

  if (createMission && !(draft.date && draft.address && draft.contact && draft.driverLabel && draft.vehicleLabel)) {
    return {
      ok: false as const,
      error: "Complétez date, adresse, contact, livreur et véhicule avant de créer la mission de reprise.",
    };
  }

  const plan = {
    ...draft,
    missionsCreated: createMission || Boolean(planPrev.missionsCreated),
    missionsCreatedAt: createMission ? new Date().toISOString() : planPrev.missionsCreatedAt ?? null,
    missionId: String(planPrev.missionId || `REP-${String(request.reference).slice(-3)}`),
  };

  const logistics = {
    ...logisticsPrev,
    status: plan.missionsCreated ? "return_planned" : logisticsPrev.status,
    returnFlow: {
      ...returnPrev,
      plan,
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      createMission ? "Mission de reprise créée" : "Brouillon de reprise enregistré",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: createMission
            ? "Mission de reprise créée. La reprise chez le client reste à constater."
            : "Brouillon d’organisation de reprise enregistré.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: createMission ? "RETURN_MISSION_CREATED" : "RETURN_PLAN_SAVED" },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveReturnPickup(
  requestId: string,
  input: SaveReturnPickupInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const logisticsPrev = asRecord(payload.logistics);
  const returnPrev = asRecord(logisticsPrev.returnFlow);
  const plan = asRecord(returnPrev.plan);
  if (!plan.missionsCreated) {
    return { ok: false as const, error: "Créez d’abord la mission de reprise." };
  }

  const selection = selectionItems(payload);
  const items = input.items.map((row) => {
    const selected = selection.find((item) => item.productId === row.productId);
    return {
      productId: row.productId,
      title: String(selected?.title ?? ""),
      reference: String(selected?.reference ?? ""),
      ownerName: String(selected?.ownerName ?? ""),
      ownerKind: String(selected?.ownerKind ?? ""),
      qty: row.qty,
      accessoriesOk: Boolean(row.accessoriesOk),
      status: row.status,
      observation: row.observation?.trim() || "",
    };
  });

  const recordPickup = Boolean(input.recordPickup);
  if (recordPickup && !(input.clientConfirmName?.trim() && input.collectorConfirmName?.trim())) {
    return { ok: false as const, error: "Recueillez les confirmations client et collecteur." };
  }

  const pickup = {
    ...asRecord(returnPrev.pickup),
    arrivedTime: input.arrivedTime?.trim() || "10:20",
    clientConfirmName: input.clientConfirmName?.trim() || "",
    collectorConfirmName: input.collectorConfirmName?.trim() || "",
    note: input.note?.trim() || "",
    items,
    recorded: recordPickup || Boolean(asRecord(returnPrev.pickup).recorded),
    recordedAt: recordPickup ? new Date().toISOString() : asRecord(returnPrev.pickup).recordedAt ?? null,
    receiptId: String(asRecord(returnPrev.pickup).receiptId || `BR-${String(request.reference).slice(-3)}`),
  };

  const logistics = {
    ...logisticsPrev,
    status: pickup.recorded ? "return_picked" : logisticsPrev.status,
    returnFlow: {
      ...returnPrev,
      pickup,
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      pickup.recorded ? "Reprise constatée chez le client — retour vers le dépôt" : "Constat de reprise enregistré",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: pickup.recorded
            ? "Reprise constatée. Articles en transit vers le dépôt pour contrôle."
            : "Brouillon de constat de reprise enregistré.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: pickup.recorded ? "RETURN_PICKUP_RECORDED" : "RETURN_PICKUP_SAVED" },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveReturnDepotControl(
  requestId: string,
  input: SaveReturnDepotInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const logisticsPrev = asRecord(payload.logistics);
  const returnPrev = asRecord(logisticsPrev.returnFlow);
  if (!asRecord(returnPrev.pickup).recorded) {
    return { ok: false as const, error: "Constatez d’abord la reprise chez le client." };
  }

  const selection = selectionItems(payload);
  const selected = selection.find((row) => row.productId === input.productId);
  if (!selected) return { ok: false as const, error: "Article introuvable." };

  const depotPrev = asRecord(returnPrev.depot);
  const previousItems = Array.isArray(depotPrev.items)
    ? depotPrev.items.map((row) => asRecord(row)).filter((row) => row.productId !== input.productId)
    : [];

  const checks = {
    identity: input.identity ?? "unchecked",
    accessories: input.accessories ?? "unchecked",
    exterior: input.exterior ?? "unchecked",
    cleaning: input.cleaning ?? "unchecked",
    functionTest: input.functionTest ?? "unchecked",
  };
  const readyToValidate =
    checks.identity === "ok" &&
    checks.accessories === "ok" &&
    checks.exterior === "ok" &&
    checks.cleaning === "ok" &&
    checks.functionTest === "ok";
  const validated = Boolean(input.validateCompliant) && readyToValidate;
  const ownerKind = String(selected.ownerKind ?? "");
  const stockDecision = validated
    ? ownerKind === "onloutou"
      ? "available_depot"
      : "awaiting_partner_return"
    : "blocked_control";

  const itemRow = {
    productId: input.productId,
    title: String(selected.title ?? ""),
    reference: String(selected.reference ?? ""),
    ownerName: String(selected.ownerName ?? ""),
    ownerKind,
    ...checks,
    observation: input.observation?.trim() || "",
    validated,
    validatedAt: validated ? new Date().toISOString() : null,
    stockDecision,
    savedAt: new Date().toISOString(),
  };

  const items = [...previousItems, itemRow];
  const allSelectionIds = selection.map((row) => String(row.productId));
  const allValidated = allSelectionIds.every((id) => items.some((row) => row.productId === id && row.validated));
  const partnerPending = items.some(
    (row) => row.ownerKind !== "onloutou" && row.validated && row.stockDecision === "awaiting_partner_return",
  );

  const depot = {
    ...depotPrev,
    receivedAt: depotPrev.receivedAt || new Date().toISOString(),
    receivedTime: String(depotPrev.receivedTime || "10:20"),
    receiverLabel: String(depotPrev.receiverLabel || "Équipe parc ONLOUTOU"),
    receiptId: String(depotPrev.receiptId || asRecord(returnPrev.pickup).receiptId || `BR-${String(request.reference).slice(-3)}`),
    items,
    allValidated,
  };

  const logistics = {
    ...logisticsPrev,
    status: allValidated ? (partnerPending ? "return_depot_done" : "return_closed") : "return_depot",
    returnFlow: {
      ...returnPrev,
      depot,
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      validated
        ? `Contrôle dépôt validé — ${String(selected.reference || selected.title)}`
        : `Contrôle dépôt enregistré — ${String(selected.reference || selected.title)}`,
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: validated
            ? ownerKind === "onloutou"
              ? `Article ONLOUTOU ${String(selected.reference || selected.title)} validé conforme — reste au dépôt. Aucun mouvement financier automatique.`
              : `Article partenaire ${String(selected.reference || selected.title)} validé — restitution partenaire à enregistrer. Aucun reversement automatique.`
            : `Contrôle dépôt enregistré pour ${String(selected.reference || selected.title)}.`,
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: {
      event: validated ? "RETURN_DEPOT_VALIDATED" : "RETURN_DEPOT_SAVED",
      productId: input.productId,
      stockDecision,
      payoutTriggered: false,
      depositDecision: "pending",
    },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function savePartnerRestitution(
  requestId: string,
  input: SavePartnerRestitutionInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const logisticsPrev = asRecord(payload.logistics);
  const returnPrev = asRecord(logisticsPrev.returnFlow);
  const depotRaw = asRecord(returnPrev.depot).items;
  const depotItems = Array.isArray(depotRaw) ? depotRaw.map((row: unknown) => asRecord(row)) : [];
  const depotItem = depotItems.find((row: Record<string, unknown>) => row.productId === input.productId);
  if (!depotItem || !depotItem.validated || depotItem.ownerKind === "onloutou") {
    return {
      ok: false as const,
      error: "Seuls les articles partenaires validés au dépôt peuvent être restitués.",
    };
  }

  const recordRestitution = Boolean(input.recordRestitution);
  if (recordRestitution && !(input.partnerConfirmName?.trim() && input.transportConfirmName?.trim())) {
    return { ok: false as const, error: "Recueillez les confirmations partenaire et transport." };
  }

  const restitutionPrev = asRecord(returnPrev.partnerRestitution);
  const restRaw = restitutionPrev.items;
  const previousItems = Array.isArray(restRaw)
    ? restRaw.map((row: unknown) => asRecord(row)).filter((row: Record<string, unknown>) => row.productId !== input.productId)
    : [];
  const itemRow = {
    productId: input.productId,
    title: String(depotItem.title ?? ""),
    reference: String(depotItem.reference ?? ""),
    ownerName: String(depotItem.ownerName ?? ""),
    restitutedAt: input.restitutedAt || new Date().toISOString().slice(0, 10),
    restitutedTime: input.restitutedTime?.trim() || "10:15",
    partnerConfirmName: input.partnerConfirmName?.trim() || "",
    transportConfirmName: input.transportConfirmName?.trim() || "",
    note: input.note?.trim() || "Aucun écart signalé.",
    recorded: recordRestitution,
    recordedAt: recordRestitution ? new Date().toISOString() : null,
    documentId: String(asRecord(restitutionPrev).documentId || `BST-${String(request.reference).slice(-3)}`),
    availability: "partner_to_confirm",
  };
  const items = [...previousItems, itemRow];
  const partnerValidated = depotItems.filter(
    (row: Record<string, unknown>) => row.ownerKind !== "onloutou" && row.validated,
  );
  const allPartnerReturned = partnerValidated.every((row: Record<string, unknown>) =>
    items.some((item) => item.productId === row.productId && item.recorded),
  );

  const logistics = {
    ...logisticsPrev,
    status: allPartnerReturned ? "return_closed" : logisticsPrev.status,
    returnFlow: {
      ...returnPrev,
      partnerRestitution: {
        ...restitutionPrev,
        items,
        missionId: String(restitutionPrev.missionId || `RES-${String(request.reference).slice(-3)}`),
      },
      depot: {
        ...asRecord(returnPrev.depot),
        items: depotItems.map((row: Record<string, unknown>) =>
          row.productId === input.productId && recordRestitution
            ? { ...row, stockDecision: "with_partner", availability: "partner_to_confirm" }
            : row,
        ),
      },
    },
    activity: pushLogisticsActivity(
      logisticsPrev,
      recordRestitution
        ? `Restitution partenaire enregistrée — ${String(depotItem.reference || depotItem.title)}`
        : `Brouillon restitution partenaire — ${String(depotItem.reference || depotItem.title)}`,
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, logistics } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: recordRestitution
            ? `Restitution partenaire enregistrée pour ${String(depotItem.reference || depotItem.title)}. Disponibilité à confirmer par le partenaire. Aucun reversement automatique.`
            : "Brouillon de restitution partenaire enregistré.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: {
      event: recordRestitution ? "PARTNER_RESTITUTION_RECORDED" : "PARTNER_RESTITUTION_SAVED",
      productId: input.productId,
      payoutTriggered: false,
      stockAutoAvailable: false,
    },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}
