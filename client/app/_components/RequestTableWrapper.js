"use client";

import RequestFilter from "@/app/_components/RequestFilter";
import RequestTable from "@/app/_components/RequestTable";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../_lib/features/requests/requestsSlice";
import { requestStatus } from "../_utils/config";

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
        <h2 className="text-base font-bold text-white min-w-max">
          Danh sách yêu cầu
        </h2>
        <select name="requestStatus" id="requestStatus" className="select">
          {requestStatus.map((status) => (
            <option value={status.key} key={status.key} className="option">
              {status.label}
            </option>
          ))}
        </select>
      </div>
      {/* Table */}
      <RequestTable />
    </div>
  );
}

export default RequestTableWrapper;
