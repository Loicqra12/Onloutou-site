import { ELM_REQUEST_KEY, elmProducts } from "@/content/electromenager";

export type ElmRequestItem = {
  id: string;
  quantity: number;
};

export type ElmRequestState = {
  items: ElmRequestItem[];
  zone: string;
  dates: string;
  startDate: string;
  endDate: string;
  query: string;
  usage: string;
  name: string;
  phone: string;
  email: string;
  delivery: boolean;
  installation: boolean;
  formation: boolean;
  reference: string;
};

export const emptyElmRequest = (): ElmRequestState => ({
  items: [],
  zone: "",
  dates: "",
  startDate: "",
  endDate: "",
  query: "",
  usage: "",
  name: "",
  phone: "",
  email: "",
  delivery: true,
  installation: false,
  formation: false,
  reference: "",
});

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readElmRequest(): ElmRequestState {
  const store = storage();
  if (!store) return emptyElmRequest();
  try {
    const raw = store.getItem(ELM_REQUEST_KEY);
    if (!raw) return emptyElmRequest();
    const parsed = JSON.parse(raw) as Partial<ElmRequestState>;
    const empty = emptyElmRequest();
    return {
      ...empty,
      items: Array.isArray(parsed.items)
        ? parsed.items.filter((item) => item && typeof item.id === "string" && item.quantity > 0)
        : [],
      zone: typeof parsed.zone === "string" ? parsed.zone : "",
      dates: typeof parsed.dates === "string" ? parsed.dates : "",
      startDate: typeof parsed.startDate === "string" ? parsed.startDate : "",
      endDate: typeof parsed.endDate === "string" ? parsed.endDate : "",
      query: typeof parsed.query === "string" ? parsed.query : "",
      usage: typeof parsed.usage === "string" ? parsed.usage : "",
      name: typeof parsed.name === "string" ? parsed.name : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      delivery: typeof parsed.delivery === "boolean" ? parsed.delivery : true,
      installation: typeof parsed.installation === "boolean" ? parsed.installation : false,
      formation: typeof parsed.formation === "boolean" ? parsed.formation : false,
      reference: typeof parsed.reference === "string" ? parsed.reference : "",
    };
  } catch {
    return emptyElmRequest();
  }
}

export function writeElmRequest(state: ElmRequestState) {
  storage()?.setItem(ELM_REQUEST_KEY, JSON.stringify(state));
}

export function clearElmRequest() {
  storage()?.removeItem(ELM_REQUEST_KEY);
}

export function elmRequestMessage(state: ElmRequestState) {
  const lines = ["Location d'électroménager :"];
  for (const item of state.items) {
    const product = elmProducts.find((entry) => entry.id === item.id);
    if (!product) continue;
    lines.push(`- ${product.title}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`);
  }
  if (state.zone.trim()) lines.push(`Zone : ${state.zone.trim()}`);
  const period = [state.startDate, state.endDate].filter(Boolean).join(" – ") || state.dates.trim();
  if (period) lines.push(`Période : ${period}`);
  if (state.delivery) lines.push("Livraison souhaitée");
  return lines.join("\n");
}