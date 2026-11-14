import { Router } from "express";
import multer from "multer";
import type { Env } from "../../config/env.js";
import { storageConfigured } from "../../config/env.js";
import { requireAdmin, requirePartner } from "../../middleware/auth.js";
import { publicSubmitLimiter, uploadLimiter } from "../../middleware/rateLimit.js";
import {
  archivePartnerProduct,
  attachProductImage,
  createProduct,
  deletePartnerProduct,
  getPartnerProduct,
  getPartnerProfileForUser,
  listPartnerProducts,
  listPublicCatalog,
  replaceProductImage,
  reviewProduct,
  setProductPaused,
  submitPartnerProfile,
  submitProductForReview,
  updatePartnerProfile,
  updateProduct,
  updateProductAvailability,
} from "./service.js";
import { articleFamilies } from "./taxonomy.js";
import { partnerProfileSubmitSchema, partnerProfileUpdateSchema, productAvailabilitySchema, productCreateSchema, productPauseSchema, productReviewSchema, productUpdateSchema } from "./schemas.js";
import { createPartnerDemandsRouter } from "../demands/routes.js";
import { createPartnerOpsRouter } from "../ops/routes.js";
import { createPartnerFinanceRouter } from "../finance/routes.js";
import { partnerInboxCounts } from "../ops/service.js";
import { reviewApplicationSchema } from "../auth/schemas.js";
import { reviewDriverApplication, reviewPartnerApplication } from "./service.js";
import { prisma } from "../../db.js";
import { getAdminOverview } from "../admin/overview.js";
import { publicImageUrl, putPublicImage, validateImageUpload } from "../documents/storage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export function createCatalogPublicRouter() {
  const router = Router();
  router.get("/products", async (_req, res, next) => {
    try {
      const products = await listPublicCatalog();
      res.json({
        products: products.map(({ images, ...product }) => ({
          ...product,
          images: images.map((image) => ({
            id: image.id,
            sortOrder: image.sortOrder,
            url: publicImageUrl(image.storageKey),
          })),
        })),
      });
    } catch (err) {
      next(err);
    }
  });
  router.get("/taxonomy", (_req, res) => {
    res.json({ families: articleFamilies });
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
      const counts = await partnerInboxCounts(req.session.user!.id);
      res.json({ profile, ...counts });
    } catch (err) {
      next(err);
    }
  });


  router.patch("/profile", async (req, res, next) => {
    try {
      const body = partnerProfileUpdateSchema.parse(req.body);
      const result = await updatePartnerProfile(req.session.user!.id, body);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ profile: result.profile });
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

  router.get("/taxonomy", (_req, res) => {
    res.json({ families: articleFamilies });
  });

  router.get("/products", async (req, res, next) => {
    try {
      const products = await listPartnerProducts(req.session.user!.id);
      res.json({ products, items: products });
    } catch (err) {
      next(err);
    }
  });

  router.get("/products/:id", async (req, res, next) => {
    try {
      const result = await getPartnerProduct(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
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

  router.post("/products/:id/images", uploadLimiter, upload.single("file"), async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) {
        res.status(400).json({ error: "Identifiant produit manquant." });
        return;
      }
      if (!storageConfigured(env) && env.NODE_ENV === "production") {
        res.status(503).json({ error: "Stockage fichiers non configuré." });
        return;
      }
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "Fichier requis." });
        return;
      }
      const check = validateImageUpload(file.mimetype, file.buffer, env.FILE_MAX_BYTES);
      if (!check.ok) {
        res.status(400).json({ error: check.error });
        return;
      }
      const key = await putPublicImage(env, `onloutou/catalog/${productId}`, file.buffer);
      const replaceId = typeof req.query.replace === "string" ? req.query.replace : undefined;
      const attached = replaceId
        ? await replaceProductImage({
            userId: req.session.user!.id,
            productId,
            imageId: replaceId,
            storageKey: key,
            mimeType: check.mime,
            byteSize: file.size,
          })
        : await attachProductImage({
            userId: req.session.user!.id,
            productId,
            storageKey: key,
            mimeType: check.mime,
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

  router.patch("/products/:id/availability", async (req, res, next) => {
    try {
      const body = productAvailabilitySchema.parse(req.body);
      const result = await updateProductAvailability(req.session.user!.id, req.params.id, body.unavailabilities);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.post("/products/:id/pause", async (req, res, next) => {
    try {
      const body = productPauseSchema.parse(req.body);
      const result = await setProductPaused(req.session.user!.id, req.params.id, body.paused);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.post("/products/:id/archive", async (req, res, next) => {
    try {
      const result = await archivePartnerProduct(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ product: result.product });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/products/:id", async (req, res, next) => {
    try {
      const result = await deletePartnerProduct(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  router.use(createPartnerDemandsRouter());
  router.use(createPartnerOpsRouter());
  router.use(createPartnerFinanceRouter());

  return router;
}

export function createAdminCatalogRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/overview", async (req, res, next) => {
    try {
      const data = await getAdminOverview(req.session.user!.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });

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
