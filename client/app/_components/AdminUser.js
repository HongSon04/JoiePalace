import {
  ArrowRightStartOnRectangleIcon,
  ArrowsRightLeftIcon,
  EllipsisHorizontalIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Link } from "@nextui-org/link";

function AdminUser() {
  const { isSidebarOpen } = useSelector((store) => store.sidebar);

  return (
    <Popover placement="right-start">
      <PopoverTrigger>
        <div
          className={`flex items-center w-full p-3 bg-whiteAlpha-100 hover:brightness-95 cursor-pointer ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
          <motion.h2
            className={`font-semibold text-sm text-gray-600 flex-1 text-left ml-2 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            Joie Admin 1
          </motion.h2>
          <Button
            isIconOnly
            radius="full"
            className={`bg-transparent ${isSidebarOpen ? "" : "hidden"}`}
          >
            <EllipsisHorizontalIcon className="text-gray-600 w-6 h-6" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="">
          <li className="w-full">
            <Link
              color={"foreground"}
              href="/admin/profile"
              className="text-gray-600 w-full flex items-center px-2 py-1 gap-2 hover:bg-gray-50"
            >
              <UserIcon className="w-6 h-6 text-gray-600" />
              Thông tin tài khoản
            </Link>
          </li>
          <li className="w-full">
            <Link
              color={"foreground"}
              href="/admin/change-password"
              className="text-gray-600 w-full flex items-center px-2 py-3 gap-2 hover:bg-gray-50"
            >
              <ArrowsRightLeftIcon className="w-6 h-6 text-gray-600" />
              Đổi mật khẩu
            </Link>
          </li>
          <li className="w-full">
            <Button
              startContent={
                <ArrowRightStartOnRectangleIcon className="w-6 h-6 text-red-400" />
              }
              className="text-red-400 w-full bg-transparent hover:bg-gray-50 justify-start px-2 py-1 gap-3"
            >
              Đăng Xuất
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default AdminUser;
