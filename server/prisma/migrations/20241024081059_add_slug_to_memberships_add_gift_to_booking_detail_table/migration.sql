/*
  Warnings:

  - You are about to drop the column `decsription` on the `memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gift` to the `booking_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking_details" ADD COLUMN     "gift" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "decsription",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "memberships_slug_key" ON "memberships"("slug");
