export type PartnerPersonKind = "INDIVIDUAL" | "PROFESSIONAL";
export type PartnerStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type PartnerProfile = {
  id: string;
  status: PartnerStatus;
  organizationName: string;
  personKind: PartnerPersonKind | null;
  commune: string | null;
  commercialName: string | null;
  legalName?: string | null;
  description?: string | null;
  zone?: string | null;
  rejectionReason?: string | null;
  user: {
    email: string;
    displayName: string | null;
    phone: string | null;
    emailVerifiedAt: string | null;
    termsAcceptedAt: string | null;
  };
};

export type PartnerProduct = {
  id: string;
  title: string;
  status: string;
};

export function isProfileComplete(profile: PartnerProfile): boolean {
  if (!profile.personKind || !profile.user.phone?.trim() || !profile.commune?.trim()) return false;
  if (!profile.description?.trim()) return false;
  return true;
}

export function nationalPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  let raw = phone.replace(/[^\d+]/g, "");
  if (raw.startsWith("+225")) raw = raw.slice(4);
  else if (raw.startsWith("00225")) raw = raw.slice(5);
  else if (raw.startsWith("225") && raw.length > 10) raw = raw.slice(3);
  return raw.replace(/\D/g, "");
}

export function storedPhone(national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  return `+225${digits}`;
}

/** Mask used on 05C, matching the mockup: +225 •• •• •• •• */
export function maskPhone(phone?: string | null): string {
  void phone;
  return "+225 •• •• •• ••";
}

export function profileInitials(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function profileDisplayTitle(profile: {
  commercialName?: string | null;
  user: { displayName: string | null };
}): string {
  return profile.commercialName?.trim() || profile.user.displayName?.trim() || "Votre profil";
}
