"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function Notification() {
  const router = useRouter();

  const onRedirect = () => {
    router.push("/auth/chon-chi-nhanh");
  };

  return (
    <div className="flex-center bg-blackAlpha-500 flex-col p-5 rounded-md gap-5 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-white backdrop-blur-lg">
      <ExclamationCircleIcon className="w-24 h-w-24" />
      <h1 className="text-xl leading-none font-bold">Chưa chọn chi nhánh</h1>
      <p className="text-base leading-none">
        Vui lòng chọn chi nhánh trước khi đăng nhập
      </p>

      <Button
        onClick={onRedirect}
        radius="full"
        className="bg-gold text-white font-semibold"
      >
        Chọn chi nhánh
      </Button>
    </div>
  );
}

export default Notification;
