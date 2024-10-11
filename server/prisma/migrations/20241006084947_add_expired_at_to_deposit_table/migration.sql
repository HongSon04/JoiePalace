/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `booking_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "booking_id" INTEGER NOT NULL,
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '3 day';

-- CreateIndex
CREATE UNIQUE INDEX "booking_details_booking_id_key" ON "booking_details"("booking_id");

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
