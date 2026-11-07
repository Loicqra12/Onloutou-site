import { z } from "zod";

export const productCreateSchema = z.object({
  category: z.enum(["VEHICLES", "MOTORCYCLES", "TRUCKS_MACHINERY", "TOOLS", "CONNECTED", "OTHER"]),
  title: z.string().min(3).max(200),
  description: z.string().max(8000).optional(),
  pricingMode: z.enum(["ON_QUOTE", "FIXED"]).default("ON_QUOTE"),
  quantityHint: z.coerce.number().int().min(0).max(9999).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productReviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "DISABLED", "ARCHIVED"]),
  reason: z.string().max(2000).optional(),
});

export const partnerProfileSubmitSchema = z.object({
  organizationName: z.string().min(2).max(200).optional(),
  zone: z.string().max(200).optional(),
  description: z.string().max(4000).optional(),
});
