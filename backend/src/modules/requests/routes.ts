import { Router } from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { publicSubmitLimiter } from "../../middleware/rateLimit.js";
import {
  createContactRequestSchema,
  createGenericRequestSchema,
  listRequestsQuerySchema,
  updateRequestStatusSchema,
} from "./schemas.js";
import {
  createServiceRequest,
  fromContactForm,
  fromGenericForm,
  getRequestDetail,
  listRequestsForAdmin,
  updateRequestStatus,
} from "./service.js";

export function createPublicRequestsRouter() {
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

export function createAdminRequestsRouter() {
  const router = Router();
  router.use(requireAdmin);

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
