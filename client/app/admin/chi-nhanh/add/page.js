"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import AdminThemChiNhanhInputAndImg from "@/app/_components/AdminThemChiNhanhInputAndImg";
import IconButton from "@/app/_components/IconButton";
import IconButtonSave from "@/app/_components/IconButtonSave";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {Stack } from "@chakra-ui/react";

const fieldsConfig = {
  contact: [
    { type: 'text', placeholder: 'Tên chi nhánh', name: 'branchName' },
    { type: 'text', placeholder: 'Địa chỉ', name: 'address' },
    { type: 'text', placeholder: 'Email', name: 'email' },
    { type: 'text', placeholder: 'Số điện thoại', name: 'phone' },
  ],
  slogan: [
    { type: 'textarea', placeholder: 'Slogan', name: 'slogan' },
    { type: 'textarea', placeholder: 'Mô tả', name: 'description' },
  ],
  equipment: [{ type: 'textarea', placeholder: 'Mô tả', name: 'equipmentDescription' }],
  space: [
    { type: 'text', placeholder: 'Tên không gian', name: 'spaceName' },
    { type: 'textarea', placeholder: 'Mô tả', name: 'spaceDescription' },
  ],
};

function ChiNhanhAddPage() {
  return (
<div>
      <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
      <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">Chi nhánh / </h1>
        <span className="text-base leading-6 font-normal text-gray-400">Thêm chi nhánh</span>
      </Stack>
      <div className="flex flex-col gap-6 w-full mt-6">
        {renderSection('Thông tin liên hệ', fieldsConfig.contact, 'Hình ảnh carousel', "image-upload-carousel")}
        {renderSection('Slogan & Mô tả', fieldsConfig.slogan, 'Hình ảnh mô tả', "image-upload-description", 'h-[80px]')}
        {renderSection('Trang thiết bị', fieldsConfig.equipment, 'Hình ảnh sơ đồ', "image-upload-map", 'h-[160px]')}
        {renderSection('Không gian hội nghị', fieldsConfig.space, 'Hình ảnh mô tả', "image-upload-space", 'h-[100px]')}
        
        <AdminThemChiNhanhInputAndImg title="Sảnh" height="290px" inputId="input-image-upload-map" input={false} />
        <AdminThemChiNhanhInputAndImg title="Không gian" height="321px" inputId="input-image-upload-map-space" input={true} />
      </div>

      <div className="flex w-full mt-6">
        <IconButton className="bg-blackAlpha-400">
          <ArrowLeftIcon width={20} height={20} color="black" />
        </IconButton>
        <div className="ml-auto flex space-x-4">
          <IconButtonSave title="Hủy" color="bg-red-400" />
          <IconButtonSave title="Lưu" color="bg-teal-400" />
        </div>
      </div>
    </div>
  );
}

const renderSection = (title, fields, imgTitle, inputId, heightTextarea) => (
  <div className="flex gap-5">
    <AdminThemChiNhanhInput fields={fields} title={title} heightTextarea={heightTextarea} />
    <AdminThemChiNhanhImg title={imgTitle} inputId={inputId} />
  </div>
);

export default ChiNhanhAddPage;
