"use client";

import { useForm } from "react-hook-form";
import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import AdminThemChiNhanhInputAndImg from "@/app/_components/AdminThemChiNhanhInputAndImg";
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
import { fetchFeedbacksFailure, fetchBranchSuccess } from "@/app/_lib/features/feedbacks/feedbacksSlice";

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
  images: z.array(z.string()).min(1, { message: "Hình ảnh không được để trống" }),
  slogan_images: z.array(z.string()).min(1, { message: "Hình ảnh slogan không được để trống" }),
  diagram_images: z.array(z.string()).min(1, { message: "Hình ảnh sơ đồ không được để trống" }),
  equipment_images: z.array(z.string()).min(1, { message: "Hình ảnh thiết bị không được để trống" }),
});

function ChiNhanhAddPage() {
  const { isError } = useSelector((store) => store.branch);
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const toast = useCustomToast();

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(branchSchema),
  });

  const [imagesData, setImagesData] = useState({
    images: [],
    slogan_images: [],
    diagram_images: [],
    equipment_images: [],
    space_images: [],
  });

  const onImagesChange = (name, images) => {
    setImagesData((prevData) => ({
      ...prevData,
      [name]: images,
    }));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    // Append images
    imagesData.images.forEach((image) => formData.append("images", image));
    imagesData.slogan_images.forEach((image) => formData.append("slogan_images", image));
    imagesData.diagram_images.forEach((image) => formData.append("diagram_images", image));
    imagesData.equipment_images.forEach((image) => formData.append("equipment_images", image));

    try {
      const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.CREATE, "POST", formData);
      if (response.success) {
        dispatch(fetchBranchSuccess(response.data));
        toast({
          title: "Tạo dữ liệu chi nhánh thành công",
          description: "Phản hồi đã được duyệt. Đang lấy dữ liệu mới",
        });
      } else {
        dispatch(fetchFeedbacksFailure());
        toast({
          title: "Tạo dữ liệu không thành công",
          description: response.message || "Vui lòng thử lại sau",
        });
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({
        title: "Đã xảy ra lỗi",
        description: "Vui lòng thử lại sau",
      });
    }
  };

  const renderSection = (title, fields, imgTitle, inputId, imageName, heightTextarea) => (
    <div className="flex gap-5">
      <AdminThemChiNhanhInput
        fields={fields}
        title={title}
        control={control}
        heightTextarea={heightTextarea}
      />
      <AdminThemChiNhanhImg
        title={imgTitle}
        inputId={inputId}
        onImagesChange={onImagesChange}
        name={imageName}
      />
    </div>
  );

  const renderSectionImg = (imgTitle, inputId, onImagesChange, imageName, control) =>{
    return (
        <AdminThemChiNhanhInput
          title={imgTitle}
          inputId={inputId}
          control={control}
          onImagesChange={onImagesChange}
          name={imageName}
        />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isError && <div className="text-red-500">An error occurred while saving the branch.</div>}
      <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
      <div className="flex gap-2 mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">Chi nhánh / </h1>
        <span className="text-base leading-6 font-normal text-gray-400">Thêm chi nhánh</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-6">
        {renderSection('Thông tin liên hệ', fieldsConfig.contact, 'Hình ảnh carousel', 'image-upload-carousel', 'images')}
        {renderSection('Slogan & Mô tả', fieldsConfig.slogan, 'Hình ảnh mô tả', 'image-upload-description', 'slogan_images', 'h-[80px]')}
        {renderSection('Sơ đồ', fieldsConfig.diagram, 'Hình ảnh sơ đồ', 'image-upload-diagram', 'diagram_images', 'h-[160px]')}
        {renderSection('Trang thiết bị', fieldsConfig.equipment, 'Hình ảnh trang thiết bị', 'image-upload-equipment', 'equipment_images', 'h-[160px]')}
        {renderSection('Không gian hội nghị', fieldsConfig.space, 'Hình ảnh mô tả', 'image-upload-space', 'space_images', 'h-[100px]')}
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

export default ChiNhanhAddPage;
