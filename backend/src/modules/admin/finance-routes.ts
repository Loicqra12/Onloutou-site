import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../../middleware/auth.js";
import {
  blockPayout,
  getDepositDetail,
  getInvoiceDetail,
  getPaymentDetail,
  getPayoutDetail,
  listDeposits,
  listInvoices,
  listPayments,
  listPayouts,
  reconcilePayment,
  schedulePayout,
} from "./finance-desk.js";

const listQuery = z.object({
  q: z.string().max(120).optional(),
  type: z.string().max(40).optional(),
  status: z.string().max(40).optional(),
});

export function createAdminFinanceRouter() {
  const router = Router();
  router.use(requireAdmin);

  router.get("/payments", async (req, res, next) => {
    try {
      res.json(await listPayments(listQuery.parse(req.query)));
    } catch (err) {
      next(err);
    }
  });

  router.get("/payments/:id", async (req, res, next) => {
    try {
      const result = await getPaymentDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ payment: result.payment });
    } catch (err) {
      next(err);
    }
  });

  router.post("/payments/:id/reconcile", async (req, res, next) => {
    try {
      const result = await reconcilePayment(req.params.id, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, payment: result.payment });
    } catch (err) {
      next(err);
    }
  });

  router.get("/deposits", async (req, res, next) => {
    try {
      res.json(await listDeposits(listQuery.parse(req.query)));
    } catch (err) {
      next(err);
    }
  });

  router.get("/deposits/:id", async (req, res, next) => {
    try {
      const result = await getDepositDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ deposit: result.deposit });
    } catch (err) {
      next(err);
    }
  });

  router.get("/payouts", async (req, res, next) => {
    try {
      res.json(await listPayouts(listQuery.parse(req.query)));
    } catch (err) {
      next(err);
    }
  });

  router.get("/payouts/:id", async (req, res, next) => {
    try {
      const result = await getPayoutDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ payout: result.payout });
    } catch (err) {
      next(err);
    }
  });

  router.post("/payouts/:id/schedule", async (req, res, next) => {
    try {
      const result = await schedulePayout(req.params.id, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, payout: result.payout });
    } catch (err) {
      next(err);
    }
  });

  router.post("/payouts/:id/block", async (req, res, next) => {
    try {
      const body = z.object({ reason: z.string().min(2).max(2000) }).parse(req.body ?? {});
      const result = await blockPayout(req.params.id, body.reason, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, payout: result.payout });
    } catch (err) {
      next(err);
    }
  });

  router.get("/invoices", async (req, res, next) => {
    try {
      res.json(await listInvoices(listQuery.parse(req.query)));
    } catch (err) {
      next(err);
    }
  });

  router.get("/invoices/:id", async (req, res, next) => {
    try {
      const result = await getInvoiceDetail(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ invoice: result.invoice });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
