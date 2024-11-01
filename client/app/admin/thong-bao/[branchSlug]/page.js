// import custom components
import AdminHeader from "@/app/_components/AdminHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import NotificationTabs from "./NotificationTabs";

function Page({ params: { branchSlug } }) {
  return (
    <div>
      <AdminHeader title={"Thông báo"} showSearchForm={false} />
      <Breadcrumb className="text-gray-400 mt-5">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href={`/admin/thong-bao/${branchSlug}`}
          >
            Thông báo /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <NotificationTabs branchSlug={branchSlug} />
    </div>
  );
}

export default Page;
