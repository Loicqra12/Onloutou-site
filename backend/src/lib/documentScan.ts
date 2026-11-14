import type { DocumentScanStatus } from "@prisma/client";

/**
 * Règle d'accès aux pièces confidentielles (aucun antivirus n'est branché pour l'instant) :
 * - propriétaire : uniquement après analyse réussie (statut CLEAN) ;
 * - administration : peut consulter un document en attente (PENDING), jamais un document
 *   mis en quarantaine ou rejeté ;
 * - dans tous les cas, ces pièces ne sont jamais publiées.
 */
export function documentDownloadBlockedReason(
  scanStatus: DocumentScanStatus,
  options: { isAdmin?: boolean } = {},
): string | null {
  if (scanStatus === "CLEAN") {
    return null;
  }
  if (options.isAdmin && scanStatus === "PENDING") {
    return null;
  }
  return "Document non disponible (analyse requise).";
}

export const PRIVATE_DOCUMENT_SIGNED_URL_SECONDS = 120;
