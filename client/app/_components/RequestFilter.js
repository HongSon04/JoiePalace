"use client";
import CustomSelect from "./CustomSelect";

function RequestFilter({ onChange = () => {}, filter = 1 }) {
  const options = [
    {
      id: 1,
      name: "Chờ xử lý",
      value: 1,
    },
    {
      id: 2,
      name: "Đã xử lý",
      value: 2,
    },
    {
      id: 3,
      name: "Đã hủy",
      value: 3,
    },
  ];

  return (
    <CustomSelect
      onChange={onChange}
      options={options}
      value={filter}
      variant="bordered"
      selectClassName="w-[200px]"
    />
  );
}

export default RequestFilter;
