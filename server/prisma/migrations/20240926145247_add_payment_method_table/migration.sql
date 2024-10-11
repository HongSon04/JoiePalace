-- CreateEnum
CREATE TYPE "LiveMode" AS ENUM ('sandbox', 'live');

-- CreateTable
CREATE TABLE "payment_method" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "live_mode" "LiveMode" NOT NULL DEFAULT 'sandbox',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_slug_key" ON "payment_method"("slug");
