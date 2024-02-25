/*
  Warnings:

  - You are about to drop the column `frequencyType` on the `frequencies` table. All the data in the column will be lost.
  - You are about to drop the column `isEvenDay` on the `oddevendays` table. All the data in the column will be lost.
  - Added the required column `type` to the `frequencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "frequencies" DROP COLUMN "frequencyType",
ADD COLUMN     "type" "FrequencyType" NOT NULL;

-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "notify" DROP NOT NULL;

-- AlterTable
ALTER TABLE "oddevendays" DROP COLUMN "isEvenDay";
