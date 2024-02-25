-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('EVERYDAY', 'EVERY_X_DAY', 'SPECIFIC_DAY_OF_WEEK', 'SPECIFIC_DAY_OF_MONTH', 'ODD_EVEN_DAY', 'ON_OFF_DAY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "medicines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "notify" BOOLEAN NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicineintaketimes" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "medicineintaketimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "autoConsume" BOOLEAN NOT NULL,
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequencies" (
    "id" SERIAL NOT NULL,
    "frequencyType" "FrequencyType" NOT NULL,
    "everyXDay" INTEGER,
    "specificDayOfWeek" "DayOfWeek",
    "specificDayOfMonth" INTEGER[],
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "frequencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "days" INTEGER,
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memos" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255),
    "imageUrl" TEXT,
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oddevendays" (
    "id" SERIAL NOT NULL,
    "isOddDay" BOOLEAN NOT NULL,
    "isEvenDay" BOOLEAN NOT NULL,
    "frequencyId" INTEGER NOT NULL,

    CONSTRAINT "oddevendays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onoffdays" (
    "id" SERIAL NOT NULL,
    "onDays" INTEGER NOT NULL,
    "offDays" INTEGER NOT NULL,
    "frequencyId" INTEGER NOT NULL,

    CONSTRAINT "onoffdays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicineunits" (
    "id" SERIAL NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "medicineunits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicines_userId_idx" ON "medicines"("userId");

-- CreateIndex
CREATE INDEX "medicineintaketimes_medicineId_idx" ON "medicineintaketimes"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_medicineId_key" ON "stocks"("medicineId");

-- CreateIndex
CREATE INDEX "stocks_medicineId_idx" ON "stocks"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "frequencies_medicineId_key" ON "frequencies"("medicineId");

-- CreateIndex
CREATE INDEX "frequencies_medicineId_idx" ON "frequencies"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "periods_medicineId_key" ON "periods"("medicineId");

-- CreateIndex
CREATE INDEX "periods_medicineId_idx" ON "periods"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "memos_medicineId_key" ON "memos"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "oddevendays_frequencyId_key" ON "oddevendays"("frequencyId");

-- CreateIndex
CREATE UNIQUE INDEX "onoffdays_frequencyId_key" ON "onoffdays"("frequencyId");

-- CreateIndex
CREATE INDEX "medicineunits_userId_idx" ON "medicineunits"("userId");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineintaketimes" ADD CONSTRAINT "medicineintaketimes_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memos" ADD CONSTRAINT "memos_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oddevendays" ADD CONSTRAINT "oddevendays_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "frequencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onoffdays" ADD CONSTRAINT "onoffdays_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "frequencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineunits" ADD CONSTRAINT "medicineunits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
