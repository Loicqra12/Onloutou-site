"use client";

import { useSyncExternalStore } from "react";
import {
  PRD_CONFIRMATION_KEY,
  PRD_DEMO_REFERENCE,
  PRD_REQUEST_KEY,
  catalogById,
  prdCatalog,
  type PrdCatalogItem,
  type PrdUnitKind,
} from "@/content/produits-hub";
import { periodPatch } from "@/lib/family-period";
import { readInfRequest, writeInfRequest } from "@/lib/informatique-request";
import { readRecRequest, writeRecRequest } from "@/lib/reception-request";

export type PrdIntent = "location" | "achat" | "etude";
export type PrdDeliveryMode = "livraison" | "retrait" | "convenir";

export type PrdBasketItem = {
  id: string;
  catalogId?: string;
  family?: PrdCatalogItem["family"];
  familyItemId?: string;
  familyLabel: string;
  title: string;
  quantity: number;
  packSize: number;
  unitKind: PrdUnitKind;
  unitLabel: string;
  photoFile?: string;
  details?: string;
  photoName?: string;
  custom?: boolean;
};

export type PrdBasketState = {
  items: PrdBasketItem[];
  zone: string;
  dates: string;
  startDate: string;
  endDate: string;
  query: string;
  name: string;
  phone: string;
  intent: PrdIntent;
  deliveryMode: PrdDeliveryMode;
  place: string;
  deliveryAt: string;
  pickupAt: string;
  access: string;
  projectLabel: string;
  reference: string;
  referenceKind: "api" | "demo" | "";
};

export type PrdConfirmationSnapshot = {
  reference: string;
  referenceKind: "api" | "demo";
  zone: string;
  startDate: string;
  endDate: string;
  projectLabel: string;
  items: PrdBasketItem[];
  intent: PrdIntent;
  place: string;
};

export const emptyPrdBasket = (): PrdBasketState => ({
  items: [],
  zone: "",
  dates: "",
  startDate: "",
  endDate: "",
  query: "",
  name: "",
  phone: "",
  intent: "location",
  deliveryMode: "livraison",
  place: "",
  deliveryAt: "",
  pickupAt: "",
  access: "",
  projectLabel: "",
  reference: "",
  referenceKind: "",
});

const listeners = new Set<() => void>();

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function emit() {
  for (const listener of listeners) listener();
}

function parseBasket(raw: string | null): PrdBasketState {
  const empty = emptyPrdBasket();
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<PrdBasketState>;
    return {
      ...empty,
      ...parsed,
      items: Array.isArray(parsed.items)
        ? parsed.items.filter((item) => item && typeof item.id === "string" && item.quantity > 0)
        : [],
      intent: parsed.intent === "achat" || parsed.intent === "etude" ? parsed.intent : "location",
      deliveryMode:
        parsed.deliveryMode === "retrait" || parsed.deliveryMode === "convenir"
          ? parsed.deliveryMode
          : "livraison",
      referenceKind: parsed.referenceKind === "api" || parsed.referenceKind === "demo" ? parsed.referenceKind : "",
    };
  } catch {
    return empty;
  }
}

let cached: PrdBasketState | null = null;

export function readPrdBasket(): PrdBasketState {
  if (cached) return cached;
  cached = parseBasket(storage()?.getItem(PRD_REQUEST_KEY) ?? null);
  return cached;
}

export function writePrdBasket(state: PrdBasketState) {
  cached = state;
  storage()?.setItem(PRD_REQUEST_KEY, JSON.stringify(state));
  emit();
}

export function subscribePrdBasket(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePrdBasket() {
  return useSyncExternalStore(subscribePrdBasket, readPrdBasket, emptyPrdBasket);
}

export function patchPrdBasket(patch: Partial<PrdBasketState>) {
  const current = readPrdBasket();
  const next = { ...current, ...patch };
  if (patch.startDate !== undefined || patch.endDate !== undefined) {
    Object.assign(next, periodPatch(next.startDate, next.endDate));
  }
  writePrdBasket(next);
  syncMetaToFamilies(next);
  return next;
}

function itemFromCatalog(product: PrdCatalogItem, quantity: number): PrdBasketItem {
  return {
    id: product.id,
    catalogId: product.id,
    family: product.family,
    familyItemId: product.familyItemId,
    familyLabel: product.familyLabel,
    title: product.title,
    quantity,
    packSize: product.packSize,
    unitKind: product.unitKind,
    unitLabel: product.unitLabel,
    photoFile: undefined,
  };
}

export function addCatalogItem(productId: string, quantity: number) {
  const product = catalogById(productId);
  if (!product || quantity < 1) return readPrdBasket();
  const current = readPrdBasket();
  const existing = current.items.find((item) => item.id === product.id);
  const items = existing
    ? current.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      )
    : [...current.items, itemFromCatalog(product, quantity)];
  const next = maybeLabelProject({ ...current, items });
  writePrdBasket(next);
  upsertFamilyItem(product, next.items.find((item) => item.id === product.id)?.quantity ?? quantity);
  syncMetaToFamilies(next);
  return next;
}

export function setCatalogQuantity(productId: string, quantity: number) {
  const product = catalogById(productId);
  if (!product) return readPrdBasket();
  const current = readPrdBasket();
  const items =
    quantity < 1
      ? current.items.filter((item) => item.id !== productId)
      : current.items.some((item) => item.id === productId)
        ? current.items.map((item) => (item.id === productId ? { ...item, quantity } : item))
        : [...current.items, itemFromCatalog(product, quantity)];
  const next = maybeLabelProject({ ...current, items });
  writePrdBasket(next);
  upsertFamilyItem(product, quantity);
  syncMetaToFamilies(next);
  return next;
}

export function addCustomItem(input: {
  title: string;
  quantity: number;
  details?: string;
  photoName?: string;
}) {
  const title = input.title.trim();
  const quantity = Math.max(1, Math.floor(input.quantity) || 1);
  if (!title) return readPrdBasket();
  const current = readPrdBasket();
  const item: PrdBasketItem = {
    id: `custom-${Date.now()}`,
    familyLabel: "Article décrit",
    title,
    quantity,
    packSize: 1,
    unitKind: "custom",
    unitLabel: "unité",
    details: input.details?.trim() || undefined,
    photoName: input.photoName?.trim() || undefined,
    custom: true,
  };
  const next = { ...current, items: [...current.items, item] };
  writePrdBasket(next);
  return next;
}

export function removePrdItem(id: string) {
  const current = readPrdBasket();
  const removed = current.items.find((item) => item.id === id);
  const next = maybeLabelProject({
    ...current,
    items: current.items.filter((item) => item.id !== id),
  });
  writePrdBasket(next);
  if (removed?.family && removed.familyItemId) {
    upsertFamilyQuantity(removed.family, removed.familyItemId, 0);
  }
  return next;
}

function maybeLabelProject(state: PrdBasketState): PrdBasketState {
  const hasVaisselle = state.items.some((item) => item.family === "reception");
  const hasInfo = state.items.some((item) => item.family === "informatique");
  if (hasVaisselle && hasInfo && state.zone.trim()) {
    return { ...state, projectLabel: `Formation à ${state.zone.trim()}` };
  }
  if (hasVaisselle && hasInfo) {
    return { ...state, projectLabel: state.projectLabel || "Formation" };
  }
  return state;
}

function upsertFamilyItem(product: PrdCatalogItem, quantity: number) {
  upsertFamilyQuantity(product.family, product.familyItemId, quantity);
}

function upsertFamilyQuantity(family: "reception" | "informatique", familyItemId: string, quantity: number) {
  if (family === "reception") {
    const state = readRecRequest();
    const items =
      quantity < 1
        ? state.items.filter((item) => item.id !== familyItemId)
        : state.items.some((item) => item.id === familyItemId)
          ? state.items.map((item) => (item.id === familyItemId ? { ...item, quantity } : item))
          : [...state.items, { id: familyItemId, quantity }];
    writeRecRequest({ ...state, items });
    return;
  }
  const state = readInfRequest();
  const items =
    quantity < 1
      ? state.items.filter((item) => item.id !== familyItemId)
      : state.items.some((item) => item.id === familyItemId)
        ? state.items.map((item) => (item.id === familyItemId ? { ...item, quantity } : item))
        : [...state.items, { id: familyItemId, quantity }];
  writeInfRequest({ ...state, items });
}

function syncMetaToFamilies(state: PrdBasketState) {
  const rec = readRecRequest();
  writeRecRequest({
    ...rec,
    zone: state.zone || rec.zone,
    startDate: state.startDate || rec.startDate,
    endDate: state.endDate || rec.endDate,
    dates: state.dates || rec.dates,
    name: state.name || rec.name,
    phone: state.phone || rec.phone,
    access: state.access || rec.access,
    deliveryAt: state.deliveryAt || rec.deliveryAt,
    pickupAt: state.pickupAt || rec.pickupAt,
  });
  const inf = readInfRequest();
  writeInfRequest({
    ...inf,
    zone: state.zone || inf.zone,
    startDate: state.startDate || inf.startDate,
    endDate: state.endDate || inf.endDate,
    dates: state.dates || inf.dates,
    name: state.name || inf.name,
    phone: state.phone || inf.phone,
  });
}

/** Import des articles déjà présents dans les paniers familles, sans les écraser. */
export function ingestFamilyBaskets() {
  const current = readPrdBasket();
  const rec = readRecRequest();
  const inf = readInfRequest();
  const items = [...current.items];

  const absorb = (familyItemId: string) => {
    const product = prdCatalog.find((entry) => entry.familyItemId === familyItemId);
    if (!product) return;
    if (items.some((item) => item.id === product.id)) return;
    const source = product.family === "reception" ? rec.items : inf.items;
    const found = source.find((item) => item.id === familyItemId);
    if (found && found.quantity > 0) items.push(itemFromCatalog(product, found.quantity));
  };

  for (const item of rec.items) absorb(item.id);
  for (const item of inf.items) absorb(item.id);

  const next = maybeLabelProject({
    ...current,
    items,
    zone: current.zone || rec.zone || inf.zone,
    startDate: current.startDate || rec.startDate || inf.startDate,
    endDate: current.endDate || rec.endDate || inf.endDate,
    dates: current.dates || rec.dates || inf.dates,
    name: current.name || rec.name || inf.name,
    phone: current.phone || rec.phone || inf.phone,
  });
  if (current.startDate || next.startDate) {
    Object.assign(next, periodPatch(next.startDate, next.endDate));
  }
  writePrdBasket(next);
  return next;
}

export function formatPrdLongPeriod(startDate: string, endDate: string): string {
  const start = formatPrdDay(startDate);
  const end = formatPrdDay(endDate);
  if (start && end) {
    if (sameMonthYear(startDate, endDate)) {
      return `Du ${Number(startDate.slice(8, 10))} au ${end}`;
    }
    return `Du ${start} au ${end}`;
  }
  return start || end || "";
}

export function formatPrdEtPeriod(startDate: string, endDate: string): string {
  const start = formatPrdDay(startDate);
  const end = formatPrdDay(endDate);
  if (start && end) {
    if (sameMonthYear(startDate, endDate)) {
      return `${Number(startDate.slice(8, 10))} et ${end}`;
    }
    return `${start} et ${end}`;
  }
  return start || end || "";
}

export function formatPrdShortPeriod(startDate: string, endDate: string): string {
  if (startDate && endDate) {
    if (sameMonthYear(startDate, endDate)) {
      return `${Number(startDate.slice(8, 10))}-${Number(endDate.slice(8, 10))} ${monthName(startDate)}`;
    }
    return `${formatPrdDay(startDate)}-${formatPrdDay(endDate)}`;
  }
  return formatPrdDay(startDate) || formatPrdDay(endDate) || "";
}

export function formatPrdDay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) return "";
  const day = Number(iso.slice(8, 10));
  return `${day} ${monthName(iso)} ${iso.slice(0, 4)}`;
}

function monthName(iso: string): string {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return months[Number(iso.slice(5, 7)) - 1] ?? "";
}

function sameMonthYear(a: string, b: string) {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function formatItemQty(item: PrdBasketItem): string {
  if (item.unitKind === "lot") {
    const lots = `${item.quantity} lot${item.quantity > 1 ? "s" : ""}`;
    return `${lots} de ${item.packSize} ${item.unitLabel}`;
  }
  if (item.unitKind === "custom") {
    return `${item.quantity} unité${item.quantity > 1 ? "s" : ""}`;
  }
  if (item.unitKind === "unit") {
    return `${item.quantity} unité${item.quantity > 1 ? "s" : ""}`;
  }
  return `${item.quantity} ${item.unitLabel}`;
}

export function formatLivePack(item: Pick<PrdBasketItem, "quantity" | "packSize" | "unitLabel" | "unitKind">): string {
  const total = item.quantity * item.packSize;
  return `${total} ${item.unitLabel}`;
}

export function recapVaisselle(items: PrdBasketItem[]): string {
  const row = items.filter((item) => item.family === "reception" && item.catalogId === "assiettes-plates-blanches");
  if (row[0]) return formatItemQty(row[0]);
  const any = items.filter((item) => item.family === "reception");
  return any.map(formatItemQty).join(", ");
}

export function recapInformatique(items: PrdBasketItem[]): string {
  const row = items.filter((item) => item.family === "informatique");
  const ordi = row.find((item) => item.catalogId === "ordinateur-portable") ?? row[0];
  if (!ordi) return "";
  return `${ordi.quantity} ordinateur${ordi.quantity > 1 ? "s" : ""} portable${ordi.quantity > 1 ? "s" : ""}`;
}

export function writeConfirmationSnapshot(snapshot: PrdConfirmationSnapshot) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PRD_CONFIRMATION_KEY, JSON.stringify(snapshot));
}

export function readConfirmationSnapshot(): PrdConfirmationSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PRD_CONFIRMATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PrdConfirmationSnapshot;
  } catch {
    return null;
  }
}

export function demoSnapshotFromBasket(state: PrdBasketState): PrdConfirmationSnapshot {
  return {
    reference: PRD_DEMO_REFERENCE,
    referenceKind: "demo",
    zone: state.zone,
    startDate: state.startDate,
    endDate: state.endDate,
    projectLabel: state.projectLabel,
    items: state.items,
    intent: state.intent,
    place: state.place,
  };
}

export function buildRequestMessage(state: PrdBasketState): string {
  const lines = ["Demande produits :"];
  if (state.projectLabel.trim()) lines.push(state.projectLabel.trim());
  for (const item of state.items) {
    const extra = item.custom && item.details ? ` (${item.details})` : "";
    lines.push(`- ${item.title} · ${formatItemQty(item)}${extra}`);
  }
  if (state.zone.trim()) lines.push(`Commune : ${state.zone.trim()}`);
  const period = formatPrdEtPeriod(state.startDate, state.endDate) || state.dates;
  if (period) lines.push(`Période : ${period}`);
  const intentLabel =
    state.intent === "achat" ? "Achat" : state.intent === "etude" ? "Projet à étudier" : "Location";
  lines.push(`Projet : ${intentLabel}`);
  if (state.deliveryMode === "livraison") lines.push("Remise : livraison");
  if (state.deliveryMode === "retrait") lines.push("Remise : retrait chez le partenaire");
  if (state.deliveryMode === "convenir") lines.push("Remise : à convenir");
  if (state.place.trim()) lines.push(`Lieu : ${state.place.trim()}`);
  if (state.deliveryAt) lines.push(`Livraison souhaitée : ${state.deliveryAt}`);
  if (state.pickupAt) lines.push(`Reprise souhaitée : ${state.pickupAt}`);
  if (state.access.trim()) lines.push(`Accès : ${state.access.trim()}`);
  return lines.join("\n");
}
