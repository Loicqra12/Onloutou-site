ALTER TYPE "PartnerNotificationKind" ADD VALUE IF NOT EXISTS 'PAYOUT';

DO $$ BEGIN
  CREATE TYPE "PartnerRevenueStatus" AS ENUM ('PENDING', 'PAID');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PartnerPayoutMethod" AS ENUM ('MOBILE_MONEY', 'BANK_TRANSFER', 'CASH', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "PartnerProfile" ADD COLUMN IF NOT EXISTS "commissionBps" INTEGER NOT NULL DEFAULT 1500;

CREATE TABLE IF NOT EXISTS "PartnerPayout" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" "PartnerPayoutMethod" NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerPayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerPayout_reference_key" ON "PartnerPayout"("reference");
CREATE INDEX IF NOT EXISTS "PartnerPayout_partnerProfileId_paidAt_idx" ON "PartnerPayout"("partnerProfileId", "paidAt");

CREATE TABLE IF NOT EXISTS "PartnerRevenue" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "commissionBps" INTEGER NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "status" "PartnerRevenueStatus" NOT NULL DEFAULT 'PENDING',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PartnerRevenue_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerRevenue_reference_key" ON "PartnerRevenue"("reference");
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerRevenue_locationId_key" ON "PartnerRevenue"("locationId");
CREATE INDEX IF NOT EXISTS "PartnerRevenue_partnerProfileId_status_idx" ON "PartnerRevenue"("partnerProfileId", "status");

DO $$ BEGIN
  ALTER TABLE "PartnerPayout" ADD CONSTRAINT "PartnerPayout_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerRevenue" ADD CONSTRAINT "PartnerRevenue_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerRevenue" ADD CONSTRAINT "PartnerRevenue_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "PartnerLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerRevenue" ADD CONSTRAINT "PartnerRevenue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerRevenue" ADD CONSTRAINT "PartnerRevenue_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "PartnerPayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
