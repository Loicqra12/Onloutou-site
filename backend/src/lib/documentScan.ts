import type { DocumentScanStatus } from "@prisma/client";

/** Téléchargement autorisé uniquement après analyse antivirus réussie (statut CLEAN). */
export function documentDownloadBlockedReason(scanStatus: DocumentScanStatus): string | null {
  if (scanStatus === "CLEAN") {
    return null;
  }
  return "Document non disponible (analyse requise).";
}

export const PRIVATE_DOCUMENT_SIGNED_URL_SECONDS = 120;
