"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import AdminThemChiNhanhInputAndImg from "@/app/_components/AdminThemChiNhanhInputAndImg";
import IconButton from "@/app/_components/IconButton";
import IconButtonSave from "@/app/_components/IconButtonSave";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const fields = [
  { type: 'text', placeholder: 'Tên chi nhánh' },
  { type: 'text', placeholder: 'Địa chỉ' },
  { type: 'text', placeholder: 'Email' },
  { type: 'text', placeholder: 'Số điện thoại' },
];

const fields2 = [
  { type: 'textarea', placeholder: 'Slogan' },
  { type: 'textarea', placeholder: 'Mô tả' },
];

const fields3 = [
  { type: 'textarea', placeholder: 'Mô tả' },
];

function ChiNhanhChiTietPage() {
  return (
    <div>
    <AdminHeader showSearchForm={false} title={'Chi tiết chi nhánh'} />
    <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5'>
      <Heading as='h1' size='lg'>Chi nhánh / </Heading>
      <Text fontSize='5xl'>Thêm chi nhánh</Text>
    </Stack>
    <div className="flex flex-col gap-[30px] w-full mt-[30px]">
      <div className="flex gap-5 ">
        <AdminThemChiNhanhInput fields={fields} title='Thông tin liên hệ' />
        <AdminThemChiNhanhImg title='Hình ảnh carousel' inputId="image-upload-carousel" />
      </div>
      <div className="flex gap-5 ">
        <AdminThemChiNhanhInput fields={fields2} type={'textarea'} title='Slogan & Mô tả' />
        <AdminThemChiNhanhImg title='Hình ảnh mô tả' inputId="image-upload-description" />
      </div>
      <div className="flex gap-5 ">
        <AdminThemChiNhanhInput fields={fields3} typeADD={'textarea'} placeholderADD='Mô tả' title='Trang thiết bị' />
        <AdminThemChiNhanhImg title='Hình ảnh sơ đồ' inputId="image-upload-map" />
      </div>
      <AdminThemChiNhanhInputAndImg title='Sảnh' height={'290px'} inputId="input-image-upload-map" input={false}/>
      <AdminThemChiNhanhInputAndImg title='Không gian' height={'321px'} inputId="input-image-upload-map-space" 
      input={true}/>
    </div>
    <div className="flex w-full  mt-[30px]">
       <IconButton  className="bg-whiteAlpha-400 ">
        <ArrowLeftIcon width={20} height={20} />
      </IconButton>
      <div className="ml-auto flex flex-shrink-0 gap-4">
        <IconButtonSave title={'Hủy'} color={'bg-red-400'}></IconButtonSave>
        <IconButtonSave title={'Lưu'} color={'bg-teal-400'}></IconButtonSave>
      </div>
    </div>

  </div>
  );
}

export default ChiNhanhChiTietPage;
