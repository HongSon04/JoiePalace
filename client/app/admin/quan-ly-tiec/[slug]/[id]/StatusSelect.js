"use client";

import CustomSelectWithRing from "@/app/_components/CustomSelectWithRing";

function StatusSelect() {
  const options = [
    { id: 1, value: 1, name: "Dự kiến", border: "border-yellow-500" },
    { id: 2, value: 2, name: "Đang diễn ra", border: "border-green-500" },
    { id: 3, value: 3, name: "Đã kết thúc", border: "border-gray-600" },
    { id: 4, value: 4, name: "Đã hủy", border: "border-red-500" },
    { id: 5, value: 5, name: "Đã hoàn tiền", border: "border-orange-500" },
  ];

  return (
    <CustomSelectWithRing
      value={1}
      options={options}
      selectClassName="w-[200px] mt-1"
    />
  );
}

export default StatusSelect;
