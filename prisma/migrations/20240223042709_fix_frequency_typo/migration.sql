/*
  Warnings:

  - You are about to drop the column `specificDayOfMonth` on the `frequencies` table. All the data in the column will be lost.
  - You are about to drop the column `specificDayOfWeek` on the `frequencies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "frequencies" DROP COLUMN "specificDayOfMonth",
DROP COLUMN "specificDayOfWeek",
ADD COLUMN     "specificDaysOfMonth" INTEGER[],
ADD COLUMN     "specificDaysOfWeek" "DayOfWeek"[];
