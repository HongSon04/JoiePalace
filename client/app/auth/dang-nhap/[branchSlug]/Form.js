"use client";

import Error from "@/app/_components/Error";
import FormInput from "@/app/_components/FormInput";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  login,
  loginFailed,
  logingIn,
  loginSuccess,
} from "@/app/_lib/features/authentication/accountSlice";
import {
  error,
  fetchBranchSuccess,
  getCurrentBranch,
  loading,
} from "@/app/_lib/features/branch/branchSlice";
import { fetchCurrentBranch } from "@/app/_services/branchesServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import { decodeJwt } from "@/app/_utils/helpers";
import logo from "@/public/logo.png";
import { useToast } from "@chakra-ui/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Loading from "../../loading";
import Toast from "@/app/_components/Toast";
import useCustomToast from "@/app/_hooks/useCustomToast";

const schema = z.object({
  password: z
    .string({
      required_error: "Mật khẩu không hợp lệ",
    })
    .min(1, { message: "Vui lòng nhập mật khẩu" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .max(35, { message: "Mật khẩu không được vượt quá 35 ký tự" }),
  email: z
    .string({
      required_error: "Vui lòng nhập email",
    })
    .min(1, { message: "Vui lòng nhập email" })
    .email({
      message: "Email không hợp lệ",
    }),
});

function Form({}) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const { fetchData, tryCatchWrapper } = useApiServices();

  const handleSetPasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const toast = useCustomToast();
  const { branchSlug } = useParams();
  const router = useRouter();

  const dispatch = useDispatch();
  const { isLoading: isSigningIn } = useSelector((store) => store.account);
  const { currentBranch, isLoading, isError } = useSelector(
    (store) => store.branch
  );

  const handleLogin = async (data) => {
    // API CALL
    const loginApiCall = async () => {
      dispatch(logingIn());

      const res = await axios.post(API_CONFIG.AUTH.LOGIN, data);
      if (res.status !== 200) {
        throw new Error(res?.data?.message || "Đăng nhập thất bại");
      }

      // Set tokens
      Cookies.set("accessToken", res.data.data.access_token, { expires: 1 }); // expires in 1 day
      localStorage.setItem("refreshToken", res.data.data.refresh_token);

      return res.data;
    };

    // GET THE RESULT FROM THE API CALL
    const result = await tryCatchWrapper(loginApiCall, {
      errorMessage: "Đăng nhập thất bại",
    });

    // TOAST TO USER
    if (result.success === false) {
      dispatch(loginFailed());

      toast({
        position: "top",
        type: "error",
        title: result.message,
        description: "Vui lòng kiểm tra lại thông tin đăng nhập",
        closable: true,
      });
    } else {
      dispatch(loginSuccess());
      const user = decodeJwt(result.data.access_token);
      localStorage.setItem("user", JSON.stringify(user));
      // console.log(user);

      // LATER:
      // CHECK IF USER IS ADMIN
      if (user.role !== "admin") {
        toast({
          title: "Đăng nhập thất bại",
          position: "top",
          description: "Bạn không có quyền truy cập",
          type: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      // LATER:
      // CHECK IF USER IS ACTIVE
      if (!user?.active) {
        toast({
          title: "Đăng nhập thất bại",
          position: "top",
          description: "Tài khoản của bạn đã bị khóa",
          type: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      if (!currentBranch) return;
      // console.log(currentBranch);

      // CHECK IF USER BELONGS TO THE BRANCH
      if (user?.branch_id !== currentBranch?.id) {
        toast({
          title: "Đăng nhập thất bại",
          position: "top",
          description: "Tài khoản của bạn không thuộc chi nhánh này",
          type: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      dispatch(login({ user }));

      // WELLCOME BACK TO USER
      toast({
        position: "top",
        type: "success",
        title: result.message,
        description: `Chào mừng bạn quay trở lại. Chúng tôi đang chuyển bạn đến trang quản trị`,
        closable: true,
      });

      window.location.href = `/admin/bang-dieu-khien/${currentBranch.slug}`;
    }
  };

  const onSubmit = async (data) => {
    await handleLogin(data);
  };

  const getBranchBySlug = React.useCallback(
    (branchSlug) => {
      fetchData(dispatch, () => fetchCurrentBranch(branchSlug), {
        loadingAction: loading,
        successAction: fetchBranchSuccess,
        errorAction: error,
      });
    },
    [dispatch]
  );

  React.useEffect(() => {
    getBranchBySlug(branchSlug);
  }, [getBranchBySlug, branchSlug]);

  React.useEffect(() => {
    const storedBranch = JSON.parse(localStorage.getItem("currentBranch"));
    if (storedBranch) {
      dispatch(getCurrentBranch(storedBranch));
    }
  }, [getBranchBySlug]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && isError && (
        <Error
          error={"Lỗi khi lấy dữ liệu chi nhánh hoặc chi nhánh không tồn tại"}
          withOverlay={true}
        >
          <Button className="text-base font-semibold bg-whiteAlpha-100 text-white underline rounded-full mt-5 p-2 px-5">
            Chọn lại chi nhánh
          </Button>
        </Error>
      )}
      {!isLoading && !isError && currentBranch && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          action={() => onSubmit({ email, password })}
          className="p-[60px] w-[400px] absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-blackAlpha-600 backdrop-blur-lg shadow-md flex flex-center flex-col"
        >
          <Image src={logo} width={60} height={60} alt="Joie Palace logo" />
          <h1 className="text-2xl leading-8 font-semibold text-white text-center mt-5">
            Đăng nhập
          </h1>
          <FormInput
            id={"email"}
            name={"email"}
            label={"email"}
            ariaLabel={"Email"}
            type={"email"}
            register={register}
            errors={errors}
            errorMessage={errors?.email?.message}
            value={watch("email")}
            onChange={onInputChange}
          ></FormInput>
          <FormInput
            id={"password"}
            name={"password"}
            label={"password"}
            ariaLabel={"Mật khẩu"}
            type={"password"}
            register={register}
            errors={errors}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={handleSetPasswordVisible}
            errorMessage={errors?.password?.message}
            value={watch("password")}
            onChange={onInputChange}
          ></FormInput>
          <Button
            type="submit"
            className="mt-5 rounded-full w-full border-2 border-white border-solid bg-transparent text-white hover:bg-whiteAlpha-200"
            startContent={
              !isSigningIn ? (
                <ArrowRightStartOnRectangleIcon
                  width={24}
                  height={24}
                  color="white"
                />
              ) : null
            }
            isLoading={isSigningIn}
          >
            {isSigningIn ? "Đang đăng nhập" : "Đăng nhập"}
          </Button>
        </form>
      )}
    </>
  );
}

export default Form;
