/*
  Warnings:

  - You are about to drop the `location_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `diagram_description` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipment_description` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slogan` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slogan_description` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "location_details" DROP CONSTRAINT "location_details_location_id_fkey";

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "diagram_description" TEXT NOT NULL,
ADD COLUMN     "diagram_images" TEXT[],
ADD COLUMN     "equipment_description" TEXT NOT NULL,
ADD COLUMN     "equipment_images" TEXT[],
ADD COLUMN     "slogan" TEXT NOT NULL,
ADD COLUMN     "slogan_description" TEXT NOT NULL,
ADD COLUMN     "slogan_images" TEXT[];

-- DropTable
DROP TABLE "location_details";
