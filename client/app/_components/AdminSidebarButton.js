"use client";

import Image from "next/image";

import sidebarIcon from "@/public/admin-sidebar/toggle-sidebar.svg";

function AdminSidebarButton({ onSidebar, size, className }) {
  return (
    <button
      className={`w-fit h-fit p-3 rounded-full bg-whiteAlpha-100 hover:bg-whiteAlpha-200 ${className}`}
    >
      <Image
        className="rotate-180"
        src={sidebarIcon}
        width={24}
        height={24}
        alt="Toggle sidebar"
        onClick={onSidebar}
      ></Image>
    </button>
  );
}

export default AdminSidebarButton;
