"use client";

import authBg from "@/public/auth-bg.png";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
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

function Page() {
  const { fetchData } = useApiServices();
  const dispatch = useDispatch();
  const { branches, isLoading, isError, errorMessage } = useSelector(
    (store) => store.branch
  );
  const abortControllerRef = React.useRef(new AbortController());

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const isMounted = React.useRef(false);

  const getBranches = React.useCallback((params) => {
    fetchData(
      dispatch,
      () => fetchBranchesFromApi(params, abortControllerRef.current.signal),
      {
        loadingAction: loading,
        successAction: fetchBranchesSuccess,
        errorAction: error,
      }
    );
  }, []);

  React.useEffect(() => {
    isMounted.current = true;

    const params = {
      search: searchQuery,
    };

    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    getBranches(params);

    return () => {
      isMounted.current = false;
      abortControllerRef.current.abort();
    };
  }, [getBranches, searchQuery]);

  return (
    <div className="w-full h-screen p-8">
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
        <div className="flex flex-col p-5 rounded-md bg-blackAlpha-500 backdrop-blur-sm w-[1000px] h-[600px] ">
          <h2 className="text-3xl leading-9 font-medium text-center text-white pb-5">
            Chọn chi nhánh
          </h2>
          {/* Search form */}
          <div className="flex justify-between pb-5 text-white relative">
            <div className="flex gap-3 items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <input
                type="text"
                placeholder="Tìm kiếm chi nhánh"
                className="input w-[70%] outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setIsSearching(true);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
            <Button
              onClick={getBranches}
              className="bg-white text-black"
              radius="full"
            >
              Làm mới
            </Button>
          </div>
          <div className="overflow-y-auto relative flex-1 rounded-lg">
            {isLoading && <Loading type="absolute" />}
            {isError && !isSearching && (
              <Error withOverlay={true} error={errorMessage} />
            )}
            {!isLoading && !isError && (
              <Row className="" gutter={[20, 20]}>
                {branches && branches.length > 0 ? (
                  branches.map((branch) => (
                    <Col key={branch.id} span={8}>
                      <Branch
                        branch={branch}
                        to={`/auth/dang-nhap/${branch.slug}`}
                        buttonText="Chọn"
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
    </div>
  );
}

export default Page;
