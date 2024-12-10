"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestDetail from "./RequestDetail";

function Page({ params: { yeuCauId } }) {
  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      {/* <RequestBreadcrumbs requestId={yeuCauId} /> */}
      <RequestDetail id={yeuCauId} />
    </div>
  );
}

export default Page;
