"use client";

import CustomGearSelect from "@/app/_components/CustomGearSelect";

function GearSelect() {
  const options = [
    { id: 1, link: '1', name: "Đánh dấu đã xem tất cả" },
    { id: 2, link: '2', name: "Xóa tất cả thông báo" },
  ];

  return (
    <CustomGearSelect
      options={options}
    />
  );
}

export default GearSelect;
