"use client";
import AdminHeader from "@/app/_components/AdminHeader";
import { IconButton, Stack } from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminInputStage from "./AdminInputStage";
import AdminInputStageImg from "./AdminInputStageImg";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import IconButtonSave from "@/app/_components/IconButtonSave";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { useDispatch } from "react-redux";
import { updatingStageSuccess } from "@/app/_lib/features/stages/stagesSlice";
import { usePathname, useRouter } from "next/navigation";

const defaultValues = {
  name: "",
  description: "",
  capacity_min: 0,
  capacity_max: 250,
  price: 0,
  images: [],
  branch_id: "",
};

const stageSchema = z.object({
  name: z.string().min(1, { message: "Tên sảnh là bắt buộc" }),
  description: z.string().optional(),
  capacity_min: z
    .number()
    .min(0, { message: "Sức chứa tối thiểu không hợp lệ" }),
  capacity_max: z.union([
    z.string().min(1, { message: "Sức chứa tối đa không hợp lệ" }),
    z.number().min(1, { message: "Sức chứa tối đa không hợp lệ" }),
  ]),
  price: z.union([
    z.string().min(1, { message: "Giá không hợp lệ" }),
    z.number().min(0, { message: "Giá không hợp lệ" }),
  ]),
  images: z.array(z.string().url()).optional(),
});

const Page = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const pathname = usePathname();
  const redirectUrl = pathname.replace(`/${id}`, "");
  const { makeAuthorizedRequest } = useApiServices();
  const [stageDetail, setStageDetail] = useState(null);
  const [branchIDStages, setBranchIDStages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stageSchema),
    defaultValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingStage, setIsDeletingStage] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchStageData = useCallback(async () => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.GET_BY_ID(id)
      );
      if (response && response.data && response.data.length > 0) {
        const stageData = response.data[0];
        reset(stageData);
        setStageDetail(stageData);
      } else {
        throw new Error("No stage data found");
      }
    } catch (error) {
      console.error("Error fetching stage data: ", error);
    }
  }, [reset, id]);

  const fetchBranchIDStages = useCallback(async () => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BRANCHES.GET_ALL()
      );
      if (response && response.data) {
        setBranchIDStages(response.data);
      } else {
        throw new Error("No branch ID stages data found");
      }
    } catch (error) {
      console.error("Error fetching branch ID stages data: ", error);
    }
  }, []);

  useEffect(() => {
    fetchStageData();
    fetchBranchIDStages();
  }, [fetchStageData, fetchBranchIDStages]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const formData = new FormData();

    // Append existing images
    if (stageDetail?.images) {
      stageDetail.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    console.log("newImages -> ", newImages);

    // Append new images
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("branch_id", stageDetail.branch_id);

    // Append other form data
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // console.log("formData -> ", formData);
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.UPDATE(stageDetail.id),
        "PATCH",
        formData
      );
      if (response.success) {
        dispatch(updatingStageSuccess(response.data));
        toast({
          title: "Cập nhật thành công",
          description: response?.message || "Đã chỉnh sửa lại dữ liệu mới.",
          type: "success",
        });
      } else {
        const { statusCode, message } = response.error || {};
        if (statusCode == 401) {
          toast({
            title: "Phiên đăng nhập đã hết hạn",
            description: "Vui lòng đăng nhập lại để thực hiện tác vụ",
            type: "error",
          });
        } else {
          toast({
            title: "Cập nhật thất bại",
            description: message || "Yêu cầu chưa được cập nhật trạng thái",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error while submitting form: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStage = async (stageId) => {
    setIsDeletingStage(true);

    if (typeof window === "undefined") return;

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa sảnh này không?");

    if (!confirm) return;

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.DESTROY(stageId),
        "DELETE"
      );
      if (response.success) {
        toast({
          title: "Xóa sảnh thành công",
          description: response?.message || "Sảnh đã được xóa khỏi hệ thống",
          type: "success",
        });

        router.push(redirectUrl);
      } else {
        const { statusCode, message } = response.error || {};
        if (statusCode == 401) {
          toast({
            title: "Phiên đăng nhập đã hết hạn",
            description: "Vui lòng đăng nhập lại để thực hiện tác vụ",
            type: "error",
          });
        } else {
          toast({
            title: "Xóa sảnh thất bại",
            description: message || "Yêu cầu xóa sảnh không thành công",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error while deleting stage: ", error);
    } finally {
      setIsDeletingStage(false);
    }
  };

  return (
    <div>
      <AdminHeader
        showSearchForm={false}
        title={`Chi tiết Sảnh - ${stageDetail?.name || "Loading..."}`}
      />
      <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">
          Thông tin Sảnh / {stageDetail ? stageDetail.name : "Loading..."}
        </h1>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 flex gap-5">
          <AdminInputStage
            title="Thông tin sảnh"
            control={control}
            heightTextarea={"h-[120px]"}
            fields={[
              { type: "text", placeholder: "Tên sảnh", name: "name" },
              { type: "textarea", placeholder: "Mô tả", name: "description" },
              {
                type: "number",
                placeholder: "Sức chứa tối thiểu",
                name: "capacity_min",
              },
              {
                type: "number",
                placeholder: "Sức chứa tối đa",
                name: "capacity_max",
              },
              { type: "number", placeholder: "Giá", name: "price" },
              {
                type: "options",
                placeholder: "Chi nhánh",
                name: "branch_id",
                options: branchIDStages.map((branch) => ({
                  value: branch.id,
                  label: branch.name,
                })),
                defaultValue: stageDetail?.branch_id || "",
              },
            ]}
            errors={errors}
          />
          <AdminInputStageImg
            title="Hình ảnh"
            inputId="input-image-upload-carousel"
            name="images"
            initialImages={
              Array.isArray(stageDetail?.images) ? stageDetail.images : []
            }
            onImageChange={setNewImages}
          />
        </div>
        <div className="flex w-full mt-6">
          <div className="ml-auto flex space-x-4">
            <IconButtonSave
              title="Xóa sảnh"
              color="bg-red-400"
              type="button"
              onClick={() => deleteStage(stageDetail.id)}
              isLoading={isDeletingStage}
              loadingText="Đang xóa..."
            >
              <TrashIcon className="w-5 h-5" />
            </IconButtonSave>
            <IconButtonSave
              title="Lưu"
              color="bg-teal-400"
              type="submit"
              isLoading={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.33337 2.66671C3.15656 2.66671 2.98699 2.73695 2.86197 2.86197C2.73695 2.98699 2.66671 3.15656 2.66671 3.33337V12.6667C2.66671 12.8435 2.73695 13.0131 2.86197 13.1381C2.98699 13.2631 3.15656 13.3334 3.33337 13.3334H12.6667C12.8435 13.3334 13.0131 13.2631 13.1381 13.1381C13.2631 13.0131 13.3334 12.8435 13.3334 12.6667V5.60952L10.3906 2.66671H3.33337ZM1.91916 1.91916C2.29423 1.54409 2.80294 1.33337 3.33337 1.33337H10.6667C10.8435 1.33337 11.0131 1.40361 11.1381 1.52864L14.4714 4.86197C14.5965 4.98699 14.6667 5.15656 14.6667 5.33337V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667H3.33337C2.80294 14.6667 2.29423 14.456 1.91916 14.0809C1.54409 13.7058 1.33337 13.1971 1.33337 12.6667V3.33337C1.33337 2.80294 1.54409 2.29423 1.91916 1.91916Z"
                  fill="#F7F5F2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 8.66667C4 8.29848 4.29848 8 4.66667 8H11.3333C11.7015 8 12 8.29848 12 8.66667V14C12 14.3682 11.7015 14.6667 11.3333 14.6667C10.9651 14.6667 10.6667 14.3682 10.6667 14V9.33333H5.33333V14C5.33333 14.3682 5.03486 14.6667 4.66667 14.6667C4.29848 14.6667 4 14.3682 4 14V8.66667Z"
                  fill="#F7F5F2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.66667 1.33337C5.03486 1.33337 5.33333 1.63185 5.33333 2.00004V4.66671H10C10.3682 4.66671 10.6667 4.96518 10.6667 5.33337C10.6667 5.70156 10.3682 6.00004 10 6.00004H4.66667C4.29848 6.00004 4 5.70156 4 5.33337V2.00004C4 1.63185 4.29848 1.33337 4.66667 1.33337Z"
                  fill="#F7F5F2"
                />
              </svg>
            </IconButtonSave>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
