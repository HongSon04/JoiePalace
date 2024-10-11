"use client";

import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const onRedirect = () => {
    router.push("/auth/chon-chi-nhanh");
  };

  return (
    <div className="relative w-full h-screen p-8">
      <Image
        priority
        src={authBg}
        fill
        alt="auth background"
        className="object-cover contrast-200 saturate-150 exposure-75"
      />
      {/* BUTTONS */}
      <div className="flex justify-end gap-5">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button isIconOnly className="bg-white shadow-md" radius="full">
              <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Thông tin đăng nhập</div>
              <ol className="mt-3">
                <li>1. Email</li>
                <li>2. Mật khẩu</li>
              </ol>
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip content="Trò chuyện với nhân viên kỹ thuật">
          <Button isIconOnly className="bg-white shadow-md" radius="full">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600" />
          </Button>
        </Tooltip>
      </div>

      {/* FORM */}
      <div className="flex-center bg-white flex-col p-5 rounded-md text-gray-800 gap-5 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
        <ExclamationCircleIcon className="w-24 h-w-24" />
        <h1 className="text-xl font-bold">Chưa chọn chi nhánh</h1>
        <p className="text-base">Vui lòng chọn chi nhánh trước khi đăng nhập</p>

        <Button
          onClick={onRedirect}
          radius="full"
          className="bg-gold text-white font-semibold"
        >
          Chọn chi nhánh
        </Button>
      </div>
    </div>
  );
}

export default Page;
