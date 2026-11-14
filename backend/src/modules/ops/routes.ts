import { Router } from "express";
import {
  getPartnerLocation,
  listPartnerLocations,
  listPartnerNotifications,
  markNotificationsRead,
} from "./service.js";

export function createPartnerOpsRouter() {
  const router = Router();

  router.get("/locations", async (req, res, next) => {
    try {
      res.json(await listPartnerLocations(req.session.user!.id));
    } catch (err) {
      next(err);
    }
  });

  router.get("/locations/:id", async (req, res, next) => {
    try {
      const result = await getPartnerLocation(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ location: result.location });
    } catch (err) {
      next(err);
    }
  });

  router.get("/notifications", async (req, res, next) => {
    try {
      res.json(await listPartnerNotifications(req.session.user!.id));
    } catch (err) {
      next(err);
    }
  });

  router.post("/notifications/read", async (req, res, next) => {
    try {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((id: unknown) => typeof id === "string") : undefined;
      res.json(await markNotificationsRead(req.session.user!.id, ids));
    } catch (err) {
      next(err);
    }
  });

  return router;
}
