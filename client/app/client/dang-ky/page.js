"use client";
import IconButton from "@/app/_components/IconButton";
import InputIndex from "@/app/_components/InputIndexClient";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import React, { useState } from "react";
import { createAccountUser } from "@/app/_services/accountServices";
import axios from "axios";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const formSchema = z.object({
  username: z.string().min(2, "Vui lòng nhập Họ và tên!"),
  email: z.string().refine((value) => emailRegex.test(value), {
    message: "Vui lòng nhập đúng địa chỉ Email!",
  }),
  password: z.string().min(8, "Tối thiểu 8 kí tự!").max(36, "Tối đa 36 kí tự!"),
});
const Page = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    setLoading(true);
    try {
      formSchema.parse(formData);
      setErrors({});
      const response = await createAccountUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: "null",
      });
      const emailRes = await axios.post(
        "http://joieplace.live/api/auth/send-email-verify",
        { email: formData.email }
      );
      toast({
        position: "top",
        type: "success",
        title: "Đăng ký thành công!",
        description: "Đăng nhập tài khoản vừa đăng ký!",
        closable: true,
      });
      setLoading(false);
      router.push("/client/dang-nhap");
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
      setLoading(false);
      error?.errors?.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
    }
  };
  return (
    <div className="w-screen h-screen flex relative lg:gap-28 items-center justify-center p-8 lg:p-0">
      <div className="w-1/2 h-full overflow-hidden hidden md:block">
        <Image
          src="/img_login.png"
          w={"100%"}
          h={"100%"}
          className="object-cover"
          alt=""
        />
      </div>
      <Image className="absolute" src="/decor_cover" alt="" />
      <div className="w-full md:w-1/2 h-full p-0 lg:pr-28 flex items-center flex-shrink-0">
        <div className="p-6 flex flex-col w-full max-w-[490px] bg-blackAlpha-500 gap-4">
          <h1 className="text-4xl font-black text-gold">Đăng ký</h1>
          <span className="text-base">
            Nhập thông tin liên hệ để trở thành thành viên của chúng tôi
          </span>
          <form action="" className="flex flex-col gap-6 text-base">
            <InputIndex
              value={formData.username}
              messageError={errors.username}
              onChange={handleChange}
              name="username"
              type="text"
              placeholder="Họ và tên*"
            />
            <InputIndex
              value={formData.email}
              messageError={errors.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Email*"
            />
            <InputIndex
              value={formData.password}
              messageError={errors.password}
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Mật khẩu*"
            />
            <span className="text-gold text-base font-normal">
              Bạn đã có tài khoản?{" "}
              <span
                className="cursor-pointer text-gold"
                onClick={() => router.push("/client/dang-nhap")}
              >
                Đăng nhập ngay
              </span>
            </span>
            <IconButton
              className={`w-full text-white flex items-center gap-2 rounded-full !bg-gold py-${
                loading ? "1" : "0"
              } h-auto ${loading ? "select-none" : ""}`}
              onClick={handleSubmit}
            >
              {!loading ? (
                <div className="w-full h-full flex items-center gap-2 justify-center !py-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M15.5 12C17.71 12 19.5 10.21 19.5 8C19.5 5.79 17.71 4 15.5 4C13.29 4 11.5 5.79 11.5 8C11.5 10.21 13.29 12 15.5 12ZM15.5 6C16.6 6 17.5 6.9 17.5 8C17.5 9.1 16.6 10 15.5 10C14.4 10 13.5 9.1 13.5 8C13.5 6.9 14.4 6 15.5 6ZM15.5 14C12.83 14 7.5 15.34 7.5 18V20H23.5V18C23.5 15.34 18.17 14 15.5 14ZM9.5 18C9.72 17.28 12.81 16 15.5 16C18.2 16 21.3 17.29 21.5 18H9.5ZM6.5 15V12H9.5V10H6.5V7H4.5V10H1.5V12H4.5V15H6.5Z"
                      fill="white"
                    />
                  </svg>
                  <span className="font-medium">Đăng ký ngay</span>
                </div>
              ) : (
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              )}
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
