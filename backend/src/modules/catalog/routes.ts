import { Router } from "express";
import multer from "multer";
import type { Env } from "../../config/env.js";
import { s3Configured } from "../../config/env.js";
import { requireAdmin, requirePartner } from "../../middleware/auth.js";
import { publicSubmitLimiter } from "../../middleware/rateLimit.js";
import {
  attachProductImage,
  createProduct,
  getPartnerProfileForUser,
  listPartnerProducts,
  listPublicCatalog,
  reviewProduct,
  submitPartnerProfile,
  submitProductForReview,
  updateProduct,
} from "./service.js";
import { partnerProfileSubmitSchema, productCreateSchema, productReviewSchema, productUpdateSchema } from "./schemas.js";
import { reviewApplicationSchema } from "../auth/schemas.js";
import { reviewDriverApplication, reviewPartnerApplication } from "./service.js";
import { prisma } from "../../db.js";
import { putPublicObject, validateImageUpload } from "../documents/storage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export function createCatalogPublicRouter() {
  const router = Router();
  router.get("/products", async (_req, res, next) => {
    try {
      const products = await listPublicCatalog();
      res.json({ products });
    } catch (err) {
      next(err);
    }
  });
  return router;
}

export function createPartnerRouter(env: Env) {
  const router = Router();
  router.use(requirePartner);

  router.get("/me", async (req, res, next) => {
    try {
      const profile = await getPartnerProfileForUser(req.session.user!.id);
      if (!profile) {
        res.status(404).json({ error: "Profil partenaire introuvable." });
        return;
      }
      res.json({ profile });
    } catch (err) {
      next(err);
    }
  });

  router.post("/profile/submit", publicSubmitLimiter, async (req, res, next) => {
    try {
      const body = partnerProfileSubmitSchema.parse(req.body);
      const result = await submitPartnerProfile(req.session.user!.id, body);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ profile: result.profile });
    } catch (err) {
      next(err);
    }
  });

  router.get("/products", async (req, res, next) => {
    try {
      const products = await listPartnerProducts(req.session.user!.id);
      res.json({ products });
    } catch (err) {
      next(err);
    }
  });

  router.post("/products", async (req, res, next) => {
    try {
      const body = productCreateSchema.parse(req.body);
      const result = await createProduct(req.session.user!.id, body);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/products/:id", async (req, res, next) => {
    try {
      const body = productUpdateSchema.parse(req.body);
      const result = await updateProduct(req.session.user!.id, req.params.id, body);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.post("/products/:id/submit", async (req, res, next) => {
    try {
      const result = await submitProductForReview(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.post("/products/:id/images", upload.single("file"), async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) {
        res.status(400).json({ error: "Identifiant produit manquant." });
        return;
      }
      if (!s3Configured(env)) {
        res.status(503).json({ error: "Stockage fichiers non configuré." });
        return;
      }
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "Fichier requis." });
        return;
      }
      const check = validateImageUpload(file.mimetype, file.size, env.FILE_MAX_BYTES);
      if (!check.ok) {
        res.status(400).json({ error: check.error });
        return;
      }
      const key = `catalog/${req.session.user!.id}/${productId}/${Date.now()}-${file.originalname.replace(/[^\w.-]+/g, "_")}`;
      await putPublicObject(env, key, file.buffer, file.mimetype);
      const attached = await attachProductImage({
        userId: req.session.user!.id,
        productId,
        storageKey: key,
        mimeType: file.mimetype,
        byteSize: file.size,
      });
      if (!attached.ok) {
        res.status(400).json({ error: attached.error });
        return;
      }
      res.status(201).json({ image: attached.image });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createAdminCatalogRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/applications/partners", async (_req, res, next) => {
    try {
      const items = await prisma.partnerProfile.findMany({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"] } },
        include: { user: { select: { email: true, displayName: true, phone: true } } },
        orderBy: { updatedAt: "desc" },
        take: 100,
      });
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.get("/applications/drivers", async (_req, res, next) => {
    try {
      const items = await prisma.driverProfile.findMany({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"] } },
        include: { user: { select: { email: true, displayName: true, phone: true } } },
        orderBy: { updatedAt: "desc" },
        take: 100,
      });
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/applications/partners/:id", async (req, res, next) => {
    try {
      const body = reviewApplicationSchema.parse(req.body);
      const result = await reviewPartnerApplication(
        req.session.user!.id,
        req.params.id,
        body.decision,
        body.reason,
        req.ip,
      );
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ profile: result.profile });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/applications/drivers/:id", async (req, res, next) => {
    try {
      const body = reviewApplicationSchema.parse(req.body);
      const result = await reviewDriverApplication(
        req.session.user!.id,
        req.params.id,
        body.decision,
        body.reason,
        req.ip,
      );
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ profile: result.profile });
    } catch (err) {
      next(err);
    }
  });

  router.get("/products/pending", async (_req, res, next) => {
    try {
      const items = await prisma.product.findMany({
        where: { status: "PENDING_REVIEW" },
        include: { images: true, partnerProfile: true },
        orderBy: { updatedAt: "desc" },
      });
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/products/:id/review", async (req, res, next) => {
    try {
      const body = productReviewSchema.parse(req.body);
      const result = await reviewProduct(req.session.user!.id, req.params.id, body, req.ip);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.get("/audit", async (req, res, next) => {
    try {
      const take = Math.min(Number(req.query.take ?? 50), 200);
      const items = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take,
        include: { actor: { select: { email: true, role: true } } },
      });
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
