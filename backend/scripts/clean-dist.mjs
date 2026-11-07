import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const integrationDist = resolve(backendRoot, "dist", "integration");
try {
  rmSync(integrationDist, { recursive: true, force: true });
} catch {
  /* ignore */
}
