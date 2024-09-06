import AdminHeader from "@/app/_components/AdminHeader";
import RequestTableWrapper from "@/app/_components/RequestTableWrapper";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

import { Suspense } from "react";

const branch = {
  id: 1,
  name: "Hoàng Văn Thụ",
  address: "123 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP.HCM",
  phone: "0123456789",
  email: "info.hoangvanthu@joiepalace.com",
};

function page({ params }) {
  const { chiNhanhSlug } = params;

  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <Breadcrumb marginTop={20} className="text-gray-400">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/yeu-cau"
          >
            Yêu cầu
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href={`/admin/yeu-cau/${chiNhanhSlug}`}
          >
            {branch.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<TableSkeleton />}>
        <RequestTableWrapper />
      </Suspense>
    </div>
  );
}

export default page;
