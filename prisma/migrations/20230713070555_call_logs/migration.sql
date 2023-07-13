-- CreateTable
CREATE TABLE "CallLogs" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "callLogArray" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallLogs_device_id_key" ON "CallLogs"("device_id");

-- AddForeignKey
ALTER TABLE "CallLogs" ADD CONSTRAINT "CallLogs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
