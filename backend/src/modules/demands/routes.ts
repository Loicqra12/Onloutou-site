import { Router } from "express";
import { getPartnerDemand, listPartnerDemands, respondPartnerDemand } from "./service.js";
import { demandReplySchema } from "./schemas.js";

export function createPartnerDemandsRouter() {
  const router = Router();

  router.get("/demands", async (req, res, next) => {
    try {
      const data = await listPartnerDemands(req.session.user!.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });

  router.get("/demands/:id", async (req, res, next) => {
    try {
      const result = await getPartnerDemand(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ demand: result.demand });
    } catch (err) {
      next(err);
    }
  });

  router.post("/demands/:id/respond", async (req, res, next) => {
    try {
      const body = demandReplySchema.parse(req.body);
      const result = await respondPartnerDemand(req.session.user!.id, req.params.id, body);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ demand: result.demand });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
