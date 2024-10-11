"use client";

import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import {
  login,
  setEmail,
  setPassword,
} from "@/app/_lib/features/authentication/accountSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Form from "./Form";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

function Page({ params: { branchSlug } }) {
  const toast = useToast();
  const router = useRouter();

  const methods = useForm();

  const dispatch = useDispatch();
  const { password, email } = useSelector((store) => store.account);

  const handleSubmit = async (data) => {
    try {
      const res = await axios.post(API_CONFIG.AUTH.LOGIN, data);
      if (res.status === 200) {
        dispatch(
          login({
            email: email,
            role: "admin",
            accessToken: res.data.data.access_token,
            refreshToken: res.data.refresh_token,
          })
        );

        const toastPromise = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 3000);

          toast({
            title: res.data.data.message,
            description: "Chào mừng bạn quay trở lại",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
        });

        const routePromise = new Promise((resolve) => {
          setTimeout(() => {
            router.push(`/admin/bang-dieu-khien/${branchSlug}`);
            resolve();
          }, 3000);
        });

        Promise.race([toastPromise, routePromise]);

        dispatch(setEmail(""));
        dispatch(setPassword(""));
      }
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        position: "top",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSetPassword = (e) => {
    dispatch(setPassword(e.target.value));
  };

  const handleSetEmail = (e) => {
    dispatch(setEmail(e.target.value));
  };

  return (
    <div className="relative w-full h-screen p-8">
      <Image
        priority
        src={authBg}
        fill
        alt="auth background"
        className="object-cover contrast-200 saturate-150 exposure-75"
      />
      {/* BUTTONS */}
      <div className="flex justify-end gap-5">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button isIconOnly className="bg-white shadow-md" radius="full">
              <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Thông tin đăng nhập</div>
              <ol className="mt-3">
                <li>1. Email</li>
                <li>2. Mật khẩu</li>
              </ol>
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip content="Trò chuyện với nhân viên kỹ thuật">
          <Button isIconOnly className="bg-white shadow-md" radius="full">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600" />
          </Button>
        </Tooltip>
      </div>

      <Form
        methods={methods}
        email={email}
        password={password}
        handleSetEmail={handleSetEmail}
        handleSetPassword={handleSetPassword}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Page;
