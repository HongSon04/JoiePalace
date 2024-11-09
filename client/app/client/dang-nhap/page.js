"use client";
import IconButton from "@/app/_components/IconButton";
import InputIndex from "@/app/_components/InputIndexClient";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loginAccountUser, loginGoogle } from "@/app/_services/accountServices";
import { decodeJwt } from "@/app/_utils/helpers";
import useApiServices from "@/app/_hooks/useApiServices";
import { useDispatch } from "react-redux";
import { useSession, signIn } from "next-auth/react";
import { GetPlatform, getSessionData } from "@/app/_utils/nextAuth";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const formSchema = z.object({
  email: z.string().refine((value) => emailRegex.test(value), {
    message: "Vui lòng nhập đúng địa chỉ Email!",
  }),
  password: z.string().min(8, "Tối thiểu 8 kí tự!").max(36, "Tối đa 36 kí tự!"),
});
const Page = () => {
  const { data } = useSession();
  const router = useRouter();
  const toast = useCustomToast();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { tryCatchWrapper, makeAuthorizedRequest } = useApiServices();
  const dispatch = useDispatch();
  const platform = GetPlatform();
  const [isLoginCalled, setIsLoginCalled] = useState(false);

  const [formData, setFormData] = useState({
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

  const handleLoginGoogle = async (e) => {
    e.preventDefault();
    await signIn("google");
  };

  // login by account
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    setLoading(true);
    // main
    try {
      formSchema.parse(formData);
      setErrors({});
      const postToAPI = async () => {
        const response = await loginAccountUser(formData);
        Cookies.set("accessToken", response.data.data.access_token, {
          expires: 1,
        });
        localStorage.setItem("refreshToken", response.data.data.refresh_token);
        return response.data;
      };
      const result = await tryCatchWrapper(postToAPI, {
        message: "Vui lòng kiểm tra lại thông tin!",
      });

      let user = null;
      if (result.success !== false) {
        user = decodeJwt(result.data.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.username,
            email: user.email,
            memberships: user.memberships,
            phone: user.phone,
            role: user.role,
          })
        );
      }
      toast({
        position: "top",
        type: result.success === false ? "error" : "success",
        title: `${
          result.success === false
            ? "Đăng nhập thất bại!"
            : "Đăng nhập thành công!"
        }`,
        description:
          result.success === false
            ? result?.error?.message
            : `Chào mừng ${user?.username} đã trở lại ✌️✌️`,
        closable: true,
      });
      setLoading(false);

      result.success !== false ? router.push("/") : null;
    } catch (error) {
      if (error.response) {
        toast({
          position: "top",
          type: "error",
          title: "Đăng nhập thất bại!",
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

  console.log("data", process.env);

  // call api login social  
  const callToApiLoginSocial = async () => {
    if (isLoginCalled) return;
    setIsLoginCalled(true);
    let user = null;
    const response = await loginGoogle({
      email: data?.user?.email.toString(),
      name: data?.user?.name.toString(),
      platform: platform ? platform : "Windows",
    });
    if (response.status === 200) {
      user = decodeJwt(response.data.data.access_token);
      Cookies.set("accessToken", response.data.data.access_token, {
        expires: 1,
      });
      localStorage.setItem("refreshToken", response.data.data.refresh_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.username,
          email: user.email,
          memberships: user.memberships,
          phone: user.phone,
          role: user.role,
          avatar: data?.user?.image,
          accountGoogle: true,
        })
      );
      toast({
        position: "top",
        type: "success",
        title: `"Đăng nhập thành công!"`,
        description: `Chào mừng ${data?.user?.name} đã trở lại ✌️`,
        closable: true,
      });
      router.push("/");
    } else {
      toast({
        position: "top",
        type: "error",
        title: `"Đăng nhập thất bại!"`,
        description: `Đã có lỗi khi đăng nhập với Google`,
        closable: true,
      });
    }
    setIsLoginCalled(false);
  };
  console.log("platform", platform);

  if (data && platform !== null) {
    callToApiLoginSocial();
  }
  return (
    <div className="w-screen h-screen flex relative gap-28 items-center justify-center">
      <div className="w-1/2 h-full overflow-hidden">
        <Image
          src="/img_login.png"
          w={"100%"}
          h={"100%"}
          className="object-cover"
          alt=""
        />
      </div>
      <Image className="absolute" src="/decor_cover" alt="" />
      <div className="w-1/2 h-full pr-28 flex items-center">
        <div className="p-6 flex flex-col w-full max-w-[490px] bg-blackAlpha-500 gap-4">
          <h1 className="text-4xl font-black text-gold">Đăng nhập</h1>
          <span className="text-base">
            Nhập thông tin liên hệ để trở thành thành viên của chúng tôi
          </span>
          <form action="" className="flex flex-col gap-6 text-base">
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
            <span className="text-gold text-base font-normal cursor-pointer">
              Quên mật khẩu
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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                      fill="white"
                    />
                  </svg>
                  <span className="font-medium">Đăng nhập ngay</span>
                </div>
              ) : (
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              )}
            </IconButton>
            <span className="flex w-full justify-center font-light">Hoặc</span>
            <button
              onClick={handleLoginGoogle}
              className="w-fit rounded-full bg-white text-black flex items-center gap-2 py-3 px-5 m-auto"
            >
              <Image w={"auto"} h={"auto"} src="/googeIcon.svg" alt="" />
              <span className="font-medium">Đăng nhập bằng Google</span>
            </button>
            <span className="text-center text-gold text-base font-normal">
              Bạn chưa có tài khoản?{" "}
              <span
                className="cursor-pointer text-gold"
                onClick={() => router.push("/client/dang-ky")}
              >
                Đăng ký ngay
              </span>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
