export type OriginKey = "phone" | "whatsapp" | "web" | "other";

export type DraftArticle = {
  key: string;
  title: string;
  quantity: number;
  unit: string;
  productId?: string;
  imageUrl?: string;
  familyLabel?: string;
};

export type DossierDraft = {
  origin: OriginKey;
  clientMode: "existing" | "new";
  contactName: string;
  organization: string;
  contactPhone: string;
  contactEmail: string;
  clientKind: "professional" | "individual";
  assigneeId: string;
  contactDate: string;
  internalNote: string;
  articles: DraftArticle[];
  startDate: string;
  endDate: string;
  datesToConfirm: boolean;
  city: string;
  commune: string;
  address: string;
  usage: string;
  delivery: boolean;
  pickup: boolean;
  install: boolean;
  accessNotes: string;
};

export const DRAFT_KEY = "onloutou.admin.dossierDraft";

export function emptyDraft(assigneeId = ""): DossierDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    origin: "phone",
    clientMode: "existing",
    contactName: "",
    organization: "",
    contactPhone: "",
    contactEmail: "",
    clientKind: "professional",
    assigneeId,
    contactDate: today,
    internalNote: "",
    articles: [],
    startDate: "",
    endDate: "",
    datesToConfirm: false,
    city: "Abidjan",
    commune: "",
    address: "",
    usage: "",
    delivery: true,
    pickup: true,
    install: false,
    accessNotes: "",
  };
}

export function loadDraft(): DossierDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return { ...emptyDraft(), ...(JSON.parse(raw) as DossierDraft) };
  } catch {
    return null;
  }
}

export function saveDraft(draft: DossierDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function originLabel(origin: OriginKey): string {
  if (origin === "phone") return "Téléphone";
  if (origin === "whatsapp") return "WhatsApp";
  if (origin === "web") return "Site";
  return "Autre";
}

export function newArticleKey() {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
