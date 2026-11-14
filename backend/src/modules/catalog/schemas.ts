import { z } from "zod";

export const productCategoryEnum = z.enum([
  "VEHICLES",
  "MOTORCYCLES",
  "TRUCKS_MACHINERY",
  "TOOLS",
  "CONNECTED",
  "APPLIANCES",
  "IT",
  "FURNITURE",
  "EVENTS",
  "CHILDCARE",
  "OTHER",
]);

const unavailabilitySchema = z.object({
  startDate: z.string().min(8).max(10),
  endDate: z.string().min(8).max(10),
  quantity: z.coerce.number().int().min(1).max(9999),
  reason: z.string().max(200).nullable().optional(),
});

const termsSchema = z
  .object({
    quantity: z.number().int().min(1).max(9999).nullable().optional(),
    rentalMode: z.enum(["UNIT", "LOT"]).nullable().optional(),
    lotCount: z.number().int().min(1).max(9999).nullable().optional(),
    piecesPerLot: z.number().int().min(1).max(9999).nullable().optional(),
    priceAmount: z.number().min(0).max(99_999_999).nullable().optional(),
    pricePeriod: z.enum(["DAY", "WEEK", "MONTH"]).nullable().optional(),
    minDuration: z.string().max(40).nullable().optional(),
    depositKind: z.enum(["AMOUNT", "TO_DISCUSS"]).nullable().optional(),
    depositAmount: z.number().min(0).max(99_999_999).nullable().optional(),
    commune: z.string().max(200).nullable().optional(),
    pickup: z.boolean().nullable().optional(),
    delivery: z.boolean().nullable().optional(),
    deliveryZone: z.string().max(200).nullable().optional(),
    deliveryFees: z.string().max(200).nullable().optional(),
    installation: z.boolean().nullable().optional(),
    availableFrom: z.string().max(40).nullable().optional(),
  })
  .strict();

export const productCreateSchema = z.object({
  category: productCategoryEnum.optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(8000).optional().nullable(),
  pricingMode: z.enum(["ON_QUOTE", "FIXED"]).optional(),
  quantityHint: z.coerce.number().int().min(0).max(9999).optional(),
  familySlug: z.string().max(80).optional().nullable(),
  categorySlug: z.string().max(80).optional().nullable(),
  categoryRequest: z.string().max(400).optional().nullable(),
  condition: z.string().max(80).optional().nullable(),
  specs: z.record(z.string(), z.string()).optional(),
  terms: termsSchema.optional(),
  unavailabilities: z.array(unavailabilitySchema).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productReviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "DISABLED", "ARCHIVED"]),
  reason: z.string().max(2000).optional(),
  corrections: z
    .object({
      message: z.string().max(2000).optional(),
      items: z
        .array(
          z.discriminatedUnion("kind", [
            z.object({ kind: z.literal("replace_photo"), imageId: z.string(), title: z.string().max(120) }),
            z.object({ kind: z.literal("dimensions") }),
          ]),
        )
        .optional(),
    })
    .optional(),
});

export const productPauseSchema = z.object({
  paused: z.boolean(),
});

export const productAvailabilitySchema = z.object({
  unavailabilities: z.array(unavailabilitySchema),
});

export const partnerProfileUpdateSchema = z.object({
  organizationName: z.string().min(2).max(200).optional(),
  zone: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  personKind: z.enum(["INDIVIDUAL", "PROFESSIONAL"]).optional(),
  phone: z.string().max(40).optional(),
  commune: z.string().max(200).optional(),
  commercialName: z.string().max(200).nullable().optional(),
  legalName: z.string().max(200).nullable().optional(),
  displayName: z.string().min(2).max(200).optional(),
});

export const partnerProfileSubmitSchema = partnerProfileUpdateSchema.extend({
  personKind: z.enum(["INDIVIDUAL", "PROFESSIONAL"]),
  phone: z.string().min(6).max(40),
  commune: z.string().min(2).max(200),
  description: z.string().trim().min(1).max(500),
});
