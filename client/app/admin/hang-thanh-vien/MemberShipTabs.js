"use cient";
import Loading from "@/app/loading";
import {
  EllipsisVerticalIcon as VerticalDotsIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import FormInput from "@/app/_components/FormInput";
import Uploader from "@/app/_components/Uploader";
import { motion, AnimatePresence } from "framer-motion";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/app/_utils/api.config";
import { getAllMemberShips } from "@/app/_services/membershipsServices";

const MAX_FILE_SIZE = 5000000;

function checkFileType(file) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png")
      return true;
  }
  return false;
}
const checkFileSize = (file) => {
  if (file?.size) {
    return file.size <= MAX_FILE_SIZE;
  }
  return false;
};

const MemberShips = () => {
  const router = useRouter();
  const [members, setMembers] = useState(null);

  useEffect(() => {
    const callApi = async () => {
        const data = await getAllMemberShips();    
        console.log(data);
    }
    callApi();
  }, [])

  return (
    <>
      <div className="w-full min-h-[100vh] mt-12 flex flex-col gap-[30px]">
        <div className="w-full flex justify-end">
          <Button
            // onClick={onOpen}
            radius="full"
            className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
            startContent={
              <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
            }
          >
            Thêm danh mục
          </Button>
        </div>
        <div className="w-full min-h-[500px]">
          <table className="table-auto border-collapse border border-gray-300 w-full text-center text-white">
            <thead>
              <tr className="bg-whiteAlpha-100">
                <th className="border border-[#5B5B5B] px-4 py-2">ID</th>
                <th className="border border-[#5B5B5B] px-4 py-2">
                  Tên danh mục
                </th>
                <th className="border border-[#5B5B5B] px-4 py-2">
                  Số bài viết
                </th>
                <th className="border border-[#5B5B5B] px-4 py-2 w-[1%]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {categories.map((category) => (
                <tr key={category.id} className="bg-whiteAlpha-50">
                  <td className="border border-[#5B5B5B] px-4 py-2 uppercase">
                    {category.id}
                  </td>
                  <td className="border border-[#5B5B5B] px-4 py-2">
                    {category.name}
                  </td>
                  <td className="border border-[#5B5B5B] px-4 py-2">
                    {getNumberBlog(category.id)}
                  </td>
                  <td className="border border-[#5B5B5B] px-4 py-2 text-cyan-400 cursor-pointer flex items-center justify-center whitespace-nowrap">
                    <div className="relative flex justify-center items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <VerticalDotsIcon className="text-default-300" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem>
                            <Link
                              href={`/admin/quan-ly-danh-muc/${category.id}`}
                            >
                              Xem chi tiết
                            </Link>
                          </DropdownItem>
                          <DropdownItem
                            className="text-red-400"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Xóa danh mục
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MemberShips;
