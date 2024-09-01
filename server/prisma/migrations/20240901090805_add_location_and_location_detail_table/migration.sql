-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 5,
    "images" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_details" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "slogan" TEXT NOT NULL,
    "slogan_description" TEXT NOT NULL,
    "slogan_images" TEXT[],
    "diagram_description" TEXT NOT NULL,
    "diagram_images" TEXT[],
    "equipment_description" TEXT NOT NULL,
    "equipment_images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_details_location_id_key" ON "location_details"("location_id");

-- AddForeignKey
ALTER TABLE "location_details" ADD CONSTRAINT "location_details_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
