"use client";

import { ClassNames } from "@emotion/react";

function IconButton({
  onClick,
  className = "",
  children,
  size = "md",
  type,
  background = "default",
}) {
  const _size = {
    xxsm: "w-4 h-4",
    xsm: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const _background = {
    none: "",
    default: "bg-whiteAlpha-100",
  }[background];

  return (
    <button
      type={type}
      className={`flex-center rounded-full ${className} ${_size} ${_background} hover:bg-whiteAlpha-200 text-white`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
