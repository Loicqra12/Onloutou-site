import { REC_REQUEST_KEY, recProducts } from "@/content/reception";

export type MobRequestItem = { id: string; quantity: number };

export type RecRequestState = {
  items: MobRequestItem[];
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
  access: string;
  eventName: string;
  guests: string;
  deliveryAt: string;
  pickupAt: string;
  reference: string;
};

export const emptyRecRequest = (): RecRequestState => ({
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
  access: "",
  eventName: "",
  guests: "",
  deliveryAt: "",
  pickupAt: "",
  reference: "",
});

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readRecRequest(): RecRequestState {
  const store = storage();
  if (!store) return emptyRecRequest();
  try {
    const raw = store.getItem(REC_REQUEST_KEY);
    if (!raw) return emptyRecRequest();
    const parsed = JSON.parse(raw) as Partial<RecRequestState>;
    const empty = emptyRecRequest();
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
      access: typeof parsed.access === "string" ? parsed.access : "",
      eventName: typeof parsed.eventName === "string" ? parsed.eventName : "",
      guests: typeof parsed.guests === "string" ? parsed.guests : "",
      deliveryAt: typeof parsed.deliveryAt === "string" ? parsed.deliveryAt : "",
      pickupAt: typeof parsed.pickupAt === "string" ? parsed.pickupAt : "",
      reference: typeof parsed.reference === "string" ? parsed.reference : "",
    };
  } catch {
    return emptyRecRequest();
  }
}

export function writeRecRequest(state: RecRequestState) {
  storage()?.setItem(REC_REQUEST_KEY, JSON.stringify(state));
}

export function recRequestMessage(state: RecRequestState) {
  const lines = ["Location reception & décoration :"];
  for (const item of state.items) {
    const product = recProducts.find((entry) => entry.id === item.id);
    if (!product) continue;
    lines.push(`- ${product.title}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`);
  }
  if (state.zone.trim()) lines.push(`Zone : ${state.zone.trim()}`);
  const period = [state.startDate, state.endDate].filter(Boolean).join(" – ") || state.dates.trim();
  if (period) lines.push(`Période : ${period}`);
  if (state.delivery) lines.push("Livraison souhaitée");
  return lines.join("\n");
}