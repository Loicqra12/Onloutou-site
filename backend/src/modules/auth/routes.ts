import { Router } from "express";
import type { Env } from "../../config/env.js";
import { authLimiter, passwordResetLimiter } from "../../middleware/rateLimit.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  confirmPasswordReset,
  loginUser,
  registerDriver,
  registerPartner,
  requestPasswordReset,
} from "./service.js";
import {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerDriverSchema,
  registerPartnerSchema,
} from "./schemas.js";
import { writeAuditLog } from "../../lib/audit.js";

export function createAuthRouter(_env: Env) {
  const router = Router();

  router.post("/login", authLimiter, async (req, res, next) => {
    try {
      const body = loginSchema.parse(req.body);
      const result = await loginUser(body, req.ip);
      if (!result.ok) {
        res.status(401).json({ error: result.error });
        return;
      }
      req.session.user = result.user;
      res.json({ user: result.user });
    } catch (err) {
      next(err);
    }
  });

  router.post("/logout", requireAuth, async (req, res, next) => {
    try {
      const actorId = req.session.user?.id;
      req.session.destroy(async (destroyErr) => {
        if (destroyErr) {
          next(destroyErr);
          return;
        }
        res.clearCookie("onloutou.sid", { path: "/" });
        if (actorId) {
          await writeAuditLog({ action: "USER_LOGOUT", actorId, ip: req.ip });
        }
        res.status(204).send();
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/me", (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ error: "Non connecté." });
      return;
    }
    res.json({ user: req.session.user });
  });

  router.post("/register/partner", authLimiter, async (req, res, next) => {
    try {
      const body = registerPartnerSchema.parse(req.body);
      const result = await registerPartner(body);
      if (!result.ok) {
        res.status(409).json({ error: result.error });
        return;
      }
      req.session.user = result.user;
      res.status(201).json({ user: result.user });
    } catch (err) {
      next(err);
    }
  });

  router.post("/register/driver", authLimiter, async (req, res, next) => {
    try {
      const body = registerDriverSchema.parse(req.body);
      const result = await registerDriver(body);
      if (!result.ok) {
        res.status(409).json({ error: result.error });
        return;
      }
      req.session.user = result.user;
      res.status(201).json({ user: result.user });
    } catch (err) {
      next(err);
    }
  });

  router.post("/password/request", passwordResetLimiter, async (req, res, next) => {
    try {
      const body = passwordResetRequestSchema.parse(req.body);
      const result = await requestPasswordReset(body, req.ip);
      res.json({
        ok: true,
        message: "Si un compte existe, une procédure de réinitialisation pourra être envoyée.",
        ...(result.devToken ? { devToken: result.devToken } : {}),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/password/confirm", passwordResetLimiter, async (req, res, next) => {
    try {
      const body = passwordResetConfirmSchema.parse(req.body);
      const result = await confirmPasswordReset(body, req.ip);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
