import AdminHeader from "@/app/_components/AdminHeader";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import Image from "next/image";
const page = () => {
  return (
    <main className="grid gap-6 p-4 text-white">
      <AdminHeader
        title="Thêm tài khoản khách hàng "
        showSearchForm={false}
      ></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base ">
        <p>Khách hàng</p>
        <p>/</p>
        <p>Thêm tài khoản khách hàng</p>
      </div>
      <div className="p-5 bg-whiteAlpha-100 rounded-lg grid gap-4">
        <div className="flex gap-3 items-center">
          <Image
            className="rounded-full"
            src="/image/user.jpg"
            width={90}   
            height={90}  
          />
          <div className="flex gap-[5px] items-center"></div>
        </div>
        <div className="w-full">
          <div>
            <form className="w-full flex gap-6 items-center mb-3">
              <div className="w-1/3">
                <p className="mb-3">Tên</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="text"
                  placeholder="rubysayhi"
                  value=""
                ></input>
              </div>
              <div className="w-1/3">
                <p className="mb-3">Email</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="email"
                  placeholder="rubysayhi@gmail.com"
                  value=""
                ></input>
              </div>
              <div className="w-1/3">
                <p className="mb-3">Mật khẩu</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="text"
                  placeholder="Mật khẩu"
                ></input>
              </div>
            </form>
          </div>
          <div className="flex justify-end">
            <div className="flex justify-center items-center gap-[10px]">
              <button className="button rounded-[1111px] flex gap-[5px] items-center p-3 bg-red-400">
                <RiDeleteBin2Line className="text-base" />
                Xóa
              </button>
              <button className="button rounded-[1111px] flex gap-[5px] items-center p-3 bg-teal-400">
                <FiUpload className="text-base" />
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
