"use client";

import CustomSelect from "@/app/_components/CustomSelect";

function StatusSelect() {
  const options = [
    { id: 1, value: 1, name: "Đã xác nhận/Thành công" },
    { id: 2, value: 2, name: "Đã xác nhận/Thất bại" },
    { id: 3, value: 3, name: "Chưa xử lý" },
  ];

  return (
    <CustomSelect
      value={1}
      options={options}
      selectClassName="w-[300px] mt-8"
    />
  );
}

export default StatusSelect;
