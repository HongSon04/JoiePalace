"use client";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";

function RequestStatus({ value }) {
  const status = [
    {
      id: 1,
      name: "Chờ xử lý",
      className: "p-1 text-sm !text-yellow-700 bg-yellow-200 rounded-md",
      value: 1,
    },
    {
      id: 2,
      name: "Đã xử lý",
      className: "p-1 text-sm !text-green-800 bg-green-200 rounded-md",
      value: 2,
    },
    {
      id: 3,
      name: "Đã hủy",
      className: "p-1 text-sm !text-red-800 bg-red-200 rounded-md",
      value: 3,
    },
  ];

  const defaultValue = status.find((item) => item.value === value)?.value;

  return (
    <Select
      classNames={{
        base: "!overflow-hidden !text-white",
        trigger: "text-sm text-gray-100 !bg-white/20",
        value: "text-sm !text-white",
        innerWrapper: "!overflow-hidden",
        popoverContent: "bg-white/20 backdrop-blur-lg gap-1",
      }}
      aria-label="Select status"
      defaultSelectedKeys={defaultValue ? [defaultValue.toString()] : []}
    >
      <SelectSection className="overflow-hidden">
        {status.map((item) => (
          <SelectItem
            textValue={item.name}
            className={`${item.className} mt-1 first:mt-0`}
            key={item.id}
            value={item.value}
          >
            <div className={item.className}>{item.name}</div>
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
}

export default RequestStatus;
