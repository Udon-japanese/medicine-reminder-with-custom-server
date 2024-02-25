-- DropForeignKey
ALTER TABLE "frequencies" DROP CONSTRAINT "frequencies_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicineintaketimes" DROP CONSTRAINT "medicineintaketimes_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_userId_fkey";

-- DropForeignKey
ALTER TABLE "medicineunits" DROP CONSTRAINT "medicineunits_userId_fkey";

-- DropForeignKey
ALTER TABLE "memos" DROP CONSTRAINT "memos_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "oddevendays" DROP CONSTRAINT "oddevendays_frequencyId_fkey";

-- DropForeignKey
ALTER TABLE "onoffdays" DROP CONSTRAINT "onoffdays_frequencyId_fkey";

-- DropForeignKey
ALTER TABLE "periods" DROP CONSTRAINT "periods_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_medicineId_fkey";

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineintaketimes" ADD CONSTRAINT "medicineintaketimes_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memos" ADD CONSTRAINT "memos_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oddevendays" ADD CONSTRAINT "oddevendays_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onoffdays" ADD CONSTRAINT "onoffdays_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineunits" ADD CONSTRAINT "medicineunits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
