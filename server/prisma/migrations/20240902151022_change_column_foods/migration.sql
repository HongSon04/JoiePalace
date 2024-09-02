/*
  Warnings:

  - You are about to drop the column `categories_id` on the `foods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `foods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_categories_id_fkey";

-- AlterTable
ALTER TABLE "foods" DROP COLUMN "categories_id",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "foods_category_id_key" ON "foods"("category_id");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
