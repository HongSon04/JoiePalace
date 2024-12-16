"use client";
import { API_CONFIG } from "@/app/_utils/api.config";
import { useRouter } from "next/navigation";

const Blogs = () => {
  const router = useRouter();

  router.push(API_CONFIG.PATHS.COMING_SOON);

  return (
    <div className="relative">
      {/* <AdminHeader title="Bài viết" />
      <BlogBreadCrumbs />
      <BlogsTabs /> */}
    </div>
  );
};

export default Blogs;
