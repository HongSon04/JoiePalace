/*
  Warnings:

  - You are about to drop the `_FoodMenus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FoodTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `foods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FoodMenus" DROP CONSTRAINT "_FoodMenus_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodMenus" DROP CONSTRAINT "_FoodMenus_B_fkey";

-- DropForeignKey
ALTER TABLE "_FoodTags" DROP CONSTRAINT "_FoodTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodTags" DROP CONSTRAINT "_FoodTags_B_fkey";

-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_category_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- DropTable
DROP TABLE "_FoodMenus";

-- DropTable
DROP TABLE "_FoodTags";

-- DropTable
DROP TABLE "foods";

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "price" INTEGER NOT NULL,
    "images" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductMenus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTags_AB_unique" ON "_ProductTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTags_B_index" ON "_ProductTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductMenus_AB_unique" ON "_ProductMenus"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductMenus_B_index" ON "_ProductMenus"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMenus" ADD CONSTRAINT "_ProductMenus_A_fkey" FOREIGN KEY ("A") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMenus" ADD CONSTRAINT "_ProductMenus_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
