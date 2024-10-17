-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- CreateTable
CREATE TABLE "category_blogs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "images" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_blogs_slug_key" ON "category_blogs"("slug");
