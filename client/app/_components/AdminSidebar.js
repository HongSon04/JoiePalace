"use client";

// motion frammer import
import { motion, useAnimate } from "framer-motion";

// import next components
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import react hooks
import React, { useEffect } from "react";

// import custom components
import { Divider } from "@chakra-ui/react";

// import images
import blogIcon from "@/public/admin-sidebar/bai-viet.svg";
import tableAndChair from "@/public/admin-sidebar/ban-ghe.svg";
import dashboardIcon from "@/public/admin-sidebar/bang-dieu-khien.svg";
import settingIcon from "@/public/admin-sidebar/cai-dat.svg";
import branchIcon from "@/public/admin-sidebar/chi-nhanh.svg";
import drinkIcon from "@/public/admin-sidebar/do-uong.svg";
import customerIcon from "@/public/admin-sidebar/khach-hang.svg";
import contactIcon from "@/public/admin-sidebar/lien-he-ho-tro.svg";
import menuIcon from "@/public/admin-sidebar/menu.svg";
import foodIcon from "@/public/admin-sidebar/thuc-pham.svg";
import feedbackIcon from "@/public/admin-sidebar/phan-hoi-danh-gia.svg";
import notificationIcon from "@/public/admin-sidebar/thong-bao.svg";
import statisticIcon from "@/public/admin-sidebar/thong-ke.svg";
import eventIcon from "@/public/admin-sidebar/tiec-icon.svg";
import requestIcon from "@/public/admin-sidebar/yeu-cau.svg";
import categoryIcon from "@/public/admin-sidebar/danh-muc.svg";
import logo from "@/public/logo-dark.png";
import { useDispatch, useSelector } from "react-redux";
import { API_CONFIG } from "../_utils/api.config";
import AdminUser from "./AdminUser";
import { getCurrentBranch } from "../_lib/features/branch/branchSlice";
import { Tooltip } from "@nextui-org/react";

function AdminSidebar() {
  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isSidebarOpen) {
      const enterAnimation = async () => {
        await animate();

        await animate(
          scope.current,
          {
            width: "300px",
          },
          { duration: 0.3 }
        );
      };

      enterAnimation();
    } else {
      const enterAnimation = async () => {
        await animate(
          scope.current,
          {
            width: "80px",
          },
          { duration: 0.3 }
        );
      };

      enterAnimation();
    }
  }, [isSidebarOpen, animate, scope]);

  return (
    <motion.div
      ref={scope}
      layout
      className={`admin-sidebar items-center bg-whiteAlpha-100 *:!text-white flex flex-col h-full overflow-y-scroll relative rounded-xl`}
      style={{
        maxHeight: "calc(100vh - 3rem)",
      }}
    >
      <div className="flex-1 w-full">
        <AdminSidebarHeader />
        <Divider
          background={"rgba(0, 0, 0, 0.05)"}
          height={0.5}
          className={`${isSidebarOpen ? "w-5/6" : ""} shrink-0`}
        />
        <AdminSidebarNav></AdminSidebarNav>
      </div>
      <div className="flex-center pb-8 w-full">
        <AdminUser />
      </div>
    </motion.div>
  );
}

function AdminSidebarHeader() {
  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <div
      className={`${
        isSidebarOpen ? "flex-center flex-col" : ""
      } flex items-center justify-between w-full p-3`}
    >
      <Image
        priority={true}
        src={logo}
        width={65}
        height={65}
        alt="Joie Palace logo"
      />
    </div>
  );
}

function AdminSidebarNav() {
  const { currentBranch } = useSelector((state) => state.branch);
  // const isGeneralBranch = currentBranch.slug === API_CONFIG.GENERAL_BRANCH;

  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  const mainOptions = React.useMemo(() => {
    return [
      {
        title: "Bảng điều khiển",
        // path: isGeneralBranch
        //   ? "/admin/bang-dieu-khien"
        //   : `/admin/bang-dieu-khien/${currentBranch?.slug}`,
        path: `/admin/bang-dieu-khien/${currentBranch?.slug}`,
        icon: dashboardIcon,
        className: "",
      },
      {
        title: "Chi nhánh",
        path: `/admin/chi-nhanh/${currentBranch?.slug}`,
        icon: branchIcon,
        className: "",
      },
      {
        title: "Thống kê",
        path: `/admin/thong-ke/doanh-thu-tong/${currentBranch?.slug}`,
        // path: `/admin/thong-ke/doanh-thu-tong/${currentBranch?.slug}`,
        icon: statisticIcon,
        className: "",
      },
      {
        title: "Khách hàng",
        path: `/admin/khach-hang/${currentBranch?.slug}`,
        icon: customerIcon,
        className: "",
      },
      {
        title: "Yêu cầu",
        path: `/admin/yeu-cau/${currentBranch?.slug}`,
        icon: requestIcon,
        className: "",
        qty: 5,
      },
      {
        title: "Quản lý tiệc",
        path: `/admin/quan-ly-tiec/${currentBranch?.slug}`,
        icon: eventIcon,
        className: "",
      },
      {
        title: "Danh mục",
        path: `/admin/quan-ly-danh-muc/`,
        icon: categoryIcon,
        className: "",
      },
      {
        title: "Thực đơn",
        path: `/admin/thuc-don/`,
        icon: menuIcon,
        className: "",
      },
      {
        title: "Quản lý thực phẩm",
        path: `/admin/thuc-pham/`,
        icon: foodIcon,
        className: "",
      },
      {
        title: "Phản hồi & đánh giá",
        // path: isGeneralBranch
        //   ? `/admin/phan-hoi-danh-gia`
        //   : `/admin/phan-hoi-danh-gia/${currentBranch.slug}`,
        path: `/admin/phan-hoi-danh-gia/${currentBranch.slug}`,
        icon: feedbackIcon,
        className: "",
      },
      {
        title: "Bài viết",
        path: `/admin/bai-viet/`,
        icon: blogIcon,
        className: "",
      },
    ];
  }, [currentBranch]);

  const subOptions = React.useMemo(() => {
    return [
      {
        title: "Thông báo",
        path: `/admin/thong-bao/${currentBranch?.slug}`,
        icon: notificationIcon,
        className: "",
        qty: 5,
      },
      {
        title: "Liên hệ & hỗ trợ",
        // path: isGeneralBranch
        //   ? `/admin/lien-he-ho-tro`
        //   : `/admin/lien-he-ho-tro/${currentBranch.slug}`,
        path: `/admin/lien-he-ho-tro/${currentBranch.slug}`,
        icon: contactIcon,
        className: "",
      },
      {
        title: "Cài đặt",
        path: "/admin/cai-dat",
        icon: settingIcon,
        className: "",
      },
    ];
  }, [currentBranch]);

  return (
    <nav className="flex justify-center flex-col gap-[20px] rounded-xl w-full">
      <ul className={`mt-5 flex-center flex-col px-3 w-full`}>
        {mainOptions.map((item, index) => {
          return (
            <AdminSidebarItem
              item={item}
              key={index}
              className={item.className}
            ></AdminSidebarItem>
          );
        })}
      </ul>
      <Divider
        background={"rgba(0, 0, 0, 0.05)"}
        height={0.5}
        className={`${isSidebarOpen ? "w-5/6" : ""} shrink-0`}
      />
      <ul className={`flex-center flex-col px-3 w-full`}>
        {subOptions.map((item, index) => {
          return <AdminSidebarItem item={item} key={index}></AdminSidebarItem>;
        })}
      </ul>
    </nav>
  );
}

function AdminSidebarItem({ item, className }) {
  const pathName = usePathname();

  const isActive = pathName === item.path;

  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <Tooltip content={item.title} placement="right-end">
      <li
        item={item}
        className={`flex w-full items-center justify-between rounded-md !text-white mb-2 transition-all relative hover:bg-whiteAlpha-50 ${
          isActive ? "bg-whiteAlpha-100" : ""
        } ${item.qty ? "bg-whiteAlpha-50 animate-pulse" : ""} ${className}`}
      >
        <Link
          href={item.path}
          className={`flex items-center gap-2 p-2 flex-1 text-white !stroke-gray-600 rounded-md flex-center relative`}
        >
          <Image src={item.icon} alt={item.title} className={`w-6 h-6`} />
          {isSidebarOpen && (
            <span
              className={`text-white transition flex-1 min-w-max block text-base`}
            >
              {item.title}
            </span>
          )}
        </Link>
        {item.qty && (
          <span
            className={`shrink-0 w-5 h-5 bg-red-400 text-sm text-white rounded-full flex-center absolute -top-1 -right-1`}
          >
            {item.qty}
          </span>
        )}
      </li>
    </Tooltip>
  );
}

export default AdminSidebar;
