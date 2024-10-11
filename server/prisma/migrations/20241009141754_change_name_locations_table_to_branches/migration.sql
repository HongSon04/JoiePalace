/*
  Warnings:

  - You are about to drop the column `location_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `spaces` table. All the data in the column will be lost.
  - You are about to drop the column `locations_id` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[branch_id]` on the table `spaces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branches_id]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branch_id]` on the table `stages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branches_id` to the `staffs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `stages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_location_id_fkey";

-- DropForeignKey
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_location_id_fkey";

-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_locations_id_fkey";

-- DropForeignKey
ALTER TABLE "stages" DROP CONSTRAINT "stages_location_id_fkey";

-- DropIndex
DROP INDEX "spaces_location_id_key";

-- DropIndex
DROP INDEX "staffs_locations_id_key";

-- DropIndex
DROP INDEX "stages_location_id_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "location_id",
ADD COLUMN     "branch_id" INTEGER NOT NULL,
ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "spaces" DROP COLUMN "location_id",
ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "locations_id",
ADD COLUMN     "branches_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stages" DROP COLUMN "location_id",
ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "locations";

-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 5,
    "images" TEXT[],
    "slogan" TEXT NOT NULL,
    "slogan_description" TEXT NOT NULL,
    "slogan_images" TEXT[],
    "diagram_description" TEXT NOT NULL,
    "diagram_images" TEXT[],
    "equipment_description" TEXT NOT NULL,
    "equipment_images" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_slug_key" ON "branches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_branch_id_key" ON "spaces"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_branches_id_key" ON "staffs"("branches_id");

-- CreateIndex
CREATE UNIQUE INDEX "stages_branch_id_key" ON "stages"("branch_id");

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_branches_id_fkey" FOREIGN KEY ("branches_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
