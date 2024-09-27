"use client";

import { requestStatus } from "@/app/_utils/config";

function StatusSelect() {
  return (
    <div className="flex w-full justify-end">
      <select name="statusSelect" id="statusSelect" className="select">
        {requestStatus.map((status) => (
          <option key={status.key} value={status.key} className="option">
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StatusSelect;
