import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import type { Env } from "../../config/env.js";
import { storageConfigured } from "../../config/env.js";
import { prisma } from "../../db.js";
import { requireAuth, requirePartner } from "../../middleware/auth.js";
import { uploadLimiter } from "../../middleware/rateLimit.js";
import { writeAuditLog } from "../../lib/audit.js";
import {
  documentDownloadBlockedReason,
  PRIVATE_DOCUMENT_SIGNED_URL_SECONDS,
} from "../../lib/documentScan.js";
import { putPrivateDocument, signedPrivateUrl, validateDocumentUpload } from "./storage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});

const confidentialBodySchema = z.object({
  kind: z.enum(["ID_DOCUMENT", "REGISTRATION", "INSURANCE", "OTHER_CONFIDENTIAL"]).default("OTHER_CONFIDENTIAL"),
});

export function createDocumentsRouter(env: Env) {
  const router = Router();
  router.use(requireAuth);

  router.post("/confidential", requirePartner, uploadLimiter, upload.single("file"), async (req, res, next) => {
    try {
      if (!storageConfigured(env)) {
        res.status(503).json({ error: "Stockage confidentiel non configuré." });
        return;
      }
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "Fichier requis." });
        return;
      }
      const { kind } = confidentialBodySchema.parse(req.body);
      const check = validateDocumentUpload(file.mimetype, file.buffer, 8 * 1024 * 1024);
      if (!check.ok) {
        res.status(400).json({ error: check.error });
        return;
      }
      const profile = await prisma.partnerProfile.findUnique({ where: { userId: req.session.user!.id } });
      if (!profile) {
        res.status(404).json({ error: "Profil introuvable." });
        return;
      }
      const key = await putPrivateDocument(env, `onloutou/confidential/partner/${profile.id}`, file.buffer, check.mime);
      const doc = await prisma.document.create({
        data: {
          kind,
          storageKey: key,
          mimeType: check.mime,
          byteSize: file.size,
          scanStatus: "PENDING",
          partnerProfileId: profile.id,
          uploadedById: req.session.user!.id,
        },
      });
      await writeAuditLog({
        action: "DOCUMENT_UPLOADED",
        actorId: req.session.user!.id,
        targetType: "Document",
        targetId: doc.id,
        ip: req.ip,
      });
      res.status(201).json({
        document: {
          id: doc.id,
          scanStatus: doc.scanStatus,
          notice:
            "Document enregistré. Il n'est pas analysé par un antivirus : seule l'équipe ONLOUTOU peut le consulter, il n'est jamais publié.",
        },
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id/access", async (req, res, next) => {
    try {
      const doc = await prisma.document.findUnique({
        where: { id: req.params.id },
        include: { partnerProfile: true, driverProfile: true },
      });
      if (!doc || doc.deletedAt) {
        res.status(404).json({ error: "Document introuvable." });
        return;
      }
      const user = req.session.user!;
      const isAdmin = user.role === "ADMIN" || user.role === "STAFF";
      const ownsPartner = doc.partnerProfile?.userId === user.id;
      const ownsDriver = doc.driverProfile?.userId === user.id;
      if (!isAdmin && !ownsPartner && !ownsDriver) {
        res.status(403).json({ error: "Accès refusé." });
        return;
      }
      const blocked = documentDownloadBlockedReason(doc.scanStatus, { isAdmin });
      if (blocked) {
        res.status(423).json({ error: blocked });
        return;
      }
      if (!storageConfigured(env)) {
        res.status(503).json({ error: "Stockage non configuré." });
        return;
      }
      const url = signedPrivateUrl(env, doc.storageKey, doc.mimeType, PRIVATE_DOCUMENT_SIGNED_URL_SECONDS);
      await writeAuditLog({
        action: "DOCUMENT_ACCESSED",
        actorId: user.id,
        targetType: "Document",
        targetId: doc.id,
        ip: req.ip,
      });
      res.json({ url, expiresInSeconds: PRIVATE_DOCUMENT_SIGNED_URL_SECONDS });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
