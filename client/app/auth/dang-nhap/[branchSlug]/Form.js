"use client";

import CustomInput from "@/app/_components/CustomInput";
import Error from "@/app/_components/Error";
import {
  login,
  setEmail,
  setPassword,
} from "@/app/_lib/features/authentication/accountSlice";
import {
  error,
  fetchBranchSuccess,
  loading,
} from "@/app/_lib/features/branch/branchSlice";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import { fetchData } from "@/app/_utils/helpers";
import logo from "@/public/logo.png";
import { useToast } from "@chakra-ui/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../loading";

function Form({}) {
  const methods = useForm();

  const toast = useToast();
  const { branchSlug } = useParams();
  const router = useRouter();

  const dispatch = useDispatch();
  const {
    password,
    email,
    isLoading: isSigning,
    isError: isSigningError,
  } = useSelector((store) => store.account);
  const { currentBranch, isLoading, isError } = useSelector(
    (store) => store.branch
  );

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(API_CONFIG.AUTH.LOGIN, data);
      console.log(res);
      dispatch(
        login({
          email: data.email, // Use data.email instead of email from state
          role: "admin",
          accessToken: res.data.data.access_token,
          refreshToken: res.data.data.refresh_token,
        })
      );

      const toastPromise = new Promise((resolve) => {
        toast({
          title: res?.data?.message,
          description: "Chào mừng bạn quay trở lại",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          resolve();
        }, 3000);
      });

      const routePromise = new Promise((resolve) => {
        setTimeout(() => {
          router.push(`/admin/bang-dieu-khien/${branchSlug}`);
          resolve();
        }, 3000);
      });

      await Promise.race([toastPromise, routePromise]);
      // if (res.status == 200) {
      // }
    } catch (error) {
      const errorMessage = Array.isArray(error?.response?.data?.message)
        ? error?.response?.data?.message.join(", ")
        : error?.response?.data?.message || error.message;

      toast({
        title: "Đăng nhập thất bại",
        position: "top",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSetPassword = (e) => {
    dispatch(setPassword(e.target.value));
    console.log("handleSetPassword -> e", password);
  };

  const handleSetEmail = (e) => {
    dispatch(setEmail(e.target.value));
    console.log("handleSetEmail -> e", email);
  };

  const getBranchBySlug = React.useCallback(
    (branchSlug) => {
      fetchData(dispatch, () => fetchBranchBySlug(branchSlug), {
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
        <FormProvider {...methods}>
          <form
            action={() => onSubmit({ email, password })}
            className="p-[60px] w-[400px] absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-blackAlpha-600 backdrop-blur-lg shadow-md flex flex-center flex-col"
          >
            <Image src={logo} width={60} height={60} alt="Joie Palace logo" />
            <h1 className="text-2xl leading-8 font-semibold text-white text-center mt-5">
              Đăng nhập
            </h1>
            <CustomInput
              value={email}
              onChange={(e) => handleSetEmail(e)}
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
            ></CustomInput>
            <CustomInput
              value={password}
              onChange={(e) => handleSetPassword(e)}
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
            ></CustomInput>
            <Button
              type="submit"
              className="mt-5 rounded-full w-full border-2 border-white border-solid bg-transparent text-white hover:bg-whiteAlpha-200"
              startContent={
                <ArrowRightStartOnRectangleIcon
                  width={24}
                  height={24}
                  color="white"
                />
              }
              isLoading={isSigning}
            >
              Đăng nhập
            </Button>
          </form>
        </FormProvider>
      )}
    </>
  );
}

export default Form;
