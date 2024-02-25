/*
  Warnings:

  - The values [SPECIFIC_DAY_OF_WEEK,SPECIFIC_DAY_OF_MONTH] on the enum `FrequencyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FrequencyType_new" AS ENUM ('EVERYDAY', 'EVERY_X_DAY', 'SPECIFIC_DAYS_OF_WEEK', 'SPECIFIC_DAYS_OF_MONTH', 'ODD_EVEN_DAY', 'ON_OFF_DAY');
ALTER TABLE "frequencies" ALTER COLUMN "type" TYPE "FrequencyType_new" USING ("type"::text::"FrequencyType_new");
ALTER TYPE "FrequencyType" RENAME TO "FrequencyType_old";
ALTER TYPE "FrequencyType_new" RENAME TO "FrequencyType";
DROP TYPE "FrequencyType_old";
COMMIT;
