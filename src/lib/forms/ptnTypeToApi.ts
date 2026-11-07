import type { PtnTypeId } from "@/content/partners-hub";
import type { ServiceRequestApiType } from "@/lib/forms/serviceRequest";

export function ptnTypeToApiType(type: PtnTypeId): ServiceRequestApiType {
  switch (type) {
    case "equipements":
      return "PARTNER_SUPPLIER";
    case "livraison":
      return "PARTNER_DELIVERY";
    case "technologie":
      return "PARTNER_TECH";
    case "terrain":
      return "OTHER";
    default:
      return "OTHER";
  }
}

export function parseContactChannel(channel: string): { phone?: string; email?: string } {
  const trimmed = channel.trim();
  if (trimmed.includes("@")) {
    return { email: trimmed };
  }
  return { phone: trimmed };
}

/**
 * Contrôle du champ « Téléphone ou e-mail » : renvoie un message clair, ou null si la saisie est exploitable.
 * Accepte un e-mail valide, ou un numéro (ivoirien : 10 chiffres, avec ou sans +225 / 00225 ; 8 à 15 chiffres au total).
 * Un texte sans numéro est refusé ; la saisie de l’utilisateur n’est jamais modifiée ni effacée.
 */
export function contactChannelError(channel: string): string | null {
  const value = channel.trim();
  const message = "Indiquez un numéro de téléphone (par exemple 07 12 34 56 78) ou une adresse e-mail valide.";
  if (value === "") return message;
  if (value.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message;
  }
  if (!/^\+?[\d\s().-]+$/.test(value)) return message;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? null : message;
}
