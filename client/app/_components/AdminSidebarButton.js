"use client";

import Image from "next/image";

import sidebarIcon from "@/public/toggle-sidebar.svg";

function AdminSidebarButton({ onSidebar, size, className }) {
  return (
    <button className={`w-fit h-fit p-3 rounded-full hover:glass ${className}`}>
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
