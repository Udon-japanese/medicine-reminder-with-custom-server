/*
  Warnings:

  - Added the required column `dosage` to the `medicinerecords` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "medicinerecords_medicineId_userId_intakeTime_idx";

-- AlterTable
ALTER TABLE "medicinerecords" ADD COLUMN     "dosage" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "medicinerecords_medicineId_userId_intakeTime_actualIntakeTi_idx" ON "medicinerecords"("medicineId", "userId", "intakeTime", "actualIntakeTime");
