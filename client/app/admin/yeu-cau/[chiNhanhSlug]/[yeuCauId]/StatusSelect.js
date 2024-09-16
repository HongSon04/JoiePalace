"use client";

import CustomSelect from "@/app/_components/CustomSelect";
import { requestStatus } from "@/app/_utils/config";

function StatusSelect() {
  return (
    <CustomSelect
      value={1}
      options={requestStatus}
      triggerClassName="!bg-white"
      selectClassName="w-[200px] mt-8"
    />
  );
}

export default StatusSelect;
