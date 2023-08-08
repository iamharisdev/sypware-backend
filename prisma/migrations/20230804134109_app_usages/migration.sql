-- CreateTable
CREATE TABLE "AppUsages" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "apps" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUsages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppUsages" ADD CONSTRAINT "AppUsages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
