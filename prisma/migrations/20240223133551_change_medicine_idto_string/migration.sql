/*
  Warnings:

  - The primary key for the `medicines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `medicineId` on the `frequencies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `medicineintaketimes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `medicines` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `memos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `periods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `stocks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "frequencies" DROP CONSTRAINT "frequencies_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicineintaketimes" DROP CONSTRAINT "medicineintaketimes_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "memos" DROP CONSTRAINT "memos_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "periods" DROP CONSTRAINT "periods_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_medicineId_fkey";

-- AlterTable
ALTER TABLE "frequencies" DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "medicineintaketimes" DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "medicines_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "memos" DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "periods" DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "frequencies_medicineId_key" ON "frequencies"("medicineId");

-- CreateIndex
CREATE INDEX "frequencies_medicineId_idx" ON "frequencies"("medicineId");

-- CreateIndex
CREATE INDEX "medicineintaketimes_medicineId_idx" ON "medicineintaketimes"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "memos_medicineId_key" ON "memos"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "periods_medicineId_key" ON "periods"("medicineId");

-- CreateIndex
CREATE INDEX "periods_medicineId_idx" ON "periods"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_medicineId_key" ON "stocks"("medicineId");

-- CreateIndex
CREATE INDEX "stocks_medicineId_idx" ON "stocks"("medicineId");

-- AddForeignKey
ALTER TABLE "medicineintaketimes" ADD CONSTRAINT "medicineintaketimes_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memos" ADD CONSTRAINT "memos_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
