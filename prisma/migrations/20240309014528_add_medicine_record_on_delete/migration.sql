-- DropForeignKey
ALTER TABLE "medicinerecords" DROP CONSTRAINT "medicinerecords_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicinerecords" DROP CONSTRAINT "medicinerecords_userId_fkey";

-- AddForeignKey
ALTER TABLE "medicinerecords" ADD CONSTRAINT "medicinerecords_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicinerecords" ADD CONSTRAINT "medicinerecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
