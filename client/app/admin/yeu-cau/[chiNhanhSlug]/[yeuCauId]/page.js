"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestBreadcrumbs from "./RequestBreadcrumbs";
import StatusSelect from "./StatusSelect";
import RequestDetail from "./RequestDetail";
import { useParams } from "next/navigation";

function page({ params: { yeuCauId } }) {
  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <RequestBreadcrumbs requestId={yeuCauId} />
      <StatusSelect />
      <RequestDetail />
    </div>
  );
}

export default page;
