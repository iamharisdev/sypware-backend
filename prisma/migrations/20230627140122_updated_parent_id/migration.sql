/*
  Warnings:

  - You are about to drop the column `userId` on the `Child` table. All the data in the column will be lost.
  - Added the required column `parent_id` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_userId_fkey";

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "userId",
ADD COLUMN     "parent_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
