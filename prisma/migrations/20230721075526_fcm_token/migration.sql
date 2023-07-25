/*
  Warnings:

  - You are about to drop the column `userId` on the `FcmToken` table. All the data in the column will be lost.
  - Added the required column `parent_Id` to the `FcmToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FcmToken" DROP CONSTRAINT "FcmToken_userId_fkey";

-- AlterTable
ALTER TABLE "FcmToken" DROP COLUMN "userId",
ADD COLUMN     "parent_Id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_parent_Id_fkey" FOREIGN KEY ("parent_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
