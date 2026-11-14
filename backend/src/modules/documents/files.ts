import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { Router, type NextFunction, type Request, type Response } from "express";
import { localFilePathFromKey, LOCAL_KEY_PREFIX } from "./storage.js";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Sert les photos stockées en local (développement / tests uniquement). */
export function createPublicFilesRouter() {
  const router = Router();
  router.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    try {
      const rel = (req.originalUrl.split("?")[0] ?? "").replace(/^\/api\/v1\/files\/?/, "");
      const dest = localFilePathFromKey(`${LOCAL_KEY_PREFIX}${rel}`);
      if (!dest) {
        res.status(400).json({ error: "Chemin de fichier invalide." });
        return;
      }
      const data = await readFile(dest);
      const mime = MIME[extname(dest).toLowerCase()] ?? "application/octet-stream";
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.type(mime);
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      res.send(data);
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : "";
      if (code === "ENOENT") {
        res.status(404).json({ error: "Fichier introuvable." });
        return;
      }
      next(err);
    }
  });
  return router;
}
