-- CreateTable
CREATE TABLE "FcmToken" (
    "id" SERIAL NOT NULL,
    "device_token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_device_token_key" ON "FcmToken"("device_token");

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
