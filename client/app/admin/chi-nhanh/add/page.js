"use client";

import { useForm } from "react-hook-form";
import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import IconButton from "@/app/_components/IconButton";
import IconButtonSave from "@/app/_components/IconButtonSave";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { fetchFeedbacksFailure } from "@/app/_lib/features/feedbacks/feedbacksSlice";
import AdminThemChiNhanhInputAndImg from "./AdminThemChiNhanhInputAndImgForADD";
import { fetchBranchSuccess } from "@/app/_lib/features/branch/branchSlice";

const fieldsConfig = {
  contact: [
    { type: 'text', placeholder: 'Tên chi nhánh', name: 'name' },
    { type: 'text', placeholder: 'Địa chỉ', name: 'address' },
    { type: 'text', placeholder: 'Email', name: 'email' },
    { type: 'text', placeholder: 'Số điện thoại', name: 'phone' },
  ],
  slogan: [
    { type: 'textarea', placeholder: 'Slogan', name: 'slogan' },
    { type: 'textarea', placeholder: 'Mô tả slogan', name: 'slogan_description' },
  ],
  diagram: [{ type: 'textarea', placeholder: 'Mô tả sơ đồ', name: 'diagram_description' }],
  equipment: [{ type: 'textarea', placeholder: 'Mô tả trang thiết bị', name: 'equipment_description' }],
};

const branchSchema = z.object({
  name: z.string().min(1, { message: "Tên chi nhánh là bắt buộc" }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().regex(/^\d+$/, { message: "Số điện thoại phải là số" }).min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
  slogan: z.string().optional(),
  slogan_description: z.string().optional(),
  diagram_description: z.string().optional(),
  equipment_description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  slogan_images: z.array(z.instanceof(File)).optional(),
  diagram_images: z.array(z.instanceof(File)).optional(),
  equipment_images: z.array(z.instanceof(File)).optional(),
  stage: z.array(z.instanceof(File)).optional(),
});

function Page() {
  const { isError } = useSelector((store) => store.branch);
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const toast = useCustomToast();

  const { handleSubmit, control, setValue } = useForm({
    resolver: zodResolver(branchSchema),
  });

  const [imagesData, setImagesData] = useState({
    images: [],
    slogan_images: [],
    diagram_images: [],
    equipment_images: [],
  });

  const onImagesChange = (name, files) => {
    if (!name || !files) return;
    setImagesData((prev) => ({ ...prev, [name]: files }));
    setValue(name, files, { shouldValidate: true });
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.CREATE, "POST", formData);
      if (response.success) {
        dispatch(fetchBranchSuccess(response.data));
        showToast("success", "Tạo dữ liệu chi nhánh thành công", "Phản hồi đã được duyệt. Đang lấy dữ liệu mới");
      } else {
        handleError(response.message || "Vui lòng thử lại sau");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      handleError("Đã xảy ra lỗi");
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (!key.includes("images")) {
        formData.append(key, value);
      }
    });

    // Append image files
    Object.entries(imagesData).forEach(([key, files]) => {
      files.forEach((file) => formData.append(key, file));
    });

    await handleFormSubmit(formData);
  };

  const handleError = (message) => {
    dispatch(fetchFeedbacksFailure());
    showToast("error", "Tạo dữ liệu không thành công", message);
  };

  const showToast = (status, title, description) => {
    toast({ title, description, status });
  };

  const renderSection = (title, fields, heightTextarea = 'h-[120px]') => (
    <AdminThemChiNhanhInput
      fields={fields}
      title={title}
      control={control}
      heightTextarea={heightTextarea}
    />
  );

  const renderImageSection = (title, name, inputId) => (
    <AdminThemChiNhanhImg
      title={title}
      inputId={inputId}
      onImagesChange={onImagesChange}
      name={name}
      initialImages={imagesData[name]}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isError && <div className="text-red-500">An error occurred while saving the branch.</div>}
      <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
      <div className="flex gap-2 mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">Chi nhánh / </h1>
        <span className="text-base leading-6 font-normal text-gray-400">Thêm chi nhánh</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-6">
        <div className="flex gap-5">
          {renderSection('Thông tin liên hệ', fieldsConfig.contact)}
          {renderImageSection('Hình ảnh carousel', 'images', 'image-upload-carousel')}
        </div>
        <div className="flex gap-5">
          {renderSection('Slogan & Mô tả', fieldsConfig.slogan)}
          {renderImageSection('Hình ảnh mô tả', 'slogan_images', 'image-upload-description')}
        </div>
        <div className="flex gap-5">
          {renderSection('Sơ đồ', fieldsConfig.diagram)}
          {renderImageSection('Hình ảnh sơ đồ', 'diagram_images', 'image-upload-diagram')}
        </div>
        <div className="flex gap-5">
          {renderSection('Trang thiết bị', fieldsConfig.equipment)}
          {renderImageSection('Hình ảnh trang thiết bị', 'equipment_images', 'image-upload-equipment')}
        </div>
        <AdminThemChiNhanhInputAndImg title="Sảnh" height="290px" inputId="input-image-upload-map" input={false} />
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

export default Page;
