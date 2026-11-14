"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { enfProducts } from "@/content/enfance";
import {
  emptyEnfRequest,
  readEnfRequest,
  writeEnfRequest,
  type EnfRequestState,
} from "@/lib/enfance-request";

const listeners = new Set<() => void>();
const EMPTY = emptyEnfRequest();
let cached = EMPTY;
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  cached = readEnfRequest();
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

function commit(next: EnfRequestState) {
  cached = next;
  writeEnfRequest(next);
  emit();
}

type MetaPatch = Partial<
  Pick<
    EnfRequestState,
    "zone" | "dates" | "startDate" | "endDate" | "query" | "notes" | "name" | "phone" | "email" | "delivery" | "reference"
  >
>;

type EnfRequestApi = {
  state: EnfRequestState;
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
    aisleId: (typeof enfProducts)[number]["aisleId"];
    slug: string;
    image: (typeof enfProducts)[number]["image"];
  }[];
};

const EnfRequestContext = createContext<EnfRequestApi | null>(null);

export function EnfRequestProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const api = useMemo<EnfRequestApi>(() => {
    const itemsWithProduct = state.items.flatMap((item) => {
      const product = enfProducts.find((entry) => entry.id === item.id);
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
      has: (id) => cached.items.some((item) => item.id === id),
      quantity: (id) => cached.items.find((item) => item.id === id)?.quantity ?? 0,
      count: itemsWithProduct.reduce((sum, item) => sum + item.quantity, 0),
      clearItems: () => commit({ ...cached, items: [] }),
      itemsWithProduct,
    };
  }, [state]);

  return <EnfRequestContext.Provider value={api}>{children}</EnfRequestContext.Provider>;
}

export function useEnfRequest() {
  const ctx = useContext(EnfRequestContext);
  if (!ctx) throw new Error("useEnfRequest must be used within EnfRequestProvider");
  return ctx;
}
