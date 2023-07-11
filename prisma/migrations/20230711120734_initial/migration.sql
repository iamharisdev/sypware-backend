-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "device_info" SET DEFAULT 'pending',
ALTER COLUMN "platform" SET DEFAULT 'pending',
ALTER COLUMN "device_name" SET DEFAULT 'pending',
ALTER COLUMN "screenshots_enabled" SET DEFAULT false,
ALTER COLUMN "calllogs_enabled" SET DEFAULT false,
ALTER COLUMN "messages_enabled" SET DEFAULT false,
ALTER COLUMN "location_enable" SET DEFAULT false,
ALTER COLUMN "apps_usage_enable" SET DEFAULT false;
