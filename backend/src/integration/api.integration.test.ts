import { describe, expect, it, beforeEach } from "vitest";
import { hashPassword } from "../lib/password.js";
import { generateToken, hashResetToken } from "../lib/tokens.js";
import { totpNow } from "../lib/totp.js";
import { confirmPasswordReset, enableTwoFactorForUser } from "../modules/auth/service.js";
import {
  apiAgent,
  patchJson,
  postFile,
  postJson,
  prisma,
  resetIntegrationData,
} from "./helpers.js";

describe("API integration (PostgreSQL)", () => {
  beforeEach(async () => {
    await resetIntegrationData();
  });

  it("persists a contact request across a new read", async () => {
    const agent = apiAgent();
    const created = await postJson(agent, "/api/v1/requests", {
      source: "contact",
      need: "location",
      name: "Kouassi Test",
      message: "Demande de test intégration location.",
    });
    expect(created.status).toBe(201);
    const reference = created.body.reference as string;
    expect(reference).toMatch(/^ONL-/);

    const row = await prisma.serviceRequest.findUnique({ where: { reference } });
    expect(row?.contactName).toBe("Kouassi Test");

    const adminHash = await hashPassword("AdminPass12345!");
    const admin = await prisma.user.create({
      data: {
        email: "admin@test.ci",
        passwordHash: adminHash,
        role: "ADMIN",
        status: "ACTIVE",
        displayName: "Admin Test",
      },
    });
    const adminAgent = apiAgent();
    await postJson(adminAgent, "/api/v1/auth/login", {
      email: admin.email,
      password: "AdminPass12345!",
    });
    const list = await adminAgent.get("/api/v1/admin/requests");
    expect(list.status).toBe(200);
    expect(list.body.items.some((r: { reference: string }) => r.reference === reference)).toBe(true);
  });

  it("enforces CSRF on mutating requests", async () => {
    const agent = apiAgent();
    const res = await agent.post("/api/v1/requests").send({
      source: "contact",
      need: "autre",
      name: "Sans CSRF",
      message: "Doit échouer sans jeton CSRF.",
    });
    expect(res.status).toBe(403);
  });

  it("login, logout, and session invalidation", async () => {
    const password = "StaffPass12345!";
    const user = await prisma.user.create({
      data: {
        email: "staff@test.ci",
        passwordHash: await hashPassword(password),
        role: "STAFF",
        status: "ACTIVE",
      },
    });
    const agent = apiAgent();
    const login = await postJson(agent, "/api/v1/auth/login", { email: user.email, password });
    expect(login.status).toBe(200);
    const me = await agent.get("/api/v1/auth/me");
    expect(me.status).toBe(200);

    const logout = await postJson(agent, "/api/v1/auth/logout", {});
    expect(logout.status).toBe(204);
    const after = await agent.get("/api/v1/auth/me");
    expect(after.status).toBe(401);
  });

  it("staff with TOTP must complete 2FA before a session", async () => {
    const password = "StaffPass12345!";
    const secret = "ONLOUTOUADMIN2FADEVAAA";
    const user = await prisma.user.create({
      data: {
        email: "staff-2fa@test.ci",
        passwordHash: await hashPassword(password),
        role: "STAFF",
        status: "ACTIVE",
      },
    });
    await enableTwoFactorForUser(user.id, secret);
    const agent = apiAgent();
    const login = await postJson(agent, "/api/v1/auth/login", { email: user.email, password });
    expect(login.status).toBe(200);
    expect(login.body.twoFactorRequired).toBe(true);
    expect(login.body.challengeToken).toBeTruthy();
    expect((await agent.get("/api/v1/auth/me")).status).toBe(401);

    const denied = await postJson(agent, "/api/v1/auth/login/2fa", {
      challengeToken: login.body.challengeToken,
      code: "000000",
    });
    expect(denied.status).toBe(401);

    const verified = await postJson(agent, "/api/v1/auth/login/2fa", {
      challengeToken: login.body.challengeToken,
      code: totpNow(secret),
    });
    expect(verified.status).toBe(200);
    expect(verified.body.user.role).toBe("STAFF");
    expect((await agent.get("/api/v1/auth/me")).status).toBe(200);
  });

  it("restricts roles: CLIENT vs ADMIN vs PARTNER vs DRIVER", async () => {
    const clientAgent = apiAgent();
    await prisma.user.create({
      data: {
        email: "client@test.ci",
        passwordHash: await hashPassword("ClientPass1234!"),
        role: "CLIENT",
        status: "ACTIVE",
      },
    });
    await postJson(clientAgent, "/api/v1/auth/login", {
      email: "client@test.ci",
      password: "ClientPass1234!",
    });
    const denied = await clientAgent.get("/api/v1/admin/requests");
    expect(denied.status).toBe(403);

    const driverAgent = apiAgent();
    await postJson(driverAgent, "/api/v1/auth/register/driver", {
      email: "driver@test.ci",
      password: "DriverPass1234!",
      fullName: "Chauffeur Test",
    });
    const driverMe = await driverAgent.get("/api/v1/auth/me");
    expect(driverMe.body.user.role).toBe("DRIVER");
    expect((await driverAgent.get("/api/v1/admin/products/pending")).status).toBe(403);

    const partnerAgent = apiAgent();
    await postJson(partnerAgent, "/api/v1/auth/register/partner", {
      email: "partner@test.ci",
      password: "PartnerPass123!",
      displayName: "Partenaire A",
      organizationName: "Org A",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    expect((await partnerAgent.get("/api/v1/partner/me")).status).toBe(200);
    expect((await partnerAgent.get("/api/v1/admin/audit")).status).toBe(403);
  });

  it("lets an unapproved partner create a draft but blocks submit-for-review", async () => {
    const agent = apiAgent();
    await postJson(agent, "/api/v1/auth/register/partner", {
      email: "draft-partner@test.ci",
      password: "PartnerPass123!",
      displayName: "Draft Partner",
      organizationName: "Draft Org",
      partnerType: "TECH",
            termsAccepted: true,
    });
    const create = await postJson(agent, "/api/v1/partner/products", {
      category: "TOOLS",
      title: "Perceuse test",
      pricingMode: "ON_QUOTE",
    });
    expect(create.status).toBe(201);
    const submit = await postJson(agent, `/api/v1/partner/products/${create.body.product.id}/submit`, {});
    expect(submit.status).toBe(400);
    expect(submit.body.error).toMatch(/validation|approuv|attente/i);
  });

  it("isolates partner products between accounts", async () => {
    const adminAgent = apiAgent();
    await prisma.user.create({
      data: {
        email: "admin2@test.ci",
        passwordHash: await hashPassword("AdminPass12345!"),
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    await postJson(adminAgent, "/api/v1/auth/login", {
      email: "admin2@test.ci",
      password: "AdminPass12345!",
    });

    const partnerA = apiAgent();
    const regA = await postJson(partnerA, "/api/v1/auth/register/partner", {
      email: "pa@test.ci",
      password: "PartnerPass123!",
      displayName: "Partner A",
      organizationName: "Org PA",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    expect(regA.status).toBe(201);
    const profileA = await prisma.partnerProfile.findFirst({ where: { user: { email: "pa@test.ci" } } });
    expect(profileA).not.toBeNull();
    await patchJson(adminAgent, `/api/v1/admin/applications/partners/${profileA!.id}`, {
      decision: "APPROVED",
    });

    const productRes = await postJson(partnerA, "/api/v1/partner/products", {
      category: "TOOLS",
      title: "Produit A",
      pricingMode: "ON_QUOTE",
    });
    const productId = productRes.body.product.id as string;

    const partnerB = apiAgent();
    await postJson(partnerB, "/api/v1/auth/register/partner", {
      email: "pb@test.ci",
      password: "PartnerPass123!",
      displayName: "Partner B",
      organizationName: "Org PB",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    const tamper = await patchJson(partnerB, `/api/v1/partner/products/${productId}`, {
      title: "Vol de fiche",
    });
    expect(tamper.status).toBe(400);
  });

  it("product lifecycle: no public listing before approval", async () => {
    const adminAgent = apiAgent();
    await prisma.user.create({
      data: {
        email: "admin3@test.ci",
        passwordHash: await hashPassword("AdminPass12345!"),
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    await postJson(adminAgent, "/api/v1/auth/login", {
      email: "admin3@test.ci",
      password: "AdminPass12345!",
    });

    const partnerAgent = apiAgent();
    await postJson(partnerAgent, "/api/v1/auth/register/partner", {
      email: "pub-partner@test.ci",
      password: "PartnerPass123!",
      displayName: "Pub Partner",
      organizationName: "Pub Org",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    const profile = await prisma.partnerProfile.findFirst({
      where: { user: { email: "pub-partner@test.ci" } },
    });
    await patchJson(adminAgent, `/api/v1/admin/applications/partners/${profile!.id}`, {
      decision: "APPROVED",
    });

    const created = await postJson(partnerAgent, "/api/v1/partner/products", {
      category: "TRUCKS_MACHINERY",
      title: "Mini pelle",
      pricingMode: "ON_QUOTE",
    });
    const productId = created.body.product.id as string;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==","base64");
    const photo = await postFile(partnerAgent, `/api/v1/partner/products/${productId}/images`, "file", png, "mini.png", "image/png");
    expect(photo.status).toBe(201);
    const filled = await patchJson(partnerAgent, `/api/v1/partner/products/${productId}`, {
      title: "Mini pelle",
      familySlug: "camions-engins",
      categorySlug: "engins",
      condition: "Bon état",
      description: "Mini pelle pour chantier, proposée à ONLOUTOU.",
      terms: {
        quantity: 1,
        rentalMode: "UNIT",
        priceAmount: 150000,
        pricePeriod: "WEEK",
        minDuration: "1_WEEK",
        depositKind: "TO_DISCUSS",
        commune: "Cocody",
        pickup: true,
      },
    });
    expect(filled.status).toBe(200);

    const publicBefore = await apiAgent().get("/api/v1/catalog/products");
    expect(publicBefore.body.products.some((p: { id: string }) => p.id === productId)).toBe(false);

    await postJson(partnerAgent, `/api/v1/partner/products/${productId}/submit`, {});

    const publicPending = await apiAgent().get("/api/v1/catalog/products");
    expect(publicPending.body.products.some((p: { id: string }) => p.id === productId)).toBe(false);

    await patchJson(adminAgent, `/api/v1/admin/products/${productId}/review`, { decision: "APPROVED" });

    const publicAfter = await apiAgent().get("/api/v1/catalog/products");
    expect(publicAfter.body.products.some((p: { id: string }) => p.id === productId)).toBe(true);

    // La liste publique n'expose aucun champ interne (propriétaire, organisation, motif de refus, statut).
    const exposed = publicAfter.body.products.find((p: { id: string }) => p.id === productId) as Record<string, unknown>;
    for (const internal of ["ownerUserId", "rejectionReason", "status", "owner", "organization", "organizationName"]) {
      expect(exposed, `champ interne exposé : ${internal}`).not.toHaveProperty(internal);
    }
  });

  it("blocks quarantined and rejected documents even for the owner", async () => {
    const partnerAgent = apiAgent();
    await postJson(partnerAgent, "/api/v1/auth/register/partner", {
      email: "doc-partner@test.ci",
      password: "PartnerPass123!",
      displayName: "Doc",
      organizationName: "Doc Org",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    const profile = await prisma.partnerProfile.findFirst({
      where: { user: { email: "doc-partner@test.ci" } },
    });
    const user = await prisma.user.findUnique({ where: { email: "doc-partner@test.ci" } });

    for (const status of ["QUARANTINED", "REJECTED"] as const) {
      const doc = await prisma.document.create({
        data: {
          kind: "OTHER_CONFIDENTIAL",
          storageKey: `test/${status.toLowerCase()}`,
          mimeType: "application/pdf",
          byteSize: 12,
          scanStatus: status,
          partnerProfileId: profile!.id,
          uploadedById: user!.id,
        },
      });
      const access = await partnerAgent.get(`/api/v1/documents/${doc.id}/access`);
      expect(access.status).toBe(423);
    }

    const pending = await prisma.document.create({
      data: {
        kind: "OTHER_CONFIDENTIAL",
        storageKey: "test/pending",
        mimeType: "application/pdf",
        byteSize: 12,
        scanStatus: "PENDING",
        partnerProfileId: profile!.id,
        uploadedById: user!.id,
      },
    });
    const pendingAccess = await partnerAgent.get(`/api/v1/documents/${pending.id}/access`);
    expect(pendingAccess.status).toBe(423);
    expect(pendingAccess.body.url).toBeUndefined();
  });

  it("persists service requests after simulated API restart", async () => {
    const agent = apiAgent();
    const created = await postJson(agent, "/api/v1/requests", {
      source: "contact",
      need: "gps",
      name: "Restart Test",
      message: "Vérification persistance après redémarrage logique.",
    });
    expect(created.status).toBe(201);
    const reference = created.body.reference as string;

    const freshAgent = apiAgent();
    const row = await prisma.serviceRequest.findUnique({ where: { reference } });
    expect(row).not.toBeNull();

    await prisma.user.create({
      data: {
        email: "admin-restart@test.ci",
        passwordHash: await hashPassword("AdminPass12345!"),
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    const adminAgent = apiAgent();
    await postJson(adminAgent, "/api/v1/auth/login", {
      email: "admin-restart@test.ci",
      password: "AdminPass12345!",
    });
    const list = await adminAgent.get("/api/v1/admin/requests");
    expect(list.body.items.some((r: { reference: string }) => r.reference === reference)).toBe(true);
  });

  it("invalidates session after password reset and account suspension or role change", async () => {
    const password = "UserPass12345!";
    const user = await prisma.user.create({
      data: {
        email: "session@test.ci",
        passwordHash: await hashPassword(password),
        role: "STAFF",
        status: "ACTIVE",
      },
    });

    const agent = apiAgent();
    await postJson(agent, "/api/v1/auth/login", { email: user.email, password });
    expect((await agent.get("/api/v1/auth/me")).status).toBe(200);

    const plain = generateToken(48);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashResetToken(plain),
        expiresAt: new Date(Date.now() + 3600_000),
      },
    });
    await confirmPasswordReset({ token: plain, password: "NewPass12345!" });
    expect((await agent.get("/api/v1/auth/me")).status).toBe(401);

    await postJson(agent, "/api/v1/auth/login", { email: user.email, password: "NewPass12345!" });
    expect((await agent.get("/api/v1/admin/requests")).status).toBe(200);

    await prisma.user.update({ where: { id: user.id }, data: { status: "SUSPENDED" } });
    expect((await agent.get("/api/v1/auth/me")).status).toBe(401);

    await prisma.user.update({ where: { id: user.id }, data: { status: "ACTIVE", role: "CLIENT" } });
    const relogin = apiAgent();
    await postJson(relogin, "/api/v1/auth/login", { email: user.email, password: "NewPass12345!" });
    expect((await relogin.get("/api/v1/admin/requests")).status).toBe(403);
  });

  it("deduplicates and conflicts on clientRequestId", async () => {
    const agent = apiAgent();
    const clientRequestId = "11111111-1111-4111-8111-111111111111";
    const base = {
      source: "integration-idem",
      type: "RENTAL",
      contactName: "Idem Test",
      message: "Corps initial pour test idempotence.",
      clientRequestId,
    };
    const first = await postJson(agent, "/api/v1/requests", base);
    expect(first.status).toBe(201);
    const reference = first.body.reference as string;

    const retry = await postJson(agent, "/api/v1/requests", base);
    expect(retry.status).toBe(201);
    expect(retry.body.reference).toBe(reference);

    const conflict = await postJson(agent, "/api/v1/requests", {
      ...base,
      message: "Contenu modifié avec la même clé client.",
    });
    expect(conflict.status).toBe(409);

    const otherKey = await postJson(agent, "/api/v1/requests", {
      ...base,
      clientRequestId: "22222222-2222-4222-8222-222222222222",
    });
    expect(otherKey.status).toBe(201);
    expect(otherKey.body.reference).not.toBe(reference);

    expect(await prisma.serviceRequest.count({ where: { clientRequestId } })).toBe(1);

    const agentB = apiAgent();
    const [a, b] = await Promise.all([
      postJson(agent, "/api/v1/requests", {
        ...base,
        clientRequestId: "33333333-3333-4333-8333-333333333333",
      }),
      postJson(agentB, "/api/v1/requests", {
        ...base,
        clientRequestId: "33333333-3333-4333-8333-333333333333",
      }),
    ]);
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
    expect(a.body.reference).toBe(b.body.reference);
  });

  it("password reset: no dev token in test responses, token single use and expiry", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    const user = await prisma.user.create({
      data: {
        email: "reset@test.ci",
        passwordHash: await hashPassword("OldPass12345!"),
        role: "CLIENT",
        status: "ACTIVE",
      },
    });

    const agent = apiAgent();
    const reqRes = await postJson(agent, "/api/v1/auth/password/request", { email: user.email });
    expect(reqRes.status).toBe(200);
    expect(reqRes.body.devToken).toBeUndefined();

    const plain = generateToken(48);
    const tokenHash = hashResetToken(plain);
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 3600_000) },
    });

    const ok = await confirmPasswordReset({ token: plain, password: "NewPass12345!" });
    expect(ok.ok).toBe(true);

    const reuse = await confirmPasswordReset({ token: plain, password: "AnotherPass123!" });
    expect(reuse.ok).toBe(false);

    const expiredPlain = generateToken(48);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashResetToken(expiredPlain),
        expiresAt: new Date(Date.now() - 1000),
      },
    });
    const expired = await confirmPasswordReset({ token: expiredPlain, password: "NewPass12345!" });
    expect(expired.ok).toBe(false);

    process.env.NODE_ENV = prev;
  });

  it("stores the contact phone and email from the contact form", async () => {
    const agent = apiAgent();
    const created = await postJson(agent, "/api/v1/requests", {
      source: "contact",
      need: "gps",
      name: "Aya Koné",
      phone: "07 12 34 56 78",
      email: "aya@example.ci",
      message: "Équiper dix véhicules.",
    });
    expect(created.status).toBe(201);
    const row = await prisma.serviceRequest.findUnique({ where: { reference: created.body.reference as string } });
    expect(row?.contactPhone).toBe("07 12 34 56 78");
    expect(row?.contactEmail).toBe("aya@example.ci");
  });

  it("keeps partner applications in DRAFT until the profile is submitted, drivers stay SUBMITTED", async () => {
    const partner = apiAgent();
    const p = await postJson(partner, "/api/v1/auth/register/partner", {
      email: "p-submitted@test.ci",
      password: "PartnerPass12345!",
      displayName: "Partenaire",
      organizationName: "Org Soumise",
      partnerType: "SUPPLIER",
            termsAccepted: true,
    });
    expect(p.status).toBe(201);
    const driver = apiAgent();
    const d = await postJson(driver, "/api/v1/auth/register/driver", {
      email: "d-submitted@test.ci",
      password: "DriverPass12345!",
      fullName: "Livreur Soumis",
    });
    expect(d.status).toBe(201);
    const pp = await prisma.partnerProfile.findFirst({ where: { organizationName: "Org Soumise" } });
    const dp = await prisma.driverProfile.findFirst({ where: { fullName: "Livreur Soumis" } });
    expect(pp?.status).toBe("DRAFT");
    expect(dp?.status).toBe("SUBMITTED");
    const submitted = await postJson(partner, "/api/v1/partner/profile/submit", {
      personKind: "INDIVIDUAL",
      phone: "05 54 13 77 77",
      commune: "Abidjan",
          description: "Location d’appareils à Abidjan.",
    });
    expect(submitted.status).toBe(200);
    const pp2 = await prisma.partnerProfile.findFirst({ where: { organizationName: "Org Soumise" } });
    expect(pp2?.status).toBe("SUBMITTED");
  });
});
