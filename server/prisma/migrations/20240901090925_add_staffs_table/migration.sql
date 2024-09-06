-- CreateTable
CREATE TABLE "staffs" (
    "id" SERIAL NOT NULL,
    "locations_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT,
    "payment_info" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staffs_locations_id_key" ON "staffs"("locations_id");

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_locations_id_fkey" FOREIGN KEY ("locations_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
