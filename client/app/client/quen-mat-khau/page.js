"use client";
import InputIndex from "@/app/_components/InputIndexClient";
import useApiServices from "@/app/_hooks/useApiServices";
import { forgotPassword } from "@/app/_services/accountServices";
import { Image, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const formSchema = z.object({
  email: z
    .string({
      required_error: "Vui lòng nhập email",
    })
    .refine((value) => emailRegex.test(value), {
      message: "Vui lòng nhập đúng địa chỉ Email!",
    }),
});
const Page = () => {
  const router = useRouter();
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
      const result = await tryCatchWrapper(() => forgotPassword(data), {
        message: "Vui lòng kiểm tra lại thông tin!",
      });

      if (result.success) {
        toast({
          title: "Gửi mail thành công!",
          description: "Quý khách vui lòng kiểm tra email",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Gửi mail thất bại!",
          description: result?.error || "Vui lòng thử lại sau",
          status: "error",
          position: "top-right",
        });
      }
    } catch (error) {
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
          <h1 className="text-4xl font-black text-gold">Quên mật khẩu</h1>
          <span className="text-base">
            Joie Palace sẽ gửi liên kết thay đổi mật khẩu qua mail bên dưới để
            đảm bảo tính bảo mật
          </span>
          <form
            className="flex flex-col gap-6 text-base"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputIndex
              value={watch("email")}
              messageError={errors?.email?.message}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Email*"
            />
            <Button
              type="submit"
              className="bg-gold w-full text-white rounded-full"
              startContent={
                loading ? null : <FiMail className="w-5 h-5 text-white" />
              }
              isLoading={loading}
            >
              {loading ? "Đang gửi mail" : count > 0 ? "Gửi lại" : "Gửi mail"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
