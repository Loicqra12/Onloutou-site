ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "corrections" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "ProductUnavailability" ADD COLUMN IF NOT EXISTS "reason" TEXT;

DO $$ BEGIN
  CREATE TYPE "PartnerDemandStatus" AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PartnerDemandReply" AS ENUM ('AVAILABLE', 'ADJUSTMENT', 'UNAVAILABLE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "PartnerDemand" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "PartnerDemandStatus" NOT NULL DEFAULT 'PENDING',
    "requestedQty" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "commune" TEXT NOT NULL,
    "deliveryRequested" BOOLEAN NOT NULL DEFAULT false,
    "brief" TEXT,
    "toClarify" JSONB NOT NULL DEFAULT '[]',
    "replyKind" "PartnerDemandReply",
    "replyQty" INTEGER,
    "replyStart" DATE,
    "replyEnd" DATE,
    "replyDelivery" TEXT,
    "replyFees" TEXT,
    "replyMessage" TEXT,
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PartnerDemand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerDemand_reference_key" ON "PartnerDemand"("reference");
CREATE INDEX IF NOT EXISTS "PartnerDemand_partnerProfileId_status_idx" ON "PartnerDemand"("partnerProfileId", "status");
CREATE INDEX IF NOT EXISTS "PartnerDemand_productId_idx" ON "PartnerDemand"("productId");

ALTER TABLE "PartnerDemand" DROP CONSTRAINT IF EXISTS "PartnerDemand_partnerProfileId_fkey";
ALTER TABLE "PartnerDemand"
  ADD CONSTRAINT "PartnerDemand_partnerProfileId_fkey"
  FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PartnerDemand" DROP CONSTRAINT IF EXISTS "PartnerDemand_productId_fkey";
ALTER TABLE "PartnerDemand"
  ADD CONSTRAINT "PartnerDemand_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
