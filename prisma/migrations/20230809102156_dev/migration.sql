/*
  Warnings:

  - You are about to drop the column `appusage` on the `ModulesTime` table. All the data in the column will be lost.
  - You are about to drop the column `calllogs` on the `ModulesTime` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ModulesTime` table. All the data in the column will be lost.
  - You are about to drop the column `messages` on the `ModulesTime` table. All the data in the column will be lost.
  - You are about to drop the column `screenshots` on the `ModulesTime` table. All the data in the column will be lost.
  - You are about to drop the `DeviceSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeviceSettings" DROP CONSTRAINT "DeviceSettings_device_id_fkey";

-- AlterTable
ALTER TABLE "ModulesTime" DROP COLUMN "appusage",
DROP COLUMN "calllogs",
DROP COLUMN "location",
DROP COLUMN "messages",
DROP COLUMN "screenshots",
ADD COLUMN     "callLogs_interval" TEXT,
ADD COLUMN     "location_interval" TEXT,
ADD COLUMN     "messages_interval" TEXT,
ADD COLUMN     "screenShots_interval" TEXT;

-- DropTable
DROP TABLE "DeviceSettings";
