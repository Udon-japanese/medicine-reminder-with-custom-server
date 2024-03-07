-- CreateTable
CREATE TABLE "medicinerecords" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "medicineId" UUID NOT NULL,
    "intakeTime" TIMESTAMPTZ(6) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isSkipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "medicinerecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicinerecords_medicineId_userId_idx" ON "medicinerecords"("medicineId", "userId");

-- AddForeignKey
ALTER TABLE "medicinerecords" ADD CONSTRAINT "medicinerecords_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicinerecords" ADD CONSTRAINT "medicinerecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
