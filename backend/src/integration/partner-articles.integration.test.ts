import { describe, expect, it, beforeEach } from "vitest";
import { hashPassword } from "../lib/password.js";
import {
  apiAgent,
  patchJson,
  postFile,
  postJson,
  prisma,
  resetIntegrationData,
} from "./helpers.js";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const PASSWORD = "PartnerPass123!";

async function registerPartner(email: string, organizationName: string) {
  const agent = apiAgent();
  const res = await postJson(agent, "/api/v1/auth/register/partner", {
    email,
    password: PASSWORD,
    displayName: "Awa Test",
    organizationName,
    partnerType: "SUPPLIER",
    termsAccepted: true,
  });
  expect(res.status).toBe(201);
  return agent;
}

async function approvePartner(email: string) {
  const adminAgent = apiAgent();
  const existing = await prisma.user.findUnique({ where: { email: "admin-articles@test.ci" } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: "admin-articles@test.ci",
        passwordHash: await hashPassword("AdminPass12345!"),
        role: "ADMIN",
        status: "ACTIVE",
        displayName: "Admin Articles",
      },
    });
  }
  const login = await postJson(adminAgent, "/api/v1/auth/login", {
    email: "admin-articles@test.ci",
    password: "AdminPass12345!",
  });
  expect(login.status).toBe(200);
  const profile = await prisma.partnerProfile.findFirst({ where: { user: { email } } });
  expect(profile).not.toBeNull();
  const review = await patchJson(adminAgent, `/api/v1/admin/applications/partners/${profile!.id}`, {
    decision: "APPROVED",
  });
  expect(review.status).toBe(200);
  return adminAgent;
}

async function createDraft(agent: ReturnType<typeof apiAgent>, body: Record<string, unknown> = {}) {
  const res = await postJson(agent, "/api/v1/partner/products", {
    title: "Nouvelle fiche",
    ...body,
  });
  expect(res.status).toBe(201);
  expect(res.body.product.reference).toMatch(/^ART-\d{3,}$/);
  return res.body.product as { id: string; reference: string };
}

async function addPhoto(agent: ReturnType<typeof apiAgent>, productId: string) {
  const res = await postFile(agent, `/api/v1/partner/products/${productId}/images`, "file", PNG, "photo.png", "image/png");
  expect(res.status).toBe(201);
  return res;
}

const fridgeTerms = {
  quantity: 2,
  rentalMode: "UNIT" as const,
  priceAmount: 18000,
  pricePeriod: "WEEK" as const,
  minDuration: "1_WEEK",
  depositKind: "TO_DISCUSS" as const,
  commune: "Cocody",
  pickup: true,
  delivery: true,
  deliveryZone: "Abidjan",
  deliveryFees: "À convenir",
  availableFrom: "NOW",
};

describe("Partner articles t63", () => {
  beforeEach(async () => {
    await resetIntegrationData();
  });

  it("enregistre un frigo de 2 unités avec 1 indisponible du 20 au 25 novembre 2026", async () => {
    const agent = await registerPartner("fridge@test.ci", "Awa Location");
    await approvePartner("fridge@test.ci");
    const created = await createDraft(agent, { title: "Réfrigérateur 250 L" });
    await addPhoto(agent, created.id);
    const saved = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      title: "Réfrigérateur 250 L",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      description: "Réfrigérateur 250 litres, deux unités identiques.",
      specs: { capacity: "250 L" },
      terms: fridgeTerms,
      unavailabilities: [{ startDate: "2026-11-20", endDate: "2026-11-25", quantity: 1 }],
    });
    expect(saved.status).toBe(200);
    expect(saved.body.product.terms.quantity).toBe(2);
    expect(saved.body.product.unavailabilities).toHaveLength(1);
    expect(saved.body.product.unavailabilities[0]).toMatchObject({
      startDate: "2026-11-20",
      endDate: "2026-11-25",
      quantity: 1,
    });
    const submitted = await postJson(agent, `/api/v1/partner/products/${created.id}/submit`, {});
    expect(submitted.status).toBe(200);
    expect(submitted.body.product.status).toBe("PENDING_REVIEW");
    expect(submitted.body.product.reference).toBe(created.reference);
  });

  it("sépare clairement 4 lots de 25 assiettes", async () => {
    const agent = await registerPartner("plates@test.ci", "Awa Location");
    await approvePartner("plates@test.ci");
    const created = await createDraft(agent);
    await addPhoto(agent, created.id);
    const saved = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      title: "Lots d’assiettes",
      familySlug: "reception",
      categorySlug: "vaisselle",
      condition: "Bon état",
      description: "Assiettes pour réception.",
      specs: { composition: "25 assiettes par lot" },
      terms: {
        quantity: 4,
        rentalMode: "LOT",
        lotCount: 4,
        piecesPerLot: 25,
        priceAmount: 8000,
        pricePeriod: "DAY",
        minDuration: "1_DAY",
        depositKind: "TO_DISCUSS",
        commune: "Cocody",
        pickup: true,
      },
    });
    expect(saved.status).toBe(200);
    expect(saved.body.product.terms).toMatchObject({ rentalMode: "LOT", lotCount: 4, piecesPerLot: 25, quantity: 4 });
  });

  it("accepte une fiche de 6 ordinateurs", async () => {
    const agent = await registerPartner("computers@test.ci", "Awa Location");
    await approvePartner("computers@test.ci");
    const created = await createDraft(agent, { title: "Ordinateurs portables" });
    await addPhoto(agent, created.id);
    const saved = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      title: "Ordinateurs portables",
      familySlug: "informatique",
      categorySlug: "ordinateurs-portables",
      condition: "Excellent état",
      description: "Six ordinateurs portables identiques.",
      specs: { memory: "16 Go" },
      terms: {
        quantity: 6,
        rentalMode: "UNIT",
        priceAmount: 25000,
        pricePeriod: "WEEK",
        minDuration: "1_WEEK",
        depositKind: "TO_DISCUSS",
        commune: "Cocody",
        pickup: true,
      },
    });
    expect(saved.status).toBe(200);
    expect(saved.body.product.terms.quantity).toBe(6);
  });

  it("bloque la soumission d’un partenaire non approuvé, côté serveur", async () => {
    const agent = await registerPartner("pending@test.ci", "En attente");
    const created = await createDraft(agent, { title: "Réfrigérateur 250 L" });
    await addPhoto(agent, created.id);
    await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      title: "Réfrigérateur 250 L",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      description: "Fiche complète, profil non approuvé.",
      terms: fridgeTerms,
    });
    const submit = await postJson(agent, `/api/v1/partner/products/${created.id}/submit`, {});
    expect(submit.status).toBe(400);
    expect(submit.body.error).toMatch(/validation|approuv|attente/i);
  });

  it("rejette un chevauchement d’indisponibilités incohérent", async () => {
    const agent = await registerPartner("overlap@test.ci", "Awa Location");
    await approvePartner("overlap@test.ci");
    const created = await createDraft(agent, { title: "Réfrigérateur 250 L" });
    const saved = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      terms: { quantity: 2, rentalMode: "UNIT" },
      unavailabilities: [
        { startDate: "2026-11-20", endDate: "2026-11-25", quantity: 2 },
        { startDate: "2026-11-24", endDate: "2026-11-26", quantity: 1 },
      ],
    });
    expect(saved.status).toBe(400);
    expect(saved.body.error).toMatch(/dépasse|2026-11-24/i);
  });

  it("refuse une 5e photo et un fichier de plus de 5 Mo", async () => {
    const agent = await registerPartner("upload@test.ci", "Awa Location");
    await approvePartner("upload@test.ci");
    const created = await createDraft(agent);
    for (let i = 0; i < 4; i += 1) {
      const res = await addPhoto(agent, created.id);
      expect(res.status).toBe(201);
    }
    const fifth = await postFile(agent, `/api/v1/partner/products/${created.id}/images`, "file", PNG, "cinq.png", "image/png");
    expect(fifth.status).toBe(400);
    expect(fifth.body.error).toMatch(/quatre/i);

    const tooBig = Buffer.alloc(5 * 1024 * 1024 + 1, 1);
    tooBig[0] = 0x89;
    tooBig[1] = 0x50;
    tooBig[2] = 0x4e;
    tooBig[3] = 0x47;
    const oversized = await postFile(
      agent,
      `/api/v1/partner/products/${created.id}/images`,
      "file",
      tooBig,
      "gros.png",
      "image/png",
    );
    expect(oversized.status).toBe(400);
    expect(String(oversized.body.error ?? "")).toMatch(/5 Mo|taille/i);
  });

  it("conserve un brouillon après enregistrement, puis permet la resoumission après correction admin", async () => {
    const agent = await registerPartner("cycle@test.ci", "Awa Location");
    const admin = await approvePartner("cycle@test.ci");
    const created = await createDraft(agent, { title: "Réfrigérateur 250 L" });
    await addPhoto(agent, created.id);
    const saved = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      title: "Réfrigérateur 250 L",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      description: "Description initiale.",
      specs: { capacity: "250 L" },
      terms: fridgeTerms,
    });
    expect(saved.status).toBe(200);

    const reloaded = await agent.get(`/api/v1/partner/products/${created.id}`);
    expect(reloaded.status).toBe(200);
    expect(reloaded.body.product.title).toBe("Réfrigérateur 250 L");
    expect(reloaded.body.product.specs.capacity).toBe("250 L");

    const submitted = await postJson(agent, `/api/v1/partner/products/${created.id}/submit`, {});
    expect(submitted.status).toBe(200);

    const correction = await patchJson(admin, `/api/v1/admin/products/${created.id}/review`, {
      decision: "REJECTED",
      reason: "Merci d’ajouter une photo de la plaque signalétique.",
    });
    expect(correction.status).toBe(200);
    expect(correction.body.product.status).toBe("REJECTED");

    const listed = await agent.get("/api/v1/partner/products");
    const row = listed.body.products.find((item: { id: string }) => item.id === created.id);
    expect(row.status).toBe("REJECTED");
    expect(row.rejectionReason).toMatch(/plaque/i);

    const updated = await patchJson(agent, `/api/v1/partner/products/${created.id}`, {
      description: "Description complétée après correction.",
    });
    expect(updated.status).toBe(200);
    const resubmit = await postJson(agent, `/api/v1/partner/products/${created.id}/submit`, {});
    expect(resubmit.status).toBe(200);
    expect(resubmit.body.product.status).toBe("PENDING_REVIEW");
  });

  it("expose la taxonomie commune", async () => {
    const res = await apiAgent().get("/api/v1/catalog/taxonomy");
    expect(res.status).toBe(200);
    expect(res.body.families.some((f: { slug: string }) => f.slug === "electromenager")).toBe(true);
    expect(res.body.families.some((f: { slug: string }) => f.slug === "enfance")).toBe(true);
  });
});
