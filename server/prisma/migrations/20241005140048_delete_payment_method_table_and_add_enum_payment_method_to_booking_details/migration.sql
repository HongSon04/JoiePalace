/*
  Warnings:

  - You are about to drop the column `payment_method_id` on the `booking_details` table. All the data in the column will be lost.
  - You are about to drop the `payment_method` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_method` to the `booking_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'momo', 'vnpay', 'bank');

-- DropForeignKey
ALTER TABLE "booking_details" DROP CONSTRAINT "booking_details_payment_method_id_fkey";

-- AlterTable
ALTER TABLE "booking_details" DROP COLUMN "payment_method_id",
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- DropTable
DROP TABLE "payment_method";

-- DropEnum
DROP TYPE "LiveMode";
