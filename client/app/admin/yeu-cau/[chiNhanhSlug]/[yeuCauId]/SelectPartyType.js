"use client";

import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Select, SelectItem } from "@nextui-org/select";

function SelectPartyType({ partyType, className }) {
  const types = [
    "wedding",
    "birthday",
    "party",
    "meeting",
    "conference",
    "other",
  ];

  return (
    <Select
      className={className}
      classNames={{
        base: "!text-gray-600",
        trigger: "text-sm text-gray-100 !bg-blackAlpha-100",
        value: "text-sm !text-gray-600",
        popoverContent: "bg-white gap-1 !text-gray-600",
        label: "!text-gray-600 font-bold",
      }}
      defaultSelectedKeys={[partyType]}
      label="Loại tiệc"
      labelPlacement="outside"
    >
      {types.map((type) => (
        <SelectItem key={type} value={type}>
          {type}
        </SelectItem>
      ))}
    </Select>
  );
}

export default SelectPartyType;
