/*
  Warnings:

  - You are about to drop the column `everyXDay` on the `frequencies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "frequencies" DROP COLUMN "everyXDay";

-- CreateTable
CREATE TABLE "everydays" (
    "id" SERIAL NOT NULL,
    "frequencyId" INTEGER NOT NULL,
    "weekends" "DayOfWeek"[],

    CONSTRAINT "everydays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekendintaketimes" (
    "id" SERIAL NOT NULL,
    "everydayId" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "weekendintaketimes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "everydays_frequencyId_key" ON "everydays"("frequencyId");

-- CreateIndex
CREATE INDEX "weekendintaketimes_everydayId_idx" ON "weekendintaketimes"("everydayId");

-- AddForeignKey
ALTER TABLE "everydays" ADD CONSTRAINT "everydays_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekendintaketimes" ADD CONSTRAINT "weekendintaketimes_everydayId_fkey" FOREIGN KEY ("everydayId") REFERENCES "everydays"("id") ON DELETE CASCADE ON UPDATE CASCADE;
