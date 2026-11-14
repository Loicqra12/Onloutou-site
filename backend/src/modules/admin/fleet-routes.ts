import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../../middleware/auth.js";
import {
  createMaintenance,
  getArticleDetail,
  listArticles,
  listMaintenance,
  listParcOnloutou,
  setArticlePublication,
  updateMaintenance,
} from "./fleet-desk.js";

export function createAdminFleetRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/articles", async (req, res, next) => {
    try {
      const query = z
        .object({
          q: z.string().max(120).optional(),
          owner: z.string().max(40).optional(),
          family: z.string().max(80).optional(),
          publication: z.string().max(40).optional(),
          availability: z.string().max(40).optional(),
          view: z.string().max(40).optional(),
          take: z.coerce.number().int().min(1).max(100).optional(),
          skip: z.coerce.number().int().min(0).optional(),
        })
        .parse(req.query);
      res.json(await listArticles(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/articles/:id", async (req, res, next) => {
    try {
      const result = await getArticleDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ article: result.article });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/articles/:id/publication", async (req, res, next) => {
    try {
      const body = z
        .object({
          action: z.enum(["pause", "resume", "approve", "reject"]),
          reason: z.string().max(2000).optional(),
        })
        .parse(req.body ?? {});
      const result = await setArticlePublication(req.session.user!.id, req.params.id, body.action, body.reason, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, article: result.article });
    } catch (err) {
      next(err);
    }
  });

  router.get("/parc", async (req, res, next) => {
    try {
      const query = z
        .object({
          q: z.string().max(120).optional(),
          family: z.string().max(80).optional(),
        })
        .parse(req.query);
      res.json(await listParcOnloutou(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/maintenance", async (_req, res, next) => {
    try {
      res.json(await listMaintenance());
    } catch (err) {
      next(err);
    }
  });

  router.post("/maintenance", async (req, res, next) => {
    try {
      const body = z
        .object({
          productId: z.string().min(8).max(64),
          problem: z.string().min(2).max(2000),
          priority: z.enum(["P1", "P2", "P3"]).optional(),
          assigneeLabel: z.string().max(120).optional(),
          siteLabel: z.string().max(120).optional(),
        })
        .parse(req.body ?? {});
      const result = await createMaintenance(req.session.user!.id, body, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, intervention: result.intervention });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/maintenance/:productId/:interventionId", async (req, res, next) => {
    try {
      const body = z
        .object({
          stage: z.enum(["signale", "diagnostic", "en_cours", "validation", "clos"]).optional(),
          priority: z.enum(["P1", "P2", "P3"]).optional(),
          problem: z.string().max(2000).optional(),
          assigneeLabel: z.string().max(120).optional(),
          siteLabel: z.string().max(120).optional(),
          notes: z.string().max(4000).optional(),
          costNote: z.string().max(400).optional(),
          checklist: z.record(z.string(), z.boolean()).optional(),
        })
        .parse(req.body ?? {});
      const result = await updateMaintenance(
        req.session.user!.id,
        req.params.productId,
        req.params.interventionId,
        body,
        req.ip,
      );
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, intervention: result.intervention });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
