/*
  Warnings:

  - You are about to drop the column `expirationTime` on the `pushsubscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pushsubscriptions" DROP COLUMN "expirationTime";
