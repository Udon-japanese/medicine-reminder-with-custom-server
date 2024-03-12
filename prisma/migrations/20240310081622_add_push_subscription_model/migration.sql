-- CreateTable
CREATE TABLE "pushsubscriptions" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "expirationTime" TIMESTAMPTZ(6) NOT NULL,
    "p256dhkey" TEXT NOT NULL,
    "authKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "pushsubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pushsubscriptions_endpoint_key" ON "pushsubscriptions"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "pushsubscriptions_userId_key" ON "pushsubscriptions"("userId");

-- AddForeignKey
ALTER TABLE "pushsubscriptions" ADD CONSTRAINT "pushsubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
