-- CreateTable
CREATE TABLE "memberships" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "decsription" TEXT NOT NULL,
    "booking_total" INTEGER NOT NULL,
    "booking_totalAmount" INTEGER NOT NULL,
    "gifts" JSONB[],
    "images" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_memberships_id_fkey" FOREIGN KEY ("memberships_id") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
