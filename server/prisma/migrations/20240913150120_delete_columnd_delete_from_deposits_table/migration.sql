/*
  Warnings:

  - You are about to drop the column `deleted` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `deposits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "deleted",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";
