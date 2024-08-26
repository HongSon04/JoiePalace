"use client";

import Image from "next/image";

import logo from "@/public/logo.png";
import AdminSidebarButton from "./AdminSidebarButton";

function AdminSidebarHeader({ onSidebar, size }) {
  return (
    <div
      className={`flex w-full items-center ${
        size === "small" ? "justify-center p-5 flex-col" : "justify-between"
      }`}
    >
      <Image src={logo} width={65} height={65} alt="Joie Palace logo"></Image>
      <AdminSidebarButton onSidebar={onSidebar} size={size} />
    </div>
  );
}

export default AdminSidebarHeader;
