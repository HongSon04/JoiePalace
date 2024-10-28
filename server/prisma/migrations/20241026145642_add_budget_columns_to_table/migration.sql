-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "budget" TEXT,
ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
