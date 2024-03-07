/*
  Warnings:

  - A unique constraint covering the columns `[medicineId]` on the table `medicineintaketimes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicineintaketimes_medicineId_key" ON "medicineintaketimes"("medicineId");
