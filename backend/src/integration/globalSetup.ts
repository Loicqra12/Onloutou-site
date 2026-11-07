import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { applyIntegrationTestEnv } from "./env.js";

export default async function globalSetup() {
  applyIntegrationTestEnv();

  const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  execSync("npx prisma migrate deploy", {
    cwd: backendRoot,
    stdio: "inherit",
    env: process.env,
  });
  execSync("npx prisma generate", {
    cwd: backendRoot,
    stdio: "inherit",
    env: process.env,
  });
}
