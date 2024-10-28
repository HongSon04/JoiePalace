/*
  Warnings:

  - You are about to drop the column `payment_method` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the column `space_id` on the `booking_details` table. All the data in the column will be lost.
  - The `status` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `deposits` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `booking_total` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `booking_totalAmount` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `gifts` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `stages` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `funitures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staffs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_method` to the `deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_total_amount` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `party_types` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'manager');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'cancel', 'success', 'processing');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('pending', 'cancel', 'success');

-- DropForeignKey
ALTER TABLE "booking_details" DROP CONSTRAINT "booking_details_space_id_fkey";

-- DropForeignKey
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_branch_id_fkey";

-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "payment_method",
DROP COLUMN "space_id";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "stage_id" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "decors" ADD COLUMN     "is_show" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "DepositStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "booking_total",
DROP COLUMN "booking_totalAmount",
DROP COLUMN "gifts",
ADD COLUMN     "booking_total_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "is_show" SET DEFAULT false;

-- AlterTable
ALTER TABLE "party_types" ADD COLUMN     "is_show" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stages" DROP COLUMN "capacity",
ADD COLUMN     "capacity_max" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "capacity_min" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "branch_id" INTEGER,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "funitures";

-- DropTable
DROP TABLE "spaces";

-- DropTable
DROP TABLE "staffs";

-- CreateTable
CREATE TABLE "_MembershipGifts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DecorProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PartyTypeProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MembershipGifts_AB_unique" ON "_MembershipGifts"("A", "B");

-- CreateIndex
CREATE INDEX "_MembershipGifts_B_index" ON "_MembershipGifts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DecorProducts_AB_unique" ON "_DecorProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_DecorProducts_B_index" ON "_DecorProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PartyTypeProducts_AB_unique" ON "_PartyTypeProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_PartyTypeProducts_B_index" ON "_PartyTypeProducts"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipGifts" ADD CONSTRAINT "_MembershipGifts_A_fkey" FOREIGN KEY ("A") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipGifts" ADD CONSTRAINT "_MembershipGifts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorProducts" ADD CONSTRAINT "_DecorProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "decors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorProducts" ADD CONSTRAINT "_DecorProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyTypeProducts" ADD CONSTRAINT "_PartyTypeProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "party_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyTypeProducts" ADD CONSTRAINT "_PartyTypeProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
