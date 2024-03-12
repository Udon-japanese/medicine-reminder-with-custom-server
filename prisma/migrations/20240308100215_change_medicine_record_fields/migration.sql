/*
  Warnings:

  - You are about to drop the column `intakeDate` on the `medicinerecords` table. All the data in the column will be lost.
  - You are about to drop the column `intakeTime` on the `medicinerecords` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "medicinerecords_medicineId_userId_intakeTime_actualIntakeTi_idx";

-- AlterTable
ALTER TABLE "medicinerecords" DROP COLUMN "intakeDate",
DROP COLUMN "intakeTime",
ADD COLUMN     "scheduledIntakeDate" TIMESTAMPTZ(6),
ADD COLUMN     "scheduledIntakeTime" INTEGER;

-- CreateIndex
CREATE INDEX "medicinerecords_medicineId_userId_scheduledIntakeTime_actua_idx" ON "medicinerecords"("medicineId", "userId", "scheduledIntakeTime", "actualIntakeTime");
