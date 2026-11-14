import { defineConfig, devices } from "@playwright/test";
import { assertE2EDatabase } from "./tests/e2e-db-guard";

// Avant toute écriture : base de test explicite et autorisée, sinon arrêt immédiat.
assertE2EDatabase();

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests",
  testMatch: ["forms-e2e.spec.ts", "connected-e2e.spec.ts"],
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-forms" }]],
  outputDir: "test-results/forms-e2e",
  globalSetup: "./tests/forms-e2e.global-setup.ts",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run dev:api",
      url: "http://127.0.0.1:4000/health",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "npm run start",
      url: baseURL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "npm run dev:admin",
      url: process.env.ADMIN_ORIGIN ?? "http://127.0.0.1:3001",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
