"use client";

import { useForm } from "react-hook-form";
import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import IconButton from "@/app/_components/IconButton";
import IconButtonSave from "@/app/_components/IconButtonSave";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Stack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import { useParams } from "next/navigation";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import AdminThemChiNhanhInputAndImg from "@/app/_components/AdminThemChiNhanhInputAndImg";

const defaultValues = {
  name: "",
  address: "",
  email: "",
  phone: "",
  slogan: "",
  slogan_description: "",
  diagram_description: "",
  equipment_description: "",
};

const branchSchema = z.object({
  name: z.string().min(1, { message: "Tên chi nhánh là bắt buộc" }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Số điện thoại phải là số" })
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
  slogan: z.string().optional(),
  slogan_description: z.string().optional(),
  diagram_description: z.string().optional(),
  equipment_description: z.string().optional(),
});

function ChiNhanhAddPage() {
  const { slug } = useParams();
  const { makeAuthorizedRequest } = useApiServices();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues,
  });

  const [branchDetail, setBranchDetail] = useState("");
  const [imagesData, setImagesData] = useState({
    images: [],
    slogan_images: [],
    diagram_images: [],
    equipment_images: [],
    stages: []
  });

  const fetchBranchData = useCallback(async () => {
    try {
      const response = await fetchBranchBySlug(slug);
      const branchData = response[0];
      reset(branchData);
      setBranchDetail(branchData)
      setImagesData({
        images: Array.isArray(branchData.images)
        ? branchData.images
        : branchData.images?.split(",") || [],
      slogan_images: Array.isArray(branchData.slogan_images)
        ? branchData.slogan_images
        : branchData.slogan_images?.split(",") || [],
      diagram_images: Array.isArray(branchData.diagram_images)
        ? branchData.diagram_images
        : branchData.diagram_images?.split(",") || [],
      equipment_images: Array.isArray(branchData.equipment_images)
        ? branchData.equipment_images
        : branchData.equipment_images?.split(",") || [],
      stages: Array.isArray(branchData.stages)
        ? branchData.stages
        : branchData.stages?.split(",") || [],
      });
    } catch (error) {
      console.error("Error fetching branch data: ", error);
    }
  }, [reset, slug]);

  useEffect(() => {
    fetchBranchData();
  }, [fetchBranchData]);

  const onImagesChange = (name, images) => {
    setImagesData((prevData) => ({
      ...prevData,
      [name]: images,
    }));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    Object.keys(imagesData).forEach((key) => {
      imagesData[key].forEach((image) => {
        formData.append(key, image);
      });
    });

    try {
      const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.UPDATE(branchDetail.id), "PATCH", formData);
      if (response.success) {
        console.log("Branch updated successfully:", response.data);
      } else {
        console.error("Error updating branch:", response.message);
      }
    } catch (error) {
      console.error("Error while submitting form: ", error);
    }
  };
  const handleDelete = (section, index) => {
    setImagesData((prevImagesData) => {
      if (!prevImagesData[section]) {
        return prevImagesData;
      }
      const updatedSectionData = prevImagesData[section].filter((_, i) => i !== index);
      return {
        ...prevImagesData,
        [section]: updatedSectionData,
      };
    });
  };
  console.log(imagesData)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
      <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">
          Chi nhánh / {branchDetail.name}
        </h1>
      </Stack>
      <div className="flex flex-col gap-6 w-full mt-6">
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Thông tin liên hệ"
            control={control}
            fields={[
              { type: "text", placeholder: "Tên chi nhánh", name: "name" },
              { type: "text", placeholder: "Địa chỉ", name: "address" },
              { type: "text", placeholder: "Email", name: "email" },
              { type: "text", placeholder: "Số điện thoại", name: "phone" },
            ]}
            errors={errors}
          />
          <AdminThemChiNhanhImg
            title="Hình ảnh carousel"
            inputId="input-image-upload-carousel"
            onImagesChange={onImagesChange}
            name="images"
            initialImages={imagesData.images}
          />
        </div>

        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Slogan & Mô tả"
            control={control}
            fields={[
              { type: "textarea", placeholder: "Slogan", name: "slogan" },
              { type: "textarea", placeholder: "Mô tả slogan", name: "slogan_description" },
            ]}
            heightTextarea={"h-[80px]"}
            errors={errors}
          />
          <AdminThemChiNhanhImg
            title="Hình ảnh mô tả"
            inputId="input-image-upload-description"
            onImagesChange={onImagesChange}
            name="slogan_images"
            initialImages={imagesData.slogan_images}
          />
        </div>

        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Sơ đồ"
            control={control}
            fields={[
              { type: "textarea", placeholder: "Mô tả sơ đồ", name: "diagram_description" },
            ]}
            heightTextarea={"h-[160px]"}
            errors={errors}
          />
          <AdminThemChiNhanhImg
            title="Hình ảnh sơ đồ"
            inputId="input-image-upload-diagram"
            onImagesChange={onImagesChange}
            name="diagram_images"
            initialImages={imagesData.diagram_images}
          />
        </div>

        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Trang thiết bị"
            control={control}
            fields={[
              { type: "textarea", placeholder: "Mô tả trang thiết bị", name: "equipment_description" },
            ]}
            heightTextarea={"h-[160px]"}
            errors={errors}
          />
          <AdminThemChiNhanhImg
            title="Hình ảnh trang thiết bị"
            inputId="input-image-upload-equipment"
            onImagesChange={onImagesChange}
            name="equipment_images"
            initialImages={imagesData.equipment_images}
          />
        </div>
        <AdminThemChiNhanhInputAndImg name='stages' title="Sảnh" height="290px"     inputId="input-image-upload-map" input={false} branchData={imagesData.stages} 
        onDelete={handleDelete}
        />
      </div>

      <div className="flex w-full mt-6">
        <IconButton className="bg-whiteAlpha-200 text-white" type="button">
          <ArrowLeftIcon width={20} height={20} color="white" />
        </IconButton>
        <div className="ml-auto flex space-x-4">
          <IconButtonSave title="Hủy" color="bg-red-400" type="button" />
          <IconButtonSave title="Lưu" color="bg-teal-400" type="submit" />
        </div>
      </div>
    </form>
  );
}

export default ChiNhanhAddPage;
