#!/usr/bin/env tsx
import { loadBackendEnv } from "../src/load-env.js";
loadBackendEnv();

import { bootstrapAdmin } from "../src/modules/auth/service.js";
import { loadEnv } from "../src/config/env.js";
import { promptPassword } from "../src/lib/prompt-password.js";

async function main() {
  loadEnv();
  const email = process.argv[2];
  const displayName = process.argv[3] ?? "Administrateur ONLOUTOU";
  if (!email) {
    console.error("Usage: npm run bootstrap:admin -- <email> [nom affiché]");
    console.error("Le mot de passe est demandé de façon masquée (non enregistré dans l’historique).");
    process.exit(1);
  }
  const password =
    process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim() ||
    (await promptPassword("Mot de passe administrateur (12 caractères min.) : "));
  if (password.length < 12) {
    console.error("Mot de passe trop court (12 caractères minimum).");
    process.exit(1);
  }
  const user = await bootstrapAdmin(email, password, displayName);
  console.log(`Administrateur créé : ${user.email} (${user.id})`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
