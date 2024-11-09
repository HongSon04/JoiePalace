"use client"
import AdminHeader from "@/app/_components/AdminHeader";
import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { z } from "zod";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { FiUpload } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { createAccountUser } from "@/app/_services/accountServices";
import Image from "next/image";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const formSchema = z.object({
  username: z.string().min(2, "Vui lòng nhập Họ và tên!"),
  email: z.string().refine((value) => emailRegex.test(value), {
    message: "Vui lòng nhập đúng địa chỉ Email!",
  }),
  password: z.string().min(8, "Tối thiểu 8 kí tự!").max(36, "Tối đa 36 kí tự!"),
});

const Page = () => {
   
  
  const toast = useCustomToast();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const [branchId, setBranchId] = useState(null); 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const branch_id = user.branch_id;
        setBranchId(branch_id); 
      }
    }
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
   

    try {
     
      formSchema.parse(formData);
      setErrors({}); 
     
      // console.log('Dữ liệu sẽ gửi lên server:', {
      //   username: formData.username,
      //   email: formData.email,
      //   password: formData.password,
      //   phone: "null",  
      //   branch_id: branchId,
      // });
      const response = await createAccountUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: "null", 
        branch_id : branchId
      });
      
      
      toast({
        position: "top",
        type: "success",
        title: "Đăng ký thành công!",
        description: "Tài khoản khách hàng đã được thêm thành công !",
        closable: true,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
      });
     
    } catch (error) {
      if (error.response) {
        toast({
          position: "top",
          type: "error",
          title: "Đăng ký thất bại!",
          description: error?.response?.data?.message,
          closable: true,
        });
      }

      
      if (error?.errors) {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors); 
      }
    }
  };

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
          <form  onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="w-1/3">
                <p className="mb-3">Tên</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="text"
                  name="username" 
                  placeholder="rubysayhi"
                  value={formData.username} 
                  onChange={handleChange}
                />
                <span className="text-sm text-red-600">
                  {errors.username && errors.username}
                </span>
              </div>

              <div className="w-1/3">
                <p className="mb-3">Email</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="email"
                  name="email" 
                  placeholder="rubysayhi@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="text-sm text-red-600">
                  {errors.email && errors.email}
                </span>
              </div>

              <div className="w-1/3">
                <p className="mb-3">Mật khẩu</p>
                <input
                  className="w-full p-3 rounded-lg bg-whiteAlpha-100"
                  type="text" 
                  name="password" 
                  placeholder="Mật khẩu"
                  value={formData.password} 
                  onChange={handleChange}
                />
                <span className="text-sm text-red-600">
                  {errors.password && errors.password}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-[10px]">
              {/* <button className="button rounded-[1111px] flex gap-[5px] items-center p-3 bg-red-400">
                <RiDeleteBin2Line className="text-base" />
                Xóa
              </button> */}
              <button
                type="submit"
                className="button rounded-[1111px] flex gap-[5px] items-center p-3 bg-teal-400"
              >
                  <FiUpload className="text-base" />
                  Thêm
                 
              </button>
            </div>
          </form>
          </div>
         
        </div>
    </main>
  );
};

export default Page;
