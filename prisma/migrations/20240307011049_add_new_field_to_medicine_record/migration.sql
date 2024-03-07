/*
  Warnings:

  - Added the required column `intakeDate` to the `medicinerecords` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `intakeTime` on the `medicinerecords` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "medicinerecords_medicineId_userId_idx";

-- AlterTable
ALTER TABLE "medicinerecords" ADD COLUMN     "actualIntakeTime" INTEGER,
ADD COLUMN     "intakeDate" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "intakeTime",
ADD COLUMN     "intakeTime" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "medicinerecords_medicineId_userId_intakeTime_idx" ON "medicinerecords"("medicineId", "userId", "intakeTime");
