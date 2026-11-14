import { ENF_REQUEST_KEY, enfProducts } from "@/content/enfance";

export type EnfRequestItem = { id: string; quantity: number };

export type EnfRequestState = {
  items: EnfRequestItem[];
  zone: string;
  dates: string;
  startDate: string;
  endDate: string;
  query: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  delivery: boolean;
  reference: string;
};

export const emptyEnfRequest = (): EnfRequestState => ({
  items: [],
  zone: "",
  dates: "",
  startDate: "",
  endDate: "",
  query: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  delivery: true,
  reference: "",
});

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readEnfRequest(): EnfRequestState {
  const store = storage();
  if (!store) return emptyEnfRequest();
  try {
    const raw = store.getItem(ENF_REQUEST_KEY);
    if (!raw) return emptyEnfRequest();
    const parsed = JSON.parse(raw) as Partial<EnfRequestState>;
    const empty = emptyEnfRequest();
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
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      name: typeof parsed.name === "string" ? parsed.name : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      delivery: typeof parsed.delivery === "boolean" ? parsed.delivery : true,
      reference: typeof parsed.reference === "string" ? parsed.reference : "",
    };
  } catch {
    return emptyEnfRequest();
  }
}

export function writeEnfRequest(state: EnfRequestState) {
  storage()?.setItem(ENF_REQUEST_KEY, JSON.stringify(state));
}

export function enfRequestMessage(state: EnfRequestState) {
  const lines = ["Location Bébé & enfance :"];
  for (const item of state.items) {
    const product = enfProducts.find((entry) => entry.id === item.id);
    if (!product) continue;
    lines.push(`- ${product.title}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`);
  }
  if (state.zone.trim()) lines.push(`Commune : ${state.zone.trim()}`);
  const period = [state.startDate, state.endDate].filter(Boolean).join(" – ") || state.dates.trim();
  if (period) lines.push(`Séjour : ${period}`);
  if (state.delivery) lines.push("Livraison souhaitée");
  if (state.notes.trim()) lines.push(`Précisions : ${state.notes.trim()}`);
  return lines.join("\n");
}

export function enfDemandeWhatsAppMessage(payload: {
  reference: string;
  items: { title: string; quantity: number }[];
  zone: string;
  stay: string;
  delivery: boolean;
  name: string;
  phone: string;
}) {
  const lines = [
    `Demande ${payload.reference} — Bébé & enfance`,
    ...payload.items.map((item) => `• ${item.title} × ${item.quantity}`),
  ];
  if (payload.zone) lines.push(`Commune : ${payload.zone}`);
  if (payload.stay) lines.push(`Séjour : ${payload.stay}`);
  if (payload.delivery) lines.push("Livraison souhaitée");
  if (payload.name) lines.push(`Contact : ${payload.name}`);
  if (payload.phone) lines.push(`Tél. : ${payload.phone}`);
  return lines.join("\n");
}
