"use client";

import { Divider } from "@chakra-ui/react";
import AdminSidebarItem from "./AdminSidebarItem";

import dashboardIcon from "@/public/bang-dieu-khien.svg";
import branchIcon from "@/public/chi-nhanh.svg";
import statisticIcon from "@/public/thong-ke.svg";
import customerIcon from "@/public/khach-hang.svg";
import requestIcon from "@/public/yeu-cau.svg";
import eventIcon from "@/public/tiec-icon.svg";
import menuIcon from "@/public/menu.svg";
import foodIcon from "@/public/mon-an.svg";
import drinkIcon from "@/public/do-uong.svg";
import notificationIcon from "@/public/thong-bao.svg";
import contactIcon from "@/public/lien-he-ho-tro.svg";
import settingIcon from "@/public/cai-dat.svg";

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

export default AdminSidebarNav;
