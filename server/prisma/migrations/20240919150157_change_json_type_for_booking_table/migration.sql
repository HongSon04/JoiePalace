/*
  Warnings:

  - Changed the type of `accessories` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "accessories",
ADD COLUMN     "accessories" JSONB NOT NULL;
