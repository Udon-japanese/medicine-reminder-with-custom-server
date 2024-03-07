/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `memos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memos" DROP COLUMN "imageUrl",
ADD COLUMN     "imageId" TEXT;
