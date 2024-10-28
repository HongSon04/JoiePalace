  "use client";

  import { useForm } from "react-hook-form";
  import AdminHeader from "@/app/_components/AdminHeader";
  import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
  import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
  import AdminThemChiNhanhInputAndImg from "@/app/_components/AdminThemChiNhanhInputAndImg";
  import IconButton from "@/app/_components/IconButton";
  import IconButtonSave from "@/app/_components/IconButtonSave";
  import { ArrowLeftIcon } from "@heroicons/react/24/outline";
  import { Stack } from "@chakra-ui/react";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { postBranchAPI } from "@/app/_services/branchesServices";

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
    space: [
      { type: 'text', placeholder: 'Tên không gian', name: 'space_name' },
      { type: 'textarea', placeholder: 'Mô tả không gian', name: 'space_description' },
    ],
  };
  const createSlug = (str) => {
    const fromVietnamese = str
      .toLowerCase()
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '');

    return fromVietnamese
      .replace(/[^a-z0-9\s]/g, '')
      .trim() 
      .replace(/\s+/g, '-'); 
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
    space_name: z.string().min(1, { message: "Tên không gian là bắt buộc" }).optional(),
    space_description: z.string().optional(),
  });
  function ChiNhanhAddPage() {
    const { isLoading, isError } = useSelector(
      (store) => store.branch
    );
    const dispatch = useDispatch();
    
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm({
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
        space: [
          {
            name: data.space_name,
            description: data.space_description,
            images: imagesData.space_images,
          },
        ],
      };
      try {
        
        console.log("Form Data: ", formData);
        await dispatch(postBranchAPI(formData));
      } catch (error) {
        console.error("Error submitting form: ", error);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
          {isError && <div className="text-red-500">An error occurred while saving the branch.</div>}
        <AdminHeader showSearchForm={false} title="Chi tiết chi nhánh" />
        <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
          <h1 className="text-base leading-6 font-normal text-gray-400">
            Chi nhánh /
          </h1>
          <span className="text-base leading-6 font-normal text-gray-400">
            Thêm chi nhánh
          </span>
        </Stack>
        <div className="flex flex-col gap-6 w-full mt-6">
          {renderSection(
            'Thông tin liên hệ',
            fieldsConfig.contact,
            'Hình ảnh carousel',
            'image-upload-carousel',
            control,
            onImagesChange,
            'images'
          )}
          {renderSection(
            'Slogan & Mô tả',
            fieldsConfig.slogan,
            'Hình ảnh mô tả',
            'image-upload-description',
            control,
            onImagesChange,
            'slogan_images',
            'h-[80px]'
          )}
          {renderSection(
            'Sơ đồ',
            fieldsConfig.diagram,
            'Hình ảnh sơ đồ',
            'image-upload-diagram',
            control,
            onImagesChange,
            'diagram_images',
            'h-[160px]'
          )}
          {renderSection(
            'Trang thiết bị',
            fieldsConfig.equipment,
            'Hình ảnh trang thiết bị',
            'image-upload-equipment',
            control,
            onImagesChange,
            'equipment_images',
            'h-[160px]'
          )}
          {renderSection(
            'Không gian hội nghị',
            fieldsConfig.space,
            'Hình ảnh mô tả',
            'image-upload-space',
            control,
            onImagesChange,
            'space_images',
            'h-[100px]'
          )}

          <AdminThemChiNhanhInputAndImg
            title="Sảnh"
            height="290px"
            inputId="input-image-upload-map"
            input={false}
          />
        </div>

        <div className="flex w-full mt-6">
          <IconButton className="bg-whiteAlpha-200 text-white" type={'button'}>
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

  const renderSection = (
    title,
    fields,
    imgTitle,
    inputId,
    control,
    onImagesChange,
    imageName,
    heightTextarea
  ) => (
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

  export default ChiNhanhAddPage;