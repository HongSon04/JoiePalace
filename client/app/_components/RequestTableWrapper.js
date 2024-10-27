"use client";

import RequestTable from "@/app/_components/RequestTable";

function RequestTableWrapper() {
  return (
    <div>
      {/* Header */}
      {/* <div className="mt-8 flex items-center justify-between w-full">
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
      </div> */}
      {/* Table */}
      <RequestTable />
    </div>
  );
}

export default RequestTableWrapper;
