import { hashPassword } from "../src/lib/password.js";
import { prisma } from "../src/db.js";
import { enableTwoFactorForUser } from "../src/modules/auth/service.js";
import { asTerms, computeLocationGross, splitCommission } from "../src/modules/finance/billing.js";

const PASSWORD = process.env.T63_PASSWORD ?? "PartnerPass123!";

const IMG = {
  fridge: "/assets/images/electromenager/webp/Réfrigérateur inox dans un intérieur lumineux-15.webp",
  fridgeOpen: "/assets/images/electromenager/webp/Réfrigérateur inox ouvert en cuisine lumineuse-6.webp",
  plates: "/assets/images/produits/Pile d’assiettes blanches en porcelaine-2.webp",
  laptop: "/assets/images/produits/Portable professionnel avec vue sur Abidjan-9.webp",
};

async function addImages(productId: string, paths: string[]) {
  await prisma.productImage.createMany({
    data: paths.map((storageKey, sortOrder) => ({
      productId,
      storageKey,
      mimeType: "image/webp",
      byteSize: 1,
      sortOrder,
      isPublic: true,
    })),
  });
}

async function upsertPartner(email: string, approved: boolean, organizationName: string) {
  const passwordHash = await hashPassword(PASSWORD);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "PARTNER",
      status: "ACTIVE",
      displayName: "Awa Test",
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
    create: {
      email,
      passwordHash,
      role: "PARTNER",
      status: "ACTIVE",
      displayName: "Awa Test",
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
  });
  await prisma.partnerProfile.upsert({
    where: { userId: user.id },
    update: {
      status: approved ? "APPROVED" : "DRAFT",
      organizationName,
      partnerType: "SUPPLIER",
      commune: "Marcory",
      commercialName: organizationName,
      personKind: "INDIVIDUAL",
      description: "Location d’articles pour les particularités du foyer et des événements.",
      rejectionReason: null,
      commissionBps: 1500,
    },
    create: {
      userId: user.id,
      organizationName,
      partnerType: "SUPPLIER",
      commune: "Marcory",
      commercialName: organizationName,
      personKind: "INDIVIDUAL",
      description: "Location d’articles pour les particularités du foyer et des événements.",
      status: approved ? "APPROVED" : "DRAFT",
      commissionBps: 1500,
    },
  });
  await prisma.partnerNotification.deleteMany({ where: { userId: user.id } });
  await prisma.partnerRevenue.deleteMany({ where: { partnerProfile: { userId: user.id } } });
  await prisma.partnerPayout.deleteMany({ where: { partnerProfile: { userId: user.id } } });
  await prisma.partnerLocation.deleteMany({ where: { partnerProfile: { userId: user.id } } });
  await prisma.partnerDemand.deleteMany({ where: { partnerProfile: { userId: user.id } } });
  await prisma.product.deleteMany({ where: { ownerUserId: user.id } });
  return { userId: user.id, profileId: (await prisma.partnerProfile.findUniqueOrThrow({ where: { userId: user.id } })).id };
}

export const T63_ADMIN_TOTP_SECRET = "ONLOUTOUADMIN2FADEVAAA";

async function upsertAdmin() {
  const email = "t63-admin@onloutou.test";
  const passwordHash = await hashPassword("AdminPass12345!");
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", status: "ACTIVE", displayName: "Admin T63" },
    create: { email, passwordHash, role: "ADMIN", status: "ACTIVE", displayName: "Admin T63" },
  });
  await enableTwoFactorForUser(user.id, T63_ADMIN_TOTP_SECRET);
}

async function seedJourney(userId: string, profileId: string) {
  const fridgeTerms = {
    quantity: 2,
    rentalMode: "UNIT",
    priceAmount: 15000,
    pricePeriod: "WEEK",
    minDuration: "1_WEEK",
    depositKind: "TO_DISCUSS",
    commune: "Marcory",
    pickup: true,
    delivery: true,
    deliveryZone: "Abidjan",
    deliveryFees: "À convenir",
    availableFrom: "NOW",
  };

  const fridge = await prisma.product.create({
    data: {
      partnerProfileId: profileId,
      ownerUserId: userId,
      category: "APPLIANCES",
      title: "Réfrigérateur 250 L",
      description: "Réfrigérateur 250 litres, idéal pour un appartement.",
      status: "APPROVED",
      publishedAt: new Date(),
      reference: "ART-101",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      specs: { capacity: "250 L" },
      terms: fridgeTerms,
      unavailabilities: {
        create: {
          startDate: new Date("2026-11-20T00:00:00.000Z"),
          endDate: new Date("2026-11-25T00:00:00.000Z"),
          quantity: 1,
          reason: "Entretien",
        },
      },
    },
  });
  await addImages(fridge.id, [IMG.fridge]);

  const rejected = await prisma.product.create({
    data: {
      partnerProfileId: profileId,
      ownerUserId: userId,
      category: "APPLIANCES",
      title: "Réfrigérateur 250 L",
      description: "Réfrigérateur avec compartiment congélateur, propre et fonctionnel.",
      status: "REJECTED",
      rejectionReason: "Merci d’ajouter une photo nette de l’intérieur et de préciser les dimensions de l’appareil.",
      reference: "ART-102",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      specs: { capacity: "250 L" },
      terms: fridgeTerms,
    },
  });
  await prisma.productImage.create({
    data: { productId: rejected.id, storageKey: IMG.fridge, mimeType: "image/webp", byteSize: 1, sortOrder: 0, isPublic: true },
  });
  const interior = await prisma.productImage.create({
    data: { productId: rejected.id, storageKey: IMG.fridgeOpen, mimeType: "image/webp", byteSize: 1, sortOrder: 1, isPublic: true },
  });
  await prisma.product.update({
    where: { id: rejected.id },
    data: {
      corrections: {
        message: "Merci d’ajouter une photo nette de l’intérieur et de préciser les dimensions de l’appareil.",
        items: [
          { kind: "replace_photo", imageId: interior.id, title: "Photo de l’intérieur" },
          { kind: "dimensions" },
        ],
      },
    },
  });

  const plates = await prisma.product.create({
    data: {
      partnerProfileId: profileId,
      ownerUserId: userId,
      category: "EVENTS",
      title: "Lot de 25 assiettes",
      description: "Service de table pour réception.",
      status: "APPROVED",
      publishedAt: new Date(),
      reference: "ART-103",
      familySlug: "reception",
      categorySlug: "vaisselle",
      condition: "Bon état",
      specs: {},
      terms: { ...fridgeTerms, quantity: 4, rentalMode: "LOT", lotCount: 4, piecesPerLot: 25 },
    },
  });
  await addImages(plates.id, [IMG.plates]);
  const laptop = await prisma.product.create({
    data: {
      partnerProfileId: profileId,
      ownerUserId: userId,
      category: "IT",
      title: "Ordinateur portable",
      description: "Portable pour usage professionnel.",
      status: "APPROVED",
      publishedAt: new Date(),
      reference: "ART-104",
      familySlug: "informatique",
      categorySlug: "ordinateurs-portables",
      condition: "Bon état",
      specs: { memory: "16 Go" },
      terms: { ...fridgeTerms, quantity: 3, commune: "Plateau" },
    },
  });
  await addImages(laptop.id, [IMG.laptop]);

  const draft = await prisma.product.create({
    data: {
      partnerProfileId: profileId,
      ownerUserId: userId,
      category: "APPLIANCES",
      title: "Réfrigérateur compact",
      description: "Brouillon non envoyé.",
      status: "DRAFT",
      reference: "ART-105",
      familySlug: "electromenager",
      categorySlug: "refrigerateurs",
      condition: "Bon état",
      specs: {},
      terms: { ...fridgeTerms, quantity: 1 },
    },
  });
  await addImages(draft.id, [IMG.fridge]);

  const dem1 = await prisma.partnerDemand.create({
    data: {
      reference: "DEM-001",
      partnerProfileId: profileId,
      productId: fridge.id,
      status: "PENDING",
      requestedQty: 2,
      startDate: new Date("2026-11-20T00:00:00.000Z"),
      endDate: new Date("2026-11-25T00:00:00.000Z"),
      commune: "Cocody",
      deliveryRequested: true,
      brief: "Deux réfrigérateurs pour un événement temporaire. Livraison et reprise souhaitées à Cocody.",
      toClarify: ["Adresse exacte", "Créneaux de livraison et de reprise", "Frais de transport"],
    },
  });
  const dem2 = await prisma.partnerDemand.create({
    data: {
      reference: "DEM-002",
      partnerProfileId: profileId,
      productId: plates.id,
      status: "ANSWERED",
      requestedQty: 4,
      startDate: new Date("2026-11-28T00:00:00.000Z"),
      endDate: new Date("2026-11-29T00:00:00.000Z"),
      commune: "Cocody",
      deliveryRequested: true,
      brief: "Service de table pour un cocktail.",
      replyKind: "AVAILABLE",
      replyQty: 4,
      replyStart: new Date("2026-11-28T00:00:00.000Z"),
      replyEnd: new Date("2026-11-29T00:00:00.000Z"),
      replyDelivery: "Possible",
      replyFees: "À convenir",
      replyMessage: "Les lots sont disponibles pour ces dates.",
      repliedAt: new Date(),
      outcome: "SELECTED",
      outcomeNote: "Proposition retenue pour le cocktail du 28 novembre.",
    },
  });
  const loc = await prisma.partnerLocation.create({
    data: {
      reference: "LOC-001",
      partnerProfileId: profileId,
      productId: plates.id,
      demandId: dem2.id,
      status: "TO_PREPARE",
      quantity: 4,
      startDate: new Date("2026-11-28T00:00:00.000Z"),
      endDate: new Date("2026-11-29T00:00:00.000Z"),
      commune: "Cocody",
      delivery: "Livraison et reprise",
      fees: "À convenir",
      addressNote: "L’adresse exacte sera transmise 48 h avant par ONLOUTOU.",
      onloutouNote: "Merci de préparer 4 lots. Un créneau de livraison à Cocody sera confirmé.",
    },
  });
  const dem3 = await prisma.partnerDemand.create({
    data: {
      reference: "DEM-003",
      partnerProfileId: profileId,
      productId: laptop.id,
      status: "CLOSED",
      requestedQty: 3,
      startDate: new Date("2026-11-10T00:00:00.000Z"),
      endDate: new Date("2026-11-12T00:00:00.000Z"),
      commune: "Plateau",
      deliveryRequested: false,
      brief: "Trois portables pour une formation.",
      replyKind: "AVAILABLE",
      replyQty: 3,
      repliedAt: new Date(),
      outcome: "DECLINED",
      outcomeNote: "Le client a retenu une autre proposition. Merci pour votre réponse.",
    },
  });
  await prisma.partnerDemand.create({
    data: {
      reference: "DEM-004",
      partnerProfileId: profileId,
      productId: laptop.id,
      status: "ANSWERED",
      requestedQty: 2,
      startDate: new Date("2026-12-04T00:00:00.000Z"),
      endDate: new Date("2026-12-06T00:00:00.000Z"),
      commune: "Marcory",
      deliveryRequested: true,
      brief: "Deux portables pour un atelier.",
      replyKind: "ADJUSTMENT",
      replyQty: 1,
      replyStart: new Date("2026-12-04T00:00:00.000Z"),
      replyEnd: new Date("2026-12-06T00:00:00.000Z"),
      replyDelivery: "Possible",
      replyFees: "À convenir",
      replyMessage: "Un appareil est disponible sur ces dates.",
      repliedAt: new Date(),
      outcome: "WAITING",
    },
  });

  const dem5 = await prisma.partnerDemand.create({
    data: {
      reference: "DEM-005",
      partnerProfileId: profileId,
      productId: fridge.id,
      status: "CLOSED",
      requestedQty: 1,
      startDate: new Date("2026-10-06T00:00:00.000Z"),
      endDate: new Date("2026-10-12T00:00:00.000Z"),
      commune: "Cocody",
      deliveryRequested: true,
      brief: "Un réfrigérateur pour un chantier de une semaine.",
      replyKind: "AVAILABLE",
      replyQty: 1,
      repliedAt: new Date("2026-09-20T00:00:00.000Z"),
      outcome: "SELECTED",
      outcomeNote: "Location terminée. Reprise confirmée.",
    },
  });
  const loc2 = await prisma.partnerLocation.create({
    data: {
      reference: "LOC-002",
      partnerProfileId: profileId,
      productId: fridge.id,
      demandId: dem5.id,
      status: "COMPLETED",
      quantity: 1,
      startDate: new Date("2026-10-06T00:00:00.000Z"),
      endDate: new Date("2026-10-12T00:00:00.000Z"),
      commune: "Cocody",
      delivery: "Livraison et reprise",
      fees: "À convenir",
      onloutouNote: "Location terminée. Le revenu est en attente de reversement.",
    },
  });
  const pendingSplit = splitCommission(
    computeLocationGross(asTerms(fridgeTerms), loc2.quantity, loc2.startDate, loc2.endDate),
    1500,
  );
  const revPending = await prisma.partnerRevenue.create({
    data: {
      reference: "REV-001",
      partnerProfileId: profileId,
      locationId: loc2.id,
      productId: fridge.id,
      grossAmount: pendingSplit.commissionAmount + pendingSplit.netAmount,
      commissionBps: pendingSplit.commissionBps,
      commissionAmount: pendingSplit.commissionAmount,
      netAmount: pendingSplit.netAmount,
      status: "PENDING",
    },
  });

  const dem6 = await prisma.partnerDemand.create({
    data: {
      reference: "DEM-006",
      partnerProfileId: profileId,
      productId: laptop.id,
      status: "CLOSED",
      requestedQty: 2,
      startDate: new Date("2026-09-01T00:00:00.000Z"),
      endDate: new Date("2026-09-14T00:00:00.000Z"),
      commune: "Plateau",
      deliveryRequested: false,
      brief: "Deux portables pour une mission de deux semaines.",
      replyKind: "AVAILABLE",
      replyQty: 2,
      repliedAt: new Date("2026-08-20T00:00:00.000Z"),
      outcome: "SELECTED",
      outcomeNote: "Location terminée et reversée.",
    },
  });
  const loc3 = await prisma.partnerLocation.create({
    data: {
      reference: "LOC-003",
      partnerProfileId: profileId,
      productId: laptop.id,
      demandId: dem6.id,
      status: "COMPLETED",
      quantity: 2,
      startDate: new Date("2026-09-01T00:00:00.000Z"),
      endDate: new Date("2026-09-14T00:00:00.000Z"),
      commune: "Plateau",
      delivery: "Retrait",
      fees: "Sans frais",
      onloutouNote: "Location terminée. Reversement effectué.",
    },
  });
  const paidGross = computeLocationGross(asTerms({ ...fridgeTerms, quantity: 3, commune: "Plateau" }), loc3.quantity, loc3.startDate, loc3.endDate);
  const paidSplit = splitCommission(paidGross, 1500);
  const payout = await prisma.partnerPayout.create({
    data: {
      reference: "PAY-001",
      partnerProfileId: profileId,
      amount: paidSplit.netAmount,
      method: "MOBILE_MONEY",
      paidAt: new Date("2026-11-10T10:00:00.000Z"),
      note: "Reversement Wave, 10 novembre 2026.",
    },
  });
  const revPaid = await prisma.partnerRevenue.create({
    data: {
      reference: "REV-002",
      partnerProfileId: profileId,
      locationId: loc3.id,
      productId: laptop.id,
      grossAmount: paidGross,
      commissionBps: paidSplit.commissionBps,
      commissionAmount: paidSplit.commissionAmount,
      netAmount: paidSplit.netAmount,
      status: "PAID",
      payoutId: payout.id,
    },
  });

  await prisma.partnerNotification.createMany({
    data: [
      {
        userId,
        kind: "LOCATION",
        title: "Votre proposition a été retenue.",
        body: "ONLOUTOU confirme 4 lots d’assiettes à Cocody, du 28 au 29 novembre.",
        href: `/espace-partenaire/locations/${loc.id}`,
        readAt: null,
      },
      {
        userId,
        kind: "DEMAND",
        title: "Une nouvelle demande à traiter.",
        body: "Deux réfrigérateurs sont demandés à Cocody du 20 au 25 novembre.",
        href: `/espace-partenaire/demandes/${dem1.id}`,
        readAt: null,
      },
      {
        userId,
        kind: "DEMAND",
        title: "Une demande n’a pas été retenue.",
        body: "La demande d’ordinateurs portables (DEM-003) a été clôturée.",
        href: `/espace-partenaire/demandes/${dem3.id}`,
        readAt: new Date(),
      },
      {
        userId,
        kind: "ARTICLE",
        title: "Votre réfrigérateur 250 L est publié.",
        body: "La fiche ART-101 est visible sur le site.",
        href: `/espace-partenaire/articles/${fridge.id}`,
        readAt: new Date(),
      },
      {
        userId,
        kind: "PAYOUT",
        title: "Un reversement a été effectué.",
        body: "ONLOUTOU a reversé le montant net de la location LOC-003.",
        href: `/espace-partenaire/revenus/${revPaid.id}`,
        readAt: null,
      },
      {
        userId,
        kind: "PAYOUT",
        title: "Un revenu est à recevoir.",
        body: "La location LOC-002 est terminée. Le reversement sera effectué par ONLOUTOU.",
        href: `/espace-partenaire/revenus/${revPending.id}`,
        readAt: null,
      },
    ],
  });
}

async function main() {
  await upsertAdmin();
  const approved = await upsertPartner(process.env.T63_APPROVED_EMAIL ?? "t63-approved@onloutou.test", true, "Awa Location");
  await seedJourney(approved.userId, approved.profileId);
  await upsertPartner(process.env.T63_DRAFT_EMAIL ?? "t63-draft@onloutou.test", false, "Profil en préparation");
  const refused = await prisma.user.upsert({
    where: { email: process.env.T63_REJECTED_EMAIL ?? "t63-rejected@onloutou.test" },
    update: {
      passwordHash: await hashPassword(PASSWORD),
      role: "PARTNER",
      status: "ACTIVE",
      displayName: "Koffi Test",
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
    create: {
      email: process.env.T63_REJECTED_EMAIL ?? "t63-rejected@onloutou.test",
      passwordHash: await hashPassword(PASSWORD),
      role: "PARTNER",
      status: "ACTIVE",
      displayName: "Koffi Test",
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
  });
  await prisma.partnerProfile.upsert({
    where: { userId: refused.id },
    update: {
      status: "REJECTED",
      organizationName: "Koffi Location",
      partnerType: "SUPPLIER",
      commune: "Yopougon",
      commercialName: "Koffi Location",
      personKind: "INDIVIDUAL",
      description: "Location ponctuelle d’articles du foyer.",
      rejectionReason: "Merci de préciser votre activité de location et une commune d’intervention régulière.",
    },
    create: {
      userId: refused.id,
      organizationName: "Koffi Location",
      partnerType: "SUPPLIER",
      commune: "Yopougon",
      commercialName: "Koffi Location",
      personKind: "INDIVIDUAL",
      description: "Location ponctuelle d’articles du foyer.",
      status: "REJECTED",
      rejectionReason: "Merci de préciser votre activité de location et une commune d’intervention régulière.",
    },
  });
  console.log("T63 test partners ready (articles, demandes, locations, revenus, profil refusé).");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
