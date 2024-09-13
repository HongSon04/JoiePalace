"use client";

import CustomSelect from "@/app/_components/CustomSelect";

function StatusSelectDay() {
  const options = [
    { id: 1, value: 1, name: "Theo tuần" },
    { id: 2, value: 2, name: "Theo tháng" },
    { id: 3, value: 3, name: "Theo năm" },
  ];

  return (
    <CustomSelect
      value={1}
      options={options}
      selectClassName="w-[200px] mt-1"
    />
  );
}

export default StatusSelectDay;
