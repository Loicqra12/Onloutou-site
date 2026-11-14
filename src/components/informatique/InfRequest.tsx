"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { infProducts } from "@/content/informatique";
import {
  emptyInfRequest,
  readInfRequest,
  writeInfRequest,
  type InfRequestState,
} from "@/lib/informatique-request";

const listeners = new Set<() => void>();
const EMPTY = emptyInfRequest();
let cached = EMPTY;
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  cached = readInfRequest();
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

function commit(next: InfRequestState) {
  cached = next;
  writeInfRequest(next);
  emit();
}

type MetaPatch = Partial<
  Pick<
    InfRequestState,
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
    | "reference"
  >
>;

type InfRequestApi = {
  state: InfRequestState;
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
    aisleId: (typeof infProducts)[number]["aisleId"];
    slug: string;
    image: (typeof infProducts)[number]["image"];
  }[];
};

const InfRequestContext = createContext<InfRequestApi | null>(null);

export function InfRequestProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const api = useMemo<InfRequestApi>(() => {
    const itemsWithProduct = state.items.flatMap((item) => {
      const product = infProducts.find((entry) => entry.id === item.id);
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

  return <InfRequestContext.Provider value={api}>{children}</InfRequestContext.Provider>;
}

export function useInfRequest() {
  const ctx = useContext(InfRequestContext);
  if (!ctx) throw new Error("useInfRequest must be used within InfRequestProvider");
  return ctx;
}
