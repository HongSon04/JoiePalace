"use client";

import RequestFilter from "@/app/_components/RequestFilter";
import RequestTable from "@/app/_components/RequestTable";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../_lib/features/requests/requestsSlice";

const statusOptions = [
  { value: 1, label: "Chờ xác nhận" },
  { value: 2, label: "Đã xác nhận" },
  { value: 3, label: "Đã hủy" },
];

function RequestTableWrapper() {
  const { filter } = useSelector((store) => store.requests);

  const dispatch = useDispatch();

  // filter requests
  function handleChange(e) {
    dispatch(setFilter(parseInt(e.target.value)));
  }

  return (
    <div>
      {/* Header */}
      <div className="mt-8 flex items-center justify-between w-full">
        <h2 className="text-base font-bold">Danh sách yêu cầu</h2>
        <RequestFilter onChange={handleChange} filter={filter} />
      </div>
      {/* Table */}
      <RequestTable />
    </div>
  );
}

export default RequestTableWrapper;
