import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const useDefaultLocalServer = !process.env.BASE_URL || baseURL === "http://localhost:3000";

export default defineConfig({
  testDir: "tests",
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "off",
  },
  webServer:
    useDefaultLocalServer && process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "1"
      ? {
          command: "npm run start",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 60_000,
        }
      : undefined,
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 812 } },
    },
  ],
});
