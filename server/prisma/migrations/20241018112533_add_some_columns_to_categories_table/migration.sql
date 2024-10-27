-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- CreateTable
CREATE TABLE "_CategoryTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTags_AB_unique" ON "_CategoryTags"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryTags_B_index" ON "_CategoryTags"("B");

-- AddForeignKey
ALTER TABLE "_CategoryTags" ADD CONSTRAINT "_CategoryTags_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTags" ADD CONSTRAINT "_CategoryTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
