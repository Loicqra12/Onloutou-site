-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN "clientRequestId" TEXT;

CREATE UNIQUE INDEX "ServiceRequest_clientRequestId_key" ON "ServiceRequest"("clientRequestId");
