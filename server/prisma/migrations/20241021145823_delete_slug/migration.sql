/*
  Warnings:

  - You are about to drop the column `slug` on the `decors` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `party_types` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "decors_slug_key";

-- DropIndex
DROP INDEX "party_types_slug_key";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "decors" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "party_types" DROP COLUMN "slug";
