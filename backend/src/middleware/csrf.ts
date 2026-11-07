import type { NextFunction, Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";
import type { Env } from "../config/env.js";

export function createCsrfProtection(env: Env) {
  const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.sessionID,
    cookieName: env.NODE_ENV === "production" ? "__Host-onloutou.csrf" : "onloutou.csrf",
    cookieOptions: {
      sameSite: "lax",
      secure: env.COOKIE_SECURE ?? env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    },
    size: 64,
  });

  function csrfTokenHandler(req: Request, res: Response): void {
    req.session.csrfReady = true;
    const token = generateCsrfToken(req, res);
    res.json({ csrfToken: token });
  }

  function csrfUnlessGet(req: Request, res: Response, next: NextFunction): void {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      next();
      return;
    }
    doubleCsrfProtection(req, res, next);
  }

  return { csrfTokenHandler, csrfUnlessGet };
}
