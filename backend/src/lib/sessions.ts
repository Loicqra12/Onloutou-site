import { prisma } from "../db.js";

/** Supprime les sessions Express persistées pour un utilisateur. */
export async function revokeAllSessionsForUser(userId: string): Promise<void> {
  try {
    await prisma.$executeRaw`
      DELETE FROM express_session
      WHERE sess::jsonb -> 'user' ->> 'id' = ${userId}
    `;
  } catch {
    /* Table absente tant que l’API n’a pas démarré. */
  }
}

/** Invalide toutes les sessions existantes (mot de passe, suspension, etc.). */
export async function bumpUserAuthEpoch(userId: string): Promise<number> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { authEpoch: { increment: 1 } },
    select: { authEpoch: true },
  });
  await revokeAllSessionsForUser(userId);
  return user.authEpoch;
}
