import {
  error,
  fetchBranchSuccess,
  loading,
} from "@/app/_lib/features/branch/branchSlice";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import { fetchData } from "@/app/_utils/helpers";
import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Form from "./Form";
import { useDispatch } from "react-redux";

function Page({ params: { branchSlug } }) {
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
      <div className="flex justify-end gap-5 z-0">
        <Popover
          placement="bottom-end"
          css={{
            zIndex: 10,
          }}
        >
          <PopoverTrigger>
            <Button isIconOnly className="bg-white shadow-md" radius="full">
              <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Thông tin đăng nhập</div>
              <ol className="mt-3">
                <li className="font-semibold">
                  1. Email:
                  <ul className="font-normal">
                    <li>- Bắt buộc</li>
                    <li>- Email phải hợp lệ</li>
                  </ul>
                </li>
                <li className="font-semibold">
                  2. Mật khẩu:
                  <ul className="font-normal">
                    <li>- Bắt buộc</li>
                    <li>- Phải có ít nhất 8 ký tự</li>
                    <li>- Tối đa 35 ký tự</li>
                    <li>- Có ít nhất 1 ký tự in hoa</li>
                    <li>- Có ít nhất 1 ký tự thường</li>
                    <li>- Có ít nhất 1 chữ số</li>
                  </ul>
                </li>
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
      <Form branchSlug={branchSlug} />
    </div>
  );
}

export default Page;
