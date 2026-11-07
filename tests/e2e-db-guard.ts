/**
 * Garde des E2E qui écrivent (demandes, comptes, admin de test).
 * Échoue AVANT toute écriture (migration, création d'admin, démarrage d'API) si la base
 * n'est pas explicitement configurée dans l'environnement du shell ET autorisée.
 * `backend/.env` (base de dev) n'est volontairement jamais lu ici.
 */
const ALLOWED_DB = /^onloutou_(audit|e2e|integration|test)$/;

export function assertE2EDatabase(): void {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "E2E refusés : DATABASE_URL n'est pas défini dans l'environnement. " +
        "Définissez-le explicitement vers une base de test (onloutou_audit, onloutou_e2e, onloutou_integration ou onloutou_test). " +
        "Aucune écriture n'a été faite.",
    );
  }
  const name = url.match(/\/([^/?]+)(\?|$)/)?.[1] ?? "";
  if (!ALLOWED_DB.test(name)) {
    throw new Error(
      `E2E refusés : la base « ${name || "?"} » n'est pas autorisée (autorisées : onloutou_audit, onloutou_e2e, onloutou_integration, onloutou_test). Aucune écriture n'a été faite.`,
    );
  }
  const host = url.match(/@([^:/]+)/)?.[1] ?? "";
  if (!["127.0.0.1", "localhost"].includes(host)) {
    throw new Error(`E2E refusés : l'hôte « ${host} » n'est pas local. Aucune écriture n'a été faite.`);
  }
}
