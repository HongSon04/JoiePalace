-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "stages" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
