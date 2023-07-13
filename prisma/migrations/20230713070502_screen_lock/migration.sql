-- CreateTable
CREATE TABLE "ScreenLock" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "pin" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScreenLock_device_id_key" ON "ScreenLock"("device_id");

-- AddForeignKey
ALTER TABLE "ScreenLock" ADD CONSTRAINT "ScreenLock_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
