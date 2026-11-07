import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { assertE2EDatabase } from "./e2e-db-guard";

export default async function globalSetup() {
  assertE2EDatabase();
  const root = resolve(process.cwd());
  if (process.env.SKIP_E2E_BUILD !== "1") {
    execSync("npm run build", { cwd: root, stdio: "inherit" });
  }
  execSync("npm run db:migrate", { cwd: root, stdio: "inherit" });
  execSync("npx tsx scripts/ensure-e2e-admin.ts", {
    cwd: resolve(root, "backend"),
    stdio: "inherit",
    env: process.env,
  });
}
