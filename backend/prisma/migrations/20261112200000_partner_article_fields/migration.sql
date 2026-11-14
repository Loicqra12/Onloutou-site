-- AlterEnum ProductCategory
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'APPLIANCES';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'IT';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'FURNITURE';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'EVENTS';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'CHILDCARE';

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "reference" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "familySlug" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categorySlug" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryRequest" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "condition" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specs" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "terms" JSONB NOT NULL DEFAULT '{}';

CREATE UNIQUE INDEX IF NOT EXISTS "Product_reference_key" ON "Product"("reference");

CREATE TABLE IF NOT EXISTS "ProductUnavailability" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductUnavailability_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProductUnavailability_productId_idx" ON "ProductUnavailability"("productId");

ALTER TABLE "ProductUnavailability" DROP CONSTRAINT IF EXISTS "ProductUnavailability_productId_fkey";
ALTER TABLE "ProductUnavailability"
  ADD CONSTRAINT "ProductUnavailability_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
