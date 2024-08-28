"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import AdminThemChiNhanhImg from "@/app/_components/AdminThemChiNhanhImg";
import AdminThemChiNhanhInput from "@/app/_components/AdminThemChiNhanhInput";
import { Heading, Stack, Text } from "@chakra-ui/react";

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
        <Text fontSize='5xl'>Chi tiết chi nhánh</Text>
      </Stack>
      <div className="flex gap-5 w-full mt-[30px]">
          <AdminThemChiNhanhInput fields={fields} title='Thông tin liên hệ'/>
          <AdminThemChiNhanhImg title='Hình ảnh carousel' inputId="image-upload-carousel"></AdminThemChiNhanhImg>
      </div>
      <div className="flex gap-5 w-full mt-[30px]">
          <AdminThemChiNhanhInput fields={fields2} type={'textarea'} title='Slogan & Mô tả'/>
          <AdminThemChiNhanhImg title='Hình ảnh mô tả' inputId="image-upload-description"></AdminThemChiNhanhImg>
      </div>
      <div className="flex gap-5 w-full mt-[30px]">
          <AdminThemChiNhanhInput fields={fields3} typeADD={'textarea'} placeholderADD='Mô tả' title='Trang thiết bị'/>
          <AdminThemChiNhanhImg title='Hình ảnh sơ đồ' inputId="image-upload-map"></AdminThemChiNhanhImg>
      </div>
    </div>
  );
}

export default ChiNhanhChiTietPage;
