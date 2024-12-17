import { Spinner } from "@nextui-org/react";
import React from "react";

const IconButtonSave = ({
  title,
  color,
  onClick,
  type,
  isLoading,
  children,
  loadingText,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-6 py-2 text-white ${color} hover:brightness-90 active:brightness-90 active:scale-90 transition-all rounded-full font-normal flex gap-1 items-center justify-center`}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : children}
      {isLoading ? loadingText || "Đang lưu..." : title}
      {/* {title} */}
    </button>
  );
};

export default IconButtonSave;
