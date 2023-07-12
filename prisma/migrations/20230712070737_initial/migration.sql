/*
  Warnings:

  - You are about to drop the column `call_duration` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `call_timeStamp` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `call_type` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `caller_name` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `caller_number` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_name` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_number` on the `CallLogs` table. All the data in the column will be lost.
  - You are about to drop the column `message_type` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `reciver_name` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `reciver_number` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `sender_name` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `sender_number` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `timeStamp` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `callLogArray` to the `CallLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageArray` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallLogs" DROP COLUMN "call_duration",
DROP COLUMN "call_timeStamp",
DROP COLUMN "call_type",
DROP COLUMN "caller_name",
DROP COLUMN "caller_number",
DROP COLUMN "recipient_name",
DROP COLUMN "recipient_number",
ADD COLUMN     "callLogArray" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "message_type",
DROP COLUMN "reciver_name",
DROP COLUMN "reciver_number",
DROP COLUMN "sender_name",
DROP COLUMN "sender_number",
DROP COLUMN "timeStamp",
ADD COLUMN     "messageArray" JSONB NOT NULL;
