/*
  Warnings:

  - You are about to drop the column `accessories` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `decor_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `deposit_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `menu_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `space_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `stage_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `email` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `party_type_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_decor_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_deposit_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_space_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_stage_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "accessories",
DROP COLUMN "amount",
DROP COLUMN "decor_id",
DROP COLUMN "deposit_id",
DROP COLUMN "fee",
DROP COLUMN "images",
DROP COLUMN "menu_id",
DROP COLUMN "space_id",
DROP COLUMN "stage_id",
DROP COLUMN "total_amount",
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '3 day',
ADD COLUMN     "is_confirm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deposit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "number_of_guests" INTEGER,
ADD COLUMN     "party_type_id" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_method" ALTER COLUMN "client_id" DROP NOT NULL,
ALTER COLUMN "secret_key" DROP NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "booking_details" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "space_id" INTEGER NOT NULL,
    "decor_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "deposit_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "stage" JSONB NOT NULL,
    "space" JSONB NOT NULL,
    "decor" JSONB NOT NULL,
    "menu" JSONB NOT NULL,
    "extra_service" JSONB NOT NULL,
    "images" TEXT[],
    "accessories" JSONB NOT NULL,
    "amount_booking" INTEGER NOT NULL DEFAULT 0,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "price" INTEGER NOT NULL,
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExtraServicesBookingDetails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtraServicesTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "extra_services_slug_key" ON "extra_services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraServicesBookingDetails_AB_unique" ON "_ExtraServicesBookingDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraServicesBookingDetails_B_index" ON "_ExtraServicesBookingDetails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraServicesTags_AB_unique" ON "_ExtraServicesTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraServicesTags_B_index" ON "_ExtraServicesTags"("B");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_party_type_id_fkey" FOREIGN KEY ("party_type_id") REFERENCES "party_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_decor_id_fkey" FOREIGN KEY ("decor_id") REFERENCES "decors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraServicesBookingDetails" ADD CONSTRAINT "_ExtraServicesBookingDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "booking_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraServicesBookingDetails" ADD CONSTRAINT "_ExtraServicesBookingDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "extra_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraServicesTags" ADD CONSTRAINT "_ExtraServicesTags_A_fkey" FOREIGN KEY ("A") REFERENCES "extra_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraServicesTags" ADD CONSTRAINT "_ExtraServicesTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
