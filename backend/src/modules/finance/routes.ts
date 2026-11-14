import { Router } from "express";
import { getPartnerRevenue, listPartnerFinance } from "./service.js";

export function createPartnerFinanceRouter() {
  const router = Router();

  router.get("/revenues", async (req, res, next) => {
    try {
      res.json(await listPartnerFinance(req.session.user!.id));
    } catch (err) {
      next(err);
    }
  });

  router.get("/revenues/:id", async (req, res, next) => {
    try {
      const result = await getPartnerRevenue(req.session.user!.id, req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ revenue: result.revenue });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
