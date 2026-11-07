import { loadBackendEnv } from "../load-env.js";

/** Refuse les tests d’intégration hors bases dédiées (évite d’effacer la prod ou une DB partagée). */
export function assertIntegrationDatabaseUrl(url: string): void {
  const match = url.match(/\/([^/?]+)(\?|$)/);
  const dbName = match?.[1] ?? "";
  if (!/^onloutou_(integration|test)$/.test(dbName)) {
    throw new Error(
      `Refus d’exécuter les tests d’intégration sur la base « ${dbName || "?"} ». ` +
        "Utilisez onloutou_integration ou onloutou_test (voir docs/backend/README.md).",
    );
  }
}

export function applyIntegrationTestEnv(): void {
  const explicitDatabaseUrl = process.env.DATABASE_URL;
  loadBackendEnv();
  // `backend/.env` pointe sur la base de dev : sans URL explicite, on retombe sur la base
  // d’intégration dédiée au lieu de celle du .env (qui serait refusée par la garde ci-dessous).
  process.env.DATABASE_URL =
    explicitDatabaseUrl ?? "postgresql://onloutou:onloutou_dev@127.0.0.1:5433/onloutou_integration";

  process.env.NODE_ENV ??= "test";

  const defaults: Record<string, string> = {
    DATABASE_URL:
      process.env.DATABASE_URL ??
      "postgresql://onloutou:onloutou_dev@127.0.0.1:5433/onloutou_integration",
    SESSION_SECRET: "integration-test-session-secret-min-32-chars",
    CSRF_SECRET: "integration-test-csrf-secret-min-32-chars",
    APP_ORIGIN: "http://localhost:3000",
    TRUST_PROXY: "0",
    COOKIE_SECURE: "0",
  };

  for (const [key, value] of Object.entries(defaults)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  assertIntegrationDatabaseUrl(process.env.DATABASE_URL!);
}
