DO $$ BEGIN
  CREATE TYPE "PartnerDemandOutcome" AS ENUM ('WAITING', 'SELECTED', 'DECLINED', 'CANCELLED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PartnerLocationStatus" AS ENUM ('TO_PREPARE', 'IN_PROGRESS', 'TO_RETURN', 'COMPLETED', 'INCIDENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PartnerNotificationKind" AS ENUM ('DEMAND', 'LOCATION', 'ARTICLE', 'PROFILE', 'MESSAGE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "PartnerDemand" ADD COLUMN IF NOT EXISTS "outcome" "PartnerDemandOutcome" NOT NULL DEFAULT 'WAITING';
ALTER TABLE "PartnerDemand" ADD COLUMN IF NOT EXISTS "outcomeNote" TEXT;

CREATE TABLE IF NOT EXISTS "PartnerLocation" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "status" "PartnerLocationStatus" NOT NULL DEFAULT 'TO_PREPARE',
    "quantity" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "commune" TEXT NOT NULL,
    "delivery" TEXT,
    "fees" TEXT,
    "addressNote" TEXT,
    "onloutouNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PartnerLocation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerLocation_reference_key" ON "PartnerLocation"("reference");
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerLocation_demandId_key" ON "PartnerLocation"("demandId");
CREATE INDEX IF NOT EXISTS "PartnerLocation_partnerProfileId_status_idx" ON "PartnerLocation"("partnerProfileId", "status");

DO $$ BEGIN
  ALTER TABLE "PartnerLocation" ADD CONSTRAINT "PartnerLocation_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerLocation" ADD CONSTRAINT "PartnerLocation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerLocation" ADD CONSTRAINT "PartnerLocation_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "PartnerDemand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "PartnerNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "PartnerNotificationKind" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerNotification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PartnerNotification_userId_createdAt_idx" ON "PartnerNotification"("userId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "PartnerNotification" ADD CONSTRAINT "PartnerNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
