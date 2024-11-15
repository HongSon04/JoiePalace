-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_decor_id_fkey";

-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_party_type_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "stage_id" INTEGER,
ALTER COLUMN "party_type_id" DROP NOT NULL,
ALTER COLUMN "menu_id" DROP NOT NULL,
ALTER COLUMN "decor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_party_type_id_fkey" FOREIGN KEY ("party_type_id") REFERENCES "party_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_decor_id_fkey" FOREIGN KEY ("decor_id") REFERENCES "decors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
