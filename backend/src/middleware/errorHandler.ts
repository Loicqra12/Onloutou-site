import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/httpError.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Données invalides.",
      details: err.flatten(),
    });
    return;
  }
  if (err instanceof Error && "code" in err && err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ error: "Jeton CSRF invalide." });
    return;
  }
  if (err instanceof Error && err.name === "MulterError") {
    const code = "code" in err ? String((err as { code?: string }).code) : "";
    if (code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "Chaque photo doit peser 5 Mo maximum." });
      return;
    }
    res.status(400).json({ error: "Fichier refusé." });
    return;
  }
  if (err instanceof Error && err.message.startsWith("Configuration")) {
    res.status(500).json({ error: "Service indisponible." });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Erreur interne." });
}
