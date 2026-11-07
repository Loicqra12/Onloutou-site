import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/integration/**/*.integration.test.ts"],
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 120_000,
    globalSetup: ["src/integration/globalSetup.ts"],
    setupFiles: ["src/integration/setup.ts"],
  },
});
