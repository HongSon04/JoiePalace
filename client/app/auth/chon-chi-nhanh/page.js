"use client";

import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import Branch from "@/app/_components/Branch";
import Error from "@/app/_components/Error";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  error,
  fetchBranchesSuccess,
  loading,
} from "@/app/_lib/features/branch/branchSlice";
import { fetchBranchesFromApi } from "@/app/_services/branchesServices";
import Loading from "@/app/admin/loading";
import { Col, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// const initialBranches = [
//   {
//     id: 1,
//     name: "Hoàng Văn Thụ",
//     image: banner,
//     address: "123 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP.HCM",
//     phone: "0123456789",
//     email: "joiepalace.hoangvanthu@gmail.com",
//     status: "active",
//     slug: "hoang-van-thu",
//   },
//   {
//     id: 2,
//     image: banner2,
//     name: "Lê Văn Sỹ",
//     address: "123 Lê Vă Sỹ, Phường 4, Quận Tân Bình, TP.HCM",
//     phone: "0123456789",
//     email: "joiepalace.levansy@gmail.com",
//     status: "active",
//     slug: "le-van-sy",
//   },
//   {
//     id: 3,
//     image: banner2,
//     name: "Phạm Văn Đồng",
//     address: "123 Phạm Văn Đồng, Phường 4, Quận Tân Bình, TP.HCM",
//     phone: "0123456789",
//     email: "joiepalace.phamvandong@gmail.com",
//     status: "active",
//     slug: "pham-van-dong",
//   },
//   {
//     id: 4,
//     image: logo,
//     name: "Tổng",
//     address: "123 Phạm Văn Đồng, Phường 4, Quận Tân Bình, TP.HCM",
//     phone: "0123456789",
//     email: "joiepalace.tong@gmail.com",
//     status: "active",
//     slug: "tong",
//   },
// ];

function Page() {
  const { fetchData } = useApiServices();

  const dispatch = useDispatch();

  const { branches, isLoading, isError, errorMessage } = useSelector(
    (store) => store.branch
  );

  const getBranches = React.useCallback(() => {
    fetchData(dispatch, fetchBranchesFromApi, {
      loadingAction: loading,
      successAction: fetchBranchesSuccess,
      errorAction: error,
    });
  }, [dispatch]);

  React.useEffect(() => {
    getBranches();
  }, [getBranches]);

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

      {/* BRANCHES */}
      <div className="abs-center">
        <div className="flex flex-col p-5 rounded-md bg-blackAlpha-500 backdrop-blur-sm w-[1000px] h-[600px] overflow-y-auto">
          <h2 className="text-3xl leading-9 font-medium text-center text-white">
            Chọn chi nhánh
          </h2>
          {isLoading && <Loading />}
          {isError && <Error withOverlay={true} error={errorMessage} />}
          {!isLoading && !isError && (
            <Row className="mt-8" gutter={[20, 20]}>
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <Col key={branch.id} span={8}>
                    <Branch
                      branch={branch}
                      to={`/auth/dang-nhap/${branch.slug}`}
                    />
                  </Col>
                ))
              ) : (
                <Col span={24} className="flex flex-center">
                  <p className="text-center text-white">
                    No branches available
                  </p>
                </Col>
              )}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
