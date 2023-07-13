-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "child_id" INTEGER NOT NULL,
    "device_info" TEXT NOT NULL DEFAULT 'pending',
    "platform" TEXT NOT NULL DEFAULT 'pending',
    "device_name" TEXT NOT NULL DEFAULT 'pending',
    "screenshots_enabled" BOOLEAN NOT NULL DEFAULT false,
    "calllogs_enabled" BOOLEAN NOT NULL DEFAULT false,
    "messages_enabled" BOOLEAN NOT NULL DEFAULT false,
    "location_enable" BOOLEAN NOT NULL DEFAULT false,
    "apps_usage_enable" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
