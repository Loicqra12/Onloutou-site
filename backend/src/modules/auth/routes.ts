import { Router } from "express";
import type { Env } from "../../config/env.js";
import { mailConfigured } from "../../config/env.js";
import { authLimiter, passwordResetLimiter } from "../../middleware/rateLimit.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  confirmEmailVerification,
  confirmPasswordReset,
  loginUser,
  registerDriver,
  registerPartner,
  requestEmailVerification,
  requestPasswordReset,
  verifyTwoFactorLogin,
} from "./service.js";
import {
  emailConfirmSchema,
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerDriverSchema,
  registerPartnerSchema,
  twoFactorVerifySchema,
} from "./schemas.js";
import { writeAuditLog } from "../../lib/audit.js";
import { prisma } from "../../db.js";

export function createAuthRouter(env: Env) {
  const router = Router();

  router.post("/login", authLimiter, async (req, res, next) => {
    try {
      const body = loginSchema.parse(req.body);
      const result = await loginUser(body, req.ip);
      if (!result.ok) {
        res.status(401).json({ error: result.error });
        return;
      }
      if (result.twoFactorRequired) {
        res.json({ twoFactorRequired: true, challengeToken: result.challengeToken });
        return;
      }
      req.session.user = result.user;
      res.json({ user: result.user, twoFactorRequired: false });
    } catch (err) {
      next(err);
    }
  });

  router.post("/login/2fa", authLimiter, async (req, res, next) => {
    try {
      const body = twoFactorVerifySchema.parse(req.body);
      const result = await verifyTwoFactorLogin(body, req.ip);
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

  router.get("/me", async (req, res, next) => {
    try {
      if (!req.session.user) {
        res.status(401).json({ error: "Non connecté.", mailConfigured: mailConfigured(env) });
        return;
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: req.session.user.id },
        select: { emailVerifiedAt: true, displayName: true, phone: true },
      });
      const emailVerified = Boolean(dbUser?.emailVerifiedAt);
      if (req.session.user.emailVerified !== emailVerified || req.session.user.displayName !== (dbUser?.displayName ?? req.session.user.displayName)) {
        req.session.user = {
          ...req.session.user,
          emailVerified,
          displayName: dbUser?.displayName ?? req.session.user.displayName,
        };
      }
      res.json({
        user: {
          ...req.session.user,
          emailVerified,
          phone: dbUser?.phone ?? null,
        },
        mailConfigured: mailConfigured(env),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/register/partner", authLimiter, async (req, res, next) => {
    try {
      const body = registerPartnerSchema.parse(req.body);
      const result = await registerPartner(env, body);
      if (!result.ok) {
        res.status(409).json({ error: result.error });
        return;
      }
      req.session.user = result.user;
      res.status(201).json({
        user: result.user,
        verification: result.verification,
        mailConfigured: mailConfigured(env),
      });
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
      const result = await requestPasswordReset(env, body, req.ip);
      res.json({
        ok: true,
        sent: result.sent,
        message: result.message,
        mailConfigured: mailConfigured(env),
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
        res.status(400).json({ error: result.error, expired: true });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  router.post("/email/request", requireAuth, passwordResetLimiter, async (req, res, next) => {
    try {
      const result = await requestEmailVerification(env, req.session.user!.id);
      if (!result.ok) {
        res.status(400).json({ error: result.error, mailConfigured: mailConfigured(env) });
        return;
      }
      res.json({
        ok: true,
        sent: result.sent,
        alreadyVerified: result.alreadyVerified ?? false,
        message: result.message,
        mailConfigured: mailConfigured(env),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/email/confirm", authLimiter, async (req, res, next) => {
    try {
      const body = emailConfirmSchema.parse(req.body);
      const result = await confirmEmailVerification(body);
      if (!result.ok) {
        res.status(400).json({ error: result.error, expired: result.expired ?? true });
        return;
      }
      if (req.session.user) {
        req.session.user = { ...req.session.user, emailVerified: true };
      }
      res.json({ ok: true, verified: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
