"use client";

import authBg from "@/public/auth-bg.png";
import {
  ArrowRightStartOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { FormProvider, useForm } from "react-hook-form";

import CustomInput from "@/app/_components/CustomInput";
import {
  setEmail,
  setPassword,
} from "@/app/_lib/features/authentication/accountSlice";
import {
  _require,
  emailValidation,
  passwordValidation,
} from "@/app/_utils/validations";
import logo from "@/public/logo.png";
import { useDispatch, useSelector } from "react-redux";

function Page() {
  const methods = useForm();

  const dispatch = useDispatch();

  const { password, email } = useSelector((store) => store.account);

  const handleSubmit = methods.handleSubmit((data) => {
    // LATER: Handle submit
    const submitData = {
      ...data,
    };

    console.log(submitData);
  });

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

      {/* FORM */}
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          action="#"
          className="p-[60px] w-[400px] absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-blackAlpha-600 backdrop-blur-lg shadow-md flex flex-center flex-col "
        >
          <Image src={logo} width={60} height={60} alt="Joie Palace logo" />
          <h1 className="text-2xl leading-8 font-semibold text-white text-center mt-5">
            Đăng nhập
          </h1>
          <CustomInput
            value={email}
            onChange={handleSetEmail}
            placeholder="Email"
            name="email"
            label=""
            className={"mt-8"}
            classNames={{
              inputWrapper: "!bg-whiteAlpha-200 rounded-md text-white",
              wrapper: "mt-4",
              placeholder: "!text-white",
              input: "!text-white",
            }}
            ariaLabel="Email"
            validation={{
              ..._require,
              ...emailValidation,
            }}
          ></CustomInput>
          <CustomInput
            value={password}
            onChange={handleSetPassword}
            placeholder="Mật khẩu"
            name="password"
            label=""
            className={"mt-3"}
            classNames={{
              inputWrapper: "!bg-whiteAlpha-200 rounded-md !text-white",
              value: "!text-white",
              wrapper: "mt-4",
              placeholder: "!text-white",
              input: "!text-white",
            }}
            ariaLabel="Mật khẩu"
            validation={{
              ..._require,
              ...passwordValidation,
            }}
            errorMessage={"Mật khẩu không được để trống"}
          ></CustomInput>
          <Button
            onClick={handleSubmit}
            className="mt-5 rounded-full w-full border-2 border-white border-solid bg-transparent text-white hover:bg-whiteAlpha-200"
            startContent={
              <ArrowRightStartOnRectangleIcon
                width={24}
                height={24}
                color="white"
              />
            }
          >
            Đăng nhập
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;
