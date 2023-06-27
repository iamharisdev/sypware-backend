/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('owner', 'moderator');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullname" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "role" TEXT[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
