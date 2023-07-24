/*
  Warnings:

  - You are about to drop the column `device_token` on the `FcmToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[device_Token]` on the table `FcmToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_Token` to the `FcmToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FcmToken_device_token_key";

-- AlterTable
ALTER TABLE "FcmToken" DROP COLUMN "device_token",
ADD COLUMN     "device_Token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_device_Token_key" ON "FcmToken"("device_Token");
