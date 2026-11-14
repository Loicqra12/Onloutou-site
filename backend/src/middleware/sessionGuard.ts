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
    // Session périmée : on retire l'identité mais on laisse passer la requête.
    // Les routes protégées répondent 401 d'elles-mêmes ; les routes publiques (catalogue, formulaires)
    // restent utilisables au lieu d'être bloquées par un vieux cookie.
    delete req.session.user;
    next();
    return;
  }
  next();
}
