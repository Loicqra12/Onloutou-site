import { MOB_REQUEST_KEY, mobProducts } from "@/content/mobilier";

export type MobRequestItem = { id: string; quantity: number };

export type MobRequestState = {
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
  reference: string;
};

export const emptyMobRequest = (): MobRequestState => ({
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
  reference: "",
});

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readMobRequest(): MobRequestState {
  const store = storage();
  if (!store) return emptyMobRequest();
  try {
    const raw = store.getItem(MOB_REQUEST_KEY);
    if (!raw) return emptyMobRequest();
    const parsed = JSON.parse(raw) as Partial<MobRequestState>;
    const empty = emptyMobRequest();
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
      reference: typeof parsed.reference === "string" ? parsed.reference : "",
    };
  } catch {
    return emptyMobRequest();
  }
}

export function writeMobRequest(state: MobRequestState) {
  storage()?.setItem(MOB_REQUEST_KEY, JSON.stringify(state));
}

export function mobRequestMessage(state: MobRequestState) {
  const lines = ["Location mobilier & décoration :"];
  for (const item of state.items) {
    const product = mobProducts.find((entry) => entry.id === item.id);
    if (!product) continue;
    lines.push(`- ${product.title}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`);
  }
  if (state.zone.trim()) lines.push(`Zone : ${state.zone.trim()}`);
  const period = [state.startDate, state.endDate].filter(Boolean).join(" – ") || state.dates.trim();
  if (period) lines.push(`Période : ${period}`);
  if (state.delivery) lines.push("Livraison souhaitée");
  return lines.join("\n");
}