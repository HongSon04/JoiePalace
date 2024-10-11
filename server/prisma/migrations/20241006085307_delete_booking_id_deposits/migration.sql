/*
  Warnings:

  - You are about to drop the column `booking_id` on the `deposits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_booking_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "booking_id",
ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
