"use client";
import { requestStatus } from "../_utils/config";
import CustomSelect from "./CustomSelect";

function RequestFilter({ onChange = () => {}, filter = 1 }) {
  return (
    <CustomSelect
      onChange={onChange}
      options={requestStatus}
      value={filter}
      variant="bordered"
      selectClassName="w-[200px]"
      triggerClassName="!bg-white"
    />
  );
}

export default RequestFilter;
