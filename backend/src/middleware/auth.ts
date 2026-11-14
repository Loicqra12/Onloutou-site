import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  displayName: string | null;
  authEpoch: number;
  emailVerified: boolean;
};

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
    csrfReady?: boolean;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    res.status(401).json({ error: "Authentification requise." });
    return;
  }
  next();
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session.user) {
      res.status(401).json({ error: "Authentification requise." });
      return;
    }
    if (!roles.includes(req.session.user.role)) {
      res.status(403).json({ error: "Accès refusé." });
      return;
    }
    next();
  };
}

export const requireAdmin = requireRoles("ADMIN", "STAFF");
export const requirePartner = requireRoles("PARTNER");
export const requireDriver = requireRoles("DRIVER");
