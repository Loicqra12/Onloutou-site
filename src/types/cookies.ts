import type { TrackingStatus } from "@/types/privacy";

export type { TrackingStatus };

export type StorageTechnology =
  | "cookie"
  | "local-storage"
  | "session-storage"
  | "indexed-db"
  | "cache"
  | "third-party-embed"
  | "other";

export type CookieCategory =
  | "strictly-necessary"
  | "preferences"
  | "analytics"
  | "external-media"
  | "marketing"
  | "unknown";

export type CookieInventoryItem = {
  id: string;
  name: string;
  provider: string;
  technology: StorageTechnology;
  category: CookieCategory;
  purpose: string;
  domain: string | null;
  duration: string | null;
  trigger: string;
  required: boolean;
  active: boolean;
  status: "verified" | "to-confirm";
};
