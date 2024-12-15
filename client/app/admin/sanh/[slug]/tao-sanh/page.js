"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import IconButtonSave from "@/app/_components/IconButtonSave";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { API_CONFIG } from "@/app/_utils/api.config";
import { PlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminInputStage from "./AdminInputStage";
import AdminInputStageImg from "./AdminInputStageImg";

const stageSchema = z.object({
  name: z
    .string({
      message: "Vui lòng nhập tên sảnh",
    })
    .min(1, { message: "Vui lòng nhập tên sảnh" }),
  description: z
    .string({
      message: "Vui lòng nhập mô tả",
    })
    .min(1, { message: "Vui lòng nhập mô tả" }),
  capacity_min: z.coerce.number({
    message: "Vui lòng nhập sức chứa tối thiểu",
  }),
  capacity_max: z.coerce.number({
    message: "Vui lòng nhập sức chứa tối đa",
  }),
  price: z.coerce
    .number({
      message: "Vui lòng nhập sức chứa tối đa",
    })
    .min(1, { message: "Sức chứa tối thiểu phải lớn hơn 0" }),
});

const Page = ({ params }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const slug = pathSegments[pathSegments.length - 2];
  const { makeAuthorizedRequest } = useApiServices();
  const [newImages, setNewImages] = useState([]);
  const toast = useCustomToast();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(stageSchema),
  });

  const {
    data: branch,
    isLoading: isFetchingBranch,
    isError: isFetchingBranchError,
  } = useQuery({
    queryKey: ["branch", slug],
    queryFn: async () => {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BRANCHES.GET_BY_SLUG(slug)
      );

      if (response.success) {
        return response?.data;
      } else {
        toast({
          title: "Lỗi",
          description: response?.error?.message || "Không tìm thấy chi nhánh",
          type: "error",
        });
      }
    },
    enabled: !!slug,
  });

  const {
    mutate,
    isPending: isCreatingStage,
    isError: isCreatingStageError,
  } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      formData.append("branch_id", branch.at(0).id);

      // Append other form data
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append new images
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.CREATE,
        "POST",
        formData
      );

      if (!response.success) {
        throw new Error(response.error.message);
      }

      return response;
    },
    onSuccess: (response) => {
      toast({
        title: "Tạo sảnh mới thành công",
        description: response?.message || "Sảnh mới đã được tạo",
        type: "success",
      });
      reset();
    },
    onError: (error) => {
      console.error("Error while submitting form: ", error);
      const { statusCode, message } = error?.response?.error || {};
      if (statusCode === 401) {
        toast({
          title: "Phiên đăng nhập đã hết hạn",
          description: "Vui lòng đăng nhập lại để thực hiện tác vụ",
          type: "error",
        });
      } else {
        toast({
          title: "Tạo sảnh thất bại",
          description: message || "Vui lòng thử lại sau",
          type: "error",
        });
      }
    },
  });

  const onSubmit = (data) => {
    console.log("errors -> ", errors);
    console.log("data", data);
    mutate(data);
  };

  return (
    <div>
      <AdminHeader showSearchForm={false} title={"Tạo sảnh"} />
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
            ]}
            errors={errors}
          />
          <AdminInputStageImg
            title="Hình ảnh"
            inputId="input-image-upload-carousel"
            name="images"
            onImageChange={setNewImages}
          />
        </div>
        <div className="flex w-full mt-6">
          <div className="ml-auto flex space-x-4">
            <IconButtonSave
              title="Hủy"
              color="bg-red-400"
              type="button"
              onClick={reset}
            ></IconButtonSave>
            <IconButtonSave
              title="Tạo sảnh"
              color="bg-teal-400"
              type="submit"
              isLoading={isCreatingStage}
              isDisabled={isCreatingStage}
              loadingText={"Đang tạo sảnh..."}
            >
              <PlusIcon className="w-5 h-5" />
            </IconButtonSave>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
