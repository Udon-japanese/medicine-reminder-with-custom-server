/*
  Warnings:

  - Made the column `actualIntakeTime` on table `medicinerecords` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actualIntakeDate` on table `medicinerecords` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "medicinerecords" ALTER COLUMN "actualIntakeTime" SET NOT NULL,
ALTER COLUMN "actualIntakeDate" SET NOT NULL;
