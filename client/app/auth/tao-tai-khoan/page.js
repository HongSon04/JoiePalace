"use client";

import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { FormProvider, useForm } from "react-hook-form";

import CustomInput from "@/app/_components/CustomInput";
import CustomSelect from "@/app/_components/CustomSelect";
import { roles } from "@/app/_utils/config";
import logo from "@/public/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setPassword,
  setRole,
  setUsername,
} from "@/app/_lib/features/authentication/accountSlice";
import {
  _require,
  emailValidation,
  passwordValidation,
  requireLength,
} from "@/app/_utils/validations";

function Page() {
  const methods = useForm();

  const dispatch = useDispatch();

  const { username, password, email, role } = useSelector(
    (store) => store.account
  );

  const handleSubmit = methods.handleSubmit((data) => {
    // LATER: Handle submit
    const submitData = {
      ...data,
      role,
    };

    console.log(submitData);
  });

  const handleSetUsername = (e) => {
    dispatch(setUsername(e.target.value));
  };

  const handleSetPassword = (e) => {
    dispatch(setPassword(e.target.value));
  };

  const handleSetEmail = (e) => {
    dispatch(setEmail(e.target.value));
  };

  const handleSetRole = (e) => {
    dispatch(setRole(e.target.value));
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
              <div className="text-small font-bold">Thông tin đăng ký</div>
              <div className="text-tiny mt-3">
                <ol>
                  <li>1. Email</li>
                  <li>2. Tên tài khoản</li>
                  <li>3. Mật khẩu</li>
                  <li>4. Quyền</li>
                </ol>
              </div>
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
            Tạo tài khoản
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
            value={username}
            onChange={handleSetUsername}
            placeholder="Tên tài khoản"
            name="username"
            label=""
            className={"mt-3"}
            classNames={{
              inputWrapper: "!bg-whiteAlpha-200 rounded-md text-white",
              wrapper: "mt-4",
              placeholder: "!text-white",
              input: "!text-white",
            }}
            ariaLabel="Tên tài khoản"
            validation={{
              ..._require,
              ...requireLength,
            }}
            errorMessage={"Tên tài khoản không được để trống"}
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
          <CustomSelect
            name="role"
            ariaLabel="Chọn quyền"
            selectedKeys={role}
            value={role || "admin"}
            onChange={handleSetRole}
            label=""
            options={roles}
            validation={_require}
            className={"mt-3"}
            errorMessage={"Chọn quyền cho tài khoản"}
            triggerClassName={"!bg-whiteAlpha-200 text-white rounded-md w-full"}
            valueClassName={"!text-white"}
            selectClassName="mt-3"
            isRequired={true}
          ></CustomSelect>
          <Button
            onClick={handleSubmit}
            className="mt-5 rounded-full w-full border-2 border-white border-solid bg-transparent text-white hover:bg-whiteAlpha-200"
            startContent={<UserPlusIcon width={24} height={24} color="white" />}
          >
            Tạo tài khoản
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;
