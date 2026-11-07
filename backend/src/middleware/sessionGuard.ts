import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db.js";

/** Vérifie que la session correspond encore à l’utilisateur en base (rôle, statut, epoch). */
export async function validateSessionUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const sessionUser = req.session.user;
  if (!sessionUser) {
    next();
    return;
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      displayName: true,
      authEpoch: true,
    },
  });
  if (
    !dbUser ||
    dbUser.status !== "ACTIVE" ||
    dbUser.authEpoch !== sessionUser.authEpoch ||
    dbUser.role !== sessionUser.role ||
    dbUser.email !== sessionUser.email
  ) {
    req.session.destroy(() => {
      res.status(401).json({ error: "Session expirée." });
    });
    return;
  }
  next();
}
