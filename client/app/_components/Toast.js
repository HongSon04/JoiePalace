"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { FaCircleXmark } from "react-icons/fa6";

function Toast({
  title = "Đăng nhập thành công",
  description = "Chào mừng bạn trở lại",
  type = "success",
  closable = true,
  onClose = () => {},
}) {
  const toastType = {
    success: "bg-teal-400 text-white",
    error: "bg-red-400 text-white",
    warning: "bg-yellow-400 text-white",
    info: "bg-blue-400 text-white",
  }[type];

  const Icon = {
    success: CheckCircleIcon,
    error: FaCircleXmark,
    warning: MinusCircleIcon,
    info: ExclamationCircleIcon,
  }[type];

  return (
    <div
      className={`p-3 rounded-lg overflow-hidden shadow-lg flex gap-4 ${toastType} min-w-max`}
    >
      <Icon className="w-6 h-6"></Icon>
      <div className="flex flex-col flex-1 *:min-w-max">
        <h4 className="text-inherit font-bold text-base">{title}</h4>
        <h4 className="text-inherit font-regular text-md flex-1">
          {description}
        </h4>
      </div>
      {closable && (
        <Button
          size="sm"
          className="ml-auto bg-transparent hover:text-slate-100 focus:text-slate-100 rounded-full text-white transition"
          onClick={onClose}
          isIconOnly
        >
          <XMarkIcon className="text-inherit w-4 h-4"></XMarkIcon>
        </Button>
      )}
    </div>
  );
}

export default Toast;
