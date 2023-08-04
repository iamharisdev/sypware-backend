-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('parent', 'moderator');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT,
    "password" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "image" TEXT,
    "role" TEXT[] DEFAULT ARRAY['parent']::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FcmToken" (
    "id" SERIAL NOT NULL,
    "device_Token" TEXT NOT NULL,
    "parent_Id" INTEGER NOT NULL,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "notification_enabled" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "notification_title" TEXT NOT NULL,
    "notification_type" TEXT,
    "notification_content" TEXT NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "image" TEXT,
    "parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "child_id" INTEGER NOT NULL,
    "device_uuid" TEXT NOT NULL DEFAULT 'pending',
    "device_info" TEXT NOT NULL DEFAULT 'pending',
    "platform" TEXT NOT NULL DEFAULT 'pending',
    "device_name" TEXT NOT NULL DEFAULT 'pending',
    "screenshots_enabled" BOOLEAN NOT NULL DEFAULT false,
    "calllogs_enabled" BOOLEAN NOT NULL DEFAULT false,
    "messages_enabled" BOOLEAN NOT NULL DEFAULT false,
    "location_enable" BOOLEAN NOT NULL DEFAULT false,
    "apps_usage_enable" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSettings" (
    "id" SERIAL NOT NULL,
    "screenShots_interval" TEXT,
    "callLogs_interval" TEXT,
    "messages_interval" TEXT,
    "location_interval" TEXT,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceSettings_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "ScreenShots" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "screenShot" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenShots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLogs" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "callLogArray" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "messageArray" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_device_Token_key" ON "FcmToken"("device_Token");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_parent_id_key" ON "Setting"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSettings_device_id_key" ON "DeviceSettings"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenLock_device_id_key" ON "ScreenLock"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "CallLogs_device_id_key" ON "CallLogs"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_device_id_key" ON "Messages"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_device_id_key" ON "Location"("device_id");

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_parent_Id_fkey" FOREIGN KEY ("parent_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSettings" ADD CONSTRAINT "DeviceSettings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenLock" ADD CONSTRAINT "ScreenLock_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenShots" ADD CONSTRAINT "ScreenShots_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLogs" ADD CONSTRAINT "CallLogs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
