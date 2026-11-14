"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { recProducts } from "@/content/reception";
import {
  emptyRecRequest,
  readRecRequest,
  writeRecRequest,
  type RecRequestState,
} from "@/lib/reception-request";

const listeners = new Set<() => void>();
const EMPTY = emptyRecRequest();
let cached = EMPTY;
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  cached = readRecRequest();
  hydrated = true;
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return hydrated ? cached : load();
}

function getServerSnapshot() {
  return EMPTY;
}

function commit(next: RecRequestState) {
  cached = next;
  writeRecRequest(next);
  emit();
}

type MetaPatch = Partial<
  Pick<
    RecRequestState,
    | "zone"
    | "dates"
    | "startDate"
    | "endDate"
    | "query"
    | "usage"
    | "name"
    | "phone"
    | "email"
    | "delivery"
    | "installation"
    | "access"
    | "eventName"
    | "guests"
    | "deliveryAt"
    | "pickupAt"
    | "reference"
  >
>;

type RecRequestApi = {
  state: RecRequestState;
  setMeta: (patch: MetaPatch) => void;
  add: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  quantity: (id: string) => number;
  count: number;
  clearItems: () => void;
  itemsWithProduct: {
    id: string;
    quantity: number;
    title: string;
    aisleId: (typeof recProducts)[number]["aisleId"];
    slug: string;
    image: (typeof recProducts)[number]["image"];
    packSize: number;
    unitKind: (typeof recProducts)[number]["unitKind"];
    unitLabel: string;
    unitBadge: string;
  }[];
};

const RecRequestContext = createContext<RecRequestApi | null>(null);

export function RecRequestProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const api = useMemo<RecRequestApi>(() => {
    const itemsWithProduct = state.items.flatMap((item) => {
      const product = recProducts.find((entry) => entry.id === item.id);
      if (!product) return [];
      return [
        {
          id: item.id,
          quantity: item.quantity,
          title: product.title,
          aisleId: product.aisleId,
          slug: product.slug,
          image: product.image,
          packSize: product.packSize,
          unitKind: product.unitKind,
          unitLabel: product.unitLabel,
          unitBadge: product.unitBadge,
        },
      ];
    });
    return {
      state,
      setMeta: (patch) => commit({ ...cached, ...patch }),
      add: (id, quantity = 1) => {
        const items = cached.items.some((item) => item.id === id)
          ? cached.items.map((item) => (item.id === id ? { ...item, quantity } : item))
          : [...cached.items, { id, quantity }];
        commit({ ...cached, items });
      },
      setQuantity: (id, quantity) => {
        if (quantity < 1) {
          commit({ ...cached, items: cached.items.filter((item) => item.id !== id) });
          return;
        }
        commit({
          ...cached,
          items: cached.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        });
      },
      remove: (id) => commit({ ...cached, items: cached.items.filter((item) => item.id !== id) }),
      has: (id) => cached.items.some((item) => item.id === id),
      quantity: (id) => cached.items.find((item) => item.id === id)?.quantity ?? 0,
      count: itemsWithProduct.reduce((sum, item) => sum + item.quantity, 0),
      clearItems: () => commit({ ...cached, items: [] }),
      itemsWithProduct,
    };
  }, [state]);

  return <RecRequestContext.Provider value={api}>{children}</RecRequestContext.Provider>;
}

export function useRecRequest() {
  const ctx = useContext(RecRequestContext);
  if (!ctx) throw new Error("useRecRequest must be used within RecRequestProvider");
  return ctx;
}
