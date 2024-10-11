/*
  Warnings:

  - You are about to drop the `_ExtraServicesBookingDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExtraServicesTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extra_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExtraServicesBookingDetails" DROP CONSTRAINT "_ExtraServicesBookingDetails_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraServicesBookingDetails" DROP CONSTRAINT "_ExtraServicesBookingDetails_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraServicesTags" DROP CONSTRAINT "_ExtraServicesTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraServicesTags" DROP CONSTRAINT "_ExtraServicesTags_B_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- DropTable
DROP TABLE "_ExtraServicesBookingDetails";

-- DropTable
DROP TABLE "_ExtraServicesTags";

-- DropTable
DROP TABLE "extra_services";
