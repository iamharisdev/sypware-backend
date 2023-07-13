-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "messageArray" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_device_id_key" ON "Messages"("device_id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
