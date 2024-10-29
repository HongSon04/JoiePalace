-- AlterTable
ALTER TABLE "booking_details" ADD COLUMN     "chair_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "table_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
