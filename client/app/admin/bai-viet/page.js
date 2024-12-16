"use client";
import AdminHeader from "@/app/_components/AdminHeader";
import React from "react";
import BlogBreadCrumbs from "./BlogBreadCrumbs";
import BlogsTabs from "./BlogsTabs";

const Blogs = () => {
  return (
    <div className="relative">
      <AdminHeader title="Bài viết" />
      <BlogBreadCrumbs />
      <BlogsTabs />
    </div>
  );
};

export default Blogs;
