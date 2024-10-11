/*
  Warnings:

  - You are about to drop the column `branches_id` on the `staffs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branch_id]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `staffs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_branches_id_fkey";

-- DropIndex
DROP INDEX "staffs_branches_id_key";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "branches_id",
ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "staffs_branch_id_key" ON "staffs"("branch_id");

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
