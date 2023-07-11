-- CreateTable
CREATE TABLE "ScreenShots" (
    "id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "screenShot_Url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "CallLogs" (
    "id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "caller_name" TEXT NOT NULL,
    "caller_number" TEXT NOT NULL,
    "recipient_number" TEXT NOT NULL,
    "call_duration" TEXT NOT NULL,
    "call_timeStamp" TEXT NOT NULL,
    "call_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "sender_name" TEXT NOT NULL,
    "reciver_name" TEXT NOT NULL,
    "sender_number" TEXT NOT NULL,
    "reciver_number" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    "message_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ScreenShots_device_id_key" ON "ScreenShots"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "CallLogs_device_id_key" ON "CallLogs"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_device_id_key" ON "Messages"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_device_id_key" ON "Location"("device_id");

-- AddForeignKey
ALTER TABLE "ScreenShots" ADD CONSTRAINT "ScreenShots_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLogs" ADD CONSTRAINT "CallLogs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
