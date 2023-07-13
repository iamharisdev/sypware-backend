-- CreateTable
CREATE TABLE "ScreenShots" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "screenShot_Url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenShots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScreenShots_device_id_key" ON "ScreenShots"("device_id");

-- AddForeignKey
ALTER TABLE "ScreenShots" ADD CONSTRAINT "ScreenShots_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
