/*
  Warnings:

  - You are about to drop the column `accessories` on the `booking_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "accessories";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
