import { Router } from "express";
import type { Env } from "../../config/env.js";
import { notifyNewRequest } from "../../lib/mailer.js";
import { requireAdmin } from "../../middleware/auth.js";
import { publicSubmitLimiter } from "../../middleware/rateLimit.js";
import {
  createAdminDossierSchema,
  createContactRequestSchema,
  createGenericRequestSchema,
  authorizeDepartureSchema,
  confirmRentalSchema,
  createPartnerDemandSchema,
  followUpProposalSchema,
  listRequestsQuerySchema,
  parkCheckSchema,
  recordAgreementSchema,
  recordPartnerCollectSchema,
  saveArrivalControlSchema,
  saveArticlePrepSchema,
  saveLogisticsPlanSchema,
  closeDossierSchema,
  saveDepositDecisionSchema,
  savePartnerPayoutSchema,
  savePartnerRestitutionSchema,
  saveProposalSchema,
  saveReceiptProofSchema,
  saveRefusalSchema,
  saveReturnDepotSchema,
  saveReturnPickupSchema,
  saveReturnPlanSchema,
  saveSelectionSchema,
  searchArticlesQuerySchema,
  transmitProposalSchema,
  updateRequestStatusSchema,
  verifyPaymentSchema,
} from "./schemas.js";
import {
  closeDossier,
  saveDepositDecision,
  savePartnerPayout,
} from "./closure.js";
import {
  authorizeDeparture,
  recordPartnerCollection,
  saveArrivalControl,
  saveArticlePreparation,
  saveLogisticsPlan,
  savePartnerRestitution,
  saveReceiptProof,
  saveRefusalReport,
  saveReturnDepotControl,
  saveReturnPickup,
  saveReturnPlan,
} from "./logistics.js";
import {
  confirmAndReserveRental,
  createAdminPartnerDemand,
  createProposalVersion,
  listRequestDemands,
  markProposalReady,
  recordClientAgreement,
  saveDossierProposal,
  saveDossierSelection,
  saveParkCheck,
  scheduleProposalFollowUp,
  searchArticlesForAdmin,
  transmitProposal,
  verifyInitialPayment,
} from "./offer.js";
import {
  createAdminDossier,
  createServiceRequest,
  fromContactForm,
  fromGenericForm,
  getRequestDetail,
  listRequestsForAdmin,
  listStaffActors,
  searchRequestContacts,
  updateRequestStatus,
} from "./service.js";

export function createPublicRequestsRouter(env: Env) {
  const router = Router();

  router.post("/", publicSubmitLimiter, async (req, res, next) => {
    try {
      const contactParsed = createContactRequestSchema.safeParse(req.body);
      if (contactParsed.success) {
        const mapped = fromContactForm(contactParsed.data);
        const created = await createServiceRequest({
          ...mapped,
          submitterUserId: req.session.user?.id,
          actorId: req.session.user?.id,
          ip: req.ip,
          clientRequestId: contactParsed.data.clientRequestId,
          onCreated: (request) => void notifyNewRequest(env, request),
        });
        res.status(201).json({
          ok: true,
          reference: created.reference,
          recordedAt: created.createdAt.toISOString(),
        });
        return;
      }
      const generic = createGenericRequestSchema.parse(req.body);
      const mapped = fromGenericForm(generic);
      const created = await createServiceRequest({
        ...mapped,
        submitterUserId: req.session.user?.id,
        actorId: req.session.user?.id,
        ip: req.ip,
        clientRequestId: generic.clientRequestId,
        onCreated: (request) => void notifyNewRequest(env, request),
      });
      res.status(201).json({
        ok: true,
        reference: created.reference,
        recordedAt: created.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createAdminRequestsRouter(env: Env) {
  const router = Router();
  router.use(requireAdmin);

  router.get("/staff", async (_req, res, next) => {
    try {
      const items = await listStaffActors();
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.get("/contacts", async (req, res, next) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const items = await searchRequestContacts(q);
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const body = createAdminDossierSchema.parse(req.body);
      const result = await createAdminDossier(body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const query = listRequestsQuerySchema.parse(req.query);
      const data = await listRequestsForAdmin(query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const detail = await getRequestDetail(req.params.id);
      if (!detail) {
        res.status(404).json({ error: "Demande introuvable." });
        return;
      }
      res.json({ request: detail });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id/articles", async (req, res, next) => {
    try {
      const query = searchArticlesQuerySchema.parse(req.query);
      const items = await searchArticlesForAdmin(query);
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/selection", async (req, res, next) => {
    try {
      const body = saveSelectionSchema.parse(req.body);
      const result = await saveDossierSelection(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/partner-demands", async (req, res, next) => {
    try {
      const body = createPartnerDemandSchema.parse(req.body);
      const result = await createAdminPartnerDemand(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json({ ok: true, demand: result.demand, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id/partner-demands", async (req, res, next) => {
    try {
      const result = await listRequestDemands(req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json({ items: result.items });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/park-check", async (req, res, next) => {
    try {
      const body = parkCheckSchema.parse(req.body);
      const result = await saveParkCheck(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/proposal", async (req, res, next) => {
    try {
      const body = saveProposalSchema.parse(req.body);
      const result = await saveDossierProposal(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/proposal/ready", async (req, res, next) => {
    try {
      const result = await markProposalReady(req.params.id, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/proposal/transmit", async (req, res, next) => {
    try {
      const body = transmitProposalSchema.parse(req.body);
      const result = await transmitProposal(req.params.id, body, req.session.user!.id, env, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({
        ok: true,
        emailSent: result.emailSent,
        emailNote: result.emailNote,
        shareUrl: result.shareUrl,
        request: result.request,
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/proposal/follow-up", async (req, res, next) => {
    try {
      const body = followUpProposalSchema.parse(req.body);
      const result = await scheduleProposalFollowUp(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/proposal/new-version", async (req, res, next) => {
    try {
      const result = await createProposalVersion(req.params.id, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/proposal/agreement", async (req, res, next) => {
    try {
      const body = recordAgreementSchema.parse(req.body);
      const result = await recordClientAgreement(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/payment/verify", async (req, res, next) => {
    try {
      const body = verifyPaymentSchema.parse(req.body);
      const result = await verifyInitialPayment(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/rental/confirm", async (req, res, next) => {
    try {
      const body = confirmRentalSchema.parse(req.body ?? {});
      const result = await confirmAndReserveRental(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/plan", async (req, res, next) => {
    try {
      const body = saveLogisticsPlanSchema.parse(req.body);
      const result = await saveLogisticsPlan(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/preparation", async (req, res, next) => {
    try {
      const body = saveArticlePrepSchema.parse(req.body);
      const result = await saveArticlePreparation(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/logistics/collect", async (req, res, next) => {
    try {
      const body = recordPartnerCollectSchema.parse(req.body);
      const result = await recordPartnerCollection(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/logistics/depart", async (req, res, next) => {
    try {
      const body = authorizeDepartureSchema.parse(req.body ?? {});
      const result = await authorizeDeparture(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/arrival", async (req, res, next) => {
    try {
      const body = saveArrivalControlSchema.parse(req.body);
      const result = await saveArrivalControl(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/handover", async (req, res, next) => {
    try {
      const body = saveReceiptProofSchema.parse(req.body ?? {});
      const result = await saveReceiptProof(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/refusal", async (req, res, next) => {
    try {
      const body = saveRefusalSchema.parse(req.body);
      const result = await saveRefusalReport(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/return/plan", async (req, res, next) => {
    try {
      const body = saveReturnPlanSchema.parse(req.body ?? {});
      const result = await saveReturnPlan(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/return/pickup", async (req, res, next) => {
    try {
      const body = saveReturnPickupSchema.parse(req.body);
      const result = await saveReturnPickup(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/return/depot", async (req, res, next) => {
    try {
      const body = saveReturnDepotSchema.parse(req.body);
      const result = await saveReturnDepotControl(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/logistics/return/partner", async (req, res, next) => {
    try {
      const body = savePartnerRestitutionSchema.parse(req.body);
      const result = await savePartnerRestitution(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/closure/deposit", async (req, res, next) => {
    try {
      const body = saveDepositDecisionSchema.parse(req.body ?? {});
      const result = await saveDepositDecision(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/closure/payout", async (req, res, next) => {
    try {
      const body = savePartnerPayoutSchema.parse(req.body ?? {});
      const result = await savePartnerPayout(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.post("/:id/closure/close", async (req, res, next) => {
    try {
      const body = closeDossierSchema.parse(req.body ?? {});
      const result = await closeDossier(req.params.id, body, req.session.user!.id, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true, request: result.request });
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:id/status", async (req, res, next) => {
    try {
      const body = updateRequestStatusSchema.parse(req.body);
      const updated = await updateRequestStatus({
        id: req.params.id,
        status: body.status,
        note: body.note,
        actorId: req.session.user!.id,
        ip: req.ip,
      });
      res.json({ request: updated });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
