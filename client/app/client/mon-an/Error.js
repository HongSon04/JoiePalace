import { Button } from "@nextui-org/react";

function Error() {
  return (
    <section className="responsive-container !pt-44 text-white text-center font-gilroy p-5 flex flex-col flex-center gap-5">
      <h2 className="text-xl text-gray-400">
        Đã có lỗi xảy ra khi tải dữ liệu trang
      </h2>
      <h2 className="text-xl text-gray-400">Quý khách vui lòng thử lại sau</h2>

      <Button
        className="text-gold text-base underline underline-offset-2 w-fit hover:!bg-whiteAlpha-50"
        variant="ghost"
      >
        Thử lại
      </Button>
    </section>
  );
}

export default Error;
