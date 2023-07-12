-- AlterTable
CREATE SEQUENCE calllogs_id_seq;
ALTER TABLE "CallLogs" ALTER COLUMN "id" SET DEFAULT nextval('calllogs_id_seq'),
ADD CONSTRAINT "CallLogs_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE calllogs_id_seq OWNED BY "CallLogs"."id";

-- AlterTable
CREATE SEQUENCE location_id_seq;
ALTER TABLE "Location" ALTER COLUMN "id" SET DEFAULT nextval('location_id_seq'),
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE location_id_seq OWNED BY "Location"."id";

-- AlterTable
CREATE SEQUENCE messages_id_seq;
ALTER TABLE "Messages" ALTER COLUMN "id" SET DEFAULT nextval('messages_id_seq'),
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE messages_id_seq OWNED BY "Messages"."id";

-- AlterTable
CREATE SEQUENCE screenshots_id_seq;
ALTER TABLE "ScreenShots" ALTER COLUMN "id" SET DEFAULT nextval('screenshots_id_seq'),
ADD CONSTRAINT "ScreenShots_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE screenshots_id_seq OWNED BY "ScreenShots"."id";
