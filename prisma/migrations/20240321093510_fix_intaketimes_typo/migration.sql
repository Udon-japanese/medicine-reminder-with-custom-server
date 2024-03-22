/*
  Warnings:

  - You are about to drop the `medicineintaketimes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicineintaketimes" DROP CONSTRAINT "medicineintaketimes_medicineId_fkey";

-- DropTable
DROP TABLE "medicineintaketimes";

-- CreateTable
CREATE TABLE "intaketimes" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,
    "medicineId" UUID NOT NULL,

    CONSTRAINT "intaketimes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "intaketimes_medicineId_idx" ON "intaketimes"("medicineId");

-- AddForeignKey
ALTER TABLE "intaketimes" ADD CONSTRAINT "intaketimes_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
