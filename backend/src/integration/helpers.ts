import type { Express } from "express";
import supertest, { type SuperAgentTest } from "supertest";
import { createApp } from "../app.js";
import { loadEnv } from "../config/env.js";
import type { Env } from "../config/env.js";
import { prisma } from "../db.js";
import { applyIntegrationTestEnv } from "./env.js";

let appInstance: Express | null = null;
let envInstance: Env | null = null;

function getTestApp(): Express {
  if (!appInstance) {
    applyIntegrationTestEnv();
    envInstance = loadEnv();
    appInstance = createApp(envInstance);
  }
  return appInstance;
}

export function apiAgent() {
  return supertest.agent(getTestApp());
}

export async function fetchCsrf(agent: ReturnType<typeof apiAgent>): Promise<string> {
  const res = await agent.get("/api/v1/csrf");
  if (res.status !== 200) {
    throw new Error(`CSRF fetch failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.csrfToken as string;
}

export async function postJson(
  agent: ReturnType<typeof apiAgent>,
  path: string,
  body: Record<string, unknown>,
): Promise<supertest.Response> {
  const csrf = await fetchCsrf(agent);
  return agent.post(path).set("x-csrf-token", csrf).send(body);
}

export async function patchJson(
  agent: ReturnType<typeof apiAgent>,
  path: string,
  body: Record<string, unknown>,
): Promise<supertest.Response> {
  const csrf = await fetchCsrf(agent);
  return agent.patch(path).set("x-csrf-token", csrf).send(body);
}

export async function clearExpressSessions(): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM express_session`);
  } catch {
    /* Table créée au premier démarrage de l’API (connect-pg-simple). */
  }
}

export async function resetIntegrationData(): Promise<void> {
  await prisma.auditLog.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productUnavailability.deleteMany();
  await prisma.product.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.document.deleteMany();
  await prisma.partnerProfile.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.user.deleteMany();
  await clearExpressSessions();
}

/** Réservé aux tests : simule une analyse antivirus réussie (jamais exposé en API publique). */
export async function markDocumentCleanForIntegrationTest(documentId: string): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("markDocumentCleanForIntegrationTest réservé à NODE_ENV=test");
  }
  await prisma.document.update({
    where: { id: documentId },
    data: { scanStatus: "CLEAN" },
  });
}


export async function postFile(
  agent: ReturnType<typeof apiAgent>,
  path: string,
  field: string,
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<supertest.Response> {
  const csrf = await fetchCsrf(agent);
  return agent.post(path).set("x-csrf-token", csrf).attach(field, buffer, { filename, contentType });
}

export { getTestApp, getTestApp as app, envInstance as env, prisma };
