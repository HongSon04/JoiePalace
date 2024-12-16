import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function BlogBreadCrumbs() {
  return (
    <div>
      <Breadcrumb className="text-gray-400 mt-5">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/phan-hoi-danh-gia"
          >
            Bài viết /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export default BlogBreadCrumbs;
