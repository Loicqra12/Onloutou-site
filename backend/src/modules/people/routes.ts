import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../../middleware/auth.js";
import {
  getClientDetail,
  getDriverDetail,
  getPartnerDetail,
  listClients,
  listDrivers,
  listPartners,
  reviewDriver,
  reviewPartner,
  setUserAccountStatus,
} from "./service.js";

const listQuerySchema = z.object({
  q: z.string().max(120).optional(),
  role: z.string().max(40).optional(),
  status: z.string().max(40).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().min(0).optional(),
});

const reviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(2000).optional(),
});

const accountStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export function createPeopleRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/clients", async (req, res, next) => {
    try {
      const query = listQuerySchema.parse(req.query);
      res.json(await listClients(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/clients/:id", async (req, res, next) => {
    try {
      const result = await getClientDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ user: result.user });
    } catch (err) {
      next(err);
    }
  });

  router.get("/partners", async (req, res, next) => {
    try {
      const query = listQuerySchema.parse(req.query);
      res.json(await listPartners(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/partners/:id", async (req, res, next) => {
    try {
      const result = await getPartnerDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ partner: result.partner });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/partners/:id/review", async (req, res, next) => {
    try {
      const body = reviewSchema.parse(req.body);
      const result = await reviewPartner(req.session.user!.id, req.params.id, body.decision, body.reason, req.ip);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      const detail = await getPartnerDetail(req.params.id);
      res.json({ ok: true, partner: detail.ok ? detail.partner : null });
    } catch (err) {
      next(err);
    }
  });

  router.get("/drivers", async (req, res, next) => {
    try {
      const query = listQuerySchema.parse(req.query);
      res.json(await listDrivers(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/drivers/:id", async (req, res, next) => {
    try {
      const result = await getDriverDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ driver: result.driver });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/drivers/:id/review", async (req, res, next) => {
    try {
      const body = reviewSchema.parse(req.body);
      const result = await reviewDriver(req.session.user!.id, req.params.id, body.decision, body.reason, req.ip);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      const detail = await getDriverDetail(req.params.id);
      res.json({ ok: true, driver: detail.ok ? detail.driver : null });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/users/:id/status", async (req, res, next) => {
    try {
      const body = accountStatusSchema.parse(req.body);
      const result = await setUserAccountStatus(req.session.user!.id, req.params.id, body.status, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, status: result.user.status });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
