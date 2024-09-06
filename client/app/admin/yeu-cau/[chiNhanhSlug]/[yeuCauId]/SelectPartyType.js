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
        base: "!text-white",
        trigger: "text-sm text-gray-100 !bg-white/20",
        value: "text-sm !text-white",
        popoverContent: "bg-white/20 backdrop-blur-lg gap-1 !text-white",
        label: "!text-white font-bold",
      }}
      defaultSelectedKeys={[partyType]}
      label="Loại tiệc"
      labelPlacement="outside"
      startContent={<ListBulletIcon className="w-6 h-6 text-whiteAlpha-300" />}
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
