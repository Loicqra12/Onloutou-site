import type { SubmitGenericRequestBody } from "@/lib/forms/serviceRequest";

type SubmitFn = (
  body: Omit<SubmitGenericRequestBody, "clientRequestId">,
) => Promise<
  { saved: true; reference: string } | { saved: false; apiDisabled: true } | { saved: false; apiDisabled: false }
>;

export async function hubPrepareAndSubmit(
  submit: SubmitFn,
  body: Omit<SubmitGenericRequestBody, "clientRequestId">,
): Promise<"apiDisabled" | "done"> {
  const outcome = await submit(body);
  if ("apiDisabled" in outcome && outcome.apiDisabled) {
    return "apiDisabled";
  }
  return "done";
}

export function hubContactValidationError(name: string, phone: string, email = ""): string | null {
  if (!name.trim()) {
    return "Indiquez votre nom ou celui de votre structure.";
  }
  const digits = phone.replace(/\D/g, "").length;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (digits < 8 && !emailOk) {
    return "Indiquez un numéro de téléphone (au moins 8 chiffres) ou un e-mail valide pour que l’équipe puisse vous répondre.";
  }
  return null;
}

export function hubModeToRequestType(mode: string): SubmitGenericRequestBody["type"] {
  if (mode === "achat") return "PURCHASE";
  if (mode === "location") return "RENTAL";
  return "PRODUCT";
}
