"use client";

import CustomSelect from "@/app/_components/CustomSelect";

function StatusSelect() {
  const options = [
    { id: 1, value: 1, name: "Phạm Văn Đồng" },
    { id: 2, value: 2, name: "Hoàng Văn Thụ" },
    { id: 3, value: 3, name: "Võ Văn Kiệt" },
  ];

  return (
    <CustomSelect
      value={1}
      options={options}
      selectClassName="w-[200px] mt-1"
    />
  );
}

export default StatusSelect;
