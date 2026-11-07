import { loadBackendEnv } from "./load-env.js";
loadBackendEnv();

import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { prisma } from "./db.js";

const env = loadEnv();
const app = createApp(env);
const server = app.listen(env.PORT, () => {
  console.log(`ONLOUTOU API listening on :${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, closing…`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
