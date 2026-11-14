import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../../middleware/auth.js";
import {
  getAuditEvent,
  getReportsDesk,
  getSettingsTaxonomy,
  getTeamMember,
  listAuditDesk,
  listTeam,
  setTeamMemberStatus,
} from "./ops-desk.js";

export function createAdminOpsRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/team", async (req, res, next) => {
    try {
      const query = z
        .object({
          q: z.string().max(120).optional(),
          status: z.string().max(40).optional(),
        })
        .parse(req.query);
      res.json(await listTeam(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/team/:id", async (req, res, next) => {
    try {
      const result = await getTeamMember(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ member: result.member });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/team/:id/status", async (req, res, next) => {
    try {
      const body = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) }).parse(req.body ?? {});
      const result = await setTeamMemberStatus(req.session.user!.id, req.params.id, body.status, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      const detail = await getTeamMember(req.params.id);
      res.json({ ok: true, status: result.status, member: detail.ok ? detail.member : null });
    } catch (err) {
      next(err);
    }
  });

  router.get("/settings/taxonomy", async (_req, res, next) => {
    try {
      res.json(await getSettingsTaxonomy());
    } catch (err) {
      next(err);
    }
  });

  router.get("/audit-desk", async (req, res, next) => {
    try {
      const query = z
        .object({
          q: z.string().max(120).optional(),
          action: z.string().max(80).optional(),
          level: z.string().max(40).optional(),
          take: z.coerce.number().int().min(1).max(200).optional(),
        })
        .parse(req.query);
      res.json(await listAuditDesk(query));
    } catch (err) {
      next(err);
    }
  });

  router.get("/audit-desk/:id", async (req, res, next) => {
    try {
      const result = await getAuditEvent(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ event: result.event });
    } catch (err) {
      next(err);
    }
  });

  router.get("/reports", async (_req, res, next) => {
    try {
      res.json(await getReportsDesk());
    } catch (err) {
      next(err);
    }
  });

  return router;
}
