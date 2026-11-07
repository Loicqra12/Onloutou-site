import { z } from "zod";

const contactNeedMap = {
  location: "CONTACT",
  gps: "GPS",
  actifs: "ASSET_SECURITY",
  numerique: "CUSTOM_PLATFORM",
  partenariat: "PARTNER_SUPPLIER",
  autre: "OTHER",
} as const;

export const createContactRequestSchema = z.object({
  source: z.literal("contact"),
  need: z.enum(["location", "gps", "actifs", "numerique", "partenariat", "autre"]),
  name: z.string().min(2).max(120),
  phone: z.string().max(40).optional(),
  email: z.string().email().max(320).optional(),
  organisation: z.string().max(200).optional(),
  zone: z.string().max(200).optional(),
  deadline: z.string().max(200).optional(),
  message: z.string().min(5).max(8000),
  sourcePath: z.string().max(500).optional(),
  openWhatsAppAfter: z.boolean().optional(),
  clientRequestId: z.string().min(8).max(64).optional(),
});

export const createGenericRequestSchema = z.object({
  source: z.string().max(80),
  type: z.enum([
    "CONTACT",
    "PRODUCT",
    "RENTAL",
    "PURCHASE",
    "GPS",
    "ASSET_SECURITY",
    "CUSTOM_PLATFORM",
    "EQUIPMENT_CATALOG",
    "DELIVERY",
    "PARTNER_SUPPLIER",
    "PARTNER_DELIVERY",
    "PARTNER_TECH",
    "OTHER",
  ]),
  contactName: z.string().min(2).max(120),
  contactPhone: z.string().max(40).optional(),
  contactEmail: z.string().email().max(320).optional(),
  organization: z.string().max(200).optional(),
  zone: z.string().max(200).optional(),
  message: z.string().min(5).max(8000),
  payload: z.record(z.unknown()).optional(),
  sourcePath: z.string().max(500).optional(),
  clientRequestId: z.string().min(8).max(64).optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(["RECEIVED", "IN_REVIEW", "WAITING_CLIENT", "QUOTED", "CLOSED", "CANCELLED"]),
  note: z.string().max(4000).optional(),
});

export const listRequestsQuerySchema = z.object({
  status: z
    .enum(["RECEIVED", "IN_REVIEW", "WAITING_CLIENT", "QUOTED", "CLOSED", "CANCELLED"])
    .optional(),
  type: z.string().optional(),
  q: z.string().max(120).optional(),
  take: z.coerce.number().int().min(1).max(100).default(25),
  skip: z.coerce.number().int().min(0).default(0),
});

export function contactNeedToType(need: z.infer<typeof createContactRequestSchema>["need"]) {
  const mapped = contactNeedMap[need];
  if (need === "location") return "CONTACT" as const;
  if (need === "partenariat") return "PARTNER_SUPPLIER" as const;
  return mapped as
    | "GPS"
    | "ASSET_SECURITY"
    | "CUSTOM_PLATFORM"
    | "OTHER"
    | "CONTACT"
    | "PARTNER_SUPPLIER";
}

export type CreateContactRequestInput = z.infer<typeof createContactRequestSchema>;
export type CreateGenericRequestInput = z.infer<typeof createGenericRequestSchema>;
