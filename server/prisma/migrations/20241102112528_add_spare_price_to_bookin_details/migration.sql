-- AlterTable
ALTER TABLE "booking_details" ADD COLUMN     "chair_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spare_chair_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spare_table_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "table_price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
