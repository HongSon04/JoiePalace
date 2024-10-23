/*
  Warnings:

  - You are about to drop the column `space` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the column `stage_id` on the `booking_details` table. All the data in the column will be lost.
  - Added the required column `party_types` to the `booking_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booking_details" DROP CONSTRAINT "booking_details_stage_id_fkey";

-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "space",
DROP COLUMN "stage",
DROP COLUMN "stage_id",
ADD COLUMN     "party_types" JSONB NOT NULL,
ADD COLUMN     "stagesId" INTEGER;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_stagesId_fkey" FOREIGN KEY ("stagesId") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
