"use client";

// import next components
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import react hooks
import { useState } from "react";

// import custom components
import { Divider } from "@chakra-ui/react";

// import images
import dashboardIcon from "@/public/bang-dieu-khien.svg";
import settingIcon from "@/public/cai-dat.svg";
import branchIcon from "@/public/chi-nhanh.svg";
import drinkIcon from "@/public/do-uong.svg";
import customerIcon from "@/public/khach-hang.svg";
import contactIcon from "@/public/lien-he-ho-tro.svg";
import logo from "@/public/logo.png";
import menuIcon from "@/public/menu.svg";
import foodIcon from "@/public/mon-an.svg";
import notificationIcon from "@/public/thong-bao.svg";
import statisticIcon from "@/public/thong-ke.svg";
import eventIcon from "@/public/tiec-icon.svg";
import sidebarIcon from "@/public/toggle-sidebar.svg";
import requestIcon from "@/public/yeu-cau.svg";

function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const size = isSidebarOpen ? "big" : "small";

  function handleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div
      className={`admin-sidebar flex flex-col max-h-screen overflow-y-scroll relative ${
        size === "small" ? "-m-5" : ""
      }`}
    >
      <AdminSidebarHeader onSidebar={handleSidebar} size={size} />
      <Divider
        background={"rgba(255, 255, 255, 0.2)"}
        height={0.5}
        className={`${size === "small" ? "w-5/6" : ""} shrink-0`}
      />
      <AdminSidebarNav size={size}></AdminSidebarNav>
    </div>
  );
}

function AdminSidebarHeader({ onSidebar, size }) {
  return (
    <div
      className={`flex w-full items-center ${
        size === "small" ? "justify-center p-5 flex-col" : "justify-between"
      }`}
    >
      <Image src={logo} width={65} height={65} alt="Joie Palace logo" />
      <AdminSidebarButton onSidebar={onSidebar} size={size} />
    </div>
  );
}

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

function AdminSidebarNav({ size }) {
  const mainOptions = [
    {
      title: "Bảng điều khiển",
      path: "/admin/bang-dieu-khien",
      icon: dashboardIcon,
    },
    { title: "Chi nhánh", path: "/admin/chi-nhanh", icon: branchIcon },
    { title: "Thống kê", path: "/admin/thong-ke", icon: statisticIcon },
    {
      title: "Khách hàng",
      path: "/admin/khach-hang",
      icon: customerIcon,
    },
    {
      title: "Yêu cầu",
      path: "/admin/yeu-cau",
      icon: requestIcon,
      qty: 5,
    },
    {
      title: "Quản lý tiệc",
      path: "/admin/quan-ly-tiec",
      icon: eventIcon,
    },
    {
      title: "Thực đơn",
      path: "/admin/thuc-don",
      icon: menuIcon,
    },
    {
      title: "Món ăn",
      path: "/admin/mon-an",
      icon: foodIcon,
    },
    {
      title: "Đồ uống",
      path: "/admin/do-uong",
      icon: drinkIcon,
    },
  ];

  const subOptions = [
    {
      title: "Thông báo",
      path: "/admin/thong-bao",
      icon: notificationIcon,
      qty: 5,
    },
    {
      title: "Liên hệ & hỗ trợ",
      path: "/admin/lien-he-ho-tro",
      icon: contactIcon,
    },
    {
      title: "Cài đặt",
      path: "/admin/cai-dat",
      icon: settingIcon,
    },
  ];

  return (
    <nav className="has-[active]:glass flex justify-center flex-col gap-[20px]">
      <ul
        className={`mt-5 flex-center flex-col ${
          size === "small" ? "px-5" : ""
        }`}
      >
        {mainOptions.map((item, index) => {
          return (
            <AdminSidebarItem
              size={size}
              item={item}
              key={index}
            ></AdminSidebarItem>
          );
        })}
      </ul>
      <Divider
        background={"rgba(255, 255, 255, 0.2)"}
        height={0.5}
        className={`${size === "small" ? "w-5/6" : ""}`}
      />
      <ul className={`flex-center flex-col ${size === "small" ? "px-5" : ""}`}>
        {subOptions.map((item, index) => {
          return (
            <AdminSidebarItem
              size={size}
              item={item}
              key={index}
            ></AdminSidebarItem>
          );
        })}
      </ul>
    </nav>
  );
}

function AdminSidebarItem({ item, size }) {
  const pathName = usePathname();

  const isActive = pathName === item.path;

  if (size === "small")
    return (
      <li
        item={item}
        className={`w-full flex-center items-center rounded-md !text-white`}
      >
        <Link
          href={item.path}
          className={`flex flex-1 flex-col justify-center gap-3 hover:glass rounded-md items-center text-white p-3 ${
            isActive ? "glass" : ""
          }`}
        >
          <Image src={item.icon} alt={item.title} className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.title}</span>
        </Link>
      </li>
    );

  return (
    <li
      item={item}
      className={`flex items-center p-2 hover:glass rounded-md !text-white mb-2 w-[300px] ${
        isActive ? "glass" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1 text-white">
        <Image src={item.icon} alt={item.title} className="w-6 h-6 mr-2" />
        <Link href={item.path} className="text-white hover:text-white flex-1">
          {item.title}
        </Link>
      </div>
      {item.qty && (
        <span className="shrink-0 w-5 h-5 bg-red-400 text-sm text-white rounded-full flex-center">
          {item.qty}
        </span>
      )}
    </li>
  );
}

export default AdminSidebar;
