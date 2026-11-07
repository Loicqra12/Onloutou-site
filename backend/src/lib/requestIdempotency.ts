import { createHash } from "node:crypto";
import type { ServiceRequest } from "@prisma/client";

type RequestBody = {
  type: string;
  contactName: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  organization?: string | null;
  zone?: string | null;
  message: string;
  payload?: unknown;
};

function stablePayload(value: unknown): string {
  if (value === null || value === undefined) return "{}";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return JSON.stringify(value);
  const sorted = Object.keys(value as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = (value as Record<string, unknown>)[key];
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

export function requestFingerprint(body: RequestBody): string {
  const material = [
    body.type,
    body.contactName.trim(),
    (body.contactPhone ?? "").trim(),
    (body.contactEmail ?? "").trim().toLowerCase(),
    (body.organization ?? "").trim(),
    (body.zone ?? "").trim(),
    body.message.trim(),
    stablePayload(body.payload),
  ].join("\u001f");
  return createHash("sha256").update(material).digest("hex");
}

export function requestMatchesExisting(existing: ServiceRequest, body: RequestBody): boolean {
  return requestFingerprint({
    type: existing.type,
    contactName: existing.contactName,
    contactPhone: existing.contactPhone,
    contactEmail: existing.contactEmail,
    organization: existing.organization,
    zone: existing.zone,
    message: existing.message,
    payload: existing.payload,
  }) === requestFingerprint(body);
}

export function isUniqueViolation(err: unknown, field?: string): boolean {
  if (typeof err !== "object" || err === null || !("code" in err)) return false;
  if (err.code !== "P2002") return false;
  if (!field) return true;
  const target = (err as { meta?: { target?: string[] | string } }).meta?.target;
  if (!target) return true;
  const fields = Array.isArray(target) ? target : [target];
  return fields.some((f) => f.includes(field));
}
