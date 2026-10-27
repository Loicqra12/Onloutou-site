import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "src", "app");

/** Routes dérivées des fichiers `page.tsx` sous `src/app`. */
export function discoverAppRoutes(): string[] {
  const routes: string[] = [];

  function walk(currentDir: string, segments: string[]) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
          walk(full, segments);
        } else {
          walk(full, [...segments, entry.name]);
        }
        continue;
      }
      if (entry.name === "page.tsx") {
        routes.push(segments.length === 0 ? "/" : `/${segments.join("/")}`);
      }
    }
  }

  walk(APP_DIR, []);
  return routes.sort((a, b) => a.localeCompare(b));
}
