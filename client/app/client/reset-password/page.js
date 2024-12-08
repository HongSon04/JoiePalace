"use client";
import InputIndex from "@/app/_components/InputIndexClient";
import useApiServices from "@/app/_hooks/useApiServices";
import { forgotPassword, resetPassword } from "@/app/_services/accountServices";
import { decodeJwt } from "@/app/_utils/helpers";
import { Image, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formSchema = z
  .object({
    new_password: z
      .string({
        required_error: "Quý khách vui lòng nhập mật khẩu mới",
      })
      .min(1, {
        message: "Quý khách vui lòng nhập mật khẩu mới",
      })
      .min(8, {
        message: "Mật khẩu của quý khách phải có tối thiểu 8 ký tự",
      })
      .refine(
        (value) => {
          // Add your custom password strength validation logic here
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          return hasUpperCase && hasLowerCase && hasNumber;
        },
        {
          message:
            "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số",
        }
      ),
    confirm_password: z
      .string({
        required_error: "Quý khách vui lòng nhập lại mật khẩu mới",
      })
      .min(1, {
        message: "Quý khách vui lòng nhập lại mật khẩu mới",
      })
      .min(8, {
        message: "Mật khẩu của quý khách phải có tối thiểu 8 ký tự",
      }),
  })
  .refine(
    (data) => {
      if (data.new_password && data.confirm_password) {
        return data.new_password === data.confirm_password;
      }
      return true;
    },
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirm_password"],
    }
  )
  .refine(
    (data) => {
      if (!data.new_password) {
        return true;
      }
      return data.new_password === data.confirm_password;
    },
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirm_password"],
    }
  );

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { tryCatchWrapper, makeAuthorizedRequest } = useApiServices();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const onSubmit = async (data) => {
    setCount((count) => count + 1);
    setLoading(true);
    // main
    try {
      const email = JSON.parse(localStorage.getItem("reset_email"));

      if (!token) {
        throw new Error("Token không hợp lệ");
      }

      const submitData = {
        ...data,
        token,
        email,
      };

      const result = await tryCatchWrapper(() => resetPassword(submitData), {
        message: "Vui lòng kiểm tra lại thông tin!",
      });

      console.log("result -> ", result);

      if (!result) {
        throw new Error("Có lỗi xảy ra");
      }

      if (result.status === 200 || result.status === 201) {
        toast({
          title: "Đổi mật khẩu thành công!",
          description: "Quý khách có thể đăng nhập bằng mật khẩu mới",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Đổi mật khẩu thất bại!",
          description: result?.error || "Vui lòng thử lại sau",
          status: "error",
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Có sự cố khi đổi mật khẩu!",
        description: error?.message || "Vui lòng thử lại sau",
        status: "error",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-4xl font-black text-gold">Đổi mật khẩu</h1>
          <span className="text-base">
            Joie Palace sẽ gửi liên kết thay đổi mật khẩu qua mail bên dưới để
            đảm bảo tính bảo mật
          </span>
          <form
            className="flex flex-col gap-6 text-base"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputIndex
              value={watch("new_password")}
              messageError={errors?.new_password?.message}
              onChange={handleChange}
              name="new_password"
              placeholder="Mật khẩu mới *"
            />
            <InputIndex
              value={watch("confirm_password")}
              messageError={errors?.confirm_password?.message}
              onChange={handleChange}
              name="confirm_password"
              placeholder="Nhập lại mật khẩu *"
            />
            <Button
              type="submit"
              className="bg-gold w-full text-white rounded-full"
              isLoading={loading}
            >
              {loading ? "Đang đổi mật khẩu" : "Đổi mật khẩu"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
