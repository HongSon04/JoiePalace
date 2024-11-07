/*
  Warnings:

  - You are about to drop the column `decor` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the column `menu` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the column `party_types` on the `booking_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "decor",
DROP COLUMN "menu",
DROP COLUMN "party_types",
ADD COLUMN     "decor_detail" JSONB,
ADD COLUMN     "menu_detail" JSONB,
ADD COLUMN     "party_type_detail" JSONB,
ADD COLUMN     "stage_detail" JSONB;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';
