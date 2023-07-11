/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `ScreenLock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScreenLock_device_id_key" ON "ScreenLock"("device_id");
