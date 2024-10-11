import React from "react";
import CustomInput from "@/app/_components/CustomInput";
import {
  _require,
  emailValidation,
  passwordValidation,
} from "@/app/_utils/validations";
import logo from "@/public/logo.png";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { FormProvider } from "react-hook-form";

function Form({
  methods,
  email,
  password,
  handleSetEmail,
  handleSetPassword,
  onSubmit,
}) {
  const inputRef = React.useRef(null);

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
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
          ref={inputRef}
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
  );
}

export default Form;
