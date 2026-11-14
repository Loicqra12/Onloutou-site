import { z } from "zod";

export const demandReplySchema = z.object({
  kind: z.enum(["AVAILABLE", "ADJUSTMENT", "UNAVAILABLE"]),
  quantity: z.number().int().min(0).max(9999).optional(),
  startDate: z.string().min(8).max(10).optional(),
  endDate: z.string().min(8).max(10).optional(),
  delivery: z.string().max(80).optional(),
  fees: z.string().max(80).optional(),
  message: z.string().min(8).max(2000),
});
