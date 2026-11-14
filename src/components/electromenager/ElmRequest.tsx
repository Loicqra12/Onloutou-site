"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { elmProducts } from "@/content/electromenager";
import {
  emptyElmRequest,
  readElmRequest,
  writeElmRequest,
  type ElmRequestState,
} from "@/lib/electromenager-request";

const listeners = new Set<() => void>();
const EMPTY = emptyElmRequest();
let cached = EMPTY;
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  cached = readElmRequest();
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

function commit(next: ElmRequestState) {
  cached = next;
  writeElmRequest(next);
  emit();
}

type MetaPatch = Partial<
  Pick<
    ElmRequestState,
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
    | "formation"
    | "reference"
  >
>;

type ElmRequestApi = {
  state: ElmRequestState;
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
    aisleId: (typeof elmProducts)[number]["aisleId"];
    slug: string;
    image: (typeof elmProducts)[number]["image"];
  }[];
};

const ElmRequestContext = createContext<ElmRequestApi | null>(null);

export function ElmRequestProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const api = useMemo<ElmRequestApi>(() => {
    const itemsWithProduct = state.items.flatMap((item) => {
      const product = elmProducts.find((entry) => entry.id === item.id);
      if (!product) return [];
      return [
        {
          id: item.id,
          quantity: item.quantity,
          title: product.title,
          aisleId: product.aisleId,
          slug: product.slug,
          image: product.image,
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
      has: (id) => state.items.some((item) => item.id === id),
      quantity: (id) => state.items.find((item) => item.id === id)?.quantity ?? 0,
      count: state.items.reduce((sum, item) => sum + item.quantity, 0),
      clearItems: () => commit({ ...cached, items: [] }),
      itemsWithProduct,
    };
  }, [state]);

  return <ElmRequestContext.Provider value={api}>{children}</ElmRequestContext.Provider>;
}

export function useElmRequest() {
  const value = useContext(ElmRequestContext);
  if (!value) throw new Error("useElmRequest must be used within ElmRequestProvider");
  return value;
}