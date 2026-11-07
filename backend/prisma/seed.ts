import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password.js";

const prisma = new PrismaClient();

async function main() {
  if (process.env.ENABLE_DEV_SEED !== "true" && process.env.ENABLE_DEV_SEED !== "1") {
    console.log("Seed ignoré (ENABLE_DEV_SEED non activé).");
    return;
  }
  const email = "demo-partner@onloutou.local";
  const passwordHash = await hashPassword("DemoPartner2026!");
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "PARTNER",
      displayName: "Partenaire démo",
      partnerProfile: {
        create: {
          organizationName: "Fournisseur démo",
          partnerType: "SUPPLIER",
          zone: "Abidjan",
          status: "APPROVED",
        },
      },
    },
  });
  console.log("Seed développement : partenaire démo créé (non production).");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
