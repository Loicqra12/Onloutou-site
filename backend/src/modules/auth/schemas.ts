import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
});

export const registerPartnerSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(10).max(128),
  displayName: z.string().min(2).max(120),
  organizationName: z.string().min(2).max(200).optional(),
  partnerType: z.enum(["SUPPLIER", "DELIVERY", "TECH"]).optional(),
  zone: z.string().max(200).optional(),
  description: z.string().max(4000).optional(),
  phone: z.string().max(40).optional(),
  termsAccepted: z.literal(true),
});

export const registerDriverSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(10).max(128),
  fullName: z.string().min(2).max(120),
  zone: z.string().max(200).optional(),
  vehicleInfo: z.string().max(500).optional(),
  phone: z.string().max(40).optional(),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email().max(320),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(10).max(128),
});

export const reviewApplicationSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(2000).optional(),
});

export const emailConfirmSchema = z.object({
  token: z.string().min(20).max(200),
});

export const twoFactorVerifySchema = z.object({
  challengeToken: z.string().min(20).max(200),
  code: z.string().min(6).max(20),
});
