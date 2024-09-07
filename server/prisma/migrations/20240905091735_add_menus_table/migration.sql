-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodMenus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_slug_key" ON "menus"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodMenus_AB_unique" ON "_FoodMenus"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodMenus_B_index" ON "_FoodMenus"("B");

-- AddForeignKey
ALTER TABLE "_FoodMenus" ADD CONSTRAINT "_FoodMenus_A_fkey" FOREIGN KEY ("A") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodMenus" ADD CONSTRAINT "_FoodMenus_B_fkey" FOREIGN KEY ("B") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
