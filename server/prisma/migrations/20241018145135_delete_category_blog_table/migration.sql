/*
  Warnings:

  - You are about to drop the column `category_blog_id` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the `category_blogs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_category_blog_id_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "category_blog_id",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- DropTable
DROP TABLE "category_blogs";

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
