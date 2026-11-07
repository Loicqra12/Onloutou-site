import { useCallback, useRef, useState } from "react";
import { apiEnabled, apiFetch } from "@/lib/api/client";

export type ServiceRequestApiType =
  | "CONTACT"
  | "PRODUCT"
  | "RENTAL"
  | "PURCHASE"
  | "GPS"
  | "ASSET_SECURITY"
  | "CUSTOM_PLATFORM"
  | "EQUIPMENT_CATALOG"
  | "DELIVERY"
  | "PARTNER_SUPPLIER"
  | "PARTNER_DELIVERY"
  | "PARTNER_TECH"
  | "OTHER";

export type SubmitGenericRequestBody = {
  source: string;
  type: ServiceRequestApiType;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  organization?: string;
  zone?: string;
  message: string;
  payload?: Record<string, unknown>;
  sourcePath?: string;
  clientRequestId?: string;
};

export type SubmitResult =
  | { ok: true; reference: string; recordedAt: string }
  | { ok: false; error: string; apiDisabled?: boolean; status?: number };

export function newClientRequestId(): string {
  return crypto.randomUUID();
}

export async function submitGenericRequest(body: SubmitGenericRequestBody): Promise<SubmitResult> {
  if (!apiEnabled()) {
    return { ok: false, error: "API désactivée.", apiDisabled: true };
  }
  const res = await apiFetch<{ ok: true; reference: string; recordedAt: string }>("/requests", {
    method: "POST",
    json: body,
  });
  if (!res.ok) {
    return { ok: false, error: res.error, status: res.status };
  }
  return { ok: true, reference: res.data.reference, recordedAt: res.data.recordedAt };
}

/** Texte standard après enregistrement (pas une confirmation de réservation). */
export function requestRecordedMessage(reference: string): string {
  return `Demande enregistrée. Référence : ${reference}. Conservez-la pour vos échanges. Elle ne confirme pas une réservation.`;
}

export function appendReferenceToWhatsAppUrl(url: string, reference: string): string {
  try {
    const parsed = new URL(url);
    const text = parsed.searchParams.get("text");
    if (text) {
      parsed.searchParams.set("text", `${text}\n\nRéf. ONLOUTOU : ${reference}`);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export const attachmentPendingNotice =
  "Les pièces jointes (pièce d’identité, justificatifs) ne sont pas transmises ici. ONLOUTOU vous indiquera le canal sécurisé après étude de votre dossier.";

export function useHubRequestSubmit() {
  const [reference, setReference] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const clientRequestIdRef = useRef<string | null>(null);

  const resetSubmit = useCallback(() => {
    setReference(null);
    setSaveError(null);
    clientRequestIdRef.current = null;
  }, []);

  const submit = useCallback(async (body: Omit<SubmitGenericRequestBody, "clientRequestId">) => {
    if (!apiEnabled()) {
      return { saved: false as const, apiDisabled: true as const };
    }
    if (!clientRequestIdRef.current) {
      clientRequestIdRef.current = newClientRequestId();
    }
    setPending(true);
    setSaveError(null);
    const result = await submitGenericRequest({
      ...body,
      clientRequestId: clientRequestIdRef.current,
    });
    setPending(false);
    if (!result.ok) {
      if (result.status === 409) {
        clientRequestIdRef.current = null;
      }
      setSaveError(result.error);
      return { saved: false as const, apiDisabled: false as const };
    }
    setReference(result.reference);
    return { saved: true as const, reference: result.reference };
  }, []);

  return { reference, saveError, pending, submit, resetSubmit };
}
