-- AlterTable
ALTER TABLE "booking_details" ALTER COLUMN "decor" DROP NOT NULL,
ALTER COLUMN "menu" DROP NOT NULL,
ALTER COLUMN "extra_service" DROP NOT NULL,
ALTER COLUMN "party_types" DROP NOT NULL,
ALTER COLUMN "gift" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
