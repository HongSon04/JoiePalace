import useApiServices from "@/app/_hooks/useApiServices";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useSelector } from "react-redux";

function PageBreadcrumbs({ branchSlug }) {
  const { fetchData } = useApiServices();

  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink className="text-gray-400 hover:text-gray-200" href="#">
          Yêu cầu
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/yeu-cau/${branchSlug}`}
        >
          {currentBranch && currentBranch.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export default PageBreadcrumbs;
