import { Router } from "express";
import { prisma } from "../../db.js";
import { requireDriver } from "../../middleware/auth.js";

export function createDriverRouter() {
  const router = Router();
  router.use(requireDriver);

  router.get("/me", async (req, res, next) => {
    try {
      const profile = await prisma.driverProfile.findUnique({
        where: { userId: req.session.user!.id },
      });
      if (!profile) {
        res.status(404).json({ error: "Profil livreur introuvable." });
        return;
      }
      res.json({
        profile: {
          id: profile.id,
          fullName: profile.fullName,
          zone: profile.zone,
          vehicleInfo: profile.vehicleInfo,
          status: profile.status,
          rejectionReason: profile.rejectionReason,
        },
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
