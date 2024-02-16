-- CreateTable
CREATE TABLE "ModulesTime" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "screenshots" TIMESTAMP(3) NOT NULL,
    "calllogs" TIMESTAMP(3) NOT NULL,
    "messages" TIMESTAMP(3) NOT NULL,
    "location" TIMESTAMP(3) NOT NULL,
    "appusage" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModulesTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModulesTime_device_id_key" ON "ModulesTime"("device_id");

-- AddForeignKey
ALTER TABLE "ModulesTime" ADD CONSTRAINT "ModulesTime_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
