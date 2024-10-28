/*
  Warnings:

  - You are about to drop the column `stagesId` on the `booking_details` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_details" DROP CONSTRAINT "booking_details_stagesId_fkey";

-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "stagesId";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
