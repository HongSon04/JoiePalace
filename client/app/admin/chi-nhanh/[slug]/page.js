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
import { useDispatch } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import { useParams } from "next/navigation";
import { error } from "@/app/_lib/features/branch/branchSlice";

const defaultValues = {
  name: '',
  address: '',
  email: '',
  phone: '',
  slogan: '',
  slogan_description: '',
  diagram_description: '',
  equipment_description: '',
  space_name: '',
  space_description: ''
};

const createSlug = (str) => {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
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
  space_name: z.string().min(1, { message: "Tên không gian là bắt buộc" }).optional(),
  space_description: z.string().optional(),
});

function ChiNhanhAddPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues,
  });

  const [imagesData, setImagesData] = useState({
    images: [],
    slogan_images: [],
    diagram_images: [],
    equipment_images: [],
    space_images: [],
  });

  const fetchBranchData = useCallback(async (branchSlug) => {
    try {
      const response = await fetchBranchBySlug(branchSlug);
      const branchData = response[0];
      reset(branchData);
      setImagesData({
        images: Array.isArray(branchData.images) ? branchData.images : (branchData.images ? branchData.images.split(',') : []),
        slogan_images: Array.isArray(branchData.slogan_images) ? branchData.slogan_images : (branchData.slogan_images ? branchData.slogan_images.split(',') : []),
        diagram_images: Array.isArray(branchData.diagram_images) ? branchData.diagram_images : (branchData.diagram_images ? branchData.diagram_images.split(',') : []),
        equipment_images: Array.isArray(branchData.equipment_images) ? branchData.equipment_images : (branchData.equipment_images ? branchData.equipment_images.split(',') : []),
        space_images: Array.isArray(branchData.space_images) ? branchData.space_images : (branchData.space_images ? branchData.space_images.split(',') : []),
      });
    } catch (error) {
      console.error("Error fetching branch data: ", error);
    }
  }, [reset, slug]);

  useEffect(() => {
    fetchBranchData(slug);
  }, [fetchBranchData, slug]);

  const onImagesChange = (name, images) => {
    setImagesData(prevData => ({
      ...prevData,
      [name]: images,
    }));
  };

  const onSubmit = (data) => {
    const formData = {
      data: {
        name: data.name,
        slug: createSlug(data.name),
        address: data.address,
        phone: data.phone,
        email: data.email,
        rate: 5,
        images: imagesData.images,
      },
      location_detail: {
        slogan: data.slogan,
        slogan_description: data.slogan_description,
        slogan_images: imagesData.slogan_images,
        diagram_description: data.diagram_description,
        diagram_images: imagesData.diagram_images,
        equipment_description: data.equipment_description,
        equipment_images: imagesData.equipment_images,
      },
      space: [{
        name: data.space_name,
        description: data.space_description,
        images: imagesData.space_images,
      }],
    };
    console.log("Form Data: ", formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
      <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
        <h1 className="text-base leading-6 font-normal text-gray-400">Chi nhánh / {slug}</h1>
      </Stack>
      <div className="flex flex-col gap-6 w-full mt-6">
        {/* Thông tin liên hệ */}
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Thông tin liên hệ"
            control={control}
            fields={[
              { type: 'text', placeholder: 'Tên chi nhánh', name: 'name' },
              { type: 'text', placeholder: 'Địa chỉ', name: 'address' },
              { type: 'text', placeholder: 'Email', name: 'email' },
              { type: 'text', placeholder: 'Số điện thoại', name: 'phone' },
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

        {/* Slogan & Mô tả */}
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Slogan & Mô tả"
            control={control}
            fields={[
              { type: 'textarea', placeholder: 'Slogan', name: 'slogan' },
              { type: 'textarea', placeholder: 'Mô tả slogan', name: 'slogan_description' },
            ]}
            heightTextarea={'h-[80px]'}
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

        {/* Sơ đồ */}
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Sơ đồ"
            control={control}
            fields={[
              { type: 'textarea', placeholder: 'Mô tả sơ đồ', name: 'diagram_description' },
            ]}
            heightTextarea={'h-[160px]'}
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

        {/* Trang thiết bị */}
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Trang thiết bị"
            control={control}
            fields={[
              { type: 'textarea', placeholder: 'Mô tả trang thiết bị', name: 'equipment_description' },
            ]}
            heightTextarea={'h-[160px]'}
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

        {/* Không gian hội nghị */}
        <div className="flex gap-5">
          <AdminThemChiNhanhInput
            title="Không gian hội nghị"
            control={control}
            fields={[
              { type: 'text', placeholder: 'Tên không gian', name: 'space_name' },
              { type: 'textarea', placeholder: 'Mô tả không gian', name: 'space_description' },
            ]}
            heightTextarea={'h-[140px]'}
            errors={errors}
          />
          <AdminThemChiNhanhImg
            title="Hình ảnh mô tả"
            inputId="input-image-upload-space"
            onImagesChange={onImagesChange}
            name="space_images"
            initialImages={imagesData.space_images}
          />
        </div>
      </div>

      {/* Nút bấm */}
      <div className="flex w-full mt-6">
        <IconButton className="bg-whiteAlpha-200 text-white" type='button'>
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
