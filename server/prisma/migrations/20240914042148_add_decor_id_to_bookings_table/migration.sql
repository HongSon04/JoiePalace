/*
  Warnings:

  - Added the required column `decor_id` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "decor_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_decor_id_fkey" FOREIGN KEY ("decor_id") REFERENCES "decors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
