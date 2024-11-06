-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "expired_at" SET DEFAULT now() + interval '3 day';

-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
