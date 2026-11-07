#!/usr/bin/env tsx
import { loadBackendEnv } from "../src/load-env.js";
loadBackendEnv();

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password.js";

// Garde : ne jamais créer l'admin de test hors d'une base de test autorisée.
const dbName = process.env.DATABASE_URL?.match(/\/([^/?]+)(\?|$)/)?.[1] ?? "";
if (!/^onloutou_(audit|e2e|integration|test)$/.test(dbName)) {
  console.error(`Refus : « ${dbName || "?"} » n'est pas une base de test autorisée. Aucune écriture.`);
  process.exit(1);
}

const prisma = new PrismaClient();

const email = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const password = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";

async function main() {
  const passwordHash = await hashPassword(password);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", status: "ACTIVE" },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      displayName: "Admin E2E",
    },
  });
  console.log(`E2E admin prêt : ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
