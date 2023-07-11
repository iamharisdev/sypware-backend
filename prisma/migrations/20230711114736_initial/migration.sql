-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "child_id" INTEGER NOT NULL,
    "device_info" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "device_name" TEXT NOT NULL,
    "screenshots_enabled" BOOLEAN NOT NULL,
    "calllogs_enabled" BOOLEAN NOT NULL,
    "messages_enabled" BOOLEAN NOT NULL,
    "location_enable" BOOLEAN NOT NULL,
    "apps_usage_enable" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
