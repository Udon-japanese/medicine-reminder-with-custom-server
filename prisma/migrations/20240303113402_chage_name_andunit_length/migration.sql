/*
  Warnings:

  - You are about to alter the column `name` on the `medicines` table. The data in that column could be lost. The data in that column will be cast from `VarChar(80)` to `VarChar(30)`.
  - You are about to alter the column `unit` on the `medicines` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "unit" SET DATA TYPE VARCHAR(10);
